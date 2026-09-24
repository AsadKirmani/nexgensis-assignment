"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProduct, Product } from "@/services/products.service";
import { isAuthenticated } from "@/lib/auth";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProduct(params.id as string);
        setProduct(data);
      } catch {
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  if (loading) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-gray-600">Loading product...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-red-600">{error || "Product not found."}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-6xl">
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to products
        </button>

        <div className="grid gap-8 rounded-xl bg-white p-6 shadow md:grid-cols-2">
          {/* Images */}
          <div>
            <div className="flex h-96 items-center justify-center rounded-lg bg-gray-50 p-6">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((image) => (
                  <div
                    key={image}
                    className="flex h-20 items-center justify-center rounded-lg border bg-gray-50 p-2"
                  >
                    <img
                      src={image}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product information */}
          <div>
            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-medium capitalize text-gray-700">
              {product.category}
            </span>

            <h1 className="mt-4 text-3xl font-bold text-gray-900">
              {product.title}
            </h1>

            <p className="mt-4 leading-7 text-gray-600">
              {product.description}
            </p>

            <div className="mt-6">
              <p className="text-3xl font-bold text-gray-900">
                ${product.price}
              </p>

              <button
                onClick={() => router.push(`/products/${product.id}/edit`)}
                className="mt-8 rounded-lg bg-gray-900 px-5 py-2.5 font-medium text-white hover:bg-gray-800"
              >
                Edit Product
              </button>

              <div className="mt-3 flex items-center gap-4">
                <span className="rounded-md bg-yellow-50 px-3 py-1 text-sm font-medium text-yellow-700">
                  ★ {product.rating}
                </span>

                <span
                  className={`text-sm font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} units in stock`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 border-t pt-6">
              <div>
                <p className="text-sm text-gray-500">Brand</p>
                <p className="mt-1 font-medium text-gray-900">
                  {product.brand || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">SKU</p>
                <p className="mt-1 font-medium text-gray-900">
                  {product.sku || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>

          {product.reviews.length === 0 ? (
            <p className="mt-4 text-gray-500">No reviews available.</p>
          ) : (
            <div className="mt-6 space-y-5">
              {product.reviews.map((review, index) => (
                <div
                  key={`${review.reviewerEmail}-${index}`}
                  className="border-b border-gray-200 pb-5 last:border-0 last:pb-0"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.reviewerName}
                      </p>

                      <p className="text-sm text-gray-500">
                        {review.reviewerEmail}
                      </p>
                    </div>

                    <span className="w-fit rounded-md bg-yellow-50 px-3 py-1 text-sm font-medium text-yellow-700">
                      ★ {review.rating}
                    </span>
                  </div>

                  <p className="mt-3 text-gray-700">{review.comment}</p>

                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
