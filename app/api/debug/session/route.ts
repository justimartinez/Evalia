import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  try {
    // En lugar de usar getServerSession, que usa crypto.createHash,
    // simplemente obtenemos las cookies y proporcionamos información básica
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get("next-auth.session-token")
    const csrfCookie = cookieStore.get("next-auth.csrf-token")

    return NextResponse.json({
      hasSessionCookie: !!sessionCookie,
      sessionCookieExists: !!sessionCookie,
      csrfCookieExists: !!csrfCookie,
      // No podemos decodificar el contenido de la cookie sin crypto
      cookieNames: Array.from(cookieStore.getAll()).map((c) => c.name),
    })
  } catch (error) {
    console.error("Error al obtener información de cookies:", error)
    return NextResponse.json({ error: `Error al obtener información de cookies: ${error.message}` }, { status: 500 })
  }
}
