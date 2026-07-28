import { useEffect, useState } from "react";
import {
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../services/firebase";
import type { Task } from "../../types/task";
import useTasks from "../../hooks/useTasks";
import TaskList from "../../components/TaskList/TaskList";
import TaskForm, { type TaskFormData } from "../../components/TaskForm/TaskForm";
import Modal from "../../components/Modals/Modals";
import Alert from "../../components/Alert/Alert";
import "./Task.css";

type FilterValue = "all" | "pending" | "completed";

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "completed", label: "Completadas" },
];


function Tasks() {

  const { tasks, loading, error } = useTasks(auth.currentUser?.uid);

  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [formModalTask, setFormModalTask] = useState<Task | null>(null)
  const [taskPendingDelete, setTaskPendingDelete] = useState<Task | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);


  const handleToggle = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        completed: !task.completed,
        updatedAt: serverTimestamp(),
      });
    } catch {
      setToast({ message: "No se pudo actualizar la tarea. Intentá de nuevo.", variant: "error" });
    }
  };

  const handleRequestDelete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) setTaskPendingDelete(task);
  };

  const handleConfirmDelete = async () => {
    if (!taskPendingDelete) return;
    const deletedTitle = taskPendingDelete.title;
    try {
      await deleteDoc(doc(db, "tasks", taskPendingDelete.id));
      setTaskPendingDelete(null);
      setToast({ message: `Tarea eliminada "${deletedTitle}"`, variant: "success" });
    } catch {
      setToast({ message: "No se pudo eliminar la tarea. Intentá de nuevo.", variant: "error" });
    }
  };

  const handleRequestEdit = (task: Task) => {
    setFormModalTask(task);
  };

  const handleFormSubmit = async (formData: TaskFormData) => {
    if (!formModalTask) return;
    try {
      await updateDoc(doc(db, "tasks", formModalTask.id), {
        title: formData.title,
        description: formData.description || null,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        updatedAt: serverTimestamp(),
      });
      setToast({ message: `Tarea actualizada "${formData.title}"`, variant: "success" });
      setFormModalTask(null);
    } catch {
      setToast({ message: "No se pudo guardar la tarea. Intentá de nuevo.", variant: "error" });
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "pending") return !task.completed;
    if (activeFilter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="tasks-page__content">
      <h2>Mis tareas</h2>

      <div className="filters">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            className={`filter${activeFilter === filter.value ? " active" : ""}`}
            onClick={() => setActiveFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading && <p>Cargando tareas...</p>}
      {error && <p className="tasks-page__error">{error}</p>}

      {!loading && !error && (
        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggle}
          onEdit={handleRequestEdit}
          onDelete={handleRequestDelete}
        />
      )}

      {formModalTask && (
        <Modal onClose={() => setFormModalTask(null)}>
          <h3>Editar tarea</h3>
          <TaskForm initialTask={formModalTask} onSubmit={handleFormSubmit} />
        </Modal>
      )}

      {taskPendingDelete && (
        <Modal onClose={() => setTaskPendingDelete(null)}>
          <h3>¿Eliminar esta tarea?</h3>
          <p>Esta acción no se puede deshacer.</p>
          <div className="modal-box__task-preview">{taskPendingDelete.title}</div>
          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={() => setTaskPendingDelete(null)}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>
              Eliminar
            </button>
          </div>
        </Modal>
      )}

      {toast && <Alert message={toast.message} variant={toast.variant} />}
    </div>
  );
}

export default Tasks;