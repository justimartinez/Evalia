"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Trophy, CheckCircle, AlertCircle, Clock, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export default function TrainingResults({ params }) {
  const { id } = params
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true)
        // En una aplicación real, esto sería una llamada a la API
        // const response = await fetch(`/api/employee/trainings/${id}/results`)
        // const data = await response.json()

        // Simulamos datos para el desarrollo
        // Esperamos un poco para simular la carga
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockResults = {
          id,
          trainingId: id,
          trainingTitle: "Atención al Cliente",
          completionDate: "25/04/2023",
          score: 88,
          timeUsed: 1250, // segundos
          correctAnswers: 22,
          incorrectAnswers: 3,
          totalQuestions: 25,
          categoryScores: [
            { name: "Conocimientos Básicos", score: 90 },
            { name: "Resolución de Problemas", score: 85 },
            { name: "Comunicación", score: 95 },
            { name: "Procedimientos", score: 80 },
          ],
          questions: [
            {
              id: "1",
              text: "¿Cuál es el protocolo para manejar reclamos de clientes?",
              userAnswer: "Escuchar, empatizar, ofrecer soluciones y hacer seguimiento.",
              correctAnswer: "Escuchar, empatizar, ofrecer soluciones y hacer seguimiento.",
              isCorrect: true,
              category: "Procedimientos",
            },
            {
              id: "2",
              text: "¿Qué información debe solicitarse para identificar al cliente?",
              userAnswer: "Nombre completo, número de documento y correo electrónico.",
              correctAnswer: "Nombre completo, número de documento y correo electrónico.",
              isCorrect: true,
              category: "Conocimientos Básicos",
            },
            {
              id: "3",
              text: "¿Cuál es el tiempo máximo de espera aceptable para un cliente?",
              userAnswer: "3 minutos.",
              correctAnswer: "3 minutos.",
              isCorrect: true,
              category: "Procedimientos",
            },
            {
              id: "4",
              text: "¿Qué hacer cuando un cliente solicita hablar con un supervisor?",
              userAnswer: "Intentar resolver el problema primero, si persiste, transferir amablemente.",
              correctAnswer: "Intentar resolver el problema primero, si persiste, transferir amablemente.",
              isCorrect: true,
              category: "Resolución de Problemas",
            },
            {
              id: "5",
              text: "¿Cuál es la mejor forma de finalizar una interacción con el cliente?",
              userAnswer: "Preguntar si hay algo más en que pueda ayudar y agradecer por su preferencia.",
              correctAnswer: "Preguntar si hay algo más en que pueda ayudar y agradecer por su preferencia.",
              isCorrect: true,
              category: "Comunicación",
            },
          ],
          certificate: {
            id: "cert-123",
            url: "/certificates/atencion-cliente.pdf",
            issueDate: "26/04/2023",
          },
        }

        setResults(mockResults)
        setError(null)
      } catch (err) {
        console.error("Error al cargar resultados:", err)
        setError("No se pudieron cargar los resultados. Por favor, intenta de nuevo más tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [id])

  // Formatear el tiempo utilizado
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Datos para el gráfico de distribución de respuestas
  const pieData = [
    { name: "Correctas", value: results?.correctAnswers || 0 },
    { name: "Incorrectas", value: results?.incorrectAnswers || 0 },
  ]
  const COLORS = ["#22c55e", "#ef4444"]

  // Datos para el gráfico de categorías
  const categoryData = results?.categoryScores || []

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/employee/trainings/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Resultados de Capacitación</h1>
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
          <Link href={`/employee/trainings/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">
          {loading ? <Skeleton className="h-9 w-64" /> : `Resultados: ${results?.trainingTitle}`}
        </h1>
      </div>

      {/* Resumen de resultados */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Resultados</CardTitle>
          <CardDescription>
            {loading ? <Skeleton className="h-4 w-48" /> : `Completado el ${results?.completionDate}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            </div>
          ) : (
            results && (
              <>
                <div className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/10 rounded-lg mb-6">
                  <Trophy className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold">¡Capacitación Completada!</h3>
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 mt-2">{results.score}%</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {results.correctAnswers} de {results.totalQuestions} respuestas correctas
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                        <div className="text-lg font-bold">{results.correctAnswers}</div>
                        <p className="text-sm text-muted-foreground">Respuestas Correctas</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                        <div className="text-lg font-bold">{results.incorrectAnswers}</div>
                        <p className="text-sm text-muted-foreground">Respuestas Incorrectas</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center">
                        <Clock className="h-8 w-8 text-blue-500 mb-2" />
                        <div className="text-lg font-bold">{formatTime(results.timeUsed)}</div>
                        <p className="text-sm text-muted-foreground">Tiempo Utilizado</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )
          )}
        </CardContent>
      </Card>

      {/* Gráficos de resultados */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Respuestas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              results && (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              results && (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="score" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detalle de respuestas */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Respuestas</CardTitle>
          <CardDescription>Revisión de todas las preguntas y respuestas</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : (
            results && (
              <div className="space-y-4">
                {results.questions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`p-4 border rounded-lg ${
                      question.isCorrect ? "bg-green-50 dark:bg-green-900/10" : "bg-red-50 dark:bg-red-900/10"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">Pregunta {index + 1}:</span>
                      <span>{question.text}</span>
                    </div>
                    <div className="ml-4 space-y-2">
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">Tu respuesta:</span>
                        <span
                          className={`text-sm ${
                            question.isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {question.userAnswer}
                        </span>
                        {question.isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500 ml-2" />
                        )}
                      </div>
                      {!question.isCorrect && (
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">Respuesta correcta:</span>
                          <span className="text-sm text-green-600 dark:text-green-400">{question.correctAnswer}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">Categoría:</span>
                        <span className="text-sm">{question.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </CardContent>
      </Card>

      {/* Certificado */}
      {!loading && results?.certificate && (
        <Card>
          <CardHeader>
            <CardTitle>Certificado de Finalización</CardTitle>
            <CardDescription>Certificado emitido el {results.certificate.issueDate}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
              <Trophy className="h-16 w-16 text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold text-center">Certificado de Finalización</h3>
              <p className="text-center text-muted-foreground my-2">
                Por completar exitosamente la capacitación de {results.trainingTitle}
              </p>
              <div className="mt-4 flex gap-4">
                <Button asChild>
                  <a href={results.certificate.url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Certificado
                  </a>
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
