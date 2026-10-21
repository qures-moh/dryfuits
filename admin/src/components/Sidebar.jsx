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
  BadgeCheck,
} from "lucide-react";
import api from "../api/axios";
import { formatImageUrl } from "../utils/formatImage";
import { useSiteSettings } from "../context/SiteSettingsContext";

const Sidebar = ({ isOpen, isDesktopCollapsed, onClose }) => {
  const { siteSettings } = useSiteSettings();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [siteSettings?.logoUrl]);

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
      label: "Badges",
      path: "/badges",
      icon: BadgeCheck,
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
        } ${isDesktopCollapsed ? "desktop-collapsed" : ""}`}
      >
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            {!imgError && siteSettings.logoUrl ? (
              <img
                src={formatImageUrl(siteSettings.logoUrl)}
                alt="Logo"
                onError={() => setImgError(true)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "3px",
                }}
              />
            ) : (
              siteSettings.brandName?.slice(0, 2).toUpperCase() ||
              "GH"
            )}
          </div>

          <div className="sidebar-brand-text">
            <strong>
              {siteSettings.brandName || "Golden Harvest"}
            </strong>

            <span>
              {siteSettings.brandTagline || "Admin Panel"}
            </span>
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close sidebar"
            title="Close sidebar"
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
                onClick={() => {
                  if (typeof window !== "undefined" && window.innerWidth <= 900 && onClose) {
                    onClose();
                  }
                }}
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