import { useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { useToast } from "./useToast";
import type { Task } from "../types/task";
import type { TaskFormData } from "../components/TaskForm/TaskForm";

// Centraliza las escrituras a Firestore, todas comparten el mismo patrón: se sabe si hay una escritura en
// curso (isCreating / pendingId) y el resultado siempre termina en un toast a través de useToast.
function useTaskActions() {
  const { showToast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  // id de la tarea que se está editando/eliminando/togglenando ahora mismo
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function createTask(formData: TaskFormData): Promise<boolean> {
    const uid = auth.currentUser?.uid;
    if (!uid) return false;

    setIsCreating(true);
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
      showToast({ message: "Tarea creada", variant: "success" });
      return true;
    } catch {
      showToast({ message: "No se pudo crear la tarea. Intentá de nuevo.", variant: "error" });
      return false;
    } finally {
      setIsCreating(false);
    }
  }

  async function updateTask(taskId: string, formData: TaskFormData): Promise<boolean> {
    setPendingId(taskId);
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        title: formData.title,
        description: formData.description || null,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
        updatedAt: serverTimestamp(),
      });
      showToast({ message: `Tarea actualizada "${formData.title}"`, variant: "success" });
      return true;
    } catch {
      showToast({ message: "No se pudo guardar la tarea. Intentá de nuevo.", variant: "error" });
      return false;
    } finally {
      setPendingId(null);
    }
  }

  async function deleteTask(task: Task): Promise<boolean> {
    setPendingId(task.id);
    try {
      await deleteDoc(doc(db, "tasks", task.id));
      showToast({ message: `Tarea eliminada "${task.title}"`, variant: "success" });
      return true;
    } catch {
      showToast({ message: "No se pudo eliminar la tarea. Intentá de nuevo.", variant: "error" });
      return false;
    } finally {
      setPendingId(null);
    }
  }

  async function toggleTask(task: Task): Promise<boolean> {
    setPendingId(task.id);
    try {
      await updateDoc(doc(db, "tasks", task.id), {
        completed: !task.completed,
        updatedAt: serverTimestamp(),
      });
      return true;
    } catch {
      showToast({ message: "No se pudo actualizar la tarea. Intentá de nuevo.", variant: "error" });
      return false;
    } finally {
      setPendingId(null);
    }
  }

  return { createTask, updateTask, deleteTask, toggleTask, isCreating, pendingId };
}

export default useTaskActions;
