import { neon } from "@neondatabase/serverless"

// Inicializar el cliente SQL
const sql = neon(process.env.DATABASE_URL || "")

async function checkDatabaseSchema() {
  try {
    console.log("Verificando esquema de la base de datos...")

    // Verificar tablas existentes
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `

    console.log("\n--- TABLAS EXISTENTES ---")
    tables.forEach((table) => {
      console.log(`- ${table.table_name}`)
    })

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

    // Verificar asignaciones de capacitaciones
    const assignments = await sql`
      SELECT 
        ut.id, 
        ut.user_id, 
        ut.training_id, 
        ut.status, 
        ut.progress,
        t.title as training_title
      FROM user_trainings ut
      JOIN trainings t ON ut.training_id = t.id
      LIMIT 10;
    `

    console.log("\n--- ASIGNACIONES DE CAPACITACIONES (primeras 10) ---")
    if (assignments.length === 0) {
      console.log("No hay asignaciones de capacitaciones en la base de datos.")
    } else {
      assignments.forEach((assignment) => {
        console.log(
          `- Usuario ${assignment.user_id}: "${assignment.training_title}" (ID: ${assignment.training_id}, Estado: ${assignment.status}, Progreso: ${assignment.progress}%)`,
        )
      })
    }
  } catch (error) {
    console.error("Error al verificar el esquema de la base de datos:", error)
  }
}

// Ejecutar la función
checkDatabaseSchema()
