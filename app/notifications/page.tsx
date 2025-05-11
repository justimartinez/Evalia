"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell, ArrowLeft, CheckCircle } from "lucide-react"
import { useSession } from "next-auth/react"

interface Notification {
  id: number
  title: string
  message: string
  type: string
  is_read: boolean
  created_at: string
  action_url?: string
}

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications()
    }
  }, [session])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/notifications")
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: "POST",
      })
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/read-all", {
        method: "POST",
      })
      if (response.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "training_assigned":
        return <Bell className="h-5 w-5 text-blue-500" />
      case "training_completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Link
          href="/employee"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al dashboard
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Notificaciones</h1>
          {!loading && notifications.some((n) => !n.is_read) && (
            <Button variant="outline" onClick={markAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todas las notificaciones</CardTitle>
          <CardDescription>
            {loading ? "Cargando notificaciones..." : `${notifications.length} notificaciones en total`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-lg p-4 ${!notification.is_read ? "bg-orange-50" : ""}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getTypeIcon(notification.type)}
                      <h3 className="font-medium ml-2">{notification.title}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(notification.created_at)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    {!notification.is_read && (
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                        Nueva
                      </Badge>
                    )}
                    <div className="flex space-x-2 ml-auto">
                      {!notification.is_read && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                          Marcar como leída
                        </Button>
                      )}
                      {notification.action_url && (
                        <Button
                          size="sm"
                          onClick={() => {
                            if (!notification.is_read) {
                              markAsRead(notification.id)
                            }
                            window.location.href = notification.action_url!
                          }}
                        >
                          Ver detalles
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No hay notificaciones</h3>
              <p className="text-muted-foreground text-center mt-1">No tienes notificaciones en este momento.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
