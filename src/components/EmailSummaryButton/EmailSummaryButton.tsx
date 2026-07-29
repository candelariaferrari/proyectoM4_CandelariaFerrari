import { useState } from "react"
import type { Task } from "../../types/task"
import { useToast } from "../../hooks/useToast"
import "./EmailSummaryButton.css"

interface Props {
  todos: Task[]
  userEmail: string
}

type Status = "idle" | "loading"

function buildTodoSummary(todos: Task[]): string {
  const pending = todos.filter((t) => !t.completed)
  const done = todos.filter((t) => t.completed)

  return (
    `Tareas pendientes (${pending.length}):\n` +
    pending.map((t) => `- ${t.title}`).join("\n") +
    `\n\nTareas completadas (${done.length}):\n` +
    done.map((t) => `- ${t.title}`).join("\n")
  )
}

function EmailSummaryButton({ todos, userEmail }: Props) {
  const [status, setStatus] = useState<Status>("idle")
  const { showToast } = useToast()

  async function handleSend() {
    setStatus("loading")

    const summary = buildTodoSummary(todos)

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: userEmail, summary }),
      })

      const data = await res.json()

      if (!res.ok) {
        showToast({ message: data?.message || "Error al enviar el email", variant: "error" })
        return
      }

      showToast({ message: "Email enviado con éxito", variant: "success" })
    } catch {
      showToast({ message: "No se pudo conectar con el servidor", variant: "error" })
    } finally {
      setStatus("idle")
    }
  }

  return (
    <button
      className="email-btn"
      onClick={handleSend}
      disabled={status === "loading"}
    >
      {status === "loading" ? "Enviando..." : "Enviar resumen por email"}
    </button>
  )
}

export default EmailSummaryButton
