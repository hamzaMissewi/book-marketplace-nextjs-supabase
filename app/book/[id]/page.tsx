"use client";

import { useEffect, useState } from "react";
import { getBookById, Book } from "@/lib/books";
import { Navigation } from "@/components/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { toggleFavorite, isFavorited } from "@/lib/books";

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const loadBook = async () => {
      const { id } = await params;
      const bookData = await getBookById(id);
      setBook(bookData);
      if (bookData) {
        const favorited = await isFavorited(bookData.id);
        setIsFav(favorited);
      }
      setIsLoading(false);
    };
    loadBook();
  }, [params]);

  const handleAddToCart = () => {
    if (!book) return;
    
    const cart = JSON.parse(localStorage.getItem("bookstore-cart") || "[]");
    if (!cart.find((item: Book) => item.id === book.id)) {
      cart.push(book);
      localStorage.setItem("bookstore-cart", JSON.stringify(cart));
    }
    router.push("/cart");
  };

  const handleToggleFavorite = async () => {
    if (!book) return;
    const success = await toggleFavorite(book.id);
    if (success) {
      setIsFav(!isFav);
    }
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

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p>Book not found</p>
        </main>
      </div>
    );
  }

  const priceDisplay = (book.price_cents / 100).toFixed(2);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/browse" className="text-primary hover:underline text-sm mb-6 inline-block">
          ← Back to Browse
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Book Cover */}
          <div className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
            <Image
              src={book.cover_image_url || "/placeholder.svg"}
              alt={book.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Book Details */}
          <Card>
            <CardContent className="pt-6 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
                <p className="text-lg text-muted-foreground">{book.author}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{book.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Format</p>
                  <p className="font-medium">{book.book_type}</p>
                </div>
              </div>

              <div className="border-y border-border py-6">
                <p className="text-4xl font-bold mb-4">${priceDisplay}</p>
                <div className="space-y-3">
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="w-full"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleToggleFavorite}
                    variant="outline"
                    size="lg"
                    className="w-full"
                  >
                    <Heart
                      className={`w-5 h-5 mr-2 ${
                        isFav ? "fill-destructive text-destructive" : ""
                      }`}
                    />
                    {isFav ? "Remove from Favorites" : "Add to Favorites"}
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {book.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
