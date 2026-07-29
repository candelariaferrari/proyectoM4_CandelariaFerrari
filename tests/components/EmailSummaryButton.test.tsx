import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmailSummaryButton from "../../src/components/EmailSummaryButton/EmailSummaryButton";
import ToastProvider from "../../src/components/ToastProvider/ToastProvider";
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

// EmailSummaryButton ahora avisa el resultado del envío con un toast (useToast)
// en vez de un texto debajo del botón, así que lo envolvemos en ToastProvider
// para que el toast se pueda ver y buscar en el DOM, igual que lo ve la persona
// que usa la app.
function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe("EmailSummaryButton", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    fetchMock.mockReset();
  });

  it("muestra un toast de éxito cuando el serverless responde ok (mock de fetch)", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, messageId: "123" }),
    });
    const user = userEvent.setup();
    renderWithToast(<EmailSummaryButton todos={tasks} userEmail="user@mail.com" />);

    await user.click(screen.getByRole("button", { name: /enviar resumen por email/i }));

    expect(await screen.findByText(/email enviado con éxito/i)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/send-email",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("muestra en un toast el mensaje de error que devuelve el servidor cuando falla (caso borde)", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "SES no configurado" }),
    });
    const user = userEvent.setup();
    renderWithToast(<EmailSummaryButton todos={tasks} userEmail="user@mail.com" />);

    await user.click(screen.getByRole("button", { name: /enviar resumen por email/i }));

    expect(await screen.findByText(/ses no configurado/i)).toBeInTheDocument();
  });

  it("muestra en un toast un error genérico si falla la conexión con el servidor (caso borde)", async () => {
    fetchMock.mockRejectedValue(new Error("network error"));
    const user = userEvent.setup();
    renderWithToast(<EmailSummaryButton todos={tasks} userEmail="user@mail.com" />);

    await user.click(screen.getByRole("button", { name: /enviar resumen por email/i }));

    expect(await screen.findByText(/no se pudo conectar con el servidor/i)).toBeInTheDocument();
  });
});
