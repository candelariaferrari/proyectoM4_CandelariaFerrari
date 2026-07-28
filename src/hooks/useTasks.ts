import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../services/firebase";
import type { Task } from "../types/task";

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

function useTasks(userId: string | undefined): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("userId", "==", userId));
    /* onSnapshot recibe dos funciones: la primera se ejecuta cada 
     vez que hay datos nuevos, la segunda solo si hay un error*/
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const nextTasks: Task[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            title: data.title,
            description: data.description ?? undefined,
            priority: data.priority,
            completed: data.completed,
            dueDate: data.dueDate ? data.dueDate.toDate() : undefined,  // Timestamp a Date, lugar donde se leen datos crudos de Firestore
            //serverTimestamp() (no confir por el servidor) -> Firestore devuelve null en el snapshot local , si no cubre ese caso toDate() explota y va new Date() como valor provisorio hastq ue snapshot con el timestamp real del servidor
            createdAt: data.createdAt?.toDate() ?? new Date(),
            updatedAt: data.updatedAt?.toDate() ?? new Date(),
          };
        });
        nextTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        setTasks(nextTasks);
        setLoading(false);
      },
      (err) => {
        if (err.code === "permission-denied") {
          setError("No tenés permiso para ver estas tareas.");
        } else {
          setError("No se pudieron cargar las tareas. Intentá de nuevo.");
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { tasks, loading, error };
}

export default useTasks;