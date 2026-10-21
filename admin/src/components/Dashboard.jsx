import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Package,
  Tags,
  MessageSquare,
  HelpCircle,
  Gift,
  ExternalLink,
  Plus,
  Settings,
  ArrowUpRight,
} from "lucide-react";
import { fetchDashboard } from "../redux/slices/dashboardSlice";
import { useSiteSettings } from "../context/SiteSettingsContext";

const Dashboard = () => {
  const { siteSettings } = useSiteSettings();
  const brandName = siteSettings?.brandName || "Golden Harvest";

  const {
    data: dashboardData,
    loading,
    error,
  } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const statsData = dashboardData?.stats || {};
  const recentProducts = dashboardData?.recentProducts || [];

  const stats = [
    {
      title: "Store Products",
      value: statsData.totalProducts ?? 0,
      description: "Live on landing page",
      icon: Package,
      path: "/products",
      color: "#2563eb",
      bgColor: "#eff6ff",
    },
    {
      title: "Active Categories",
      value: statsData.totalCategories ?? 0,
      description: "Collection filter pills",
      icon: Tags,
      path: "/categories",
      color: "#059669",
      bgColor: "#ecfdf5",
    },
    {
      title: "Customer Reviews",
      value: statsData.totalTestimonials ?? 0,
      description: "Voices of harvest stories",
      icon: MessageSquare,
      path: "/reviews",
      color: "#d97706",
      bgColor: "#fffbeb",
    },
    {
      title: "Frequently Asked Questions",
      value: statsData.totalFaqs ?? 0,
      description: "FAQ accordion items",
      icon: HelpCircle,
      path: "/faqs",
      color: "#7c3aed",
      bgColor: "#f5f3ff",
    },
    {
      title: "Gift Buckets & Hampers",
      value: statsData.bucketProducts ?? 0,
      description: "Artisan hampers featured",
      icon: Gift,
      path: "/products",
      color: "#db2777",
      bgColor: "#fdf2f8",
    },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 className="dashboard-title">Landing Page Content Manager</h1>
          <p className="dashboard-subtitle">
            Overview of live dynamic components and content on {brandName} store
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <a
            href="http://localhost:5174/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              color: "#334155",
              padding: "10px 16px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            <ExternalLink size={15} />
            View Live Store
          </a>

          <Link
            to="/settings"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#172554",
              color: "#ffffff",
              padding: "10px 16px",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "13px",
              textDecoration: "none",
            }}
          >
            <Settings size={15} />
            Edit Site Settings
          </Link>
        </div>
      </div>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      <div className="dashboard-stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              to={stat.path}
              key={stat.title}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div
                className="dashboard-stat-card"
                style={{
                  background: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  height: "100%",
                  transition: "transform 0.15s ease, box-shadow 0.15s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: stat.bgColor,
                      color: stat.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <ArrowUpRight size={16} color="#94a3b8" />
                </div>

                <div>
                  <p style={{ fontSize: "13px", color: "#64748b", margin: 0, fontWeight: "500" }}>
                    {stat.title}
                  </p>
                  <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: "4px 0" }}>
                    {loading ? "..." : stat.value}
                  </h2>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: 0 }}>
                    {stat.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="recent-orders-card" style={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "14px" }}>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
              Live Store Products
            </h2>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0" }}>
              Latest products currently active on your storefront
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Link
              to="/products/add"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#f1f5f9",
                color: "#1e293b",
                padding: "8px 14px",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              <Plus size={15} />
              Add Product
            </Link>

            <Link
              to="/products"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#172554",
                color: "#ffffff",
                padding: "8px 14px",
                borderRadius: "6px",
                fontWeight: "600",
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              <span>View All</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        <div className="orders-table-wrapper" style={{ overflowX: "auto" }}>
          <table className="orders-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", textAlign: "left", fontSize: "12px", color: "#64748b", borderBottom: "1px solid #e2e8f0" }}>
                <th style={{ padding: "12px 14px" }}>PRODUCT</th>
                <th style={{ padding: "12px 14px" }}>CATEGORY</th>
                <th style={{ padding: "12px 14px" }}>BASE PRICE</th>
                <th style={{ padding: "12px 14px" }}>AVAILABILITY</th>
                <th style={{ padding: "12px 14px" }}>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {recentProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                    No products added yet. Click "Add Product" to create your first item.
                  </td>
                </tr>
              ) : (
                recentProducts.map((p) => (
                  <tr key={p._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                    <td style={{ padding: "12px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img
                          src={
                            p.image?.startsWith("/uploads")
                              ? `http://localhost:5000${p.image}`
                              : (p.image || "/images/almonds.jpg")
                          }
                          alt={p.name}
                          onError={(e) => {
                            if (!e.target.dataset.triedServer) {
                              e.target.dataset.triedServer = "true";
                              const path = p.image?.startsWith("/") ? p.image : `/${p.image}`;
                              e.target.src = `http://localhost:5000${path}`;
                            } else {
                              e.target.src = "/images/almonds.jpg";
                            }
                          }}
                          style={{ width: "42px", height: "42px", borderRadius: "8px", objectFit: "cover", border: "1px solid #e2e8f0" }}
                        />
                        <div>
                          <strong style={{ color: "#1e293b", fontSize: "14px" }}>{p.name}</strong>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "500", textTransform: "capitalize", color: "#475569" }}>
                        {p.category}
                      </span>
                    </td>

                    <td style={{ padding: "12px 14px" }}>
                      <strong style={{ color: "#0f172a" }}>₹{p.basePrice || p.price}</strong>
                    </td>

                    <td style={{ padding: "12px 14px" }}>
                      <span
                        style={{
                          background: p.inStock ? "#dcfce7" : "#fee2e2",
                          color: p.inStock ? "#15803d" : "#b91c1c",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>

                    <td style={{ padding: "12px 14px" }}>
                      <Link
                        to="/products"
                        style={{
                          background: "#f1f5f9",
                          color: "#1e293b",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          fontWeight: "600",
                          textDecoration: "none",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;