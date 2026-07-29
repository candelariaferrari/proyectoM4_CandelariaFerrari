import { useMemo } from "react";
import { Link } from "react-router-dom";
import { auth } from "../../services/firebase";
import useTasks from "../../hooks/useTasks";
import EmailSummaryButton from "../../components/EmailSummaryButton/EmailSummaryButton";
import Donut from "../../components/Donut/Donut";
import { getCurrentWeekRange, getWeekDays, isSameDay, WEEKDAY_LABELS, formatWeekRangeLabel } from "../../utils/week";
import "./Summary.css";

const PRIORITY_META = {
  high: { label: "Alta", color: "#D6336C" },
  medium: { label: "Media", color: "#E24E17" },
  low: { label: "Baja", color: "#4A3550" },
} as const;

//Formatear fecha limite, si no tiene -> sin fecha. si es 00:00 ->fecha, si es hora especifica si muestra
function formatDueDate(date?: Date) {
  if (!date) return "Sin fecha";
  const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
  const datePart = date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
  if (!hasTime) return datePart;
  const timePart = date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  return `${datePart} · ${timePart}`;
}

function Summary() {
  const { tasks, loading, error } = useTasks(auth.currentUser?.uid); //todas las tareas de User autenticado, hook estado de carga y errores

  const { start, end } = useMemo(() => getCurrentWeekRange(), []); // rango de la semana actual, useMemo para no calcularlo en cada render
  const weekDays = useMemo(() => getWeekDays(start), [start]); //solo se calcula si cambia el dia inicial

  const stats = useMemo(() => { //estadistica semanal 
    const createdThisWeek = tasks.filter((t) => t.createdAt >= start && t.createdAt <= end);
    const completedThisWeek = tasks.filter(
      (t) => t.completed && t.updatedAt >= start && t.updatedAt <= end
    );
    const pending = tasks.filter((t) => !t.completed);
    const productivity =
      createdThisWeek.length === 0
        ? 0
        : Math.round((completedThisWeek.length / createdThisWeek.length) * 100);

    const byPriority = { high: 0, medium: 0, low: 0 };
    tasks.filter((t) => t.completed).forEach((t) => { byPriority[t.priority] += 1; });
    const priorityTotal = byPriority.high + byPriority.medium + byPriority.low;

    return { created: createdThisWeek.length, completed: completedThisWeek.length, pending: pending.length, productivity, byPriority, priorityTotal };
  }, [tasks, start, end]);

// Genera un resumen por cada día de la semana. Para cada día guarda: - tareas creadas - cuántas fueron completadas - total de tareas
  const dayBreakdown = useMemo( 
    () =>
      weekDays.map((day) => {
        const dayTasks = tasks.filter((t) => isSameDay(t.createdAt, day));
        const completed = dayTasks.filter((t) => t.completed).length;
        return { day, tasks: dayTasks, completed, total: dayTasks.length };
      }),
    [weekDays, tasks]
  );

  //lista de tareas que aparecerán en próximas
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

  if (loading) return <p className="resumen-page__status">Cargando resumen...</p>;
  if (error) return <p className="resumen-page__status resumen-page__status--error">{error}</p>;

  return (
    <div className="resumen-page">
      <div className="resumen-header">
        <h2>Resumen semanal</h2>
        <span className="resumen-header__range">{formatWeekRangeLabel(start, end)}</span>
      </div>

      <div className="resumen-stats">
        <div className="stat-tile">
          <p className="stat-tile__value">{stats.created}</p>
          <p className="stat-tile__label">Tareas creadas</p>
        </div>
        <div className="stat-tile">
          <p className="stat-tile__value">{stats.completed}</p>
          <p className="stat-tile__label">Completadas</p>
        </div>
        <div className="stat-tile">
          <p className="stat-tile__value">{stats.pending}</p>
          <p className="stat-tile__label">Pendientes</p>
        </div>
        <div className="stat-tile">
          <p className="stat-tile__value">{stats.productivity}%</p>
          <p className="stat-tile__label">Productividad</p>
        </div>
      </div>

      <div className="resumen-upcoming">
        <div className="resumen-upcoming__header">
          <h3>Próximas tareas</h3>
          <Link to="/tasks" className="resumen-upcoming__link">
            Ver todas →
          </Link>
        </div>

        <div className="resumen-upcoming__list">
          {upcoming.length === 0 && (
            <p className="resumen-page__status">No tenés tareas todavía.</p>
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
                {PRIORITY_META[task.priority].label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="resumen-grid">
        <div className="resumen-card">
          <h3>Resumen por día</h3>
          <div className="day-breakdown">
            {dayBreakdown.map(({ day, tasks: dayTasks, completed, total }, i) => (
              <div className="day-row" key={day.toISOString()}>
                <span className="day-row__label">{WEEKDAY_LABELS[i]}</span>
                <div className="day-row__dots">
                  {dayTasks.length === 0 ? (
                    <span className="day-row__empty">—</span>
                  ) : (
                    dayTasks.map((t) => (
                      <span key={t.id} className={`day-dot ${t.completed ? "day-dot--done" : "day-dot--pending"}`} />
                    ))
                  )}
                </div>
                <span className="day-row__count">{completed}/{total}</span>
              </div>
            ))}
          </div>
          <p className="day-breakdown__note">Cada punto equivale a una tarea creada ese día.</p>
        </div>

        <div className="resumen-card">
          <h3>Distribución por prioridad</h3>
          <div className="priority-donut">
            <Donut
              segments={[
                { value: stats.byPriority.high, color: PRIORITY_META.high.color },
                { value: stats.byPriority.medium, color: PRIORITY_META.medium.color },
                { value: stats.byPriority.low, color: PRIORITY_META.low.color },
              ]}
              size={110}
              holeSize={78}
            />
            <div className="priority-legend">
              {(["high", "medium", "low"] as const).map((p) => (
                <div className="priority-legend__row" key={p}>
                  <span className="priority-legend__dot" style={{ background: PRIORITY_META[p].color }} />
                  <span className="priority-legend__label">{PRIORITY_META[p].label}</span>
                  <span className="priority-legend__value">{stats.byPriority[p]} tareas</span>
                  <span className="priority-legend__pct">
                    {stats.priorityTotal === 0 ? "0%" : `${Math.round((stats.byPriority[p] / stats.priorityTotal) * 100)}%`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="resumen-cta">
        <div className="resumen-cta__text">
          <div className="resumen-cta__icon">✉️</div>
          <div>
            <p className="resumen-cta__title">Tu resumen listo para enviar</p>
            <p className="resumen-cta__sub">Te enviamos un informe completo con tus estadísticas de la semana.</p>
          </div>
        </div>
        <EmailSummaryButton todos={tasks} userEmail={auth.currentUser?.email ?? ""} />
      </div>
    </div>
  );
}

export default Summary;
