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

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

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
    // TODO: reemplazar por la apertura del modal de edición cuando lo armemos.
    console.log("Editar tarea:", task);
  };

  return (
    <div className="tasks-page__content">
      <h2>Mis tareas</h2>

      <div className="filters">
        <button type="button" className="filter active">Todas</button>
        <button type="button" className="filter">Pendientes</button>
        <button type="button" className="filter">Completadas</button>
      </div>

      <TaskList
        tasks={tasks}
        onToggle={handleToggle}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default Tasks;