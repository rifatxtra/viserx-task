import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../lib/api";

export default function ProductPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    category_id: "",
    min_price: "",
    max_price: "",
  });
  const [links, setLinks] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      if (response.status === 200) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  const fetchProducts = async (params = {}) => {
    try {
      const productsResponse = await api.get("/products", { params });
      if (productsResponse.status === 200) {
        setProducts(productsResponse.data.data);
        setLinks(productsResponse.data.links);
        setTotal(productsResponse.data.total);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(filters); // page defaults to 1
  };

  const goToPage = (url: string | null) => {
    if (!url) return; // Previous on first / Next on last page have no url
    const page = new URL(url).searchParams.get("page");
    fetchProducts({ ...filters, page });
  };

  return (
    <div className="mx-auto w-[90%] max-w-6xl py-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Products</h1>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Filters — UI only, wire up later */}
        <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-72">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-gray-900">
              Filters
            </h2>

            <form className="space-y-4" onSubmit={handleSearch}>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Product name
                </label>
                <input
                  type="text"
                  placeholder="Search by name"
                  value={filters.name}
                  onChange={(e) =>
                    setFilters({ ...filters, name: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Category
                </label>
                <select
                  value={filters.category_id}
                  onChange={(e) =>
                    setFilters({ ...filters, category_id: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600">
                  Price range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={filters.min_price}
                    onChange={(e) =>
                      setFilters({ ...filters, min_price: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-gray-400">–</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={filters.max_price}
                    onChange={(e) =>
                      setFilters({ ...filters, max_price: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Search
              </button>
            </form>
          </div>
        </aside>

        {/* Product grid */}
        <section className="flex-1">
          <p className="mb-4 text-sm text-gray-600">
            {total} {total === 1 ? "product" : "products"}
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
                onClick={() => navigate(`/products/${product.slug}`)}
              >
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-40 w-full object-cover"
                />
                <div className="flex flex-col p-5">
                  <span className="mb-2 inline-flex w-fit rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {product.category.name}
                  </span>
                  <h3 className="text-base font-semibold text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-4 text-lg font-bold text-gray-900">
                    BDT {product.price}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {links.length > 3 && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-1">
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
        </section>
      </div>
    </div>
  );
}
