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

  const admin = useSelector((state) => state.auth.admin);

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
      <div className="admin-header-left">
        <button
          type="button"
          className="admin-hamburger-btn mobile-menu-button"
          onClick={onMenuClick}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu size={20} />
        </button>

        <div className="admin-header-title">
          <span className="admin-header-brand">
            {brandName}
          </span>

          <span className="admin-header-subtitle">
            Content Management
          </span>
        </div>
      </div>

      <div className="admin-header-actions">
        <div className="admin-profile">
          <div className="admin-avatar">
            <UserRound size={17} />
          </div>

          <div className="admin-profile-info">
            <strong>
              {admin?.name &&
                admin.name !== "Golden Harvest Admin" &&
                admin.name !== "Admin"
                ? admin.name
                : `${brandName} Admin`}
            </strong>

            <span>
              {admin?.email ||
                siteSettings?.email ||
                "admin@gmail.com"}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="admin-header-logout-btn"
          onClick={handleLogout}
          title="Logout"
        >
          <LogOut size={15} />
          <span className="logout-text">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;