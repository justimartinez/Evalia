import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db" // Importar desde el archivo centralizado

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trainingId = params.id

    // Obtener el ID del usuario de la cookie o del localStorage
    let userId = null
    const userCookie = request.cookies.get("user")?.value

    if (userCookie) {
      try {
        const user = JSON.parse(userCookie)
        userId = user.id
      } catch (error) {
        console.error("Error parsing user cookie:", error)
      }
    }

    // Si no hay userId, intentar obtenerlo de la sesión
    if (!userId) {
      // Aquí iría la lógica para obtener el userId de la sesión
      // Por ahora, usaremos un ID de prueba para desarrollo
      userId = 2 // ID de prueba para desarrollo
    }

    console.log(`Obteniendo capacitación ${trainingId} para usuario ${userId}`)

    // Obtener la información de la capacitación - Sin referencias a ut.score
    const trainingResult = await sql`
      SELECT 
        t.*,
        ut.status,
        ut.progress,
        ut.updated_at as completion_date
      FROM trainings t
      JOIN user_trainings ut ON t.id = ut.training_id
      WHERE t.id = ${trainingId} AND ut.user_id = ${userId}
    `

    if (trainingResult.length === 0) {
      return NextResponse.json({ error: "Capacitación no encontrada" }, { status: 404 })
    }

    const training = trainingResult[0]

    // Obtener el contenido de la capacitación
    const contentResult = await sql`
      SELECT 
        tc.*,
        (SELECT COUNT(*) > 0 FROM user_content_progress ucp WHERE ucp.content_id = tc.id AND ucp.user_id = ${userId}) as completed
      FROM training_content tc
      WHERE tc.training_id = ${trainingId}
      ORDER BY tc.order_index
    `

    // Obtener las preguntas del quiz
    const questionsResult = await sql`
      SELECT q.*, q.id as question_id
      FROM questions q
      WHERE q.training_id = ${trainingId}
      ORDER BY q.id
    `

    // Obtener las opciones de respuesta para cada pregunta
    const questionIds = questionsResult.map((q) => q.id)
    let optionsResult = []

    if (questionIds.length > 0) {
      // Usar la sintaxis correcta para la cláusula IN con arrays
      // Construir una lista de placeholders para la cláusula IN
      const placeholders = questionIds.map((_, i) => `$${i + 1}`).join(", ")

      // Usar sql.query en lugar de sql para consultas parametrizadas tradicionales
      const result = await sql.query(
        `SELECT * FROM question_options WHERE question_id IN (${placeholders}) ORDER BY question_id, order_index`,
        questionIds,
      )

      optionsResult = result.rows || []
    }

    // Agrupar las opciones por pregunta
    const questionOptions = {}
    optionsResult.forEach((option) => {
      if (!questionOptions[option.question_id]) {
        questionOptions[option.question_id] = []
      }
      questionOptions[option.question_id].push(option)
    })

    // Construir el objeto de preguntas con sus opciones
    const questions = questionsResult.map((question) => ({
      id: question.id,
      text: question.question_text || question.text,
      type: question.question_type || question.type,
      options: questionOptions[question.id] || [],
    }))

    // Formatear la respuesta
    const response = {
      id: training.id,
      title: training.title,
      description: training.description,
      category: "General", // Valor por defecto ya que no existe la columna
      duration: training.duration ? `${training.duration} minutos` : "No especificada",
      status: training.status,
      progress: Number.parseInt(training.progress || "0"),
      score: training.status === "completed" ? 100 : null, // Valor por defecto ya que no existe la columna
      dueDate: training.created_at ? new Date(training.created_at).toLocaleDateString("es-ES") : "Sin fecha límite",
      completionDate:
        training.completion_date && training.status === "completed"
          ? new Date(training.completion_date).toLocaleDateString("es-ES")
          : null,
      content: contentResult.map((content) => ({
        id: content.id,
        title: content.title,
        type: content.content_type || content.type,
        content: content.content,
        url: content.content_url || content.url,
        order: content.order_index,
        completed: content.completed,
      })),
      quiz: {
        id: "quiz-" + training.id,
        title: "Evaluación de " + training.title,
        description: "Demuestra tu conocimiento sobre " + training.title,
        timeLimit: 30, // minutos (podría ser un campo en la base de datos)
        questions: questions,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error al obtener detalles de la capacitación:", error)
    return NextResponse.json({ error: `Error al obtener la capacitación: ${error.message}` }, { status: 500 })
  }
}
