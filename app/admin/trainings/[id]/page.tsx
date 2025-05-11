"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Users,
  Award,
  CheckCircle,
  UserPlus,
  BarChart3,
  BookMarked,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrainingAssignmentForm } from "@/components/training/training-assignment-form"
import {
  getTrainingById,
  assignTrainingToUsers,
  assignTrainingToDepartments,
  publishTraining,
} from "@/app/actions/training-actions"
import { toast } from "@/hooks/use-toast"

export default function TrainingDetailsPage({ params }) {
  const router = useRouter()
  const [training, setTraining] = useState(null)
  const [loading, setLoading] = useState(true)
  const [assigning, setAssigning] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [redirected, setRedirected] = useState(false)

  useEffect(() => {
    // Si el ID es "new", redirigir a la página de creación
    if (params.id === "new" && !redirected) {
      setRedirected(true)
      router.replace("/admin/trainings/new")
      return
    }

    async function loadTraining() {
      try {
        // No cargar datos si estamos redirigiendo
        if (params.id === "new") {
          return
        }

        setLoading(true)
        const data = await getTrainingById(params.id)

        if (!data) {
          toast({
            title: "Error",
            description: "No se pudo encontrar la capacitación solicitada",
            variant: "destructive",
          })
          return
        }

        setTraining(data)
      } catch (error) {
        console.error("Error al cargar capacitación:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la información de la capacitación",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadTraining()
  }, [params.id, router, redirected])

  // Si estamos en la ruta "new", mostrar un indicador de carga mientras se redirige
  if (params.id === "new") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="ml-4">Redirigiendo a la página de nueva capacitación...</p>
      </div>
    )
  }

  const handleAssignSubmit = async (data) => {
    try {
      setAssigning(true)

      let success = true
      let message = ""

      // Asignar a usuarios individuales
      if (data.selectedUsers && data.selectedUsers.length > 0) {
        const result = await assignTrainingToUsers(params.id, data.selectedUsers)
        if (!result.success) {
          success = false
          message = "Error al asignar a usuarios: " + (result.error || "Error desconocido")
        } else if (result.warning) {
          // Mostrar advertencia pero continuar
          toast({
            title: "Advertencia",
            description: result.warning,
            variant: "warning",
          })
        }
      }

      // Asignar a departamentos
      if (data.selectedDepartments && data.selectedDepartments.length > 0) {
        const result = await assignTrainingToDepartments(params.id, data.selectedDepartments)
        if (!result.success) {
          success = false
          message = "Error al asignar a departamentos: " + (result.error || "Error desconocido")
        } else if (result.warning) {
          // Mostrar advertencia pero continuar
          toast({
            title: "Advertencia",
            description: result.warning,
            variant: "warning",
          })
        }
      }

      if (success) {
        toast({
          title: "Capacitación asignada",
          description: "La capacitación ha sido asignada correctamente",
        })

        // Recargar los datos de la capacitación
        const updatedTraining = await getTrainingById(params.id)
        setTraining(updatedTraining)
      } else {
        toast({
          title: "Error",
          description: message || "No se pudo asignar la capacitación",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al asignar capacitación:", error)
      toast({
        title: "Error",
        description: "No se pudo asignar la capacitación",
        variant: "destructive",
      })
    } finally {
      setAssigning(false)
    }
  }

  const handlePublishTraining = async () => {
    try {
      setPublishing(true)

      const result = await publishTraining(params.id)

      if (result.success) {
        toast({
          title: "Capacitación publicada",
          description: "La capacitación ha sido publicada correctamente",
        })

        // Recargar los datos de la capacitación
        const updatedTraining = await getTrainingById(params.id)
        setTraining(updatedTraining)
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo publicar la capacitación",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al publicar capacitación:", error)
      toast({
        title: "Error",
        description: "No se pudo publicar la capacitación",
        variant: "destructive",
      })
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!training) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/admin/trainings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Capacitación no encontrada</h1>
        </div>
        <p>La capacitación que estás buscando no existe o ha sido eliminada.</p>
        <Button asChild>
          <Link href="/admin/trainings">Volver a capacitaciones</Link>
        </Button>
      </div>
    )
  }

  // Calcular estadísticas
  const completionRate = training.assigned_users
    ? Math.round((training.completed_users / training.assigned_users) * 100)
    : 0

  const inProgressCount = training.assigned_users ? training.assigned_users - training.completed_users : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href="/admin/trainings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{training.title}</h1>
            <p className="text-gray-500 dark:text-gray-400">{training.description}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {training.status !== "published" && (
            <Button onClick={handlePublishTraining} disabled={publishing} className="cursor-pointer" type="button">
              {publishing ? "Publicando..." : "Publicar capacitación"}
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href={`/admin/trainings/${params.id}/edit`}>Editar capacitación</Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/trainings/${params.id}/preview`}>Vista previa</Link>
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
              <CheckCircle className="h-5 w-5" />
            </div>
            <p className="text-xs text-green-700 dark:text-green-400">Completados</p>
            <h3 className="text-2xl font-bold text-green-900 dark:text-green-200">{training.completed_users || 0}</h3>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 dark:from-amber-900/20 dark:to-amber-800/20 dark:border-amber-800/30">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="rounded-full p-2 bg-amber-200 text-amber-700 mb-2 dark:bg-amber-800/50 dark:text-amber-300">
              <Clock className="h-5 w-5" />
            </div>
            <p className="text-xs text-amber-700 dark:text-amber-400">En progreso</p>
            <h3 className="text-2xl font-bold text-amber-900 dark:text-amber-200">{inProgressCount}</h3>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-800/30">
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="rounded-full p-2 bg-purple-200 text-purple-700 mb-2 dark:bg-purple-800/50 dark:text-purple-300">
              <Award className="h-5 w-5" />
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-400">Tasa de finalización</p>
            <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-200">{completionRate}%</h3>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <BookMarked className="h-4 w-4" />
            <span>Detalles</span>
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>Contenido</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Usuarios</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <CardTitle>Detalles de la capacitación</CardTitle>
              <CardDescription>{training.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Fecha de creación</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(training.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full p-2 bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Duración estimada</p>
                      <p className="text-sm text-muted-foreground">{training.duration || "No especificada"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full p-2 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Contenido</p>
                      <p className="text-sm text-muted-foreground">
                        {training.content_count || 0} módulo{training.content_count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full p-2 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Preguntas</p>
                      <p className="text-sm text-muted-foreground">
                        {training.question_count || 0} pregunta{training.question_count !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Progreso de la capacitación</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usuarios asignados</span>
                    <span>{training.assigned_users || 0} usuarios</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Completados</span>
                    <span>
                      {training.completed_users || 0} ({completionRate}%)
                    </span>
                  </div>
                  <Progress value={completionRate} className="h-2" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-800/50 py-4 flex justify-end">
              <Button asChild variant="outline">
                <Link href={`/admin/trainings/${params.id}/edit`}>Editar detalles</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <CardTitle>Asignar capacitación</CardTitle>
              <CardDescription>Asigna esta capacitación a usuarios o departamentos</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <TrainingAssignmentForm
                onSubmit={handleAssignSubmit}
                isLoading={assigning}
                currentAssignedUsers={training.user_trainings || []}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <CardTitle>Contenido de la capacitación</CardTitle>
              <CardDescription>Módulos y materiales de aprendizaje</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {training.content && training.content.length > 0 ? (
                <div className="space-y-4">
                  {training.content.map((content, index) => (
                    <div
                      key={content.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="rounded-full p-2 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 h-10 w-10 flex items-center justify-center">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium">{content.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{content.description}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            content.content_type === "video"
                              ? "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                              : content.content_type === "document"
                                ? "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                                : "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                          }
                        >
                          {content.content_type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">No hay contenido disponible</p>
                  <p className="text-muted-foreground mb-6">Esta capacitación aún no tiene contenido agregado</p>
                  <Button asChild>
                    <Link href={`/admin/trainings/${params.id}/edit`}>Agregar contenido</Link>
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-800/50 py-4 flex justify-end">
              <Button asChild>
                <Link href={`/admin/trainings/${params.id}/content/new`}>Agregar módulo</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20">
              <CardTitle>Usuarios asignados</CardTitle>
              <CardDescription>
                {training.assigned_users || 0} usuario{training.assigned_users !== 1 ? "s" : ""} asignado
                {training.assigned_users !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {training.user_trainings && training.user_trainings.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {training.user_trainings.map((userTraining) => (
                    <div
                      key={userTraining.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-full h-10 w-10 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center font-medium">
                          {userTraining.user_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{userTraining.user_name}</p>
                          <p className="text-sm text-muted-foreground">{userTraining.user_email}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          userTraining.status === "completed"
                            ? "default"
                            : userTraining.status === "in_progress"
                              ? "outline"
                              : "secondary"
                        }
                        className={
                          userTraining.status === "completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                            : userTraining.status === "in_progress"
                              ? "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
                        }
                      >
                        {userTraining.status === "completed"
                          ? "Completado"
                          : userTraining.status === "in_progress"
                            ? "En progreso"
                            : "Pendiente"}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Users className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">No hay usuarios asignados</p>
                  <p className="text-muted-foreground mb-6">Esta capacitación aún no tiene usuarios asignados</p>
                  <Button onClick={() => setActiveTab("details")} className="cursor-pointer">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Asignar usuarios
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-gray-50 dark:bg-gray-800/50 py-4 flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/admin/trainings/${params.id}/users/export`}>Exportar datos</Link>
              </Button>
              <Button asChild>
                <Link href={`/admin/trainings/${params.id}/results`}>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Ver resultados
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
