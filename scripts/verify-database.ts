import { sql } from "../lib/db"

async function verifyDatabase() {
  try {
    console.log("Verificando conexión a la base de datos...")

    // Verificar que podemos conectarnos a la base de datos
    const testResult = await sql`SELECT 1 as test`
    console.log("Conexión exitosa:", testResult)

    // Verificar tablas existentes
    console.log("\nVerificando tablas existentes...")
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log(
      "Tablas encontradas:",
      tables.map((t) => t.table_name),
    )

    // Verificar usuarios
    console.log("\nVerificando usuarios...")
    const users = await sql`
      SELECT id, name, email, role 
      FROM users 
      LIMIT 10
    `
    console.log(`Usuarios encontrados (${users.length}):`, users)

    // Verificar capacitaciones
    console.log("\nVerificando capacitaciones...")
    const trainings = await sql`
      SELECT id, title, description 
      FROM trainings 
      LIMIT 10
    `
    console.log(`Capacitaciones encontradas (${trainings.length}):`, trainings)

    // Verificar asignaciones de capacitaciones
    console.log("\nVerificando asignaciones de capacitaciones...")
    const userTrainings = await sql`
      SELECT ut.id, ut.user_id, ut.training_id, ut.status, t.title
      FROM user_trainings ut
      JOIN trainings t ON ut.training_id = t.id
      LIMIT 20
    `
    console.log(`Asignaciones encontradas (${userTrainings.length}):`, userTrainings)

    // Verificar asignaciones por usuario
    if (users.length > 0) {
      const userId = users[0].id
      console.log(`\nVerificando asignaciones para el usuario ${userId}...`)
      const userAssignments = await sql`
        SELECT ut.id, t.title, ut.status, ut.progress
        FROM user_trainings ut
        JOIN trainings t ON ut.training_id = t.id
        WHERE ut.user_id = ${userId}
      `
      console.log(`Asignaciones para usuario ${userId} (${userAssignments.length}):`, userAssignments)
    }

    console.log("\nVerificación de base de datos completada.")
  } catch (error) {
    console.error("Error al verificar la base de datos:", error)
  }
}

verifyDatabase()
