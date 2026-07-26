import type { Task } from "../../types/task";
import TaskItem from "../TaskItem/TaskItem";
import "./TaskList.css";

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

function TaskList({
  tasks,
  onToggle,
  onEdit,
  onDelete,
}: TaskListProps) {

  if (tasks.length === 0) {
    return (
      <div className="task-empty">
        <h3>No tenés tareas todavía</h3>
        <p>Creá tu primera tarea para empezar a organizar tu día.</p>
      </div>
    );
  }

  return (
    <section className="task-list-section">

      <header className="task-list__header">
        <h2>Mis tareas</h2>

        <span className="task-list__count">
          {tasks.length} {tasks.length === 1 ? "tarea" : "tareas"}
        </span>
      </header>

      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggle(task.id)}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
          />
        ))}
      </ul>

    </section>
  );
}

export default TaskList;