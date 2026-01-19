"use client"

import * as React from "react"
import { CheckCircle, X } from "lucide-react"

interface ToastContextValue {
  toast: (message: string, type?: "success" | "error") => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) throw new Error("useToast must be used within ToastProvider")
  return context
}

interface Toast {
  id: string
  message: string
  type: "success" | "error"
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  
  const toast = React.useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, message, type }])
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])
  
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }
  
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-lg border border-slate-200 animate-in slide-in-from-right-full"
          >
            {t.type === "success" && (
              <CheckCircle className="h-5 w-5 text-brand-600 flex-shrink-0" />
            )}
            <p className="text-sm font-medium text-slate-900">{t.message}</p>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
