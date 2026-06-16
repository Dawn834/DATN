import { createContext, useContext, useState, useCallback } from "react"
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react"
import "./Toast.scss"

const ToastContext = createContext(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast-item toast-item--${toast.type}`}>
            <div className="toast-item__icon">
              {toast.type === "success" && <CheckCircle2 size={18} className="text-emerald-400" />}
              {toast.type === "error" && <AlertCircle size={18} className="text-red-400" />}
              {toast.type === "info" && <Info size={18} className="text-blue-400" />}
            </div>
            <div className="toast-item__content">{toast.message}</div>
            <button onClick={() => removeToast(toast.id)} className="toast-item__close">
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
