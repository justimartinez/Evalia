import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { executeQuery } from "@/lib/db"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userId = session.user.id
    const notificationId = params.id

    // Verificar que la notificación pertenece al usuario
    const notification = await executeQuery("SELECT id FROM notifications WHERE id = $1 AND user_id = $2", [
      notificationId,
      userId,
    ])

    if (notification.length === 0) {
      return NextResponse.json({ error: "Notificación no encontrada" }, { status: 404 })
    }

    // Marcar como leída
    await executeQuery("UPDATE notifications SET is_read = true WHERE id = $1", [notificationId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error)
    return NextResponse.json({ error: "Error al marcar notificación como leída" }, { status: 500 })
  }
}
