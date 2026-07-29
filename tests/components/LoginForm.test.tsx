import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import LoginForm from "../../src/components/LoginForm/LoginForm";

// Mock servicio de autenticación ( Firebase) para no depender de una conexión real a Firebase en los tests.
vi.mock("../../src/features/auth/authActions", () => ({
  login: vi.fn(),
  loginWithGoogle: vi.fn(),
}));

import { login } from "../../src/features/auth/authActions";
import type { User } from "firebase/auth";

// Mock mínimo de un User de Firebase: solo necesitamos que "login" resuelva tipado como User
const fakeUser = { uid: "test-uid" } as User;

function renderLoginForm() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/summary" element={<p>Pantalla de resumen</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("LoginForm", () => {
  beforeEach(() => {
    vi.mocked(login).mockReset();
  });

  it("muestra un error de validación y no llama a login si el formulario está vacío", async () => {
    const user = userEvent.setup();
    renderLoginForm();

    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(await screen.findByText("Completá email y contraseña.")).toBeInTheDocument();
    expect(login).not.toHaveBeenCalled();
  });

  it("llama a login con las credenciales y navega a /summary cuando el login es exitoso", async () => {
    vi.mocked(login).mockResolvedValue(fakeUser);
    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByPlaceholderText("Email"), "user@mail.com");
    await user.type(screen.getByPlaceholderText("Contraseña"), "123456");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(await screen.findByText("Pantalla de resumen")).toBeInTheDocument();
    expect(login).toHaveBeenCalledWith({ email: "user@mail.com", password: "123456" });
  });

  it("muestra el mensaje de error cuando login rechaza (caso borde)", async () => {
    vi.mocked(login).mockRejectedValue(
      new Error("Credenciales inválidas. Verifica tu email y contrasena.")
    );
    const user = userEvent.setup();
    renderLoginForm();

    await user.type(screen.getByPlaceholderText("Email"), "user@mail.com");
    await user.type(screen.getByPlaceholderText("Contraseña"), "malaClave");
    await user.click(screen.getByRole("button", { name: /iniciar sesión/i }));

    expect(await screen.findByText(/credenciales inválidas/i)).toBeInTheDocument();
  });
});
