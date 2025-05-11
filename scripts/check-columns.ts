import { neon } from "@neondatabase/serverless"

// Inicializar el cliente SQL
const sql = neon(process.env.DATABASE_URL || "")

async function checkTableColumns() {
  try {
    console.log("Verificando columnas de las tablas principales...")

    // Verificar columnas de la tabla user_trainings
    const userTrainingsColumns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'user_trainings'
      ORDER BY ordinal_position;
    `

    console.log("\n--- COLUMNAS DE LA TABLA user_trainings ---")
    userTrainingsColumns.forEach((column) => {
      console.log(
        `- ${column.column_name} (${column.data_type}, ${column.is_nullable === "YES" ? "NULL" : "NOT NULL"})`,
      )
    })

    // Verificar columnas de la tabla trainings
    const trainingsColumns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'trainings'
      ORDER BY ordinal_position;
    `

    console.log("\n--- COLUMNAS DE LA TABLA trainings ---")
    trainingsColumns.forEach((column) => {
      console.log(
        `- ${column.column_name} (${column.data_type}, ${column.is_nullable === "YES" ? "NULL" : "NOT NULL"})`,
      )
    })

    // Verificar si hay datos en las tablas
    const userTrainingsCount = await sql`SELECT COUNT(*) as count FROM user_trainings;`
    const trainingsCount = await sql`SELECT COUNT(*) as count FROM trainings;`

    console.log("\n--- CONTEO DE REGISTROS ---")
    console.log(`- user_trainings: ${userTrainingsCount[0].count} registros`)
    console.log(`- trainings: ${trainingsCount[0].count} registros`)

    // Verificar si hay asignaciones para el usuario de prueba (ID 2)
    const testUserAssignments = await sql`
      SELECT COUNT(*) as count 
      FROM user_trainings 
      WHERE user_id = 2;
    `

    console.log(`\n--- ASIGNACIONES PARA USUARIO DE PRUEBA (ID 2) ---`)
    console.log(`- ${testUserAssignments[0].count} capacitaciones asignadas`)

    // Si hay asignaciones, mostrar detalles
    if (Number.parseInt(testUserAssignments[0].count) > 0) {
      const assignments = await sql`
        SELECT 
          ut.id, 
          t.title, 
          ut.status, 
          ut.progress
        FROM user_trainings ut
        JOIN trainings t ON ut.training_id = t.id
        WHERE ut.user_id = 2;
      `

      console.log("\nDetalles de las asignaciones:")
      assignments.forEach((a, i) => {
        console.log(`${i + 1}. "${a.title}" - Estado: ${a.status}, Progreso: ${a.progress}%`)
      })
    }
  } catch (error) {
    console.error("Error al verificar columnas:", error)
  }
}

// Ejecutar la función
checkTableColumns()
