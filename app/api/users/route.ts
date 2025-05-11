import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { hash } from "bcryptjs"

// GET /api/users - Obtener todos los usuarios
export async function GET() {
  try {
    // Obtener todos los usuarios con información básica
    const users = await sql`
      SELECT u.id, u.name, u.email, u.role, u.active, u.created_at
      FROM "Evalia BD".users u
      ORDER BY u.created_at DESC
    `

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 })
  }
}

// POST /api/users - Crear un nuevo usuario
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body

    // Validar datos requeridos
    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 })
    }

    // Verificar si el email ya existe
    const existingUser = await sql`SELECT id FROM "Evalia BD".users WHERE email = ${email}`
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "El correo electrónico ya está registrado" }, { status: 400 })
    }

    // Hashear la contraseña
    const hashedPassword = await hash(password, 10)

    // Insertar el nuevo usuario
    const result = await sql`
      INSERT INTO "Evalia BD".users (name, email, password, role, active, company_id, created_at, updated_at) 
      VALUES (${name}, ${email}, ${hashedPassword}, ${role}, true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
      RETURNING id
    `

    const userId = result[0].id

    return NextResponse.json({ id: userId, message: "Usuario creado exitosamente" })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 })
  }
}
