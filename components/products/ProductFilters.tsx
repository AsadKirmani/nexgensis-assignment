"use client";

import { ProductCategory } from "@/services/products.service";

interface ProductFiltersProps {
  category: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  categories: ProductCategory[];
  onCategoryChange: (category: string) => void;
  onSortChange: (sortBy: string) => void;
  onSortOrderChange: (sortOrder: "asc" | "desc") => void;
}

export default function ProductFilters({
  category,
  sortBy,
  sortOrder,
  categories,
  onCategoryChange,
  onSortChange,
  onSortOrderChange,
}: ProductFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label
          htmlFor="category"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Category
        </label>

        <select
          id="category"
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
        >
          <option value="">All categories</option>

          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="sortBy"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Sort by
        </label>

        <select
          id="sortBy"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
        >
          <option value="">Default</option>
          <option value="title">Title</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      {sortBy && (
        <div>
          <label
            htmlFor="sortOrder"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Order
          </label>

          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(event) =>
              onSortOrderChange(event.target.value as "asc" | "desc")
            }
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      )}
    </div>
  );
}
