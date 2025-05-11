"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface ParallaxSectionProps {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: "up" | "down" | "left" | "right"
}

export function ParallaxSection({ children, className = "", speed = 0.5, direction = "up" }: ParallaxSectionProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Calculate transform based on direction
  const upTransform = useTransform(scrollYProgress, [0, 1], ["0%", `${-speed * 100}%`])
  const downTransform = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])
  const leftTransform = useTransform(scrollYProgress, [0, 1], ["0%", `${-speed * 100}%`])
  const rightTransform = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`])

  const getTransform = () => {
    switch (direction) {
      case "up":
        return upTransform
      case "down":
        return downTransform
      case "left":
        return leftTransform
      case "right":
        return rightTransform
      default:
        return upTransform
    }
  }

  const transform = getTransform()
  const isHorizontal = direction === "left" || direction === "right"
  const transformProp = isHorizontal ? { x: transform } : { y: transform }

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={transformProp}>{children}</motion.div>
    </div>
  )
}
