import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role: string
    branch: string
    categories?: any[]
    departments?: any[]
  }

  interface Session {
    user: {
      id: string
      role: string
      branch: string
      categories?: any[]
      departments?: any[]
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    branch: string
    categories?: any[]
    departments?: any[]
  }
}
