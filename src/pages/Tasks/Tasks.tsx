import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import type { Task } from "../../types/task";
import TaskList from "../../components/TaskList/TaskList";
import TaskForm, { type TaskFormData } from "../../components/TaskForm/TaskForm";
import Modal from "../../components/Modals/Modals";
import Alert from "../../components/Alert/Alert";
import "./Task.css";

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    userId: "user-demo",
    title: "Diseño UI Dashboard",
    description: "Definir estructura de pantallas y paleta final.",
    priority: "high",
    completed: false,
    dueDate: new Date("2026-07-26"),
    createdAt: new Date("2026-07-20"),
    updatedAt: new Date("2026-07-20"),
  },
  {
    id: "2",
    userId: "user-demo",
    title: "Revisión de métricas semanales",
    priority: "medium",
    completed: false,
    dueDate: new Date("2026-07-27"),
    createdAt: new Date("2026-07-21"),
    updatedAt: new Date("2026-07-21"),
  },
  {
    id: "3",
    userId: "user-demo",
    title: "Actualizar foto de perfil",
    priority: "low",
    completed: false,
    createdAt: new Date("2026-07-22"),
    updatedAt: new Date("2026-07-22"),
  },
  {
    id: "4",
    userId: "user-demo",
    title: "Enviar propuesta a cliente",
    description: "Propuesta con presupuesto y cronograma.",
    priority: "medium",
    completed: true,
    dueDate: new Date("2026-07-25"),
    createdAt: new Date("2026-07-18"),
    updatedAt: new Date("2026-07-25"),
  },
];

type FilterValue = "all" | "pending" | "completed";

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "completed", label: "Completadas" },
];

type LayoutContext = { newTaskRequestedAt: number };

function Tasks() {
  const { newTaskRequestedAt } = useOutletContext<LayoutContext>(); //leemos el valor de newTaskRequestedAt, a traves de oulet del applayout
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");
  const [formModalTask, setFormModalTask] = useState<Task | "new" | null>(null); //unión discriminada, una sola variable que puede ser 3 cosas distintas
  const [taskPendingDelete, setTaskPendingDelete] = useState<Task | null>(null);
  const [toast, setToast] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (newTaskRequestedAt === 0) return;
    setFormModalTask("new");
  }, [newTaskRequestedAt]);

  const handleToggle = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleRequestDelete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) setTaskPendingDelete(task);
  };

  const handleConfirmDelete = () => {
    if (!taskPendingDelete) return;
    const deletedTitle = taskPendingDelete.title;
    setTasks((prev) => prev.filter((task) => task.id !== taskPendingDelete.id));
    setTaskPendingDelete(null);
    setToast({ message: `Tarea eliminada exitosamente "${deletedTitle}"`, variant: "success" });
  };

  const handleRequestEdit = (task: Task) => {
    setFormModalTask(task);
  };

  const handleFormSubmit = (formData: TaskFormData) => {
    if (formModalTask && formModalTask !== "new") {
      const editingId = formModalTask.id;
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingId
            ? {
              ...task,
              title: formData.title,
              description: formData.description || undefined,
              priority: formData.priority,
              dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
              updatedAt: new Date(),
            }
            : task
        )
      );
       setToast({ message: `Tarea actualizada "${formData.title}"`, variant: "success" });
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(), //genera un ID único al crear una tarea nueva
        userId: "user-demo",
        title: formData.title,
        description: formData.description || undefined,
        priority: formData.priority,
        completed: false,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTasks((prev) => [newTask, ...prev]);
      setToast({ message: `Tarea creada "${formData.title}"`, variant: "success" });
    }
    setFormModalTask(null);
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

      <TaskList
        tasks={filteredTasks}
        onToggle={handleToggle}
        onEdit={handleRequestEdit}
        onDelete={handleRequestDelete}
      />

      {formModalTask && (
        <Modal onClose={() => setFormModalTask(null)}>
          <h3>{formModalTask === "new" ? "Nueva tarea" : "Editar tarea"}</h3>
          <TaskForm
            initialTask={formModalTask === "new" ? undefined : formModalTask}
            onSubmit={handleFormSubmit}
          />
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