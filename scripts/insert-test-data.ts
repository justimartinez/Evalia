import { neon } from "@neondatabase/serverless"

// Inicializar el cliente SQL
const sql = neon(process.env.DATABASE_URL || "")

async function insertTestData() {
  try {
    console.log("Insertando datos de prueba...")

    // Verificar si ya existen capacitaciones
    const existingTrainings = await sql`SELECT COUNT(*) as count FROM trainings`

    if (Number.parseInt(existingTrainings[0].count) > 0) {
      console.log(`Ya existen ${existingTrainings[0].count} capacitaciones en la base de datos.`)
    } else {
      // Insertar capacitaciones de prueba
      console.log("Insertando capacitaciones de prueba...")

      await sql`
        INSERT INTO trainings (title, description, objectives, duration, difficulty_level, created_by, status, created_at, updated_at)
        VALUES 
        ('Introducción a la Seguridad Informática', 'Curso básico sobre seguridad informática y protección de datos', 'Aprender conceptos básicos de seguridad', 60, 'beginner', 1, 'active', NOW(), NOW()),
        ('Desarrollo Web Avanzado', 'Técnicas avanzadas de desarrollo web frontend y backend', 'Dominar frameworks modernos', 120, 'advanced', 1, 'active', NOW(), NOW()),
        ('Gestión de Proyectos', 'Metodologías ágiles para la gestión eficiente de proyectos', 'Implementar Scrum y Kanban', 90, 'intermediate', 1, 'active', NOW(), NOW())
      `

      console.log("Capacitaciones insertadas correctamente.")
    }

    // Verificar si el usuario de prueba (ID 2) existe
    const existingUser = await sql`SELECT COUNT(*) as count FROM users WHERE id = 2`

    if (Number.parseInt(existingUser[0].count) === 0) {
      console.log("El usuario de prueba (ID 2) no existe. Creando usuario...")

      await sql`
        INSERT INTO users (id, name, email, role, created_at, updated_at)
        VALUES (2, 'Usuario de Prueba', 'test@example.com', 'employee', NOW(), NOW())
      `

      console.log("Usuario de prueba creado correctamente.")
    } else {
      console.log("El usuario de prueba (ID 2) ya existe.")
    }

    // Verificar si ya existen asignaciones para el usuario de prueba
    const existingAssignments = await sql`
      SELECT COUNT(*) as count FROM user_trainings WHERE user_id = 2
    `

    if (Number.parseInt(existingAssignments[0].count) > 0) {
      console.log(`Ya existen ${existingAssignments[0].count} asignaciones para el usuario de prueba.`)
    } else {
      // Obtener IDs de las capacitaciones
      const trainings = await sql`SELECT id FROM trainings LIMIT 3`

      if (trainings.length === 0) {
        console.log("No se encontraron capacitaciones para asignar.")
        return
      }

      console.log("Asignando capacitaciones al usuario de prueba...")

      // Asignar capacitaciones al usuario de prueba con diferentes estados
      await sql`
        INSERT INTO user_trainings (user_id, training_id, status, progress, created_at, updated_at)
        VALUES 
        (2, ${trainings[0].id}, 'completed', 100, NOW(), NOW()),
        (2, ${trainings[1].id}, 'in_progress', 50, NOW(), NOW())
      `

      if (trainings.length > 2) {
        await sql`
          INSERT INTO user_trainings (user_id, training_id, status, progress, created_at, updated_at)
          VALUES (2, ${trainings[2].id}, 'not_started', 0, NOW(), NOW())
        `
      }

      console.log("Capacitaciones asignadas correctamente al usuario de prueba.")
    }

    console.log("Datos de prueba insertados correctamente.")
  } catch (error) {
    console.error("Error al insertar datos de prueba:", error)
  }
}

// Ejecutar la función
insertTestData()
