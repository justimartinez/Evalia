"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Building,
  Users,
  BookOpen,
  BarChart,
  CheckCircle,
  Clock,
  Edit,
  Download,
  UserPlus,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { getDepartmentById } from "@/app/actions/department-actions"

export default function DepartmentDetailPage({ params }) {
  const router = useRouter()
  const [department, setDepartment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function loadDepartment() {
      try {
        setLoading(true)
        const data = await getDepartmentById(params.id)
        if (data) {
          setDepartment(data)
        } else {
          // Si no se encuentra el departamento, redirigir a la lista
          router.push("/admin/departments")
        }
      } catch (error) {
        console.error("Error al cargar departamento:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDepartment()
  }, [params.id, router])

  // Función para renderizar gráficos de manera segura
  const renderChart = (chartComponent) => {
    if (typeof window === "undefined") return null
    return chartComponent
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    )
  }

  if (!department) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Departamento no encontrado</h3>
            <p className="text-muted-foreground text-center mt-1 mb-4">
              El departamento que buscas no existe o ha sido eliminado
            </p>
            <Button asChild>
              <Link href="/admin/departments">Ver todos los departamentos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/departments">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{department.name}</h1>
            <p className="text-gray-500 dark:text-gray-400">{department.description || "Sin descripción"}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/departments/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/departments/${params.id}/assign`}>
              <Plus className="mr-2 h-4 w-4" />
              Asignar capacitación
            </Link>
          </Button>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800/30">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="rounded-full p-2 bg-blue-200 text-blue-700 mb-2 dark:bg-blue-800/50 dark:text-blue-300">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-400">Usuarios</p>
            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-200">{department.user_count}</h3>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-800/30">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="rounded-full p-2 bg-green-200 text-green-700 mb-2 dark:bg-green-800/50 dark:text-green-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <p className="text-xs text-green-700 dark:text-green-400">Capacitaciones</p>
            <h3 className="text-2xl font-bold text-green-900 dark:text-green-200">{department.training_count}</h3>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-900/20 dark:to-amber-800/20 dark:border-amber-800/30">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="rounded-full p-2 bg-amber-200 text-amber-700 mb-2 dark:bg-amber-800/50 dark:text-amber-300">
              <CheckCircle className="h-5 w-5" />
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400">Puntuación</p>
            <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-200">
              {Math.round(department.average_score)}%
            </h3>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-800/30">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="rounded-full p-2 bg-purple-200 text-purple-700 mb-2 dark:bg-purple-800/50 dark:text-purple-300">
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-400">Finalización</p>
            <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-200">
              {Math.round(department.completion_rate)}%
            </h3>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span>Resumen</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Usuarios</span>
          </TabsTrigger>
          <TabsTrigger value="trainings" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Capacitaciones</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Rendimiento del Departamento</CardTitle>
              <CardDescription>Análisis del rendimiento en capacitaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Puntuación por Mes</h3>
                  <div className="h-[300px]">
                    {renderChart(
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={department.performanceByMonth}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                          <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "0.375rem",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="average_score"
                            name="Puntuación promedio"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>,
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Capacitaciones Completadas por Mes</h3>
                  <div className="h-[300px]">
                    {renderChart(
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart
                          data={department.performanceByMonth}
                          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                          <YAxis stroke="#6b7280" fontSize={12} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "0.375rem",
                              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            }}
                          />
                          <Legend />
                          <Bar
                            dataKey="completed_count"
                            name="Capacitaciones completadas"
                            fill="#22c55e"
                            radius={[4, 4, 0, 0]}
                            barSize={40}
                          />
                        </ReBarChart>
                      </ResponsiveContainer>,
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Estado de Capacitaciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="rounded-full p-3 bg-green-100 text-green-600 mb-4">
                        <CheckCircle className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Completadas</h3>
                      <p className="text-3xl font-bold">{department.completed_count}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {Math.round((department.completed_count / department.training_count) * 100) || 0}% del total
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="rounded-full p-3 bg-amber-100 text-amber-600 mb-4">
                        <Clock className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">En Progreso</h3>
                      <p className="text-3xl font-bold">{department.in_progress_count}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {Math.round((department.in_progress_count / department.training_count) * 100) || 0}% del total
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="rounded-full p-3 bg-gray-100 text-gray-600 mb-4">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Pendientes</h3>
                      <p className="text-3xl font-bold">{department.pending_count}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {Math.round((department.pending_count / department.training_count) * 100) || 0}% del total
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/reports">
                  <BarChart className="mr-2 h-4 w-4" />
                  Ver reportes completos
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Usuarios del Departamento</CardTitle>
                <CardDescription>
                  {department.user_count} usuario{department.user_count !== 1 ? "s" : ""} en total
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <Button size="sm">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Añadir Usuario
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {department.users && department.users.length > 0 ? (
                <div className="space-y-4">
                  {department.users.map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-3 sm:mb-0">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .substring(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {user.role}
                        </Badge>

                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Capacitaciones:</span>
                            <span className="font-medium">
                              {user.completed_trainings}/{user.assigned_trainings}
                            </span>
                          </div>
                          <Progress
                            value={
                              user.assigned_trainings ? (user.completed_trainings / user.assigned_trainings) * 100 : 0
                            }
                            className="h-2 w-24"
                          />
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Puntuación:</span>
                          <span className="font-medium">{Math.round(user.average_score)}%</span>
                        </div>

                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/users/${user.id}`}>Ver perfil</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No hay usuarios en este departamento</h3>
                  <p className="text-muted-foreground mb-6">Añade usuarios a este departamento para comenzar</p>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Añadir Usuario
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trainings" className="space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Capacitaciones Asignadas</CardTitle>
                <CardDescription>
                  {department.training_count} capacitación{department.training_count !== 1 ? "es" : ""} en total
                </CardDescription>
              </div>
              <Button asChild>
                <Link href={`/admin/departments/${params.id}/assign`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Asignar Capacitación
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {department.trainings && department.trainings.length > 0 ? (
                <div className="space-y-4">
                  {department.trainings.map((training) => (
                    <div
                      key={training.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-3 sm:mb-0">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{training.title}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{training.assigned_users} usuarios asignados</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground">Completados:</span>
                            <span className="font-medium">
                              {training.completed_users}/{training.assigned_users}
                            </span>
                          </div>
                          <Progress
                            value={
                              training.assigned_users ? (training.completed_users / training.assigned_users) * 100 : 0
                            }
                            className="h-2 w-24"
                          />
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Puntuación:</span>
                          <span className="font-medium">{Math.round(training.average_score)}%</span>
                        </div>

                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/trainings/${training.id}`}>Ver detalles</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No hay capacitaciones asignadas</h3>
                  <p className="text-muted-foreground mb-6">Asigna capacitaciones a este departamento para comenzar</p>
                  <Button asChild>
                    <Link href={`/admin/departments/${params.id}/assign`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Asignar Capacitación
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
