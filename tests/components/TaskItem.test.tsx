import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskItem from "../../src/components/TaskItem/TaskItem";
import type { Task } from "../../src/types/task";

const baseTask: Task = {
  id: "1",
  userId: "u1",
  title: "Lavar los platos",
  description: "Antes de las 20hs",
  priority: "medium",
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("TaskItem", () => {
  it("muestra el título, la descripción y la prioridad de la tarea", () => {
    render(<TaskItem task={baseTask} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Lavar los platos")).toBeInTheDocument();
    expect(screen.getByText("Antes de las 20hs")).toBeInTheDocument();
    expect(screen.getByText("Media")).toBeInTheDocument();
  });

  it("llama a onToggle al tildar el checkbox", async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();
    render(<TaskItem task={baseTask} onToggle={onToggle} onEdit={vi.fn()} onDelete={vi.fn()} />);

    await user.click(screen.getByRole("checkbox"));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("abre el menú y llama a onEdit / onDelete", async () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<TaskItem task={baseTask} onToggle={vi.fn()} onEdit={onEdit} onDelete={onDelete} />);

    await user.click(screen.getByRole("button", { name: /más opciones/i }));
    await user.click(screen.getByRole("button", { name: "Editar" }));
    expect(onEdit).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: /más opciones/i }));
    await user.click(screen.getByRole("button", { name: "Eliminar" }));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("deshabilita el checkbox y el menú cuando pending=true (caso borde de la centralización de tareas)", () => {
    render(
      <TaskItem task={baseTask} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} pending />
    );

    expect(screen.getByRole("checkbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: /más opciones/i })).toBeDisabled();
  });
});
