import { useMemo } from "react";
import { auth } from "../../services/firebase";
import useTasks from "../../hooks/useTasks";
import EmailSummaryButton from "../../components/EmailSummaryButton/EmailSummaryButton";
import "./Summary.css";

const PRIORITY_LABELS: Record<string, string> = {
  high: "Alta",
  medium: "Media",
  low: "Baja",
};

function Summary() {
  const { tasks, loading, error } = useTasks(auth.currentUser?.uid);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    const byPriority = { high: 0, medium: 0, low: 0 };
    tasks
      .filter((t) => t.completed)
      .forEach((t) => {
        byPriority[t.priority] += 1;
      });

    return { total, completed, pending, percentage, byPriority };
  }, [tasks]);

  const maxPriorityCount = Math.max(1, ...Object.values(stats.byPriority));

  if (loading) return <p className="resumen-page__status">Cargando resumen...</p>;
  if (error) return <p className="resumen-page__status resumen-page__status--error">{error}</p>;

  return (
    <div className="resumen-page">
      <h2>Resumen</h2>

      <div className="resumen-grid">
        <div className="resumen-card resumen-card--progress">
          <div
            className="progress-ring"
            style={{ "--pct": stats.percentage } as React.CSSProperties}
          >
            <div className="progress-ring__hole">
              <span className="progress-ring__value">{stats.percentage}%</span>
            </div>
          </div>
          <div className="resumen-card__text">
            <p className="resumen-card__headline">
              {stats.completed} de {stats.total} tareas completadas
            </p>
            <p className="resumen-card__sub">
              {stats.pending === 0
                ? "¡Terminaste todas tus tareas!"
                : `¡Vas bien! Quedan ${stats.pending} pendiente${stats.pending === 1 ? "" : "s"}.`}
            </p>
          </div>
        </div>

        <div className="resumen-card resumen-card--priority">
          <h3>Completadas por prioridad</h3>
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
        </div>
      </div>

      <div className="resumen-cta">
        <div className="resumen-cta__text">
          <p className="resumen-cta__title">¿Querés este resumen en tu email?</p>
          <p className="resumen-cta__sub">Te lo mandamos con el detalle de pendientes y completadas.</p>
        </div>
        <EmailSummaryButton todos={tasks} userEmail={auth.currentUser?.email ?? ""} />
      </div>
    </div>
  );
}

export default Summary;