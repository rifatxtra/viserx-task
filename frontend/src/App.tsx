import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import ProductPage from "./pages/public/Product";
import LoginPage from "./pages/public/Login";
import ProductDetails from "./pages/public/Product/view";
import AdminLayout from "./layouts/AdminLayout";
import DashboardPage from "./pages/admin/Dashboard";
import AdminProductPage from "./pages/admin/Product";
import AdminCategoryPage from "./pages/admin/Category";
import ProfilePage from "./pages/admin/Profile";
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
              <Route path="categories" element={<AdminCategoryPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
