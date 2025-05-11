"use client"

import { useState, useEffect } from "react"
import { UserCard } from "./user-card"
import { UserForm } from "./user-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Loader2, Plus, Search, UserPlus } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface User {
  id: string
  name: string
  email: string
  role: string
  branch: string
  image?: string
  departments?: { name: string; position: string }[]
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [branchFilter, setBranchFilter] = useState("")

  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [showRolesDialog, setShowRolesDialog] = useState(false)
  const [userForRoles, setUserForRoles] = useState<string | null>(null)

  const { toast } = useToast()

  // Cargar usuarios
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
        setFilteredUsers(data)
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filtrar usuarios
  useEffect(() => {
    let result = [...users]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term),
      )
    }

    if (roleFilter) {
      result = result.filter((user) => user.role === roleFilter)
    }

    if (branchFilter) {
      result = result.filter((user) => user.branch === branchFilter)
    }

    setFilteredUsers(result)
  }, [users, searchTerm, roleFilter, branchFilter])

  // Manejar edición de usuario
  const handleEditUser = (userId: string) => {
    setEditingUserId(userId)
    setShowUserForm(true)
  }

  // Manejar eliminación de usuario
  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId)
    setShowDeleteDialog(true)
  }

  // Confirmar eliminación de usuario
  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      const response = await fetch(`/api/users/${userToDelete}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Usuario eliminado",
          description: "El usuario ha sido eliminado exitosamente",
        })
        fetchUsers()
      } else {
        toast({
          title: "Error",
          description: "No se pudo eliminar el usuario",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario",
        variant: "destructive",
      })
    } finally {
      setShowDeleteDialog(false)
      setUserToDelete(null)
    }
  }

  // Manejar gestión de roles
  const handleManageRoles = (userId: string) => {
    setUserForRoles(userId)
    setShowRolesDialog(true)
  }

  // Cerrar formulario de usuario
  const handleCloseUserForm = () => {
    setShowUserForm(false)
    setEditingUserId(null)
  }

  // Manejar éxito al guardar usuario
  const handleUserSaved = () => {
    toast({
      title: editingUserId ? "Usuario actualizado" : "Usuario creado",
      description: editingUserId
        ? "El usuario ha sido actualizado exitosamente"
        : "El usuario ha sido creado exitosamente",
    })
    handleCloseUserForm()
    fetchUsers()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">Gestión de Usuarios</h2>
        <Button onClick={() => setShowUserForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300 h-4 w-4" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Filtrar por rol" />
          </SelectTrigger>
          <SelectContent className="bg-blue-900 border-white/20">
            <SelectItem value="" className="text-white hover:bg-blue-800">
              Todos los roles
            </SelectItem>
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

        <Select value={branchFilter} onValueChange={setBranchFilter}>
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue placeholder="Filtrar por sucursal" />
          </SelectTrigger>
          <SelectContent className="bg-blue-900 border-white/20">
            <SelectItem value="" className="text-white hover:bg-blue-800">
              Todas las sucursales
            </SelectItem>
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

      {/* Lista de usuarios */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-blue-200">Cargando usuarios...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-lg border border-white/10">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/30">
            <Search className="h-6 w-6 text-blue-300" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-white">No se encontraron usuarios</h3>
          <p className="mt-2 text-sm text-blue-200">
            {searchTerm || roleFilter || branchFilter
              ? "Intente con otros criterios de búsqueda"
              : "Comience creando un nuevo usuario"}
          </p>
          <div className="mt-6">
            <Button onClick={() => setShowUserForm(true)} className="bg-orange-500 hover:bg-orange-600 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onManageRoles={handleManageRoles}
            />
          ))}
        </div>
      )}

      {/* Modal de formulario de usuario */}
      <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
        <DialogContent className="sm:max-w-md bg-blue-950 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">{editingUserId ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
            <DialogDescription className="text-blue-200">
              {editingUserId
                ? "Actualice la información del usuario"
                : "Complete el formulario para crear un nuevo usuario"}
            </DialogDescription>
          </DialogHeader>
          <UserForm userId={editingUserId || undefined} onSuccess={handleUserSaved} onCancel={handleCloseUserForm} />
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-blue-950 border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription className="text-blue-200">
              Esta acción no se puede deshacer. El usuario será eliminado permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-red-500 hover:bg-red-600 text-white">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo de gestión de roles (placeholder) */}
      <Dialog open={showRolesDialog} onOpenChange={setShowRolesDialog}>
        <DialogContent className="sm:max-w-md bg-blue-950 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Gestionar Roles y Permisos</DialogTitle>
            <DialogDescription className="text-blue-200">Administre los roles y permisos del usuario</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-white">Funcionalidad en desarrollo</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowRolesDialog(false)} className="bg-orange-500 hover:bg-orange-600 text-white">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
