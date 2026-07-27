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
    /* onSnapshot no devuelve una Promise como getDocs — devuelve directamente una función para cancelar la suscripción,
     que es justo lo que el return () => unsubscribe() del useEffect usa para "limpiar" cuando el componente se desmonta. 
     Por eso acá no hay .then()/.catch() onSnapshot recibe dos funciones: la primera se ejecuta cada 
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
            dueDate: data.dueDate ? data.dueDate.toDate() : undefined,  //La conversión de Timestamp a Date (data.dueDate.toDate(), etc.) pasa acá, en el único lugar donde se leen datos crudos de Firestore
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate(),
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