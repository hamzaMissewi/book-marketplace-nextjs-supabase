import { createSupabaseClient } from "@/lib/supabase/server";

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  price_cents: number;
  book_type: string;
  cover_image_url: string;
  created_at: string;
}

export type Category =
  | "Development"
  | "Machine Learning"
  | "Cloud Computing"
  | "AI"
  | "AI Agents"
  | "Business";
export type BookType = "Hardcover" | "Paperback" | "E-book";

export async function getBooks(
  category?: Category,
  searchTerm?: string,
  bookType?: BookType
): Promise<Book[]> {
  const supabase = await createSupabaseClient();

  let query = supabase.from("books").select("*");

  if (category) {
    query = query.eq("category", category);
  }

  if (bookType) {
    query = query.eq("book_type", bookType);
  }

  if (searchTerm) {
    query = query.or(
      `title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
    );
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching books:", error);
    return [];
  }

  return data || [];
}

export async function getBookById(id: string): Promise<Book | null> {
  const supabase = await createSupabaseClient();

  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching book:", error);
    return null;
  }

  return data;
}

export async function getFavorites(): Promise<Book[]> {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("favorites")
    .select("books(*)")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }

  return data?.map((fav: any) => fav.books) || [];
}

export async function toggleFavorite(bookId: string): Promise<boolean> {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  // Check if already favorited
  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("book_id", bookId)
    .single();

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", existing.id);
    return !error;
  } else {
    // Add favorite
    const { error } = await supabase
      .from("favorites")
      .insert({ user_id: user.id, book_id: bookId });
    return !error;
  }
}

export async function isFavorited(bookId: string): Promise<boolean> {
  const supabase = await createSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("book_id", bookId)
    .single();

  return !!data;
}

export const CATEGORIES: Category[] = [
  "Development",
  "Machine Learning",
  "Cloud Computing",
  "AI",
  "AI Agents",
  "Business",
];

export const BOOK_TYPES: BookType[] = ["Hardcover", "Paperback", "E-book"];
