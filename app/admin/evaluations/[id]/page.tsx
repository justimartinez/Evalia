"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  FileText,
  Users,
  BarChart,
  CheckCircle,
  AlertCircle,
  Send,
  Plus,
  Edit,
  Eye,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  getEvaluationById,
  assignEvaluationToUsers,
  assignEvaluationToDepartments,
} from "@/app/actions/evaluation-actions"
import { EvaluationAssignmentForm } from "@/components/evaluation/evaluation-assignment-form"

export default function EvaluationDetailPage({ params }) {
  const router = useRouter()
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [assignmentSuccess, setAssignmentSuccess] = useState(false)

  useEffect(() => {
    async function loadEvaluation() {
      try {
        const data = await getEvaluationById(params.id)
        setEvaluation(data)
      } catch (error) {
        console.error("Error al cargar evaluación:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEvaluation()
  }, [params.id])

  const handleAssignSubmit = async (formData) => {
    try {
      // Asignar a usuarios individuales
      if (formData.selectedUsers && formData.selectedUsers.length > 0) {
        await assignEvaluationToUsers(evaluation.id, formData.selectedUsers)
      }

      // Asignar a departamentos
      if (formData.selectedDepartments && formData.selectedDepartments.length > 0) {
        await assignEvaluationToDepartments(evaluation.id, formData.selectedDepartments)
      }

      setAssignmentSuccess(true)

      // Recargar los datos de la evaluación
      const updatedEvaluation = await getEvaluationById(params.id)
      setEvaluation(updatedEvaluation)

      // Cerrar el diálogo después de un breve retraso
      setTimeout(() => {
        setAssignDialogOpen(false)
        setAssignmentSuccess(false)
      }, 2000)
    } catch (error) {
      console.error("Error al asignar evaluación:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!evaluation) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Evaluación no encontrada</h3>
            <p className="text-muted-foreground text-center mt-1 mb-4">
              La evaluación que buscas no existe o ha sido eliminada
            </p>
            <Button asChild>
              <Link href="/admin/evaluations">Ver todas las evaluaciones</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const statusBadgeVariant =
    evaluation.status === "active"
      ? "default"
      : evaluation.status === "completed"
        ? "success"
        : evaluation.status === "draft"
          ? "outline"
          : "secondary"

  const statusText =
    evaluation.status === "active"
      ? "Activa"
      : evaluation.status === "completed"
        ? "Completada"
        : evaluation.status === "draft"
          ? "Borrador"
          : "Expirada"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="outline" asChild>
          <Link href="/admin/evaluations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a evaluaciones
          </Link>
        </Button>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/admin/evaluations/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href={`/admin/evaluations/${params.id}/preview`}>
              <Eye className="mr-2 h-4 w-4" />
              Vista previa
            </Link>
          </Button>
          <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Send className="mr-2 h-4 w-4" />
                Asignar a usuarios
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Asignar evaluación a usuarios</DialogTitle>
                <DialogDescription>
                  Selecciona los usuarios o departamentos a los que deseas asignar esta evaluación.
                </DialogDescription>
              </DialogHeader>

              {assignmentSuccess ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-medium">¡Asignación exitosa!</h3>
                  <p className="text-muted-foreground text-center mt-2">
                    La evaluación ha sido asignada correctamente.
                  </p>
                </div>
              ) : (
                <EvaluationAssignmentForm onSubmit={handleAssignSubmit} />
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{evaluation.title}</CardTitle>
                <CardDescription className="mt-2">{evaluation.description}</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={statusBadgeVariant}>{statusText}</Badge>
                  {evaluation.training_title && (
                    <Badge variant="outline">Capacitación: {evaluation.training_title}</Badge>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-sm text-muted-foreground">
                  Creada el {new Date(evaluation.created_at).toLocaleDateString("es-ES")}
                </div>
                {evaluation.due_date && (
                  <div className="text-sm font-medium">
                    Fecha límite: {new Date(evaluation.due_date).toLocaleDateString("es-ES")}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Puntaje de aprobación</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{evaluation.passing_score || 70}%</div>
                  <p className="text-sm text-muted-foreground">mínimo para aprobar</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Tiempo límite</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{evaluation.time_limit || 30}</div>
                  <p className="text-sm text-muted-foreground">minutos</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Preguntas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{evaluation.questions?.length || 0}</div>
                  <p className="text-sm text-muted-foreground">preguntas en total</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Progreso general</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Usuarios que completaron la evaluación</span>
                  <span>
                    {evaluation.completed_users}/{evaluation.assigned_users} (
                    {Math.round((evaluation.completed_users / evaluation.assigned_users) * 100) || 0}%)
                  </span>
                </div>
                <Progress value={(evaluation.completed_users / evaluation.assigned_users) * 100 || 0} className="h-2" />

                <div className="flex justify-between text-sm mt-4">
                  <span>Usuarios que aprobaron la evaluación</span>
                  <span>
                    {evaluation.passed_users}/{evaluation.completed_users} (
                    {Math.round((evaluation.passed_users / evaluation.completed_users) * 100) || 0}%)
                  </span>
                </div>
                <Progress value={(evaluation.passed_users / evaluation.completed_users) * 100 || 0} className="h-2" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">{evaluation.assigned_users}</div>
                    <p className="text-sm text-muted-foreground">Usuarios asignados</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">{evaluation.completed_users}</div>
                    <p className="text-sm text-muted-foreground">Evaluaciones completadas</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">{evaluation.average_score || 0}%</div>
                    <p className="text-sm text-muted-foreground">Puntuación promedio</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="questions">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="questions">Preguntas</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Preguntas de la evaluación</h2>
              <Button asChild variant="outline">
                <Link href={`/admin/evaluations/${params.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Editar preguntas
                </Link>
              </Button>
            </div>

            {evaluation.questions && evaluation.questions.length > 0 ? (
              <div className="space-y-4">
                {evaluation.questions.map((question, index) => (
                  <Card key={question.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            Pregunta {index + 1}
                          </Badge>
                          <CardTitle className="text-lg">{question.question_text}</CardTitle>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {question.points} {question.points === 1 ? "punto" : "puntos"}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Opciones:</p>
                        <ul className="space-y-2">
                          {question.options &&
                            question.options.map((option) => (
                              <li key={option.id} className="flex items-center gap-2">
                                <div
                                  className={`w-4 h-4 rounded-full ${option.is_correct ? "bg-green-500" : "bg-muted"}`}
                                ></div>
                                <span className={option.is_correct ? "font-medium" : ""}>{option.option_text}</span>
                                {option.is_correct && (
                                  <Badge variant="outline" className="ml-2">
                                    Correcta
                                  </Badge>
                                )}
                              </li>
                            ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No hay preguntas</h3>
                  <p className="text-muted-foreground text-center mt-1 mb-4">
                    Esta evaluación no tiene preguntas agregadas
                  </p>
                  <Button asChild>
                    <Link href={`/admin/evaluations/${params.id}/edit`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Agregar preguntas
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Resultados de la evaluación</h2>
              <Button asChild>
                <Link href={`/admin/evaluations/${params.id}/results`}>
                  <BarChart className="mr-2 h-4 w-4" />
                  Ver dashboard completo
                </Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Resumen de resultados</CardTitle>
                <CardDescription>Análisis de los resultados de la evaluación</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold">{evaluation.average_score || 0}%</div>
                      <p className="text-sm text-muted-foreground">Puntuación promedio</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold">{evaluation.highest_score || 0}%</div>
                      <p className="text-sm text-muted-foreground">Puntuación más alta</p>
                    </div>
                    <div className="bg-muted rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold">{evaluation.lowest_score || 0}%</div>
                      <p className="text-sm text-muted-foreground">Puntuación más baja</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Distribución de puntuaciones</h3>
                    <div className="h-40 bg-muted rounded-lg flex items-end justify-around p-4">
                      {/* Simulación de gráfico de barras */}
                      <div className="w-8 bg-primary rounded-t-md" style={{ height: "20%" }}></div>
                      <div className="w-8 bg-primary rounded-t-md" style={{ height: "40%" }}></div>
                      <div className="w-8 bg-primary rounded-t-md" style={{ height: "70%" }}></div>
                      <div className="w-8 bg-primary rounded-t-md" style={{ height: "90%" }}></div>
                      <div className="w-8 bg-primary rounded-t-md" style={{ height: "60%" }}></div>
                      <div className="w-8 bg-primary rounded-t-md" style={{ height: "30%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0-10%</span>
                      <span>11-30%</span>
                      <span>31-50%</span>
                      <span>51-70%</span>
                      <span>71-90%</span>
                      <span>91-100%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href={`/admin/evaluations/${params.id}/results`}>Ver análisis detallado</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Usuarios asignados</h2>
              <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Send className="mr-2 h-4 w-4" />
                    Asignar a usuarios
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>

            {evaluation.user_evaluations && evaluation.user_evaluations.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Usuarios ({evaluation.user_evaluations.length})</CardTitle>
                  <CardDescription>Usuarios que tienen asignada esta evaluación</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 p-4 font-medium border-b">
                      <div className="col-span-4">Usuario</div>
                      <div className="col-span-2">Departamento</div>
                      <div className="col-span-2">Estado</div>
                      <div className="col-span-2">Puntuación</div>
                      <div className="col-span-2 text-right">Acciones</div>
                    </div>

                    {evaluation.user_evaluations.map((userEval) => (
                      <div key={userEval.id} className="grid grid-cols-12 p-4 border-b last:border-0">
                        <div className="col-span-4 flex items-center">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                            {userEval.user_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{userEval.user_name}</p>
                            <p className="text-sm text-muted-foreground">{userEval.user_email}</p>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center">{userEval.department || "No asignado"}</div>
                        <div className="col-span-2 flex items-center">
                          <Badge
                            variant={
                              userEval.status === "completed"
                                ? userEval.score >= evaluation.passing_score
                                  ? "success"
                                  : "destructive"
                                : "outline"
                            }
                            className="capitalize"
                          >
                            {userEval.status === "completed"
                              ? userEval.score >= evaluation.passing_score
                                ? "Aprobado"
                                : "Reprobado"
                              : "Pendiente"}
                          </Badge>
                        </div>
                        <div className="col-span-2 flex items-center">
                          {userEval.score ? `${userEval.score}%` : "N/A"}
                        </div>
                        <div className="col-span-2 flex justify-end items-center gap-2">
                          {userEval.status === "completed" && (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/evaluations/${params.id}/results/${userEval.id}`}>
                                <Eye className="h-4 w-4" />
                                <span className="sr-only">Ver resultados</span>
                              </Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/admin/evaluations/${params.id}/users`}>Ver todos los usuarios</Link>
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No hay usuarios asignados</h3>
                  <p className="text-muted-foreground text-center mt-1 mb-4">
                    Esta evaluación no tiene usuarios asignados
                  </p>
                  <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Send className="mr-2 h-4 w-4" />
                        Asignar a usuarios
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
