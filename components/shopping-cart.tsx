"use client";

import { useState } from "react";
import { Book } from "@/lib/books";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';
import Link from "next/link";

interface ShoppingCartProps {
  items: Book[];
  onRemove: (bookId: string) => void;
  onCheckout: () => void;
  isCheckingOut: boolean;
}

export function ShoppingCart({
  items,
  onRemove,
  onCheckout,
  isCheckingOut,
}: ShoppingCartProps) {
  const total = items.reduce((sum, book) => sum + book.price_cents, 0);
  const totalDisplay = (total / 100).toFixed(2);

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Your cart is empty
          </p>
          <Link href="/browse" className="block mt-4">
            <Button className="w-full">Continue Shopping</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {items.map((book) => (
            <div key={book.id} className="flex items-start justify-between p-3 bg-muted rounded">
              <div className="flex-1">
                <p className="font-medium text-sm">{book.title}</p>
                <p className="text-xs text-muted-foreground">{book.author}</p>
                <p className="text-sm font-semibold mt-1">
                  ${(book.price_cents / 100).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => onRemove(book.id)}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold">Total:</span>
            <span className="text-2xl font-bold">${totalDisplay}</span>
          </div>
          <Button
            onClick={onCheckout}
            disabled={isCheckingOut || items.length === 0}
            className="w-full"
            size="lg"
          >
            {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
