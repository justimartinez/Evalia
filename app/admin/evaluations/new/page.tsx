"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EvaluationQuestionsForm } from "@/components/evaluation/evaluation-questions-form"
import { EvaluationAssignmentForm } from "@/components/evaluation/evaluation-assignment-form"

export default function NewEvaluation() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("details")
  const [evaluationData, setEvaluationData] = useState({
    title: "",
    description: "",
    training_id: "",
    passing_score: "70",
    time_limit: "60",
    is_mandatory: true,
    due_date: "",
  })
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])

  // Datos de ejemplo para capacitaciones
  const trainings = [
    { id: "1", title: "Seguridad Informática Básica" },
    { id: "2", title: "Atención al Cliente" },
    { id: "3", title: "Marketing Digital" },
    { id: "4", title: "Liderazgo y Gestión de Equipos" },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEvaluationData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setEvaluationData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name, checked) => {
    setEvaluationData((prev) => ({ ...prev, [name]: checked }))
  }

  const validateEvaluationData = () => {
    if (!evaluationData.title) {
      toast({
        title: "Error",
        description: "El título de la evaluación es obligatorio",
        variant: "destructive",
      })
      setActiveTab("details")
      return false
    }

    if (!evaluationData.training_id) {
      toast({
        title: "Error",
        description: "Debes seleccionar una capacitación",
        variant: "destructive",
      })
      setActiveTab("details")
      return false
    }

    if (selectedQuestions.length === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar al menos una pregunta para la evaluación",
        variant: "destructive",
      })
      setActiveTab("questions")
      return false
    }

    if (selectedUsers.length === 0) {
      toast({
        title: "Error",
        description: "Debes asignar la evaluación a al menos un usuario",
        variant: "destructive",
      })
      setActiveTab("assignment")
      return false
    }

    return true
  }

  const handleSaveEvaluation = async () => {
    if (!validateEvaluationData()) return

    setIsSubmitting(true)

    try {
      // En una aplicación real, aquí enviaríamos los datos a la API
      console.log("Guardando evaluación:", {
        ...evaluationData,
        selectedQuestions,
        selectedUsers,
      })

      // Simulamos una respuesta exitosa
      setTimeout(() => {
        toast({
          title: "Éxito",
          description: "Evaluación guardada con éxito",
        })
        router.push("/admin/evaluations")
      }, 1000)
    } catch (error) {
      console.error("Error al guardar evaluación:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la evaluación",
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
            <Link href="/admin/evaluations">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Nueva Evaluación</h1>
        </div>
        <Button onClick={handleSaveEvaluation} disabled={isSubmitting}>
          <Save className="mr-2 h-4 w-4" />
          Guardar Evaluación
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Detalles</TabsTrigger>
          <TabsTrigger value="questions">Preguntas</TabsTrigger>
          <TabsTrigger value="assignment">Asignación</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Evaluación</CardTitle>
              <CardDescription>Ingresa la información básica sobre esta evaluación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ej: Evaluación de Seguridad Informática"
                  value={evaluationData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe brevemente esta evaluación"
                  rows={3}
                  value={evaluationData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="training_id">Capacitación Relacionada</Label>
                <Select
                  value={evaluationData.training_id}
                  onValueChange={(value) => handleSelectChange("training_id", value)}
                >
                  <SelectTrigger id="training_id">
                    <SelectValue placeholder="Selecciona una capacitación" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainings.map((training) => (
                      <SelectItem key={training.id} value={training.id}>
                        {training.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passing_score">Puntaje de Aprobación (%)</Label>
                  <Input
                    id="passing_score"
                    name="passing_score"
                    type="number"
                    placeholder="Ej: 70"
                    value={evaluationData.passing_score}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time_limit">Tiempo Límite (minutos)</Label>
                  <Input
                    id="time_limit"
                    name="time_limit"
                    type="number"
                    placeholder="Ej: 60"
                    value={evaluationData.time_limit}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="due_date">Fecha Límite</Label>
                  <Input
                    id="due_date"
                    name="due_date"
                    type="date"
                    value={evaluationData.due_date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-8">
                  <Switch
                    id="is_mandatory"
                    checked={evaluationData.is_mandatory}
                    onCheckedChange={(checked) => handleSwitchChange("is_mandatory", checked)}
                  />
                  <Label htmlFor="is_mandatory">Evaluación Obligatoria</Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/admin/evaluations">Cancelar</Link>
              </Button>
              <Button onClick={() => setActiveTab("questions")}>Continuar a Preguntas</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="mt-6">
          <EvaluationQuestionsForm
            selectedQuestions={selectedQuestions}
            setSelectedQuestions={setSelectedQuestions}
            trainingId={evaluationData.training_id}
            onBack={() => setActiveTab("details")}
            onNext={() => setActiveTab("assignment")}
          />
        </TabsContent>

        <TabsContent value="assignment" className="mt-6">
          <EvaluationAssignmentForm
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            onBack={() => setActiveTab("questions")}
            onSave={handleSaveEvaluation}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
