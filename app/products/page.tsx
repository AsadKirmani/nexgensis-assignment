"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProducts, Product } from "@/services/products.service";
import ProductTable from "@/components/products/ProductTable";
import { isAuthenticated } from "@/lib/auth";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  if (!isAuthenticated()) {
    router.replace("/login");
    return;
  }

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts({
        limit: 20,
        skip: 0,
      });

      setProducts(data.products);
    } catch (error) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading products...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>

          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-black px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-gray-500">
            Manage your products
          </p>
        </div>

        <ProductTable products={products} />
      </div>
    </main>
  );
}