import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { executeQuery } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const userId = session.user.id

    // Obtener todas las capacitaciones asignadas al usuario
    const trainings = await executeQuery(
      `SELECT 
        t.id, 
        t.title, 
        t.description,
        ut.status,
        ut.completed_at,
        t.due_date,
        COALESCE(ue.score, 0) as score,
        COUNT(tc.id) as total_modules,
        COUNT(ucp.id) as completed_modules
      FROM 
        trainings t
      JOIN 
        user_trainings ut ON t.id = ut.training_id
      JOIN 
        training_content tc ON t.id = tc.training_id
      LEFT JOIN 
        user_content_progress ucp ON tc.id = ucp.content_id AND ucp.user_id = $1
      LEFT JOIN 
        user_evaluations ue ON t.id = ue.training_id AND ue.user_id = $1
      WHERE 
        ut.user_id = $1
      GROUP BY 
        t.id, t.title, t.description, ut.status, ut.completed_at, t.due_date, ue.score
      ORDER BY 
        CASE 
          WHEN ut.status = 'in_progress' THEN 1
          WHEN ut.status = 'pending' THEN 2
          WHEN ut.status = 'completed' THEN 3
        END`,
      [userId],
    )

    // Calcular el progreso para cada capacitación
    const trainingsWithProgress = trainings.map((training) => {
      const progress =
        training.total_modules > 0 ? Math.round((training.completed_modules / training.total_modules) * 100) : 0

      return {
        ...training,
        progress,
        dueDate: training.due_date,
        completedAt: training.completed_at,
      }
    })

    // Calcular estadísticas generales
    const completed = trainingsWithProgress.filter((t) => t.status === "completed").length
    const inProgress = trainingsWithProgress.filter((t) => t.status === "in_progress").length
    const pending = trainingsWithProgress.filter((t) => t.status === "pending").length

    const completedTrainings = trainingsWithProgress.filter((t) => t.status === "completed")
    const averageScore =
      completedTrainings.length > 0
        ? Math.round(completedTrainings.reduce((sum, t) => sum + t.score, 0) / completedTrainings.length)
        : 0

    const averageProgress =
      trainingsWithProgress.length > 0
        ? Math.round(trainingsWithProgress.reduce((sum, t) => sum + t.progress, 0) / trainingsWithProgress.length)
        : 0

    return NextResponse.json({
      trainings: trainingsWithProgress,
      stats: {
        completed,
        inProgress,
        pending,
        averageScore,
        averageProgress,
      },
    })
  } catch (error) {
    console.error("Error al obtener el progreso:", error)
    return NextResponse.json({ error: "Error al obtener el progreso" }, { status: 500 })
  }
}
