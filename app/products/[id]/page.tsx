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
        <h1 className="text-2xl font-bold text-gray-900">
          {product.title}
        </h1>

        <p className="mt-2 text-gray-600">
          {product.description}
        </p>
      </div>
    </main>
  );
}