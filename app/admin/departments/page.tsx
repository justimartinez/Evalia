"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Building, Search, Plus, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { getDepartmentStats } from "@/app/actions/department-actions"

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function loadDepartments() {
      try {
        setLoading(true)
        const deptStats = await getDepartmentStats()
        if (deptStats && deptStats.departments) {
          setDepartments(deptStats.departments)
        }
      } catch (error) {
        console.error("Error al cargar departamentos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDepartments()
  }, [])

  // Filtrar departamentos según la búsqueda
  const filteredDepartments = departments.filter((dept) => dept.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departamentos</h1>
          <p className="text-gray-500 dark:text-gray-400">Gestiona los departamentos y su rendimiento</p>
        </div>
        <Button asChild>
          <Link href="/admin/departments/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Departamento
          </Link>
        </Button>
      </div>

      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar departamentos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((dept) => (
              <Card key={dept.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Building className="h-4 w-4" />
                      </div>
                      <CardTitle>{dept.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {dept.user_count} usuarios
                    </Badge>
                  </div>
                  <CardDescription>{dept.description || "Sin descripción"}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Puntuación promedio</span>
                        <span className="font-medium">{Math.round(dept.average_score)}%</span>
                      </div>
                      <Progress value={Math.round(dept.average_score)} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tasa de finalización</span>
                        <span className="font-medium">{Math.round(dept.completion_rate)}%</span>
                      </div>
                      <Progress value={Math.round(dept.completion_rate)} className="h-2" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div className="bg-green-50 p-2 rounded-md">
                        <p className="font-medium text-green-700">{dept.completed_count}</p>
                        <p className="text-xs text-green-600">Completadas</p>
                      </div>
                      <div className="bg-amber-50 p-2 rounded-md">
                        <p className="font-medium text-amber-700">{dept.in_progress_count}</p>
                        <p className="text-xs text-amber-600">En progreso</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-md">
                        <p className="font-medium text-gray-700">{dept.pending_count}</p>
                        <p className="text-xs text-gray-600">Pendientes</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/admin/departments/${dept.id}`}>
                      <ArrowUpRight className="mr-2 h-4 w-4" />
                      Ver detalle
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-gray-100 p-3 text-gray-600 mb-4">
                <Building className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium mb-1">No se encontraron departamentos</h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery
                  ? `No hay departamentos que coincidan con "${searchQuery}"`
                  : "No hay departamentos registrados en el sistema"}
              </p>
              <Button asChild>
                <Link href="/admin/departments/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear departamento
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
