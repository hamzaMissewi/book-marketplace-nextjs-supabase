"use client";

import { useCallback, useState, useEffect } from "react";
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { startCheckoutSession } from "@/app/actions/stripe";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CheckoutProps {
  bookIds: string[];
}

export default function Checkout({ bookIds }: CheckoutProps) {
  // const fetchClientSecret = useCallback(
  //   async () => await startCheckoutSession(bookIds),
  //   [bookIds]
  // );

  const fetchClientSecret = useCallback(async () => {
    const result = await startCheckoutSession(bookIds);
    if (!result) {
      throw new Error("Failed to create checkout session");
    }
    return result;
  }, [bookIds]);

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{ fetchClientSecret: fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
