"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, BarChart, Users, BookOpen, Award } from "lucide-react"
import { useSession } from "next-auth/react"

// Importar componentes de gráficos
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import { Bar, Pie, Line } from "react-chartjs-2"

// Registrar componentes de ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

interface ReportData {
  departmentStats: {
    name: string
    userCount: number
    completedTrainings: number
    averageScore: number
  }[]
  trainingStats: {
    title: string
    assignedCount: number
    completedCount: number
    averageScore: number
    completionRate: number
  }[]
  userStats: {
    name: string
    department: string
    completedTrainings: number
    averageScore: number
    lastActivity: string
  }[]
  timeStats: {
    month: string
    completedTrainings: number
    newAssignments: number
  }[]
  questionStats: {
    question: string
    training: string
    correctAnswers: number
    totalAnswers: number
    successRate: number
  }[]
}

export default function ReportsPage() {
  const { data: session } = useSession()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [timeRange, setTimeRange] = useState("6months")

  useEffect(() => {
    if (session?.user?.id) {
      fetchReportData()
    }
  }, [session, departmentFilter, timeRange])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reports?department=${departmentFilter}&timeRange=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      }
    } catch (error) {
      console.error("Error fetching report data:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = (data: any[], filename: string) => {
    if (!data.length) return

    const headers = Object.keys(data[0])
    const csvRows = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => JSON.stringify(row[header] ?? "")).join(",")),
    ]

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Preparar datos para gráficos
  const departmentBarData = {
    labels: reportData?.departmentStats.map((dept) => dept.name) || [],
    datasets: [
      {
        label: "Usuarios",
        data: reportData?.departmentStats.map((dept) => dept.userCount) || [],
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
      {
        label: "Capacitaciones Completadas",
        data: reportData?.departmentStats.map((dept) => dept.completedTrainings) || [],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Puntuación Media (%)",
        data: reportData?.departmentStats.map((dept) => dept.averageScore) || [],
        backgroundColor: "rgba(255, 159, 64, 0.5)",
      },
    ],
  }

  const trainingCompletionPieData = {
    labels: ["Completadas", "En Progreso"],
    datasets: [
      {
        data: reportData?.trainingStats.reduce(
          (acc, training) => {
            acc[0] += training.completedCount
            acc[1] += training.assignedCount - training.completedCount
            return acc
          },
          [0, 0],
        ) || [0, 0],
        backgroundColor: ["rgba(75, 192, 192, 0.5)", "rgba(255, 159, 64, 0.5)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 159, 64, 1)"],
        borderWidth: 1,
      },
    ],
  }

  const timeLineData = {
    labels: reportData?.timeStats.map((stat) => stat.month) || [],
    datasets: [
      {
        label: "Capacitaciones Completadas",
        data: reportData?.timeStats.map((stat) => stat.completedTrainings) || [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Nuevas Asignaciones",
        data: reportData?.timeStats.map((stat) => stat.newAssignments) || [],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        tension: 0.4,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reportes y Análisis</h1>
        <div className="flex items-center space-x-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los departamentos</SelectItem>
              {reportData?.departmentStats.map((dept) => (
                <SelectItem key={dept.name} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Último mes</SelectItem>
              <SelectItem value="3months">Últimos 3 meses</SelectItem>
              <SelectItem value="6months">Últimos 6 meses</SelectItem>
              <SelectItem value="1year">Último año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resumen general */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {reportData?.departmentStats.reduce((sum, dept) => sum + dept.userCount, 0) || 0}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Capacitaciones Activas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{reportData?.trainingStats.length || 0}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Finalización</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {reportData?.trainingStats.length
                  ? Math.round(
                      (reportData.trainingStats.reduce((sum, training) => sum + training.completionRate, 0) /
                        reportData.trainingStats.length) *
                        100,
                    )
                  : 0}
                %
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Puntuación Media</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">
                {reportData?.trainingStats.length
                  ? Math.round(
                      reportData.trainingStats.reduce((sum, training) => sum + training.averageScore, 0) /
                        reportData.trainingStats.length,
                    )
                  : 0}
                %
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gráficos y tablas */}
      <Tabs defaultValue="departments">
        <TabsList>
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
          <TabsTrigger value="trainings">Capacitaciones</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="time">Tendencias</TabsTrigger>
          <TabsTrigger value="questions">Preguntas</TabsTrigger>
        </TabsList>

        {/* Pestaña de Departamentos */}
        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rendimiento por Departamento</CardTitle>
                  <CardDescription>
                    Comparativa de usuarios, capacitaciones completadas y puntuación media
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(reportData?.departmentStats || [], "departamentos_rendimiento")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-80">
              {loading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <Bar
                  data={departmentBarData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top" as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detalle por Departamento</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(reportData?.departmentStats || [], "departamentos_detalle")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Departamento</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Usuarios</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Capacitaciones Completadas</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Puntuación Media</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <tr key={i}>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-24" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-8" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-8" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-12" />
                            </td>
                          </tr>
                        ))
                    ) : reportData?.departmentStats.length ? (
                      reportData.departmentStats.map((dept) => (
                        <tr key={dept.name}>
                          <td className="px-4 py-3 text-sm">{dept.name}</td>
                          <td className="px-4 py-3 text-sm">{dept.userCount}</td>
                          <td className="px-4 py-3 text-sm">{dept.completedTrainings}</td>
                          <td className="px-4 py-3 text-sm">{dept.averageScore}%</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-3 text-sm text-center">
                          No hay datos disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Capacitaciones */}
        <TabsContent value="trainings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tasa de Finalización</CardTitle>
                <CardDescription>Proporción de capacitaciones completadas vs. en progreso</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                {loading ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : (
                  <Pie
                    data={trainingCompletionPieData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom" as const,
                        },
                      },
                    }}
                  />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capacitaciones Destacadas</CardTitle>
                <CardDescription>Las 5 capacitaciones con mayor tasa de finalización</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reportData?.trainingStats
                      .sort((a, b) => b.completionRate - a.completionRate)
                      .slice(0, 5)
                      .map((training, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm truncate max-w-[200px]">{training.title}</span>
                          <span className="text-sm font-medium">{Math.round(training.completionRate * 100)}%</span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Detalle de Capacitaciones</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(reportData?.trainingStats || [], "capacitaciones_detalle")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Capacitación</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Asignados</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Completados</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Puntuación Media</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Tasa de Finalización</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <tr key={i}>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-40" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-8" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-8" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-12" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-12" />
                            </td>
                          </tr>
                        ))
                    ) : reportData?.trainingStats.length ? (
                      reportData.trainingStats.map((training, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm">{training.title}</td>
                          <td className="px-4 py-3 text-sm">{training.assignedCount}</td>
                          <td className="px-4 py-3 text-sm">{training.completedCount}</td>
                          <td className="px-4 py-3 text-sm">{training.averageScore}%</td>
                          <td className="px-4 py-3 text-sm">{Math.round(training.completionRate * 100)}%</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-3 text-sm text-center">
                          No hay datos disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Usuarios */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Usuarios Destacados</CardTitle>
                  <CardDescription>Los usuarios con mejor rendimiento en capacitaciones</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(reportData?.userStats || [], "usuarios_destacados")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Usuario</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Departamento</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Capacitaciones Completadas</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Puntuación Media</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Última Actividad</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <tr key={i}>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-24" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-24" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-8" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-12" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-24" />
                            </td>
                          </tr>
                        ))
                    ) : reportData?.userStats.length ? (
                      reportData.userStats
                        .sort((a, b) => b.averageScore - a.averageScore)
                        .map((user, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm">{user.name}</td>
                            <td className="px-4 py-3 text-sm">{user.department}</td>
                            <td className="px-4 py-3 text-sm">{user.completedTrainings}</td>
                            <td className="px-4 py-3 text-sm">{user.averageScore}%</td>
                            <td className="px-4 py-3 text-sm">{user.lastActivity}</td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-3 text-sm text-center">
                          No hay datos disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Tendencias */}
        <TabsContent value="time" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Tendencias a lo largo del tiempo</CardTitle>
                  <CardDescription>Capacitaciones completadas y nuevas asignaciones por mes</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(reportData?.timeStats || [], "tendencias_tiempo")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent className="h-80">
              {loading ? (
                <div className="h-full w-full flex items-center justify-center">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <Line
                  data={timeLineData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "top" as const,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pestaña de Preguntas */}
        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Análisis de Preguntas</CardTitle>
                  <CardDescription>Preguntas con menor tasa de respuestas correctas</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(reportData?.questionStats || [], "analisis_preguntas")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium">Pregunta</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Capacitación</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Respuestas Correctas</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Total Respuestas</th>
                      <th className="px-4 py-3 text-left text-sm font-medium">Tasa de Éxito</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {loading ? (
                      Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <tr key={i}>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-40" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-24" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-8" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-8" />
                            </td>
                            <td className="px-4 py-3">
                              <Skeleton className="h-4 w-12" />
                            </td>
                          </tr>
                        ))
                    ) : reportData?.questionStats.length ? (
                      reportData.questionStats
                        .sort((a, b) => a.successRate - b.successRate)
                        .map((question, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 text-sm">{question.question}</td>
                            <td className="px-4 py-3 text-sm">{question.training}</td>
                            <td className="px-4 py-3 text-sm">{question.correctAnswers}</td>
                            <td className="px-4 py-3 text-sm">{question.totalAnswers}</td>
                            <td className="px-4 py-3 text-sm">{question.successRate}%</td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-3 text-sm text-center">
                          No hay datos disponibles
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
