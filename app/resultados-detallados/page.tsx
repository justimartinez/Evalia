"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  BarChart3,
  CheckCircle,
  Clock,
  Trophy,
  AlertCircle,
  UserCircle,
  Building2,
  Star,
  TrendingDown,
  MapPin,
  Users,
  Globe,
  BookOpen,
  FileText,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTrainingResults, type TrainingResults } from "@/contexts/training-context"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

// Datos de ejemplo para sucursales
const branchData = {
  todas: {
    name: "Todas las Sucursales",
    averageScore: 76, // Promedio de todas las sucursales
    employeesEvaluated: 135, // Suma de todas las sucursales
    completionRate: 82, // Promedio de todas las sucursales
    departmentScores: [
      { name: "Atención", puntaje: 74 }, // Promedio de todas las sucursales
      { name: "Ventas", puntaje: 69 }, // Promedio de todas las sucursales
      { name: "Sistemas", puntaje: 84 }, // Promedio de todas las sucursales
      { name: "Marketing", puntaje: 71 }, // Promedio de todas las sucursales
    ],
    topEmployee: {
      name: "Ana Gómez",
      position: "Líder de Desarrollo (Norte)",
      score: 99,
      photo: "/diverse-woman-portrait.png",
    },
    bottomEmployee: {
      name: "Sofía López",
      position: "Representante de Ventas (Sur)",
      score: 48,
      photo: "/diverse-woman-portrait.png",
    },
    monthlyTrend: [
      { month: "Ene", promedio: 65 },
      { month: "Feb", promedio: 67 },
      { month: "Mar", promedio: 70 },
      { month: "Abr", promedio: 72 },
      { month: "May", promedio: 74 },
      { month: "Jun", promedio: 76 },
    ],
    skillsRadar: [
      { subject: "Conocimiento Técnico", A: 83, fullMark: 100 },
      { subject: "Comunicación", A: 74, fullMark: 100 },
      { subject: "Resolución de Problemas", A: 78, fullMark: 100 },
      { subject: "Trabajo en Equipo", A: 80, fullMark: 100 },
      { subject: "Atención al Detalle", A: 68, fullMark: 100 },
      { subject: "Adaptabilidad", A: 75, fullMark: 100 },
    ],
    branchComparison: [
      { name: "Centro", puntaje: 78 },
      { name: "Norte", puntaje: 82 },
      { name: "Sur", puntaje: 70 },
      { name: "Este", puntaje: 75 },
    ],
  },
  centro: {
    name: "Sucursal Centro",
    averageScore: 78,
    employeesEvaluated: 42,
    completionRate: 84,
    departmentScores: [
      { name: "Atención", puntaje: 75 },
      { name: "Ventas", puntaje: 68 },
      { name: "Sistemas", puntaje: 85 },
      { name: "Marketing", puntaje: 72 },
    ],
    topEmployee: {
      name: "Carlos Rodríguez",
      position: "Analista de Sistemas",
      score: 98,
      photo: "/diverse-group.png",
    },
    bottomEmployee: {
      name: "Laura Martínez",
      position: "Ejecutiva de Ventas",
      score: 52,
      photo: "/diverse-group.png",
    },
    monthlyTrend: [
      { month: "Ene", promedio: 65 },
      { month: "Feb", promedio: 68 },
      { month: "Mar", promedio: 70 },
      { month: "Abr", promedio: 72 },
      { month: "May", promedio: 74 },
      { month: "Jun", promedio: 78 },
    ],
    skillsRadar: [
      { subject: "Conocimiento Técnico", A: 85, fullMark: 100 },
      { subject: "Comunicación", A: 75, fullMark: 100 },
      { subject: "Resolución de Problemas", A: 80, fullMark: 100 },
      { subject: "Trabajo en Equipo", A: 82, fullMark: 100 },
      { subject: "Atención al Detalle", A: 70, fullMark: 100 },
      { subject: "Adaptabilidad", A: 78, fullMark: 100 },
    ],
  },
  norte: {
    name: "Sucursal Norte",
    averageScore: 82,
    employeesEvaluated: 35,
    completionRate: 90,
    departmentScores: [
      { name: "Atención", puntaje: 80 },
      { name: "Ventas", puntaje: 75 },
      { name: "Sistemas", puntaje: 90 },
      { name: "Marketing", puntaje: 78 },
    ],
    topEmployee: {
      name: "Ana Gómez",
      position: "Líder de Desarrollo",
      score: 99,
      photo: "/diverse-woman-portrait.png",
    },
    bottomEmployee: {
      name: "Pedro Sánchez",
      position: "Asistente de Marketing",
      score: 60,
      photo: "/thoughtful-man.png",
    },
    monthlyTrend: [
      { month: "Ene", promedio: 70 },
      { month: "Feb", promedio: 72 },
      { month: "Mar", promedio: 75 },
      { month: "Abr", promedio: 78 },
      { month: "May", promedio: 80 },
      { month: "Jun", promedio: 82 },
    ],
    skillsRadar: [
      { subject: "Conocimiento Técnico", A: 90, fullMark: 100 },
      { subject: "Comunicación", A: 82, fullMark: 100 },
      { subject: "Resolución de Problemas", A: 85, fullMark: 100 },
      { subject: "Trabajo en Equipo", A: 88, fullMark: 100 },
      { subject: "Atención al Detalle", A: 75, fullMark: 100 },
      { subject: "Adaptabilidad", A: 80, fullMark: 100 },
    ],
  },
  sur: {
    name: "Sucursal Sur",
    averageScore: 70,
    employeesEvaluated: 28,
    completionRate: 75,
    departmentScores: [
      { name: "Atención", puntaje: 68 },
      { name: "Ventas", puntaje: 62 },
      { name: "Sistemas", puntaje: 80 },
      { name: "Marketing", puntaje: 65 },
    ],
    topEmployee: {
      name: "Miguel Torres",
      position: "Ingeniero de Sistemas",
      score: 95,
      photo: "/diverse-engineers-meeting.png",
    },
    bottomEmployee: {
      name: "Sofía López",
      position: "Representante de Ventas",
      score: 48,
      photo: "/diverse-woman-portrait.png",
    },
    monthlyTrend: [
      { month: "Ene", promedio: 60 },
      { month: "Feb", promedio: 62 },
      { month: "Mar", promedio: 65 },
      { month: "Abr", promedio: 67 },
      { month: "May", promedio: 68 },
      { month: "Jun", promedio: 70 },
    ],
    skillsRadar: [
      { subject: "Conocimiento Técnico", A: 75, fullMark: 100 },
      { subject: "Comunicación", A: 65, fullMark: 100 },
      { subject: "Resolución de Problemas", A: 70, fullMark: 100 },
      { subject: "Trabajo en Equipo", A: 72, fullMark: 100 },
      { subject: "Atención al Detalle", A: 60, fullMark: 100 },
      { subject: "Adaptabilidad", A: 68, fullMark: 100 },
    ],
  },
  este: {
    name: "Sucursal Este",
    averageScore: 75,
    employeesEvaluated: 30,
    completionRate: 80,
    departmentScores: [
      { name: "Atención", puntaje: 72 },
      { name: "Ventas", puntaje: 70 },
      { name: "Sistemas", puntaje: 82 },
      { name: "Marketing", puntaje: 70 },
    ],
    topEmployee: {
      name: "Javier Méndez",
      position: "Analista de Datos",
      score: 96,
      photo: "/data-analyst-workspace.png",
    },
    bottomEmployee: {
      name: "Lucía Fernández",
      position: "Asistente de Atención",
      score: 55,
      photo: "/helpful-ai-assistant.png",
    },
    monthlyTrend: [
      { month: "Ene", promedio: 65 },
      { month: "Feb", promedio: 67 },
      { month: "Mar", promedio: 70 },
      { month: "Abr", promedio: 72 },
      { month: "May", promedio: 73 },
      { month: "Jun", promedio: 75 },
    ],
    skillsRadar: [
      { subject: "Conocimiento Técnico", A: 80, fullMark: 100 },
      { subject: "Comunicación", A: 72, fullMark: 100 },
      { subject: "Resolución de Problemas", A: 75, fullMark: 100 },
      { subject: "Trabajo en Equipo", A: 78, fullMark: 100 },
      { subject: "Atención al Detalle", A: 68, fullMark: 100 },
      { subject: "Adaptabilidad", A: 74, fullMark: 100 },
    ],
  },
}

// Datos de ejemplo para capacitaciones
const trainingModules = [
  {
    id: 1,
    name: "Atención al Cliente",
    totalEmployees: 135,
    approved: 98,
    failed: 37,
    avgScore: 76,
    completionRate: 82,
  },
  {
    id: 2,
    name: "Protocolos de Seguridad",
    totalEmployees: 120,
    approved: 105,
    failed: 15,
    avgScore: 84,
    completionRate: 90,
  },
  { id: 3, name: "Ventas Avanzadas", totalEmployees: 85, approved: 62, failed: 23, avgScore: 72, completionRate: 78 },
  { id: 4, name: "Liderazgo y Gestión", totalEmployees: 45, approved: 38, failed: 7, avgScore: 88, completionRate: 95 },
  {
    id: 5,
    name: "Herramientas Digitales",
    totalEmployees: 110,
    approved: 89,
    failed: 21,
    avgScore: 79,
    completionRate: 85,
  },
]

// Datos de ejemplo para empleados por capacitación
const employeesByTraining = {
  1: [
    {
      id: 1,
      name: "Ana Gómez",
      position: "Atención al Cliente",
      branch: "Norte",
      score: 92,
      status: "Aprobado",
      completionTime: "45 min",
      attempts: 1,
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      position: "Supervisor",
      branch: "Centro",
      score: 88,
      status: "Aprobado",
      completionTime: "38 min",
      attempts: 1,
    },
    {
      id: 3,
      name: "Sofía López",
      position: "Atención al Cliente",
      branch: "Sur",
      score: 48,
      status: "Desaprobado",
      completionTime: "62 min",
      attempts: 1,
    },
    {
      id: 4,
      name: "Miguel Torres",
      position: "Atención al Cliente",
      branch: "Este",
      score: 76,
      status: "Aprobado",
      completionTime: "52 min",
      attempts: 2,
    },
    {
      id: 5,
      name: "Laura Martínez",
      position: "Supervisora",
      branch: "Centro",
      score: 52,
      status: "Desaprobado",
      completionTime: "58 min",
      attempts: 1,
    },
    {
      id: 6,
      name: "Pedro Sánchez",
      position: "Atención al Cliente",
      branch: "Norte",
      score: 84,
      status: "Aprobado",
      completionTime: "42 min",
      attempts: 1,
    },
    {
      id: 7,
      name: "Javier Méndez",
      position: "Atención al Cliente",
      branch: "Este",
      score: 96,
      status: "Aprobado",
      completionTime: "35 min",
      attempts: 1,
    },
    {
      id: 8,
      name: "Lucía Fernández",
      position: "Atención al Cliente",
      branch: "Sur",
      score: 55,
      status: "Desaprobado",
      completionTime: "65 min",
      attempts: 2,
    },
    {
      id: 9,
      name: "Roberto Díaz",
      position: "Supervisor",
      branch: "Norte",
      score: 90,
      status: "Aprobado",
      completionTime: "40 min",
      attempts: 1,
    },
    {
      id: 10,
      name: "Carmen Vega",
      position: "Atención al Cliente",
      branch: "Centro",
      score: 78,
      status: "Aprobado",
      completionTime: "48 min",
      attempts: 1,
    },
    {
      id: 11,
      name: "Fernando Ruiz",
      position: "Atención al Cliente",
      branch: "Sur",
      score: 62,
      status: "Aprobado",
      completionTime: "55 min",
      attempts: 1,
    },
    {
      id: 12,
      name: "Daniela Morales",
      position: "Supervisora",
      branch: "Este",
      score: 94,
      status: "Aprobado",
      completionTime: "37 min",
      attempts: 1,
    },
  ],
  2: [
    {
      id: 1,
      name: "Ana Gómez",
      position: "Atención al Cliente",
      branch: "Norte",
      score: 88,
      status: "Aprobado",
      completionTime: "50 min",
      attempts: 1,
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      position: "Supervisor",
      branch: "Centro",
      score: 92,
      status: "Aprobado",
      completionTime: "42 min",
      attempts: 1,
    },
    // Más empleados para la capacitación 2...
  ],
  3: [
    {
      id: 4,
      name: "Miguel Torres",
      position: "Atención al Cliente",
      branch: "Este",
      score: 68,
      status: "Aprobado",
      completionTime: "58 min",
      attempts: 1,
    },
    {
      id: 9,
      name: "Roberto Díaz",
      position: "Supervisor",
      branch: "Norte",
      score: 86,
      status: "Aprobado",
      completionTime: "45 min",
      attempts: 1,
    },
    // Más empleados para la capacitación 3...
  ],
  // Más capacitaciones...
}

// Datos para preguntas con mayor dificultad
const difficultQuestions = [
  { id: 1, question: "¿Cuál es el protocolo correcto para manejar quejas de clientes prioritarios?", failRate: 68 },
  { id: 2, question: "¿Qué acción debe tomarse cuando un cliente solicita hablar con un supervisor?", failRate: 52 },
  { id: 3, question: "¿Cuál es el tiempo máximo de espera establecido para atención telefónica?", failRate: 45 },
]

export default function ResultadosDetallados() {
  const router = useRouter()
  const { trainingResults } = useTrainingResults()
  const [localResults, setLocalResults] = useState<TrainingResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState("todas")
  const [currentBranchData, setCurrentBranchData] = useState(branchData.todas)
  const [selectedTrainingModule, setSelectedTrainingModule] = useState(1)

  const loadResults = useCallback(() => {
    // Intentar cargar resultados desde el contexto o localStorage
    if (trainingResults) {
      console.log("Usando resultados del contexto:", trainingResults)
      setLocalResults(trainingResults)
      setLoading(false)
    } else {
      try {
        const savedResults = localStorage.getItem("trainingResults")
        if (savedResults) {
          const parsedResults = JSON.parse(savedResults)
          console.log("Usando resultados de localStorage:", parsedResults)
          setLocalResults(parsedResults)
          setLoading(false)
        } else {
          console.log("No se encontraron resultados en localStorage")
          // Redirigir después de un breve retraso
          setTimeout(() => {
            router.push("/")
          }, 1000)
        }
      } catch (error) {
        console.error("Error al cargar resultados desde localStorage:", error)
        // Redirigir después de un breve retraso
        setTimeout(() => {
          router.push("/")
        }, 1000)
      }
    }
  }, [trainingResults, router])

  useEffect(() => {
    loadResults()
    // Scroll al inicio de la página cuando se carga
    window.scrollTo(0, 0)
  }, [loadResults])

  // Actualizar los datos de la sucursal cuando cambia la selección
  useEffect(() => {
    setCurrentBranchData(branchData[selectedBranch])
  }, [selectedBranch])

  // Mostrar un mensaje de carga mientras se verifica si hay resultados
  if (loading || !localResults) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <h1 className="text-3xl font-bold mb-4">Cargando resultados...</h1>
          <p className="mb-6">Si no se cargan los resultados, debes completar el entrenamiento primero.</p>
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Datos para el gráfico de barras del empleado basados en los resultados reales
  const employeeData = [
    { name: "Atención al Cliente", puntaje: localResults.score, promedio: 75 },
    { name: "Protocolos", puntaje: 82, promedio: 70 },
    { name: "Ventas", puntaje: 65, promedio: 68 },
    { name: "Sistemas", puntaje: 90, promedio: 85 },
  ]

  // Datos para el gráfico circular de distribución de resultados
  const distributionData = [
    { name: "Excelente (90-100%)", value: 15 },
    { name: "Bueno (75-89%)", value: 45 },
    { name: "Regular (60-74%)", value: 30 },
    { name: "Insuficiente (<60%)", value: 10 },
  ]

  // Datos para el gráfico de completitud de capacitación
  const completionData = [
    { name: "Completado", value: 78 },
    { name: "Pendiente", value: 22 },
  ]

  // Datos para el gráfico de tiempo promedio
  const timeData = [
    { name: "Atención", tiempo: 45 },
    { name: "Ventas", tiempo: 60 },
    { name: "Sistemas", tiempo: 35 },
    { name: "Marketing", tiempo: 50 },
  ]

  const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#ef4444"]
  const COMPLETION_COLORS = ["#3b82f6", "#94a3b8"]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Resultados Detallados de Entrenamiento</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            Análisis completo de tu desempeño en el módulo de Atención al Cliente
          </p>
        </motion.div>

        <Tabs defaultValue="employee" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="employee" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Resultados del Empleado
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Tablero Administrativo
            </TabsTrigger>
            <TabsTrigger value="training-report" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Reporte por Capacitación
            </TabsTrigger>
          </TabsList>

          <TabsContent value="employee" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-400" />
                    Puntuación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">{localResults.score}%</div>
                  <p className="text-blue-200 text-sm">
                    {localResults.score >= 80
                      ? "Excelente rendimiento!"
                      : localResults.score >= 60
                        ? "Buen trabajo, sigue mejorando"
                        : "Necesita mejorar"}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Correctas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">{localResults.correct}</div>
                  <p className="text-blue-200 text-sm">de {localResults.total} preguntas</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    Incorrectas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">{localResults.incorrect}</div>
                  <p className="text-blue-200 text-sm">de {localResults.total} preguntas</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Comparativa de Rendimiento</CardTitle>
                <CardDescription className="text-blue-200">Tu rendimiento comparado con el promedio</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    puntaje: {
                      label: "Tu puntaje",
                      color: "hsl(var(--chart-1))",
                    },
                    promedio: {
                      label: "Promedio",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={employeeData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey="puntaje" fill="var(--color-puntaje)" />
                      <Bar dataKey="promedio" fill="var(--color-promedio)" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    Tiempo de Respuesta
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    Tiempo promedio por pregunta comparado con otros usuarios
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { pregunta: "P1", tiempo: 35, promedio: 45 },
                        { pregunta: "P2", tiempo: 28, promedio: 40 },
                        { pregunta: "P3", tiempo: 42, promedio: 38 },
                        { pregunta: "P4", tiempo: 30, promedio: 42 },
                        { pregunta: "P5", tiempo: 25, promedio: 36 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="pregunta" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip
                        formatter={(value) => [`${value} seg`, ""]}
                        contentStyle={{
                          backgroundColor: "rgba(30, 41, 59, 0.9)",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                        labelStyle={{ color: "white" }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="tiempo"
                        name="Tu tiempo"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="promedio"
                        name="Promedio"
                        stroke="#94a3b8"
                        fill="#94a3b8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-400" />
                    Progreso Histórico
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    Evolución de tu rendimiento en los últimos entrenamientos
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={[
                        { entrenamiento: "Ene", puntaje: 65 },
                        { entrenamiento: "Feb", puntaje: 70 },
                        { entrenamiento: "Mar", puntaje: 68 },
                        { entrenamiento: "Abr", puntaje: 72 },
                        { entrenamiento: "May", puntaje: localResults.score },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="entrenamiento" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" domain={[60, 100]} />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Puntaje"]}
                        contentStyle={{
                          backgroundColor: "rgba(30, 41, 59, 0.9)",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                        labelStyle={{ color: "white" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="puntaje"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#22c55e", stroke: "#22c55e" }}
                        activeDot={{ r: 6, fill: "#22c55e", stroke: "#fff" }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Análisis de Respuestas</CardTitle>
                <CardDescription className="text-blue-200">
                  Detalle de tus respuestas en el entrenamiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {localResults.questions.map((question, index) => {
                    const userAnswer = localResults.answers[question.id]
                    const isCorrect = userAnswer?.isCorrect || false

                    return (
                      <div
                        key={question.id}
                        className={`p-4 ${isCorrect ? "bg-green-500/10 border border-green-500/30" : "bg-red-500/10 border border-red-500/30"} rounded-lg`}
                      >
                        <h3 className="font-medium text-white flex items-center gap-2">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-400" />
                          )}
                          Pregunta {index + 1}: {question.question}
                        </h3>
                        <p className="text-blue-200 mt-2">
                          <span className="font-medium">Tu respuesta ({isCorrect ? "Correcta" : "Incorrecta"}):</span>{" "}
                          {userAnswer?.answer}
                        </p>
                        {!isCorrect && (
                          <p className="text-green-400 mt-1">
                            <span className="font-medium">Respuesta correcta:</span> {question.correctAnswer}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <h3 className="text-white font-medium mb-4">Recomendaciones de mejora</h3>
              <ul className="space-y-3 text-blue-100">
                {localResults.score < 80 && (
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-500/30 text-blue-200 rounded-full h-5 w-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>
                      Revisa los protocolos de atención al cliente. Recuerda que la empatía y la escucha activa son
                      fundamentales.
                    </span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="bg-blue-500/30 text-blue-200 rounded-full h-5 w-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    {localResults.score < 80 ? "3" : "2"}
                  </span>
                  <span>
                    Programa una sesión de capacitación con tu supervisor para reforzar los conceptos de atención al
                    cliente.
                  </span>
                </li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            {/* Selector de sucursal */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-medium text-white">Seleccionar Sucursal</h3>
              </div>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger className="w-full md:w-[300px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Seleccionar sucursal" />
                </SelectTrigger>
                <SelectContent className="bg-blue-900 border-white/20">
                  <SelectItem value="todas" className="text-white hover:bg-blue-800 flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Todas las Sucursales
                  </SelectItem>
                  <SelectItem value="centro" className="text-white hover:bg-blue-800">
                    Sucursal Centro
                  </SelectItem>
                  <SelectItem value="norte" className="text-white hover:bg-blue-800">
                    Sucursal Norte
                  </SelectItem>
                  <SelectItem value="sur" className="text-white hover:bg-blue-800">
                    Sucursal Sur
                  </SelectItem>
                  <SelectItem value="este" className="text-white hover:bg-blue-800">
                    Sucursal Este
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Promedio General</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">{currentBranchData.averageScore}%</div>
                  <p className="text-blue-200 text-sm">
                    {currentBranchData.averageScore > 75 ? "+5% vs mes anterior" : "+2% vs mes anterior"}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Empleados Evaluados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">{currentBranchData.employeesEvaluated}</div>
                  <p className="text-blue-200 text-sm">de {currentBranchData.employeesEvaluated + 8} totales</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Mejor Departamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold text-white">Sistemas</div>
                  <p className="text-blue-200 text-sm">{currentBranchData.departmentScores[2].puntaje}% promedio</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Completitud</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-white">{currentBranchData.completionRate}%</div>
                  <p className="text-blue-200 text-sm">de capacitaciones completadas</p>
                </CardContent>
              </Card>
            </div>

            {/* Empleados destacados */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Card className="bg-gradient-to-br from-yellow-900/40 to-yellow-800/40 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    Empleado con Mejor Rendimiento
                  </CardTitle>
                  <CardDescription className="text-yellow-200">
                    Destacado por su excelente desempeño en las evaluaciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-full overflow-hidden">
                        <img
                          src={currentBranchData.topEmployee.photo || "/placeholder.svg"}
                          alt={currentBranchData.topEmployee.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                        <Star className="h-3 w-3 text-white" fill="white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{currentBranchData.topEmployee.name}</h3>
                      <p className="text-yellow-200 text-sm">{currentBranchData.topEmployee.position}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-sm font-medium">
                          {currentBranchData.topEmployee.score}% puntuación
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-900/40 to-red-800/40 border-red-500/30">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-400" />
                    Empleado con Menor Rendimiento
                  </CardTitle>
                  <CardDescription className="text-red-200">Requiere atención y capacitación adicional</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden">
                      <img
                        src={currentBranchData.bottomEmployee.photo || "/placeholder.svg"}
                        alt={currentBranchData.bottomEmployee.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{currentBranchData.bottomEmployee.name}</h3>
                      <p className="text-red-200 text-sm">{currentBranchData.bottomEmployee.position}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-sm font-medium">
                          {currentBranchData.bottomEmployee.score}% puntuación
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-red-500/20 pt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full border-red-500/30 text-red-300 hover:bg-red-500/20"
                  >
                    Programar capacitación
                  </Button>
                </CardFooter>
              </Card>
            </div>

            {/* Gráfico de comparación de sucursales (solo visible cuando se selecciona "Todas las sucursales") */}
            {selectedBranch === "todas" && (
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-400" />
                    Comparativa de Sucursales
                  </CardTitle>
                  <CardDescription className="text-blue-200">Rendimiento promedio por sucursal</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={currentBranchData.branchComparison}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        barSize={40}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.8)" }} />
                        <YAxis
                          stroke="rgba(255,255,255,0.5)"
                          domain={[0, 100]}
                          tick={{ fill: "rgba(255,255,255,0.8)" }}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Puntaje"]}
                          contentStyle={{
                            backgroundColor: "rgba(30, 41, 59, 0.9)",
                            border: "1px solid rgba(255,255,255,0.2)",
                          }}
                          labelStyle={{ color: "white" }}
                        />
                        <Bar
                          dataKey="puntaje"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                          label={{
                            position: "top",
                            fill: "rgba(255,255,255,0.8)",
                            formatter: (value) => `${value}%`,
                          }}
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Rendimiento por Departamento</CardTitle>
                  <CardDescription className="text-blue-200">
                    Puntuación promedio por área en {currentBranchData.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <div className="h-full w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={currentBranchData.departmentScores}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        barSize={40}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.8)" }} />
                        <YAxis
                          stroke="rgba(255,255,255,0.5)"
                          domain={[0, 100]}
                          tick={{ fill: "rgba(255,255,255,0.8)" }}
                        />
                        <Tooltip
                          formatter={(value) => [`${value}%`, "Puntaje"]}
                          contentStyle={{
                            backgroundColor: "rgba(30, 41, 59, 0.9)",
                            border: "1px solid rgba(255,255,255,0.2)",
                          }}
                          labelStyle={{ color: "white" }}
                        />
                        <Bar
                          dataKey="puntaje"
                          fill="#3b82f6"
                          radius={[4, 4, 0, 0]}
                          label={{
                            position: "top",
                            fill: "rgba(255,255,255,0.8)",
                            formatter: (value) => `${value}%`,
                          }}
                        />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Tendencia Mensual</CardTitle>
                  <CardDescription className="text-blue-200">
                    Evolución del rendimiento en {currentBranchData.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart
                      data={currentBranchData.monthlyTrend}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.8)" }} />
                      <YAxis
                        stroke="rgba(255,255,255,0.5)"
                        domain={[50, 100]}
                        tick={{ fill: "rgba(255,255,255,0.8)" }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Promedio"]}
                        contentStyle={{
                          backgroundColor: "rgba(30, 41, 59, 0.9)",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                        labelStyle={{ color: "white" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="promedio"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#3b82f6", stroke: "#3b82f6" }}
                        activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff" }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-400" />
                    Distribución de Personal
                  </CardTitle>
                  <CardDescription className="text-blue-200">
                    Cantidad de empleados por departamento en {currentBranchData.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={[
                          { name: "Atención", value: 12 },
                          { name: "Ventas", value: 15 },
                          { name: "Sistemas", value: 8 },
                          { name: "Marketing", value: 7 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                      <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Análisis de Habilidades</CardTitle>
                  <CardDescription className="text-blue-200">
                    Evaluación de competencias en {currentBranchData.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={currentBranchData.skillsRadar}>
                      <PolarGrid stroke="rgba(255,255,255,0.2)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "rgba(255,255,255,0.8)" }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "rgba(255,255,255,0.8)" }} />
                      <Radar name="Habilidades" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Nivel"]}
                        contentStyle={{
                          backgroundColor: "rgba(30, 41, 59, 0.9)",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                        labelStyle={{ color: "white" }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Acciones Recomendadas para {currentBranchData.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="bg-blue-500/30 text-blue-200 rounded-full h-6 w-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        {currentBranchData.averageScore < 75
                          ? "Capacitación adicional para el departamento de Ventas"
                          : "Reforzar conocimientos en el departamento de Ventas"}
                      </h4>
                      <p className="text-sm text-blue-200 mt-1">
                        {currentBranchData.averageScore < 75
                          ? "El rendimiento está por debajo del objetivo del 75%. Programar sesiones de refuerzo."
                          : "Aunque el rendimiento es bueno, hay oportunidades de mejora. Programar sesiones de actualización."}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="bg-green-500/30 text-green-200 rounded-full h-6 w-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Reconocer al equipo de Sistemas</h4>
                      <p className="text-sm text-blue-200 mt-1">
                        Mantienen el mejor rendimiento. Considerar incentivos para mantener la motivación.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <div className="bg-orange-500/30 text-orange-200 rounded-full h-6 w-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Actualizar materiales de capacitación</h4>
                      <p className="text-sm text-blue-200 mt-1">
                        Los temas relacionados con protocolos de atención muestran resultados inconsistentes. Revisar y
                        actualizar contenidos.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="training-report" className="space-y-4">
            {/* Selector de módulo de capacitación */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
                <h3 className="text-lg font-medium text-white">Seleccionar Módulo de Capacitación</h3>
              </div>
              <Select
                value={selectedTrainingModule.toString()}
                onValueChange={(value) => setSelectedTrainingModule(Number.parseInt(value))}
              >
                <SelectTrigger className="w-full md:w-[400px] bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Seleccionar módulo de capacitación" />
                </SelectTrigger>
                <SelectContent className="bg-blue-900 border-white/20">
                  {trainingModules.map((module) => (
                    <SelectItem key={module.id} value={module.id.toString()} className="text-white hover:bg-blue-800">
                      {module.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* KPIs del módulo seleccionado */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Total Empleados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {trainingModules.find((m) => m.id === selectedTrainingModule)?.totalEmployees || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Aprobados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">
                    {trainingModules.find((m) => m.id === selectedTrainingModule)?.approved || 0}
                  </div>
                  <p className="text-blue-200 text-sm">
                    {Math.round(
                      ((trainingModules.find((m) => m.id === selectedTrainingModule)?.approved || 0) /
                        (trainingModules.find((m) => m.id === selectedTrainingModule)?.totalEmployees || 1)) *
                        100,
                    )}
                    % del total
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Desaprobados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-400">
                    {trainingModules.find((m) => m.id === selectedTrainingModule)?.failed || 0}
                  </div>
                  <p className="text-blue-200 text-sm">
                    {Math.round(
                      ((trainingModules.find((m) => m.id === selectedTrainingModule)?.failed || 0) /
                        (trainingModules.find((m) => m.id === selectedTrainingModule)?.totalEmployees || 1)) *
                        100,
                    )}
                    % del total
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {trainingModules.find((m) => m.id === selectedTrainingModule)?.avgScore || 0}%
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Completitud</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white">
                    {trainingModules.find((m) => m.id === selectedTrainingModule)?.completionRate || 0}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Gráfico de distribución de puntajes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Distribución de Puntajes</CardTitle>
                  <CardDescription className="text-blue-200">
                    Cantidad de empleados por rango de puntaje
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { range: "90-100", count: 25 },
                        { range: "80-89", count: 42 },
                        { range: "70-79", count: 31 },
                        { range: "60-69", count: 18 },
                        { range: "< 60", count: 19 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="range" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip
                        formatter={(value) => [value, "Empleados"]}
                        contentStyle={{
                          backgroundColor: "rgba(30, 41, 59, 0.9)",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                        labelStyle={{ color: "white" }}
                      />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Tiempo Promedio de Finalización</CardTitle>
                  <CardDescription className="text-blue-200">Por sucursal (en minutos)</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { branch: "Norte", time: 43 },
                        { branch: "Centro", time: 48 },
                        { branch: "Sur", time: 52 },
                        { branch: "Este", time: 45 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="branch" stroke="rgba(255,255,255,0.5)" />
                      <YAxis stroke="rgba(255,255,255,0.5)" />
                      <Tooltip
                        formatter={(value) => [`${value} min`, "Tiempo"]}
                        contentStyle={{
                          backgroundColor: "rgba(30, 41, 59, 0.9)",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                        labelStyle={{ color: "white" }}
                      />
                      <Bar dataKey="time" fill="#f97316" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Preguntas con mayor dificultad */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  Preguntas con Mayor Dificultad
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Preguntas con mayor tasa de fallo en este módulo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {difficultQuestions.map((question) => (
                    <div key={question.id} className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-white">{question.question}</h3>
                        <Badge variant="outline" className="bg-red-500/20 text-red-300 border-red-500/30">
                          {question.failRate}% fallos
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tabla de resultados por empleado */}
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Resultados por Empleado
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Detalle de resultados de todos los empleados en este módulo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full">
                  <Table>
                    <TableCaption>
                      Resultados del módulo {trainingModules.find((m) => m.id === selectedTrainingModule)?.name}
                    </TableCaption>
                    <TableHeader>
                      <TableRow className="border-white/10 hover:bg-white/5">
                        <TableHead className="text-white">Empleado</TableHead>
                        <TableHead className="text-white">Posición</TableHead>
                        <TableHead className="text-white">Sucursal</TableHead>
                        <TableHead className="text-white text-right">Puntaje</TableHead>
                        <TableHead className="text-white text-center">Estado</TableHead>
                        <TableHead className="text-white text-right">Tiempo</TableHead>
                        <TableHead className="text-white text-right">Intentos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employeesByTraining[selectedTrainingModule]?.map((employee) => (
                        <TableRow key={employee.id} className="border-white/10 hover:bg-white/5">
                          <TableCell className="font-medium text-white">{employee.name}</TableCell>
                          <TableCell className="text-blue-200">{employee.position}</TableCell>
                          <TableCell className="text-blue-200">{employee.branch}</TableCell>
                          <TableCell className="text-right font-medium text-white">{employee.score}%</TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={
                                employee.status === "Aprobado"
                                  ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                                  : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                              }
                            >
                              {employee.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-blue-200">{employee.completionTime}</TableCell>
                          <TableCell className="text-right text-blue-200">{employee.attempts}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Acciones */}
            <div className="flex flex-wrap gap-4 justify-end">
              <Button variant="outline" className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20">
                <FileText className="mr-2 h-4 w-4" /> Exportar Reporte
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                <Mail className="mr-2 h-4 w-4" /> Enviar Resultados
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Volver al Inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
