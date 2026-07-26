import type { TaskFormState } from "../components/TaskForm/TaskForm";

const MIN_TITLE_LENGTH = 3;
const MAX_TITLE_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 200;

export function validateTask(
  form: TaskFormState
): Partial<Record<keyof TaskFormState, string>> {

  const errors: Partial<Record<keyof TaskFormState, string>> = {};

  // Título
  if (!form.title.trim()) {
    errors.title = "El título es obligatorio.";
  } else if (form.title.trim().length < MIN_TITLE_LENGTH) {
    errors.title = `El título debe tener al menos ${MIN_TITLE_LENGTH} caracteres.`;
  } else if (form.title.trim().length > MAX_TITLE_LENGTH) {
    errors.title = `El título no puede superar los ${MAX_TITLE_LENGTH} caracteres.`;
  }

  // Descripción
  if (
    form.description &&
    form.description.trim().length > MAX_DESCRIPTION_LENGTH
  ) {
    errors.description = `La descripción no puede superar los ${MAX_DESCRIPTION_LENGTH} caracteres.`;
  }

  // Prioridad
  if (!form.priority) {
    errors.priority = "Seleccioná una prioridad.";
  }

  // Fecha
  if (form.dueDate) {
    const selectedDate = new Date(form.dueDate);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      errors.dueDate = "La fecha no puede ser anterior a hoy.";
    }
  }

  return errors;
}