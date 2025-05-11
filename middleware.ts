import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Verificar si estamos en modo de desarrollo
  const isDevelopment = process.env.NODE_ENV === "development"

  // Obtener la cookie del usuario
  const userCookie = request.cookies.get("user")?.value

  // Intentar obtener el usuario del localStorage a través de una cookie
  let user = null
  try {
    if (userCookie) {
      user = JSON.parse(userCookie)
    }
  } catch (error) {
    console.error("[Middleware] Error al parsear cookie de usuario:", error)
  }

  // Si no hay usuario en la cookie, verificar si hay un token de sesión
  // Esto es para compatibilidad con NextAuth
  if (!user) {
    const sessionToken =
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value

    // Si hay un token de sesión, consideramos que el usuario está autenticado
    if (sessionToken) {
      // No podemos decodificar el token aquí, pero podemos asumir que está autenticado
      // y permitir el acceso. La verificación real del rol se hará en el componente.
      return NextResponse.next()
    }
  }

  // En desarrollo, permitir acceso a todas las rutas
  if (isDevelopment) {
    return NextResponse.next()
  }

  // Verificar si la ruta comienza con /employee
  if (pathname.startsWith("/employee")) {
    // Si no hay usuario o el rol no es "employee", redirigir al login
    if (!user || user.role !== "employee") {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
  }

  // Verificar si la ruta comienza con /admin
  if (pathname.startsWith("/admin")) {
    // Si no hay usuario o el rol no es "admin", redirigir al login
    if (!user || user.role !== "admin") {
      const url = new URL("/login", request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/employee/:path*", "/admin/:path*"],
}
