import { neon, neonConfig } from "@neondatabase/serverless"

// Configurar para Edge Runtime
neonConfig.forceEdgeRuntime = true

// Exportar la función sql para usar en toda la aplicación
// Modificado para usar el schema "Evalia BD"
export const sql = neon(process.env.DATABASE_URL || "", { schema: "Evalia BD" })

// Función de utilidad para ejecutar consultas
export async function executeQuery(query: string, params: any[] = []) {
  try {
    // Usar sql.query para consultas parametrizadas tradicionales
    const result = await sql.query(query, params)
    return result.rows
  } catch (error) {
    console.error("Error ejecutando consulta:", error)
    throw error
  }
}
