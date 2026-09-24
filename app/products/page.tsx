"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getProducts,
  searchProducts,
  getCategories,
  getProductsByCategory,
  Product,
  ProductCategory,
} from "@/services/products.service";
import ProductTable from "@/components/products/ProductTable";
import ProductPagination from "@/components/products/ProductPagination";
import ProductSearch from "@/components/products/ProductSearch";
import ProductFilters from "@/components/products/ProductFilters";
import { isAuthenticated } from "@/lib/auth";
import { getLocalProductChanges } from "@/lib/product-store";

const VALID_PAGE_SIZES = [10, 20, 50];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestIdRef = useRef(0);
  const [categories, setCategories] = useState<ProductCategory[]>([]);

  const rawPage = Number(searchParams.get("page"));
  const rawPageSize = Number(searchParams.get("pageSize"));
  const searchQuery = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "";
  const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

  const pageSize = VALID_PAGE_SIZES.includes(rawPageSize) ? rawPageSize : 20;

  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const requestId = ++requestIdRef.current;

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const data = searchQuery
          ? await searchProducts(searchQuery, {
              limit: 0,
              skip: 0,
            })
          : category
            ? await getProductsByCategory(category, {
                limit: 0,
                skip: 0,
              })
            : await getProducts({
                limit: 0,
                skip: 0,
              });

        // Ignore old request if a newer request has started
        if (requestId !== requestIdRef.current) {
          return;
        }

        const changes = getLocalProductChanges();

        // Apply local updates and remove locally deleted products
        let mergedProducts = data.products
          .filter((product) => !changes.deleted.includes(product.id))
          .map((product) => changes.updated[product.id] ?? product);

        // Add locally created products
        const localAddedProducts = changes.added
          .map((product) => changes.updated[product.id] ?? product)
          .filter((product) => !changes.deleted.includes(product.id));

        mergedProducts = [
          ...localAddedProducts,
          ...mergedProducts.filter(
            (product) =>
              !localAddedProducts.some(
                (localProduct) => localProduct.id === product.id,
              ),
          ),
        ];

        // Search local products
        if (searchQuery) {
          const query = searchQuery.toLowerCase();

          mergedProducts = mergedProducts.filter((product) =>
            product.title.toLowerCase().includes(query),
          );
        }

        // Category filter for local products
        if (category) {
          mergedProducts = mergedProducts.filter(
            (product) => product.category === category,
          );
        }

        // Sort
        if (sortBy) {
          mergedProducts.sort((a, b) => {
            let comparison = 0;

            if (sortBy === "title") {
              comparison = a.title.localeCompare(b.title);
            }

            if (sortBy === "price") {
              comparison = a.price - b.price;
            }

            if (sortBy === "rating") {
              comparison = a.rating - b.rating;
            }

            return sortOrder === "asc" ? comparison : -comparison;
          });
        }

        // Pagination happens LAST
        const total = mergedProducts.length;

        const startIndex = (page - 1) * pageSize;

        const paginatedProducts = mergedProducts.slice(
          startIndex,
          startIndex + pageSize,
        );

        setProducts(paginatedProducts);
        setTotalProducts(total);

        const totalPages = Math.ceil(total / pageSize);

        if (page > totalPages && totalPages > 0) {
          const params = new URLSearchParams(searchParams.toString());

          params.set("page", String(totalPages));

          router.replace(`/products?${params.toString()}`);
        }

        if (page > totalPages && totalPages > 0) {
          const params = new URLSearchParams(searchParams.toString());

          params.set("page", String(totalPages));

          router.replace(`/products?${params.toString()}`);
        }
      } catch (error) {
        if (requestId !== requestIdRef.current) {
          return;
        }

        setError("Failed to load products.");
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    router,
    page,
    pageSize,
    searchQuery,
    searchParams,
    category,
    sortBy,
    sortOrder,
  ]);

  const handleCategoryChange = (newCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    if (newCategory) {
      params.set("category", newCategory);
      params.delete("search");
    } else {
      params.delete("category");
    }

    router.push(`/products?${params.toString()}`);
  };

  const handleSortChange = (newSortBy: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    if (newSortBy) {
      params.set("sortBy", newSortBy);
    } else {
      params.delete("sortBy");
    }

    router.push(`/products?${params.toString()}`);
  };

  const handleSortOrderChange = (newSortOrder: "asc" | "desc") => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    if (newSortOrder) {
      params.set("sortOrder", newSortOrder);
    } else {
      params.delete("sortOrder");
    }

    router.push(`/products?${params.toString()}`);
  };

  const totalPages = Math.ceil(totalProducts / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(newPage));
    params.set("pageSize", String(pageSize));

    router.push(`/products?${params.toString()}`);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    router.push(`/products?page=1&pageSize=${newPageSize}`);
  };
  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", "1");

    if (value.trim()) {
      params.set("search", value.trim());
    } else {
      params.delete("search");
    }

    router.push(`/products?${params.toString()}`);
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
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>

            <p className="text-sm text-gray-600">Manage your products</p>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <ProductSearch value={searchQuery} onChange={handleSearchChange} />

            <ProductFilters
              category={category}
              sortBy={sortBy}
              sortOrder={sortOrder}
              categories={categories}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
              onSortOrderChange={handleSortOrderChange}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow">
          {products.length > 0 ? (
            <ProductTable products={products} />
          ) : (
            <div className="px-6 py-16 text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                No products found
              </h2>

              <p className="mt-2 text-sm text-gray-600">
                {searchQuery
                  ? `No products match "${searchQuery}".`
                  : "There are no products to display."}
              </p>
            </div>
          )}

          {products.length > 0 && (
            <ProductPagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={pageSize}
              totalProducts={totalProducts}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </div>
      </div>
    </main>
  );
}
