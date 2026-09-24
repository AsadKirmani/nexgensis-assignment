"use client";

import { useRouter } from "next/navigation";
import ProductForm, {
  ProductFormData,
} from "@/components/products/ProductForm";

export default function AddProductPage() {
  const router = useRouter();

  const handleSubmit = (data: ProductFormData) => {
    console.log("Product data:", data);
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

        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Add Product
        </h1>

        <p className="mb-6 text-gray-600">
          Create a new product.
        </p>

        <ProductForm onSubmit={handleSubmit} />
      </div>
    </main>
  );
}