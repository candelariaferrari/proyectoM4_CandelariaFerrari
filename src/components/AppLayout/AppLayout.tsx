import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import BottomNav from "../BottomNav/BottomNav";
import Modal from "../Modals/Modals";
import TaskForm, { type TaskFormData } from "../TaskForm/TaskForm";
import { logout } from "../../features/auth/authActions";
import useTaskActions from "../../hooks/useTaskActions";
import ToastProvider from "../ToastProvider/ToastProvider";
import "./AppLayout.css";

function AppLayout() {
  const navigate = useNavigate();
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const { createTask } = useTaskActions();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleNewTaskClick = () => {
    setIsNewTaskOpen(true);
  };

  const handleCreateTask = async (formData: TaskFormData) => {
    const ok = await createTask(formData);
    if (ok) setIsNewTaskOpen(false);
  };

  return (
    <ToastProvider>
      <div className="app-layout">
        <Sidebar onLogout={handleLogout} onNewTaskClick={handleNewTaskClick} />
        <div className="app-layout__content">
          <Outlet />
        </div>
        <BottomNav onLogout={handleLogout} onNewTaskClick={handleNewTaskClick} />

        {isNewTaskOpen && (
          <Modal onClose={() => setIsNewTaskOpen(false)}>
            <h3>Nueva tarea</h3>
            <TaskForm onSubmit={handleCreateTask} />
          </Modal>
        )}
      </div>
    </ToastProvider>
  );
}

export default AppLayout;
