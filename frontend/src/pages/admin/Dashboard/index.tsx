import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Tags } from "lucide-react";
import api from "../../../lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  const fetchStats = async () => {
    try {
      const response = await api.get("/stats");
      if (response.status === 200) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Link
          to="/admin/products"
          className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Products</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.products}</p>
          </div>
        </Link>
        <Link
          to="/admin/categories"
          className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Tags className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Categories</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats?.categories}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
