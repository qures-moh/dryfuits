import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
    try {
      return localStorage.getItem("admin_sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  React.useEffect(() => {
    if (mobileOpen && window.innerWidth <= 900) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 900) {
      setMobileOpen((prev) => !prev);
    } else {
      setIsDesktopCollapsed((prev) => {
        const next = !prev;
        try {
          localStorage.setItem("admin_sidebar_collapsed", String(next));
        } catch {}
        return next;
      });
    }
  };

  const handleClose = () => {
    if (typeof window !== "undefined" && window.innerWidth <= 900) {
      setMobileOpen(false);
    } else {
      setIsDesktopCollapsed(true);
      try {
        localStorage.setItem("admin_sidebar_collapsed", "true");
      } catch {}
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar
        isOpen={mobileOpen}
        isDesktopCollapsed={isDesktopCollapsed}
        onClose={handleClose}
      />

      <div className={`admin-main ${isDesktopCollapsed ? "sidebar-collapsed" : ""}`}>
        <Header
          onMenuClick={handleToggle}
          isCollapsed={isDesktopCollapsed}
        />

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;