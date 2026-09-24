"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProducts, Product } from "@/services/products.service";
import ProductTable from "@/components/products/ProductTable";
import ProductPagination from "@/components/products/ProductPagination";
import { isAuthenticated } from "@/lib/auth";

const VALID_PAGE_SIZES = [10, 20, 50];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const rawPage = Number(searchParams.get("page"));
  const rawPageSize = Number(searchParams.get("pageSize"));

  const page =
    Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const pageSize = VALID_PAGE_SIZES.includes(rawPageSize)
    ? rawPageSize
    : 20;

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const skip = (page - 1) * pageSize;

        const data = await getProducts({
          limit: pageSize,
          skip,
        });

        setProducts(data.products);
        setTotalProducts(data.total);

        // If page is greater than the last valid page,
        // go back to the last valid page.
        const totalPages = Math.ceil(data.total / pageSize);

        if (page > totalPages && totalPages > 0) {
          router.replace(
            `/products?page=${totalPages}&pageSize=${pageSize}`
          );
        }
      } catch (error) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [router, page, pageSize]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    router.push(
      `/products?page=${newPage}&pageSize=${pageSize}`
    );
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(
      `/products?page=1&pageSize=${newPageSize}`
    );
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-900">Loading products...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
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
          <h1 className="text-2xl font-bold text-gray-900">
            Products
          </h1>

          <p className="text-sm text-gray-600">
            Manage your products
          </p>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow">
          <ProductTable products={products} />

          <ProductPagination
            currentPage={page}
            totalPages={totalPages}
            pageSize={pageSize}
            totalProducts={totalProducts}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </main>
  );
}