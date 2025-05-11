"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Users, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function EvaluationAssignmentForm({ selectedUsers, setSelectedUsers, onBack, onSave }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("users")
  const [selectedDepartment, setSelectedDepartment] = useState("")

  // Datos de ejemplo para usuarios y departamentos
  const usersData = [
    { id: "1", name: "Juan Pérez", email: "juan@example.com", department_id: "1" },
    { id: "2", name: "María López", email: "maria@example.com", department_id: "1" },
    { id: "3", name: "Carlos Rodríguez", email: "carlos@example.com", department_id: "2" },
    { id: "4", name: "Ana Martínez", email: "ana@example.com", department_id: "2" },
    { id: "5", name: "Pedro Sánchez", email: "pedro@example.com", department_id: "3" },
    { id: "6", name: "Laura García", email: "laura@example.com", department_id: "3" },
    { id: "7", name: "Miguel Torres", email: "miguel@example.com", department_id: "4" },
    { id: "8", name: "Sofía Ruiz", email: "sofia@example.com", department_id: "4" },
  ]

  const departments = [
    { id: "1", name: "Ventas" },
    { id: "2", name: "Marketing" },
    { id: "3", name: "Sistemas" },
    { id: "4", name: "RRHH" },
  ]

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment ? user.department_id === selectedDepartment : true

    return matchesSearch && matchesDepartment
  })

  const handleToggleUser = (user) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id))
    } else {
      setSelectedUsers([...selectedUsers, user])
    }
  }

  const handleSelectAllUsers = () => {
    if (selectedUsers.length === filteredUsers.length) {
      // Si todos están seleccionados, deseleccionar todos
      setSelectedUsers([])
    } else {
      // Seleccionar todos los filtrados
      const newSelectedUsers = [...selectedUsers]
      filteredUsers.forEach((user) => {
        if (!newSelectedUsers.some((u) => u.id === user.id)) {
          newSelectedUsers.push(user)
        }
      })
      setSelectedUsers(newSelectedUsers)
    }
  }

  const handleSelectDepartment = (departmentId) => {
    if (departmentId === "") {
      setSelectedDepartment("")
      return
    }

    setSelectedDepartment(departmentId)

    if (activeTab === "departments") {
      // Seleccionar todos los usuarios del departamento
      const departmentUsers = usersData.filter((user) => user.department_id === departmentId)
      const newSelectedUsers = [...selectedUsers]

      departmentUsers.forEach((user) => {
        if (!newSelectedUsers.some((u) => u.id === user.id)) {
          newSelectedUsers.push(user)
        }
      })

      setSelectedUsers(newSelectedUsers)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asignación de Evaluación</CardTitle>
        <CardDescription>Asigna esta evaluación a usuarios individuales o departamentos completos.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">
              <User className="mr-2 h-4 w-4" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger value="departments">
              <Users className="mr-2 h-4 w-4" />
              Departamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-4 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar usuarios..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedDepartment} onValueChange={handleSelectDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={
                    filteredUsers.length > 0 &&
                    filteredUsers.every((user) => selectedUsers.some((u) => u.id === user.id))
                  }
                  onCheckedChange={handleSelectAllUsers}
                />
                <Label htmlFor="select-all">Seleccionar todos</Label>
              </div>
              <Badge variant="outline" className="rounded-full px-3">
                {selectedUsers.length} seleccionados
              </Badge>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-start space-x-3 border rounded-md p-3 hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`user-${user.id}`}
                      checked={selectedUsers.some((u) => u.id === user.id)}
                      onCheckedChange={() => handleToggleUser(user)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={`user-${user.id}`} className="text-sm font-medium leading-none cursor-pointer">
                        {user.name}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {departments.find((d) => d.id === user.department_id)?.name}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No se encontraron usuarios que coincidan con tu búsqueda.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="departments" className="mt-4 space-y-4">
            <div className="space-y-2">
              {departments.map((department) => {
                const departmentUsers = usersData.filter((user) => user.department_id === department.id)
                const selectedCount = departmentUsers.filter((user) =>
                  selectedUsers.some((u) => u.id === user.id),
                ).length
                const isPartiallySelected = selectedCount > 0 && selectedCount < departmentUsers.length
                const isFullySelected = selectedCount === departmentUsers.length && departmentUsers.length > 0

                return (
                  <div
                    key={department.id}
                    className="flex items-start space-x-3 border rounded-md p-4 hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`department-${department.id}`}
                      checked={isFullySelected}
                      indeterminate={isPartiallySelected}
                      onCheckedChange={() => handleSelectDepartment(department.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor={`department-${department.id}`}
                          className="text-sm font-medium leading-none cursor-pointer"
                        >
                          {department.name}
                        </Label>
                        <Badge variant="outline" className="rounded-full px-3">
                          {selectedCount}/{departmentUsers.length} usuarios
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {departmentUsers.length} usuarios en este departamento
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Volver
        </Button>
        <Button onClick={onSave}>Guardar Evaluación</Button>
      </CardFooter>
    </Card>
  )
}
