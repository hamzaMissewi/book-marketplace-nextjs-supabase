"use client";

import { Book } from "@/lib/books";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Heart } from 'lucide-react';
import { useState, useEffect } from "react";
import { toggleFavorite, isFavorited } from "@/lib/books";

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const [isFav, setIsFav] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFavorite = async () => {
      const favorited = await isFavorited(book.id);
      setIsFav(favorited);
      setIsLoading(false);
    };
    checkFavorite();
  }, [book.id]);

  const handleToggleFavorite = async () => {
    setIsLoading(true);
    const success = await toggleFavorite(book.id);
    if (success) {
      setIsFav(!isFav);
    }
    setIsLoading(false);
  };

  const priceDisplay = (book.price_cents / 100).toFixed(2);

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow">
      <div className="relative aspect-[3/4] bg-muted overflow-hidden group">
        <Image
          src={book.cover_image_url || "/placeholder.svg"}
          alt={book.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform"
        />
        <button
          onClick={handleToggleFavorite}
          disabled={isLoading}
          className="absolute top-2 right-2 p-2 bg-background/80 hover:bg-background rounded-full transition-colors"
          aria-label="Toggle favorite"
        >
          <Heart
            className={`w-5 h-5 ${
              isFav ? "fill-destructive text-destructive" : "text-muted-foreground"
            }`}
          />
        </button>
      </div>
      <CardContent className="flex-1 p-4 flex flex-col gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm line-clamp-2 text-balance">
            {book.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">{book.author}</p>
          <p className="text-xs text-muted-foreground mt-2">{book.book_type}</p>
        </div>
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-border">
          <span className="font-bold text-lg">${priceDisplay}</span>
          <Link href={`/book/${book.id}`} className="flex-1">
            <Button variant="default" size="sm" className="w-full">
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
