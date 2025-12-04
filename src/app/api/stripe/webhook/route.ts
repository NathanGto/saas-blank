import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Client Stripe (OK au niveau global, il gère juste les env Stripe)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Petite fonction utilitaire pour créer le client admin Supabase
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables."
    );
    throw new Error("Supabase admin client not configured");
  }

  return createClient<Database>(url, serviceKey, {
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

  // On crée le client admin *ici*, pas au top-level
  const supabaseAdmin = getSupabaseAdmin();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const subscriptionId = session.subscription as string | null;
        const customerId = session.customer as string | null;
        const userId = session.metadata?.user_id; // à adapter à ton metadata

        if (userId && customerId) {
          const { error } = await supabaseAdmin
            .from("profiles")
            .update({
              plan: "pro",
              stripe_customer_id: customerId,
            })
            .eq("id", userId);

          if (error) {
            console.error("Error updating profile on checkout:", error);
          }
        }
        break;
      }

      case "customer.subscription.deleted":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Exemple assez simple : si la sub est annulée, repasse en free
        const isActive =
          subscription.status === "active" ||
          subscription.status === "trialing";

        const { error } = await supabaseAdmin
          .from("profiles")
          .update({
            plan: isActive ? "pro" : "free",
          })
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
  } catch (err: any) {
    console.error("Error handling Stripe webhook:", err);
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
