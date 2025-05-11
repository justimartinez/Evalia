"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { TrainingContentForm } from "@/components/training/training-content-form"
import { TrainingQuestionsForm } from "@/components/training/training-questions-form"
import { createTraining } from "@/app/actions/training-actions"
import { useToast } from "@/hooks/use-toast"

export default function NewTraining() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [trainingData, setTrainingData] = useState({
    title: "",
    description: "",
    objectives: "",
    duration: "0", // Valor por defecto establecido a "0"
    difficulty_level: "intermedio",
    status: "draft",
  })
  const [contentItems, setContentItems] = useState([])
  const [questions, setQuestions] = useState([])
  const [selectedDepartments, setSelectedDepartments] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTrainingData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setTrainingData((prev) => ({ ...prev, [name]: value }))
  }

  const validateTrainingData = () => {
    if (!trainingData.title) {
      toast({
        title: "Error",
        description: "El título de la capacitación es obligatorio",
        variant: "destructive",
      })
      setActiveTab("details")
      return false
    }

    // Validación más flexible para desarrollo
    if (process.env.NODE_ENV === "development") {
      return true
    }

    if (contentItems.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar al menos un contenido a la capacitación",
        variant: "destructive",
      })
      setActiveTab("content")
      return false
    }

    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar al menos una pregunta a la capacitación",
        variant: "destructive",
      })
      setActiveTab("questions")
      return false
    }

    // Eliminamos la validación de departamentos como solicitado
    // if (selectedDepartments.length === 0) {
    //   toast({
    //     title: "Error",
    //     description: "Debes asignar la capacitación a al menos un departamento",
    //     variant: "destructive",
    //   })
    //   setActiveTab("assignment")
    //   return false
    // }

    return true
  }

  const handleSaveTraining = async () => {
    if (!validateTrainingData()) return

    setIsSubmitting(true)

    try {
      // Preparar los datos para la API
      const apiData = {
        ...trainingData,
        status: "draft", // Usamos status en lugar de is_published
        content: contentItems.map((item, index) => ({
          title: item.title,
          // No incluimos description ya que no existe en la tabla
          type: item.content_type || "text",
          url: item.content_url || "",
          order: index,
        })),
        questions: questions.map((q, index) => ({
          text: q.text,
          type: q.type || "multiple_choice",
          order: index, // Añadimos el orden de la pregunta
          options: q.options.map((opt, idx) => ({
            text: opt.text,
            isCorrect: opt.isCorrect || false,
            order: idx,
          })),
        })),
        selectedDepartments, // Mantenemos esto, pero ya no es obligatorio
      }

      console.log("Guardando capacitación:", apiData)

      const result = await createTraining(apiData)

      if (result.success) {
        toast({
          title: "Éxito",
          description: "Capacitación guardada con éxito",
        })
        router.push("/admin/trainings")
      } else {
        toast({
          title: "Error",
          description: `Error al guardar la capacitación: ${result.error || "Error desconocido"}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al guardar capacitación:", error)
      toast({
        title: "Error",
        description: `Ocurrió un error al guardar la capacitación: ${error.message || "Error desconocido"}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublishTraining = async () => {
    // Actualizar el estado local primero
    setTrainingData((prev) => ({
      ...prev,
      status: "published",
    }))

    // Validar los datos
    if (!validateTrainingData()) return

    setIsSubmitting(true)

    try {
      // Preparar los datos para la API
      const apiData = {
        ...trainingData,
        status: "published", // Usamos status en lugar de is_published
        content: contentItems.map((item, index) => ({
          title: item.title,
          // No incluimos description ya que no existe en la tabla
          type: item.content_type || "text",
          url: item.content_url || "",
          order: index,
        })),
        questions: questions.map((q, index) => ({
          text: q.text,
          type: q.type || "multiple_choice",
          order: index, // Añadimos el orden de la pregunta
          options: q.options.map((opt, idx) => ({
            text: opt.text,
            isCorrect: opt.isCorrect || false,
            order: idx,
          })),
        })),
        selectedDepartments, // Mantenemos esto, pero ya no es obligatorio
      }

      console.log("Publicando capacitación:", apiData)

      const result = await createTraining(apiData)

      if (result.success) {
        toast({
          title: "Éxito",
          description: "Capacitación publicada con éxito",
        })
        router.push("/admin/trainings")
      } else {
        toast({
          title: "Error",
          description: `Error al publicar la capacitación: ${result.error || "Error desconocido"}`,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error al publicar capacitación:", error)
      toast({
        title: "Error",
        description: `Ocurrió un error al publicar la capacitación: ${error.message || "Error desconocido"}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/trainings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Nueva Capacitación</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSaveTraining}
            disabled={isSubmitting}
            type="button"
            className="cursor-pointer"
          >
            <Save className="mr-2 h-4 w-4" />
            Guardar Borrador
          </Button>
          <Button onClick={handlePublishTraining} disabled={isSubmitting} type="button" className="cursor-pointer">
            Publicar Capacitación
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="content">Contenido</TabsTrigger>
          <TabsTrigger value="questions">Preguntas</TabsTrigger>
          {/* Ocultamos la pestaña de asignación por ahora */}
          {/* <TabsTrigger value="assignment">Asignación</TabsTrigger> */}
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Capacitación</CardTitle>
              <CardDescription>Ingresa la información básica sobre esta capacitación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ej: Seguridad Informática Básica"
                  value={trainingData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe brevemente esta capacitación"
                  rows={3}
                  value={trainingData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="objectives">Objetivos</Label>
                <Textarea
                  id="objectives"
                  name="objectives"
                  placeholder="¿Qué aprenderán los participantes?"
                  rows={3}
                  value={trainingData.objectives}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración (minutos)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    placeholder="Ej: 60"
                    value={trainingData.duration}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty_level">Nivel de Dificultad</Label>
                  <Select
                    value={trainingData.difficulty_level}
                    onValueChange={(value) => handleSelectChange("difficulty_level", value)}
                  >
                    <SelectTrigger id="difficulty_level">
                      <SelectValue placeholder="Selecciona el nivel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facil">Fácil</SelectItem>
                      <SelectItem value="intermedio">Intermedio</SelectItem>
                      <SelectItem value="avanzado">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/admin/trainings">Cancelar</Link>
              </Button>
              <Button onClick={() => setActiveTab("content")} type="button" className="cursor-pointer">
                Continuar a Contenido
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <TrainingContentForm
            contentItems={contentItems}
            setContentItems={setContentItems}
            onBack={() => setActiveTab("details")}
            onNext={() => setActiveTab("questions")}
          />
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <TrainingQuestionsForm
            questions={questions}
            setQuestions={setQuestions}
            onBack={() => setActiveTab("content")}
            onNext={() => handlePublishTraining()} // Cambiamos para publicar directamente
            nextButtonText="Publicar Capacitación" // Cambiamos el texto del botón
          />
        </TabsContent>

        {/* Ocultamos la pestaña de asignación por ahora */}
        {/* <TabsContent value="assignment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Asignación de la Capacitación</CardTitle>
              <CardDescription>Selecciona los departamentos a los que se asignará esta capacitación.</CardDescription>
            </CardHeader>
            <CardContent>
              <TrainingAssignmentForm
                selectedDepartments={selectedDepartments}
                setSelectedDepartments={setSelectedDepartments}
                onBack={() => setActiveTab("questions")}
                onSave={handleSaveTraining}
                onPublish={handlePublishTraining}
                isLoading={isSubmitting}
              />
            </CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}
