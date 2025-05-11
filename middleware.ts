import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar si la ruta requiere autenticación
  const isAuthRoute = pathname.startsWith("/admin") || pathname.startsWith("/employee")

  // Verificar si es una ruta de API de autenticación
  const isAuthApiRoute = pathname.startsWith("/api/auth")

  // No aplicar middleware a rutas de API de autenticación
  if (isAuthApiRoute) {
    return NextResponse.next()
  }

  // Obtener el token de sesión
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Si no hay token y la ruta requiere autenticación, redirigir a login
  if (!token && isAuthRoute) {
    const url = new URL(`/login`, request.url)
    url.searchParams.set("callbackUrl", encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // Si hay token, verificar los permisos según el rol
  if (token) {
    const { role } = token

    // Verificar acceso a rutas de administrador
    if (pathname.startsWith("/admin") && role !== "admin" && role !== "super_admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }

    // Verificar acceso a rutas de empleado
    if (pathname.startsWith("/employee") && role !== "employee" && role !== "admin" && role !== "super_admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes of NextAuth.js)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)",
  ],
}
