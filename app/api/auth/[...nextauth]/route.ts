import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Asegurarse de que NEXTAUTH_URL esté configurado correctamente en las variables de entorno
if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === "production") {
  console.warn("NEXTAUTH_URL no está configurado. Esto puede causar problemas con la autenticación.")
}

// Configurar el secreto para NextAuth
if (!process.env.NEXTAUTH_SECRET) {
  // En desarrollo, usar un secreto predeterminado
  if (process.env.NODE_ENV !== "production") {
    process.env.NEXTAUTH_SECRET = "desarrollo_secreto_inseguro"
    console.warn("NEXTAUTH_SECRET no está configurado. Usando un secreto predeterminado para desarrollo.")
  } else {
    console.error("NEXTAUTH_SECRET debe estar configurado en producción!")
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
