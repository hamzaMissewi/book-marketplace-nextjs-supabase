import { Book } from "@/lib/books";

export interface CartItem {
  bookId: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  book: Book;
}

export function createProductFromBook(book: Book): Product {
  return {
    id: book.id,
    name: book.title,
    description: `${book.author} - ${book.category}`,
    priceInCents: book.price_cents,
    book: book,
  };
}
