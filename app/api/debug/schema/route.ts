import { sql } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Obtener información básica de las tablas
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `

    // Obtener conteo de registros en tablas principales
    const userCount = await sql`SELECT COUNT(*) as count FROM users;`
    const trainingCount = await sql`SELECT COUNT(*) as count FROM trainings;`
    const userTrainingCount = await sql`SELECT COUNT(*) as count FROM user_trainings;`

    // Obtener columnas de tablas principales
    const userTrainingsColumns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'user_trainings'
      ORDER BY ordinal_position;
    `

    const trainingsColumns = await sql`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'trainings'
      ORDER BY ordinal_position;
    `

    return NextResponse.json({
      tables: tables.map((t) => t.table_name),
      counts: {
        users: userCount[0].count,
        trainings: trainingCount[0].count,
        userTrainings: userTrainingCount[0].count,
      },
      columns: {
        userTrainings: userTrainingsColumns.map((c) => ({ name: c.column_name, type: c.data_type })),
        trainings: trainingsColumns.map((c) => ({ name: c.column_name, type: c.data_type })),
      },
    })
  } catch (error) {
    console.error("Error al obtener información del esquema:", error)
    return NextResponse.json({ error: `Error al obtener información del esquema: ${error.message}` }, { status: 500 })
  }
}
