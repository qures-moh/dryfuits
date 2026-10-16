import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react";
import { AlertTriangle, Trash2, LogOut, HelpCircle, X } from "lucide-react";

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
    confirmText: "Yes, Delete",
    cancelText: "Cancel",
    variant: "danger", // 'danger' | 'warning' | 'primary'
    iconType: "trash", // 'trash' | 'warning' | 'logout' | 'help'
  });

  const resolverRef = useRef(null);

  const confirm = useCallback(
    ({
      title = "Confirm Deletion",
      message = "Are you sure you want to delete this item? This action cannot be undone.",
      confirmText = "Yes, Delete",
      cancelText = "Cancel",
      variant = "danger",
      iconType = "trash",
    } = {}) => {
      return new Promise((resolve) => {
        resolverRef.current = resolve;
        setModalState({
          isOpen: true,
          title,
          message,
          confirmText,
          cancelText,
          variant,
          iconType,
        });
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleCancel = useCallback(() => {
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  // Listen for Escape key
  useEffect(() => {
    if (!modalState.isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalState.isOpen, handleCancel]);

  const renderIcon = () => {
    if (modalState.iconType === "logout") {
      return <LogOut size={22} />;
    }
    if (modalState.iconType === "warning") {
      return <AlertTriangle size={22} />;
    }
    if (modalState.iconType === "help") {
      return <HelpCircle size={22} />;
    }
    return <Trash2 size={22} />;
  };

  const getIconStyles = () => {
    if (modalState.variant === "warning") {
      return {
        bg: "#fef3c7",
        border: "#fde68a",
        color: "#d97706",
      };
    }
    if (modalState.variant === "primary") {
      return {
        bg: "#eff6ff",
        border: "#bfdbfe",
        color: "#2563eb",
      };
    }
    // danger
    return {
      bg: "#fee2e2",
      border: "#fecaca",
      color: "#dc2626",
    };
  };

  const getConfirmButtonStyles = () => {
    if (modalState.variant === "warning") {
      return {
        background: "#d97706",
        boxShadow: "0 2px 4px rgba(217, 119, 6, 0.2)",
      };
    }
    if (modalState.variant === "primary") {
      return {
        background: "#172554",
        boxShadow: "0 2px 4px rgba(23, 37, 84, 0.2)",
      };
    }
    return {
      background: "#dc2626",
      boxShadow: "0 2px 4px rgba(220, 38, 38, 0.2)",
    };
  };

  const iconStyles = getIconStyles();
  const confirmBtnStyles = getConfirmButtonStyles();

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {modalState.isOpen && (
        <div
          className="modal-overlay"
          onClick={handleCancel}
          role="dialog"
          aria-modal="true"
          style={{ zIndex: 9999 }}
        >
          <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "460px",
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 20px 25px -5px rgba(15, 23, 42, 0.25), 0 8px 10px -6px rgba(15, 23, 42, 0.1)",
              position: "relative",
            }}
          >
            {/* Close 'X' Button in header */}
            <button
              type="button"
              onClick={handleCancel}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.15s ease",
              }}
              aria-label="Close"
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0f172a")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              <X size={18} />
            </button>

            {/* Header with Icon */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                marginBottom: "16px",
                paddingRight: "24px",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: iconStyles.bg,
                  border: `1px solid ${iconStyles.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: iconStyles.color,
                  flexShrink: 0,
                }}
              >
                {renderIcon()}
              </div>

              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: "17px",
                    fontWeight: "700",
                    color: "#0f172a",
                    margin: "0 0 6px 0",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {modalState.title}
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: "#475569",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {modalState.message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "24px",
                paddingTop: "16px",
                borderTop: "1px solid #f1f5f9",
              }}
            >
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  background: "#ffffff",
                  border: "1px solid #cbd5e1",
                  padding: "9px 18px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#475569",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.borderColor = "#94a3b8";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#ffffff";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
              >
                {modalState.cancelText}
              </button>

              <button
                type="button"
                autoFocus
                onClick={handleConfirm}
                style={{
                  ...confirmBtnStyles,
                  border: "none",
                  padding: "9px 20px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "opacity 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.92")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                {renderIcon()}
                {modalState.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};
