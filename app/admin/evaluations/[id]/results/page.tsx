"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, AlertCircle, Download, Search, SortAsc, SortDesc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getEvaluationResults } from "@/app/actions/evaluation-actions"

export default function EvaluationResultsPage({ params }) {
  const router = useRouter()
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortField, setSortField] = useState("user_name")
  const [sortDirection, setSortDirection] = useState("asc")

  useEffect(() => {
    async function loadResults() {
      try {
        const data = await getEvaluationResults(params.id)
        setResults(data)
      } catch (error) {
        console.error("Error al cargar resultados:", error)
      } finally {
        setLoading(false)
      }
    }

    loadResults()
  }, [params.id])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Resultados no encontrados</h3>
            <p className="text-muted-foreground text-center mt-1 mb-4">
              No se encontraron resultados para esta evaluación
            </p>
            <Button asChild>
              <Link href={`/admin/evaluations/${params.id}`}>Volver a la evaluación</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Filtrar y ordenar resultados
  const filteredResults = results.user_results
    .filter((result) => {
      const matchesSearch =
        result.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.user_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (result.department && result.department.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "completed" && result.status === "completed") ||
        (statusFilter === "pending" && result.status === "pending") ||
        (statusFilter === "passed" &&
          result.status === "completed" &&
          result.score >= results.evaluation.passing_score) ||
        (statusFilter === "failed" && result.status === "completed" && result.score < results.evaluation.passing_score)

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let valueA, valueB

      switch (sortField) {
        case "user_name":
          valueA = a.user_name
          valueB = b.user_name
          break
        case "department":
          valueA = a.department || ""
          valueB = b.department || ""
          break
        case "status":
          valueA = a.status
          valueB = b.status
          break
        case "score":
          valueA = a.score || 0
          valueB = b.score || 0
          break
        case "completion_time":
          valueA = a.completion_time ? new Date(a.completion_time).getTime() : 0
          valueB = b.completion_time ? new Date(b.completion_time).getTime() : 0
          break
        default:
          valueA = a.user_name
          valueB = b.user_name
      }

      if (sortDirection === "asc") {
        return valueA > valueB ? 1 : -1
      } else {
        return valueA < valueB ? 1 : -1
      }
    })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="outline" asChild>
          <Link href={`/admin/evaluations/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la evaluación
          </Link>
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar resultados
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Resultados: {results.evaluation.title}</CardTitle>
                <CardDescription className="mt-2">{results.evaluation.description}</CardDescription>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant="outline">Capacitación: {results.evaluation.training_title}</Badge>
                <div className="text-sm text-muted-foreground">
                  Puntaje de aprobación: {results.evaluation.passing_score}%
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Usuarios asignados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{results.stats.total_assigned}</div>
                  <p className="text-sm text-muted-foreground">usuarios en total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Completados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{results.stats.total_completed}</div>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((results.stats.total_completed / results.stats.total_assigned) * 100) || 0}% del total
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Aprobados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{results.stats.total_passed}</div>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((results.stats.total_passed / results.stats.total_completed) * 100) || 0}% de
                    completados
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Puntuación promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{results.stats.average_score || 0}%</div>
                  <p className="text-sm text-muted-foreground">
                    {results.stats.average_score >= results.evaluation.passing_score ? "Por encima" : "Por debajo"} del
                    mínimo
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Análisis de resultados</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Distribución de puntuaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 bg-muted rounded-lg flex items-end justify-around p-4">
                      {/* Simulación de gráfico de barras */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-12 bg-primary rounded-t-md"
                          style={{ height: `${results.stats.score_distribution[0] || 0}%` }}
                        ></div>
                        <span className="text-xs mt-2">0-20%</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className="w-12 bg-primary rounded-t-md"
                          style={{ height: `${results.stats.score_distribution[1] || 0}%` }}
                        ></div>
                        <span className="text-xs mt-2">21-40%</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className="w-12 bg-primary rounded-t-md"
                          style={{ height: `${results.stats.score_distribution[2] || 0}%` }}
                        ></div>
                        <span className="text-xs mt-2">41-60%</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className="w-12 bg-primary rounded-t-md"
                          style={{ height: `${results.stats.score_distribution[3] || 0}%` }}
                        ></div>
                        <span className="text-xs mt-2">61-80%</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className="w-12 bg-primary rounded-t-md"
                          style={{ height: `${results.stats.score_distribution[4] || 0}%` }}
                        ></div>
                        <span className="text-xs mt-2">81-100%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Rendimiento por departamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.stats.department_performance.map((dept) => (
                        <div key={dept.department} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{dept.department}</span>
                            <span>{dept.average_score}%</span>
                          </div>
                          <Progress value={dept.average_score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Preguntas con mayor dificultad</CardTitle>
                    <CardDescription>Preguntas con menor porcentaje de respuestas correctas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {results.stats.difficult_questions.map((question) => (
                        <div key={question.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{question.question_text}</span>
                            <span>{question.correct_percentage}% de aciertos</span>
                          </div>
                          <Progress value={question.correct_percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados individuales</CardTitle>
            <CardDescription>Resultados detallados de cada usuario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por nombre, email o departamento..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="completed">Completados</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                    <SelectItem value="passed">Aprobados</SelectItem>
                    <SelectItem value="failed">Reprobados</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("user_name")}>
                        <div className="flex items-center">
                          Usuario
                          {sortField === "user_name" &&
                            (sortDirection === "asc" ? (
                              <SortAsc className="ml-1 h-4 w-4" />
                            ) : (
                              <SortDesc className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("department")}>
                        <div className="flex items-center">
                          Departamento
                          {sortField === "department" &&
                            (sortDirection === "asc" ? (
                              <SortAsc className="ml-1 h-4 w-4" />
                            ) : (
                              <SortDesc className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("status")}>
                        <div className="flex items-center">
                          Estado
                          {sortField === "status" &&
                            (sortDirection === "asc" ? (
                              <SortAsc className="ml-1 h-4 w-4" />
                            ) : (
                              <SortDesc className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("score")}>
                        <div className="flex items-center">
                          Puntuación
                          {sortField === "score" &&
                            (sortDirection === "asc" ? (
                              <SortAsc className="ml-1 h-4 w-4" />
                            ) : (
                              <SortDesc className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("completion_time")}>
                        <div className="flex items-center">
                          Fecha de finalización
                          {sortField === "completion_time" &&
                            (sortDirection === "asc" ? (
                              <SortAsc className="ml-1 h-4 w-4" />
                            ) : (
                              <SortDesc className="ml-1 h-4 w-4" />
                            ))}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.length > 0 ? (
                      filteredResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-2">
                                {result.user_name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium">{result.user_name}</p>
                                <p className="text-xs text-muted-foreground">{result.user_email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{result.department || "No asignado"}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                result.status === "completed"
                                  ? result.score >= results.evaluation.passing_score
                                    ? "success"
                                    : "destructive"
                                  : "outline"
                              }
                              className="capitalize"
                            >
                              {result.status === "completed"
                                ? result.score >= results.evaluation.passing_score
                                  ? "Aprobado"
                                  : "Reprobado"
                                : "Pendiente"}
                            </Badge>
                          </TableCell>
                          <TableCell>{result.score ? `${result.score}%` : "N/A"}</TableCell>
                          <TableCell>
                            {result.completion_time
                              ? new Date(result.completion_time).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-right">
                            {result.status === "completed" ? (
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/admin/evaluations/${params.id}/results/${result.id}`}>Ver detalle</Link>
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" disabled>
                                Pendiente
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-6">
                          <div className="flex flex-col items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-muted-foreground">No se encontraron resultados</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredResults.length} de {results.user_results.length} resultados
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
