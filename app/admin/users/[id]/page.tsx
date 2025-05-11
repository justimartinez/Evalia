"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Building, Phone, MapPin, Briefcase, Award, BookOpen, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserRoleBadge } from "@/components/dashboard/user-role-badge"
import { toast } from "@/hooks/use-toast"

export default function UserDetailPage({ params }) {
  const [user, setUser] = useState(null)
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)

        // Cargar datos del usuario
        const userResponse = await fetch(`/api/users/${params.id}`)

        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUser(userData)
        } else {
          // Si hay un error, usar datos de ejemplo
          console.error("Error al cargar usuario, usando datos de ejemplo")

          // Buscar el usuario por ID en los datos de ejemplo
          const exampleUsers = [
            {
              id: "1",
              name: "Admin Usuario",
              email: "admin@evalia.com",
              role: "Administrador",
              branch: "Sede Central",
              departments: [
                {
                  id: "1",
                  name: "Administración",
                  position: "Director",
                },
              ],
            },
            {
              id: "2",
              name: "Gerente Ejemplo",
              email: "gerente@evalia.com",
              role: "Gerente",
              branch: "Sede Norte",
              departments: [
                {
                  id: "2",
                  name: "Ventas",
                  position: "Gerente de Ventas",
                },
              ],
            },
            {
              id: "3",
              name: "Empleado Prueba",
              email: "empleado@evalia.com",
              role: "Empleado",
              branch: "Sede Sur",
              departments: [
                {
                  id: "3",
                  name: "Atención al Cliente",
                  position: "Representante",
                },
              ],
            },
          ]

          const foundUser = exampleUsers.find((u) => u.id === params.id)
          if (foundUser) {
            setUser(foundUser)
          } else {
            // Si no se encuentra el usuario, usar el primero como ejemplo
            setUser(exampleUsers[0])
          }
        }

        // Cargar capacitaciones del usuario
        try {
          const trainingsResponse = await fetch(`/api/users/${params.id}/trainings`)
          if (trainingsResponse.ok) {
            const trainingsData = await trainingsResponse.json()
            setTrainings(trainingsData)
          } else {
            // Si hay un error, usar datos de ejemplo
            console.error("Error al cargar capacitaciones, usando datos de ejemplo")
            setTrainings([
              {
                id: "1",
                training_id: "1",
                title: "Introducción a la Atención al Cliente",
                status: "completed",
                assigned_date: "2023-01-15T00:00:00.000Z",
                completion_date: "2023-01-20T00:00:00.000Z",
                score: 85,
              },
              {
                id: "2",
                training_id: "2",
                title: "Técnicas Avanzadas de Ventas",
                status: "in_progress",
                assigned_date: "2023-02-10T00:00:00.000Z",
                completion_date: null,
                score: null,
              },
              {
                id: "3",
                training_id: "3",
                title: "Análisis de Datos con Excel",
                status: "pending",
                assigned_date: "2023-03-15T00:00:00.000Z",
                completion_date: null,
                score: null,
              },
            ])
          }
        } catch (error) {
          console.error("Error al cargar capacitaciones:", error)
          // Usar datos de ejemplo
          setTrainings([
            {
              id: "1",
              training_id: "1",
              title: "Introducción a la Atención al Cliente",
              status: "completed",
              assigned_date: "2023-01-15T00:00:00.000Z",
              completion_date: "2023-01-20T00:00:00.000Z",
              score: 85,
            },
            {
              id: "2",
              training_id: "2",
              title: "Técnicas Avanzadas de Ventas",
              status: "in_progress",
              assigned_date: "2023-02-10T00:00:00.000Z",
              completion_date: null,
              score: null,
            },
            {
              id: "3",
              training_id: "3",
              title: "Análisis de Datos con Excel",
              status: "pending",
              assigned_date: "2023-03-15T00:00:00.000Z",
              completion_date: null,
              score: null,
            },
          ])
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la información del usuario. Usando datos de ejemplo.",
          variant: "destructive",
        })

        // Usar datos de ejemplo en caso de error
        setUser({
          id: params.id,
          name: "Usuario Ejemplo",
          email: "usuario@evalia.com",
          role: "Empleado",
          branch: "Sede Principal",
          departments: [
            {
              id: "1",
              name: "Departamento General",
              position: "Analista",
            },
          ],
        })

        setTrainings([
          {
            id: "1",
            training_id: "1",
            title: "Capacitación Básica",
            status: "completed",
            assigned_date: "2023-01-15T00:00:00.000Z",
            completion_date: "2023-01-20T00:00:00.000Z",
            score: 85,
          },
          {
            id: "2",
            training_id: "2",
            title: "Capacitación Avanzada",
            status: "in_progress",
            assigned_date: "2023-02-10T00:00:00.000Z",
            completion_date: null,
            score: null,
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Usuario no encontrado</h1>
        </div>
        <p>El usuario que estás buscando no existe o ha sido eliminado.</p>
        <Button asChild>
          <Link href="/admin/users">Volver a usuarios</Link>
        </Button>
      </div>
    )
  }

  // Calcular estadísticas
  const completedTrainings = trainings.filter((t) => t.status === "completed").length
  const inProgressTrainings = trainings.filter((t) => t.status === "in_progress").length
  const pendingTrainings = trainings.filter((t) => t.status === "pending").length
  const completionRate = trainings.length > 0 ? Math.round((completedTrainings / trainings.length) * 100) : 0

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/users/edit/${params.id}`}>Editar usuario</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1 border-none shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardTitle>Perfil de usuario</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={user.image || ""} alt={user.name} />
                <AvatarFallback className="bg-blue-600/30 text-blue-200 text-xl">{initials}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              <div className="mt-2">
                <UserRoleBadge role={user.role} />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-full p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Building className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sucursal</p>
                  <p className="text-sm text-muted-foreground">{user.branch || "No especificada"}</p>
                </div>
              </div>

              {user.departments && user.departments.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="rounded-full p-2 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <Briefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Departamento</p>
                    <p className="text-sm text-muted-foreground">{user.departments[0].name}</p>
                  </div>
                </div>
              )}

              {user.departments && user.departments.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="rounded-full p-2 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Posición</p>
                    <p className="text-sm text-muted-foreground">{user.departments[0].position}</p>
                  </div>
                </div>
              )}

              {user.phone && (
                <div className="flex items-center gap-3">
                  <div className="rounded-full p-2 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Teléfono</p>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                  </div>
                </div>
              )}

              {user.address && (
                <div className="flex items-center gap-3">
                  <div className="rounded-full p-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dirección</p>
                    <p className="text-sm text-muted-foreground">{user.address}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {/* Tarjetas de estadísticas */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800/30">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="rounded-full p-2 bg-blue-200 text-blue-700 mb-2 dark:bg-blue-800/50 dark:text-blue-300">
                  <BookOpen className="h-5 w-5" />
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-400">Total capacitaciones</p>
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-200">{trainings.length}</h3>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-800/30">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="rounded-full p-2 bg-green-200 text-green-700 mb-2 dark:bg-green-800/50 dark:text-green-300">
                  <Award className="h-5 w-5" />
                </div>
                <p className="text-xs text-green-700 dark:text-green-400">Completadas</p>
                <h3 className="text-2xl font-bold text-green-900 dark:text-green-200">{completedTrainings}</h3>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-900/20 dark:to-amber-800/20 dark:border-amber-800/30">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="rounded-full p-2 bg-amber-200 text-amber-700 mb-2 dark:bg-amber-800/50 dark:text-amber-300">
                  <BookOpen className="h-5 w-5" />
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400">En progreso</p>
                <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-200">{inProgressTrainings}</h3>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-800/30">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="rounded-full p-2 bg-purple-200 text-purple-700 mb-2 dark:bg-purple-800/50 dark:text-purple-300">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <p className="text-xs text-purple-700 dark:text-purple-400">Tasa de finalización</p>
                <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-200">{completionRate}%</h3>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardTitle>Capacitaciones</CardTitle>
              <CardDescription>Historial de capacitaciones del usuario</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {trainings.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {trainings.map((training) => (
                    <div
                      key={training.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full h-10 w-10 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center font-medium">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{training.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Asignado: {new Date(training.assigned_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            training.status === "completed"
                              ? "default"
                              : training.status === "in_progress"
                                ? "outline"
                                : "secondary"
                          }
                          className={
                            training.status === "completed"
                              ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                              : training.status === "in_progress"
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                                : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                          }
                        >
                          {training.status === "completed"
                            ? "Completado"
                            : training.status === "in_progress"
                              ? "En progreso"
                              : "Pendiente"}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/trainings/${training.training_id}`}>Ver</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">Sin capacitaciones</p>
                  <p className="text-muted-foreground mb-6">Este usuario aún no tiene capacitaciones asignadas</p>
                  <Button asChild>
                    <Link href="/admin/trainings">Asignar capacitación</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
