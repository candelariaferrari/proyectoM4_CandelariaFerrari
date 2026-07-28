import { useCallback, useRef, useState, type ReactNode } from "react";
import Alert from "../Alert/Alert";
import { ToastContext, type ToastData } from "../../hooks/useToast";

interface ToastProviderProps {
  children: ReactNode;
}

const TOAST_DURATION_MS = 3000;

// Guarda el toast activo y lo muestra con Alert, en un solo lugar.
// Antes cada pantalla (AppLayout, Tasks) tenia su propio estado de toast por
// separado (y AppLayout directamente no tenia ninguno); ahora se comparte.
function ToastProvider({ children }: ToastProviderProps) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((data: ToastData) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(data);
    timerRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Alert message={toast.message} variant={toast.variant} />}
    </ToastContext.Provider>
  );
}

export default ToastProvider;
