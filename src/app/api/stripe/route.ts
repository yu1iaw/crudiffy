import { redis } from "@/lib/redis";
import Stripe from "stripe";


export async function POST(request: Request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: "2025-02-24.acacia",
    })
    
    const body = await request.text();
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            request.headers.get("stripe-signature")!,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error) {
        console.log(error);
        return Response.json({ received: false }, { status: 400 });
    }


    switch (event.type) {
        case "checkout.session.completed":
            await redis.sadd('membership', event.data.object.client_reference_id!);
            break;
        default: 
            console.log(`Unhandled event type ${event.type}`);
    }

    return Response.json({ received: true }, { status: 200 });
}