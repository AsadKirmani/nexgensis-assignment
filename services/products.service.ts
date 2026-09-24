import api from "@/lib/api";

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductQuery {
  limit?: number;
  skip?: number;
}

export const getProducts = async (
  params?: ProductQuery
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>("/products", {
    params,
  });

  return response.data;
};

export const getProduct = async (id: string | number): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);

  return response.data;
};

export const searchProducts = async (
  query: string,
  params?: ProductQuery
): Promise<ProductsResponse> => {
  const response = await api.get<ProductsResponse>("/products/search", {
    params: {
      q: query,
      ...params,
    },
  });

  return response.data;
};

export const getCategories = async () => {
  const response = await api.get<string[]>("/products/categories");

  return response.data;
};

export const addProduct = async (
  product: Partial<Product>
): Promise<Product> => {
  const response = await api.post<Product>("/products/add", product);

  return response.data;
};

export const updateProduct = async (
  id: number,
  product: Partial<Product>
): Promise<Product> => {
  const response = await api.put<Product>(`/products/${id}`, product);

  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await api.delete(`/products/${id}`);

  return response.data;
};