import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      companyId: number | null
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    name: string
    email: string
    role: string
    companyId: number | null
    image?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    companyId: number | null
  }
}
