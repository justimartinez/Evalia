import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

// Inicializar el cliente SQL
const sql = neon(process.env.DATABASE_URL)

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user || !session.user.role !== "admin") {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    // Obtener parámetros de la URL
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "6m"
    const department = searchParams.get("department") || "all"

    // Calcular la fecha de inicio según el rango de tiempo
    let startDate
    const now = new Date()
    switch (timeRange) {
      case "1m":
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        break
      case "3m":
        startDate = new Date(now.setMonth(now.getMonth() - 3))
        break
      case "6m":
        startDate = new Date(now.setMonth(now.getMonth() - 6))
        break
      case "1y":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1))
        break
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 6))
    }

    const startDateStr = startDate.toISOString()

    // Construir la condición de departamento
    let departmentCondition = ""
    let departmentParams = []
    if (department !== "all") {
      departmentCondition = "AND ud.department_id = $1"
      departmentParams = [department]
    }

    // Datos de completados vs asignados por mes
    const completionDataQuery = `
      WITH months AS (
        SELECT generate_series(
          date_trunc('month', $1::timestamp),
          date_trunc('month', CURRENT_DATE),
          interval '1 month'
        ) as month
      )
      SELECT 
        to_char(m.month, 'Mon') as name,
        COUNT(ut.id) FILTER (WHERE ut.created_at >= m.month AND ut.created_at < m.month + interval '1 month') as asignadas,
        COUNT(ut.id) FILTER (WHERE ut.status = 'completed' AND ut.updated_at >= m.month AND ut.updated_at < m.month + interval '1 month') as completadas
      FROM months m
      LEFT JOIN user_trainings ut ON ut.created_at >= $1
      ${
        departmentCondition
          ? `
        LEFT JOIN users u ON ut.user_id = u.id
        LEFT JOIN user_departments ud ON u.id = ud.user_id
        WHERE ${departmentCondition}
      `
          : ""
      }
      GROUP BY m.month
      ORDER BY m.month
    `

    const completionDataResult = await sql(completionDataQuery, [startDateStr, ...departmentParams])

    // Datos de rendimiento por departamento
    const departmentDataQuery = `
      SELECT 
        d.name,
        COALESCE(AVG(ue.score), 0) as promedio,
        COALESCE(
          COUNT(ut.id) FILTER (WHERE ut.status = 'completed') * 100.0 / 
          NULLIF(COUNT(ut.id), 0),
          0
        ) as completionRate
      FROM departments d
      LEFT JOIN user_departments ud ON d.id = ud.department_id
      LEFT JOIN user_trainings ut ON ud.user_id = ut.user_id AND ut.created_at >= $1
      LEFT JOIN user_evaluations ue ON ud.user_id = ue.user_id AND ue.status = 'completed' AND ue.created_at >= $1
      ${department !== "all" ? "WHERE d.id = $2" : ""}
      GROUP BY d.name
      ORDER BY promedio DESC
    `

    const departmentDataResult = await sql(departmentDataQuery, [
      startDateStr,
      ...(department !== "all" ? [department] : []),
    ])

    // Datos de rendimiento por capacitación
    const trainingDataQuery = `
      SELECT 
        t.title as name,
        COALESCE(AVG(ut.score) FILTER (WHERE ut.status = 'completed'), 0) as promedio,
        COALESCE(
          COUNT(ut.id) FILTER (WHERE ut.status = 'completed') * 100.0 / 
          NULLIF(COUNT(ut.id), 0),
          0
        ) as completionRate
      FROM trainings t
      LEFT JOIN user_trainings ut ON t.id = ut.training_id AND ut.created_at >= $1
      ${
        departmentCondition
          ? `
        LEFT JOIN users u ON ut.user_id = u.id
        LEFT JOIN user_departments ud ON u.id = ud.user_id
        WHERE ${departmentCondition}
      `
          : ""
      }
      GROUP BY t.title
      ORDER BY promedio DESC
      LIMIT 10
    `

    const trainingDataResult = await sql(trainingDataQuery, [startDateStr, ...departmentParams])

    // Datos de distribución de resultados
    const distributionDataQuery = `
      WITH score_ranges AS (
        SELECT 
          ut.id,
          CASE 
            WHEN ut.score >= 90 THEN 'Excelente (90-100%)'
            WHEN ut.score >= 75 THEN 'Bueno (75-89%)'
            WHEN ut.score >= 60 THEN 'Regular (60-74%)'
            ELSE 'Insuficiente (<60%)'
          END as range
        FROM user_trainings ut
        WHERE ut.status = 'completed' AND ut.created_at >= $1
        ${
          departmentCondition
            ? `
          JOIN users u ON ut.user_id = u.id
          JOIN user_departments ud ON u.id = ud.user_id
          AND ${departmentCondition}
        `
            : ""
        }
      )
      SELECT 
        range as name,
        COUNT(*) as value
      FROM score_ranges
      GROUP BY range
      ORDER BY 
        CASE 
          WHEN range = 'Excelente (90-100%)' THEN 1
          WHEN range = 'Bueno (75-89%)' THEN 2
          WHEN range = 'Regular (60-74%)' THEN 3
          WHEN range = 'Insuficiente (<60%)' THEN 4
        END
    `

    const distributionDataResult = await sql(distributionDataQuery, [startDateStr, ...departmentParams])

    // Datos de usuarios con mejor rendimiento
    const userPerformanceDataQuery = `
      SELECT 
        u.name,
        d.name as department,
        COALESCE(AVG(ut.score) FILTER (WHERE ut.status = 'completed'), 0) as score
      FROM users u
      JOIN user_departments ud ON u.id = ud.user_id
      JOIN departments d ON ud.department_id = d.id
      LEFT JOIN user_trainings ut ON u.id = ut.user_id AND ut.created_at >= $1 AND ut.status = 'completed'
      ${department !== "all" ? "WHERE d.id = $2" : ""}
      GROUP BY u.name, d.name
      HAVING COUNT(ut.id) > 0
      ORDER BY score DESC
      LIMIT 10
    `

    const userPerformanceDataResult = await sql(userPerformanceDataQuery, [
      startDateStr,
      ...(department !== "all" ? [department] : []),
    ])

    // Datos de análisis de preguntas
    const questionAnalysisDataQuery = `
      SELECT 
        q.question_text as text,
        t.title as training,
        COALESCE(
          COUNT(ua.id) FILTER (WHERE ua.is_correct = false) * 100.0 / 
          NULLIF(COUNT(ua.id), 0),
          0
        ) as errorRate
      FROM questions q
      JOIN trainings t ON q.training_id = t.id
      LEFT JOIN user_answers ua ON q.id = ua.question_id AND ua.created_at >= $1
      ${
        departmentCondition
          ? `
        LEFT JOIN users u ON ua.user_id = u.id
        LEFT JOIN user_departments ud ON u.id = ud.user_id
        WHERE ${departmentCondition}
      `
          : ""
      }
      GROUP BY q.question_text, t.title
      HAVING COUNT(ua.id) > 0
      ORDER BY errorRate DESC
      LIMIT 10
    `

    const questionAnalysisDataResult = await sql(questionAnalysisDataQuery, [startDateStr, ...departmentParams])

    // Datos de habilidades (ejemplo)
    const skillsData = [
      { subject: "Conocimiento Técnico", A: 80, B: 90, fullMark: 100 },
      { subject: "Comunicación", A: 75, B: 85, fullMark: 100 },
      { subject: "Trabajo en Equipo", A: 85, B: 90, fullMark: 100 },
      { subject: "Resolución de Problemas", A: 70, B: 80, fullMark: 100 },
      { subject: "Liderazgo", A: 65, B: 75, fullMark: 100 },
      { subject: "Adaptabilidad", A: 80, B: 85, fullMark: 100 },
    ]

    return NextResponse.json({
      completionData: completionDataResult,
      departmentData: departmentDataResult,
      trainingData: trainingDataResult,
      distributionData: distributionDataResult,
      userPerformanceData: userPerformanceDataResult,
      questionAnalysisData: questionAnalysisDataResult,
      skillsData,
    })
  } catch (error) {
    console.error("Error al obtener datos de reportes:", error)
    return NextResponse.json({ error: "Error al obtener datos de reportes" }, { status: 500 })
  }
}
