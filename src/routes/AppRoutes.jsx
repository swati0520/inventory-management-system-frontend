import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Categories from "../pages/Categories";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import ProductDetails from "../pages/ProductDetails";
import ProductFormPage from "../pages/ProductFormPage";
import Products from "../pages/Products";
import Register from "../pages/Register";
import ProtectedLayout from "../components/ProtectedLayout";
import { getAuthToken } from "../utils/auth";

const ProtectedRoute = () => getAuthToken()
    ? <ProtectedLayout />
    : <Navigate to="/login" replace />;

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<ProductFormPage />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
          <Route path="/categories" element={<Categories />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
