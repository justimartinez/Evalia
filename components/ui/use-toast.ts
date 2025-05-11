"use client"

import type React from "react"

import { useState, useCallback } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

export type ToastProps = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: "default" | "destructive"
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const dismiss = useCallback((toastId?: string) => {
    setToasts((toasts) => {
      if (toastId) {
        return toasts.filter((toast) => toast.id !== toastId)
      }
      return []
    })
  }, [])

  const toast = useCallback(
    ({ ...props }: Omit<ToastProps, "id">) => {
      const id = genId()

      const newToast = {
        ...props,
        id,
      }

      setToasts((toasts) => [...toasts, newToast].slice(-TOAST_LIMIT))

      setTimeout(() => {
        dismiss(id)
      }, TOAST_REMOVE_DELAY)

      return id
    },
    [dismiss],
  )

  return {
    toast,
    dismiss,
    toasts,
  }
}

export type Toast = ReturnType<typeof useToast>
