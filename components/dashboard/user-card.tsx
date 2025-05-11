"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserRoleBadge } from "./user-role-badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, UserCog, Eye } from "lucide-react"
import Link from "next/link"

interface UserCardProps {
  user: {
    id: string
    name: string
    email: string
    role: string
    branch: string
    image?: string
    departments?: { name: string; position: string }[]
  }
  onEdit: (userId: string) => void
  onDelete: (userId: string) => void
  onManageRoles: (userId: string) => void
}

export function UserCard({ user, onEdit, onDelete, onManageRoles }: UserCardProps) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2)

  return (
    <Card className="overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.image || ""} alt={user.name} />
            <AvatarFallback className="bg-blue-600/30 text-blue-200">{initials}</AvatarFallback>
          </Avatar>
          <UserRoleBadge role={user.role} />
        </div>
        <CardTitle className="mt-2 text-white">{user.name}</CardTitle>
        <CardDescription className="text-blue-200">{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-300">Sucursal:</span>
            <span className="text-white">{user.branch}</span>
          </div>
          {user.departments && user.departments.length > 0 && (
            <div className="flex justify-between">
              <span className="text-blue-300">Departamento:</span>
              <span className="text-white">{user.departments[0].name}</span>
            </div>
          )}
          {user.departments && user.departments.length > 0 && (
            <div className="flex justify-between">
              <span className="text-blue-300">Posición:</span>
              <span className="text-white">{user.departments[0].position}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-4 border-t border-white/10">
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-300 hover:text-blue-100 hover:bg-blue-500/20"
          onClick={() => onEdit(user.id)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Editar
        </Button>
        <Button variant="ghost" size="sm" className="text-blue-300 hover:text-blue-100 hover:bg-blue-500/20" asChild>
          <Link href={`/admin/users/${user.id}`}>
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-300 hover:text-blue-100 hover:bg-blue-500/20"
          onClick={() => onManageRoles(user.id)}
        >
          <UserCog className="h-4 w-4 mr-1" />
          Roles
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-300 hover:text-red-100 hover:bg-red-500/20"
          onClick={() => onDelete(user.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  )
}
