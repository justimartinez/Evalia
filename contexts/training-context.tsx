"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Tipo para las preguntas
export interface Question {
  id: number
  question: string
  correctAnswer: string
  options: string[]
}

// Tipo para las respuestas del usuario
export interface UserAnswerData {
  answer: string
  isCorrect: boolean
}

// Tipo para los resultados
export interface TrainingResults {
  score: number
  correct: number
  incorrect: number
  total: number
  answers: Record<number, UserAnswerData>
  questions: Question[]
}

interface TrainingContextType {
  trainingResults: TrainingResults | null
  setTrainingResults: (results: TrainingResults | null) => void
}

const TrainingContext = createContext<TrainingContextType | undefined>(undefined)

export function TrainingProvider({ children }: { children: ReactNode }) {
  const [trainingResults, setTrainingResultsState] = useState<TrainingResults | null>(null)

  // Cargar resultados desde localStorage al iniciar
  useEffect(() => {
    try {
      const savedResults = localStorage.getItem("trainingResults")
      if (savedResults) {
        const parsedResults = JSON.parse(savedResults)
        console.log("Cargando resultados desde localStorage:", parsedResults)
        setTrainingResultsState(parsedResults)
      }
    } catch (error) {
      console.error("Error al cargar resultados desde localStorage:", error)
    }
  }, [])

  const setTrainingResults = (results: TrainingResults | null) => {
    console.log("Guardando resultados en el contexto:", results)
    setTrainingResultsState(results)

    // Guardar en localStorage
    if (results) {
      try {
        localStorage.setItem("trainingResults", JSON.stringify(results))
        console.log("Resultados guardados en localStorage")
      } catch (error) {
        console.error("Error al guardar resultados en localStorage:", error)
      }
    } else {
      localStorage.removeItem("trainingResults")
      console.log("Resultados eliminados de localStorage")
    }
  }

  return <TrainingContext.Provider value={{ trainingResults, setTrainingResults }}>{children}</TrainingContext.Provider>
}

export function useTrainingResults() {
  const context = useContext(TrainingContext)
  if (context === undefined) {
    // En lugar de lanzar un error, devolver un valor predeterminado
    console.warn("useTrainingResults debe usarse dentro de un TrainingProvider")
    return {
      trainingResults: null,
      setTrainingResults: () => {},
    }
  }
  return context
}
