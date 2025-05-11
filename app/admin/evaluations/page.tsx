"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileQuestion, Clock, MoreHorizontal, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { getEvaluations } from "@/app/actions/evaluation-actions"

export default function AdminEvaluations() {
  const [evaluations, setEvaluations] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvaluations() {
      try {
        setLoading(true)
        const data = await getEvaluations()
        setEvaluations(data)
      } catch (error) {
        console.error("Error al cargar evaluaciones:", error)
        setEvaluations([])
      } finally {
        setLoading(false)
      }
    }

    loadEvaluations()
  }, [])

  // Filtrar evaluaciones según búsqueda y filtro de estado
  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch =
      evaluation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evaluation.description && evaluation.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (evaluation.training && evaluation.training.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = statusFilter === "all" || evaluation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Evaluaciones</h1>
        <Button asChild>
          <Link href="/admin/evaluations/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Evaluación
          </Link>
        </Button>
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
            <SelectItem value="active">Activas</SelectItem>
            <SelectItem value="completed">Completadas</SelectItem>
            <SelectItem value="draft">Borradores</SelectItem>
            <SelectItem value="expired">Expiradas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvaluations.length > 0 ? (
            filteredEvaluations.map((evaluation) => (
              <Card key={evaluation.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{evaluation.title}</CardTitle>
                      <CardDescription className="mt-1">{evaluation.description}</CardDescription>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Acciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Link href={`/admin/evaluations/${evaluation.id}`} className="flex w-full">
                            Ver Detalles
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/admin/evaluations/${evaluation.id}/edit`} className="flex w-full">
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/admin/evaluations/${evaluation.id}/results`} className="flex w-full">
                            Ver Resultados
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Link href={`/admin/evaluations/${evaluation.id}/assign`} className="flex w-full">
                            Asignar a Usuarios
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant={
                        evaluation.status === "active"
                          ? "default"
                          : evaluation.status === "completed"
                            ? "success"
                            : evaluation.status === "draft"
                              ? "outline"
                              : "secondary"
                      }
                    >
                      {evaluation.status === "active"
                        ? "Activa"
                        : evaluation.status === "completed"
                          ? "Completada"
                          : evaluation.status === "draft"
                            ? "Borrador"
                            : "Expirada"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">Capacitación: {evaluation.training}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                        <FileQuestion className="h-5 w-5 mb-1 text-muted-foreground" />
                        <span className="text-sm font-medium">{evaluation.passing_score}% para aprobar</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                        <Clock className="h-5 w-5 mb-1 text-muted-foreground" />
                        <span className="text-sm font-medium">{evaluation.time_limit} min</span>
                      </div>
                    </div>
                    {evaluation.status !== "draft" && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso</span>
                          <span>
                            {evaluation.completed_users}/{evaluation.assigned_users} completados
                          </span>
                        </div>
                        <Progress
                          value={(evaluation.completed_users / evaluation.assigned_users) * 100}
                          className="h-2"
                        />
                        <div className="flex justify-between text-sm">
                          <span>Puntuación Promedio</span>
                          <span className="font-medium">{evaluation.average_score}%</span>
                        </div>
                      </div>
                    )}
                    {evaluation.due_date && (
                      <div className="text-sm text-center">
                        <span className="font-medium">Fecha límite:</span> {evaluation.due_date}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/admin/evaluations/${evaluation.id}`}>Ver Detalles</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center p-8 border rounded-lg">
              <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No se encontraron evaluaciones</h3>
              <p className="text-muted-foreground text-center mt-1 mb-4">
                {searchQuery || statusFilter !== "all"
                  ? "Intenta con otros filtros de búsqueda"
                  : "Comienza creando una nueva evaluación"}
              </p>
              <Button asChild>
                <Link href="/admin/evaluations/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Evaluación
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
