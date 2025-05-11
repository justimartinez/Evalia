"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"

interface AnimatedCounterProps {
  value: number
  duration?: number
  title: string
  icon?: React.ReactNode
  suffix?: string
  className?: string
}

export function AnimatedCounter({
  value,
  duration = 2,
  title,
  icon,
  suffix = "+",
  className = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      let start = 0
      const end = value
      const incrementTime = Math.floor((duration * 1000) / end)

      const timer = setInterval(() => {
        start += 1
        setCount(start)
        if (start >= end) clearInterval(timer)
      }, incrementTime)

      return () => clearInterval(timer)
    }
  }, [inView, value, duration])

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 ${className}`}
    >
      {icon && <div className="mb-4 p-3 bg-orange-600/20 rounded-full">{icon}</div>}
      <h3 className="text-4xl font-bold text-white mb-2">
        {count}
        <span className="text-orange-300">{suffix}</span>
      </h3>
      <p className="text-blue-100 text-center">{title}</p>
    </motion.div>
  )
}
