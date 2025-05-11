import { neon } from "@neondatabase/serverless"

// Inicializar el cliente SQL
const sql = neon(process.env.DATABASE_URL || "")

async function addTestData() {
  try {
    console.log("Verificando datos de prueba existentes...")

    // Verificar si ya existen capacitaciones
    const existingTrainings = await sql`
      SELECT COUNT(*) as count FROM trainings;
    `

    const trainingCount = Number.parseInt(existingTrainings[0].count)
    console.log(`Capacitaciones existentes: ${trainingCount}`)

    // Verificar si ya existen asignaciones
    const existingAssignments = await sql`
      SELECT COUNT(*) as count FROM user_trainings;
    `

    const assignmentCount = Number.parseInt(existingAssignments[0].count)
    console.log(`Asignaciones existentes: ${assignmentCount}`)

    // Si no hay capacitaciones, crear algunas de prueba
    if (trainingCount === 0) {
      console.log("Creando capacitaciones de prueba...")

      await sql`
        INSERT INTO trainings (title, description, duration, category, deadline, created_at, updated_at)
        VALUES 
          ('Introducción a la Seguridad Informática', 'Aprende los conceptos básicos de seguridad informática', '2 horas', 'Tecnología', NOW() + INTERVAL '30 days', NOW(), NOW()),
          ('Atención al Cliente', 'Mejora tus habilidades de atención al cliente', '3 horas', 'Servicio', NOW() + INTERVAL '15 days', NOW(), NOW()),
          ('Liderazgo Efectivo', 'Desarrolla habilidades de liderazgo para tu equipo', '4 horas', 'Liderazgo', NOW() + INTERVAL '45 days', NOW(), NOW()),
          ('Excel Avanzado', 'Domina las funciones avanzadas de Excel', '5 horas', 'Ofimática', NOW() + INTERVAL '20 days', NOW(), NOW()),
          ('Gestión del Tiempo', 'Aprende a gestionar tu tiempo de manera efectiva', '2 horas', 'Productividad', NOW() + INTERVAL '10 days', NOW(), NOW());
      `

      console.log("Capacitaciones de prueba creadas con éxito.")
    }

    // Obtener usuarios existentes
    const users = await sql`
      SELECT id, name, email, role FROM users LIMIT 10;
    `

    console.log("\n--- USUARIOS EXISTENTES ---")
    if (users.length === 0) {
      console.log("No hay usuarios en la base de datos. Creando usuario de prueba...")

      await sql`
        INSERT INTO users (name, email, role, password, created_at, updated_at)
        VALUES ('Usuario de Prueba', 'test@example.com', 'employee', 'password123', NOW(), NOW())
        RETURNING id, name, email, role;
      `

      console.log("Usuario de prueba creado con éxito.")

      // Obtener el usuario recién creado
      const newUsers = await sql`
        SELECT id, name, email, role FROM users LIMIT 10;
      `

      users.push(...newUsers)
    }

    users.forEach((user) => {
      console.log(`- ID: ${user.id}, Nombre: ${user.name}, Email: ${user.email}, Rol: ${user.role}`)
    })

    // Si no hay asignaciones, crear algunas de prueba
    if (assignmentCount === 0 && users.length > 0) {
      console.log("\nCreando asignaciones de prueba...")

      // Obtener todas las capacitaciones
      const trainings = await sql`
        SELECT id FROM trainings;
      `

      // Para cada usuario con rol 'employee', asignar todas las capacitaciones
      for (const user of users) {
        if (user.role === "employee" || user.role === "user") {
          for (const training of trainings) {
            // Asignar con diferentes estados para tener variedad
            const statuses = ["not_started", "in_progress", "completed", "pending"]
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
            const randomProgress =
              randomStatus === "completed"
                ? 100
                : randomStatus === "in_progress"
                  ? Math.floor(Math.random() * 90) + 10
                  : 0
            const randomScore = randomStatus === "completed" ? Math.floor(Math.random() * 40) + 60 : null

            await sql`
              INSERT INTO user_trainings (user_id, training_id, status, progress, score, created_at, updated_at)
              VALUES (${user.id}, ${training.id}, ${randomStatus}, ${randomProgress}, ${randomScore}, NOW(), NOW());
            `
          }

          console.log(`Asignaciones creadas para el usuario ${user.name} (ID: ${user.id}).`)
        }
      }

      console.log("Asignaciones de prueba creadas con éxito.")
    }

    // Verificar las asignaciones creadas
    const finalAssignments = await sql`
      SELECT 
        ut.id, 
        u.name as user_name,
        t.title as training_title, 
        ut.status, 
        ut.progress,
        ut.score
      FROM user_trainings ut
      JOIN users u ON ut.user_id = u.id
      JOIN trainings t ON ut.training_id = t.id
      LIMIT 20;
    `

    console.log("\n--- ASIGNACIONES CREADAS (primeras 20) ---")
    finalAssignments.forEach((assignment) => {
      console.log(
        `- Usuario: ${assignment.user_name}, Capacitación: "${assignment.training_title}", Estado: ${assignment.status}, Progreso: ${assignment.progress}%, Puntuación: ${assignment.score || "N/A"}`,
      )
    })
  } catch (error) {
    console.error("Error al añadir datos de prueba:", error)
  }
}

// Ejecutar la función
addTestData()
