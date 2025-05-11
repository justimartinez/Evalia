"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, User, ShieldCheck, Building } from "lucide-react"
import Cookies from "js-cookie"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Obtener el callbackUrl de los parámetros de búsqueda
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard"

  // Función simplificada para login directo
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Para el super admin
      if (email === "superadmin@evalia.com" && password === "admin123") {
        loginAsSuperAdmin()
        return
      }

      // Para los admins de empresas
      if (email === "admin@abc-tech.com" && password === "admin123") {
        loginAsAdmin("Admin ABC", 1, 1)
        return
      }

      if (email === "admin@xyz-consult.com" && password === "admin123") {
        loginAsAdmin("Admin XYZ", 2, 2)
        return
      }

      if (email === "admin@mno-industry.com" && password === "admin123") {
        loginAsAdmin("Admin MNO", 3, 3)
        return
      }

      // Para los empleados
      if (email === "juan@abc-tech.com" && password === "user123") {
        loginAsEmployee("Juan Pérez", 5, 1)
        return
      }

      if (email === "maria@abc-tech.com" && password === "user123") {
        loginAsEmployee("María López", 6, 1)
        return
      }

      if (email === "ana@xyz-consult.com" && password === "user123") {
        loginAsEmployee("Ana Martínez", 8, 2)
        return
      }

      if (email === "laura@mno-industry.com" && password === "user123") {
        loginAsEmployee("Laura Torres", 10, 3)
        return
      }

      // Si las credenciales no coinciden
      setError("Credenciales inválidas. Por favor, intente nuevamente.")
    } catch (error) {
      console.error("Error en el proceso de login:", error)
      setError("Ocurrió un error al iniciar sesión. Por favor, intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const loginAsSuperAdmin = () => {
    const userData = {
      id: 4,
      name: "Super Admin",
      email: "superadmin@evalia.com",
      role: "super_admin",
      company_id: null,
    }

    try {
      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(userData))

      // Guardar en cookie para que el middleware pueda acceder
      Cookies.set("user", JSON.stringify(userData), { expires: 7, path: "/" })
    } catch (error) {
      console.error("Error storing user data:", error)
    }

    // Redirigir al dashboard de admin
    router.push("/admin/dashboard")
  }

  const loginAsAdmin = (name: string, id: number, companyId: number) => {
    const userData = {
      id: id,
      name: name,
      email: `admin@company${companyId}.com`,
      role: "admin",
      company_id: companyId,
    }

    try {
      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(userData))

      // Guardar en cookie para que el middleware pueda acceder
      Cookies.set("user", JSON.stringify(userData), { expires: 7, path: "/" })
    } catch (error) {
      console.error("Error storing user data:", error)
    }

    // Redirigir al dashboard de admin
    router.push("/admin/dashboard")
  }

  const loginAsEmployee = (name: string, id: number, companyId: number) => {
    const userData = {
      id: id,
      name: name,
      email: email,
      role: "employee",
      company_id: companyId,
    }

    try {
      // Guardar en localStorage
      localStorage.setItem("user", JSON.stringify(userData))

      // Guardar en cookie para que el middleware pueda acceder
      Cookies.set("user", JSON.stringify(userData), { expires: 7, path: "/" })
    } catch (error) {
      console.error("Error storing user data:", error)
    }

    // Determinar la ruta de redirección
    let redirectPath = "/employee/dashboard"

    // Si el callbackUrl contiene "employee", usar esa ruta
    if (callbackUrl.startsWith("/employee")) {
      redirectPath = callbackUrl
    }

    // Redirigir
    router.push(redirectPath)
  }

  // Función para manejar los botones de acceso rápido
  const handleQuickLogin = (userType: string) => {
    setIsLoading(true)
    setTimeout(() => {
      if (userType === "superadmin") {
        loginAsSuperAdmin()
      } else if (userType === "admin1") {
        loginAsAdmin("Admin ABC", 1, 1)
      } else if (userType === "admin2") {
        loginAsAdmin("Admin XYZ", 2, 2)
      } else if (userType === "employee1") {
        loginAsEmployee("Juan Pérez", 5, 1)
      } else if (userType === "employee2") {
        loginAsEmployee("María López", 6, 1)
      }
      setIsLoading(false)
    }, 500)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Iniciar Sesión</CardTitle>
        <CardDescription>Ingrese sus credenciales para acceder al sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2 text-center">Acceso Rápido</h3>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleQuickLogin("superadmin")}
              disabled={isLoading}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Super Admin</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleQuickLogin("admin1")}
              disabled={isLoading}
            >
              <Building className="h-4 w-4" />
              <span>Admin ABC</span>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleQuickLogin("employee1")}
              disabled={isLoading}
            >
              <User className="h-4 w-4" />
              <span>Juan Pérez</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2"
              onClick={() => handleQuickLogin("employee2")}
              disabled={isLoading}
            >
              <User className="h-4 w-4" />
              <span>María López</span>
            </Button>
          </div>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">O</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Sistema de Gestión de Usuarios Evalia</p>
        <div className="text-xs text-muted-foreground">
          <p className="font-medium">Credenciales disponibles:</p>
          <div className="grid grid-cols-1 gap-x-4 gap-y-1 mt-1">
            <p>• Super Admin: superadmin@evalia.com / admin123</p>
            <p>• Admin ABC: admin@abc-tech.com / admin123</p>
            <p>• Admin XYZ: admin@xyz-consult.com / admin123</p>
            <p>• Juan: juan@abc-tech.com / user123</p>
            <p>• María: maria@abc-tech.com / user123</p>
            <p>• Ana: ana@xyz-consult.com / user123</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
