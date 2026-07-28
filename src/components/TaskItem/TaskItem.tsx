import { useEffect, useRef, useState } from "react";
import type { Task } from "../../types/task";
import "./TaskItem.css";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  // true mientras esta tarea puntual tiene una escritura en curso
  pending?: boolean;
}

const PRIORITY_LABEL: Record<Task["priority"], string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

function TaskItem({ task, onToggle, onEdit, onDelete, pending = false }: TaskItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleEditClick = () => {
    setIsMenuOpen(false);
    onEdit();
  };

  const handleDeleteClick = () => {
    setIsMenuOpen(false);
    onDelete();
  };

  return (
    <li
      className={`task-item task-item--${task.priority}${task.completed ? " task-item--done" : ""}`}
      // Feedback minimo de "esto esta guardando" mientras se resuelve la
      // escritura en Firestore. El estilo final (spinner, animacion, etc.)
      // queda para la pasada de CSS.
      style={pending ? { opacity: 0.5, pointerEvents: "none" } : undefined}
    >
      <input
        className={`task-item__checkbox task-item__checkbox--${task.priority}`}
        type="checkbox"
        checked={task.completed}
        onChange={onToggle}
        disabled={pending}
      />

      <div className="task-item__content">
        <span className="task-item__title">{task.title}</span>

        {task.description && (
          <p className="task-item__description">{task.description}</p>
        )}

        <div className="task-item__meta">
          {task.completed ? (
            <span className="task-item__completed-label">✓ Completada</span>
          ) : (
            <span className="task-item__date">
              {task.dueDate ? task.dueDate.toLocaleDateString("es-AR") : "Sin fecha"}
            </span>
          )}
        </div>
      </div>

      <span className={`task-item__priority task-item__priority--${task.priority}`}>
        {PRIORITY_LABEL[task.priority]}
      </span>

      <div className="task-item__menu" ref={menuRef}>
        <button
          type="button"
          className="task-item__kebab"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Más opciones"
          disabled={pending}
        >
          ⋮
        </button>

        {isMenuOpen && (
          <div className="task-item__dropdown">
            <button type="button" onClick={handleEditClick}>
              Editar
            </button>
            <button type="button" className="task-item__dropdown-danger" onClick={handleDeleteClick}>
              Eliminar
            </button>
          </div>
        )}
      </div>
    </li>
  );
}

export default TaskItem;