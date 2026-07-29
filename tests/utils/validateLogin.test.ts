import { describe, it, expect } from "vitest";
import { validateLogin } from "../../src/utils/validateLogin";

describe("validateLogin", () => {
  it("devuelve error si falta el email", () => {
    const error = validateLogin({ email: "", password: "123456" });
    expect(error).toBe("Completá email y contraseña.");
  });

  it("devuelve error si falta la contraseña", () => {
    const error = validateLogin({ email: "a@a.com", password: "" });
    expect(error).toBe("Completá email y contraseña.");
  });

  it("devuelve error si el email no tiene formato válido", () => {
    const error = validateLogin({ email: "no-es-un-email", password: "123456" });
    expect(error).toBe("Ingresá un email válido.");
  });

  it("devuelve null cuando el formulario es válido", () => {
    const error = validateLogin({ email: "user@mail.com", password: "123456" });
    expect(error).toBeNull();
  });
});
