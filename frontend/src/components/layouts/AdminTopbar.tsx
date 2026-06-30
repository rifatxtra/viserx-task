import { Link } from "react-router-dom";
import { Menu, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLogout } from "../../hooks/useLogout";

export default function AdminTopbar({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Admin Panel</h1>
      </div>
      <div className="flex items-center gap-2">
        <Link
          to="/admin/profile"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
        >
          <User className="h-5 w-5" />
          <span className="hidden sm:inline">{user?.name}</span>
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
}
