"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function TrainingQuestionsForm({ questions = [], setQuestions, onBack, onNext, nextButtonText = "Continuar" }) {
  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    type: "multiple_choice",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  })

  const handleQuestionChange = (e) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      text: e.target.value,
    }))
  }

  const handleTypeChange = (value) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      type: value,
    }))
  }

  const handleOptionChange = (index, value) => {
    setCurrentQuestion((prev) => {
      const newOptions = [...prev.options]
      newOptions[index] = { ...newOptions[index], text: value }
      return { ...prev, options: newOptions }
    })
  }

  const handleCorrectOptionChange = (index, isCorrect) => {
    setCurrentQuestion((prev) => {
      // Para preguntas de opción múltiple, solo una opción puede ser correcta
      let newOptions
      if (prev.type === "multiple_choice") {
        newOptions = prev.options.map((opt, i) => ({
          ...opt,
          isCorrect: i === index ? isCorrect : false,
        }))
      } else {
        // Para preguntas de selección múltiple, varias opciones pueden ser correctas
        newOptions = [...prev.options]
        newOptions[index] = { ...newOptions[index], isCorrect }
      }
      return { ...prev, options: newOptions }
    })
  }

  const addOption = () => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: [...prev.options, { text: "", isCorrect: false }],
    }))
  }

  const removeOption = (index) => {
    if (currentQuestion.options.length <= 2) {
      toast({
        title: "Error",
        description: "Debe haber al menos 2 opciones",
        variant: "destructive",
      })
      return
    }

    setCurrentQuestion((prev) => {
      const newOptions = prev.options.filter((_, i) => i !== index)
      return { ...prev, options: newOptions }
    })
  }

  const addQuestion = () => {
    // Validar que la pregunta tenga texto
    if (!currentQuestion.text.trim()) {
      toast({
        title: "Error",
        description: "La pregunta debe tener un texto",
        variant: "destructive",
      })
      return
    }

    // Validar que todas las opciones tengan texto
    if (currentQuestion.options.some((opt) => !opt.text.trim())) {
      toast({
        title: "Error",
        description: "Todas las opciones deben tener texto",
        variant: "destructive",
      })
      return
    }

    // Validar que al menos una opción sea correcta
    if (!currentQuestion.options.some((opt) => opt.isCorrect)) {
      toast({
        title: "Error",
        description: "Al menos una opción debe ser correcta",
        variant: "destructive",
      })
      return
    }

    // Añadir la pregunta a la lista
    setQuestions([...questions, { ...currentQuestion }])

    // Resetear el formulario
    setCurrentQuestion({
      text: "",
      type: "multiple_choice",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    })

    toast({
      title: "Pregunta añadida",
      description: "La pregunta ha sido añadida correctamente",
    })
  }

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index))
    toast({
      title: "Pregunta eliminada",
      description: "La pregunta ha sido eliminada correctamente",
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preguntas de la Capacitación</CardTitle>
          <CardDescription>Añade preguntas para evaluar el conocimiento adquirido.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question-text">Texto de la Pregunta</Label>
            <Textarea
              id="question-text"
              placeholder="Ej: ¿Cuál es la mejor práctica para crear contraseñas seguras?"
              value={currentQuestion.text}
              onChange={handleQuestionChange}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-type">Tipo de Pregunta</Label>
            <Select value={currentQuestion.type} onValueChange={handleTypeChange}>
              <SelectTrigger id="question-type">
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple_choice">Opción Múltiple (una correcta)</SelectItem>
                <SelectItem value="multiple_select">Selección Múltiple (varias correctas)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Opciones</Label>
              <Button type="button" variant="outline" size="sm" onClick={addOption} className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                Añadir Opción
              </Button>
            </div>

            <div className="space-y-2">
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Checkbox
                    id={`option-${index}-correct`}
                    checked={option.isCorrect}
                    onCheckedChange={(checked) => handleCorrectOptionChange(index, checked)}
                    className="mt-2.5"
                  />
                  <div className="flex-1">
                    <Input
                      id={`option-${index}-text`}
                      placeholder={`Opción ${index + 1}`}
                      value={option.text}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
                    className="h-10 w-10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Button type="button" onClick={addQuestion} className="w-full">
            Añadir Pregunta
          </Button>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preguntas Añadidas ({questions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {questions.map((question, qIndex) => (
                  <Card key={qIndex} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium">{question.text}</h4>
                          <p className="text-sm text-muted-foreground">
                            {question.type === "multiple_choice" ? "Opción Múltiple" : "Selección Múltiple"}
                          </p>
                          <ul className="mt-2 space-y-1">
                            {question.options.map((opt, oIndex) => (
                              <li key={oIndex} className="text-sm flex items-center">
                                <span
                                  className={`inline-block w-4 h-4 rounded-full mr-2 ${
                                    opt.isCorrect ? "bg-green-500" : "bg-gray-200"
                                  }`}
                                ></span>
                                {opt.text}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeQuestion(qIndex)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver
        </Button>
        <Button type="button" onClick={onNext} disabled={questions.length === 0}>
          {nextButtonText}
          {nextButtonText === "Continuar" && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  )
}
