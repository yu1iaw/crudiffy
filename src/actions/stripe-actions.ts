"use server"

import { getKindeUserInfo } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import Stripe from 'stripe';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-02-24.acacia",
})

export const createCheckoutSession = async () => {
    const userData = await getKindeUserInfo();
    if (!userData?.isAuthenticated) redirect('/api/auth/login');

    const session = await stripe.checkout.sessions.create({
        customer_email: userData.user.email ?? 'anon@github.com',
        client_reference_id: userData.user.id,
        line_items: [
            {
                price: "price_1QxnWGDGZc6mTzR4zLGvVKNc",
                quantity: 1
            }
        ],
        mode: "payment",
        success_url: `${process.env.KINDE_SITE_URL}/app/dashboard`,
        cancel_url: `${process.env.KINDE_SITE_URL}`
    })

    redirect(session.url!);
}