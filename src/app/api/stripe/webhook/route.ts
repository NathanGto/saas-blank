// src/app/api/stripe/webhook/route.ts
// @ts-nocheck

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // important pour Buffer & Stripe

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Client admin Supabase (service_role)
function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables."
    );
    throw new Error("Supabase admin client not configured");
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  const buf = Buffer.from(await req.arrayBuffer());
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const customerId = session.customer as string | null;
        const userId = (session.metadata?.user_id as string) || null;

        if (userId && customerId) {
          const { error } = await supabaseAdmin
            .from("profiles")
            .upsert(
              {
                id: userId,
                plan: "pro",
                stripe_customer_id: customerId,
              },
              { onConflict: "id" }
            );

          if (error) {
            console.error("Error upserting profile on checkout:", error);
          }
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const isActive =
          subscription.status === "active" ||
          subscription.status === "trialing";

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({ plan: isActive ? "pro" : "free" })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error("Error updating profile on subscription event:", error);
        }
        break;
      }

      default:
        // on ignore les autres events
        break;
    }

    return new NextResponse("ok", { status: 200 });
  } catch (err) {
    console.error("Error handling Stripe webhook:", err);
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
