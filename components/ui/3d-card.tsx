"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"

interface ThreeDCardProps {
  children: React.ReactNode
  className?: string
  glareColor?: string
  depth?: number
  scale?: number
}

export function ThreeDCard({
  children,
  className = "",
  glareColor = "rgba(255, 255, 255, 0.4)",
  depth = 10,
  scale = 1.05,
}: ThreeDCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    // Normalize values between -1 and 1
    const normalizedX = mouseX / (rect.width / 2)
    const normalizedY = mouseY / (rect.height / 2)

    setMousePosition({ x: normalizedX, y: normalizedY })
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      animate={{
        rotateY: isHovered ? mousePosition.x * depth : 0,
        rotateX: isHovered ? -mousePosition.y * depth : 0,
        scale: isHovered ? scale : 1,
        z: isHovered ? depth : 0,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Glare effect */}
      {isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + mousePosition.x * 50}% ${
              50 + mousePosition.y * 50
            }%, ${glareColor} 0%, rgba(255, 255, 255, 0) 70%)`,
            opacity: 0.6,
            zIndex: 1,
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-0">{children}</div>
    </motion.div>
  )
}
