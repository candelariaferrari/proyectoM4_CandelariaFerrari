import { describe, it, expect } from "vitest";
import { getCurrentWeekRange, isSameDay, getWeekDays } from "../../src/utils/week";

describe("week utils", () => {
  it("getCurrentWeekRange arranca un lunes y termina un domingo", () => {
    // martes 14 de enero de 2025
    const martes = new Date(2025, 0, 14);
    const { start, end } = getCurrentWeekRange(martes);

    expect(start.getDay()).toBe(1); // lunes
    expect(end.getDay()).toBe(0); // domingo
    expect(start.getDate()).toBe(13);
    expect(end.getDate()).toBe(19);
  });

  it("isSameDay compara solo año/mes/día, ignora la hora (caso borde)", () => {
    const a = new Date(2025, 0, 14, 8, 0);
    const b = new Date(2025, 0, 14, 23, 30);
    const c = new Date(2025, 0, 15, 8, 0);

    expect(isSameDay(a, b)).toBe(true);
    expect(isSameDay(a, c)).toBe(false);
  });

  it("getWeekDays devuelve 7 días consecutivos a partir del inicio", () => {
    const start = new Date(2025, 0, 13);
    const days = getWeekDays(start);

    expect(days).toHaveLength(7);
    expect(days[0].getDate()).toBe(13);
    expect(days[6].getDate()).toBe(19);
  });
});
