"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BookOpen, FileText, Award, Settings, Menu, X, LogOut, BarChart } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface EmployeeLayoutProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
  }
  children: React.ReactNode
}

export default function EmployeeLayout({ user, children }: EmployeeLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(user)

  useEffect(() => {
    // Intentar obtener el usuario del localStorage si está disponible
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser))
      } else if (user) {
        // Si no hay usuario en localStorage pero se proporcionó uno en las props, guardarlo
        localStorage.setItem("user", JSON.stringify(user))
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }, [user])

  const handleSignOut = () => {
    try {
      localStorage.removeItem("user")
    } catch (error) {
      console.error("Error removing user from localStorage:", error)
    }
    router.push("/login")
  }

  const routes = [
    {
      href: "/employee/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/employee/trainings",
      label: "Capacitaciones",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      href: "/employee/progress",
      label: "Mi Progreso",
      icon: <BarChart className="h-5 w-5" />,
    },
    {
      href: "/employee/evaluations",
      label: "Evaluaciones",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      href: "/employee/results",
      label: "Resultados",
      icon: <Award className="h-5 w-5" />,
    },
    {
      href: "/employee/settings",
      label: "Configuración",
      icon: <Settings className="h-5 w-5" />,
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar para pantallas grandes */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-white border-r overflow-y-auto">
          <div className="flex items-center justify-center h-16 flex-shrink-0 px-4">
            <Link href="/employee/dashboard" className="flex items-center">
              <span className="text-xl font-bold">Evalia</span>
              <span className="text-xl font-bold text-orange-500">.</span>
            </Link>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-4 space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                    pathname === route.href
                      ? "bg-orange-50 text-orange-600"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                >
                  {route.icon}
                  <span className="ml-3">{route.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t p-4">
            <div className="flex items-center">
              <div>
                <Avatar>
                  <AvatarImage src={currentUser?.image || ""} />
                  <AvatarFallback>
                    {currentUser?.name
                      ?.split(" ")
                      .map((n) => n?.[0] || "")
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{currentUser?.name}</p>
                <p className="text-xs font-medium text-gray-500">{currentUser?.email}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={handleSignOut} aria-label="Cerrar sesión">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col flex-1 md:pl-64">
        {/* Barra superior para móviles */}
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b">
          <div className="flex items-center justify-between">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 sm:max-w-xs">
                <div className="flex items-center justify-center h-16 flex-shrink-0 px-4">
                  <Link href="/employee/dashboard" className="flex items-center" onClick={() => setOpen(false)}>
                    <span className="text-xl font-bold">Evalia</span>
                    <span className="text-xl font-bold text-orange-500">.</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4"
                    onClick={() => setOpen(false)}
                    aria-label="Cerrar menú"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors",
                        pathname === route.href
                          ? "bg-orange-50 text-orange-600"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {route.icon}
                      <span className="ml-3">{route.label}</span>
                    </Link>
                  ))}
                </nav>
                <div className="flex-shrink-0 flex border-t p-4 mt-auto">
                  <div className="flex items-center">
                    <div>
                      <Avatar>
                        <AvatarImage src={currentUser?.image || ""} />
                        <AvatarFallback>
                          {currentUser?.name
                            ?.split(" ")
                            .map((n) => n?.[0] || "")
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">{currentUser?.name}</p>
                      <p className="text-xs font-medium text-gray-500">{currentUser?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-auto"
                    onClick={handleSignOut}
                    aria-label="Cerrar sesión"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <div className="flex items-center">
              <Link href="/employee/dashboard" className="flex items-center">
                <span className="text-xl font-bold">Evalia</span>
                <span className="text-xl font-bold text-orange-500">.</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser?.image || ""} />
                <AvatarFallback>
                  {currentUser?.name
                    ?.split(" ")
                    .map((n) => n?.[0] || "")
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>

        {/* Barra superior para desktop */}
        <div className="hidden md:flex md:justify-end md:items-center md:h-16 md:bg-white md:border-b md:px-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">{currentUser?.name}</span>
          </div>
        </div>

        {/* Contenido de la página */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
