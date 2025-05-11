"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, CheckCircle, AlertCircle, BookOpen, RefreshCw, Database, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { getAllEmployeeTrainings } from "@/app/actions/employee-actions"
import { toast } from "sonner"

export default function EmployeeTrainings() {
  const [trainings, setTrainings] = useState([])
  const [filteredTrainings, setFilteredTrainings] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const [debugInfo, setDebugInfo] = useState(null)
  const [isDebugLoading, setIsDebugLoading] = useState(false)

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        setLoading(true)
        console.log("Fetching trainings, attempt:", retryCount + 1)
        const result = await getAllEmployeeTrainings()
        console.log("API response:", result)

        if (result.error) {
          console.error("Error from API:", result.error)
          setError(result.error)
          toast.error(`Error: ${result.error}`)
          return
        }

        if (!result.trainings || !Array.isArray(result.trainings)) {
          console.error("Invalid response format:", result)
          setError("Formato de respuesta inválido")
          toast.error("Formato de respuesta inválido")
          return
        }

        setTrainings(result.trainings)
        setFilteredTrainings(result.trainings)
        setError(null)
        console.log("Trainings loaded successfully:", result.trainings.length)
      } catch (err) {
        console.error("Error al cargar capacitaciones:", err)
        setError(`No se pudieron cargar las capacitaciones: ${err.message || "Error desconocido"}`)
        toast.error(`Error: ${err.message || "Error desconocido"}`)
      } finally {
        setLoading(false)
      }
    }

    fetchTrainings()
  }, [retryCount])

  // Filtrar capacitaciones cuando cambia la búsqueda o el filtro
  useEffect(() => {
    if (trainings.length > 0) {
      let filtered = trainings

      // Filtrar por búsqueda
      if (searchQuery) {
        filtered = filtered.filter(
          (training) =>
            training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            training.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (training.category && training.category.toLowerCase().includes(searchQuery.toLowerCase())),
        )
      }

      // Filtrar por estado
      if (statusFilter !== "all") {
        filtered = filtered.filter((training) => training.status === statusFilter)
      }

      setFilteredTrainings(filtered)
    }
  }, [searchQuery, statusFilter, trainings])

  // Función para obtener el color de la insignia según el estado
  const getBadgeVariant = (status) => {
    switch (status) {
      case "completed":
        return "success"
      case "in_progress":
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
      case "pending":
        return "Pendiente"
      case "not_started":
        return "No Iniciada"
      default:
        return status
    }
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  const fetchDebugInfo = async () => {
    try {
      setIsDebugLoading(true)
      setDebugInfo("Cargando información de depuración...")

      // Obtener información de la sesión
      const sessionResponse = await fetch("/api/debug/session")
      const sessionData = await sessionResponse.json()

      // Obtener información del esquema de la base de datos
      const schemaResponse = await fetch("/api/debug/schema")
      const schemaData = await schemaResponse.json()

      // Obtener información del usuario actual (localStorage)
      let localStorageUser = null
      try {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          localStorageUser = JSON.parse(storedUser)
        }
      } catch (e) {
        localStorageUser = { error: e.message }
      }

      setDebugInfo(
        JSON.stringify(
          {
            session: sessionData,
            schema: schemaData,
            localStorage: {
              user: localStorageUser,
            },
            browser: {
              userAgent: navigator.userAgent,
              language: navigator.language,
            },
          },
          null,
          2,
        ),
      )
    } catch (err) {
      setDebugInfo(`Error al obtener información de depuración: ${err.message}`)
    } finally {
      setIsDebugLoading(false)
    }
  }

  // Función para simular un login como empleado
  const loginAsEmployee = () => {
    try {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: 2,
          name: "Usuario de Prueba",
          email: "test@example.com",
          role: "employee",
        }),
      )
      toast.success("Sesión de empleado simulada. Recargando datos...")
      handleRetry()
    } catch (err) {
      toast.error(`Error al simular sesión: ${err.message}`)
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mis Capacitaciones</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loginAsEmployee}>
              <User className="mr-2 h-4 w-4" />
              Simular Empleado
            </Button>
            <Button variant="outline" onClick={fetchDebugInfo} disabled={isDebugLoading}>
              <Database className="mr-2 h-4 w-4" />
              {isDebugLoading ? "Cargando..." : "Depurar"}
            </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium">Error</h3>
          <p className="text-muted-foreground text-center mt-1">{error}</p>
          <Button className="mt-4" onClick={handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Intentar de nuevo
          </Button>
        </div>

        {debugInfo && (
          <div className="mt-8 p-4 border rounded-lg bg-muted">
            <h3 className="text-lg font-medium mb-2">Información de depuración</h3>
            <pre className="text-xs overflow-auto p-4 bg-background rounded border">{debugInfo}</pre>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mis Capacitaciones</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loginAsEmployee}>
            <User className="mr-2 h-4 w-4" />
            Simular Empleado
          </Button>
          <Button variant="outline" onClick={fetchDebugInfo} disabled={isDebugLoading}>
            <Database className="mr-2 h-4 w-4" />
            {isDebugLoading ? "Cargando..." : "Depurar"}
          </Button>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar capacitaciones..."
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
            <SelectItem value="completed">Completadas</SelectItem>
            <SelectItem value="in_progress">En progreso</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="not_started">No iniciadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs para filtrar por estado */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setStatusFilter}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="pending">Pendientes</TabsTrigger>
          <TabsTrigger value="in_progress">En Progreso</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
          <TabsTrigger value="not_started">No Iniciadas</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Lista de capacitaciones */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center gap-2 mt-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
                <Skeleton className="h-8 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredTrainings.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTrainings.map((training) => (
            <Card key={training.id}>
              <CardHeader className="pb-3">
                <div>
                  <CardTitle>{training.title}</CardTitle>
                  <CardDescription className="mt-1">{training.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getBadgeVariant(training.status)}>{getStatusText(training.status)}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {training.status === "completed"
                      ? `Completada el ${training.completionDate || "N/A"}`
                      : `Fecha límite: ${training.dueDate || "N/A"}`}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <BookOpen className="h-5 w-5 mb-1 text-muted-foreground" />
                    <span className="text-sm font-medium">{training.duration || "No especificada"}</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-muted rounded-lg">
                    <div className="flex items-center">
                      <Badge variant="outline" className="rounded-full px-2 py-0 text-xs">
                        {training.category || "General"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {training.status === "completed" ? (
                  <div className="flex items-center justify-between p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                      <span className="font-medium">Completada</span>
                    </div>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">100%</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso</span>
                      <span>{training.progress || 0}%</span>
                    </div>
                    <Progress value={training.progress || 0} />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                {training.status === "completed" ? (
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/employee/trainings/${training.id}/results`}>Ver Detalles</Link>
                  </Button>
                ) : (
                  <Button asChild className="w-full">
                    <Link href={`/employee/trainings/${training.id}`}>
                      {training.status === "in_progress" ? "Continuar" : "Comenzar"}
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No se encontraron capacitaciones</h3>
          <p className="text-muted-foreground text-center mt-1">
            {searchQuery || statusFilter !== "all"
              ? "Intenta con otros filtros de búsqueda"
              : "No tienes capacitaciones asignadas actualmente"}
          </p>
          <Button className="mt-4" onClick={handleRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        </div>
      )}

      {debugInfo && (
        <div className="mt-8 p-4 border rounded-lg bg-muted">
          <h3 className="text-lg font-medium mb-2">Información de depuración</h3>
          <pre className="text-xs overflow-auto p-4 bg-background rounded border">{debugInfo}</pre>
        </div>
      )}
    </div>
  )
}
