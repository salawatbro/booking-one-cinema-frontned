import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const getBackgroundColor = (type: ToastType): string => {
    switch (type) {
      case 'success': return 'var(--success)';
      case 'error': return 'var(--danger)';
      case 'info': return 'var(--bg-secondary)';
    }
  };

  const getTextColor = (type: ToastType): string => {
    switch (type) {
      case 'success': return '#ffffff';
      case 'error': return '#ffffff';
      case 'info': return 'var(--text)';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed left-1/2 z-[10000] flex flex-col items-center"
        style={{ top: 12, gap: 8, pointerEvents: 'none', maxWidth: 768, width: '100%', transform: 'translateX(-50%)' }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              backgroundColor: getBackgroundColor(toast.type),
              color: getTextColor(toast.type),
              maxWidth: 'calc(100vw - 32px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              animation: 'toast-slide-in 0.25s ease-out',
              pointerEvents: 'auto',
            }}
          >
            <span className="text-[13px] font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
