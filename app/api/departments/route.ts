import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar si la tabla departments existe
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'Evalia BD' AND table_name = 'departments'
      ) as exists
    `

    if (!tableCheck[0].exists) {
      console.error("La tabla departments no existe")
      return NextResponse.json([])
    }

    // Obtener todos los departamentos
    const departments = await sql`
      SELECT id, name, description
      FROM "Evalia BD".departments
      ORDER BY name
    `

    return NextResponse.json(departments)
  } catch (error) {
    console.error("Error al obtener departamentos:", error)
    return NextResponse.json([], { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json({ error: "El nombre del departamento es obligatorio" }, { status: 400 })
    }

    const result = await sql`
      INSERT INTO "Evalia BD".departments (name, description, company_id, created_at)
      VALUES (${name}, ${description || null}, 1, CURRENT_TIMESTAMP)
      RETURNING id, name, description
    `

    return NextResponse.json(result[0])
  } catch (error) {
    console.error("Error al crear departamento:", error)
    return NextResponse.json({ error: "Error al crear el departamento" }, { status: 500 })
  }
}
