"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BookOpen,
  CheckCircle,
  FileQuestion,
  Users,
  Plus,
  TrendingUp,
  ArrowUpRight,
  Clock,
  Calendar,
  ChevronRight,
  BarChart,
  PieChart,
  Activity,
  Award,
  UserCheck,
  Zap,
  Building,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { getTrainingStats, getRecentActivity } from "@/app/actions/training-actions"
import { getDepartmentStats } from "@/app/actions/department-actions"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalTrainings: 0,
    totalEvaluations: 0,
    totalUsers: 0,
    completionRate: 0,
  })
  const [completionData, setCompletionData] = useState([])
  const [departmentData, setDepartmentData] = useState([])
  const [departmentPerformance, setDepartmentPerformance] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true)

        // Cargar estadísticas generales
        const data = await getTrainingStats()

        if (data && data.stats) {
          setStats({
            totalTrainings: Number.parseInt(data.stats.total_trainings) || 0,
            totalEvaluations: Number.parseInt(data.stats.total_evaluations) || 0,
            totalUsers: Number.parseInt(data.stats.total_users) || 0,
            completionRate: Number.parseInt(data.stats.completion_rate) || 0,
          })

          // Procesar datos de completados vs asignados
          if (data.completionData) {
            setCompletionData(
              data.completionData.map((item) => ({
                name: item.month || "",
                completadas: Number.parseInt(item.completed) || 0,
                asignadas: Number.parseInt(item.assigned) || 0,
              })),
            )
          }

          // Procesar datos de departamentos
          if (data.departmentData) {
            setDepartmentData(
              data.departmentData.map((item) => ({
                name: item.name || "",
                promedio: Number.parseInt(item.average_score) || 0,
              })),
            )
          }
        }

        try {
          // Cargar estadísticas detalladas por departamento
          const deptStats = await getDepartmentStats()
          if (deptStats && deptStats.departments) {
            setDepartmentPerformance(deptStats.departments)
          }
        } catch (deptError) {
          console.error("Error al cargar estadísticas de departamentos:", deptError)
          setDepartmentPerformance([])
        }

        try {
          // Cargar actividad reciente
          const activity = await getRecentActivity()
          if (activity) {
            setRecentActivity(activity)
          }
        } catch (activityError) {
          console.error("Error al cargar actividad reciente:", activityError)
          setRecentActivity([])
        }
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error)
        // En caso de error, establecer datos vacíos
        setStats({
          totalTrainings: 0,
          totalEvaluations: 0,
          totalUsers: 0,
          completionRate: 0,
        })
        setCompletionData([])
        setDepartmentData([])
        setDepartmentPerformance([])
        setRecentActivity([])
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  // Función para formatear la fecha relativa
  const getRelativeTime = (timestamp) => {
    if (!timestamp) return "Fecha desconocida"

    const now = new Date()
    const date = new Date(timestamp)
    const diffMs = now - date
    const diffSec = Math.floor(diffMs / 1000)
    const diffMin = Math.floor(diffSec / 60)
    const diffHour = Math.floor(diffMin / 60)
    const diffDay = Math.floor(diffHour / 24)

    if (diffDay > 0) {
      return `Hace ${diffDay} día${diffDay > 1 ? "s" : ""}`
    } else if (diffHour > 0) {
      return `Hace ${diffHour} hora${diffHour > 1 ? "s" : ""}`
    } else if (diffMin > 0) {
      return `Hace ${diffMin} minuto${diffMin > 1 ? "s" : ""}`
    } else {
      return "Hace unos segundos"
    }
  }

  // Datos para el gráfico de pastel
  const pieData = [
    { name: "Completadas", value: 63, color: "#3b82f6" },
    { name: "En progreso", value: 27, color: "#f59e0b" },
    { name: "No iniciadas", value: 10, color: "#e5e7eb" },
  ]

  // Datos para el gráfico de área
  const areaData = [
    { name: "Lun", usuarios: 120 },
    { name: "Mar", usuarios: 132 },
    { name: "Mié", usuarios: 101 },
    { name: "Jue", usuarios: 134 },
    { name: "Vie", usuarios: 190 },
    { name: "Sáb", usuarios: 30 },
    { name: "Dom", usuarios: 20 },
  ]

  // Datos para la tabla de rendimiento
  const performanceData = [
    { id: 1, name: "Ventas", completion: 92, users: 24, avg: 87 },
    { id: 2, name: "Marketing", completion: 78, users: 18, avg: 82 },
    { id: 3, name: "Recursos Humanos", completion: 95, users: 12, avg: 91 },
    { id: 4, name: "Desarrollo", completion: 88, users: 32, avg: 85 },
    { id: 5, name: "Soporte", completion: 72, users: 15, avg: 79 },
  ]

  // Datos para las capacitaciones recientes
  const recentTrainings = [
    { id: 1, title: "Introducción a la Ciberseguridad", status: "active", users: 45, completion: 68 },
    { id: 2, title: "Gestión del Tiempo", status: "completed", users: 32, completion: 100 },
    { id: 3, title: "Liderazgo Efectivo", status: "active", users: 28, completion: 42 },
  ]

  // Función para renderizar gráficos de manera segura
  const renderChart = (chartComponent) => {
    if (typeof window === "undefined") return null
    return chartComponent
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400">Bienvenido de nuevo, {loading ? "..." : "Administrador"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="hidden sm:flex">
            <Link href="/admin/reports">
              <BarChart className="mr-2 h-4 w-4" />
              Ver Reportes
            </Link>
          </Button>
          <Button asChild className="bg-blue-600 hover:bg-blue-700">
            <Link href="/admin/trainings/new">
              <Plus className="mr-2 h-4 w-4" />
              Nueva Capacitación
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="overview" className="text-sm">
            <Activity className="mr-2 h-4 w-4" />
            Resumen
          </TabsTrigger>
          <TabsTrigger value="performance" className="text-sm">
            <Award className="mr-2 h-4 w-4" />
            Rendimiento
          </TabsTrigger>
          <TabsTrigger value="departments" className="text-sm">
            <Building className="mr-2 h-4 w-4" />
            Departamentos
          </TabsTrigger>
          <TabsTrigger value="users" className="text-sm">
            <UserCheck className="mr-2 h-4 w-4" />
            Usuarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Tarjetas de estadísticas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Capacitaciones</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{stats.totalTrainings}</div>
                {loading ? (
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mt-1 dark:bg-gray-700"></div>
                ) : (
                  <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    <span>12% más que el mes pasado</span>
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Evaluaciones</CardTitle>
                <FileQuestion className="h-4 w-4 text-green-600 dark:text-green-400" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-700 dark:text-green-300">{stats.totalEvaluations}</div>
                {loading ? (
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mt-1 dark:bg-gray-700"></div>
                ) : (
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    <span>8% más que el mes pasado</span>
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Usuarios</CardTitle>
                <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">{stats.totalUsers}</div>
                {loading ? (
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mt-1 dark:bg-gray-700"></div>
                ) : (
                  <p className="text-xs text-purple-600 dark:text-purple-400 flex items-center mt-1">
                    <TrendingUp className="inline h-3 w-3 mr-1" />
                    <span>5% más que el mes pasado</span>
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
                <CardTitle className="text-sm font-medium text-amber-700 dark:text-amber-300">Finalización</CardTitle>
                <CheckCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-amber-700 dark:text-amber-300">{stats.completionRate}%</div>
                {loading ? (
                  <div className="h-4 w-24 bg-gray-200 animate-pulse rounded mt-1 dark:bg-gray-700"></div>
                ) : (
                  <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center mt-1">
                    <ArrowUpRight className="inline h-3 w-3 mr-1" />
                    <span>3% más que el mes pasado</span>
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Capacitaciones Completadas</CardTitle>
                    <CardDescription>Últimos 6 meses</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    Mensual
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                    </div>
                  ) : (
                    renderChart(
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={completionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorCompletadas" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="colorAsignadas" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
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
                          <Area
                            type="monotone"
                            dataKey="completadas"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorCompletadas)"
                            strokeWidth={2}
                          />
                          <Area
                            type="monotone"
                            dataKey="asignadas"
                            stroke="#94a3b8"
                            fillOpacity={1}
                            fill="url(#colorAsignadas)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>,
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Rendimiento por Departamento</CardTitle>
                    <CardDescription>Promedio de puntuación</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    <BarChart className="mr-1 h-3 w-3" />
                    Top 5
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {loading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
                    </div>
                  ) : (
                    renderChart(
                      <ResponsiveContainer width="100%" height="100%">
                        <ReBarChart data={departmentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
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
                          <Bar dataKey="promedio" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                        </ReBarChart>
                      </ResponsiveContainer>,
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Actividad reciente */}
            <Card className="md:col-span-2 border-none shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Actividad Reciente</CardTitle>
                    <CardDescription>Últimas acciones en el sistema</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    Ver todo
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    {loading ? (
                      <div className="space-y-6">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <div className="rounded-full p-2 w-10 h-10 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                            <div className="space-y-2 flex-1">
                              <div className="h-4 bg-gray-200 rounded w-3/4 dark:bg-gray-700 animate-pulse"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/2 dark:bg-gray-700 animate-pulse"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : recentActivity && recentActivity.length > 0 ? (
                      recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4 group">
                          <div
                            className={`rounded-full p-2 ${
                              activity.activity_type === "training_created"
                                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                            }`}
                          >
                            {activity.activity_type === "training_created" ? (
                              <BookOpen className="h-5 w-5" />
                            ) : (
                              <CheckCircle className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium group-hover:text-blue-600 transition-colors dark:group-hover:text-blue-400">
                                {activity.activity_type === "training_created"
                                  ? `Nueva capacitación creada: "${activity.title || "Sin título"}"`
                                  : `Evaluación completada: "${activity.title || "Sin título"}"`}
                              </p>
                              <Badge variant="outline" className="text-xs">
                                {getRelativeTime(activity.timestamp)}
                              </Badge>
                            </div>
                            <div className="flex items-center mt-1">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback className="text-xs bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                  {activity.user_name
                                    ? activity.user_name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()
                                    : "U"}
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {activity.user_name || "Usuario"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                          <Activity className="h-6 w-6" />
                        </div>
                        <h3 className="mt-4 text-lg font-medium">No hay actividad reciente</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Las actividades recientes aparecerán aquí cuando ocurran.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Distribución de capacitaciones */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Distribución</CardTitle>
                    <CardDescription>Estado de capacitaciones</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    <PieChart className="mr-1 h-3 w-3" />
                    Global
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] flex items-center justify-center">
                  {renderChart(
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.375rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          }}
                        />
                      </RePieChart>
                    </ResponsiveContainer>,
                  )}
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  {pieData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="text-2xl font-bold">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Capacitaciones recientes */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Capacitaciones Recientes</CardTitle>
                  <CardDescription>Últimas capacitaciones creadas o actualizadas</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm" className="gap-1">
                  <Link href="/admin/trainings">
                    Ver todas
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                {recentTrainings.map((training) => (
                  <Card key={training.id} className="overflow-hidden group hover:shadow-md transition-all">
                    <CardHeader className="p-0">
                      <div className="h-3 w-full bg-blue-600"></div>
                      <div className="p-4">
                        <Badge
                          className={
                            training.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                          }
                        >
                          {training.status === "active" ? "Activa" : "Completada"}
                        </Badge>
                        <CardTitle className="mt-2 text-lg group-hover:text-blue-600 transition-colors">
                          {training.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{training.users} usuarios</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>{training.completion}% completado</span>
                        </div>
                      </div>
                      <Progress value={training.completion} className="h-2" />
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button asChild variant="ghost" size="sm" className="w-full gap-1 justify-center">
                        <Link href={`/admin/trainings/${training.id}`}>
                          Ver detalles
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Actividad de Usuarios</CardTitle>
                    <CardDescription>Usuarios activos por día</CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300"
                  >
                    <Calendar className="mr-1 h-3 w-3" />
                    Semanal
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {renderChart(
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={areaData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                        <YAxis stroke="#6b7280" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.375rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="usuarios"
                          stroke="#8b5cf6"
                          fillOpacity={1}
                          fill="url(#colorUsuarios)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>,
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Rendimiento por Departamento</CardTitle>
                    <CardDescription>Tasa de finalización y puntuación</CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    Ver reporte
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {performanceData.map((dept) => (
                    <div key={dept.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                          <span className="font-medium">{dept.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{dept.users} usuarios</span>
                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400">
                            {dept.avg}% promedio
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={dept.completion} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{dept.completion}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Estadísticas de Capacitación</CardTitle>
                  <CardDescription>Métricas clave de rendimiento</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="rounded-full p-3 bg-blue-100 text-blue-600 mb-4 dark:bg-blue-900/30 dark:text-blue-400">
                      <Zap className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Tiempo Promedio</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tiempo para completar</p>
                    <p className="text-3xl font-bold">42 min</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="rounded-full p-3 bg-green-100 text-green-600 mb-4 dark:bg-green-900/30 dark:text-green-400">
                      <Award className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Puntuación Media</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">En evaluaciones</p>
                    <p className="text-3xl font-bold">84%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="rounded-full p-3 bg-amber-100 text-amber-600 mb-4 dark:bg-amber-900/30 dark:text-amber-400">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Tasa de Aprobación</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Primera evaluación</p>
                    <p className="text-3xl font-bold">78%</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Rendimiento por Departamento</CardTitle>
              <CardDescription>Análisis detallado del rendimiento de cada departamento</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                        <div className="h-2 bg-gray-200 rounded w-full animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {departmentPerformance.map((dept) => (
                    <div key={dept.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <Building className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{dept.name}</h3>
                            <p className="text-sm text-muted-foreground">{dept.user_count} usuarios</p>
                          </div>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/departments/${dept.id}`}>Ver detalle</Link>
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Puntuación promedio</span>
                            <span className="font-medium">{dept.average_score}%</span>
                          </div>
                          <Progress value={dept.average_score} className="h-2" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Tasa de finalización</span>
                            <span className="font-medium">{dept.completion_rate}%</span>
                          </div>
                          <Progress value={dept.completion_rate} className="h-2" />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Capacitaciones asignadas</span>
                            <span className="font-medium">{dept.training_count}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              {dept.completed_count} completadas
                            </Badge>
                            <Badge variant="outline" className="bg-amber-100 text-amber-800">
                              {dept.in_progress_count} en progreso
                            </Badge>
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">
                              {dept.pending_count} pendientes
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/departments">Ver todos los departamentos</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-none shadow-md md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Usuarios Más Activos</CardTitle>
                    <CardDescription>Basado en capacitaciones completadas</CardDescription>
                  </div>
                  <Button asChild variant="outline" size="sm" className="gap-1">
                    <Link href="/admin/users">
                      Ver todos
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { id: 1, name: "Ana Martínez", role: "Gerente", department: "Ventas", completed: 12, image: null },
                    {
                      id: 2,
                      name: "Carlos Rodríguez",
                      role: "Analista",
                      department: "Marketing",
                      completed: 10,
                      image: null,
                    },
                    {
                      id: 3,
                      name: "Laura Sánchez",
                      role: "Desarrollador",
                      department: "Tecnología",
                      completed: 9,
                      image: null,
                    },
                    {
                      id: 4,
                      name: "Miguel Torres",
                      role: "Supervisor",
                      department: "Recursos Humanos",
                      completed: 8,
                      image: null,
                    },
                    {
                      id: 5,
                      name: "Sofía Vargas",
                      role: "Diseñador",
                      department: "Marketing",
                      completed: 7,
                      image: null,
                    },
                  ].map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between group hover:bg-gray-50 p-2 rounded-md transition-colors dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium group-hover:text-blue-600 transition-colors dark:group-hover:text-blue-400">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.role} • {user.department}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
                          {user.completed} completadas
                        </Badge>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Distribución por Rol</CardTitle>
                    <CardDescription>Usuarios por rol</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  {renderChart(
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={[
                            { name: "Gerentes", value: 15, color: "#3b82f6" },
                            { name: "Analistas", value: 25, color: "#8b5cf6" },
                            { name: "Desarrolladores", value: 30, color: "#10b981" },
                            { name: "Diseñadores", value: 20, color: "#f59e0b" },
                            { name: "Otros", value: 10, color: "#6b7280" },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={0}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {[
                            { name: "Gerentes", value: 15, color: "#3b82f6" },
                            { name: "Analistas", value: 25, color: "#8b5cf6" },
                            { name: "Desarrolladores", value: 30, color: "#10b981" },
                            { name: "Diseñadores", value: 20, color: "#f59e0b" },
                            { name: "Otros", value: 10, color: "#6b7280" },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "0.375rem",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                          }}
                        />
                      </RePieChart>
                    </ResponsiveContainer>,
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  {[
                    { name: "Gerentes", value: 15, color: "#3b82f6" },
                    { name: "Analistas", value: 25, color: "#8b5cf6" },
                    { name: "Desarrolladores", value: 30, color: "#10b981" },
                    { name: "Diseñadores", value: 20, color: "#f59e0b" },
                    { name: "Otros", value: 10, color: "#6b7280" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Nuevos Usuarios</CardTitle>
                  <CardDescription>Usuarios registrados recientemente</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                {[
                  {
                    id: 1,
                    name: "Javier Méndez",
                    role: "Analista",
                    department: "Finanzas",
                    joined: "2 días atrás",
                    image: null,
                  },
                  {
                    id: 2,
                    name: "Elena Gómez",
                    role: "Diseñador",
                    department: "Marketing",
                    joined: "3 días atrás",
                    image: null,
                  },
                  {
                    id: 3,
                    name: "Roberto Díaz",
                    role: "Desarrollador",
                    department: "Tecnología",
                    joined: "5 días atrás",
                    image: null,
                  },
                  {
                    id: 4,
                    name: "Patricia Vega",
                    role: "Gerente",
                    department: "Ventas",
                    joined: "1 semana atrás",
                    image: null,
                  },
                ].map((user) => (
                  <Card key={user.id} className="overflow-hidden group hover:shadow-md transition-all">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <Avatar className="h-16 w-16 mb-4">
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-xl dark:bg-blue-900/30 dark:text-blue-400">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="font-medium group-hover:text-blue-600 transition-colors">{user.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{user.role}</p>
                      <Badge variant="outline" className="mb-4">
                        {user.department}
                      </Badge>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Se unió {user.joined}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
