"use server"

import { sql } from "@/lib/db"

export async function getDepartments() {
  try {
    const departments = await sql`
      SELECT 
        d.id, 
        d.name, 
        d.description,
        COUNT(DISTINCT u.id) as user_count
      FROM 
        "Evalia BD".departments d
      LEFT JOIN 
        "Evalia BD".user_departments ud ON d.id = ud.department_id
      LEFT JOIN 
        "Evalia BD".users u ON ud.user_id = u.id
      GROUP BY 
        d.id, d.name, d.description
      ORDER BY 
        d.name
    `

    return departments
  } catch (error) {
    console.error("Error al obtener departamentos:", error)
    return []
  }
}

export async function getDepartmentStats() {
  try {
    const departments = await sql`
      SELECT 
        d.id, 
        d.name, 
        COUNT(DISTINCT ud.user_id) as user_count,
        COALESCE(
          AVG(utp.score) FILTER (WHERE utp.status = 'completed'), 
          0
        ) as average_score,
        COUNT(DISTINCT ta.training_id) as training_count,
        COUNT(DISTINCT ta.id) FILTER (WHERE ta.completed_at IS NOT NULL) as completed_count,
        COUNT(DISTINCT ta.id) FILTER (WHERE ta.started_at IS NOT NULL AND ta.completed_at IS NULL) as in_progress_count,
        COUNT(DISTINCT ta.id) FILTER (WHERE ta.started_at IS NULL) as pending_count,
        COALESCE(
          COUNT(DISTINCT ta.id) FILTER (WHERE ta.completed_at IS NOT NULL) * 100.0 / 
          NULLIF(COUNT(DISTINCT ta.id), 0),
          0
        ) as completion_rate
      FROM 
        "Evalia BD".departments d
      LEFT JOIN 
        "Evalia BD".user_departments ud ON d.id = ud.department_id
      LEFT JOIN 
        "Evalia BD".users u ON ud.user_id = u.id
      LEFT JOIN 
        "Evalia BD".training_assignments ta ON ta.user_id = u.id
      LEFT JOIN 
        "Evalia BD".user_training_progress utp ON utp.user_id = u.id
      GROUP BY 
        d.id, d.name
      ORDER BY 
        average_score DESC
    `

    return { departments }
  } catch (error) {
    console.error("Error al obtener estadísticas de departamentos:", error)
    return { departments: [] }
  }
}

export async function getDepartmentById(id) {
  try {
    const departmentResult = await sql`
      SELECT 
        d.id, 
        d.name, 
        d.description,
        COUNT(DISTINCT ud.user_id) as user_count,
        COALESCE(AVG(utp.score) FILTER (WHERE utp.status = 'completed'), 0) as average_score,
        COUNT(DISTINCT ta.training_id) as training_count,
        COUNT(DISTINCT ta.id) FILTER (WHERE ta.completed_at IS NOT NULL) as completed_count,
        COUNT(DISTINCT ta.id) FILTER (WHERE ta.started_at IS NOT NULL AND ta.completed_at IS NULL) as in_progress_count,
        COUNT(DISTINCT ta.id) FILTER (WHERE ta.started_at IS NULL) as pending_count,
        COALESCE(
          COUNT(DISTINCT ta.id) FILTER (WHERE ta.completed_at IS NOT NULL) * 100.0 / 
          NULLIF(COUNT(DISTINCT ta.id), 0),
          0
        ) as completion_rate
      FROM 
        "Evalia BD".departments d
      LEFT JOIN 
        "Evalia BD".user_departments ud ON d.id = ud.department_id
      LEFT JOIN 
        "Evalia BD".users u ON ud.user_id = u.id
      LEFT JOIN 
        "Evalia BD".training_assignments ta ON ta.user_id = u.id
      LEFT JOIN 
        "Evalia BD".user_training_progress utp ON utp.user_id = u.id
      WHERE 
        d.id = ${id}
      GROUP BY 
        d.id, d.name, d.description
    `

    if (departmentResult.length === 0) {
      return null
    }

    const department = departmentResult[0]

    // Obtener usuarios del departamento
    const usersResult = await sql`
      SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.role,
        COUNT(ta.id) as assigned_trainings,
        COUNT(ta.id) FILTER (WHERE ta.completed_at IS NOT NULL) as completed_trainings,
        COALESCE(AVG(utp.score) FILTER (WHERE utp.status = 'completed'), 0) as average_score
      FROM 
        "Evalia BD".users u
      JOIN 
        "Evalia BD".user_departments ud ON u.id = ud.user_id
      LEFT JOIN 
        "Evalia BD".training_assignments ta ON u.id = ta.user_id
      LEFT JOIN 
        "Evalia BD".user_training_progress utp ON u.id = utp.user_id AND utp.status = 'completed'
      WHERE 
        ud.department_id = ${id}
      GROUP BY 
        u.id, u.name, u.email, u.role
      ORDER BY 
        u.name
    `

    // Obtener capacitaciones asignadas al departamento
    const trainingsResult = await sql`
      SELECT 
        t.id, 
        t.title,
        COUNT(ta.id) as assigned_users,
        COUNT(ta.id) FILTER (WHERE ta.completed_at IS NOT NULL) as completed_users,
        COALESCE(AVG(utp.score) FILTER (WHERE utp.status = 'completed'), 0) as average_score
      FROM 
        "Evalia BD".trainings t
      JOIN 
        "Evalia BD".training_assignments ta ON t.id = ta.training_id
      JOIN 
        "Evalia BD".users u ON ta.user_id = u.id
      JOIN 
        "Evalia BD".user_departments ud ON u.id = ud.user_id
      LEFT JOIN 
        "Evalia BD".user_training_progress utp ON u.id = utp.user_id AND t.id = utp.training_id
      WHERE 
        ud.department_id = ${id}
      GROUP BY 
        t.id, t.title
      ORDER BY 
        t.title
    `

    // Obtener estadísticas de rendimiento por mes
    const performanceByMonthResult = await sql`
      SELECT 
        TO_CHAR(ta.completed_at, 'Mon') as month,
        EXTRACT(MONTH FROM ta.completed_at) as month_num,
        COALESCE(AVG(utp.score) FILTER (WHERE utp.status = 'completed'), 0) as average_score,
        COUNT(ta.id) FILTER (WHERE ta.completed_at IS NOT NULL) as completed_count
      FROM 
        "Evalia BD".training_assignments ta
      JOIN 
        "Evalia BD".users u ON ta.user_id = u.id
      JOIN 
        "Evalia BD".user_departments ud ON u.id = ud.user_id
      LEFT JOIN 
        "Evalia BD".user_training_progress utp ON u.id = utp.user_id AND ta.training_id = utp.training_id
      WHERE 
        ud.department_id = ${id} AND
        ta.completed_at >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY 
        month, month_num
      ORDER BY 
        month_num
    `

    return {
      ...department,
      users: usersResult,
      trainings: trainingsResult,
      performanceByMonth: performanceByMonthResult,
    }
  } catch (error) {
    console.error("Error al obtener departamento:", error)
    return null
  }
}
