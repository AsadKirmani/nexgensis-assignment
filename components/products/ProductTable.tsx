import Image from "next/image";
import { Product } from "@/services/products.service";

interface ProductTableProps {
  products: Product[];
}

export default function ProductTable({
  products,
}: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                Product
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                Category
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                Price
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                Rating
              </th>

              <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                Stock
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-lg object-cover"
                    />

                    <span className="font-medium text-gray-900">
                      {product.title}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-gray-600">
                  {product.category}
                </td>

                <td className="px-6 py-4 font-medium text-gray-900">
                  ${product.price}
                </td>

                <td className="px-6 py-4 text-gray-900">
                  ⭐ {product.rating}
                </td>

                <td className="px-6 py-4 text-gray-900">
                  {product.stock}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}