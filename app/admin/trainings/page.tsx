"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  MoreHorizontal,
  BookOpen,
  FileText,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  BarChart,
  Layers,
  Eye,
  Edit,
  Archive,
  Trash2,
  SlidersHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTrainings } from "@/app/actions/training-actions"

export default function TrainingsPage() {
  const router = useRouter()
  const [trainings, setTrainings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState("grid") // grid or list

  useEffect(() => {
    async function loadTrainings() {
      try {
        setLoading(true)
        const data = await getTrainings()
        setTrainings(data)
      } catch (error) {
        console.error("Error al cargar capacitaciones:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTrainings()
  }, [])

  // Filtrar capacitaciones por búsqueda y estado
  const filteredTrainings = trainings.filter((training) => {
    const matchesSearch =
      training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (training.description && training.description.toLowerCase().includes(searchTerm.toLowerCase()))

    if (activeTab === "all") return matchesSearch
    return training.status === activeTab && matchesSearch
  })

  // Ordenar capacitaciones
  const sortedTrainings = [...filteredTrainings].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    } else if (sortBy === "oldest") {
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    } else if (sortBy === "alphabetical") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "completion") {
      return (b.completion_rate || 0) - (a.completion_rate || 0)
    }
    return 0
  })

  // Obtener estadísticas
  const stats = {
    total: trainings.length,
    published: trainings.filter((t) => t.status === "published").length,
    draft: trainings.filter((t) => t.status === "draft").length,
    archived: trainings.filter((t) => t.status === "archived").length,
  }

  // Función para renderizar el estado de la capacitación
  const renderStatus = (status) => {
    switch (status) {
      case "published":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="mr-1 h-3 w-3" />
            Publicado
          </Badge>
        )
      case "draft":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400"
          >
            <FileText className="mr-1 h-3 w-3" />
            Borrador
          </Badge>
        )
      case "archived":
        return (
          <Badge
            variant="secondary"
            className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
          >
            <Archive className="mr-1 h-3 w-3" />
            Archivado
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <FileText className="mr-1 h-3 w-3" />
            {status}
          </Badge>
        )
    }
  }

  const handleTrainingClick = (id) => {
    router.push(`/admin/trainings/${id}`)
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Capacitaciones</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Gestiona todas las capacitaciones y asigna usuarios a ellas.
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
          <Link href="/admin/trainings/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva capacitación
          </Link>
        </Button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Total Capacitaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">{stats.total}</div>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              <Layers className="inline h-3 w-3 mr-1" />
              Todas las capacitaciones
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 dark:text-green-300">Publicadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-200">{stats.published}</div>
            <p className="text-xs text-green-700 dark:text-green-400 mt-1">
              <CheckCircle className="inline h-3 w-3 mr-1" />
              Capacitaciones activas
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-300">Borradores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-200">{stats.draft}</div>
            <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
              <FileText className="inline h-3 w-3 mr-1" />
              En preparación
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 dark:from-gray-800/50 dark:to-gray-700/50 dark:border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-800 dark:text-gray-300">Archivadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-200">{stats.archived}</div>
            <p className="text-xs text-gray-700 dark:text-gray-400 mt-1">
              <Archive className="inline h-3 w-3 mr-1" />
              No activas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto sm:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar capacitaciones..."
            className="pl-8 bg-white dark:bg-gray-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Más recientes</SelectItem>
              <SelectItem value="oldest">Más antiguos</SelectItem>
              <SelectItem value="alphabetical">Alfabético</SelectItem>
              <SelectItem value="completion">Mayor finalización</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="bg-white dark:bg-gray-800">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ver como</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setViewMode("grid")} className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>Cuadrícula</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("list")} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Lista</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white dark:bg-gray-800 p-1 mb-6">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400"
          >
            Todas{" "}
            <Badge variant="outline" className="ml-1 bg-white dark:bg-gray-800">
              {stats.total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="published"
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900/30 dark:data-[state=active]:text-green-400"
          >
            Publicadas{" "}
            <Badge variant="outline" className="ml-1 bg-white dark:bg-gray-800">
              {stats.published}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="draft"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400"
          >
            Borradores{" "}
            <Badge variant="outline" className="ml-1 bg-white dark:bg-gray-800">
              {stats.draft}
            </Badge>
          </TabsTrigger>
          <TabsTrigger
            value="archived"
            className="data-[state=active]:bg-gray-100 data-[state=active]:text-gray-700 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-gray-300"
          >
            Archivadas{" "}
            <Badge variant="outline" className="ml-1 bg-white dark:bg-gray-800">
              {stats.archived}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {loading ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden border-none shadow-md">
                    <CardHeader className="p-0">
                      <Skeleton className="h-48 rounded-t-lg" />
                    </CardHeader>
                    <CardContent className="p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-none shadow-md">
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="p-4">
                        <div className="flex items-center gap-4">
                          <Skeleton className="h-12 w-12 rounded-lg" />
                          <div className="flex-1">
                            <Skeleton className="h-5 w-1/3 mb-2" />
                            <Skeleton className="h-4 w-1/2" />
                          </div>
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          ) : sortedTrainings.length > 0 ? (
            viewMode === "grid" ? (
              <ScrollArea className="h-[calc(100vh-350px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                  {sortedTrainings.map((training) => (
                    <Card
                      key={training.id}
                      className="overflow-hidden group hover:shadow-lg transition-all duration-200 border-none shadow-md cursor-pointer"
                      onClick={() => handleTrainingClick(training.id)}
                    >
                      <CardHeader className="p-0 relative">
                        <div className="h-48 bg-gradient-to-r from-blue-500/20 to-blue-600/10 dark:from-blue-900/40 dark:to-blue-800/20 flex items-center justify-center">
                          <BookOpen className="h-16 w-16 text-blue-500/40 dark:text-blue-400/40" />
                        </div>
                        <div className="absolute top-4 right-4">{renderStatus(training.status)}</div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <CardTitle className="mb-2 group-hover:text-blue-600 transition-colors dark:group-hover:text-blue-400">
                          {training.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 mb-4 h-10">{training.description}</CardDescription>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {training.created_at
                              ? new Date(training.created_at).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Fecha desconocida"}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm mb-4">
                          <div className="flex flex-col items-center p-2 bg-blue-50 rounded-lg dark:bg-blue-900/20">
                            <FileText className="h-4 w-4 mb-1 text-blue-600 dark:text-blue-400" />
                            <span className="text-xs font-medium text-blue-800 dark:text-blue-300">
                              {training.content_count || 0}
                            </span>
                            <span className="text-xs text-blue-600 dark:text-blue-400">Contenidos</span>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-green-50 rounded-lg dark:bg-green-900/20">
                            <Users className="h-4 w-4 mb-1 text-green-600 dark:text-green-400" />
                            <span className="text-xs font-medium text-green-800 dark:text-green-300">
                              {training.department_count || 0}
                            </span>
                            <span className="text-xs text-green-600 dark:text-green-400">Departamentos</span>
                          </div>
                          <div className="flex flex-col items-center p-2 bg-amber-50 rounded-lg dark:bg-amber-900/20">
                            <BarChart className="h-4 w-4 mb-1 text-amber-600 dark:text-amber-400" />
                            <span className="text-xs font-medium text-amber-800 dark:text-amber-300">
                              {training.question_count || 0}
                            </span>
                            <span className="text-xs text-amber-600 dark:text-amber-400">Preguntas</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {training.duration ? `${training.duration} min` : "Sin duración"}
                            </span>
                          </div>
                          <span className="text-sm font-medium">{training.completion_rate || 0}%</span>
                        </div>
                        <Progress value={training.completion_rate || 0} className="h-1" />
                      </CardContent>
                      <CardFooter className="p-0">
                        <div className="grid grid-cols-3 w-full divide-x divide-gray-200 dark:divide-gray-700 bg-gray-50 dark:bg-gray-800/50">
                          <Button
                            variant="ghost"
                            className="rounded-none py-3 h-auto text-xs font-medium text-gray-700 dark:text-gray-300"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/admin/trainings/${training.id}`)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="ghost"
                            className="rounded-none py-3 h-auto text-xs font-medium text-gray-700 dark:text-gray-300"
                            onClick={(e) => {
                              e.stopPropagation()
                              router.push(`/admin/trainings/${training.id}/edit`)
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="rounded-none py-3 h-auto text-xs font-medium text-gray-700 dark:text-gray-300 w-full"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4 mr-1" />
                                Más
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/admin/trainings/${training.id}/content`)
                                }}
                              >
                                <BookOpen className="mr-2 h-4 w-4" />
                                Gestionar contenido
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  router.push(`/admin/trainings/${training.id}/results`)
                                }}
                              >
                                <BarChart className="mr-2 h-4 w-4" />
                                Ver resultados
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Lógica para archivar
                                }}
                                className="text-amber-600 dark:text-amber-400"
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                {training.status === "archived" ? "Restaurar" : "Archivar"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Lógica para eliminar
                                }}
                                className="text-red-600 dark:text-red-400"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <Card className="border-none shadow-md">
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {sortedTrainings.map((training) => (
                      <div
                        key={training.id}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        onClick={() => handleTrainingClick(training.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <BookOpen className="h-6 w-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                {training.title}
                              </h3>
                              {renderStatus(training.status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>
                                  {training.created_at
                                    ? new Date(training.created_at).toLocaleDateString("es-ES", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : "Fecha desconocida"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>{training.department_count || 0} departamentos</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                <span>{training.content_count || 0} contenidos</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/admin/trainings/${training.id}`)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/admin/trainings/${training.id}/edit`)
                                  }}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/admin/trainings/${training.id}/content`)
                                  }}
                                >
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  Gestionar contenido
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    router.push(`/admin/trainings/${training.id}/results`)
                                  }}
                                >
                                  <BarChart className="mr-2 h-4 w-4" />
                                  Ver resultados
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Lógica para archivar
                                  }}
                                  className="text-amber-600 dark:text-amber-400"
                                >
                                  <Archive className="mr-2 h-4 w-4" />
                                  {training.status === "archived" ? "Restaurar" : "Archivar"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Lógica para eliminar
                                  }}
                                  className="text-red-600 dark:text-red-400"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          ) : (
            <Card className="border-none shadow-md">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mb-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">No se encontraron capacitaciones</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                  {searchTerm
                    ? `No hay resultados para "${searchTerm}"`
                    : activeTab === "all"
                      ? "Aún no has creado ninguna capacitación"
                      : activeTab === "published"
                        ? "No hay capacitaciones publicadas"
                        : activeTab === "draft"
                          ? "No hay borradores de capacitaciones"
                          : "No hay capacitaciones archivadas"}
                </p>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/admin/trainings/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Crear capacitación
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
