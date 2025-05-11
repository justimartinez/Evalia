import type React from "react"
import EmployeeLayout from "@/components/layout/employee-layout"

// Datos de usuario de ejemplo para la vista previa
const mockUser = {
  name: "Usuario Empleado",
  email: "1",
  role: "employee",
  image: null,
}

export default function Layout({ children }: { children: React.ReactNode }) {
  // En un entorno de producción, aquí verificaríamos la sesión del servidor
  // Pero para la vista previa, usamos datos de usuario de ejemplo
  return <EmployeeLayout user={mockUser}>{children}</EmployeeLayout>
}
