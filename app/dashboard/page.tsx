"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  if (!user) {
    return <div>Cargando información del usuario...</div>
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold">Bienvenido, {user.name}</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Perfil de Usuario</CardTitle>
            <CardDescription>Información de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Nombre:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Rol:</span>
                <span>{user.role}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
            <CardDescription>Resumen de actividad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Sesiones:</span>
                <span>12</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Última actividad:</span>
                <span>Hoy</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Estado:</span>
                <span className="text-green-600">Activo</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Funciones comunes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <button className="w-full py-2 px-4 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                Ver Perfil Completo
              </button>
              <button className="w-full py-2 px-4 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                Actualizar Información
              </button>
              <button className="w-full py-2 px-4 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors">
                Configuración
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
