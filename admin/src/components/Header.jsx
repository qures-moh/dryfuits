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
import { logout } from "../redux/slices/authSlice";

const Header = ({ onMenuClick }) => {
  const confirm = useConfirm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const admin = useSelector(
    (state) => state.auth.admin
  );

  const handleLogout = async () => {
    const isConfirmed = await confirm({
      title: "Sign Out",
      message: "Are you sure you want to sign out of the Golden Harvest Admin Panel?",
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
      <button
        type="button"
        className="mobile-menu-button"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu size={21} />
      </button>

      <div style={{ fontWeight: "600", color: "#1e293b", fontSize: "15px" }}>
        Golden Harvest Content Management
      </div>

      <div className="admin-header-actions" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "16px" }}>
        <div className="admin-profile">
          <div className="admin-avatar">
            <UserRound size={17} />
          </div>

          <div className="admin-profile-info">
            <strong>
              {admin?.name || "Golden Harvest Admin"}
            </strong>

            <span>
              {admin?.email || "admin@goldenharvest.com"}
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