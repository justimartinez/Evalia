"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function NeonAuthStatus() {
  const { data: session } = useSession()
  const [syncStatus, setSyncStatus] = useState<{
    loading: boolean
    synced: boolean
    lastChecked: Date | null
    user: any | null
    error: string | null
  }>({
    loading: true,
    synced: false,
    lastChecked: null,
    user: null,
    error: null,
  })

  // Verificar estado de sincronización
  const checkSyncStatus = async () => {
    if (!session) return

    setSyncStatus((prev) => ({ ...prev, loading: true }))

    try {
      const response = await fetch("/api/auth/neon-sync")
      const data = await response.json()

      setSyncStatus({
        loading: false,
        synced: data.success && data.synced,
        lastChecked: new Date(),
        user: data.user,
        error: data.error || null,
      })
    } catch (error) {
      setSyncStatus({
        loading: false,
        synced: false,
        lastChecked: new Date(),
        user: null,
        error: "Error al verificar sincronización",
      })
    }
  }

  // Forzar sincronización
  const forceSync = async () => {
    if (!session) return

    setSyncStatus((prev) => ({ ...prev, loading: true }))

    try {
      const response = await fetch("/api/auth/neon-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            manualSync: true,
            syncTime: new Date().toISOString(),
          },
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Verificar estado actualizado
        checkSyncStatus()
      } else {
        setSyncStatus((prev) => ({
          ...prev,
          loading: false,
          error: data.error || "Error al sincronizar",
        }))
      }
    } catch (error) {
      setSyncStatus((prev) => ({
        ...prev,
        loading: false,
        error: "Error al sincronizar con Neon Auth",
      }))
    }
  }

  // Verificar estado al cargar el componente
  useEffect(() => {
    if (session) {
      checkSyncStatus()
    }
  }, [session])

  if (!session) {
    return null
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Estado de Neon Auth</CardTitle>
        <CardDescription>Sincronización entre tu proveedor de autenticación y Neon Database</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Estado:</span>
            {syncStatus.loading ? (
              <Badge variant="outline" className="animate-pulse">
                Verificando...
              </Badge>
            ) : syncStatus.synced ? (
              <Badge variant="success" className="bg-green-500 text-white">
                Sincronizado
              </Badge>
            ) : (
              <Badge variant="destructive">No sincronizado</Badge>
            )}
          </div>

          {syncStatus.lastChecked && (
            <div className="flex items-center justify-between">
              <span className="font-medium">Última verificación:</span>
              <span className="text-sm text-gray-500">{syncStatus.lastChecked.toLocaleString()}</span>
            </div>
          )}

          {syncStatus.user && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <h4 className="text-sm font-medium mb-2">Datos sincronizados:</h4>
              <div className="text-xs space-y-1">
                <div>
                  <span className="font-medium">ID:</span> {syncStatus.user.id}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {syncStatus.user.email}
                </div>
                <div>
                  <span className="font-medium">Rol:</span> {syncStatus.user.role}
                </div>
                <div>
                  <span className="font-medium">Actualizado:</span>{" "}
                  {new Date(syncStatus.user.lastUpdated).toLocaleString()}
                </div>
              </div>
            </div>
          )}

          {syncStatus.error && <div className="text-red-500 text-sm mt-2">Error: {syncStatus.error}</div>}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={checkSyncStatus} disabled={syncStatus.loading}>
          Verificar
        </Button>
        <Button onClick={forceSync} disabled={syncStatus.loading}>
          Forzar sincronización
        </Button>
      </CardFooter>
    </Card>
  )
}
