
import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Star,
  Eye,
  Pencil,
  X,
  Loader2,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { useConfirm } from "../context/ConfirmContext";
import api from "../api/axios";

const Reviews = () => {
  const confirm = useConfirm();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newReview, setNewReview] = useState({
    name: "",
    role: "Verified Buyer",
    rating: 5,
    comment: "",
    date: "Recently",
  });

  const [newReviewErrors, setNewReviewErrors] = useState({
    name: "",
    role: "",
    rating: "",
    comment: "",
  });

  const [reviewToView, setReviewToView] = useState(null);
  const [reviewToEdit, setReviewToEdit] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    role: "",
    rating: 5,
    comment: "",
  });

  const [editErrors, setEditErrors] = useState({
    name: "",
    role: "",
    rating: "",
    comment: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/testimonials");
      setReviews(res.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load reviews";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const validateReview = (form) => {
    const errors = {
      name: "",
      role: "",
      rating: "",
      comment: "",
    };

    const name = form.name.trim();
    const role = form.role.trim();
    const comment = form.comment.trim();
    const rating = Number(form.rating);

    if (!name) {
      errors.name = "Customer name is required.";
    } else if (name.length < 2) {
      errors.name = "Customer name must be at least 2 characters.";
    } else if (name.length > 50) {
      errors.name = "Customer name cannot exceed 50 characters.";
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      errors.name = "Customer name can contain only letters and spaces.";
    }

    if (!role) {
      errors.role = "Role or location is required.";
    } else if (role.length < 2) {
      errors.role = "Role or location must be at least 2 characters.";
    } else if (role.length > 50) {
      errors.role = "Role or location cannot exceed 50 characters.";
    }

    if (!rating) {
      errors.rating = "Please select a rating.";
    } else if (rating < 1 || rating > 5) {
      errors.rating = "Rating must be between 1 and 5.";
    }

    if (!comment) {
      errors.comment = "Customer comment is required.";
    } else if (comment.length < 10) {
      errors.comment = "Comment must be at least 10 characters.";
    } else if (comment.length > 500) {
      errors.comment = "Comment cannot exceed 500 characters.";
    }

    return errors;
  };

  const hasErrors = (errors) => {
    return Object.values(errors).some((value) => value !== "");
  };

  const handleNewReviewChange = (field, value) => {
    setNewReview((prev) => ({
      ...prev,
      [field]: value,
    }));

    setNewReviewErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setEditErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    const errors = validateReview(newReview);
    setNewReviewErrors(errors);

    if (hasErrors(errors)) {
      toast.error("Please fix the validation errors.");
      return;
    }

    try {
      const res = await api.post("/testimonials", {
        ...newReview,
        name: newReview.name.trim(),
        role: newReview.role.trim(),
        comment: newReview.comment.trim(),
        rating: Number(newReview.rating),
      });

      setReviews((prev) => [...prev, res.data]);

      setNewReview({
        name: "",
        role: "Verified Buyer",
        rating: 5,
        comment: "",
        date: "Recently",
      });

      setNewReviewErrors({
        name: "",
        role: "",
        rating: "",
        comment: "",
      });

      toast.success("Testimonial added successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add review");
    }
  };

  const handleOpenView = (review) => {
    setReviewToView(review);
  };

  const handleOpenEdit = (review) => {
    setEditForm({
      name: review.name || "",
      role: review.role || "Verified Buyer",
      rating: review.rating || 5,
      comment: review.comment || "",
    });

    setEditErrors({
      name: "",
      role: "",
      rating: "",
      comment: "",
    });

    setReviewToEdit(review);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!reviewToEdit) return;

    const errors = validateReview(editForm);
    setEditErrors(errors);

    if (hasErrors(errors)) {
      toast.error("Please fix the validation errors.");
      return;
    }

    try {
      setIsSaving(true);

      const res = await api.put(`/testimonials/${reviewToEdit._id}`, {
        name: editForm.name.trim(),
        role: editForm.role.trim(),
        rating: Number(editForm.rating),
        comment: editForm.comment.trim(),
      });

      const updated = res.data;

      setReviews((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );

      toast.success("Customer review updated successfully!");
      setReviewToEdit(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update review"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    const isConfirmed = await confirm({
      title: "Delete Customer Review",
      message: `Are you sure you want to delete the testimonial from "${name}"? It will be permanently removed from the customer review showcase.`,
      confirmText: "Yes, Delete Review",
      variant: "danger",
      iconType: "trash",
    });

    if (!isConfirmed) return;

    try {
      await api.delete(`/testimonials/${id}`);

      setReviews((prev) => prev.filter((r) => r._id !== id));

      toast.success(`Review from "${name}" deleted.`);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete review"
      );
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Customer Reviews</h1>
          <p className="dashboard-subtitle">
            Manage testimonials and stories displayed on the landing page
          </p>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "24px",
        }}
      >
        <form
          onSubmit={handleAdd}
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            height: "fit-content",
          }}
        >
          <h3
            style={{
              marginBottom: "16px",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            Add Testimonial
          </h3>

          <div style={{ marginBottom: "14px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              Customer Name
            </label>

            <input
              type="text"
              placeholder="e.g. Priya Sharma"
              value={newReview.name}
              maxLength={50}
              onChange={(e) =>
                handleNewReviewChange("name", e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: newReviewErrors.name
                  ? "1px solid #dc2626"
                  : "1px solid #cbd5e1",
              }}
            />

            {newReviewErrors.name && (
              <p
                style={{
                  color: "#dc2626",
                  fontSize: "12px",
                  marginTop: "5px",
                  marginBottom: 0,
                }}
              >
                {newReviewErrors.name}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              Role / Location
            </label>

            <input
              type="text"
              placeholder="e.g. Verified Buyer, Mumbai"
              value={newReview.role}
              maxLength={50}
              onChange={(e) =>
                handleNewReviewChange("role", e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: newReviewErrors.role
                  ? "1px solid #dc2626"
                  : "1px solid #cbd5e1",
              }}
            />

            {newReviewErrors.role && (
              <p
                style={{
                  color: "#dc2626",
                  fontSize: "12px",
                  marginTop: "5px",
                  marginBottom: 0,
                }}
              >
                {newReviewErrors.role}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              Rating (1 to 5)
            </label>

            <select
              value={newReview.rating}
              onChange={(e) =>
                handleNewReviewChange(
                  "rating",
                  Number(e.target.value)
                )
              }
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: newReviewErrors.rating
                  ? "1px solid #dc2626"
                  : "1px solid #cbd5e1",
              }}
            >
              <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
              <option value="3">⭐⭐⭐ (3 Stars)</option>
              <option value="2">⭐⭐ (2 Stars)</option>
              <option value="1">⭐ (1 Star)</option>
            </select>

            {newReviewErrors.rating && (
              <p
                style={{
                  color: "#dc2626",
                  fontSize: "12px",
                  marginTop: "5px",
                  marginBottom: 0,
                }}
              >
                {newReviewErrors.rating}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "18px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontWeight: "600",
                fontSize: "13px",
              }}
            >
              Customer Comment
            </label>

            <textarea
              rows="4"
              placeholder="What did the customer say about the dry fruits or gifting hampers?"
              value={newReview.comment}
              maxLength={500}
              onChange={(e) =>
                handleNewReviewChange("comment", e.target.value)
              }
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: newReviewErrors.comment
                  ? "1px solid #dc2626"
                  : "1px solid #cbd5e1",
                resize: "vertical",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "4px",
              }}
            >
              {newReviewErrors.comment ? (
                <p
                  style={{
                    color: "#dc2626",
                    fontSize: "12px",
                    margin: 0,
                  }}
                >
                  {newReviewErrors.comment}
                </p>
              ) : (
                <span />
              )}

              <span
                style={{
                  fontSize: "11px",
                  color: "#64748b",
                }}
              >
                {newReview.comment.length}/500
              </span>
            </div>
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
              cursor: "pointer",
            }}
          >
            <Plus size={16} />
            Add Review
          </button>
        </form>

        <div className="recent-orders-card">
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>RATING</th>
                  <th>COMMENT</th>
                  <th
                    style={{
                      width: "120px",
                      textAlign: "center",
                    }}
                  >
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                      }}
                    >
                      Loading reviews...
                    </td>
                  </tr>
                ) : reviews.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#64748b",
                      }}
                    >
                      No testimonials added yet. Use the form to add one.
                    </td>
                  </tr>
                ) : (
                  reviews.map((r) => (
                    <tr key={r._id}>
                      <td>
                        <strong>{r.name}</strong>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#64748b",
                          }}
                        >
                          {r.role}
                        </div>
                      </td>

                      <td>
                        <span
                          style={{
                            color: "#f59e0b",
                            display: "flex",
                            alignItems: "center",
                            gap: "2px",
                            fontWeight: "600",
                            fontSize: "13px",
                          }}
                        >
                          <Star size={14} fill="#f59e0b" />
                          {r.rating}
                        </span>
                      </td>

                      <td style={{ maxWidth: "280px" }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "13px",
                            color: "#334155",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          "{r.comment}"
                        </p>
                      </td>

                      <td
                        style={{
                          textAlign: "center",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleOpenView(r)}
                            title="View Testimonial"
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

                          <button
                            type="button"
                            onClick={() => handleOpenEdit(r)}
                            title="Edit Testimonial"
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

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(r._id, r.name)
                            }
                            title="Delete Testimonial"
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

      {reviewToView && (
        <div
          className="modal-overlay"
          onClick={() => setReviewToView(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "520px",
              width: "100%",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "#e0f2fe",
                    color: "#0369a1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  {reviewToView.name ? (
                    reviewToView.name.charAt(0).toUpperCase()
                  ) : (
                    <User size={20} />
                  )}
                </div>

                <div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "700",
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    {reviewToView.name}
                  </h3>

                  <span
                    style={{
                      fontSize: "12.5px",
                      color: "#64748b",
                    }}
                  >
                    {reviewToView.role || "Customer"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setReviewToView(null)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  color: "#64748b",
                  padding: "6px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div
              style={{
                background: "#f8fafc",
                borderRadius: "10px",
                padding: "16px",
                border: "1px solid #e2e8f0",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  marginBottom: "12px",
                }}
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={
                      i < (reviewToView.rating || 5)
                        ? "#f59e0b"
                        : "#cbd5e1"
                    }
                    color={
                      i < (reviewToView.rating || 5)
                        ? "#f59e0b"
                        : "#cbd5e1"
                    }
                  />
                ))}

                <span
                  style={{
                    marginLeft: "8px",
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#0f172a",
                  }}
                >
                  {reviewToView.rating} out of 5 Stars
                </span>
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color: "#334155",
                  lineHeight: 1.6,
                  fontStyle: "italic",
                  whiteSpace: "pre-line",
                }}
              >
                "{reviewToView.comment}"
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => setReviewToView(null)}
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
                  const r = reviewToView;
                  setReviewToView(null);
                  handleOpenEdit(r);
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
                Edit Review
              </button>
            </div>
          </div>
        </div>
      )}

      {reviewToEdit && (
        <div
          className="modal-overlay"
          onClick={() => !isSaving && setReviewToEdit(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "520px",
              width: "100%",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "18px",
                borderBottom: "1px solid #f1f5f9",
                paddingBottom: "12px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Edit Testimonial
              </h3>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => setReviewToEdit(null)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  color: "#64748b",
                  padding: "6px",
                  borderRadius: "6px",
                  cursor: isSaving ? "not-allowed" : "pointer",
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div style={{ marginBottom: "14px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "#334155",
                  }}
                >
                  Customer Name *
                </label>

                <input
                  type="text"
                  value={editForm.name}
                  maxLength={50}
                  onChange={(e) =>
                    handleEditChange("name", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: editErrors.name
                      ? "1px solid #dc2626"
                      : "1px solid #cbd5e1",
                    fontSize: "14px",
                  }}
                />

                {editErrors.name && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "12px",
                      marginTop: "5px",
                      marginBottom: 0,
                    }}
                  >
                    {editErrors.name}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "#334155",
                  }}
                >
                  Role / Location
                </label>

                <input
                  type="text"
                  value={editForm.role}
                  maxLength={50}
                  onChange={(e) =>
                    handleEditChange("role", e.target.value)
                  }
                  placeholder="e.g. Verified Buyer, Bangalore"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: editErrors.role
                      ? "1px solid #dc2626"
                      : "1px solid #cbd5e1",
                    fontSize: "14px",
                  }}
                />

                {editErrors.role && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "12px",
                      marginTop: "5px",
                      marginBottom: 0,
                    }}
                  >
                    {editErrors.role}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "14px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "#334155",
                  }}
                >
                  Rating (1 to 5 Stars)
                </label>

                <select
                  value={editForm.rating}
                  onChange={(e) =>
                    handleEditChange(
                      "rating",
                      Number(e.target.value)
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: editErrors.rating
                      ? "1px solid #dc2626"
                      : "1px solid #cbd5e1",
                    fontSize: "14px",
                  }}
                >
                  <option value="5">
                    ⭐⭐⭐⭐⭐ (5 Stars - Exceptional)
                  </option>
                  <option value="4">
                    ⭐⭐⭐⭐ (4 Stars - Very Good)
                  </option>
                  <option value="3">
                    ⭐⭐⭐ (3 Stars - Average)
                  </option>
                  <option value="2">⭐⭐ (2 Stars)</option>
                  <option value="1">⭐ (1 Star)</option>
                </select>

                {editErrors.rating && (
                  <p
                    style={{
                      color: "#dc2626",
                      fontSize: "12px",
                      marginTop: "5px",
                      marginBottom: 0,
                    }}
                  >
                    {editErrors.rating}
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontWeight: "600",
                    fontSize: "13px",
                    color: "#334155",
                  }}
                >
                  Customer Comment *
                </label>

                <textarea
                  rows="4"
                  value={editForm.comment}
                  maxLength={500}
                  onChange={(e) =>
                    handleEditChange("comment", e.target.value)
                  }
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: editErrors.comment
                      ? "1px solid #dc2626"
                      : "1px solid #cbd5e1",
                    fontSize: "13.5px",
                    resize: "vertical",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "4px",
                  }}
                >
                  {editErrors.comment ? (
                    <p
                      style={{
                        color: "#dc2626",
                        fontSize: "12px",
                        margin: 0,
                      }}
                    >
                      {editErrors.comment}
                    </p>
                  ) : (
                    <span />
                  )}

                  <span
                    style={{
                      fontSize: "11px",
                      color: "#64748b",
                    }}
                  >
                    {editForm.comment.length}/500
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setReviewToEdit(null)}
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
                  {isSaving ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : null}
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

export default Reviews;