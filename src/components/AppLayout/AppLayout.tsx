import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import BottomNav from "../BottomNav/BottomNav";
import { logout } from "../../features/auth/authActions";
import "./AppLayout.css";

function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      <div className="app-layout__content">
        <Outlet />
      </div>
      <BottomNav onLogout={handleLogout} />
    </div>
  );
}

export default AppLayout;