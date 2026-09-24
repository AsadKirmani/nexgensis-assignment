"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm, {
  ProductFormData,
} from "@/components/products/ProductForm";
import {
  getProduct,
  updateProduct,
  Product,
} from "@/services/products.service";
import { isAuthenticated } from "@/lib/auth";
import {
  saveUpdatedProduct,
  getLocalProductChanges,
} from "@/lib/product-store";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

        const productId = Number(params.id);
        const changes = getLocalProductChanges();

        // Check local products first
        const localProduct = changes.added.find(
          (item) => item.id === productId,
        );

        if (localProduct) {
          setProduct(localProduct);
          return;
        }

        // Check locally deleted API products
        if (changes.deleted.includes(productId)) {
          throw new Error("Product not found.");
        }

        // Fetch API product
        const data = await getProduct(productId);

        // Apply local update
        const updatedProduct = changes.updated[data.id];

        setProduct(updatedProduct ?? data);
      } catch {
        setProduct(null);
        setError("Product not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id, router]);

  const handleSubmit = async (data: ProductFormData) => {
    if (!product || saving) return;

    try {
      setSaving(true);
      setError("");

      const updatedData = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        stock: Number(data.stock),
        category: data.category,
      };

      // Local product
      if (product.id >= 195) {
        const updatedProduct = {
          ...product,
          ...updatedData,
        };

        saveUpdatedProduct(updatedProduct);

        router.push(`/products/${product.id}`);
        return;
      }

      // API product
      const updatedProduct = await updateProduct(product.id, updatedData);

      saveUpdatedProduct({
        ...product,
        ...updatedProduct,
      });

      router.push(`/products/${product.id}`);
    } catch {
      setError("Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-600">Loading product...</p>
        </div>
      </main>
    );
  }

  if (error && !product) {
    return (
      <main className="min-h-screen p-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!product) return null;

  return (
    <main className="min-h-screen p-6">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>

        <h1 className="mb-2 text-2xl font-bold text-gray-900">Edit Product</h1>

        <p className="mb-6 text-gray-600">Update product information.</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <ProductForm
          initialData={{
            title: product.title,
            description: product.description,
            price: String(product.price),
            stock: String(product.stock),
            category: product.category,
          }}
          onSubmit={handleSubmit}
          loading={saving}
          submitLabel="Save Changes"
        />
      </div>
    </main>
  );
}
