import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./components/AppLayout/AppLayout";
import Tasks from "./pages/Tasks/Tasks";
import NotFound from "./pages/NotFound/NotFound";
import Summary from "./pages/Summary/Summary";
import Dashboard from "./pages/Dashboard/Dashboard";


function App() {
  return (
    <div>
      <Routes>
        {/* rutas publicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* rutas privadas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/summary" element={<Summary />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;