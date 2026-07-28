import { Link, useLocation, useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { useState } from "react";
import { login, loginWithGoogle } from "../../features/auth/authActions";
import { validateLogin } from "../../utils/validateLogin";
import type { LoginFormState } from "../../types/auth";

interface LocationState {
  from?: { pathname: string };
}

type LoginStatus = "idle" | "loading" | "success" | "error";

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [form, setForm] = useState<LoginFormState>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<LoginStatus>("idle");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function destinoTrasLogin() {
    return state?.from?.pathname || "/dashboard";
  }

  async function handleSubmit(event:React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateLogin(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setStatus("loading");

    try {
      await login({ email: form.email, password: form.password });
      navigate(destinoTrasLogin(), { replace: true });
    } catch (error) {
      setStatus("error");
      setError((error as Error).message);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    setStatus("loading");

    try {
      await loginWithGoogle();
      navigate(destinoTrasLogin(), { replace: true });
    } catch (error) {
      setStatus("error");
      setError((error as Error).message);
    }
  }

  return (
    <div className="login-form-panel">
      <h2>Bienvenido</h2>
      <p className="sub">Iniciá sesión para ver tus tareas.</p>

      <button
        type="button"
        className="google-btn"
        onClick={handleGoogleLogin}
        disabled={status === "loading"}
      >
        <span className="g-dot"></span> Continuar con Google
      </button>
      <div className="divider">o iniciá sesión con tu email</div>

      <form onSubmit={handleSubmit} noValidate>
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
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        <button className="submit-btn" type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>

      <p className="footlink">
        ¿No tenés cuenta?{" "}
        <Link to="/register">
          <b>Registrate</b>
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
