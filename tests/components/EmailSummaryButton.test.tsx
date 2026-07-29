import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmailSummaryButton from "../../src/components/EmailSummaryButton/EmailSummaryButton";
import type { Task } from "../../src/types/task";

const tasks: Task[] = [
  {
    id: "1",
    userId: "u1",
    title: "Tarea pendiente",
    priority: "high",
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const fetchMock = vi.fn();

describe("EmailSummaryButton", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("muestra el mensaje de éxito cuando el serverless responde ok (mock de fetch)", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, messageId: "123" }),
    });
    const user = userEvent.setup();
    render(<EmailSummaryButton todos={tasks} userEmail="user@mail.com" />);

    await user.click(screen.getByRole("button", { name: /enviar resumen por email/i }));

    expect(await screen.findByText(/email enviado correctamente/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/send-email",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("muestra el mensaje de error que devuelve el servidor cuando falla (caso borde)", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "SES no configurado" }),
    });
    const user = userEvent.setup();
    render(<EmailSummaryButton todos={tasks} userEmail="user@mail.com" />);

    await user.click(screen.getByRole("button", { name: /enviar resumen por email/i }));

    expect(await screen.findByText(/ses no configurado/i)).toBeInTheDocument();
  });

  it("muestra un error genérico si falla la conexión con el servidor (caso borde)", async () => {
    fetchMock.mockRejectedValue(new Error("network error"));
    const user = userEvent.setup();
    render(<EmailSummaryButton todos={tasks} userEmail="user@mail.com" />);

    await user.click(screen.getByRole("button", { name: /enviar resumen por email/i }));

    expect(await screen.findByText(/no se pudo conectar con el servidor/i)).toBeInTheDocument();
  });
});
