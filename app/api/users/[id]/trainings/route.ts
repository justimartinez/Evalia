import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/db"

// GET /api/users/[id]/trainings - Obtener capacitaciones de un usuario
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verificar si el usuario existe
    const existingUser = await executeQuery("SELECT id FROM users WHERE id = $1", [params.id])
    if (existingUser.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Obtener capacitaciones asignadas al usuario
    const userTrainings = await executeQuery(
      `
      SELECT ta.id, ta.training_id, t.title, ta.status, ta.assigned_date, ta.completion_date, ta.score
      FROM training_assignments ta
      JOIN trainings t ON ta.training_id = t.id
      WHERE ta.user_id = $1
      ORDER BY ta.assigned_date DESC
    `,
      [params.id],
    )

    return NextResponse.json(userTrainings)
  } catch (error) {
    console.error("Error al obtener capacitaciones del usuario:", error)
    return NextResponse.json({ error: "Error al obtener capacitaciones del usuario" }, { status: 500 })
  }
}
