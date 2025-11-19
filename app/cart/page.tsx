"use client";

import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { ShoppingCart } from "@/components/shopping-cart";
import Checkout from "@/components/checkout";
import { Book } from "@/lib/books";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<Book[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem("bookstore-cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart:", e);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem("bookstore-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const handleRemove = (bookId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== bookId));
  };

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setShowCheckout(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {!showCheckout ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {cartItems.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Books in Cart ({cartItems.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cartItems.map((book) => (
                        <div
                          key={book.id}
                          className="flex items-start justify-between p-4 border border-border rounded-lg"
                        >
                          <div className="flex-1">
                            <h3 className="font-semibold">{book.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {book.author}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {book.category} • {book.book_type}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold">
                              ${(book.price_cents / 100).toFixed(2)}
                            </p>
                            <button
                              onClick={() => handleRemove(book.id)}
                              className="text-xs text-destructive hover:underline mt-2"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      Your cart is empty. Start shopping!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1">
              <ShoppingCart
                items={cartItems}
                onRemove={handleRemove}
                onCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="pt-6">
                  <Checkout bookIds={cartItems.map((item) => item.id)} />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-1">
              <ShoppingCart
                items={cartItems}
                onRemove={handleRemove}
                onCheckout={handleCheckout}
                isCheckingOut={isCheckingOut}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
