"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function HomePage() {
  useEffect(() => {
    const checkAuth = async () => {
      // const response = await fetch("/api/check-auth");
      // const { isAuthenticated } = await response.json();
      // if (!isAuthenticated) {
      const response = await fetch("/api/auth/check");
      const { session } = await response.json();
      if (!session) {
        toast.warning("Not Authenticated !");
        window.location.href = "/auth/login";
        // router.push("/auth/login");
      }
    };
    checkAuth();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="py-20 text-center">
          <h1 className="text-5xl font-bold mb-6">Your Gateway to Knowledge</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse and purchase books on cutting-edge technology topics
            including development, machine learning, cloud computing, AI, and
            business strategies.
          </p>
          <Link href="/browse">
            <Button size="lg">Start Exploring</Button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
          <div className="text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Curated Collection</h3>
            <p className="text-muted-foreground">
              Handpicked books from expert authors in tech and business
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Easy Search & Filter</h3>
            <p className="text-muted-foreground">
              Find books by category, type, and search terms instantly
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Secure Checkout</h3>
            <p className="text-muted-foreground">
              Powered by Stripe for safe and secure transactions
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
