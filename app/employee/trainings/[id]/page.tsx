"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, Clock, CheckCircle, AlertCircle, FileText, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { TrainingContent } from "@/components/training/training-content"
import { TrainingQuiz } from "@/components/training/training-quiz"
import { toast } from "@/hooks/use-toast"

export default function TrainingDetail({ params }) {
  const router = useRouter()
  const { id } = params
  const [training, setTraining] = useState(null)
  const [activeTab, setActiveTab] = useState("content")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizResults, setQuizResults] = useState(null)

  useEffect(() => {
    const fetchTraining = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/employee/trainings/${id}`)

        if (!response.ok) {
          throw new Error("Error al cargar la capacitación")
        }

        const data = await response.json()
        setTraining(data)

        // Verificar si el quiz ya está completado
        if (data.status === "completed" && data.score) {
          setQuizCompleted(true)
          setQuizResults({
            score: data.score,
            correctCount: Math.round((data.score / 100) * data.quiz.questions.length),
            totalQuestions: data.quiz.questions.length,
            timeUsed: 0, // No tenemos este dato
            questionResults: {},
            answers: {},
          })
        }

        setError(null)
      } catch (err) {
        console.error("Error al cargar la capacitación:", err)
        setError("No se pudo cargar la capacitación. Por favor, intenta de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchTraining()
  }, [id])

  const handleStartQuiz = () => {
    setQuizStarted(true)
    setActiveTab("quiz")
  }

  const handleCompleteQuiz = async (results) => {
    try {
      setQuizCompleted(true)
      setQuizResults(results)

      // Enviar resultados al servidor
      const response = await fetch(`/api/employee/trainings/${id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score: results.score,
          answers: results.answers,
        }),
      })

      if (!response.ok) {
        throw new Error("Error al guardar los resultados")
      }

      // Actualizar el estado de la capacitación
      setTraining((prev) => ({
        ...prev,
        status: "completed",
        progress: 100,
        score: results.score,
        completionDate: new Date().toLocaleDateString(),
      }))

      toast({
        title: "¡Capacitación completada!",
        description: `Has obtenido una puntuación de ${results.score}%`,
      })
    } catch (error) {
      console.error("Error al completar la capacitación:", error)
      toast({
        title: "Error",
        description: "No se pudieron guardar los resultados. Inténtalo de nuevo.",
        variant: "destructive",
      })
    }
  }

  const handleMarkContentAsCompleted = async (contentId) => {
    try {
      const response = await fetch(`/api/employee/trainings/${id}/content/${contentId}/complete`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Error al marcar el contenido como completado")
      }

      // Actualizar el estado local
      setTraining((prev) => {
        const updatedContent = prev.content.map((item) => (item.id === contentId ? { ...item, completed: true } : item))

        // Calcular el nuevo progreso
        const completedCount = updatedContent.filter((item) => item.completed).length
        const newProgress = Math.round((completedCount / updatedContent.length) * 100)

        return {
          ...prev,
          content: updatedContent,
          progress: newProgress,
          status: newProgress === 100 ? "ready_for_quiz" : "in_progress",
        }
      })

      toast({
        title: "Contenido completado",
        description: "El contenido ha sido marcado como completado",
      })
    } catch (error) {
      console.error("Error al marcar el contenido como completado:", error)
      toast({
        title: "Error",
        description: "No se pudo marcar el contenido como completado",
        variant: "destructive",
      })
    }
  }

  // Función para obtener el color de la insignia según el estado
  const getBadgeVariant = (status) => {
    switch (status) {
      case "completed":
        return "success"
      case "in_progress":
      case "ready_for_quiz":
        return "secondary"
      case "pending":
      case "not_started":
        return "outline"
      default:
        return "default"
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completada"
      case "in_progress":
        return "En Progreso"
      case "ready_for_quiz":
        return "Listo para Evaluación"
      case "pending":
        return "Pendiente"
      case "not_started":
        return "No Iniciada"
      default:
        return status
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/employee/trainings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Detalle de Capacitación</h1>
        </div>
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium">Error</h3>
          <p className="text-muted-foreground text-center mt-1">{error}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Intentar de nuevo
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/employee/trainings">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">
          {loading ? <Skeleton className="h-9 w-64" /> : training?.title || "Detalle de Capacitación"}
        </h1>
      </div>

      {/* Información de la capacitación */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>{loading ? <Skeleton className="h-7 w-48" /> : training?.title}</CardTitle>
              <CardDescription className="mt-1">
                {loading ? <Skeleton className="h-4 w-full" /> : training?.description}
              </CardDescription>
            </div>
            {!loading && training && (
              <Badge variant={getBadgeVariant(training.status)} className="self-start md:self-center">
                {getStatusText(training.status)}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (
            training && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <BookOpen className="h-5 w-5 mb-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Duración</span>
                    <span className="text-sm font-medium">{training.duration}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <Clock className="h-5 w-5 mb-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Fecha Límite</span>
                    <span className="text-sm font-medium">{training.dueDate}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <FileText className="h-5 w-5 mb-1 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Categoría</span>
                    <span className="text-sm font-medium">{training.category}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <CheckCircle
                      className={`h-5 w-5 mb-1 ${
                        training.status === "completed" ? "text-green-500" : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-xs text-muted-foreground">Estado</span>
                    <span className="text-sm font-medium">{getStatusText(training.status)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso</span>
                    <span>{training.progress}%</span>
                  </div>
                  <Progress value={training.progress} />
                </div>
              </>
            )
          )}
        </CardContent>
      </Card>

      {/* Contenido de la capacitación */}
      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        training && (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="content">Contenido</TabsTrigger>
                <TabsTrigger value="quiz">Evaluación</TabsTrigger>
              </TabsList>
              <TabsContent value="content" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Contenido de la Capacitación</CardTitle>
                    <CardDescription>Completa todo el contenido antes de realizar la evaluación</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TrainingContent content={training.content} onMarkAsCompleted={handleMarkContentAsCompleted} />
                  </CardContent>
                  <CardFooter>
                    <Button
                      onClick={handleStartQuiz}
                      disabled={training.status === "completed" || training.progress < 100}
                      className="w-full"
                    >
                      {training.status === "completed"
                        ? "Evaluación Completada"
                        : training.progress < 100
                          ? "Completa todo el contenido primero"
                          : quizStarted
                            ? "Continuar Evaluación"
                            : "Iniciar Evaluación"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="quiz" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Evaluación de Conocimientos</CardTitle>
                    <CardDescription>
                      {quizCompleted
                        ? "Has completado la evaluación"
                        : "Responde todas las preguntas para completar la capacitación"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {quizStarted || quizCompleted ? (
                      <TrainingQuiz
                        quiz={training.quiz}
                        onComplete={handleCompleteQuiz}
                        completed={quizCompleted}
                        results={quizResults}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-8 text-center">
                        <Play className="h-12 w-12 text-primary mb-4" />
                        <h3 className="text-lg font-medium">Evaluación no iniciada</h3>
                        <p className="text-muted-foreground mt-1 mb-4">
                          {training.progress < 100
                            ? "Debes completar todo el contenido antes de iniciar la evaluación"
                            : "Inicia la evaluación para completar la capacitación"}
                        </p>
                        <Button onClick={handleStartQuiz} disabled={training.progress < 100}>
                          Iniciar Evaluación
                        </Button>
                      </div>
                    )}
                  </CardContent>
                  {quizCompleted && (
                    <CardFooter>
                      <Button asChild className="w-full">
                        <Link href={`/employee/trainings/${id}/results`}>Ver Resultados Detallados</Link>
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )
      )}
    </div>
  )
}
