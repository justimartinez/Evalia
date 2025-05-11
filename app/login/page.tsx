"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, User, ShieldCheck, Building } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Cookies from "js-cookie"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  // Obtener el callbackUrl de los parámetros de búsqueda
  const callbackUrl = searchParams?.get("callbackUrl") || "/admin/dashboard"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
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

      setError("Credenciales incorrectas")
    } catch (err) {
      setError("Error al iniciar sesión")
      console.error(err)
    } finally {
      setLoading(false)
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

    // Si el callbackUrl contiene "employee", redirigir allí
    if (callbackUrl.startsWith("/employee")) {
      router.push(callbackUrl)
    } else {
      router.push("/employee/dashboard")
    }
  }

  // Función para manejar los botones de acceso rápido
  const handleQuickLogin = (userType: string) => {
    setLoading(true)
    setTimeout(() => {
      if (userType === "superadmin") {
        loginAsSuperAdmin()
      } else if (userType === "admin1") {
        loginAsAdmin("Admin ABC", 1, 1)
      } else if (userType === "admin2") {
        loginAsAdmin("Admin XYZ", 2, 2)
      } else if (userType === "employee1") {
        setEmail("juan@abc-tech.com")
        loginAsEmployee("Juan Pérez", 5, 1)
      } else if (userType === "employee2") {
        setEmail("maria@abc-tech.com")
        loginAsEmployee("María López", 6, 1)
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Evalia <span className="text-orange-400">360</span>
          </h1>
          <p className="text-blue-200">Sistema de Capacitaciones</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tus credenciales para acceder al sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2 text-center">Acceso Rápido</h3>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleQuickLogin("superadmin")}
                  disabled={loading}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Super Admin</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleQuickLogin("admin1")}
                  disabled={loading}
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
                  disabled={loading}
                >
                  <User className="h-4 w-4" />
                  <span>Juan Pérez</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleQuickLogin("employee2")}
                  disabled={loading}
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

            <form onSubmit={handleLogin}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="ejemplo@evalia.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium">Credenciales disponibles:</p>
              <div className="grid grid-cols-1 gap-x-4 gap-y-1 mt-1 text-xs">
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
      </div>
    </div>
  )
}
