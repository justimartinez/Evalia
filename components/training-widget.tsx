"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTrainingResults } from "@/contexts/training-context"

export function TrainingWidget() {
  const router = useRouter()
  const { setTrainingResults } = useTrainingResults()

  // Preguntas y respuestas para el entrenamiento
  const questions = [
    {
      id: 1,
      question: "¿Cuál es el protocolo para manejar reclamos de clientes?",
      correctAnswer: "Escuchar, empatizar, ofrecer soluciones y hacer seguimiento.",
      options: [
        "Transferir inmediatamente al supervisor.",
        "Escuchar, empatizar, ofrecer soluciones y hacer seguimiento.",
        "Solicitar que envíen un correo formal.",
        "Ofrecer un descuento automático.",
      ],
    },
    {
      id: 2,
      question: "¿Qué información debe solicitarse para identificar al cliente?",
      correctAnswer: "Nombre completo, número de documento y correo electrónico.",
      options: [
        "Solo el nombre es suficiente.",
        "Nombre completo y dirección postal.",
        "Nombre completo, número de documento y correo electrónico.",
        "Número de teléfono únicamente.",
      ],
    },
    {
      id: 3,
      question: "¿Cuál es el tiempo máximo de espera aceptable para un cliente?",
      correctAnswer: "3 minutos.",
      options: ["30 segundos.", "1 minuto.", "3 minutos.", "5 minutos."],
    },
    {
      id: 4,
      question: "¿Qué hacer cuando un cliente solicita hablar con un supervisor?",
      correctAnswer: "Intentar resolver el problema primero, si persiste, transferir amablemente.",
      options: [
        "Transferir inmediatamente sin preguntar.",
        "Negar la solicitud e insistir en resolver personalmente.",
        "Intentar resolver el problema primero, si persiste, transferir amablemente.",
        "Pedir al cliente que llame en otro momento.",
      ],
    },
    {
      id: 5,
      question: "¿Cuál es la mejor forma de finalizar una interacción con el cliente?",
      correctAnswer: "Preguntar si hay algo más en que pueda ayudar y agradecer por su preferencia.",
      options: [
        "Despedirse rápidamente para atender al siguiente cliente.",
        "Preguntar si hay algo más en que pueda ayudar y agradecer por su preferencia.",
        "Simplemente decir adiós.",
        "Transferir a la encuesta de satisfacción automáticamente.",
      ],
    },
  ]

  // Estado para manejar las preguntas y respuestas
  const [shuffledQuestions, setShuffledQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState({ current: 1, total: 5 })
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState(null)
  const [userAnswers, setUserAnswers] = useState({})
  const [trainingCompleted, setTrainingCompleted] = useState(false)
  const [userResults, setUserResults] = useState(null)
  const [answeredCurrentQuestion, setAnsweredCurrentQuestion] = useState(false)
  const [responseIndex, setResponseIndex] = useState(0)
  const [showResponse, setShowResponse] = useState(false)

  const responses = ["Evaluando tu desempeño...", "Analizando tus respuestas...", "Calculando tu puntaje..."]

  // Mezclar las preguntas al cargar el componente
  useEffect(() => {
    const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, 5)
    setShuffledQuestions(shuffled)
    setProgress({ current: 1, total: shuffled.length })
  }, [])

  // Verificar respuesta
  const checkAnswer = (selectedAnswer) => {
    // Si ya respondió esta pregunta, no permitir cambiar la respuesta
    if (answeredCurrentQuestion) return

    const currentQuestion = shuffledQuestions[currentIndex]
    if (!currentQuestion) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    setFeedback(isCorrect)
    setUserAnswer(selectedAnswer)
    setAnsweredCurrentQuestion(true)

    // Guardar la respuesta del usuario y si es correcta o no
    const updatedAnswers = {
      ...userAnswers,
      [currentQuestion.id]: {
        answer: selectedAnswer,
        isCorrect: isCorrect,
      },
    }
    setUserAnswers(updatedAnswers)

    // Avanzar automáticamente después de un breve retraso
    setTimeout(() => {
      if (currentIndex < shuffledQuestions.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setProgress({ ...progress, current: progress.current + 1 })
        setUserAnswer("")
        setFeedback(null)
        setAnsweredCurrentQuestion(false)
      } else {
        // Calcular resultados cuando se completa el entrenamiento
        handleEvaluate()
        setTrainingCompleted(true)
      }
    }, 1500) // Esperar 1.5 segundos antes de avanzar
  }

  // Modificar la función para manejar el caso en que el contexto no esté disponible
  const handleEvaluate = () => {
    // Mostrar una respuesta diferente cada vez
    setResponseIndex((prevIndex) => (prevIndex + 1) % responses.length)
    setShowResponse(true)

    // Si setTrainingResults está disponible, usarlo
    if (setTrainingResults) {
      // Calcular resultados cuando se completa el entrenamiento
      const correctCount = Object.values(userAnswers).filter((data) => data.isCorrect).length

      const results = {
        score: Math.round((correctCount / shuffledQuestions.length) * 100),
        correct: correctCount,
        incorrect: shuffledQuestions.length - correctCount,
        total: shuffledQuestions.length,
        answers: userAnswers,
        questions: shuffledQuestions,
      }

      setUserResults(results)
      setTrainingResults(results) // Guardar en el contexto
    }
  }

  // Modificar la función navigateToResults para manejar el caso en que el contexto no esté disponible
  const navigateToResults = () => {
    // Asegurarse de que los resultados estén guardados antes de navegar
    if (userResults) {
      if (setTrainingResults) {
        setTrainingResults(userResults)
      }
      // Usar window.location para una navegación completa
      window.location.href = "/resultados-detallados"
    }
  }

  // Si no hay preguntas cargadas aún, mostrar un loader
  if (shuffledQuestions.length === 0) {
    return (
      <div className="w-full h-full p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-200">Cargando entrenamiento...</p>
        </div>
      </div>
    )
  }

  const currentQuestion = shuffledQuestions[currentIndex]

  // Si el entrenamiento está completado, mostrar resultados
  if (trainingCompleted && userResults) {
    return (
      <div className="w-full h-full p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2 bg-green-500/20 rounded-full mb-4">
            <Trophy className="h-8 w-8 text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-white">¡Entrenamiento Completado!</h3>
          <p className="text-blue-200 mt-2">Has completado el módulo de Atención al Cliente</p>
        </div>

        <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/10 mb-6">
          <div>
            <p className="text-sm text-blue-200">Tu puntuación</p>
            <p className="text-2xl font-bold text-white">{userResults.score}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-200">Respuestas correctas</p>
            <p className="text-lg font-medium text-white">
              {userResults.correct} de {userResults.total}
            </p>
          </div>
        </div>

        {/* Usar Link en lugar de Button con onClick para una navegación más directa */}
        <Link href="/resultados-detallados" className="block w-full">
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            onClick={(e) => {
              e.preventDefault() // Prevenir el comportamiento predeterminado del Link
              navigateToResults() // Usar nuestra función personalizada
            }}
          >
            Ver Resultados Detallados
          </Button>
        </Link>

        <Button
          variant="outline"
          className="w-full mt-4 border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
          onClick={() => {
            setTrainingCompleted(false)
            setCurrentIndex(0)
            setProgress({ current: 1, total: shuffledQuestions.length })
            setUserAnswer("")
            setFeedback(null)
            setUserAnswers({})
            setAnsweredCurrentQuestion(false)
          }}
        >
          Reiniciar Entrenamiento
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full h-full p-6 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">Entrenamiento: Atención al Cliente</h3>
        <span className="text-sm text-blue-300">
          {progress.current}/{progress.total} completado
        </span>
      </div>
      <div className="space-y-4">
        {/* Pregunta actual */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-sm text-blue-100">{currentQuestion?.question}</p>

          {/* Opciones de respuesta */}
          <div className="mt-3 space-y-2">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => checkAnswer(option)}
                className={cn(
                  "w-full text-left p-3 text-sm rounded-md transition-all duration-300",
                  userAnswer === option
                    ? feedback
                      ? "bg-green-500/20 border border-green-500/30 text-green-300"
                      : "bg-red-500/20 border border-red-500/30 text-red-300"
                    : "bg-white/5 border border-white/10 hover:bg-blue-500/20 text-blue-100",
                  answeredCurrentQuestion && userAnswer !== option ? "opacity-50 cursor-not-allowed" : "",
                )}
                disabled={answeredCurrentQuestion && userAnswer !== option}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {feedback !== null && (
            <div className={cn("mt-3 flex items-center text-sm", feedback ? "text-green-400" : "text-red-400")}>
              {feedback ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span>Respuesta correcta</span>
                </>
              ) : (
                <>
                  <span className="h-4 w-4 mr-1 flex items-center justify-center rounded-full border border-red-400">
                    ✕
                  </span>
                  <span>Respuesta incorrecta</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-blue-200">
          {feedback !== null
            ? feedback
              ? "¡Correcto! Avanzando..."
              : "Incorrecto. Avanzando..."
            : "Selecciona una respuesta"}
        </p>
      </div>
    </div>
  )
}
