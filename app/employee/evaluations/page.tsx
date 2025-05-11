"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle, Clock, FileQuestion, Search, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EmployeeEvaluations() {
  const [evaluations, setEvaluations] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    // En una aplicación real, estos datos vendrían de una API
    const mockEvaluations = [
      {
        id: 1,
        title: "Seguridad Informática Básica",
        description: "Evaluación sobre fundamentos de seguridad",
        status: "completed",
        dueDate: "10/05/2023",
        questions: 15,
        timeLimit: 30,
        score: 92,
        progress: 100,
      },
      {
        id: 2,
        title: "Atención al Cliente",
        description: "Evaluación sobre mejores prácticas de atención",
        status: "completed",
        dueDate: "28/04/2023",
        questions: 20,
        timeLimit: 45,
        score: 88,
        progress: 100,
      },
      {
        id: 3,
        title: "Protocolos de Emergencia",
        description: "Evaluación sobre procedimientos de emergencia",
        status: "completed",
        dueDate: "15/04/2023",
        questions: 12,
        timeLimit: 20,
        score: 75,
        progress: 100,
      },
      {
        id: 4,
        title: "Nuevas Políticas de Privacidad",
        description: "Evaluación sobre las nuevas políticas de privacidad",
        status: "pending",
        dueDate: "15/06/2023",
        questions: 10,
        timeLimit: 15,
        score: null,
        progress: 0,
      },
      {
        id: 5,
        title: "Herramientas de Productividad",
        description: "Evaluación sobre herramientas de trabajo",
        status: "in_progress",
        dueDate: "22/06/2023",
        questions: 18,
        timeLimit: 40,
        score: null,
        progress: 60,
      },
      {
        id: 6,
        title: "Comunicación Efectiva",
        description: "Evaluación sobre técnicas de comunicación",
        status: "pending",
        dueDate: "30/06/2023",
        questions: 15,
        timeLimit: 25,
        score: null,
        progress: 0,
      },
    ]

    setEvaluations(mockEvaluations)
  }, [])

  // Filtrar evaluaciones según búsqueda y filtro de estado
  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch =
      evaluation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evaluation.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || evaluation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mis Evaluaciones</h1>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar evaluaciones..."
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
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="in_progress">En progreso</SelectItem>
            <SelectItem value="completed">Completadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de evaluaciones */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvaluations.map((evaluation) => (
          <Card key={evaluation.id}>
            <CardHeader className="pb-3">
              <div>
                <CardTitle>{evaluation.title}</CardTitle>
                <CardDescription className="mt-1">{evaluation.description}</CardDescription>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant={
                    evaluation.status === "completed"
                      ? "default"
                      : evaluation.status === "in_progress"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {evaluation.status === "completed"
                    ? "Completada"
                    : evaluation.status === "in_progress"
                      ? "En Progreso"
                      : "Pendiente"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {evaluation.status === "completed" ? "Completada el" : "Fecha límite:"} {evaluation.dueDate}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <FileQuestion className="h-5 w-5 mb-1 text-muted-foreground" />
                  <span className="text-sm font-medium">{evaluation.questions} Preguntas</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                  <Clock className="h-5 w-5 mb-1 text-muted-foreground" />
                  <span className="text-sm font-medium">{evaluation.timeLimit} min</span>
                </div>
              </div>

              {evaluation.status === "completed" ? (
                <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                    <span className="font-medium">Puntuación</span>
                  </div>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">{evaluation.score}%</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso</span>
                    <span>{evaluation.progress}%</span>
                  </div>
                  <Progress value={evaluation.progress} />
                </div>
              )}
            </CardContent>
            <CardFooter>
              {evaluation.status === "completed" ? (
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/employee/results/${evaluation.id}`}>Ver Resultados</Link>
                </Button>
              ) : (
                <Button asChild className="w-full">
                  <Link href={`/employee/evaluations/${evaluation.id}`}>
                    {evaluation.status === "in_progress" ? "Continuar" : "Comenzar"}
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredEvaluations.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No se encontraron evaluaciones</h3>
          <p className="text-muted-foreground text-center mt-1">
            {searchQuery || statusFilter !== "all"
              ? "Intenta con otros filtros de búsqueda"
              : "No tienes evaluaciones asignadas actualmente"}
          </p>
        </div>
      )}
    </div>
  )
}
