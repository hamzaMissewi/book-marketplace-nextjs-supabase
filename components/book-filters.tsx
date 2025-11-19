"use client";

import { CATEGORIES, BOOK_TYPES, Category, BookType } from "@/lib/books";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BookFiltersProps {
  searchTerm: string;
  category: Category | "";
  bookType: BookType | "";
  onSearchChange: (search: string) => void;
  onCategoryChange: (category: Category | "") => void;
  onBookTypeChange: (type: BookType | "") => void;
}

export function BookFilters({
  searchTerm,
  category,
  bookType,
  onSearchChange,
  onCategoryChange,
  onBookTypeChange,
}: BookFiltersProps) {
  return (
    <div className="space-y-4 p-4 border border-border rounded-lg bg-card">
      <div>
        <Label htmlFor="search" className="text-sm font-medium">
          Search Books
        </Label>
        <Input
          id="search"
          placeholder="Title, author, or keyword..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="category" className="text-sm font-medium">
          Category
        </Label>
        <Select
          value={category}
          onValueChange={(value) =>
            onCategoryChange(value as Category | "")
          }
        >
          <SelectTrigger id="category" className="mt-2">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="book-type" className="text-sm font-medium">
          Book Type
        </Label>
        <Select
          value={bookType}
          onValueChange={(value) => onBookTypeChange(value as BookType | "")}
        >
          <SelectTrigger id="book-type" className="mt-2">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            {BOOK_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          onSearchChange("");
          onCategoryChange("");
          onBookTypeChange("");
        }}
      >
        Clear Filters
      </Button>
    </div>
  );
}
