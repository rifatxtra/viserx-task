import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import api from "../../../lib/api";

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${slug}`);
      if (response.status === 200) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product)
    return <p className="text-center text-gray-500">Product not found</p>;

  return (
    <div className="mx-auto w-[90%] max-w-5xl py-10">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white p-4">
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-72 w-full object-contain"
          />
        </div>

        <div className="flex flex-col">
          {product.category?.name && (
            <span className="mb-3 inline-flex w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              {product.category.name}
            </span>
          )}
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-2xl font-bold text-gray-900">
            BDT {product.price}
          </p>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <h2 className="mb-2 text-sm font-semibold text-gray-900">
          Description
        </h2>
        <div
          className="leading-relaxed text-gray-600"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      </div>
    </div>
  );
}
