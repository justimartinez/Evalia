"use client"

import { useEffect, useState } from "react"

// Tipo para el usuario
export type User = {
  id: number | string
  name: string
  email: string
  role: string
  branch?: string
  image?: string
}

// Función para obtener el usuario actual desde localStorage
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") {
    console.log("getCurrentUser: Ejecutando en el servidor, no hay acceso a localStorage")
    return null
  }

  try {
    const userJson = localStorage.getItem("user") || window.localStorage.getItem("user")
    if (!userJson) {
      console.log("getCurrentUser: No se encontró usuario en localStorage")
      return null
    }

    const user = JSON.parse(userJson)
    console.log("getCurrentUser: Usuario obtenido de localStorage", user)
    return user
  } catch (error) {
    console.error("getCurrentUser: Error al obtener usuario de localStorage", error)
    return null
  }
}

// Hook para usar el usuario actual
export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const userJson = localStorage.getItem("user")
      if (userJson) {
        setUser(JSON.parse(userJson))
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return { user, loading, login, logout }
}

// Función para guardar el usuario en una cookie (para el middleware)
export function saveUserToCookie(user: User) {
  if (typeof document === "undefined") return

  const expires = new Date()
  expires.setDate(expires.getDate() + 7) // Expira en 7 días

  document.cookie = `user=${JSON.stringify(user)}; expires=${expires.toUTCString()}; path=/`
}

// Función para obtener el usuario de una cookie
export function getUserFromCookie(): User | null {
  if (typeof document === "undefined") return null

  const cookies = document.cookie.split("; ")
  const userCookie = cookies.find((cookie) => cookie.startsWith("user="))

  if (!userCookie) return null

  try {
    return JSON.parse(userCookie.split("=")[1])
  } catch (error) {
    console.error("Error al parsear cookie de usuario:", error)
    return null
  }
}
