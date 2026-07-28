import { useState } from "react"
import type { Task } from "../../types/task"
import "./EmailSummaryButton.css"

interface Props {
    todos: Task[]
    userEmail: string
}

type Status = "idle" | "loading" | "success" | "error"

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
    const [errorMsg, setErrorMsg] = useState("")

    async function handleSend() {
        setStatus("loading")
        setErrorMsg("")

        const summary = buildTodoSummary(todos)

        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: userEmail, summary }),
            })

            const data = await res.json()

            if (!res.ok) {
                setStatus("error")
                setErrorMsg(data?.message || "Error al enviar el email")
                return
            }

            setStatus("success")
        } catch (error) {
            setStatus("error")
            setErrorMsg("No se pudo conectar con el servidor")
        }
    }

    return (
        <div>
            <button
                className="email-btn"
                onClick={handleSend}
                disabled={status === "loading"}
            >
                {status === "loading" ? "Enviando..." : "Enviar resumen por email"}
            </button>

            {status === "success" && (
                <p className="email-status email-status--success">
                    ✓ Email enviado correctamente
                </p>
            )}
            {status === "error" && (
                <p className="email-status email-status--error">
                    ✗ {errorMsg}
                </p>
            )}
        </div>
    )
}

export default EmailSummaryButton