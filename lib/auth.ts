import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs" // Cambiado de bcrypt a bcryptjs
import { executeQuery } from "./db"

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Buscar usuario por email
          const users = await executeQuery(
            'SELECT id, name, email, password, role, company_id, image FROM "Evalia BD".users WHERE email = $1',
            [credentials.email],
          )

          const user = users[0]

          if (!user) {
            return null
          }

          // Verificar contraseña
          const passwordMatch = await compare(credentials.password, user.password)

          if (!passwordMatch) {
            return null
          }

          // Actualizar último login
          try {
            await executeQuery('UPDATE "Evalia BD".users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id])
          } catch (error) {
            // Continuar sin actualizar el último login si hay error
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.company_id, // Cambiado de company_id a companyId para seguir la convención de camelCase
            image: user.image,
          }
        } catch (error) {
          console.error("Error en authorize:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.companyId = user.companyId // Cambiado de company_id a companyId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.companyId = token.companyId // Cambiado de company_id a companyId
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}
