"use client"

import { publishTraining as serverPublishTraining } from "./training-actions"

// Función wrapper para publicar capacitación desde componentes cliente
export async function publishTrainingFromClient(trainingId: string | number) {
  try {
    return await serverPublishTraining(trainingId)
  } catch (error) {
    console.error("Error al publicar capacitación desde cliente:", error)
    return { success: false, error: "Error al publicar capacitación" }
  }
}
