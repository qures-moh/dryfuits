
import React, { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  HelpCircle,
  Eye,
  Pencil,
  X,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useConfirm } from "../context/ConfirmContext";
import api from "../api/axios";

const Faqs = () => {
  const confirm = useConfirm();

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
  });

  const [newFaqErrors, setNewFaqErrors] = useState({
    question: "",
    answer: "",
  });

  const [faqToView, setFaqToView] = useState(null);
  const [faqToEdit, setFaqToEdit] = useState(null);

  const [editForm, setEditForm] = useState({
    question: "",
    answer: "",
  });

  const [editErrors, setEditErrors] = useState({
    question: "",
    answer: "",
  });

  const [isSaving, setIsSaving] = useState(false);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/faqs");
      setFaqs(res.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load FAQs";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const validateFaq = (form) => {
    const errors = {
      question: "",
      answer: "",
    };

    const question = form.question.trim();
    const answer = form.answer.trim();

    if (!question) {
      errors.question = "Question is required.";
    } else if (question.length < 5) {
      errors.question = "Question must be at least 5 characters.";
    } else if (question.length > 200) {
      errors.question = "Question cannot exceed 200 characters.";
    }

    if (!answer) {
      errors.answer = "Answer is required.";
    } else if (answer.length < 10) {
      errors.answer = "Answer must be at least 10 characters.";
    } else if (answer.length > 1000) {
      errors.answer = "Answer cannot exceed 1000 characters.";
    }

    return errors;
  };

  const hasErrors = (errors) => {
    return Object.values(errors).some((value) => value !== "");
  };

  const handleNewFaqChange = (field, value) => {
    setNewFaq((prev) => ({
      ...prev,
      [field]: value,
    }));

    setNewFaqErrors((prev) => ({
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

    const errors = validateFaq(newFaq);
    setNewFaqErrors(errors);

    if (hasErrors(errors)) {
      toast.error("Please fix the validation errors.");
      return;
    }

    try {
      const res = await api.post("/faqs", {
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim(),
      });

      setFaqs((prev) => [...prev, res.data]);

      setNewFaq({
        question: "",
        answer: "",
      });

      setNewFaqErrors({
        question: "",
        answer: "",
      });

      toast.success("FAQ added successfully!");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to add FAQ"
      );
    }
  };

  const handleOpenView = (faq) => {
    setFaqToView(faq);
  };

  const handleOpenEdit = (faq) => {
    setEditForm({
      question: faq.question || "",
      answer: faq.answer || "",
    });

    setEditErrors({
      question: "",
      answer: "",
    });

    setFaqToEdit(faq);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!faqToEdit) return;

    const errors = validateFaq(editForm);
    setEditErrors(errors);

    if (hasErrors(errors)) {
      toast.error("Please fix the validation errors.");
      return;
    }

    try {
      setIsSaving(true);

      const res = await api.put(`/faqs/${faqToEdit._id}`, {
        question: editForm.question.trim(),
        answer: editForm.answer.trim(),
      });

      const updated = res.data;

      setFaqs((prev) =>
        prev.map((f) =>
          f._id === updated._id ? updated : f
        )
      );

      toast.success("FAQ updated successfully!");
      setFaqToEdit(null);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to update FAQ"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id, question) => {
    const isConfirmed = await confirm({
      title: "Delete FAQ",
      message: question
        ? `Are you sure you want to delete the question "${question}"?`
        : "Are you sure you want to delete this FAQ question and answer?",
      confirmText: "Yes, Delete FAQ",
      variant: "danger",
      iconType: "trash",
    });

    if (!isConfirmed) return;

    try {
      await api.delete(`/faqs/${id}`);

      setFaqs((prev) =>
        prev.filter((f) => f._id !== id)
      );

      toast.success("FAQ deleted successfully.");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to delete FAQ"
      );
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            Frequently Asked Questions
          </h1>
          <p className="dashboard-subtitle">
            Manage FAQs displayed in the store review section
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

      <div className="admin-split-layout">
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
            Add New FAQ
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
              Question
            </label>

            <input
              type="text"
              placeholder="e.g. Do you offer gift hampers with custom ribbons?"
              value={newFaq.question}
              maxLength={200}
              onChange={(e) =>
                handleNewFaqChange(
                  "question",
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: newFaqErrors.question
                  ? "1px solid #dc2626"
                  : "1px solid #cbd5e1",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "5px",
              }}
            >
              {newFaqErrors.question ? (
                <p
                  style={{
                    color: "#dc2626",
                    fontSize: "12px",
                    margin: 0,
                  }}
                >
                  {newFaqErrors.question}
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
                {newFaq.question.length}/200
              </span>
            </div>
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
              Answer
            </label>

            <textarea
              rows="4"
              placeholder="Detailed answer for customers..."
              value={newFaq.answer}
              maxLength={1000}
              onChange={(e) =>
                handleNewFaqChange(
                  "answer",
                  e.target.value
                )
              }
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "8px",
                border: newFaqErrors.answer
                  ? "1px solid #dc2626"
                  : "1px solid #cbd5e1",
                resize: "vertical",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "5px",
              }}
            >
              {newFaqErrors.answer ? (
                <p
                  style={{
                    color: "#dc2626",
                    fontSize: "12px",
                    margin: 0,
                  }}
                >
                  {newFaqErrors.answer}
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
                {newFaq.answer.length}/1000
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
            Add FAQ
          </button>
        </form>

        <div className="recent-orders-card">
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th style={{ minWidth: "180px" }}>
                    QUESTION
                  </th>
                  <th>ANSWER</th>
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
                      colSpan="3"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                      }}
                    >
                      Loading FAQs...
                    </td>
                  </tr>
                ) : faqs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      style={{
                        textAlign: "center",
                        padding: "30px",
                        color: "#64748b",
                      }}
                    >
                      No FAQs added yet. Use the form on
                      the left to add one.
                    </td>
                  </tr>
                ) : (
                  faqs.map((f) => (
                    <tr key={f._id}>
                      <td
                        style={{
                          fontWeight: "600",
                          color: "#1e293b",
                          maxWidth: "220px",
                        }}
                      >
                        {f.question}
                      </td>

                      <td
                        style={{
                          maxWidth: "340px",
                          fontSize: "13px",
                          color: "#475569",
                        }}
                      >
                        {f.answer}
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
                            onClick={() =>
                              handleOpenView(f)
                            }
                            title="View FAQ"
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
                            onClick={() =>
                              handleOpenEdit(f)
                            }
                            title="Edit FAQ"
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
                              handleDelete(
                                f._id,
                                f.question
                              )
                            }
                            title="Delete FAQ"
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

      {faqToView && (
        <div
          className="modal-overlay"
          onClick={() => setFaqToView(null)}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "540px",
              width: "100%",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "#eff6ff",
                    color: "#1d4ed8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <HelpCircle size={20} />
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
                    FAQ Details
                  </h3>

                  <span
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                    }}
                  >
                    Store customer question
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setFaqToView(null)}
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
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  color: "#64748b",
                  marginBottom: "6px",
                }}
              >
                Question
              </div>

              <div
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#0f172a",
                  marginBottom: "14px",
                  lineHeight: 1.4,
                }}
              >
                {faqToView.question}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  color: "#64748b",
                  marginBottom: "6px",
                }}
              >
                Answer
              </div>

              <div
                style={{
                  fontSize: "13.5px",
                  color: "#334155",
                  lineHeight: 1.6,
                  whiteSpace: "pre-line",
                }}
              >
                {faqToView.answer}
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
                onClick={() => setFaqToView(null)}
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
                  const f = faqToView;
                  setFaqToView(null);
                  handleOpenEdit(f);
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
                Edit FAQ
              </button>
            </div>
          </div>
        </div>
      )}

      {faqToEdit && (
        <div
          className="modal-overlay"
          onClick={() =>
            !isSaving && setFaqToEdit(null)
          }
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "560px",
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
                Edit FAQ
              </h3>

              <button
                type="button"
                disabled={isSaving}
                onClick={() => setFaqToEdit(null)}
                style={{
                  background: "#f1f5f9",
                  border: "none",
                  color: "#64748b",
                  padding: "6px",
                  borderRadius: "6px",
                  cursor: isSaving
                    ? "not-allowed"
                    : "pointer",
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
                  Question *
                </label>

                <input
                  type="text"
                  value={editForm.question}
                  maxLength={200}
                  onChange={(e) =>
                    handleEditChange(
                      "question",
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: editErrors.question
                      ? "1px solid #dc2626"
                      : "1px solid #cbd5e1",
                    fontSize: "14px",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "5px",
                  }}
                >
                  {editErrors.question ? (
                    <p
                      style={{
                        color: "#dc2626",
                        fontSize: "12px",
                        margin: 0,
                      }}
                    >
                      {editErrors.question}
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
                    {editForm.question.length}/200
                  </span>
                </div>
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
                  Answer *
                </label>

                <textarea
                  rows="5"
                  value={editForm.answer}
                  maxLength={1000}
                  onChange={(e) =>
                    handleEditChange(
                      "answer",
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: editErrors.answer
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
                    marginTop: "5px",
                  }}
                >
                  {editErrors.answer ? (
                    <p
                      style={{
                        color: "#dc2626",
                        fontSize: "12px",
                        margin: 0,
                      }}
                    >
                      {editErrors.answer}
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
                    {editForm.answer.length}/1000
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
                  onClick={() => setFaqToEdit(null)}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #cbd5e1",
                    padding: "9px 16px",
                    borderRadius: "8px",
                    fontSize: "13.5px",
                    fontWeight: "600",
                    color: "#475569",
                    cursor: isSaving
                      ? "not-allowed"
                      : "pointer",
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
                    cursor: isSaving
                      ? "not-allowed"
                      : "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {isSaving ? (
                    <Loader2
                      size={15}
                      className="animate-spin"
                    />
                  ) : null}

                  {isSaving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faqs;
