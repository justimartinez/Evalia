import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Verificar si el usuario tiene permisos de administrador
  if (!["admin", "administrador"].includes(session.user.role.toLowerCase())) {
    return (
      <div className="p-6 bg-white/5 rounded-lg border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">Acceso Restringido</h2>
        <p className="text-blue-200">
          No tienes permisos para acceder a la configuración del sistema. Esta sección está reservada para
          administradores.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Configuración del Sistema</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Departamentos</CardTitle>
            <CardDescription className="text-blue-200">Gestiona los departamentos de la organización</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-100">
              Funcionalidad en desarrollo. Próximamente podrás crear, editar y eliminar departamentos.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Categorías de Usuario</CardTitle>
            <CardDescription className="text-blue-200">Configura las categorías y permisos de usuarios</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-100">
              Funcionalidad en desarrollo. Próximamente podrás personalizar los permisos para cada categoría de usuario.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Sucursales</CardTitle>
            <CardDescription className="text-blue-200">Administra las sucursales de la empresa</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-100">
              Funcionalidad en desarrollo. Próximamente podrás gestionar las sucursales y su información.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Configuración General</CardTitle>
            <CardDescription className="text-blue-200">Ajustes generales del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-100">
              Funcionalidad en desarrollo. Próximamente podrás configurar parámetros generales del sistema como
              notificaciones, seguridad y apariencia.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
