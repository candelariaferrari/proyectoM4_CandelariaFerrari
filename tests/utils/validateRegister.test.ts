import { describe, it, expect } from "vitest";
import { validateRegister } from "../../src/utils/validateRegister";

const baseForm = {
  name: "Ana",
  lastname: "Gómez",
  email: "ana@mail.com",
  password: "123456",
  confirmPassword: "123456",
};

describe("validateRegister", () => {
  it("devuelve null cuando todos los campos son válidos", () => {
    expect(validateRegister(baseForm)).toBeNull();
  });

  it("rechaza un nombre con números", () => {
    const error = validateRegister({ ...baseForm, name: "Ana2" });
    expect(error).toBe("El nombre no puede contener números.");
  });

  it("rechaza un email sin formato válido", () => {
    const error = validateRegister({ ...baseForm, email: "no-valido" });
    expect(error).toBe("Ingresá un email válido.");
  });

  it("rechaza una contraseña de menos de 6 caracteres", () => {
    const error = validateRegister({ ...baseForm, password: "123", confirmPassword: "123" });
    expect(error).toBe("La contraseña debe tener al menos 6 caracteres.");
  });

  it("rechaza cuando las contraseñas no coinciden (caso borde)", () => {
    const error = validateRegister({ ...baseForm, confirmPassword: "otraClave" });
    expect(error).toBe("Las contraseñas no coinciden.");
  });
});
