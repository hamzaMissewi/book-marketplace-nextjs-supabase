// import { BookData } from "@/components/book-showcase/types"

import { BookData } from "@/components/old/types";

export interface CartItem
  extends Pick<BookData, "id" | "title" | "coverImage"> {
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export interface CheckoutFormData {
  email: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  paymentMethod: "credit-card" | "paypal" | "crypto";
  saveInfo: boolean;
}
