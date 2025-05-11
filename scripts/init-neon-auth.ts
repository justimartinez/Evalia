import { neon } from "@neondatabase/serverless"

async function initNeonAuth() {
  try {
    console.log("Inicializando Neon Auth...")

    // Usar la variable de entorno DATABASE_URL
    const sql = neon(process.env.DATABASE_URL || "")

    // Crear tabla de usuarios si no existe
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        external_id TEXT,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        role TEXT DEFAULT 'user',
        metadata JSONB DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `

    console.log("Tabla de usuarios creada o verificada correctamente")

    // Crear índices para búsqueda rápida
    await sql`
      CREATE INDEX IF NOT EXISTS users_email_idx ON users (email)
    `

    await sql`
      CREATE INDEX IF NOT EXISTS users_external_id_idx ON users (external_id)
    `

    console.log("Índices creados o verificados correctamente")

    console.log("Inicialización de Neon Auth completada con éxito")
  } catch (error) {
    console.error("Error al inicializar Neon Auth:", error)
  }
}

// Ejecutar la función si este script se ejecuta directamente
if (require.main === module) {
  initNeonAuth()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error en la inicialización:", error)
      process.exit(1)
    })
}

export { initNeonAuth }
