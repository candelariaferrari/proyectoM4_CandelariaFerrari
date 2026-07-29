import { useState } from "react";
import { auth } from "../../services/firebase";
import type { Task } from "../../types/task";
import useTasks from "../../hooks/useTasks";
import useTaskActions from "../../hooks/useTaskActions";
import TaskList from "../../components/TaskList/TaskList";
import TaskForm, { type TaskFormData } from "../../components/TaskForm/TaskForm";
import Modal from "../../components/Modals/Modals";
import "./Task.css";

type FilterValue = "all" | "pending" | "completed";

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "completed", label: "Completadas" },
];


function Tasks() {

  const { tasks, loading, error } = useTasks(auth.currentUser?.uid);
  const { updateTask, deleteTask, toggleTask, pendingId } = useTaskActions();

  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [formModalTask, setFormModalTask] = useState<Task | null>(null)
  const [taskPendingDelete, setTaskPendingDelete] = useState<Task | null>(null);

  const handleToggle = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    await toggleTask(task);
  };

  const handleRequestDelete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) setTaskPendingDelete(task);
  };

  const isDeleting = taskPendingDelete ? pendingId === taskPendingDelete.id : false;

  const handleConfirmDelete = async () => {
    if (!taskPendingDelete) return;
    const ok = await deleteTask(taskPendingDelete);
    if (ok) setTaskPendingDelete(null);
  };

  const handleRequestEdit = (task: Task) => {
    setFormModalTask(task);
  };

  const handleFormSubmit = async (formData: TaskFormData) => {
    if (!formModalTask) return;
    const ok = await updateTask(formModalTask.id, formData);
    if (ok) setFormModalTask(null);
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

      {loading && (
        <div className="tasks-skeleton">
          <div className="skeleton tasks-skeleton__row" />
          <div className="skeleton tasks-skeleton__row" style={{ width: "94%" }} />
          <div className="skeleton tasks-skeleton__row" style={{ width: "97%" }} />
          <div className="skeleton tasks-skeleton__row" style={{ width: "90%" }} />
          <p className="tasks-skeleton__caption"><span />Cargando tus tareas…</p>
        </div>
      )}
      {error && <p className="tasks-page__error">{error}</p>}

      {!loading && !error && (
        <TaskList
          tasks={filteredTasks}
          onToggle={handleToggle}
          onEdit={handleRequestEdit}
          onDelete={handleRequestDelete}
          pendingTaskId={pendingId}
        />
      )}

      {formModalTask && (
        <Modal onClose={() => setFormModalTask(null)}>
          <h3>Editar tarea</h3>
          <TaskForm initialTask={formModalTask} onSubmit={handleFormSubmit} />
        </Modal>
      )}

      {taskPendingDelete && (
        <Modal onClose={() => { if (!isDeleting) setTaskPendingDelete(null); }}>
          <h3>¿Eliminar esta tarea?</h3>
          <p>Esta acción no se puede deshacer.</p>
          <div className="modal-box__task-preview">{taskPendingDelete.title}</div>
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setTaskPendingDelete(null)}
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Tasks;
