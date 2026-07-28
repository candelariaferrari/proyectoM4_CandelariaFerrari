export function getCurrentWeekRange(reference: Date = new Date()) {
  const day = reference.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const start = new Date(reference);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + diffToMonday);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export const WEEKDAY_LABELS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export function getWeekDays(start: Date) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export function formatWeekRangeLabel(start: Date, end: Date) {
  const startLabel = start.getDate();
  const endLabel = `${end.getDate()} de ${end.toLocaleDateString("es-AR", { month: "long" })}`;
  return `${startLabel} - ${endLabel}`;
}