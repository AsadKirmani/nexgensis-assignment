"use client";

import Link from "next/link";
import { Product } from "@/services/products.service";

interface ProductCardProps {
  products: Product[];
}

export default function ProductCard({
  products,
}: ProductCardProps) {
  return (
    <div className="space-y-4 p-4 md:hidden">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-xl border border-gray-200 bg-white p-4"
        >
          <div className="flex gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gray-50 p-2">
              {product.thumbnail ? (
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-xs text-gray-400">
                  No image
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${product.id}`}
                className="font-semibold text-gray-900 hover:underline"
              >
                {product.title}
              </Link>

              <p className="mt-1 text-sm capitalize text-gray-500">
                {product.category}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
            <div>
              <p className="text-xs text-gray-500">Price</p>
              <p className="mt-1 font-semibold text-gray-900">
                ${product.price}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Rating</p>
              <p className="mt-1 font-semibold text-gray-900">
                ★ {product.rating}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500">Stock</p>
              <p
                className={`mt-1 font-semibold ${
                  product.stock > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {product.stock}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}