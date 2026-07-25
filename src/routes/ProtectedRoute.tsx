import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/Authenticator";

function ProtectedRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <p className="loading-session">Cargando sesion...</p>;
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }
    return <Outlet />;
}

export default ProtectedRoute