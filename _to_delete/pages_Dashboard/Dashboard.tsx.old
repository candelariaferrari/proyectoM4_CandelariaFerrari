import { useMemo } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../services/firebase";
import useTasks from "../../hooks/useTasks";
import { getCurrentWeekRange } from "../../utils/week";
import "./Dashboard.css";

const PRIORITY_LABELS: Record<string, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

function formatDueDate(date?: Date) {
  if (!date) return "Sin fecha";
  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
  const datePart = date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
  if (!hasTime) return datePart;
  const timePart = date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  return `${datePart} · ${timePart}`;
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function Dashboard() {
  const { tasks, loading, error } = useTasks(auth.currentUser?.uid);

  const displayName =
    auth.currentUser?.displayName || auth.currentUser?.email?.split("@")[0] || "";

  const todayLabel = capitalize(
    new Date().toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" })
  );

  const stats = useMemo(() => {
    const { start, end } = getCurrentWeekRange();
    const total = tasks.length;
    const pending = tasks.filter((t) => !t.completed).length;

    const completedThisWeek = tasks.filter(
      (t) => t.completed && t.updatedAt >= start && t.updatedAt <= end
    );
    const percentage = total === 0 ? 0 : Math.round((completedThisWeek.length / total) * 100);

    const byPriority = { high: 0, medium: 0, low: 0 };
    completedThisWeek.forEach((t) => {
      byPriority[t.priority] += 1;
    });

    return { total, pending, completedThisWeekCount: completedThisWeek.length, percentage, byPriority };
  }, [tasks]);

  const maxPriorityCount = Math.max(1, ...Object.values(stats.byPriority));

  const upcoming = useMemo(() => {
    const pendingSorted = tasks
      .filter((t) => !t.completed)
      .sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.getTime() - b.dueDate.getTime();
      })
      .slice(0, 4);

    const lastCompleted = tasks
      .filter((t) => t.completed)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())[0];

    return lastCompleted ? [...pendingSorted, lastCompleted] : pendingSorted;
  }, [tasks]);

  if (loading) return <p className="dashboard-page__status">Cargando resumen...</p>;
  if (error) return <p className="dashboard-page__status dashboard-page__status--error">{error}</p>;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>¡Hola{displayName ? `, ${displayName}` : ""}!</h1>
        <p className="dashboard-header__date">{todayLabel}</p>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h2 className="dashboard-card__title">Progreso del día</h2>
          <div className="dashboard-card__progress-row">
            <div
              className="progress-ring"
              style={{ "--pct": stats.percentage } as React.CSSProperties}
            >
              <div className="progress-ring__hole">
                <span className="progress-ring__value">{stats.percentage}%</span>
              </div>
            </div>
            <div>
              <p className="dashboard-card__headline">
                {stats.completedThisWeekCount} de {stats.total} tareas completadas
              </p>
              <p className="dashboard-card__sub">
                {stats.pending === 0
                  ? "¡Terminaste todas tus tareas!"
                  : `Vas bien, quedan ${stats.pending} pendiente${stats.pending === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h2 className="dashboard-card__title">Completadas esta semana</h2>
          {(["high", "medium", "low"] as const).map((p) => (
            <div className="priority-bar" key={p}>
              <span className="priority-bar__label">{PRIORITY_LABELS[p]}</span>
              <div className="priority-bar__track">
                <div
                  className={`priority-bar__fill priority-bar__fill--${p}`}
                  style={{ width: `${(stats.byPriority[p] / maxPriorityCount) * 100}%` }}
                />
              </div>
              <span className="priority-bar__count">{stats.byPriority[p]}</span>
            </div>
          ))}
          <Link to="/summary" className="dashboard-card__link">
            Ver resumen completo →
          </Link>
        </div>
      </div>

      <div className="dashboard-upcoming">
        <div className="dashboard-upcoming__header">
          <h2>Próximas tareas</h2>
          <Link to="/tasks" className="dashboard-card__link">
            Ver todas →
          </Link>
        </div>

        <div className="dashboard-upcoming__list">
          {upcoming.length === 0 && (
            <p className="dashboard-page__status">No tenés tareas todavía.</p>
          )}
          {upcoming.map((task) => (
            <div
              key={task.id}
              className={`task-row task-row--${task.priority}${task.completed ? " task-row--done" : ""}`}
            >
              <span className={`task-row__circle${task.completed ? " task-row__circle--done" : ""}`} />
              <div className="task-row__text">
                <p className="task-row__title">{task.title}</p>
                <p className="task-row__sub">
                  {task.completed ? "Completada" : formatDueDate(task.dueDate)}
                </p>
              </div>
              <span className={`task-row__tag task-row__tag--${task.priority}`}>
                {PRIORITY_LABELS[task.priority]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 