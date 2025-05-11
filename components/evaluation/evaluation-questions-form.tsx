"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

export function EvaluationQuestionsForm({ selectedQuestions, setSelectedQuestions, trainingId, onBack, onNext }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [availableQuestions, setAvailableQuestions] = useState([])

  // Datos de ejemplo para preguntas
  const questionsData = [
    {
      id: "1",
      question_text: "¿Cuál es la mejor práctica para crear contraseñas seguras?",
      question_type: "multiple_choice",
      difficulty: "intermedio",
      training_id: "1",
    },
    {
      id: "2",
      question_text: "¿Qué es un ataque de phishing?",
      question_type: "multiple_choice",
      difficulty: "facil",
      training_id: "1",
    },
    {
      id: "3",
      question_text: "¿Cuál de las siguientes opciones es un ejemplo de buena atención al cliente?",
      question_type: "multiple_choice",
      difficulty: "facil",
      training_id: "2",
    },
    {
      id: "4",
      question_text: "¿Qué estrategia de marketing digital es más efectiva para generar leads?",
      question_type: "multiple_choice",
      difficulty: "avanzado",
      training_id: "3",
    },
    {
      id: "5",
      question_text: "¿Cuál es el primer paso en la resolución de conflictos en un equipo?",
      question_type: "multiple_choice",
      difficulty: "intermedio",
      training_id: "4",
    },
  ]

  useEffect(() => {
    // Filtrar preguntas según la capacitación seleccionada
    if (trainingId) {
      setAvailableQuestions(questionsData.filter((q) => q.training_id === trainingId))
    } else {
      setAvailableQuestions(questionsData)
    }
  }, [trainingId])

  const filteredQuestions = availableQuestions.filter((question) => {
    const matchesSearch = question.question_text.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab =
      activeTab === "all" || (activeTab === "selected" && selectedQuestions.some((q) => q.id === question.id))

    return matchesSearch && matchesTab
  })

  const handleToggleQuestion = (question) => {
    if (selectedQuestions.some((q) => q.id === question.id)) {
      setSelectedQuestions(selectedQuestions.filter((q) => q.id !== question.id))
    } else {
      setSelectedQuestions([...selectedQuestions, question])
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "facil":
        return "bg-green-100 text-green-800"
      case "intermedio":
        return "bg-yellow-100 text-yellow-800"
      case "avanzado":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selección de Preguntas</CardTitle>
        <CardDescription>Selecciona las preguntas que deseas incluir en esta evaluación.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar preguntas..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Badge variant="outline" className="rounded-full px-3">
            {selectedQuestions.length} seleccionadas
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="selected">Seleccionadas</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <div
                key={question.id}
                className="flex items-start space-x-3 border rounded-md p-3 hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  id={`question-${question.id}`}
                  checked={selectedQuestions.some((q) => q.id === question.id)}
                  onCheckedChange={() => handleToggleQuestion(question)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={`question-${question.id}`}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {question.question_text}
                  </Label>
                  <div className="flex items-center mt-1 space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {question.question_type === "multiple_choice" ? "Opción múltiple" : question.question_type}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                      {question.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No se encontraron preguntas que coincidan con tu búsqueda.
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Volver
        </Button>
        <Button onClick={onNext}>Continuar a Asignación</Button>
      </CardFooter>
    </Card>
  )
}
