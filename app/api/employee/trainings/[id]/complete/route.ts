import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const trainingId = params.id
    const { score, answers } = await request.json()

    // Obtener el ID del usuario (en un entorno real, esto vendría de la sesión)
    const userId = 2 // ID de prueba para desarrollo

    // Verificar si el usuario tiene asignada esta capacitación
    const userTrainingResult = await sql`
      SELECT id, status
      FROM user_trainings
      WHERE user_id = ${userId} AND training_id = ${trainingId}
    `

    if (userTrainingResult.length === 0) {
      return NextResponse.json({ error: "Capacitación no encontrada o no asignada" }, { status: 404 })
    }

    const userTrainingId = userTrainingResult[0].id

    // Marcar la capacitación como completada
    await sql`
      UPDATE user_trainings
      SET 
        status = 'completed', 
        progress = 100, 
        completion_time = NOW(),
        updated_at = NOW()
      WHERE id = ${userTrainingId}
    `

    // Guardar las respuestas del usuario
    if (answers && Object.keys(answers).length > 0) {
      for (const questionId in answers) {
        const answer = answers[questionId]

        // Verificar si ya existe una respuesta para esta pregunta
        const existingAnswer = await sql`
          SELECT id FROM user_answers
          WHERE user_id = ${userId} AND question_id = ${questionId}
        `

        if (existingAnswer.length > 0) {
          // Actualizar respuesta existente
          await sql`
            UPDATE user_answers
            SET answer = ${answer}, updated_at = NOW()
            WHERE id = ${existingAnswer[0].id}
          `
        } else {
          // Crear nueva respuesta
          await sql`
            INSERT INTO user_answers (user_id, question_id, answer, created_at, updated_at)
            VALUES (${userId}, ${questionId}, ${answer}, NOW(), NOW())
          `
        }
      }
    }

    // Crear una notificación para el usuario
    await sql`
      INSERT INTO notifications (user_id, type, title, message, created_at, is_read)
      VALUES (
        ${userId}, 
        'training_completed', 
        'Capacitación completada', 
        'Has completado exitosamente una capacitación con una puntuación de ' || ${score} || '%', 
        NOW(),
        false
      )
    `

    return NextResponse.json({
      success: true,
      message: "Capacitación completada exitosamente",
    })
  } catch (error) {
    console.error("Error al completar la capacitación:", error)
    return NextResponse.json({ error: "Error al completar la capacitación" }, { status: 500 })
  }
}
