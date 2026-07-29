import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import TaskList from "../../src/components/TaskList/TaskList";
import type { Task } from "../../src/types/task";

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: "1",
  userId: "u1",
  title: "Lavar los platos",
  priority: "medium",
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("TaskList", () => {
  it("lista las tareas recibidas, una TaskItem por tarea", () => {
    const tasks = [makeTask({ id: "1", title: "Lavar los platos" }), makeTask({ id: "2", title: "Sacar la basura" })];
    render(<TaskList tasks={tasks} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Lavar los platos")).toBeInTheDocument();
    expect(screen.getByText("Sacar la basura")).toBeInTheDocument();
  });

  it('muestra el estado vacío "Todo despejado" y el botón de nueva tarea cuando el usuario no tiene ninguna tarea creada', () => {
    const onNewTask = vi.fn();
    render(
      <TaskList
        tasks={[]}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onNewTask={onNewTask}
        hasAnyTasks={false}
        activeFilter="all"
      />
    );

    expect(screen.getByText("Todo despejado por hoy")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /nueva tarea/i })).toBeInTheDocument();
  });

  it('muestra el estado vacío "por filtro" (sin botón de nueva tarea) cuando hay tareas pero ninguna coincide con el filtro activo (caso borde)', () => {
    const onNewTask = vi.fn();
    render(
      <TaskList
        tasks={[]}
        onToggle={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onNewTask={onNewTask}
        hasAnyTasks
        activeFilter="completed"
      />
    );

    expect(screen.getByText("Nada por acá")).toBeInTheDocument();
    expect(screen.getByText(/no tenés tareas completadas por ahora/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /nueva tarea/i })).not.toBeInTheDocument();

    // el estado vacío por filtro no debería ofrecer crear una tarea nueva
    expect(onNewTask).not.toHaveBeenCalled();
  });

  it("propaga pendingTaskId como pending solo a la TaskItem que corresponde", () => {
    const tasks = [makeTask({ id: "1" }), makeTask({ id: "2", title: "Sacar la basura" })];
    render(
      <TaskList tasks={tasks} onToggle={vi.fn()} onEdit={vi.fn()} onDelete={vi.fn()} pendingTaskId="2" />
    );

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]).not.toBeDisabled();
    expect(checkboxes[1]).toBeDisabled();
  });
});
