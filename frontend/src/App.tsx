import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import ProductPage from "./pages/public/Product";
import LoginPage from "./pages/public/Login";
import ProductDetails from "./pages/public/Product/view";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/admin/Dashboard";
import AdminProductPage from "./pages/admin/Product";
import ProductCreate from "./pages/admin/Product/create";
import ProductEdit from "./pages/admin/Product/edit";
import AdminCategoryPage from "./pages/admin/Category";
import CategoryCreate from "./pages/admin/Category/create";
import CategoryEdit from "./pages/admin/Category/edit";
import ProfilePage from "./pages/admin/Profile";
import SettingsPage from "./pages/admin/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route index element={<Navigate to="/products" replace />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="products/:slug" element={<ProductDetails />} />
            <Route path="login" element={<LoginPage />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="products" element={<AdminProductPage />} />
              <Route path="products/create" element={<ProductCreate />} />
              <Route path="products/:id/edit" element={<ProductEdit />} />
              <Route path="categories" element={<AdminCategoryPage />} />
              <Route path="categories/create" element={<CategoryCreate />} />
              <Route path="categories/:id/edit" element={<CategoryEdit />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
