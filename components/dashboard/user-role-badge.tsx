import { Badge } from "@/components/ui/badge"

interface UserRoleBadgeProps {
  role: string
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  let badgeStyle = ""

  switch (role.toLowerCase()) {
    case "admin":
    case "administrador":
      badgeStyle = "bg-red-500/20 text-red-300 hover:bg-red-500/30 border-red-500/30"
      break
    case "gerente":
    case "manager":
      badgeStyle = "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border-purple-500/30"
      break
    case "supervisor":
      badgeStyle = "bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border-blue-500/30"
      break
    case "empleado":
    case "employee":
      badgeStyle = "bg-green-500/20 text-green-300 hover:bg-green-500/30 border-green-500/30"
      break
    case "analista":
    case "analyst":
      badgeStyle = "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30 border-yellow-500/30"
      break
    default:
      badgeStyle = "bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 border-gray-500/30"
  }

  return (
    <Badge className={badgeStyle} variant="outline">
      {role}
    </Badge>
  )
}
