"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface OrderItem {
  id: string;
  price_cents: number;
  books: {
    title: string;
    author: string;
    cover_image_url: string;
  };
}

interface Order {
  id: string;
  total_amount_cents: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
  order_items: OrderItem[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500/10 text-green-700";
    case "pending":
      return "bg-yellow-500/10 text-yellow-700";
    case "failed":
      return "bg-red-500/10 text-red-700";
    default:
      return "bg-gray-500/10 text-gray-700";
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select(
          `*,
           order_items(
             id,
             price_cents,
             books(title, author, cover_image_url)
           )`
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
      setIsLoading(false);
    };

    loadOrders();
  }, [router]);

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
        <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-3xl font-bold mt-2">{orders.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-3xl font-bold mt-2">
                {orders.filter((o) => o.status === "completed").length}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Spent</p>
              <p className="text-3xl font-bold mt-2">
                $
                {(
                  orders.reduce((sum, o) => sum + o.total_amount_cents, 0) / 100
                ).toFixed(2)}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No orders yet. Start exploring our catalog!
                </p>
                <Link href="/browse">
                  <Button>Browse Books</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 border border-border rounded-lg space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Order ID: {order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          ${(order.total_amount_cents / 100).toFixed(2)}
                        </p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {order.order_items && order.order_items.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-border">
                        {order.order_items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3"
                          >
                            {item.books.cover_image_url && (
                              <div className="relative w-10 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.books.cover_image_url || "/placeholder.svg"}
                                  alt={item.books.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {item.books.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.books.author}
                              </p>
                            </div>
                            <p className="text-sm font-semibold flex-shrink-0">
                              ${(item.price_cents / 100).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
