"use server"

import { sql } from "@/lib/db"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/client-auth"

export async function getEmployeeTrainings(userId) {
  try {
    const trainings = await sql`
      SELECT 
        t.id, 
        t.title, 
        t.description,
        utp.status,
        ta.assigned_at,
        ta.started_at,
        ta.completed_at,
        utp.progress,
        utp.score
      FROM 
        "Evalia BD".trainings t
      JOIN 
        "Evalia BD".training_assignments ta ON t.id = ta.training_id
      LEFT JOIN 
        "Evalia BD".user_training_progress utp ON t.id = utp.training_id AND ta.user_id = utp.user_id
      WHERE 
        ta.user_id = ${userId}
      ORDER BY 
        CASE 
          WHEN utp.status = 'in_progress' THEN 1
          WHEN utp.status = 'pending' THEN 2
          WHEN utp.status = 'completed' THEN 3
          ELSE 4
        END
    `

    return trainings.map((training) => ({
      ...training,
      progress: Number(training.progress || 0),
      score: Number(training.score || 0),
      dueDate: training.due_date ? new Date(training.due_date).toLocaleDateString() : null,
      assignedAt: training.assigned_at ? new Date(training.assigned_at).toLocaleDateString() : null,
      completedAt: training.completed_at ? new Date(training.completed_at).toLocaleDateString() : null,
    }))
  } catch (error) {
    console.error("Error al obtener capacitaciones del empleado:", error)
    return []
  }
}

export async function getAllEmployeeTrainings() {
  try {
    console.log("getAllEmployeeTrainings: Iniciando función")

    // Try to get user from session first
    let userId = null
    let userSource = "none"

    try {
      console.log("getAllEmployeeTrainings: Intentando obtener sesión")
      const session = await getServerSession(authOptions)
      console.log("getAllEmployeeTrainings: Sesión obtenida", session ? "con éxito" : "vacía")

      if (session?.user?.id) {
        userId = session.user.id
        userSource = "session"
        console.log("getAllEmployeeTrainings: Usuario obtenido de sesión", userId)
      } else {
        // Fallback to client auth for development/testing
        console.log("getAllEmployeeTrainings: Intentando obtener usuario del cliente")
        const clientUser = getCurrentUser()
        if (clientUser?.id) {
          userId = clientUser.id
          userSource = "client"
          console.log("getAllEmployeeTrainings: Usuario obtenido del cliente", userId)
        }
      }
    } catch (sessionError) {
      console.error("getAllEmployeeTrainings: Error al obtener sesión", sessionError)
    }

    // Para desarrollo, si no hay usuario, usar uno de prueba
    if (!userId) {
      userId = 2 // ID de prueba para desarrollo
      userSource = "default"
      console.log("getAllEmployeeTrainings: Usando ID de usuario por defecto", userId)
    }

    console.log("getAllEmployeeTrainings: Consultando capacitaciones para usuario", userId, "fuente:", userSource)

    // Obtener todas las capacitaciones del empleado usando el schema "Evalia BD"
    // Corregido para usar utp.status en lugar de ta.status que no existe
    const trainingsResult = await sql`
      SELECT 
        ta.id,
        t.id as training_id,
        t.title,
        t.description,
        COALESCE(utp.status, 'not_started') as status,
        t.created_at as due_date,
        ta.completed_at as completion_date,
        COALESCE(utp.progress, 0) as progress,
        t.duration,
        'General' as category
      FROM "Evalia BD".training_assignments ta
      JOIN "Evalia BD".trainings t ON ta.training_id = t.id
      LEFT JOIN "Evalia BD".user_training_progress utp ON t.id = utp.training_id AND ta.user_id = utp.user_id
      WHERE ta.user_id = ${userId}
      ORDER BY 
        CASE 
          WHEN utp.status = 'in_progress' THEN 1
          WHEN utp.status = 'pending' THEN 2
          WHEN utp.status = 'not_started' THEN 3
          WHEN utp.status = 'completed' THEN 4
          ELSE 5
        END,
        t.created_at ASC
    `

    console.log("getAllEmployeeTrainings: Capacitaciones obtenidas", trainingsResult.length)

    // Formatear los datos para el frontend
    const trainings = trainingsResult.map((training) => ({
      id: training.training_id,
      title: training.title,
      description: training.description || "Sin descripción",
      status: training.status || "not_started",
      dueDate: training.due_date ? new Date(training.due_date).toLocaleDateString("es-ES") : "Sin fecha límite",
      completionDate:
        training.completion_date && training.status === "completed"
          ? new Date(training.completion_date).toLocaleDateString("es-ES")
          : null,
      progress: Number(training.progress || 0),
      score: training.status === "completed" ? 100 : null, // Valor por defecto ya que no tenemos columna de score
      duration: training.duration ? `${training.duration} minutos` : "No especificada",
      category: training.category || "General",
    }))

    console.log("getAllEmployeeTrainings: Función completada con éxito")
    return { trainings }
  } catch (error) {
    console.error("Error al obtener todas las capacitaciones del empleado:", error)
    return { error: `Error al obtener capacitaciones: ${error.message || "Error desconocido"}` }
  }
}

export async function getEmployeeTrainingById(userId, trainingId) {
  try {
    const trainingResult = await sql`
      SELECT 
        t.*,
        COALESCE(utp.status, 'not_started') as status,
        ta.assigned_at,
        ta.started_at,
        ta.completed_at,
        COALESCE(utp.progress, 0) as progress,
        COALESCE(utp.score, 0) as score
      FROM 
        "Evalia BD".trainings t
      JOIN 
        "Evalia BD".training_assignments ta ON t.id = ta.training_id
      LEFT JOIN 
        "Evalia BD".user_training_progress utp ON t.id = utp.training_id AND ta.user_id = utp.user_id
      WHERE 
        ta.user_id = ${userId} AND t.id = ${trainingId}
    `

    if (trainingResult.length === 0) {
      return null
    }

    const training = trainingResult[0]

    // Obtener contenido de la capacitación
    const contentResult = await sql`
      SELECT 
        tc.*,
        (SELECT COUNT(*) > 0 FROM "Evalia BD".user_content_progress ucp 
         WHERE ucp.content_id = tc.id AND ucp.user_id = ${userId}) as completed
      FROM 
        "Evalia BD".training_content tc
      WHERE 
        tc.training_id = ${trainingId}
      ORDER BY 
        tc.order_index
    `

    // Obtener preguntas de la capacitación
    const questionsResult = await sql`
      SELECT 
        tq.*
      FROM 
        "Evalia BD".training_questions tq
      WHERE 
        tq.training_id = ${trainingId}
      ORDER BY 
        tq.order_index
    `

    return {
      ...training,
      content: contentResult,
      questions: questionsResult.map((q) => ({
        ...q,
        options: q.options || [],
      })),
      progress: Number(training.progress || 0),
      score: Number(training.score || 0),
      dueDate: training.due_date ? new Date(training.due_date).toLocaleDateString() : null,
      assignedAt: training.assigned_at ? new Date(training.assigned_at).toLocaleDateString() : null,
      completedAt: training.completed_at ? new Date(training.completed_at).toLocaleDateString() : null,
    }
  } catch (error) {
    console.error("Error al obtener capacitación del empleado:", error)
    return null
  }
}

export async function markContentAsCompleted(userId, trainingId, contentId) {
  try {
    // Verificar si el usuario tiene asignada esta capacitación
    const trainingAssignment = await sql`
      SELECT id
      FROM "Evalia BD".training_assignments
      WHERE user_id = ${userId} AND training_id = ${trainingId}
    `

    if (trainingAssignment.length === 0) {
      return { success: false, error: "Capacitación no asignada al usuario" }
    }

    // Verificar si el contenido pertenece a esta capacitación
    const content = await sql`
      SELECT id
      FROM "Evalia BD".training_content
      WHERE id = ${contentId} AND training_id = ${trainingId}
    `

    if (content.length === 0) {
      return { success: false, error: "Contenido no encontrado o no pertenece a esta capacitación" }
    }

    // Marcar el contenido como completado
    await sql`
      INSERT INTO "Evalia BD".user_content_progress (user_id, content_id, completed_at, company_id)
      VALUES (${userId}, ${contentId}, CURRENT_TIMESTAMP, 1)
      ON CONFLICT (user_id, content_id) DO NOTHING
    `

    // Calcular el progreso total
    const totalContent = await sql`
      SELECT COUNT(*) as total
      FROM "Evalia BD".training_content
      WHERE training_id = ${trainingId}
    `

    const completedContent = await sql`
      SELECT COUNT(*) as completed
      FROM "Evalia BD".user_content_progress ucp
      JOIN "Evalia BD".training_content tc ON ucp.content_id = tc.id
      WHERE ucp.user_id = ${userId} AND tc.training_id = ${trainingId}
    `

    const total = Number(totalContent[0].total)
    const completed = Number(completedContent[0].completed)
    const progress = Math.round((completed / total) * 100)

    // Actualizar el progreso en user_training_progress
    await sql`
      INSERT INTO "Evalia BD".user_training_progress 
      (user_id, training_id, status, progress, company_id, created_at, updated_at)
      VALUES (
        ${userId}, 
        ${trainingId}, 
        CASE 
          WHEN ${progress} = 100 THEN 'ready_for_quiz'::text
          WHEN ${progress} > 0 THEN 'in_progress'::text
          ELSE 'not_started'::text
        END,
        ${progress},
        1,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (user_id, training_id) 
      DO UPDATE SET 
        progress = ${progress},
        status = CASE 
          WHEN ${progress} = 100 THEN 'ready_for_quiz'::text
          WHEN ${progress} > 0 THEN 'in_progress'::text
          ELSE 'not_started'::text
        END,
        updated_at = CURRENT_TIMESTAMP
    `

    // Actualizar el estado en training_assignments si tiene started_at
    if (progress > 0) {
      await sql`
        UPDATE "Evalia BD".training_assignments
        SET 
          started_at = COALESCE(started_at, CURRENT_TIMESTAMP)
        WHERE 
          user_id = ${userId} AND training_id = ${trainingId} AND started_at IS NULL
      `
    }

    return {
      success: true,
      progress,
      status: progress === 100 ? "ready_for_quiz" : progress > 0 ? "in_progress" : "not_started",
    }
  } catch (error) {
    console.error("Error al marcar contenido como completado:", error)
    return { success: false, error: error.message }
  }
}

export async function completeTraining(userId, trainingId, score, answers) {
  try {
    // Verificar si el usuario tiene asignada esta capacitación
    const trainingAssignment = await sql`
      SELECT id
      FROM "Evalia BD".training_assignments
      WHERE user_id = ${userId} AND training_id = ${trainingId}
    `

    if (trainingAssignment.length === 0) {
      return { success: false, error: "Capacitación no asignada al usuario" }
    }

    // Marcar la capacitación como completada en training_assignments
    await sql`
      UPDATE "Evalia BD".training_assignments
      SET 
        completed_at = CURRENT_TIMESTAMP
      WHERE 
        user_id = ${userId} AND training_id = ${trainingId}
    `

    // Actualizar el progreso en user_training_progress
    await sql`
      INSERT INTO "Evalia BD".user_training_progress 
      (user_id, training_id, status, progress, score, question_answers, company_id, created_at, updated_at, completed_at)
      VALUES (
        ${userId}, 
        ${trainingId}, 
        'completed',
        100,
        ${score},
        ${JSON.stringify(answers)}::jsonb,
        1,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (user_id, training_id) 
      DO UPDATE SET 
        status = 'completed',
        progress = 100,
        score = ${score},
        question_answers = ${JSON.stringify(answers)}::jsonb,
        updated_at = CURRENT_TIMESTAMP,
        completed_at = CURRENT_TIMESTAMP
    `

    // Crear una notificación para el usuario
    await sql`
      INSERT INTO "Evalia BD".notifications 
      (user_id, type, title, message, is_read, company_id, created_at)
      VALUES (
        ${userId}, 
        'training_completed', 
        'Capacitación completada', 
        'Has completado exitosamente una capacitación con una puntuación de ' || ${score} || '%', 
        false,
        1,
        CURRENT_TIMESTAMP
      )
    `

    return {
      success: true,
      message: "Capacitación completada exitosamente",
    }
  } catch (error) {
    console.error("Error al completar la capacitación:", error)
    return { success: false, error: error.message }
  }
}
