import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/layouts/AdminSidebar";
import AdminTopbar from "../components/layouts/AdminTopbar";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <AdminSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="flex flex-1 flex-col">
        <AdminTopbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
