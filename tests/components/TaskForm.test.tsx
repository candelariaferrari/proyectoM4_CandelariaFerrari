import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskForm from "../../src/components/TaskForm/TaskForm";

describe("TaskForm", () => {
  it("muestra errores de validación y no llama a onSubmit si el formulario está vacío", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    render(<TaskForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

    expect(await screen.findByText("El título es obligatorio.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("llama a onSubmit con los datos correctos cuando el formulario es válido", async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<TaskForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Titulo de la tarea"), "Comprar café");
    await user.click(screen.getByRole("button", { name: /alta/i }));
    await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Comprar café", priority: "high" })
    );
  });

  it('muestra "Guardando..." mientras espera a que onSubmit termine (caso borde de la centralización de tareas)', async () => {
    let resolveSubmit: () => void = () => {};
    const onSubmit = vi.fn(
      () => new Promise<void>((resolve) => { resolveSubmit = resolve; })
    );
    const user = userEvent.setup();
    render(<TaskForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText("Titulo de la tarea"), "Comprar café");
    await user.click(screen.getByRole("button", { name: /alta/i }));
    await user.click(screen.getByRole("button", { name: /agregar tarea/i }));

    expect(await screen.findByRole("button", { name: /guardando/i })).toBeDisabled();

    resolveSubmit();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /agregar tarea/i })).not.toBeDisabled()
    );
  });
});
