"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"

interface Department {
  id: number
  name: string
}

interface UserFormProps {
  userId?: string
  onSuccess: () => void
  onCancel: () => void
}

export function UserForm({ userId, onSuccess, onCancel }: UserFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [branch, setBranch] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [position, setPosition] = useState("")
  const [departments, setDepartments] = useState<Department[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)

  const isEditing = !!userId

  // Cargar departamentos
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/departments")
        if (response.ok) {
          const data = await response.json()
          setDepartments(data)
        }
      } catch (error) {
        console.error("Error al cargar departamentos:", error)
      }
    }

    fetchDepartments()
  }, [])

  // Cargar datos del usuario si estamos editando
  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        setIsLoadingData(true)
        try {
          const response = await fetch(`/api/users/${userId}`)
          if (response.ok) {
            const user = await response.json()
            setName(user.name)
            setEmail(user.email)
            setRole(user.role)
            setBranch(user.branch)

            if (user.departments && user.departments.length > 0) {
              setDepartmentId(user.departments[0].id.toString())
              setPosition(user.departments[0].position)
            }
          } else {
            setError("Error al cargar datos del usuario")
          }
        } catch (error) {
          console.error("Error al cargar usuario:", error)
          setError("Error al cargar datos del usuario")
        } finally {
          setIsLoadingData(false)
        }
      }

      fetchUser()
    }
  }, [userId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const userData = {
        name,
        email,
        role,
        branch,
        departmentId: departmentId ? Number.parseInt(departmentId) : undefined,
        position,
      }

      // Solo incluir contraseña si se proporciona (para edición) o es obligatoria (para creación)
      if (password || !isEditing) {
        Object.assign(userData, { password })
      }

      const url = isEditing ? `/api/users/${userId}` : "/api/users"
      const method = isEditing ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const data = await response.json()
        setError(data.error || "Error al guardar usuario")
      }
    } catch (error) {
      console.error("Error al guardar usuario:", error)
      setError("Error al guardar usuario")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
          <p className="mt-2 text-blue-200">Cargando datos del usuario...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">{isEditing ? "Editar Usuario" : "Nuevo Usuario"}</CardTitle>
        <CardDescription className="text-blue-200">
          {isEditing ? "Actualice la información del usuario" : "Complete el formulario para crear un nuevo usuario"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">
              Nombre completo
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">
              {isEditing ? "Contraseña (dejar en blanco para mantener)" : "Contraseña"}
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required={!isEditing}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-white">
                Rol
              </Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger id="role" className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent className="bg-blue-900 border-white/20">
                  <SelectItem value="Administrador" className="text-white hover:bg-blue-800">
                    Administrador
                  </SelectItem>
                  <SelectItem value="Gerente" className="text-white hover:bg-blue-800">
                    Gerente
                  </SelectItem>
                  <SelectItem value="Supervisor" className="text-white hover:bg-blue-800">
                    Supervisor
                  </SelectItem>
                  <SelectItem value="Empleado" className="text-white hover:bg-blue-800">
                    Empleado
                  </SelectItem>
                  <SelectItem value="Analista" className="text-white hover:bg-blue-800">
                    Analista
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch" className="text-white">
                Sucursal
              </Label>
              <Select value={branch} onValueChange={setBranch} required>
                <SelectTrigger id="branch" className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Seleccionar sucursal" />
                </SelectTrigger>
                <SelectContent className="bg-blue-900 border-white/20">
                  <SelectItem value="Centro" className="text-white hover:bg-blue-800">
                    Centro
                  </SelectItem>
                  <SelectItem value="Norte" className="text-white hover:bg-blue-800">
                    Norte
                  </SelectItem>
                  <SelectItem value="Sur" className="text-white hover:bg-blue-800">
                    Sur
                  </SelectItem>
                  <SelectItem value="Este" className="text-white hover:bg-blue-800">
                    Este
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department" className="text-white">
                Departamento
              </Label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger id="department" className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent className="bg-blue-900 border-white/20">
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()} className="text-white hover:bg-blue-800">
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-white">
                Posición
              </Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="Ej: Analista Senior"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2 border-t border-white/10 pt-4">
        <Button variant="outline" onClick={onCancel} className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading} className="bg-orange-500 hover:bg-orange-600 text-white">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Actualizando..." : "Creando..."}
            </>
          ) : isEditing ? (
            "Actualizar Usuario"
          ) : (
            "Crear Usuario"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
