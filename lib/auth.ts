import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"
import { executeQuery } from "./db"
import { syncUserToNeon, getUserByEmail } from "./neon-auth-integration"

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
          // Buscar usuario por email en la base de datos Evalia BD
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

          // Sincronizar con Neon Auth
          try {
            await syncUserToNeon({
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              role: user.role,
              metadata: {
                companyId: user.company_id,
                lastLogin: new Date().toISOString(),
              },
            })
          } catch (syncError) {
            console.warn("Error al sincronizar con Neon Auth:", syncError)
            // Continuar incluso si la sincronización falla
          }

          // Actualizar último login en Evalia BD
          try {
            await executeQuery('UPDATE "Evalia BD".users SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [user.id])
          } catch (updateError) {
            console.warn("Error al actualizar último login:", updateError)
            // Continuar sin actualizar el último login si hay error
          }

          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.company_id,
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
        token.companyId = user.companyId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.companyId = token.companyId

        // Opcionalmente, obtener datos actualizados de Neon Auth
        try {
          if (session.user.email) {
            const neonUser = await getUserByEmail(session.user.email)
            if (neonUser && neonUser.metadata) {
              // Actualizar datos de sesión con información de Neon Auth
              const metadata = typeof neonUser.metadata === "string" ? JSON.parse(neonUser.metadata) : neonUser.metadata

              // Añadir cualquier dato adicional del usuario desde Neon Auth
              session.user.neonSynced = true
              session.user.lastSyncedAt = neonUser.updated_at
            }
          }
        } catch (error) {
          console.warn("Error al obtener datos actualizados de Neon Auth:", error)
        }
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}
