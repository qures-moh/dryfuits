import React, { useEffect, useState } from "react";
import { Plus, Trash2, Tag, AlertCircle, Eye, Pencil, X, Loader2, Sparkles, Gift, Nut, Sun, Heart, Flame } from "lucide-react";
import toast from "react-hot-toast";
import { useConfirm } from "../context/ConfirmContext";
import api from "../api/axios";

const Categories = () => {
  const confirm = useConfirm();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newCat, setNewCat] = useState({ categoryId: "", name: "", icon: "Sparkles" });

  // View & Edit states
  const [catToView, setCatToView] = useState(null);
  const [catToEdit, setCatToEdit] = useState(null);
  const [editForm, setEditForm] = useState({ categoryId: "", name: "", icon: "Sparkles" });
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setCategories(res.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load categories";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCat.categoryId.trim() || !newCat.name.trim()) {
      toast.error("Please enter category ID and name.");
      return;
    }

    try {
      const res = await api.post("/categories", newCat);
      setCategories((prev) => [...prev, res.data]);
      setNewCat({ categoryId: "", name: "", icon: "Sparkles" });
      toast.success("Category added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  };

  const handleOpenView = (cat) => {
    setCatToView(cat);
  };

  const handleOpenEdit = (cat) => {
    setEditForm({
      categoryId: cat.categoryId || "",
      name: cat.name || "",
      icon: cat.icon || "Sparkles",
    });
    setCatToEdit(cat);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!catToEdit) return;

    if (!editForm.categoryId.trim() || !editForm.name.trim()) {
      toast.error("Please enter category ID and name.");
      return;
    }

    try {
      setIsSaving(true);
      const res = await api.put(`/categories/${catToEdit._id}`, {
        categoryId: editForm.categoryId.trim().toLowerCase().replace(/\s+/g, "-"),
        name: editForm.name.trim(),
        icon: editForm.icon,
      });
      const updated = res.data;
      setCategories((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      toast.success("Category updated successfully!");
      setCatToEdit(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update category");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    const isConfirmed = await confirm({
      title: "Delete Category",
      message: `Are you sure you want to delete category "${name}"? Products under this category might lose their collection link.`,
      confirmText: "Yes, Delete Category",
      variant: "danger",
      iconType: "trash",
    });

    if (!isConfirmed) return;

    try {
      await api.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
      toast.success(`Category "${name}" deleted.`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  const renderCategoryIcon = (iconName, size = 16) => {
    switch (iconName?.toLowerCase()) {
      case "gift":
        return <Gift size={size} />;
      case "nut":
        return <Nut size={size} />;
      case "sun":
        return <Sun size={size} />;
      case "heart":
        return <Heart size={size} />;
      case "flame":
        return <Flame size={size} />;
      case "sparkles":
      default:
        return <Sparkles size={size} />;
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Categories</h1>
          <p className="dashboard-subtitle">Manage store categories displayed on the landing page</p>
        </div>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "12px 16px", borderRadius: "8px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      <div className="admin-split-layout">
        <form onSubmit={handleAdd} style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", height: "fit-content" }}>
          <h3 style={{ marginBottom: "16px", fontSize: "16px", fontWeight: "600" }}>Add Category</h3>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px" }}>
              Slug ID (e.g. berries-raisins)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. exotic-chocolates"
              value={newCat.categoryId}
              onChange={(e) => setNewCat({ ...newCat, categoryId: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px" }}>
              Display Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Exotic Chocolates"
              value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px" }}>
              Icon Type
            </label>
            <select
              value={newCat.icon}
              onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
              style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1" }}
            >
              <option value="Sparkles">Sparkles</option>
              <option value="Gift">Gift</option>
              <option value="Nut">Nut</option>
              <option value="Sun">Sun</option>
              <option value="Heart">Heart</option>
              <option value="Flame">Flame</option>
            </select>
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              background: "#172554",
              color: "#ffffff",
              padding: "10px",
              borderRadius: "8px",
              fontWeight: "600",
              border: "none",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Plus size={16} />
            Add Category
          </button>
        </form>

        <div className="recent-orders-card">
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>SLUG ID</th>
                  <th>NAME</th>
                  <th>ICON</th>
                  <th style={{ width: "120px", textAlign: "center" }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "30px" }}>Loading categories...</td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center", padding: "30px", color: "#64748b" }}>
                      No categories found. Use the form to add one.
                    </td>
                  </tr>
                ) : (
                  categories.map((c) => (
                    <tr key={c._id}>
                      <td><code>{c.categoryId}</code></td>
                      <td><strong>{c.name}</strong></td>
                      <td>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "#f1f5f9", padding: "4px 9px", borderRadius: "6px", fontSize: "13px", color: "#334155" }}>
                          {renderCategoryIcon(c.icon, 14)}
                          {c.icon}
                        </span>
                      </td>
                      <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          {/* View */}
                          <button
                            type="button"
                            onClick={() => handleOpenView(c)}
                            title="View Category"
                            style={{
                              background: "#eff6ff",
                              border: "1px solid #bfdbfe",
                              color: "#1d4ed8",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          >
                            <Eye size={14} />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(c)}
                            title="Edit Category"
                            style={{
                              background: "#fef3c7",
                              border: "1px solid #fde68a",
                              color: "#b45309",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          >
                            <Pencil size={14} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(c._id, c.name)}
                            title="Delete Category"
                            style={{
                              background: "#fee2e2",
                              border: "1px solid #fecaca",
                              color: "#dc2626",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={14} />
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

      {/* ======================================================================
          View Category Modal
          ====================================================================== */}
      {catToView && (
        <div className="modal-overlay" onClick={() => setCatToView(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "480px", width: "100%", padding: "24px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#fef3c7", color: "#b45309", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {renderCategoryIcon(catToView.icon, 22)}
                </div>
                <div>
                  <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                    {catToView.name}
                  </h3>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Category Details</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCatToView(null)}
                style={{ background: "#f1f5f9", border: "none", color: "#64748b", padding: "6px", borderRadius: "6px", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "16px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>Slug ID</span>
                  <code style={{ fontSize: "13px", fontWeight: "700", color: "#1e293b" }}>{catToView.categoryId}</code>
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#64748b", display: "block" }}>Icon Name</span>
                  <strong style={{ fontSize: "13px", color: "#1e293b" }}>{catToView.icon || "Sparkles"}</strong>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setCatToView(null)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "13.5px",
                  fontWeight: "600",
                  color: "#475569",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const c = catToView;
                  setCatToView(null);
                  handleOpenEdit(c);
                }}
                style={{
                  background: "#172554",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "8px",
                  fontSize: "13.5px",
                  fontWeight: "600",
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Pencil size={14} />
                Edit Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================
          Edit Category Modal
          ====================================================================== */}
      {catToEdit && (
        <div className="modal-overlay" onClick={() => !isSaving && setCatToEdit(null)}>
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "480px", width: "100%", padding: "24px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                Edit Category
              </h3>
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setCatToEdit(null)}
                style={{ background: "#f1f5f9", border: "none", color: "#64748b", padding: "6px", borderRadius: "6px", cursor: isSaving ? "not-allowed" : "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px", color: "#334155" }}>
                  Slug ID *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.categoryId}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, categoryId: e.target.value.toLowerCase().replace(/\s+/g, "-") }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                />
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px", color: "#334155" }}>
                  Display Name *
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", fontSize: "13px", color: "#334155" }}>
                  Icon Type
                </label>
                <select
                  value={editForm.icon}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, icon: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px" }}
                >
                  <option value="Sparkles">Sparkles</option>
                  <option value="Gift">Gift</option>
                  <option value="Nut">Nut</option>
                  <option value="Sun">Sun</option>
                  <option value="Heart">Heart</option>
                  <option value="Flame">Flame</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setCatToEdit(null)}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "9px 16px",
                    borderRadius: "8px",
                    fontSize: "13.5px",
                    fontWeight: "600",
                    color: "#475569",
                    cursor: isSaving ? "not-allowed" : "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{
                    background: "#172554",
                    border: "none",
                    padding: "9px 20px",
                    borderRadius: "8px",
                    fontSize: "13.5px",
                    fontWeight: "600",
                    color: "#ffffff",
                    cursor: isSaving ? "not-allowed" : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {isSaving ? <Loader2 size={15} className="animate-spin" /> : null}
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
