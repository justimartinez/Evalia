"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BarChart3, PieChart, Users, Award, BookOpen, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function TrainingResultsPage({ params }) {
  const router = useRouter()
  const [training, setTraining] = useState(null)
  const [loading, setLoading] = useState(true)

  const [fallbackData] = useState({
    id: params.id,
    title: "Capacitación (datos de respaldo)",
    description: "Descripción de la capacitación",
    assigned_users: 30,
    completed_users: 20,
    in_progress_users: 5,
    pending_users: 5,
    average_score: 75,
    best_department: "Ventas",
    excellent_count: 8,
    good_count: 12,
    average_count: 7,
    poor_count: 3,
    department_stats: [
      { name: "Ventas", average_score: 80, completion_rate: 85 },
      { name: "Marketing", average_score: 70, completion_rate: 75 },
      { name: "Recursos Humanos", average_score: 75, completion_rate: 90 },
    ],
    user_results: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      user_name: `Usuario ${i + 1}`,
      department: ["Ventas", "Marketing", "Recursos Humanos"][Math.floor(Math.random() * 3)],
      score: Math.floor(Math.random() * 51) + 50,
      status: ["completed", "in_progress", "pending"][Math.floor(Math.random() * 3)],
      progress: Math.floor(Math.random() * 101),
    })),
  })

  useEffect(() => {
    async function loadTraining() {
      try {
        setLoading(true)

        // Obtener datos reales de la base de datos
        const response = await fetch(`/api/trainings/${params.id}/results`)

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        setTraining(data)
      } catch (error) {
        console.error("Error al cargar resultados:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la información de resultados. Intentando con datos de respaldo.",
          variant: "destructive",
        })

        // Solo usar datos de respaldo si no se pudieron obtener datos reales
        setTraining(fallbackData)
      } finally {
        setLoading(false)
      }
    }

    loadTraining()
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!training && !loading) {
    // Usar datos de respaldo en caso de error
    setTraining(fallbackData)
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href={`/admin/trainings/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Resultados (Datos de respaldo)</h1>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No se pudieron cargar los datos reales. Mostrando datos de ejemplo.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Datos para los gráficos
  const statusData = [
    { name: "Completados", value: training.completed_users || 0, color: "#22c55e" },
    { name: "En progreso", value: training.in_progress_users || 0, color: "#f59e0b" },
    { name: "Pendientes", value: training.pending_users || 0, color: "#6b7280" },
  ]

  const scoreData = [
    { name: "Excelente (90-100%)", value: training.excellent_count || 0, color: "#22c55e" },
    { name: "Bueno (70-89%)", value: training.good_count || 0, color: "#3b82f6" },
    { name: "Regular (50-69%)", value: training.average_count || 0, color: "#f59e0b" },
    { name: "Insuficiente (<50%)", value: training.poor_count || 0, color: "#ef4444" },
  ]

  const departmentData = training.department_stats || []

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href={`/admin/trainings/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Resultados: {training.title}</h1>
            <p className="text-gray-500 dark:text-gray-400">Análisis de desempeño y progreso</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar resultados
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
            <p className="text-xs text-blue-700 dark:text-blue-400">Usuarios asignados</p>
            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-200">{training.assigned_users || 0}</h3>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-800/30">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="rounded-full p-2 bg-green-200 text-green-700 mb-2 dark:bg-green-800/50 dark:text-green-300">
              <Award className="h-5 w-5" />
            </div>
            <p className="text-xs text-green-700 dark:text-green-400">Calificación promedio</p>
            <h3 className="text-2xl font-bold text-green-900 dark:text-green-200">{training.average_score || 0}%</h3>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-900/20 dark:to-amber-800/20 dark:border-amber-800/30">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="rounded-full p-2 bg-amber-200 text-amber-700 mb-2 dark:bg-amber-800/50 dark:text-amber-300">
              <BookOpen className="h-5 w-5" />
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400">Tasa de finalización</p>
            <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-200">
              {training.assigned_users ? Math.round((training.completed_users / training.assigned_users) * 100) : 0}%
            </h3>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-800/30">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="rounded-full p-2 bg-purple-200 text-purple-700 mb-2 dark:bg-purple-800/50 dark:text-purple-300">
              <BarChart3 className="h-5 w-5" />
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-400">Mejor departamento</p>
            <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-200">
              {training.best_department || "N/A"}
            </h3>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Resumen</span>
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            <span>Por departamento</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Por usuario</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle>Estado de la capacitación</CardTitle>
                <CardDescription>Distribución de usuarios por estado</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md overflow-hidden">
              <CardHeader>
                <CardTitle>Distribución de calificaciones</CardTitle>
                <CardDescription>Rendimiento de los usuarios</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      score: {
                        label: "Usuarios",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={scoreData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" name="Usuarios" fill="var(--color-score)">
                          {scoreData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle>Rendimiento por departamento</CardTitle>
              <CardDescription>Calificación promedio por departamento</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    average: {
                      label: "Promedio",
                      color: "hsl(var(--chart-1))",
                    },
                    completion: {
                      label: "Finalización",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="average_score" name="Promedio" fill="var(--color-average)" />
                      <Bar dataKey="completion_rate" name="Finalización" fill="var(--color-completion)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader>
              <CardTitle>Resultados por usuario</CardTitle>
              <CardDescription>Detalle de calificaciones individuales</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {training.user_results && training.user_results.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {training.user_results.map((result) => (
                    <Card key={result.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-full h-10 w-10 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center font-medium">
                              {result.user_name.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{result.user_name}</p>
                              <p className="text-sm text-muted-foreground">{result.department || "Sin departamento"}</p>
                            </div>
                          </div>
                          <div className="flex flex-col md:items-end">
                            <div className="flex items-center gap-2">
                              <Badge
                                className={
                                  result.score >= 90
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : result.score >= 70
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                      : result.score >= 50
                                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                }
                              >
                                {result.score}%
                              </Badge>
                              <Badge
                                variant={
                                  result.status === "completed"
                                    ? "default"
                                    : result.status === "in_progress"
                                      ? "outline"
                                      : "secondary"
                                }
                                className={
                                  result.status === "completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                    : result.status === "in_progress"
                                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                                }
                              >
                                {result.status === "completed"
                                  ? "Completado"
                                  : result.status === "in_progress"
                                    ? "En progreso"
                                    : "Pendiente"}
                              </Badge>
                            </div>
                            <div className="w-full md:w-64 mt-2">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progreso</span>
                                <span>{result.progress || 0}%</span>
                              </div>
                              <Progress value={result.progress || 0} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">No hay resultados disponibles</p>
                  <p className="text-muted-foreground">Aún no hay usuarios que hayan completado esta capacitación</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
