import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { createContext, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

const icons = {
  success: CheckCircle2,
  error: TriangleAlert,
  info: Info,
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const notify = ({ title = "Notice", message, type = "info" }) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, title, message, type }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3400);
  };

  const value = useMemo(() => ({ notify }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-20 z-[90] flex w-[min(92vw,360px)] flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => {
            const Icon = icons[toast.type] || Info;

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 24, y: -12 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-auto rounded-[24px] border border-soft bg-[rgba(var(--surface-strong),0.94)] p-4 shadow-soft backdrop-blur-xl"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-[rgba(var(--accent),0.12)] p-2 text-[rgb(var(--accent))]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{toast.title}</p>
                    <p className="text-sm text-soft">{toast.message}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return context;
};

