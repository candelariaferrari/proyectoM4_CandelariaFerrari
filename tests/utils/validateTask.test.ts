import { describe, it, expect } from "vitest";
import { validateTask } from "../../src/utils/validateTask";

describe("validateTask", () => {
  it("devuelve error de título cuando está vacío", () => {
    const errors = validateTask({ title: "", description: "", priority: "high", dueDate: "" });
    expect(errors.title).toBe("El título es obligatorio.");
  });

  it("devuelve error de título cuando es muy corto", () => {
    const errors = validateTask({ title: "ab", description: "", priority: "high", dueDate: "" });
    expect(errors.title).toBe("El título debe tener al menos 3 caracteres.");
  });

  it("devuelve error de prioridad cuando no se eligió ninguna", () => {
    const errors = validateTask({ title: "Tarea válida", description: "", priority: "", dueDate: "" });
    expect(errors.priority).toBe("Seleccioná una prioridad.");
  });

  it("rechaza una fecha anterior a hoy (caso borde)", () => {
    const ayer = new Date();
    ayer.setDate(ayer.getDate() - 1);
    const errors = validateTask({
      title: "Tarea válida",
      description: "",
      priority: "medium",
      dueDate: ayer.toISOString().slice(0, 10),
    });
    expect(errors.dueDate).toBe("La fecha no puede ser anterior a hoy.");
  });

  it("no devuelve errores para un formulario válido", () => {
    const errors = validateTask({
      title: "Comprar café",
      description: "Para la oficina",
      priority: "low",
      dueDate: "",
    });
    expect(errors).toEqual({});
  });
});
