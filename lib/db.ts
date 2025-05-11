import { neon, neonConfig } from "@neondatabase/serverless"

// Configurar para Edge Runtime
neonConfig.forceEdgeRuntime = true

// Exportar la función sql para usar en toda la aplicación
// Modificado para usar el schema "Evalia BD" con comillas dobles para manejar el espacio
export const sql = neon(process.env.DATABASE_URL || "", { schema: '"Evalia BD"' })

// Función de utilidad para ejecutar consultas con mejor manejo de errores
export async function executeQuery(query: string, params: any[] = []) {
  try {
    // Añadir log para depuración (solo muestra los primeros 100 caracteres para evitar logs demasiado largos)
    console.log("Ejecutando consulta:", query.substring(0, 100) + (query.length > 100 ? "..." : ""))

    // Usar sql.query para consultas parametrizadas tradicionales
    const result = await sql.query(query, params)
    return result.rows
  } catch (error) {
    console.error("Error ejecutando consulta:", error)
    // Añadir más detalles del error para facilitar la depuración
    console.error(
      "Detalles del error:",
      JSON.stringify(
        {
          message: error.message,
          code: error.code,
          query: query.substring(0, 100) + (query.length > 100 ? "..." : ""),
          params: params,
        },
        null,
        2,
      ),
    )
    throw error
  }
}
