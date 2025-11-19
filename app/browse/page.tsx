"use client";

import { useEffect, useState } from "react";
import { getBooks, Category, BookType, Book } from "@/lib/books";
import { BookCard } from "@/components/book-card";
import { BookFilters } from "@/components/book-filters";
import { Navigation } from "@/components/navigation";
import { Skeleton } from "@/components/ui/skeleton";
// import { useRouter } from "next/navigation";

export default function BrowsePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [bookType, setBookType] = useState<BookType | "">("");
  // const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      const data = await getBooks(
        category || undefined,
        searchTerm || undefined,
        bookType || undefined
      );
      setBooks(data);
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(fetchBooks, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, category, bookType]);

  // if (!session) {
  //   // Handle unauthenticated state
  //   return router.push("/auth/login");
  //   //  return <Navigate to="/auth/login" />
  //   //  return <div>Please log in</div>;
  // }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore Books</h1>
          <p className="text-muted-foreground">
            Discover books on development, AI, cloud computing, and business
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <BookFilters
              searchTerm={searchTerm}
              category={category}
              bookType={bookType}
              onSearchChange={setSearchTerm}
              onCategoryChange={setCategory}
              onBookTypeChange={setBookType}
            />
          </div>

          {/* Books Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-[3/4]" />
                ))}
              </div>
            ) : books.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No books found. Try adjusting your filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
