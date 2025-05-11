"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Clock, AlertCircle, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function TrainingQuiz({ quiz, onComplete, completed = false, results = null }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(quiz.timeLimit * 60) // Convertir minutos a segundos
  const [quizInProgress, setQuizInProgress] = useState(true)
  const [showResults, setShowResults] = useState(completed)
  const [quizResults, setQuizResults] = useState(results)

  // Manejar el temporizador
  useEffect(() => {
    if (!quizInProgress || completed) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleFinishQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizInProgress, completed])

  // Si ya está completado, mostrar los resultados
  useEffect(() => {
    if (completed && results) {
      setShowResults(true)
      setQuizResults(results)
      setQuizInProgress(false)
    }
  }, [completed, results])

  const handleAnswerChange = (questionId, answerId) => {
    setAnswers({
      ...answers,
      [questionId]: answerId,
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleFinishQuiz()
    }
  }

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleFinishQuiz = () => {
    setQuizInProgress(false)

    // Calcular resultados
    let correctCount = 0
    const questionResults = {}

    quiz.questions.forEach((question) => {
      const userAnswer = answers[question.id]
      const correctOption = question.options.find((option) => option.isCorrect)
      const isCorrect = userAnswer === correctOption.id

      if (isCorrect) correctCount++

      questionResults[question.id] = {
        userAnswer,
        correctAnswer: correctOption.id,
        isCorrect,
      }
    })

    const score = Math.round((correctCount / quiz.questions.length) * 100)
    const newResults = {
      score,
      correctCount,
      totalQuestions: quiz.questions.length,
      timeUsed: quiz.timeLimit * 60 - timeLeft,
      questionResults,
      answers,
    }

    setQuizResults(newResults)
    setShowResults(true)

    // Notificar al componente padre
    if (onComplete) {
      onComplete(newResults)
    }
  }

  // Formatear el tiempo restante
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  // Calcular el progreso
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100

  // Obtener la pregunta actual
  const currentQuestion = quiz.questions[currentQuestionIndex]

  // Si estamos mostrando los resultados
  if (showResults && quizResults) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center p-6 bg-green-50 dark:bg-green-900/10 rounded-lg">
          <Trophy className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-bold">¡Evaluación Completada!</h3>
          <p className="text-center text-muted-foreground mb-4">Has completado la evaluación de {quiz.title}</p>
          <div className="text-4xl font-bold text-green-600 dark:text-green-400">{quizResults.score}%</div>
          <p className="text-sm text-muted-foreground mt-1">
            {quizResults.correctCount} de {quizResults.totalQuestions} respuestas correctas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                <div className="text-lg font-bold">{quizResults.correctCount}</div>
                <p className="text-sm text-muted-foreground">Respuestas Correctas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                <div className="text-lg font-bold">{quizResults.totalQuestions - quizResults.correctCount}</div>
                <p className="text-sm text-muted-foreground">Respuestas Incorrectas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Clock className="h-8 w-8 text-blue-500 mb-2" />
                <div className="text-lg font-bold">{formatTime(quizResults.timeUsed)}</div>
                <p className="text-sm text-muted-foreground">Tiempo Utilizado</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Revisión de Respuestas</h3>
          {quiz.questions.map((question, index) => {
            const result = quizResults.questionResults[question.id]
            return (
              <div
                key={question.id}
                className={`p-4 border rounded-lg ${
                  result.isCorrect ? "bg-green-50 dark:bg-green-900/10" : "bg-red-50 dark:bg-red-900/10"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Pregunta {index + 1}:</span>
                  <span>{question.text}</span>
                </div>
                <div className="ml-4 space-y-2">
                  {question.options.map((option) => {
                    const isUserAnswer = result.userAnswer === option.id
                    const isCorrectAnswer = option.isCorrect
                    return (
                      <div
                        key={option.id}
                        className={cn(
                          "p-2 rounded-md flex items-center",
                          isUserAnswer && isCorrectAnswer && "bg-green-100 dark:bg-green-900/20",
                          isUserAnswer && !isCorrectAnswer && "bg-red-100 dark:bg-red-900/20",
                          !isUserAnswer && isCorrectAnswer && "bg-green-100/50 dark:bg-green-900/10",
                        )}
                      >
                        {isUserAnswer ? (
                          isCorrectAnswer ? (
                            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                          )
                        ) : isCorrectAnswer ? (
                          <CheckCircle className="h-4 w-4 text-green-500/50 mr-2" />
                        ) : (
                          <span className="h-4 w-4 mr-2" />
                        )}
                        <span>{option.text}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Encabezado del cuestionario */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium">{quiz.title}</h3>
          <p className="text-sm text-muted-foreground">{quiz.description}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/20 rounded-md">
          <Clock className="h-4 w-4 text-orange-500" />
          <span className="font-medium">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progreso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            Pregunta {currentQuestionIndex + 1} de {quiz.questions.length}
          </span>
          <span>{Math.round(progress)}% completado</span>
        </div>
        <Progress value={progress} />
      </div>

      {/* Pregunta actual */}
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium mb-4">{currentQuestion.text}</h4>
        <RadioGroup
          value={answers[currentQuestion.id] || ""}
          onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
        >
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>
      </div>

      {/* Navegación */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>
          Anterior
        </Button>
        {currentQuestionIndex < quiz.questions.length - 1 ? (
          <Button onClick={handleNextQuestion} disabled={!answers[currentQuestion.id]}>
            Siguiente
          </Button>
        ) : (
          <Button onClick={handleFinishQuiz} disabled={!answers[currentQuestion.id]}>
            Finalizar
          </Button>
        )}
      </div>
    </div>
  )
}
