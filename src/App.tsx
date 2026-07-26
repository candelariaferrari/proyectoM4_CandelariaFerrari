import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import Tasks from "./pages/Tasks/Tasks";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <div>
      <Routes>
          {/* rutas publicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
          {/* rutas privadas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/tasks" element={<Tasks />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
