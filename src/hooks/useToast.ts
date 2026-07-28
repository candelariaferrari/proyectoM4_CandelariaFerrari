import { createContext, useContext } from "react";

export interface ToastData {
  message: string;
  variant: "success" | "error";
}

export interface ToastContextValue {
  showToast: (toast: ToastData) => void;
}

export const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

// hook para que cualquier componente/hook pueda disparar un toast
export function useToast() {
  return useContext(ToastContext);
}
