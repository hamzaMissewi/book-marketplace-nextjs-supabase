"use server";

import { stripe } from "@/lib/stripe";
import { getBookById } from "@/lib/books";
import { createSupabaseClient } from "@/lib/supabase/server";

export async function startCheckoutSession(bookIds: string[]) {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Fetch all books and validate they exist
  const books = await Promise.all(
    bookIds.map(async (id) => {
      const book = await getBookById(id);
      if (!book) {
        throw new Error(`Book with id "${id}" not found`);
      }
      return book;
    })
  );

  // Create line items from books
  const line_items = books.map((book) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: book.title,
        description: `${book.author} - ${book.category}`,
      },
      unit_amount: book.price_cents,
    },
    quantity: 1,
  }));

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items,
    mode: "payment",
    customer_email: user.email,
    metadata: {
      user_id: user.id,
      book_ids: bookIds.join(","),
    },
  });

  // Save order to database with pending status
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      stripe_session_id: session.id,
      total_amount_cents: books.reduce(
        (sum, book) => sum + book.price_cents,
        0
      ),
      status: "pending",
    })
    .select("id")
    .single();

  if (orderError) {
    console.error("Error creating order:", orderError);
    throw new Error("Failed to create order");
  }

  // Save order items
  const orderItems = books.map((book) => ({
    order_id: order.id,
    book_id: book.id,
    price_cents: book.price_cents,
    quantity: 1,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Error creating order items:", itemsError);
    throw new Error("Failed to add items to order");
  }

  return session.client_secret;
}

export async function retrieveCheckoutStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (session.payment_status === "paid") {
    const supabase = await createSupabaseClient();

    // Update order status to completed
    const { error } = await supabase
      .from("orders")
      .update({
        status: "completed",
        stripe_payment_intent_id: session.payment_intent as string,
      })
      .eq("stripe_session_id", sessionId);

    if (error) {
      console.error("Error updating order:", error);
    }
  }

  return {
    status: session.payment_status,
    customer_email: session.customer_email,
  };
}
