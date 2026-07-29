import type { Task } from "../../types/task";
import TaskItem from "../TaskItem/TaskItem";
import "./TaskList.css";

interface TaskListProps {
  tasks: Task[];
  onToggle: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  // id de la tarea que tiene una escritura en curso (crear/editar/eliminar/togglear)
  pendingTaskId?: string | null;
  // abre el modal de nueva tarea desde el estado vacío
  onNewTask?: () => void;
}

function TaskList({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  pendingTaskId = null,
  onNewTask,
}: TaskListProps) {

  if (tasks.length === 0) {
    return (
      <div className="task-empty">
        <h3>Todo despejado por hoy</h3>
        <p>No tenés tareas pendientes. Sumá una nueva para arrancar tu día.</p>
        {onNewTask && (
          <button type="button" className="task-empty__btn" onClick={onNewTask}>
            + Nueva tarea
          </button>
        )}
      </div>
    );
  }

  return (
    <section className="task-list-section">
      <ul className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggle(task.id)}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
            pending={pendingTaskId === task.id}
          />
        ))}
      </ul>

    </section>
  );
}

export default TaskList;
