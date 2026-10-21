import React from "react";
import {
  Menu,
  UserRound,
  LogOut,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useConfirm } from "../context/ConfirmContext";
import { useSiteSettings } from "../context/SiteSettingsContext";
import { logout } from "../redux/slices/authSlice";

const Header = ({ onMenuClick, isCollapsed }) => {
  const confirm = useConfirm();
  const { siteSettings } = useSiteSettings();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector(
    (state) => state.auth.admin
  );

  const brandName = siteSettings?.brandName || "Golden Harvest";

  const handleLogout = async () => {
    const isConfirmed = await confirm({
      title: "Sign Out",
      message: `Are you sure you want to sign out of the ${brandName} Admin Panel?`,
      confirmText: "Sign Out",
      cancelText: "Stay Signed In",
      variant: "primary",
      iconType: "logout",
    });

    if (!isConfirmed) return;

    dispatch(logout());
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  return (
    <header className="admin-header">
      <div className="admin-header-left" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button
          type="button"
          className="admin-hamburger-btn mobile-menu-button"
          onClick={onMenuClick}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu size={20} />
        </button>

        <div style={{ fontWeight: "600", color: "#1e293b", fontSize: "15px" }}>
          {brandName} Content Management
        </div>
      </div>

      <div className="admin-header-actions" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "16px" }}>
        <div className="admin-profile">
          <div className="admin-avatar">
            <UserRound size={17} />
          </div>

          <div className="admin-profile-info">
            <strong>
              {admin?.name && admin.name !== "Golden Harvest Admin" && admin.name !== "Admin"
                ? admin.name
                : `${brandName} Admin`}
            </strong>

            <span>
              {admin?.email || siteSettings?.email || "admin@gmail.com"}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            background: "#fee2e2",
            border: "none",
            color: "#dc2626",
            padding: "8px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            fontWeight: "600",
          }}
          title="Logout"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;