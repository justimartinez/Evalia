import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    return NextResponse.json({
      hasSession: !!session,
      session: session
        ? {
            user: {
              ...session.user,
              // No incluir información sensible completa
              email: session.user?.email ? `${session.user.email.substring(0, 3)}...` : null,
            },
            expires: session.expires,
          }
        : null,
      message: session ? "Sesión activa encontrada" : "No hay sesión activa",
    })
  } catch (error) {
    console.error("Error al obtener la sesión:", error)
    return NextResponse.json(
      {
        error: error.message,
        stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
