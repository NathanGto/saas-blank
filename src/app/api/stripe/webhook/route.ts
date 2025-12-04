import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// client service_role pour mettre à jour les profils
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature error", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string | null;
        if (!customerId) break;

        const customer = await stripe.customers.retrieve(customerId);
        const supabaseUserId = (customer as any).metadata?.supabase_user_id;

        if (supabaseUserId) {
          await supabaseAdmin
            .from("profiles")
            .update({
              plan: "pro",
              stripe_subscription_status: "active",
              stripe_customer_id: customerId,
            })
            .eq("id", supabaseUserId);
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const customer = await stripe.customers.retrieve(customerId);
        const supabaseUserId = (customer as any).metadata?.supabase_user_id;

        if (supabaseUserId) {
          const status = subscription.status; // active, canceled, past_due, etc.
          await supabaseAdmin
            .from("profiles")
            .update({
              plan: status === "active" ? "pro" : "free",
              stripe_subscription_status: status,
            })
            .eq("id", supabaseUserId);
        }
        break;
      }

      default:
        // ignore
        break;
    }

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("Webhook handler error", err);
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
