import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Award, BarChart } from "lucide-react"
import Link from "next/link"

export default function EmployeeDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Empleado</h1>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de control. Aquí puedes ver tus capacitaciones y evaluaciones pendientes.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacitaciones Pendientes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Tienes 3 capacitaciones pendientes por completar</p>
            <Button asChild className="mt-4 w-full" size="sm">
              <Link href="/employee/trainings">Ver Capacitaciones</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluaciones Pendientes</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Tienes 2 evaluaciones pendientes por realizar</p>
            <Button asChild className="mt-4 w-full" size="sm">
              <Link href="/employee/evaluations">Ver Evaluaciones</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">Has completado el 75% de tus capacitaciones asignadas</p>
            <Button asChild className="mt-4 w-full" size="sm">
              <Link href="/employee/progress">Ver Progreso</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Capacitaciones Recientes</CardTitle>
            <CardDescription>Últimas capacitaciones que has completado o están en progreso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Seguridad en el Trabajo</p>
                  <p className="text-sm text-muted-foreground">Completado: 85%</p>
                </div>
                <Button variant="outline" size="sm">
                  Continuar
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Atención al Cliente</p>
                  <p className="text-sm text-muted-foreground">Completado: 100%</p>
                </div>
                <Button variant="outline" size="sm">
                  Ver Certificado
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Nuevas Tecnologías</p>
                  <p className="text-sm text-muted-foreground">Completado: 50%</p>
                </div>
                <Button variant="outline" size="sm">
                  Continuar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Evaluaciones</CardTitle>
            <CardDescription>Evaluaciones programadas para los próximos días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Evaluación de Desempeño</p>
                  <p className="text-sm text-muted-foreground">Fecha: 15/05/2023</p>
                </div>
                <Button variant="outline" size="sm">
                  Preparar
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Evaluación de Conocimientos</p>
                  <p className="text-sm text-muted-foreground">Fecha: 22/05/2023</p>
                </div>
                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
