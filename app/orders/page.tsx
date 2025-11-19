"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Image from "next/image";
import { getUserOrders, Order } from "@/lib/orders";

// interface OrderItem {
//   id: string;
//   book_id: string;
//   price_cents: number;
//   books: {
//     title: string;
//     author: string;
//     category: string;
//     cover_image_url: string;
//   };
// }

// interface Order {
//   id: string;
//   total_amount_cents: number;
//   status: "pending" | "completed" | "failed";
//   created_at: string;
//   order_items: OrderItem[];
// }

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

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      // const { data, error } = await supabase
      //   .from("orders")
      //   .select(
      //     `*,
      //      order_items(
      //        id,
      //        book_id,
      //        price_cents,
      //        books(title, author, category, cover_image_url)
      //      )`
      //   )
      //   .eq("user_id", user.id)
      //   .order("created_at", { ascending: false });
      // if (!error && data) {
      //   setOrders(data);
      // }

      const ordersData = await getUserOrders();
      setOrders(ordersData);
      setIsLoading(false);
    };

    loadOrders();
  }, [router]);

  // Prepare chart data
  const getOrderTrendData = () => {
    const data: { [key: string]: number } = {};

    orders.forEach((order) => {
      const date = new Date(order.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      data[date] = (data[date] || 0) + order.total_amount_cents / 100;
    });

    return Object.entries(data)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .map(([date, amount]) => ({
        date,
        amount: parseFloat(amount.toFixed(2)),
      }));
  };

  const getCategoryBreakdown = () => {
    const categories: { [key: string]: number } = {};

    orders.forEach((order) => {
      order.order_items?.forEach((item) => {
        const category = item.books.category;
        categories[category] =
          (categories[category] || 0) + item.price_cents / 100;
      });
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));
  };

  const getStatusBreakdown = () => {
    const statusCounts = {
      completed: 0,
      pending: 0,
      failed: 0,
    };

    orders.forEach((order) => {
      statusCounts[order.status]++;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  };

  const getRecentBooksData = () => {
    const books: { [key: string]: number } = {};
    const bookDetails: { [key: string]: any } = {};

    orders.forEach((order) => {
      order.order_items?.forEach((item) => {
        const title = item.books.title;
        books[title] = (books[title] || 0) + item.price_cents / 100;
        bookDetails[title] = item.books;
      });
    });

    return Object.entries(books)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([title, spent]) => ({
        title: title.length > 20 ? title.substring(0, 20) + "..." : title,
        spent: parseFloat(spent.toFixed(2)),
      }));
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

  const orderTrendData = getOrderTrendData();
  const categoryBreakdown = getCategoryBreakdown();
  const statusBreakdown = getStatusBreakdown();
  const recentBooksData = getRecentBooksData();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-2">Order History</h1>
        <p className="text-muted-foreground mb-8">
          Track your purchases and view detailed transaction information
        </p>

        {/* Analytics Charts */}
        {orders.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Spending Trend */}
            {orderTrendData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Spending Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={orderTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" style={{ fontSize: "12px" }} />
                      <YAxis style={{ fontSize: "12px" }} />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        name="Amount Spent"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Category Breakdown */}
            {categoryBreakdown.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Spending by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryBreakdown}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                      >
                        {categoryBreakdown.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CHART_COLORS[index % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={statusBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" style={{ fontSize: "12px" }} />
                    <YAxis style={{ fontSize: "12px" }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Books */}
            {recentBooksData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Top Purchases</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={recentBooksData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" style={{ fontSize: "12px" }} />
                      <YAxis
                        dataKey="title"
                        type="category"
                        width={190}
                        style={{ fontSize: "11px" }}
                      />
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Bar
                        dataKey="spent"
                        fill="hsl(var(--primary))"
                        name="Amount Spent"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Orders List */}
        <Card>
          <CardHeader>
            <CardTitle>All Orders ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No orders yet. Start exploring our catalog!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 border border-border rounded-lg space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Order ID: {order.id}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold">
                            ${(order.total_amount_cents / 100).toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.order_items?.length || 0} item
                            {(order.order_items?.length || 0) !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {order.order_items && order.order_items.length > 0 && (
                      <div className="border-t border-border pt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {order.order_items.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col items-center text-center"
                            >
                              {item.books.cover_image_url && (
                                <div className="relative w-20 h-28 bg-muted rounded overflow-hidden mb-2">
                                  <Image
                                    src={
                                      item.books.cover_image_url ||
                                      "/placeholder.svg" ||
                                      "/placeholder.svg"
                                    }
                                    alt={item.books.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <p className="font-semibold text-sm line-clamp-2">
                                {item.books.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {item.books.author}
                              </p>
                              <p className="text-xs text-muted-foreground mb-2">
                                {item.books.category}
                              </p>
                              <p className="text-sm font-bold">
                                ${(item.price_cents / 100).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
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
