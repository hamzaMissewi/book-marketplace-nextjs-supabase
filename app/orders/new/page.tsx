import { getUserOrders } from "@/lib/orders";
// import { formatCurrency } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const orders = await getUserOrders();

  // If not authenticated, redirect to login
  if (!orders) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            You haven't placed any orders yet.
          </p>
          <Link
            href="/browse"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              <div className="bg-muted/50 p-4 flex justify-between items-center border-b">
                <div>
                  <p className="font-medium">
                    Order #{order.id.split("-")[0].toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    {formatCurrency(order.total_amount_cents / 100)}
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="divide-y">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="p-4 flex items-start gap-4">
                    <div className="w-16 h-20 bg-muted rounded-md overflow-hidden">
                      {item.books?.cover_image_url ? (
                        <img
                          src={item.books.cover_image_url}
                          alt={item.books.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-muted-foreground/10">
                          <BookOpen className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.books?.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.books?.author}
                      </p>
                      <div className="mt-1 text-sm">
                        {formatCurrency(item.price_cents / 100)} ×{" "}
                        {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Add this to your utils.ts if not already present
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
