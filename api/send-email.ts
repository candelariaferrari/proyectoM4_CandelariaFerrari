// Importamos los tipos de Vercel para tener tipado en la request y la response.
// Todos los archivos dentro de /api se convierten automáticamente en endpoints.
import type { VercelRequest, VercelResponse } from "@vercel/node"
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

// Creamos una única instancia del cliente de SES.
const ses = new SESClient({
  // Región donde está configurado SES.
  region: process.env.AWS_REGION,

  // Credenciales de AWS obtenidas desde las variables de entorno.
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})


// Vercel ejecuta esta función cada vez que alguien hace una petición a este endpoint.
export default async function handler(req: VercelRequest, res: VercelResponse) {

  // Solo permitimos peticiones POST. un GET, PUT, DELETE, etc., devolvemos un error 405.
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" })
  }

  // Obtenemos los datos enviados desde el frontend. req.body contiene el cuerpo de la petición.
  const { to, summary } = req.body ?? {}

  // Validamos que hayan llegado los datos necesarios. Si falta alguno un error 400 (Bad Request).
  if (!to || !summary) {
    return res.status(400).json({ error: "Missing required fields: to, summary" })
  }

  // Dirección de email desde donde se enviará el correo. Debe estar verificada en AWS SES.
  const from = process.env.SES_FROM_EMAIL

  // Si no existe la variable de entorno significa que el servidor está mal configurado.
  if (!from) {
    return res.status(500).json({ error: "Server misconfigured: SES_FROM_EMAIL missing" })
  }

  try {
    // Creamos el comando que AWS SES utilizará para enviar el email.
    const command = new SendEmailCommand({

      // Email del remitente
      Source: from,

      // Lista de destinatarios
      Destination: {
        ToAddresses: [to],
      },

      // Contenido del correo
      Message: {

        // Asunto del email
        Subject: {
          Data: "Tu resumen de For Today - By Matecode",
        },

        // Cuerpo del email
        Body: {
          Text: {
            Data: summary,
          },
        },
      },
    })

    // Enviamos el email a AWS SES. SES se encarga de entregar el correo al destinatario.
    const result = await ses.send(command)

    // Si todo salió bien respondemos con éxito. AWS devuelve un MessageId único que identifica el email enviado.
    return res.status(200).json({
      ok: true,
      messageId: result.MessageId,
    })

  } catch (err: any) {

    // Si ocurre cualquier error durante el envío, lo mostramos en la consola del servidor para poder depurarlo.
    console.error("SES send error:", err?.name, err?.message)

    // También devolvemos un error al frontend.
    return res.status(500).json({
      ok: false,

      // Nombre del error que devuelve AWS
      error: err?.name ?? "UnknownError",

      // Mensaje descriptivo del error
      message: err?.message ?? "Failed to send email",
    })
  }
}