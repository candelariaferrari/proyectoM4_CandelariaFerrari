import { useState } from "react";
import type { Task } from "../../types/task";
import TaskList from "../../components/TaskList/TaskList";
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

//array de configuración, para no escribir 3 veces el button
const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "completed", label: "Completadas" },
];

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all"); //estado nuevo, arranca en Todas

  const handleToggle = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleEdit = (task: Task) => {
    console.log("Editar tarea:", task);
  };

  //se recalcula en cada render , decide que tarea deja según el filtro activo 
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
      {/* Pasamos la versión filtrada de cada lista*/}
      <TaskList
        tasks={filteredTasks}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Tasks;