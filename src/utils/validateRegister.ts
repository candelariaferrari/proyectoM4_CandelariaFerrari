import type { RegisterFormState } from "../types/auth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MAX_NAME_LENGTH = 50;

export function validateRegister(form: RegisterFormState): string | null {
  // Nombre
  if (!form.name.trim()) {
    return "El nombre es obligatorio.";
  }

  if (/\d/.test(form.name)) {
    return "El nombre no puede contener números.";
  }

  if (!NAME_REGEX.test(form.name.trim())) {
    return "Ingresá un nombre válido.";
  }
  if (form.name.trim().length > MAX_NAME_LENGTH) {
    return `El nombre no puede tener más de ${MAX_NAME_LENGTH} caracteres.`;
  }
  // Apellido
  if (!form.lastname.trim()) {
    return "El apellido es obligatorio.";
  }

  if (/\d/.test(form.lastname)) {
    return "El apellido no puede contener números.";
  }

  if (!NAME_REGEX.test(form.lastname.trim())) {
    return "Ingresá un apellido válido.";
  }
  if (form.lastname.trim().length > MAX_NAME_LENGTH) {
    return `El apellido no puede tener más de ${MAX_NAME_LENGTH} caracteres.`;
  }

  // Email
  if (!form.email.trim()) {
    return "El email es obligatorio.";
  }

  if (!EMAIL_REGEX.test(form.email.trim())) {
    return "Ingresá un email válido.";
  }

  // Contraseña
  if (!form.password.trim()) {
    return "La contraseña es obligatoria.";
  }

  if (form.password.length < MIN_PASSWORD_LENGTH) {
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  // Confirmar contraseña
  if (!form.confirmPassword.trim()) {
    return "Confirmá tu contraseña.";
  }

  if (form.password !== form.confirmPassword) {
    return "Las contraseñas no coinciden.";
  }

  return null;
}