"use server"

import { sql } from "@/lib/db"

export async function getUsers() {
  try {
    const users = await sql`
      SELECT u.*, 
        (SELECT d.name FROM "Evalia BD".departments d JOIN "Evalia BD".user_departments ud ON d.id = ud.department_id WHERE ud.user_id = u.id LIMIT 1) as department,
        (SELECT COUNT(*) FROM "Evalia BD".training_assignments ta WHERE ta.user_id = u.id) as assigned_trainings,
        (SELECT COUNT(*) FROM "Evalia BD".training_assignments ta WHERE ta.user_id = u.id AND ta.completed_at IS NOT NULL) as completed_trainings,
        (SELECT COUNT(*) FROM "Evalia BD".training_assignments ta WHERE ta.user_id = u.id AND ta.completed_at IS NULL) as pending_trainings,
        (SELECT MAX(ta.updated_at) FROM "Evalia BD".training_assignments ta WHERE ta.user_id = u.id) as last_active
      FROM "Evalia BD".users u
      ORDER BY u.name
    `

    return users.map((user) => ({
      ...user,
      assigned_trainings: Number(user.assigned_trainings) || 0,
      completed_trainings: Number(user.completed_trainings) || 0,
      pending_trainings: Number(user.pending_trainings) || 0,
      lastActive: user.last_active ? new Date(user.last_active).toLocaleDateString() : "Nunca",
    }))
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return []
  }
}

export async function getDepartments() {
  try {
    const departments = await sql`
      SELECT d.*, 
        (SELECT COUNT(*) FROM "Evalia BD".user_departments ud WHERE ud.department_id = d.id) as user_count
      FROM "Evalia BD".departments d
      ORDER BY d.name
    `

    return departments.map((dept) => ({
      ...dept,
      userCount: Number(dept.user_count) || 0,
    }))
  } catch (error) {
    console.error("Error al obtener departamentos:", error)
    return []
  }
}

export async function getUsersByDepartment(departmentId) {
  try {
    const users = await sql`
      SELECT u.*
      FROM "Evalia BD".users u
      JOIN "Evalia BD".user_departments ud ON u.id = ud.user_id
      WHERE ud.department_id = ${departmentId}
      ORDER BY u.name
    `

    return users
  } catch (error) {
    console.error(`Error al obtener usuarios del departamento ${departmentId}:`, error)
    return []
  }
}
