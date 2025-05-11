import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET /api/trainings - Obtener todas las capacitaciones
export async function GET() {
  try {
    // Obtener todas las capacitaciones sin filtrar por compañía para desarrollo
    const trainings = await sql`
      SELECT t.id, t.title, t.description, t.status, t.created_at, t.created_by,
        (SELECT COUNT(*) FROM "Evalia BD".training_assignments ta WHERE ta.training_id = t.id) as assigned_users_count,
        COALESCE(
          (SELECT COUNT(*) FILTER (WHERE ta.completed_at IS NOT NULL) * 100.0 / 
           NULLIF(COUNT(*), 0)
           FROM "Evalia BD".training_assignments ta 
           WHERE ta.training_id = t.id), 
          0
        ) as completion_rate
      FROM "Evalia BD".trainings t
      ORDER BY t.created_at DESC
    `

    return NextResponse.json(trainings)
  } catch (error) {
    console.error("Error al obtener capacitaciones:", error)
    return NextResponse.json({ error: "Error al obtener capacitaciones" }, { status: 500 })
  }
}

// POST /api/trainings - Crear una nueva capacitación
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, departmentId, createdBy } = body

    // Validar datos requeridos
    if (!title) {
      return NextResponse.json({ error: "El título es requerido" }, { status: 400 })
    }

    // Usar company_id 1 para desarrollo
    const companyId = 1

    // Insertar la nueva capacitación
    const result = await sql`
      INSERT INTO "Evalia BD".trainings 
      (title, description, status, created_at, created_by, company_id) 
      VALUES (${title}, ${description || null}, 'draft', CURRENT_TIMESTAMP, ${createdBy || 1}, ${companyId}) 
      RETURNING id
    `

    // Si se especificó un departamento, asignar la capacitación a ese departamento
    if (departmentId) {
      await sql`
        INSERT INTO "Evalia BD".training_departments 
        (training_id, department_id, created_at) 
        VALUES (${result[0].id}, ${departmentId}, CURRENT_TIMESTAMP)
      `
    }

    return NextResponse.json({ id: result[0].id, message: "Capacitación creada exitosamente" })
  } catch (error) {
    console.error("Error al crear capacitación:", error)
    return NextResponse.json({ error: "Error al crear capacitación" }, { status: 500 })
  }
}
