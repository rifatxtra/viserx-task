import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../../lib/api";

export default function AdminProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [links, setLinks] = useState<any[]>([]);

  const fetchProducts = async (params = {}) => {
    try {
      const response = await api.get("/products", { params });
      if (response.status === 200) {
        setProducts(response.data.data);
        setLinks(response.data.links);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const goToPage = (url: string | null) => {
    if (!url) return;
    const page = new URL(url).searchParams.get("page");
    fetchProducts({ page });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <Link
          to="/admin/products/create"
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Image</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-4 py-3">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                </td>
                <td className="px-4 py-3 text-gray-900">{product.name}</td>
                <td className="px-4 py-3 text-gray-500">
                  {product.category?.name}
                </td>
                <td className="px-4 py-3 text-gray-900">BDT {product.price}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      aria-label="Edit"
                      className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product.id)}
                      aria-label="Delete"
                      className="flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-gray-500">
            No products yet.
          </p>
        )}
      </div>

      {links.length > 3 && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-1">
          {links.map((link, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goToPage(link.url)}
              disabled={!link.url}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                link.active
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
