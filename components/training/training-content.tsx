"use client"

import { useState } from "react"
import { CheckCircle, Play, FileText, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export function TrainingContent({ content }) {
  const [expandedItem, setExpandedItem] = useState(null)

  const handleToggleItem = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId)
  }

  const handleMarkAsCompleted = (itemId) => {
    // En una aplicación real, aquí enviaríamos una solicitud al servidor
    // para marcar el contenido como completado
    console.log(`Marcando como completado: ${itemId}`)
  }

  // Calcular el progreso general
  const completedCount = content.filter((item) => item.completed).length
  const progressPercentage = Math.round((completedCount / content.length) * 100)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progreso del contenido</span>
          <span>
            {completedCount} de {content.length} ({progressPercentage}%)
          </span>
        </div>
        <Progress value={progressPercentage} />
      </div>

      <div className="space-y-4">
        {content.map((item) => (
          <div
            key={item.id}
            className={`border rounded-lg overflow-hidden transition-all ${
              expandedItem === item.id ? "shadow-md" : ""
            }`}
          >
            <div
              className={`flex items-center justify-between p-4 cursor-pointer ${
                item.completed ? "bg-green-50 dark:bg-green-900/10" : ""
              }`}
              onClick={() => handleToggleItem(item.id)}
            >
              <div className="flex items-center">
                {item.type === "video" ? (
                  <Play className="h-5 w-5 mr-3 text-blue-500" />
                ) : item.type === "document" ? (
                  <FileText className="h-5 w-5 mr-3 text-orange-500" />
                ) : (
                  <ExternalLink className="h-5 w-5 mr-3 text-purple-500" />
                )}
                <div>
                  <h3 className="font-medium">{item.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="capitalize">{item.type}</span>
                    <span className="mx-2">•</span>
                    <span>{item.duration}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                {item.completed && <CheckCircle className="h-5 w-5 text-green-500 mr-2" />}
                <span className="text-sm">{expandedItem === item.id ? "Ocultar" : "Ver"}</span>
              </div>
            </div>

            {expandedItem === item.id && (
              <div className="p-4 border-t">
                {item.type === "video" && (
                  <div className="aspect-video mb-4">
                    <iframe
                      src={item.url}
                      className="w-full h-full rounded"
                      allowFullScreen
                      title={item.title}
                    ></iframe>
                  </div>
                )}

                {item.type === "document" && (
                  <div className="mb-4">
                    <p className="text-muted-foreground mb-2">
                      Este documento contiene información importante sobre {item.title.toLowerCase()}.
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        Abrir Documento
                      </a>
                    </Button>
                  </div>
                )}

                {item.type === "interactive" && (
                  <div className="mb-4">
                    <p className="text-muted-foreground mb-2">
                      Este contenido interactivo te permitirá practicar lo aprendido.
                    </p>
                    <Button asChild variant="outline" size="sm">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Iniciar Actividad
                      </a>
                    </Button>
                  </div>
                )}

                {!item.completed && (
                  <Button onClick={() => handleMarkAsCompleted(item.id)} className="w-full">
                    Marcar como Completado
                  </Button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
