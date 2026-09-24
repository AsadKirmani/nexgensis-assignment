"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm, {
  ProductFormData,
} from "@/components/products/ProductForm";
import { addProduct } from "@/services/products.service";
import { saveAddedProduct } from "@/lib/product-store";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: ProductFormData) => {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      const product = await addProduct({
        title: data.title,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        category: data.category,
      });

      const localProduct = saveAddedProduct({
        ...product,
        images: product.images ?? [],
        thumbnail: product.thumbnail ?? "",
        reviews: product.reviews ?? [],
      });

      router.push(`/products/${localProduct.id}`);
    } catch {
      setError("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to products
        </button>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">Add Product</h1>

        <p className="mb-6 text-gray-600">Create a new product.</p>
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <ProductForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </main>
  );
}
