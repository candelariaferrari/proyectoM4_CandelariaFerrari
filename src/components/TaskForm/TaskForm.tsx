import { validateTask } from "../../utils/validateTask";
import type { TaskPriority, Task } from "../../types/task";
import "./TaskForm.css"
import { useState } from "react";

type SubmitStatus = "idle" | "loading" | "success" | "error";

export interface TaskFormState {
    title: string;
    description: string;
    priority: TaskPriority | ""; //vacio hasta el usuario elige 
    dueDate: string;
}
//para onAddTask
export interface TaskFormData {
    title: string;
    description: string;
    priority: TaskPriority; //ya paso validación por eso es TaskPriority
    dueDate?: string;
}

interface TaskFormProps {
    initialTask?: Task;
    // onSubmit puede devolver una promesa: el form espera a que termine
    // (crear/editar de verdad en Firestore) para mostrar "Guardando..." y
    // recién ahí volver a habilitarse.
    onSubmit: (formData: TaskFormData) => void | Promise<void>;
}

const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
    { value: "high", label: "Alta" },
    { value: "medium", label: "Media" },
    { value: "low", label: "Baja" },
];

function toDateInputValue(date?: Date): string {
    if (!date) return "";
    return date.toISOString().slice(0, 10);
}

function TaskForm({ initialTask, onSubmit }: TaskFormProps) {
    //pasamos una función en vez de un valor directo , react la ejecuta una sola vez 
    const [form, setForm] = useState<TaskFormState>(() =>
        initialTask
            ? {
                  title: initialTask.title,
                  description: initialTask.description ?? "",
                  priority: initialTask.priority,
                  dueDate: toDateInputValue(initialTask.dueDate),
              }
            : { title: "", description: "", priority: "", dueDate: "" }
    );
    const [errors, setErrors] = useState<Partial<Record<keyof TaskFormState, string>>>({});
    const [status, setStatus] = useState<SubmitStatus>("idle");

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const validation = validateTask(form);

        if (Object.keys(validation).length > 0) {
            setErrors(validation);
            return;
        }

        setErrors({});
        setStatus("loading");

        try {
            await onSubmit({
                title: form.title.trim(),
                description: form.description.trim(),
                priority: form.priority as TaskPriority,
                dueDate: form.dueDate || undefined,
            });
        } finally {
            // Si onSubmit tuvo éxito, el modal que envuelve este form se
            // cierra y el componente se desmonta (esto no llega a pintarse).
            // Si falló, esto reabilita el formulario para reintentar.
            setStatus("idle");
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handlePriorityClick = (value: TaskPriority) => {
        setForm((prev) => ({ ...prev, priority: value }))
    }

    return (
        <form className="task-form" onSubmit={handleSubmit} noValidate>
            <div className="task-form__field">
                <input
                    className="task-form__input"
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Titulo de la tarea"
                    disabled={status === "loading"}
                />
                {errors.title && <p className="task-form__error">{errors.title}</p>}
            </div>

            <div className="task-form__field">
                <textarea
                    className="task-form__textarea"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Descripcion (opcional)"
                    rows={2}
                    disabled={status === "loading"}
                />
                {errors.description && <p className="task-form__error">{errors.description}</p>}
            </div>

            <div className="task-form__field">
                <div className="task-form__priority-group">
                    {PRIORITY_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            className={`task-form__priority-option task-form__priority-option--${option.value}${form.priority === option.value ? " task-form__priority-option--selected" : ""}`}
                            onClick={() => handlePriorityClick(option.value)}
                            disabled={status === "loading"}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                {errors.priority && <p className="task-form__error">{errors.priority}</p>}
            </div>

            <div className="task-form__field">
                <input
                    className="task-form__input"
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    disabled={status === "loading"}
                />
                {errors.dueDate && <p className="task-form__error">{errors.dueDate}</p>}
            </div>

            <button
                className={`task-form__btn${status === "loading" ? " task-form__btn--loading" : ""}`}
                type="submit"
                disabled={status === "loading"}>
                {status === "loading"
                    ? "Guardando..."
                    : initialTask ? "Guardar cambios" : "Agregar tarea"}
            </button>
        </form>
    )
}

export default TaskForm;
