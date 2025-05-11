import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { syncUserToNeon, getUserByEmail } from "@/lib/neon-auth-integration"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    // Obtener datos del usuario de Neon Auth
    const neonUser = await getUserByEmail(session.user.email || "")

    return NextResponse.json({
      success: true,
      synced: !!neonUser,
      user: neonUser
        ? {
            id: neonUser.id,
            email: neonUser.email,
            name: neonUser.name,
            role: neonUser.role,
            lastUpdated: neonUser.updated_at,
          }
        : null,
    })
  } catch (error) {
    console.error("Error al verificar sincronización con Neon Auth:", error)
    return NextResponse.json({ error: "Error al verificar sincronización" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const body = await request.json()
    const { metadata } = body

    // Sincronizar usuario con Neon Auth
    const result = await syncUserToNeon({
      id: session.user.id,
      email: session.user.email || "",
      name: session.user.name || "",
      role: session.user.role,
      metadata: {
        ...metadata,
        lastManualSync: new Date().toISOString(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Usuario sincronizado correctamente",
      result,
    })
  } catch (error) {
    console.error("Error al sincronizar con Neon Auth:", error)
    return NextResponse.json({ error: "Error al sincronizar usuario" }, { status: 500 })
  }
}
