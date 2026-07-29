import { useState } from "react"
import type { Task } from "../../types/task"
import { useToast } from "../../hooks/useToast"
import "./EmailSummaryButton.css"

interface Props {
    todos: Task[]
    userEmail: string
}

type Status = "idle" | "loading"

// Colores de prioridad, iguales a los de TaskItem/Summary. 
const PRIORITY_EMAIL_META: Record<Task["priority"], { label: string; color: string; bg: string }> = {
    high: { label: "Alta", color: "#D6336C", bg: "#F9D9E3" },
    medium: { label: "Media", color: "#E24E17", bg: "#FFE1D1" },
    low: { label: "Baja", color: "#4A3550", bg: "#EDE3D2" },
}

// Los títulos de tarea son texto que escribió la persona usuaria: hay que
// escaparlos antes de insertarlos en el HTML del email para que no rompan
// el layout (ni inyecten markup) si alguien pone < > & " ' en el título.
function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
}

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

function buildTaskRowHtml(task: Task): string {
    const meta = PRIORITY_EMAIL_META[task.priority]
    const titleStyle = task.completed
        ? "text-decoration:line-through;color:#8a7a8f;"
        : "color:#2B1B2E;"

    return `
      <tr>
        <td style="padding:0 0 10px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #E5D6C2;border-left:4px solid ${meta.color};border-radius:8px;">
            <tr>
              <td style="padding:12px 14px;font-family:Georgia,serif;font-size:14px;font-weight:600;${titleStyle}">
                ${escapeHtml(task.title)}
              </td>
              <td align="right" style="padding:12px 14px;white-space:nowrap;">
                <span style="display:inline-block;padding:3px 10px;border-radius:100px;background:${meta.bg};color:${meta.color};font-family:Arial,sans-serif;font-size:11px;font-weight:700;">
                  ${meta.label}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
}

// Versión HTML del mismo resumen, con el estilo visual de la app (header
// plum con el logo, tarjetas con el color de prioridad como borde
// izquierdo, igual que en la lista de tareas). Los emails no soportan
// flexbox/grid ni <style> confiable, así que el layout va con <table> y
// los estilos van todos inline.
function buildTodoSummaryHtml(todos: Task[]): string {
    const pending = todos.filter((t) => !t.completed)
    const done = todos.filter((t) => t.completed)

    const pendingRows = pending.length
        ? pending.map(buildTaskRowHtml).join("")
        : `<tr><td style="padding:8px 0;color:#8a7a8f;font-family:Arial,sans-serif;font-size:13px;">No tenés tareas pendientes. ¡Vas al día!</td></tr>`

    const doneRows = done.length
        ? done.map(buildTaskRowHtml).join("")
        : `<tr><td style="padding:8px 0;color:#8a7a8f;font-family:Arial,sans-serif;font-size:13px;">Todavía no completaste tareas.</td></tr>`

    return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0E5D3;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFF8EE;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="background:#2B1B2E;padding:26px 28px;">
                <div style="font-family:Georgia,serif;font-style:italic;color:#ffffff;font-size:20px;font-weight:700;">for today</div>
                <div style="font-family:Arial,sans-serif;color:#CBB9CE;font-size:13px;margin-top:4px;">Tu resumen de tareas</div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 28px 4px;">
                <div style="font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#2B1B2E;margin-bottom:12px;">
                  Tareas pendientes (${pending.length})
                </div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${pendingRows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 28px 4px;">
                <div style="font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#2B1B2E;margin-bottom:12px;">
                  Tareas completadas (${done.length})
                </div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${doneRows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px 26px;border-top:1px solid #E5D6C2;">
                <div style="font-family:Arial,sans-serif;font-size:11.5px;color:#8a7a8f;">
                  Enviado desde For Today.
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`
}

function EmailSummaryButton({ todos, userEmail }: Props) {
    const [status, setStatus] = useState<Status>("idle")
    const { showToast } = useToast()

    async function handleSend() {
        setStatus("loading")

        const summary = buildTodoSummary(todos)
        const summaryHtml = buildTodoSummaryHtml(todos)

        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to: userEmail, summary, summaryHtml }),
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
