import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { executeQuery } from "@/lib/db"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userId = session.user.id

    // Marcar todas las notificaciones como leídas
    await executeQuery("UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false", [userId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al marcar todas las notificaciones como leídas:", error)
    return NextResponse.json({ error: "Error al marcar todas las notificaciones como leídas" }, { status: 500 })
  }
}
