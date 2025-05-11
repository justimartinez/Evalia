import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET /api/trainings/[id] - Obtener una capacitación específica
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const trainingId = params.id

    // Obtener información de la capacitación
    const trainings = await sql`
      SELECT t.*
      FROM "Evalia BD".trainings t
      WHERE t.id = ${trainingId}
    `

    if (trainings.length === 0) {
      return NextResponse.json({ error: "Capacitación no encontrada" }, { status: 404 })
    }

    const training = trainings[0]

    // Obtener contenido de la capacitación
    const content = await sql`
      SELECT *
      FROM "Evalia BD".training_content
      WHERE training_id = ${trainingId}
      ORDER BY order_index
    `

    // Obtener preguntas de la capacitación
    const questions = await sql`
      SELECT *
      FROM "Evalia BD".training_questions
      WHERE training_id = ${trainingId}
      ORDER BY order_index
    `

    // Obtener asignaciones de la capacitación
    const assignments = await sql`
      SELECT ta.*, u.name as user_name, u.email as user_email
      FROM "Evalia BD".training_assignments ta
      JOIN "Evalia BD".users u ON ta.user_id = u.id
      WHERE ta.training_id = ${trainingId}
    `

    return NextResponse.json({
      ...training,
      content,
      questions: questions.map((q) => ({
        ...q,
        options: q.options || [],
      })),
      assignments,
    })
  } catch (error) {
    console.error("Error al obtener capacitación:", error)
    return NextResponse.json({ error: "Error al obtener capacitación" }, { status: 500 })
  }
}

// PUT /api/trainings/[id] - Actualizar una capacitación
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const trainingId = params.id
    const body = await request.json()
    const { title, description, objectives, status, duration, difficulty_level } = body

    // Validar datos requeridos
    if (!title) {
      return NextResponse.json({ error: "El título es requerido" }, { status: 400 })
    }

    // Verificar si la capacitación existe
    const existingTraining = await sql`SELECT id FROM "Evalia BD".trainings WHERE id = ${trainingId}`
    if (existingTraining.length === 0) {
      return NextResponse.json({ error: "Capacitación no encontrada" }, { status: 404 })
    }

    // Actualizar la capacitación
    await sql`
      UPDATE "Evalia BD".trainings
      SET 
        title = ${title},
        description = ${description || null},
        objectives = ${objectives || null},
        status = ${status || "draft"},
        duration = ${duration || 0},
        difficulty_level = ${difficulty_level || "intermedio"},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${trainingId}
    `

    return NextResponse.json({ message: "Capacitación actualizada exitosamente" })
  } catch (error) {
    console.error("Error al actualizar capacitación:", error)
    return NextResponse.json({ error: "Error al actualizar capacitación" }, { status: 500 })
  }
}

// DELETE /api/trainings/[id] - Eliminar una capacitación
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const trainingId = params.id

    // Verificar si la capacitación existe
    const existingTraining = await sql`SELECT id FROM "Evalia BD".trainings WHERE id = ${trainingId}`
    if (existingTraining.length === 0) {
      return NextResponse.json({ error: "Capacitación no encontrada" }, { status: 404 })
    }

    // Eliminar la capacitación y sus relaciones
    // Primero eliminar las asignaciones
    await sql`DELETE FROM "Evalia BD".training_assignments WHERE training_id = ${trainingId}`

    // Eliminar el contenido
    await sql`DELETE FROM "Evalia BD".training_content WHERE training_id = ${trainingId}`

    // Eliminar las preguntas
    await sql`DELETE FROM "Evalia BD".training_questions WHERE training_id = ${trainingId}`

    // Eliminar las asignaciones a departamentos
    await sql`DELETE FROM "Evalia BD".training_departments WHERE training_id = ${trainingId}`

    // Eliminar el progreso de los usuarios
    await sql`DELETE FROM "Evalia BD".user_training_progress WHERE training_id = ${trainingId}`

    // Finalmente eliminar la capacitación
    await sql`DELETE FROM "Evalia BD".trainings WHERE id = ${trainingId}`

    return NextResponse.json({ message: "Capacitación eliminada exitosamente" })
  } catch (error) {
    console.error("Error al eliminar capacitación:", error)
    return NextResponse.json({ error: "Error al eliminar capacitación" }, { status: 500 })
  }
}
