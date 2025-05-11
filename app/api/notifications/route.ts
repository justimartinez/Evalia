import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { executeQuery } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userId = session.user.id
    const url = new URL(request.url)
    const limit = url.searchParams.get("limit")
    const limitClause = limit ? `LIMIT ${limit}` : ""

    const notifications = await executeQuery(
      `SELECT id, title, message, type, is_read, created_at, action_url
       FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       ${limitClause}`,
      [userId],
    )

    return NextResponse.json(notifications)
  } catch (error) {
    console.error("Error al obtener notificaciones:", error)
    return NextResponse.json({ error: "Error al obtener notificaciones" }, { status: 500 })
  }
}
