import React, { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  Tag,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useConfirm } from "../context/ConfirmContext";

const AdminBadges = () => {
  const confirm = useConfirm();

  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  const [badgeName, setBadgeName] = useState("");

  const [editingBadge, setEditingBadge] = useState(null);
  const [editName, setEditName] = useState("");

  const [viewBadge, setViewBadge] = useState(null);

  const fetchBadges = async () => {
    try {
      setLoading(true);

      const res = await api.get("/badges/admin");

      setBadges(res.data.badges || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch badges"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleAddBadge = async (e) => {
    e.preventDefault();

    if (!badgeName.trim()) {
      toast.error("Badge name is required");
      return;
    }

    try {
      const res = await api.post("/badges", {
        name: badgeName.trim(),
      });

      setBadges((prev) => [res.data.badge, ...prev]);
      setBadgeName("");

      toast.success("Badge created successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create badge"
      );
    }
  };

  const handleEdit = (badge) => {
    setEditingBadge(badge);
    setEditName(badge.name);
  };

  const handleUpdateBadge = async (e) => {
    e.preventDefault();

    if (!editName.trim()) {
      toast.error("Badge name is required");
      return;
    }

    try {
      const res = await api.put(`/badges/${editingBadge._id}`, {
        name: editName.trim(),
      });

      setBadges((prev) =>
        prev.map((badge) =>
          badge._id === editingBadge._id
            ? res.data.badge
            : badge
        )
      );

      setEditingBadge(null);
      setEditName("");

      toast.success("Badge updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update badge"
      );
    }
  };

  const handleToggleStatus = async (badge) => {
    try {
      const res = await api.put(`/badges/${badge._id}`, {
        isActive: !badge.isActive,
      });

      setBadges((prev) =>
        prev.map((item) =>
          item._id === badge._id ? res.data.badge : item
        )
      );

      toast.success(
        res.data.badge.isActive
          ? "Badge activated"
          : "Badge deactivated"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update badge status"
      );
    }
  };

  const handleDelete = async (badge) => {
    const confirmed = await confirm({
      title: "Delete Badge",
      message: `Are you sure you want to delete "${badge.name}"?`,
      confirmText: "Delete",
      variant: "danger",
      iconType: "trash",
    });

    if (!confirmed) return;

    try {
      await api.delete(`/badges/${badge._id}`);

      setBadges((prev) =>
        prev.filter((item) => item._id !== badge._id)
      );

      toast.success("Badge deleted successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete badge"
      );
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Badges</h1>
          <p className="dashboard-subtitle">
            Manage product badges displayed across your store
          </p>
        </div>
      </div>

      <div className="admin-split-layout">
        <div
          className="recent-orders-card"
          style={{
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "#eef2ff",
                color: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Tag size={19} />
            </div>

            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#172554",
                }}
              >
                Add Badge
              </h2>

              <p
                style={{
                  margin: "3px 0 0",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Create a new product badge
              </p>
            </div>
          </div>

          <form onSubmit={handleAddBadge}>
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "7px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#172554",
                }}
              >
                Badge Name *
              </label>

              <input
                type="text"
                value={badgeName}
                onChange={(e) => setBadgeName(e.target.value)}
                placeholder="e.g. Organic, Best Seller, Premium"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 13px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  outline: "none",
                  fontSize: "14px",
                  color: "#1e293b",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                border: "none",
                background: "#172554",
                color: "#ffffff",
                borderRadius: "8px",
                padding: "11px 16px",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                cursor: "pointer",
              }}
            >
              <Plus size={17} />
              Add Badge
            </button>
          </form>
        </div>

        <div className="recent-orders-card">
          <div
            style={{
              padding: "20px 24px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#172554",
                }}
              >
                All Badges
              </h2>

              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: "12px",
                  color: "#64748b",
                }}
              >
                Active and inactive badges
              </p>
            </div>

            <div
              style={{
                background: "#f1f5f9",
                color: "#475569",
                padding: "6px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              {badges.length} Badges
            </div>
          </div>

          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>BADGE</th>
                  <th>STATUS</th>
                  <th style={{ textAlign: "center" }}>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#64748b",
                      }}
                    >
                      Loading badges...
                    </td>
                  </tr>
                ) : badges.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#64748b",
                      }}
                    >
                      No badges found
                    </td>
                  </tr>
                ) : (
                  badges.map((badge) => (
                    <tr key={badge._id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                          }}
                        >
                          <div
                            style={{
                              width: "34px",
                              height: "34px",
                              borderRadius: "8px",
                              background: "#fef3c7",
                              color: "#92400e",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Tag size={16} />
                          </div>

                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#1e293b",
                            }}
                          >
                            {badge.name}
                          </span>
                        </div>
                      </td>

                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            handleToggleStatus(badge)
                          }
                          style={{
                            border: "none",
                            borderRadius: "20px",
                            padding: "5px 9px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "600",
                            background: badge.isActive
                              ? "#dcfce7"
                              : "#f1f5f9",
                            color: badge.isActive
                              ? "#15803d"
                              : "#64748b",
                          }}
                        >
                          {badge.isActive ? (
                            <ToggleRight size={16} />
                          ) : (
                            <ToggleLeft size={16} />
                          )}

                          {badge.isActive
                            ? "Active"
                            : "Inactive"}
                        </button>
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "6px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              setViewBadge(badge)
                            }
                            title="View"
                            style={{
                              width: "32px",
                              height: "32px",
                              border: "1px solid #bfdbfe",
                              background: "#eff6ff",
                              color: "#2563eb",
                              borderRadius: "7px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(badge)
                            }
                            title="Edit"
                            style={{
                              width: "32px",
                              height: "32px",
                              border: "1px solid #fde68a",
                              background: "#fffbeb",
                              color: "#d97706",
                              borderRadius: "7px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(badge)
                            }
                            title="Delete"
                            style={{
                              width: "32px",
                              height: "32px",
                              border: "1px solid #fecaca",
                              background: "#fef2f2",
                              color: "#dc2626",
                              borderRadius: "7px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewBadge && (
        <div
          className="modal-overlay"
          onClick={() => setViewBadge(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Tag size={20} color="#4f46e5" />

                <h3
                  style={{
                    margin: 0,
                    fontSize: "17px",
                    color: "#172554",
                  }}
                >
                  Badge Details
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setViewBadge(null)}
                style={{
                  border: "none",
                  background: "#f1f5f9",
                  color: "#64748b",
                  width: "32px",
                  height: "32px",
                  borderRadius: "7px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={17} />
              </button>
            </div>

            <div
              style={{
                padding: "16px",
                borderRadius: "10px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            >
              <div style={{ marginBottom: "14px" }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Badge Name
                </span>

                <strong
                  style={{
                    fontSize: "15px",
                    color: "#1e293b",
                  }}
                >
                  {viewBadge.name}
                </strong>
              </div>

              <div>
                <span
                  style={{
                    display: "block",
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Status
                </span>

                <strong
                  style={{
                    fontSize: "14px",
                    color: viewBadge.isActive
                      ? "#15803d"
                      : "#64748b",
                  }}
                >
                  {viewBadge.isActive
                    ? "Active"
                    : "Inactive"}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingBadge && (
        <div
          className="modal-overlay"
          onClick={() => setEditingBadge(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "420px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "17px",
                  color: "#172554",
                }}
              >
                Edit Badge
              </h3>

              <button
                type="button"
                onClick={() => setEditingBadge(null)}
                style={{
                  border: "none",
                  background: "#f1f5f9",
                  color: "#64748b",
                  width: "32px",
                  height: "32px",
                  borderRadius: "7px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={17} />
              </button>
            </div>

            <form onSubmit={handleUpdateBadge}>
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "7px",
                    fontSize: "13px",
                    fontWeight: "600",
                    color: "#172554",
                  }}
                >
                  Badge Name *
                </label>

                <input
                  type="text"
                  value={editName}
                  onChange={(e) =>
                    setEditName(e.target.value)
                  }
                  autoFocus
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px 13px",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    outline: "none",
                    fontSize: "14px",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px",
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setEditingBadge(null)
                  }
                  style={{
                    padding: "9px 16px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5e1",
                    background: "#ffffff",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  style={{
                    padding: "9px 18px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#172554",
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBadges;