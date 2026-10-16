import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Plus,
  Package,
  Tags,
  MessageSquare,
  HelpCircle,
  Settings,
  X,
  Gift,
} from "lucide-react";
import api from "../api/axios";
import { formatImageUrl } from "../utils/formatImage";

const Sidebar = ({ isOpen, onClose }) => {
  const [siteSettings, setSiteSettings] = useState({
    brandName: "Golden Harvest",
    brandTagline: "Admin Panel",
    logoUrl: "/images/logo.svg",
  });
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSiteSettings = async () => {
      try {
        const res = await api.get("/settings");
        if (res.data && isMounted) {
          setSiteSettings((prev) => ({ ...prev, ...res.data }));
          setImgError(false);
        }
      } catch (e) {
        // Fallback gracefully
      }
    };

    fetchSiteSettings();

    const handleUpdate = (e) => {
      if (e.detail) {
        setSiteSettings((prev) => ({ ...prev, ...e.detail }));
        setImgError(false);
      }
    };

    window.addEventListener("settingsUpdated", handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener("settingsUpdated", handleUpdate);
    };
  }, []);

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      path: "/products",
      icon: Package,
    },
    {
      label: "Add Product",
      path: "/products/add",
      icon: Plus,
    },
    {
      label: "Categories",
      path: "/categories",
      icon: Tags,
    },
    {
      label: "Custom Studio",
      path: "/custom-studio",
      icon: Gift,
    },
    {
      label: "Reviews",
      path: "/reviews",
      icon: MessageSquare,
    },
    {
      label: "FAQs",
      path: "/faqs",
      icon: HelpCircle,
    },
    {
      label: "Site Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      <aside
        className={`admin-sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            {!imgError && siteSettings.logoUrl ? (
              <img
                src={formatImageUrl(siteSettings.logoUrl)}
                alt="Logo"
                onError={() => setImgError(true)}
                style={{ width: "100%", height: "100%", objectFit: "contain", padding: "3px" }}
              />
            ) : (
              siteSettings.brandName?.slice(0, 2).toUpperCase() || "GH"
            )}
          </div>

          <div className="sidebar-brand-text">
            <strong>{siteSettings.brandName || "Golden Harvest"}</strong>
            <span>{siteSettings.brandTagline || "Admin Panel"}</span>
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="sidebar-menu-title">
          DYNAMIC CONTENT
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `sidebar-link ${
                    isActive ? "active" : ""
                  }`
                }
              >
                <Icon size={18} strokeWidth={1.8} />

                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;