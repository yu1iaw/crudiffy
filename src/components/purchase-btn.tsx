"use client"

import { createCheckoutSession } from "@/actions/stripe-actions";
import { startTransition } from "react";
import { Button } from "./ui/button";

export const PurchaseBtn = () => {
    return (
        <Button
            size='lg'
            onClick={() => {
                startTransition(async () => await createCheckoutSession())
            }}
        >
            Purchase
        </Button>
    )
}