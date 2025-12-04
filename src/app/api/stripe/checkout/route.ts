// src/app/api/stripe/checkout/route.ts
// @ts-nocheck

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Stripe checkout: no user / auth error", userError);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Récupérer (éventuellement) le profil existant
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.warn(
        "Stripe checkout: no existing profile, will create one",
        profileError
      );
    }

    let customerId = profile?.stripe_customer_id as string | null;

    // Créer le customer Stripe si besoin
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });

      customerId = customer.id;

      await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            first_name: profile?.first_name ?? null,
            last_name: profile?.last_name ?? null,
            plan: profile?.plan ?? "free",
            stripe_customer_id: customerId,
          },
          { onConflict: "id" }
        );
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_PRO as string,
          quantity: 1,
        },
      ],
      success_url: `${origin}/dashboard/account?checkout=success`,
      cancel_url: `${origin}/dashboard/account?checkout=cancelled`,
      allow_promotion_codes: true,
      metadata: {
        user_id: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
