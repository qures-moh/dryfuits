import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ConfirmProvider } from "./context/ConfirmContext";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./components/Dashboard";
import Login from "./pages/Login";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import Categories from "./pages/Categories";
import Reviews from "./pages/Reviews";
import Faqs from "./pages/Faqs";
import Settings from "./pages/Settings";
import CustomStudio from "./pages/CustomStudio";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={10}
        toastOptions={{
          duration: 3500,
          style: {
            background: "#0f172a",
            color: "#f8fafc",
            borderRadius: "10px",
            fontSize: "14px",
            fontWeight: "500",
            padding: "12px 18px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#ffffff",
            },
            style: {
              background: "#064e3b",
              color: "#ecfdf5",
              border: "1px solid #059669",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
            style: {
              background: "#7f1d1d",
              color: "#fef2f2",
              border: "1px solid #b91c1c",
            },
          },
        }}
      />
      <ConfirmProvider>
        <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Products />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/products/add"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AddProduct />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Categories />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/custom-studio"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CustomStudio />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Reviews />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/faqs"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Faqs />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />
        </Routes>
      </ConfirmProvider>
    </>
  );
};

export default App;