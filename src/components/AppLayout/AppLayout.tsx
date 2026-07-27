import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import BottomNav from "../BottomNav/BottomNav";
import { logout } from "../../features/auth/authActions";
import "./AppLayout.css";

function AppLayout() {
  const navigate = useNavigate();
  const [newTaskRequestedAt, setNewTaskRequestedAt] = useState(0);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleNewTaskClick = () => {
    setNewTaskRequestedAt(Date.now());
  };

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} onNewTaskClick={handleNewTaskClick} />
      <div className="app-layout__content">
        <Outlet context={{ newTaskRequestedAt }} />
      </div>
      <BottomNav onLogout={handleLogout} onNewTaskClick={handleNewTaskClick} />
    </div>
  );
}

export default AppLayout;