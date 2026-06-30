import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import ProductPage from "./pages/public/Product";
import LoginPage from "./pages/public/Login";
import ProductDetails from "./pages/public/Product/view";
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
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
