"use client";

import type React from "react";
import { CartProvider } from "@/hooks/use-cart";
import { Toaster } from "sonner";
// import Footer from "@/components/footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {children}
      {/* <Footer /> */}
      <Toaster position="top-center" richColors closeButton />
    </CartProvider>
  );
}
