// src/app/api/stripe/portal/route.ts
// @ts-nocheck

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient(); // ⬅️ ICI

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      console.error("No Stripe customer for portal", profileError);
      return new NextResponse("No Stripe customer", { status: 400 });
    }

    const origin =
      process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${origin}/dashboard/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("Stripe portal error", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
