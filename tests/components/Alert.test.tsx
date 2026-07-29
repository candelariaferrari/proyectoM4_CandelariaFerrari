import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Alert from "../../src/components/Alert/Alert";

describe("Alert", () => {
  it("muestra el mensaje", () => {
    render(<Alert message="Tarea creada" />);
    expect(screen.getByText("Tarea creada")).toBeInTheDocument();
  });

  it("renderiza el botón de acción y lo ejecuta al hacer click", async () => {
    const onAction = vi.fn();
    const user = userEvent.setup();
    render(<Alert message="Se eliminó la tarea" actionLabel="Deshacer" onAction={onAction} />);

    await user.click(screen.getByRole("button", { name: "Deshacer" }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("no muestra el botón de acción si no se pasa onAction (caso borde)", () => {
    render(<Alert message="Solo texto" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
