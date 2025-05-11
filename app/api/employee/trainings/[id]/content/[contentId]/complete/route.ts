import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request, { params }: { params: { id: string; contentId: string } }) {
  try {
    const trainingId = params.id
    const contentId = params.contentId

    // Obtener el ID del usuario (en un entorno real, esto vendría de la sesión)
    const userId = 2 // ID de prueba para desarrollo

    // Verificar si el usuario tiene asignada esta capacitación
    const userTrainingResult = await sql`
      SELECT id, status, progress
      FROM user_trainings
      WHERE user_id = ${userId} AND training_id = ${trainingId}
    `

    if (userTrainingResult.length === 0) {
      return NextResponse.json({ error: "Capacitación no encontrada o no asignada" }, { status: 404 })
    }

    const userTrainingId = userTrainingResult[0].id

    // Verificar si el contenido pertenece a esta capacitación
    const contentResult = await sql`
      SELECT id
      FROM training_content
      WHERE id = ${contentId} AND training_id = ${trainingId}
    `

    if (contentResult.length === 0) {
      return NextResponse.json({ error: "Contenido no encontrado o no pertenece a esta capacitación" }, { status: 404 })
    }

    // Verificar si ya está marcado como completado
    const progressResult = await sql`
      SELECT id
      FROM user_content_progress
      WHERE user_id = ${userId} AND content_id = ${contentId}
    `

    // Si no está marcado como completado, marcarlo
    if (progressResult.length === 0) {
      await sql`
        INSERT INTO user_content_progress (user_id, content_id, completed_at)
        VALUES (${userId}, ${contentId}, NOW())
      `
    }

    // Calcular el progreso total
    const totalContentResult = await sql`
      SELECT COUNT(*) as total
      FROM training_content
      WHERE training_id = ${trainingId}
    `

    const completedContentResult = await sql`
      SELECT COUNT(*) as completed
      FROM user_content_progress ucp
      JOIN training_content tc ON ucp.content_id = tc.id
      WHERE ucp.user_id = ${userId} AND tc.training_id = ${trainingId}
    `

    const totalContent = Number.parseInt(totalContentResult[0].total)
    const completedContent = Number.parseInt(completedContentResult[0].completed)
    const progress = Math.round((completedContent / totalContent) * 100)

    // Actualizar el progreso en user_trainings
    let newStatus = userTrainingResult[0].status
    if (progress === 100 && newStatus !== "completed") {
      newStatus = "ready_for_quiz"
    } else if (progress > 0 && newStatus === "not_started") {
      newStatus = "in_progress"
    }

    await sql`
      UPDATE user_trainings
      SET progress = ${progress}, status = ${newStatus}, updated_at = NOW()
      WHERE id = ${userTrainingId}
    `

    return NextResponse.json({
      success: true,
      progress,
      status: newStatus,
    })
  } catch (error) {
    console.error("Error al marcar contenido como completado:", error)
    return NextResponse.json({ error: "Error al marcar contenido como completado" }, { status: 500 })
  }
}
