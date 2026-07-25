import { useAuth } from "./features/auth/Authenticator";
import { login, register, logout } from "./features/auth/authActions";

function App() {
  const { user, loading } = useAuth();

  async function handleTestRegister() {
    try {
      const newUser = await register({
        name: "Test",
        lastname: "Usuario",
        email: "test@fortoday.com",
        password: "123456",
      });
      console.log("Registro OK:", newUser);
    } catch (error) {
      console.error("Error en registro:", error);
    }
  }

  async function handleTestLogin() {
    try {
      const loggedUser = await login({
        email: "test@fortoday.com",
        password: "123456",
      });
      console.log("Login OK:", loggedUser);
    } catch (error) {
      console.error("Error en login:", error);
    }
  }

  async function handleTestLogout() {
    try {
      await logout();
      console.log("Logout OK");
    } catch (error) {
      console.error("Error en logout:", error);
    }
  }

  return (
    <div>
      <h1>Test de Firebase Auth</h1>
      <p>
        {loading
          ? "Cargando..."
          : user
          ? `Hay usuario logueado: ${user.email}`
          : "No hay usuario logueado"}
      </p>
      <button onClick={handleTestRegister}>Registrarme (prueba)</button>
      <button onClick={handleTestLogin}>Login (prueba)</button>
      <button onClick={handleTestLogout}>Logout (prueba)</button>
    </div>
  );
}

export default App;
