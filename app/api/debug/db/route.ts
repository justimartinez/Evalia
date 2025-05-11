import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    // Consulta simple para verificar la conexión
    const result = await sql`SELECT NOW() as time`
    return NextResponse.json({
      success: true,
      time: result[0].time,
      message: "Conexión a la base de datos exitosa",
    })
  } catch (error) {
    console.error("Error de conexión a la base de datos:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: JSON.stringify(error),
      },
      { status: 500 },
    )
  }
}
