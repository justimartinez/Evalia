// Modificar la función GET para obtener datos reales de la base de datos

import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const trainingId = params.id

    // Obtener información básica de la capacitación
    const trainingResult = await sql`
      SELECT 
        t.id, 
        t.title, 
        t.description,
        COUNT(DISTINCT ut.user_id) as assigned_users
      FROM 
        trainings t
      LEFT JOIN 
        user_trainings ut ON t.id = ut.training_id
      WHERE 
        t.id = ${trainingId}
      GROUP BY 
        t.id, t.title, t.description
    `

    if (trainingResult.length === 0) {
      return NextResponse.json({ error: "Capacitación no encontrada" }, { status: 404 })
    }

    const training = trainingResult[0]

    // Obtener estadísticas de usuarios
    const userStatsResult = await sql`
      SELECT
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_users,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_users,
        COUNT(CASE WHEN status = 'not_started' OR status = 'pending' THEN 1 END) as pending_users,
        COALESCE(AVG(score) FILTER (WHERE score IS NOT NULL), 0) as average_score
      FROM
        user_trainings
      WHERE
        training_id = ${trainingId}
    `

    const userStats = userStatsResult[0]

    // Obtener estadísticas por departamento
    const departmentStatsResult = await sql`
      SELECT
        d.name,
        COALESCE(AVG(ut.score) FILTER (WHERE ut.score IS NOT NULL), 0) as average_score,
        COUNT(CASE WHEN ut.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(ut.id), 0) as completion_rate
      FROM
        departments d
      JOIN
        users u ON u.department_id = d.id
      JOIN
        user_trainings ut ON ut.user_id = u.id
      WHERE
        ut.training_id = ${trainingId}
      GROUP BY
        d.id, d.name
      ORDER BY
        average_score DESC
    `

    // Obtener el mejor departamento
    let bestDepartment = "N/A"
    if (departmentStatsResult.length > 0) {
      bestDepartment = departmentStatsResult[0].name
    }

    // Obtener distribución de calificaciones
    const scoreDistributionResult = await sql`
      SELECT
        COUNT(CASE WHEN score >= 90 THEN 1 END) as excellent_count,
        COUNT(CASE WHEN score >= 70 AND score < 90 THEN 1 END) as good_count,
        COUNT(CASE WHEN score >= 50 AND score < 70 THEN 1 END) as average_count,
        COUNT(CASE WHEN score < 50 AND score IS NOT NULL THEN 1 END) as poor_count
      FROM
        user_trainings
      WHERE
        training_id = ${trainingId}
    `

    const scoreDistribution = scoreDistributionResult[0]

    // Obtener resultados por usuario
    const userResultsResult = await sql`
      SELECT
        u.id,
        u.name as user_name,
        d.name as department,
        ut.score,
        ut.status,
        ut.progress
      FROM
        user_trainings ut
      JOIN
        users u ON ut.user_id = u.id
      LEFT JOIN
        departments d ON u.department_id = d.id
      WHERE
        ut.training_id = ${trainingId}
      ORDER BY
        ut.score DESC NULLS LAST
    `

    // Construir el objeto de respuesta
    const response = {
      id: training.id,
      title: training.title,
      description: training.description,
      assigned_users: training.assigned_users,
      completed_users: userStats.completed_users,
      in_progress_users: userStats.in_progress_users,
      pending_users: userStats.pending_users,
      average_score: Number.parseFloat(userStats.average_score).toFixed(1),
      best_department: bestDepartment,

      excellent_count: scoreDistribution.excellent_count,
      good_count: scoreDistribution.good_count,
      average_count: scoreDistribution.average_count,
      poor_count: scoreDistribution.poor_count,

      department_stats: departmentStatsResult,
      user_results: userResultsResult,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error al obtener resultados de capacitación:", error)
    return NextResponse.json({ error: "Error al obtener resultados de capacitación" }, { status: 500 })
  }
}
