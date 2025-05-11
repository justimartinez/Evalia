import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

// GET /api/users/[id] - Obtener un usuario específico
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Obtener información del usuario
    const users = await sql`
      SELECT u.id, u.name, u.email, u.role, u.active, u.created_at
      FROM "Evalia BD".users u
      WHERE u.id = ${params.id}
    `

    if (users.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    const user = users[0]

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    return NextResponse.json({ error: "Error al obtener usuario" }, { status: 500 })
  }
}

// PUT /api/users/[id] - Actualizar un usuario
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, email, password, role } = body

    // Validar datos requeridos
    if (!name || !email) {
      return NextResponse.json({ error: "Nombre y email son requeridos" }, { status: 400 })
    }

    // Verificar si el usuario existe
    const existingUser = await sql`SELECT id FROM "Evalia BD".users WHERE id = ${params.id}`
    if (existingUser.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Actualizar el usuario
    await sql`
      UPDATE "Evalia BD".users 
      SET name = ${name}, email = ${email}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ${params.id}
    `

    return NextResponse.json({ message: "Usuario actualizado exitosamente" })
  } catch (error) {
    console.error("Error al actualizar usuario:", error)
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Eliminar un usuario
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Verificar si el usuario existe
    const existingUser = await sql`SELECT id FROM "Evalia BD".users WHERE id = ${params.id}`
    if (existingUser.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    // Eliminar el usuario
    await sql`DELETE FROM "Evalia BD".users WHERE id = ${params.id}`

    return NextResponse.json({ message: "Usuario eliminado exitosamente" })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    return NextResponse.json({ error: "Error al eliminar usuario" }, { status: 500 })
  }
}
