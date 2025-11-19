"use server";
import { createSupabaseClient } from "@/lib/supabase/server";

export interface OrderItem {
  id: string;
  order_id: string;
  book_id: string;
  price_cents: number;
  quantity: number;
  created_at: string;
  books: {
    id: string;
    title: string;
    author: string;
    category: string;
    cover_image_url: string;
  };
}

export interface Order {
  id: string;
  user_id: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  total_amount_cents: number;
  status: "pending" | "completed" | "failed";
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export async function getUserOrders(): Promise<Order[]> {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select(
      `*,
       order_items(
         id,
         order_id,
         book_id,
         price_cents,
         quantity,
         created_at,
         books(id, title, author, cover_image_url)
       )`
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return [];
  }

  return data || [];
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(
      `*,
       order_items(
         id,
         order_id,
         book_id,
         price_cents,
         quantity,
         created_at,
         books(id, title, author, cover_image_url)
       )`
    )
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching order:", error);
    return null;
  }

  return data;
}
