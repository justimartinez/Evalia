"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search, Users, Building, CheckIcon, AlertCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function TrainingAssignmentForm({
  onSubmit,
  onSave,
  onPublish,
  onBack,
  isLoading,
  currentAssignedUsers = [],
  selectedDepartments = [],
  setSelectedDepartments,
}) {
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  // Convertir currentAssignedUsers a un Set para búsqueda eficiente
  const assignedUserIds = new Set(currentAssignedUsers.map((user) => user.id || user.user_id))

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setFetchError(null)

        // Cargar usuarios
        const usersResponse = await fetch("/api/users")
        if (!usersResponse.ok) {
          throw new Error(`Error al cargar usuarios: ${usersResponse.status} ${usersResponse.statusText}`)
        }

        const usersData = await usersResponse.json()
        setUsers(usersData || [])

        // Cargar departamentos
        try {
          const departmentsResponse = await fetch("/api/departments")
          if (!departmentsResponse.ok) {
            throw new Error(`Error HTTP: ${departmentsResponse.status}`)
          }

          // Primero obtener el texto de la respuesta
          const responseText = await departmentsResponse.text()

          // Verificar si la respuesta está vacía
          if (!responseText.trim()) {
            console.warn("La respuesta de departamentos está vacía")
            setDepartments([])
            return
          }

          // Intentar parsear el JSON
          try {
            const departmentsData = JSON.parse(responseText)

            // Verificar que departmentsData sea un array
            if (!Array.isArray(departmentsData)) {
              console.error("La respuesta no es un array:", departmentsData)
              throw new Error("La respuesta no es un array válido")
            }

            setDepartments(departmentsData)
          } catch (parseError) {
            console.error("Error al parsear JSON:", parseError, "Respuesta:", responseText)
            throw new Error("La respuesta no es un JSON válido")
          }
        } catch (deptError) {
          console.error("Error al cargar departamentos:", deptError)
          setFetchError(`Error al cargar departamentos: ${deptError.message}`)

          // Usar datos de ejemplo en caso de error
          setDepartments([
            {
              id: "1",
              name: "Administración",
              description: "Departamento de administración y gestión",
            },
            {
              id: "2",
              name: "Ventas",
              description: "Departamento de ventas y marketing",
            },
            {
              id: "3",
              name: "Atención al Cliente",
              description: "Departamento de atención y soporte al cliente",
            },
            {
              id: "4",
              name: "Análisis de Datos",
              description: "Departamento de análisis y procesamiento de datos",
            },
            {
              id: "5",
              name: "Operaciones",
              description: "Departamento de operaciones y logística",
            },
          ])
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
        setFetchError(`Error al cargar datos: ${error.message}`)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos. Usando datos de ejemplo.",
          variant: "destructive",
        })

        // Usar datos de ejemplo en caso de error
        setUsers([
          {
            id: "1",
            name: "Admin Usuario",
            email: "admin@evalia.com",
            role: "Administrador",
            branch: "Sede Central",
          },
          {
            id: "2",
            name: "Gerente Ejemplo",
            email: "gerente@evalia.com",
            role: "Gerente",
            branch: "Sede Norte",
          },
          {
            id: "3",
            name: "Empleado Prueba",
            email: "empleado@evalia.com",
            role: "Empleado",
            branch: "Sede Sur",
          },
          {
            id: "4",
            name: "Analista Datos",
            email: "analista@evalia.com",
            role: "Analista",
            branch: "Sede Central",
          },
          {
            id: "5",
            name: "Supervisor Equipo",
            email: "supervisor@evalia.com",
            role: "Supervisor",
            branch: "Sede Este",
          },
        ])

        setDepartments([
          {
            id: "1",
            name: "Administración",
            description: "Departamento de administración y gestión",
          },
          {
            id: "2",
            name: "Ventas",
            description: "Departamento de ventas y marketing",
          },
          {
            id: "3",
            name: "Atención al Cliente",
            description: "Departamento de atención y soporte al cliente",
          },
          {
            id: "4",
            name: "Análisis de Datos",
            description: "Departamento de análisis y procesamiento de datos",
          },
          {
            id: "5",
            name: "Operaciones",
            description: "Departamento de operaciones y logística",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [retryCount])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Verificar si onSubmit es una función antes de llamarla
    if (typeof onSubmit === "function") {
      onSubmit({ selectedUsers, selectedDepartments: selectedDepartments || [] })
    } else {
      console.error("onSubmit no es una función o no está definida")
      // Si estamos en el contexto de creación de capacitación, usamos setSelectedDepartments
      if (typeof setSelectedDepartments === "function") {
        setSelectedDepartments(selectedDepartments || [])
        toast({
          title: "Departamentos seleccionados",
          description: "Los departamentos han sido seleccionados correctamente",
        })
      } else {
        toast({
          title: "Error",
          description: "No se pudo procesar la selección. Por favor, inténtalo de nuevo.",
          variant: "destructive",
        })
      }
    }
  }

  const toggleUser = (userId) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleDepartment = (departmentId) => {
    // Si tenemos setSelectedDepartments como prop, usamos eso
    if (typeof setSelectedDepartments === "function") {
      setSelectedDepartments((prev) =>
        prev.includes(departmentId) ? prev.filter((id) => id !== departmentId) : [...prev, departmentId],
      )
    } else {
      // De lo contrario, usamos el estado local
      setSelectedDepartments((prev) =>
        prev.includes(departmentId) ? prev.filter((id) => id !== departmentId) : [...prev, departmentId],
      )
    }
  }

  // Filtrar usuarios ya asignados y por búsqueda
  const filteredUsers = users.filter((user) => {
    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.branch && user.branch.toLowerCase().includes(query))
      )
    }

    return true
  })

  // Filtrar departamentos por búsqueda
  const filteredDepartments = departments.filter((dept) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return dept.name.toLowerCase().includes(query)
    }
    return true
  })

  // Determinar si estamos en el contexto de creación de capacitación
  const isCreationContext = typeof onSave === "function" && typeof onPublish === "function"

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  if (fetchError) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al cargar datos</AlertTitle>
          <AlertDescription>{fetchError}</AlertDescription>
        </Alert>

        <div className="flex gap-2">
          <Button onClick={handleRetry} variant="outline">
            Reintentar
          </Button>
          <Button onClick={() => window.location.reload()}>Recargar página</Button>
        </div>

        <div className="mt-4 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
          <h3 className="font-medium text-yellow-800">Usando datos de ejemplo</h3>
          <p className="text-sm text-yellow-700 mt-1">
            Se están mostrando datos de ejemplo debido al error. Algunas funcionalidades pueden estar limitadas.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Usuarios</span>
            </TabsTrigger>
            <TabsTrigger value="departments" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Departamentos</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : filteredUsers.length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          {assignedUserIds.has(user.id) ? (
                            <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                              <CheckIcon className="h-3 w-3" />
                            </div>
                          ) : (
                            <Checkbox
                              id={`user-${user.id}`}
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={() => toggleUser(user.id)}
                            />
                          )}
                          <div className="flex-1 grid gap-0.5">
                            <Label
                              htmlFor={`user-${user.id}`}
                              className={`font-medium cursor-pointer ${assignedUserIds.has(user.id) ? "text-muted-foreground" : ""}`}
                            >
                              {user.name}
                              {assignedUserIds.has(user.id) && " (Ya asignado)"}
                            </Label>
                            <div className="text-xs text-muted-foreground flex flex-wrap gap-x-4">
                              <span>{user.email}</span>
                              {user.branch && <span>Sucursal: {user.branch}</span>}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery
                  ? "No se encontraron usuarios con esa búsqueda"
                  : "No hay usuarios disponibles para asignar"}
              </div>
            )}
          </TabsContent>

          <TabsContent value="departments" className="mt-4">
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : filteredDepartments.length > 0 ? (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {filteredDepartments.map((department) => (
                    <Card key={department.id} className="overflow-hidden">
                      <CardContent className="p-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`department-${department.id}`}
                            checked={selectedDepartments?.includes(department.id)}
                            onCheckedChange={() => toggleDepartment(department.id)}
                          />
                          <Label htmlFor={`department-${department.id}`} className="font-medium cursor-pointer">
                            {department.name}
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {searchQuery ? "No se encontraron departamentos con esa búsqueda" : "No hay departamentos disponibles"}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          {isCreationContext ? (
            <>
              {typeof onBack === "function" && (
                <Button type="button" variant="outline" onClick={onBack}>
                  Volver
                </Button>
              )}
              <div className="flex gap-2 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => typeof onSave === "function" && onSave()}
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  Guardar Borrador
                </Button>
                <Button
                  type="button"
                  onClick={() => typeof onPublish === "function" && onPublish()}
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  Publicar Capacitación
                </Button>
              </div>
            </>
          ) : (
            <Button
              type="submit"
              disabled={
                isLoading || (selectedUsers.length === 0 && (!selectedDepartments || selectedDepartments.length === 0))
              }
              className="ml-auto cursor-pointer"
            >
              {isLoading ? "Asignando..." : "Asignar capacitación"}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
