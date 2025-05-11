import { sql } from "./db"

// Función para sincronizar un usuario desde el proveedor de autenticación a la base de datos
export async function syncUserWithDatabase(user: any) {
  try {
    // Verificar si el usuario ya existe en la base de datos
    const existingUsers = await sql`
      SELECT id FROM "Evalia BD".users 
      WHERE email = ${user.email}
    `

    if (existingUsers.length === 0) {
      // Si el usuario no existe, lo creamos
      console.log(`Creando nuevo usuario para: ${user.email}`)

      // Insertar el nuevo usuario
      const result = await sql`
        INSERT INTO "Evalia BD".users (
          name, 
          email, 
          password, 
          role, 
          created_at, 
          updated_at
        ) 
        VALUES (
          ${user.name || "Usuario Nuevo"}, 
          ${user.email}, 
          ${user.password || ""}, 
          ${"user"}, 
          CURRENT_TIMESTAMP, 
          CURRENT_TIMESTAMP
        )
        RETURNING id
      `

      return result[0]
    } else {
      // Si el usuario ya existe, actualizamos su información
      console.log(`Actualizando usuario existente: ${user.email}`)

      await sql`
        UPDATE "Evalia BD".users 
        SET 
          name = ${user.name || existingUsers[0].name},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${existingUsers[0].id}
      `

      return existingUsers[0]
    }
  } catch (error) {
    console.error("Error al sincronizar usuario con la base de datos:", error)
    throw error
  }
}

// Función para obtener el perfil de usuario desde la base de datos
export async function getUserProfile(userId: string) {
  try {
    const users = await sql`
      SELECT id, name, email, role, company_id, image, created_at, updated_at 
      FROM "Evalia BD".users 
      WHERE id = ${userId}
    `

    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Error al obtener perfil de usuario:", error)
    return null
  }
}
