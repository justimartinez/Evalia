"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react"

export function TrainingContentForm({ contentItems, setContentItems, onBack, onNext }) {
  const [newItem, setNewItem] = useState({
    title: "",
    content_type: "video",
    content_url: "",
    duration: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewItem((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setNewItem((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddItem = () => {
    if (!newItem.title || !newItem.content_url) {
      return
    }

    const newContentItem = {
      ...newItem,
      id: Date.now(),
      order_index: contentItems.length,
    }

    setContentItems([...contentItems, newContentItem])
    setNewItem({
      title: "",
      content_type: "video",
      content_url: "",
      duration: "",
    })
  }

  const handleRemoveItem = (id) => {
    const updatedItems = contentItems.filter((item) => item.id !== id)
    // Actualizar los índices de orden
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      order_index: index,
    }))
    setContentItems(reorderedItems)
  }

  const handleMoveItem = (id, direction) => {
    const currentIndex = contentItems.findIndex((item) => item.id === id)
    if (
      (direction === "up" && currentIndex === 0) ||
      (direction === "down" && currentIndex === contentItems.length - 1)
    ) {
      return
    }

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    const updatedItems = [...contentItems]
    const [movedItem] = updatedItems.splice(currentIndex, 1)
    updatedItems.splice(newIndex, 0, movedItem)

    // Actualizar los índices de orden
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      order_index: index,
    }))
    setContentItems(reorderedItems)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contenido de la Capacitación</CardTitle>
        <CardDescription>Agrega videos, documentos u otros recursos para esta capacitación.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lista de contenido existente */}
        {contentItems.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Contenido Agregado</h3>
            <div className="space-y-2">
              {contentItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border rounded-md p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium">{item.title}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span className="capitalize">{item.content_type}</span>
                      {item.duration && <span className="ml-2">• {item.duration} min</span>}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveItem(item.id, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleMoveItem(item.id, "down")}
                      disabled={index === contentItems.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Formulario para agregar nuevo contenido */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-sm font-medium">Agregar Nuevo Contenido</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                name="title"
                placeholder="Ej: Introducción a la Seguridad"
                value={newItem.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content_type">Tipo de Contenido</Label>
              <Select value={newItem.content_type} onValueChange={(value) => handleSelectChange("content_type", value)}>
                <SelectTrigger id="content_type">
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Documento</SelectItem>
                  <SelectItem value="image">Imagen</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="content_url">URL del Contenido</Label>
              <Input
                id="content_url"
                name="content_url"
                placeholder="Ej: https://example.com/video.mp4"
                value={newItem.content_url}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duración (minutos)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                placeholder="Ej: 10"
                value={newItem.duration}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAddItem} className="mt-2">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Contenido
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Volver
        </Button>
        <Button onClick={onNext}>Continuar a Preguntas</Button>
      </CardFooter>
    </Card>
  )
}
