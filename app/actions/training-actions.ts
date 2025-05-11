"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

// Función auxiliar para obtener el ID de la compañía del usuario actual
async function getCurrentUserCompanyId() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      console.warn("No hay sesión de usuario activa")
      return null
    }

    // Si el usuario tiene companyId en la sesión, usarlo directamente
    if (session.user.companyId) {
      return session.user.companyId
    }

    // Si no, obtener el company_id del usuario desde la base de datos
    const userResult = await sql`
      SELECT company_id, role FROM "Evalia BD".users WHERE id = ${Number.parseInt(session.user.id)}
    `

    if (userResult.length === 0) {
      console.warn("Usuario no encontrado en la base de datos")
      return null
    }

    const user = userResult[0]

    // Si es super_admin, puede ver todo (retorna null para no filtrar)
    if (user.role === "super_admin") {
      return null
    }

    return user.company_id
  } catch (error) {
    console.error("Error al obtener el ID de la compañía del usuario:", error)
    // Para desarrollo, si hay un error, no filtrar por compañía
    return null
  }
}

export async function getTrainings() {
  try {
    // Para desarrollo, no filtrar por compañía inicialmente
    // const companyId = await getCurrentUserCompanyId()
    const companyId = null

    // Construir la consulta base
    let query = `
      SELECT t.*,
        (SELECT COUNT(*) FROM "Evalia BD".training_content tc WHERE tc.training_id = t.id) as content_count,
        (SELECT COUNT(*) FROM "Evalia BD".training_questions q WHERE q.training_id = t.id) as question_count,
        (SELECT COUNT(*) FROM "Evalia BD".training_assignments ut WHERE ut.training_id = t.id) as assigned_users,
        (SELECT COUNT(*) FROM "Evalia BD".training_assignments ut WHERE ut.training_id = t.id AND ut.completed_at IS NOT NULL) as completed_users
      FROM "Evalia BD".trainings t
    `

    // Añadir filtro por company_id si es necesario
    if (companyId !== null) {
      query += ` WHERE t.company_id = ${companyId}`
    }

    // Añadir orden
    query += ` ORDER BY t.created_at DESC`

    console.log("Query de getTrainings:", query)
    const trainings = await sql.unsafe(query)
    console.log("Trainings encontrados:", trainings.length)

    return trainings.map((training) => ({
      ...training,
      content_count: Number.parseInt(training.content_count) || 0,
      question_count: Number.parseInt(training.question_count) || 0,
      assigned_users: Number.parseInt(training.assigned_users) || 0,
      completed_users: Number.parseInt(training.completed_users) || 0,
    }))
  } catch (error) {
    console.error("Error al obtener capacitaciones:", error)
    return []
  }
}

export async function getTrainingById(id) {
  try {
    // Si el ID es "new", estamos en la página de creación de capacitación
    if (id === "new") {
      return null
    }

    // Convertir el ID a número para asegurarnos de que es un entero válido
    const numericId = Number.parseInt(id, 10)
    if (isNaN(numericId)) {
      console.error("ID de capacitación inválido:", id)
      return null
    }

    // Para desarrollo, no filtrar por compañía inicialmente
    // const companyId = await getCurrentUserCompanyId()
    const companyId = null

    // Obtener datos básicos de la capacitación
    let trainingQuery = `
      SELECT t.*,
        (SELECT COUNT(*) FROM "Evalia BD".training_content tc WHERE tc.training_id = t.id) as content_count,
        (SELECT COUNT(*) FROM "Evalia BD".training_questions q WHERE q.training_id = t.id) as question_count,
        (SELECT COUNT(*) FROM "Evalia BD".training_assignments ut WHERE ut.training_id = t.id) as assigned_users,
        (SELECT COUNT(*) FROM "Evalia BD".training_assignments ut WHERE ut.training_id = t.id AND ut.completed_at IS NOT NULL) as completed_users
      FROM "Evalia BD".trainings t
      WHERE t.id = ${numericId}
    `

    // Añadir filtro por company_id si es necesario
    if (companyId !== null) {
      trainingQuery += ` AND t.company_id = ${companyId}`
    }

    console.log("Query de getTrainingById:", trainingQuery)
    const trainingResult = await sql.unsafe(trainingQuery)
    console.log("Training encontrado:", trainingResult.length > 0)

    if (trainingResult.length === 0) {
      return null
    }

    const training = trainingResult[0]

    // Obtener contenido de la capacitación
    const contentResult = await sql`
      SELECT *
      FROM "Evalia BD".training_content
      WHERE training_id = ${numericId}
      ORDER BY order_index
    `

    // Obtener preguntas de la capacitación
    const questionsResult = await sql`
      SELECT *
      FROM "Evalia BD".training_questions
      WHERE training_id = ${numericId}
      ORDER BY order_index
    `

    // Obtener usuarios asignados a la capacitación
    const userTrainingsResult = await sql`
      SELECT ta.*, u.name as user_name, u.email as user_email, 
        (SELECT d.name FROM "Evalia BD".departments d JOIN "Evalia BD".user_departments ud ON d.id = ud.department_id WHERE ud.user_id = u.id LIMIT 1) as department
      FROM "Evalia BD".training_assignments ta
      JOIN "Evalia BD".users u ON ta.user_id = u.id
      WHERE ta.training_id = ${numericId}
      ORDER BY ta.created_at DESC
    `

    return {
      ...training,
      content: contentResult,
      questions: questionsResult.map((q) => ({
        ...q,
        options: q.options || [],
      })),
      user_trainings: userTrainingsResult,
      content_count: Number.parseInt(training.content_count) || 0,
      question_count: Number.parseInt(training.question_count) || 0,
      assigned_users: Number.parseInt(training.assigned_users) || 0,
      completed_users: Number.parseInt(training.completed_users) || 0,
    }
  } catch (error) {
    console.error("Error al obtener capacitación:", error)
    return null
  }
}

export async function createTraining(trainingData) {
  try {
    // Para desarrollo, usar un company_id fijo
    const companyId = 1 // Empresa ABC

    // Obtener el ID del usuario actual o usar un valor predeterminado
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id || 1 // Valor predeterminado para desarrollo

    console.log("Creando capacitación con datos:", {
      title: trainingData.title,
      description: trainingData.description,
      duration: trainingData.duration || 0,
      status: trainingData.status || "draft",
      company_id: companyId,
      created_by: userId,
    })

    // Insertar la capacitación
    const trainingResult = await sql`
      INSERT INTO "Evalia BD".trainings 
      (title, description, objectives, duration, difficulty_level, status, created_by, company_id, created_at, updated_at) 
      VALUES (
        ${trainingData.title},
        ${trainingData.description || null},
        ${trainingData.objectives || null},
        ${trainingData.duration || 0},
        ${trainingData.difficulty_level || "intermedio"},
        ${trainingData.status || "draft"},
        ${userId},
        ${companyId},
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
      ) 
      RETURNING id
    `

    const trainingId = trainingResult[0].id

    // Insertar contenido de la capacitación
    if (trainingData.content && trainingData.content.length > 0) {
      for (let i = 0; i < trainingData.content.length; i++) {
        const content = trainingData.content[i]

        await sql`
          INSERT INTO "Evalia BD".training_content 
          (training_id, title, content_type, content, url, order_index, company_id, created_at) 
          VALUES (
            ${trainingId},
            ${content.title || "Sin título"},
            ${content.type || "text"},
            ${content.content || ""},
            ${content.url || ""},
            ${i},
            ${companyId},
            CURRENT_TIMESTAMP
          )
        `
      }
    }

    // Insertar preguntas y opciones
    if (trainingData.questions && trainingData.questions.length > 0) {
      for (let i = 0; i < trainingData.questions.length; i++) {
        const question = trainingData.questions[i]

        // Convertir opciones a formato JSONB
        const options = question.options || []
        const correctAnswer = options.find((opt) => opt.isCorrect)?.text || null

        await sql`
          INSERT INTO "Evalia BD".training_questions 
          (training_id, question_text, question_type, options, correct_answer, order_index, created_at) 
          VALUES (
            ${trainingId}, 
            ${question.text}, 
            ${question.type || "multiple_choice"}, 
            ${JSON.stringify(options)}::jsonb,
            ${correctAnswer},
            ${i},
            CURRENT_TIMESTAMP
          )
        `
      }
    }

    // Revalidar las rutas para actualizar los datos
    revalidatePath("/admin/trainings")
    revalidatePath("/admin/dashboard")

    return { success: true, trainingId }
  } catch (error) {
    console.error("Error al crear capacitación:", error)
    return { success: false, error: error.message }
  }
}

export async function publishTraining(trainingId) {
  try {
    console.log("Intentando publicar capacitación con ID:", trainingId)

    // Convertir el ID a número para asegurarnos de que es un entero válido
    const numericId = Number.parseInt(trainingId, 10)
    if (isNaN(numericId)) {
      console.error("ID de capacitación inválido para publicar:", trainingId)
      return { success: false, error: "ID de capacitación inválido" }
    }

    // Para desarrollo, no filtrar por compañía
    // const companyId = await getCurrentUserCompanyId()
    const companyId = null

    // Verificar que la capacitación existe
    let trainingQuery = `
      SELECT id, title, company_id FROM "Evalia BD".trainings WHERE id = ${numericId}
    `

    // Añadir filtro por company_id si es necesario
    if (companyId !== null) {
      trainingQuery += ` AND company_id = ${companyId}`
    }

    console.log("Query para verificar capacitación:", trainingQuery)
    const training = await sql.unsafe(trainingQuery)
    console.log("Capacitación encontrada:", training.length > 0)

    if (training.length === 0) {
      return { success: false, error: "Capacitación no encontrada o no tienes permisos para publicarla" }
    }

    // Actualizar el estado de la capacitación a publicado
    console.log("Actualizando estado de capacitación a 'published'")
    await sql`
      UPDATE "Evalia BD".trainings SET status = 'published', updated_at = CURRENT_TIMESTAMP WHERE id = ${numericId}
    `
    console.log("Capacitación publicada exitosamente")

    // Revalidar las rutas para actualizar los datos
    revalidatePath(`/admin/trainings/${numericId}`)
    revalidatePath("/admin/trainings")
    revalidatePath("/admin/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error al publicar capacitación:", error)
    return { success: false, error: error.message || "Error al publicar capacitación" }
  }
}

export async function getTrainingStats() {
  try {
    // Para desarrollo, no filtrar por compañía
    // const companyId = await getCurrentUserCompanyId()
    const companyId = null

    // Construir la consulta para estadísticas generales
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM "Evalia BD".trainings ${companyId !== null ? `WHERE company_id = ${companyId}` : ""}) as total_trainings,
        (SELECT COUNT(*) FROM "Evalia BD".users ${companyId !== null ? `WHERE company_id = ${companyId}` : ""}) as total_users,
        (SELECT COUNT(*) FROM "Evalia BD".training_assignments ${companyId !== null ? `WHERE company_id = ${companyId}` : ""}) as total_assignments,
        COALESCE(
          (SELECT ROUND(
            (COUNT(*) FILTER (WHERE ta.completed_at IS NOT NULL) * 100.0 / NULLIF(COUNT(*), 0))
          ) FROM "Evalia BD".training_assignments ta
          ${companyId !== null ? `WHERE ta.company_id = ${companyId}` : ""}),
          0
        ) as completion_rate,
        (SELECT COUNT(*) FROM "Evalia BD".evaluations ${companyId !== null ? `WHERE company_id = ${companyId}` : ""}) as total_evaluations
    `

    console.log("Query de estadísticas:", statsQuery)
    const statsResult = await sql.unsafe(statsQuery)
    console.log("Estadísticas obtenidas:", statsResult[0])

    // Construir la consulta para datos de completados vs asignados por mes
    const completionDataQuery = `
      WITH months AS (
        SELECT generate_series(
          date_trunc('month', CURRENT_DATE - INTERVAL '5 months'),
          date_trunc('month', CURRENT_DATE),
          INTERVAL '1 month'
        ) as month
      )
      SELECT 
        to_char(m.month, 'Mon') as month,
        COUNT(ta.id) FILTER (WHERE ta.assigned_at >= m.month AND ta.assigned_at < m.month + INTERVAL '1 month'
          ${companyId !== null ? `AND ta.company_id = ${companyId}` : ""}) as assigned,
        COUNT(ta.id) FILTER (WHERE ta.completed_at IS NOT NULL AND ta.completed_at >= m.month AND ta.completed_at < m.month + INTERVAL '1 month'
          ${companyId !== null ? `AND ta.company_id = ${companyId}` : ""}) as completed
      FROM months m
      LEFT JOIN "Evalia BD".training_assignments ta ON ta.assigned_at >= m.month - INTERVAL '1 year'
      GROUP BY m.month
      ORDER BY m.month
    `

    const completionDataResult = await sql.unsafe(completionDataQuery)

    // Construir la consulta para datos de rendimiento por departamento
    const departmentDataQuery = `
      SELECT 
        d.name,
        COALESCE(AVG(utp.score), 0) as average_score
      FROM "Evalia BD".departments d
      LEFT JOIN "Evalia BD".user_departments ud ON d.id = ud.department_id
      LEFT JOIN "Evalia BD".user_training_progress utp ON ud.user_id = utp.user_id AND utp.status = 'completed'
      ${companyId !== null ? `WHERE d.company_id = ${companyId}` : ""}
      GROUP BY d.name
      ORDER BY average_score DESC
      LIMIT 10
    `

    const departmentDataResult = await sql.unsafe(departmentDataQuery)

    return {
      stats: statsResult[0],
      completionData: completionDataResult,
      departmentData: departmentDataResult,
    }
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return {
      stats: {
        total_trainings: 0,
        total_users: 0,
        completion_rate: 0,
        total_evaluations: 0,
      },
      completionData: [],
      departmentData: [],
    }
  }
}

export async function getRecentActivity() {
  try {
    // Para desarrollo, no filtrar por compañía
    // const companyId = await getCurrentUserCompanyId()
    const companyId = null

    // Construir la consulta para actividad reciente
    const activityQuery = `
      (
        SELECT 
          'training_created' as activity_type,
          t.title,
          t.created_at as timestamp,
          u.name as user_name
        FROM "Evalia BD".trainings t
        JOIN "Evalia BD".users u ON t.created_by = u.id
        ${companyId !== null ? `WHERE t.company_id = ${companyId}` : ""}
        ORDER BY t.created_at DESC
        LIMIT 5
      )
      UNION ALL
      (
        SELECT 
          'training_completed' as activity_type,
          t.title,
          ta.completed_at as timestamp,
          u.name as user_name
        FROM "Evalia BD".training_assignments ta
        JOIN "Evalia BD".trainings t ON ta.training_id = t.id
        JOIN "Evalia BD".users u ON ta.user_id = u.id
        WHERE ta.completed_at IS NOT NULL
        ${companyId !== null ? `AND ta.company_id = ${companyId}` : ""}
        ORDER BY ta.completed_at DESC
        LIMIT 5
      )
      ORDER BY timestamp DESC
      LIMIT 10
    `

    const activityResult = await sql.unsafe(activityQuery)

    return activityResult
  } catch (error) {
    console.error("Error al obtener actividad reciente:", error)
    return []
  }
}

export async function assignTrainingToUsers(trainingId, userIds) {
  try {
    const companyId = 1 // Para desarrollo, usar un company_id fijo

    // Verificar que la capacitación existe
    const existingTraining = await sql`SELECT id FROM "Evalia BD".trainings WHERE id = ${trainingId}`
    if (existingTraining.length === 0) {
      return { success: false, error: "Capacitación no encontrada" }
    }

    // Asignar la capacitación a los usuarios
    const assignments = userIds.map((userId) => ({
      training_id: trainingId,
      user_id: userId,
      company_id: companyId,
      assigned_at: new Date(),
    }))

    await sql`
      INSERT INTO "Evalia BD".training_assignments (training_id, user_id, company_id, assigned_at, created_at)
      SELECT training_id, user_id, company_id, assigned_at, CURRENT_TIMESTAMP
      FROM jsonb_to_recordset(${JSON.stringify(assignments)}) AS training_assignments (training_id INT, user_id INT, company_id INT, assigned_at TIMESTAMP)
      ON CONFLICT (training_id, user_id) DO NOTHING
    `

    // Revalidar las rutas para actualizar los datos
    revalidatePath(`/admin/trainings/${trainingId}`)
    revalidatePath("/admin/trainings")

    return { success: true }
  } catch (error) {
    console.error("Error al asignar capacitación a usuarios:", error)
    return { success: false, error: error.message }
  }
}

export async function assignTrainingToDepartments(trainingId, departmentIds) {
  try {
    const companyId = 1 // Para desarrollo, usar un company_id fijo

    // Verificar que la capacitación existe
    const existingTraining = await sql`SELECT id FROM "Evalia BD".trainings WHERE id = ${trainingId}`
    if (existingTraining.length === 0) {
      return { success: false, error: "Capacitación no encontrada" }
    }

    // Asignar la capacitación a los departamentos
    const assignments = departmentIds.map((departmentId) => ({
      training_id: trainingId,
      department_id: departmentId,
      company_id: companyId,
      created_at: new Date(),
    }))

    await sql`
      INSERT INTO "Evalia BD".training_departments (training_id, department_id, company_id, created_at)
      SELECT training_id, department_id, company_id, created_at
      FROM jsonb_to_recordset(${JSON.stringify(assignments)}) AS training_departments (training_id INT, department_id INT, company_id INT, created_at TIMESTAMP)
      ON CONFLICT (training_id, department_id) DO NOTHING
    `

    // Revalidar las rutas para actualizar los datos
    revalidatePath(`/admin/trainings/${trainingId}`)
    revalidatePath("/admin/trainings")

    return { success: true }
  } catch (error) {
    console.error("Error al asignar capacitación a departamentos:", error)
    return { success: false, error: error.message }
  }
}
