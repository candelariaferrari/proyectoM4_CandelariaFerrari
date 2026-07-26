import { Link, useNavigate } from "react-router-dom";
import "./RegisterForm.css";
import { useState } from "react";
import { register } from "../../features/auth/authActions";
import { validateRegister } from "../../utils/validateRegister";
import type { RegisterFormState } from "../../types/auth";

type RegisterStatus = "idle" | "loading" | "success" | "error";

function RegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterFormState>({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<RegisterStatus>("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateRegister(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setStatus("loading");

    try {
      await register({
        name: form.name,
        lastname: form.lastname,
        email: form.email,
        password: form.password,
      });
      navigate("/tasks", { replace: true });
    } catch (error) {
      setStatus("error");
      setError((error as Error).message);
    }
  }

  return (
    <div className="register-form-panel">
      <h2>Creá tu cuenta</h2>
      <p className="sub">Empezá a organizar tus tareas hoy.</p>

      <div className="google-btn">
        <span className="g-dot"></span> Continuar con Google
      </div>
      <div className="divider">o registrate con tu email</div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field-row">
          <div className="field">
            <label>Nombre</label>
            <input
              className="input"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nombre"
              disabled={status === "loading"}
            />
          </div>
          <div className="field">
            <label>Apellido</label>
            <input
              className="input"
              type="text"
              name="lastname"
              value={form.lastname}
              onChange={handleChange}
              placeholder="Apellido"
              disabled={status === "loading"}
            />
          </div>
        </div>
        <div className="field">
          <label>Email</label>
          <input
            className="input"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            disabled={status === "loading"}
          />
        </div>
        <div className="field">
          <label>Contraseña</label>
          <input
            className="input"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Contraseña"
            disabled={status === "loading"}
          />
        </div>
        <div className="field">
          <label>Confirmar contraseña</label>
          <input
            className="input"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmar contraseña"
            disabled={status === "loading"}
          />
        </div>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <button className="submit-btn" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="footlink">
        ¿Ya tenés cuenta?{" "}
        <Link to="/login">
          <b>Volver a inicio</b>
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;
