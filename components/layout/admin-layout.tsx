"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
  BarChart3,
  BookOpen,
  FileQuestion,
  Home,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
  Bell,
  Search,
  ChevronDown,
  HelpCircle,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Verificar si el usuario está autenticado y es administrador
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser.role === "admin") {
          setUser(parsedUser)
        } else {
          router.push("/login")
        }
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Error al verificar usuario:", error)
      router.push("/login")
    } finally {
      setLoading(false)
    }

    // Detectar tamaño de pantalla para colapsar automáticamente en pantallas pequeñas
    const handleResize = () => {
      setCollapsed(window.innerWidth < 1280)
    }

    if (typeof window !== "undefined") {
      handleResize()
      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }
  }, [router])

  const handleLogout = () => {
    try {
      localStorage.removeItem("user")
      router.push("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-blue-600 dark:text-blue-400 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // No renderizar nada mientras redirige
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: Home, badge: null },
    { name: "Capacitaciones", href: "/admin/trainings", icon: BookOpen, badge: "12" },
    { name: "Evaluaciones", href: "/admin/evaluations", icon: FileQuestion, badge: "5" },
    { name: "Reportes", href: "/admin/reports", icon: BarChart3, badge: null },
    { name: "Usuarios", href: "/admin/users", icon: Users, badge: "3" },
    { name: "Configuración", href: "/admin/settings", icon: Settings, badge: null },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar para pantallas grandes */}
      <div
        className={cn(
          "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-30 transition-all duration-300 ease-in-out",
          collapsed ? "lg:w-20" : "lg:w-64",
        )}
      >
        <div className="flex flex-col flex-grow border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              {collapsed ? (
                <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                  E
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                    E
                  </div>
                  <span className="text-xl font-bold dark:text-white">
                    Evalia <span className="text-blue-600">360</span>
                  </span>
                </>
              )}
            </Link>
            <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setCollapsed(!collapsed)}>
              <ChevronDown className={cn("h-5 w-5 transition-transform", collapsed ? "rotate-90" : "rotate-270")} />
            </Button>
          </div>
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative group",
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200",
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600 dark:text-blue-400" : "")} />
                    {!collapsed && <span>{item.name}</span>}
                    {item.badge && (
                      <Badge
                        className={cn(
                          "ml-auto",
                          isActive
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50">
                        {item.name}
                      </div>
                    )}
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
          <div className={cn("p-4 border-t border-gray-200 dark:border-gray-800", collapsed ? "items-center" : "")}>
            {collapsed ? (
              <div className="flex flex-col items-center">
                <Avatar className="h-10 w-10 mb-2">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="icon" className="mt-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium dark:text-white">{user.name || "Usuario"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.email || "usuario@ejemplo.com"}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar móvil */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex flex-col h-full">
            <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-800">
              <Link href="/admin/dashboard" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
                  E
                </div>
                <span className="text-xl font-bold dark:text-white">
                  Evalia <span className="text-blue-600">360</span>
                </span>
              </Link>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Cerrar menú</span>
              </Button>
            </div>
            <ScrollArea className="flex-1 px-3 py-4">
              <nav className="flex flex-col gap-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                        isActive
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200",
                      )}
                      onClick={() => setOpen(false)}
                    >
                      <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600 dark:text-blue-400" : "")} />
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge
                          className={cn(
                            "ml-auto",
                            isActive
                              ? "bg-blue-600 hover:bg-blue-700"
                              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </nav>
            </ScrollArea>
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium dark:text-white">{user.name || "Usuario"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email || "usuario@ejemplo.com"}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Contenido principal */}
      <div className={cn("flex-1 transition-all duration-300 ease-in-out", collapsed ? "lg:ml-20" : "lg:ml-64")}>
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-white px-4 sm:px-6 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex flex-1 items-center gap-4">
            <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setOpen(true)}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>
            <div className="relative hidden md:flex w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar..."
                className="pl-8 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-600"></span>
            </Button>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
