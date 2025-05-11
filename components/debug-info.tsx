"use client"

import { useState } from "react"
import { getCurrentUser } from "@/lib/client-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Bug } from "lucide-react"

export default function DebugInfo() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState(() => getCurrentUser())
  const [cookies, setCookies] = useState(() => {
    if (typeof document !== "undefined") {
      return document.cookie
    }
    return ""
  })

  const refreshInfo = () => {
    setUser(getCurrentUser())
    if (typeof document !== "undefined") {
      setCookies(document.cookie)
    }
  }

  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Bug className="h-4 w-4" />
            Debug
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <Card className="w-80 mt-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Información de depuración</CardTitle>
              <CardDescription className="text-xs">Datos del usuario y sesión</CardDescription>
            </CardHeader>
            <CardContent className="text-xs">
              <div className="space-y-2">
                <div>
                  <strong>Usuario actual:</strong>
                  <pre className="mt-1 bg-muted p-2 rounded text-[10px] overflow-auto max-h-32">
                    {user ? JSON.stringify(user, null, 2) : "No hay usuario"}
                  </pre>
                </div>
                <div>
                  <strong>Cookies:</strong>
                  <pre className="mt-1 bg-muted p-2 rounded text-[10px] overflow-auto max-h-32">
                    {cookies || "No hay cookies"}
                  </pre>
                </div>
                <div>
                  <strong>Entorno:</strong> {process.env.NODE_ENV}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button size="sm" variant="outline" className="w-full text-xs" onClick={refreshInfo}>
                Actualizar información
              </Button>
            </CardFooter>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
