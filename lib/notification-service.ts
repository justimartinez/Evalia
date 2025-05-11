import { sql } from "@/lib/db"

export enum NotificationType {
  TRAINING_ASSIGNED = "training_assigned",
  TRAINING_COMPLETED = "training_completed",
  TRAINING_PROGRESS = "training_progress",
  EVALUATION_ASSIGNED = "evaluation_assigned",
  EVALUATION_COMPLETED = "evaluation_completed",
  SYSTEM = "system",
}

interface NotificationData {
  userId: number
  title: string
  message: string
  type: NotificationType
  actionUrl?: string
}

export async function createNotification(data: NotificationData) {
  try {
    const { userId, title, message, type, actionUrl } = data

    await sql(
      `INSERT INTO notifications 
       (user_id, title, message, type, action_url) 
       VALUES ($1, $2, $3, $4, $5)`,
      [userId, title, message, type, actionUrl || null],
    )

    return { success: true }
  } catch (error) {
    console.error("Error al crear notificación:", error)
    return { success: false, error }
  }
}

export async function notifyTrainingAssigned(userId: number, trainingId: number, trainingTitle: string) {
  return createNotification({
    userId,
    title: "Nueva capacitación asignada",
    message: `Se te ha asignado la capacitación "${trainingTitle}". Por favor complétala antes de la fecha límite.`,
    type: NotificationType.TRAINING_ASSIGNED,
    actionUrl: `/employee/trainings/${trainingId}`,
  })
}

export async function notifyTrainingCompleted(
  userId: number,
  trainingId: number,
  trainingTitle: string,
  score: number,
) {
  return createNotification({
    userId,
    title: "Capacitación completada",
    message: `Has completado la capacitación "${trainingTitle}" con una puntuación de ${score}%.`,
    type: NotificationType.TRAINING_COMPLETED,
    actionUrl: `/employee/trainings/${trainingId}/results`,
  })
}

export async function notifyTrainingProgress(
  userId: number,
  trainingId: number,
  trainingTitle: string,
  progress: number,
) {
  return createNotification({
    userId,
    title: "Progreso en capacitación",
    message: `Has alcanzado un ${progress}% de progreso en la capacitación "${trainingTitle}".`,
    type: NotificationType.TRAINING_PROGRESS,
    actionUrl: `/employee/trainings/${trainingId}`,
  })
}

export async function notifyEvaluationAssigned(userId: number, evaluationId: number, evaluationTitle: string) {
  return createNotification({
    userId,
    title: "Nueva evaluación asignada",
    message: `Se te ha asignado la evaluación "${evaluationTitle}". Por favor complétala antes de la fecha límite.`,
    type: NotificationType.EVALUATION_ASSIGNED,
    actionUrl: `/employee/evaluations/${evaluationId}`,
  })
}

export async function notifyEvaluationCompleted(
  userId: number,
  evaluationId: number,
  evaluationTitle: string,
  score: number,
) {
  return createNotification({
    userId,
    title: "Evaluación completada",
    message: `Has completado la evaluación "${evaluationTitle}" con una puntuación de ${score}%.`,
    type: NotificationType.EVALUATION_COMPLETED,
    actionUrl: `/employee/evaluations/${evaluationId}/results`,
  })
}

export async function notifySystem(userId: number, title: string, message: string, actionUrl?: string) {
  return createNotification({
    userId,
    title,
    message,
    type: NotificationType.SYSTEM,
    actionUrl,
  })
}
