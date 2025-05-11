"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, Clock, AlertTriangle, BookOpen, Award } from "lucide-react"
import { useSession } from "next-auth/react"

interface TrainingProgress {
  id: number
  title: string
  description: string
  progress: number
  status: string
  score: number | null
  dueDate: string | null
  completedAt: string | null
  totalModules: number
  completedModules: number
}

export default function ProgressPage() {
  const { data: session } = useSession()
  const [trainings, setTrainings] = useState<TrainingProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    pending: 0,
    averageScore: 0,
    averageProgress: 0,
  })

  useEffect(() => {
    if (session?.user?.id) {
      fetchProgress()
    }
  }, [session])

  const fetchProgress = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/employee/progress")
      if (response.ok) {
        const data = await response.json()
        setTrainings(data.trainings)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching progress:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "pending":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      default:
        return <BookOpen className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completado"
      case "in_progress":
        return "En progreso"
      case "pending":
        return "Pendiente"
      default:
        return "Desconocido"
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mi Progreso</h1>
      </div>

      {/* Estadísticas generales */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats.completed}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats.inProgress}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{stats.pending}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Puntuación Media</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-2xl font-bold">{stats.averageScore}%</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>{stats.averageProgress}%</span>
                </div>
                <Progress value={stats.averageProgress} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Listado de capacitaciones */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
          <TabsTrigger value="in_progress">En Progreso</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <ProgressList
            trainings={trainings}
            loading={loading}
            getStatusIcon={getStatusIcon}
            getStatusText={getStatusText}
            formatDate={formatDate}
          />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <ProgressList
            trainings={trainings.filter((t) => t.status === "completed")}
            loading={loading}
            getStatusIcon={getStatusIcon}
            getStatusText={getStatusText}
            formatDate={formatDate}
          />
        </TabsContent>
        <TabsContent value="in_progress" className="mt-4">
          <ProgressList
            trainings={trainings.filter((t) => t.status === "in_progress")}
            loading={loading}
            getStatusIcon={getStatusIcon}
            getStatusText={getStatusText}
            formatDate={formatDate}
          />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <ProgressList
            trainings={trainings.filter((t) => t.status === "pending")}
            loading={loading}
            getStatusIcon={getStatusIcon}
            getStatusText={getStatusText}
            formatDate={formatDate}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ProgressListProps {
  trainings: TrainingProgress[]
  loading: boolean
  getStatusIcon: (status: string) => JSX.Element
  getStatusText: (status: string) => string
  formatDate: (date: string | null) => string
}

function ProgressList({ trainings, loading, getStatusIcon, getStatusText, formatDate }: ProgressListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (trainings.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No hay capacitaciones</h3>
          <p className="text-muted-foreground mt-1">No se encontraron capacitaciones en esta categoría.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {trainings.map((training) => (
        <Card key={training.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">{training.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{training.description}</p>
              </div>
              <Badge
                variant={
                  training.status === "completed"
                    ? "success"
                    : training.status === "in_progress"
                      ? "secondary"
                      : "outline"
                }
                className={
                  training.status === "completed"
                    ? "bg-green-100 text-green-800 border-green-200"
                    : training.status === "in_progress"
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : "bg-amber-100 text-amber-800 border-amber-200"
                }
              >
                {getStatusText(training.status)}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    Progreso: {training.completedModules} de {training.totalModules} módulos
                  </span>
                  <span>{training.progress}%</span>
                </div>
                <Progress value={training.progress} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>
                    {training.status === "completed"
                      ? `Completado: ${formatDate(training.completedAt)}`
                      : training.dueDate
                        ? `Fecha límite: ${formatDate(training.dueDate)}`
                        : "Sin fecha límite"}
                  </span>
                </div>
                {training.score !== null && (
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Puntuación: {training.score}%</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
