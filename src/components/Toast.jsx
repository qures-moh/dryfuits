import React from 'react';
import { useStore } from '../redux/useStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useStore();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let toastClass = 'toast-success';
        if (toast.type === 'error') {
          Icon = AlertCircle;
          toastClass = 'toast-error';
        } else if (toast.type === 'info') {
          Icon = Info;
          toastClass = 'toast-info';
        }

        return (
          <div key={toast.id} className={`toast-card ${toastClass}`}>
            <Icon size={18} className="toast-icon" />
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => removeToast(toast.id)}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
