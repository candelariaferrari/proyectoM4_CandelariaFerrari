import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import Sidebar from "../Sidebar/Sidebar";
import BottomNav from "../BottomNav/BottomNav";
import Modal from "../Modals/Modals";
import TaskForm, { type TaskFormData } from "../TaskForm/TaskForm";
import { auth, db } from "../../services/firebase";
import { logout } from "../../features/auth/authActions";
import "./AppLayout.css";

function AppLayout() {
  const navigate = useNavigate();
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleNewTaskClick = () => {
    setCreateError(null);
    setIsNewTaskOpen(true);
  };

  const handleCreateTask = async (formData: TaskFormData) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      await addDoc(collection(db, "tasks"), {
        title: formData.title,
        priority: formData.priority,
        completed: false,
        userId: uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        ...(formData.description ? { description: formData.description } : {}),
        ...(formData.dueDate ? { dueDate: new Date(formData.dueDate) } : {}),
      });
      setIsNewTaskOpen(false);
    } catch {
      setCreateError("No se pudo crear la tarea. Intentá de nuevo.");
    }
  };

  return (
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
          {createError && <p className="app-layout__error">{createError}</p>}
        </Modal>
      )}
    </div>
  );
}

export default AppLayout;