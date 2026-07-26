import type { LoginFormState } from "../types/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(form: LoginFormState): string | null {
  if (!form.email.trim() || !form.password.trim()) {
    return "Completá email y contraseña.";
  }

  if (!EMAIL_REGEX.test(form.email.trim())) {
    return "Ingresá un email válido.";
  }

  return null;
}


/* No se valida la contraseña porque ya lo hace firebase */