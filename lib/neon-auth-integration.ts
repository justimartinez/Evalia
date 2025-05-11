import { neon } from "@neondatabase/serverless"

// Usar la variable de entorno DATABASE_URL que ya está configurada
const neonAuth = neon(process.env.DATABASE_URL || "")

// Función para sincronizar un usuario con la base de datos Neon
export async function syncUserToNeon(user: {
  id: string
  email: string
  name?: string
  role?: string
  metadata?: any
}) {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await neonAuth`
      SELECT id FROM users WHERE email = ${user.email}
    `

    if (existingUser.length === 0) {
      // Crear nuevo usuario
      console.log(`Creando nuevo usuario en Neon: ${user.email}`)
      return await neonAuth`
        INSERT INTO users (
          external_id, 
          email, 
          name, 
          role, 
          metadata, 
          created_at, 
          updated_at
        ) 
        VALUES (
          ${user.id}, 
          ${user.email}, 
          ${user.name || null}, 
          ${user.role || "user"}, 
          ${JSON.stringify(user.metadata || {})}, 
          NOW(), 
          NOW()
        )
        RETURNING id
      `
    } else {
      // Actualizar usuario existente
      console.log(`Actualizando usuario existente en Neon: ${user.email}`)
      return await neonAuth`
        UPDATE users 
        SET 
          name = ${user.name || null}, 
          role = ${user.role || "user"}, 
          metadata = ${JSON.stringify(user.metadata || {})}, 
          updated_at = NOW()
        WHERE email = ${user.email}
        RETURNING id
      `
    }
  } catch (error) {
    console.error("Error al sincronizar usuario con Neon:", error)
    throw error
  }
}

// Función para obtener un usuario de Neon por email
export async function getUserByEmail(email: string) {
  try {
    const users = await neonAuth`
      SELECT * FROM users WHERE email = ${email}
    `
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Error al obtener usuario por email:", error)
    return null
  }
}

// Función para obtener un usuario de Neon por ID
export async function getUserById(id: string) {
  try {
    const users = await neonAuth`
      SELECT * FROM users WHERE id = ${id}
    `
    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error)
    return null
  }
}
