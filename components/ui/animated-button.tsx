"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface AnimatedButtonProps {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  onClick?: () => void
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  glowColor?: string
}

export function AnimatedButton({
  children,
  className,
  variant = "default",
  size = "default",
  onClick,
  icon,
  iconPosition = "right",
  glowColor = "rgba(249, 115, 22, 0.5)",
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative">
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="absolute inset-0 rounded-full blur-xl"
          style={{ backgroundColor: glowColor, zIndex: -1 }}
        />
      )}
      <Button
        variant={variant}
        size={size}
        onClick={onClick}
        className={cn(
          "relative overflow-hidden transition-all duration-300 transform",
          isHovered && "scale-105",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {iconPosition === "left" && icon && (
          <motion.span animate={{ x: isHovered ? 5 : 0 }} className="mr-2 inline-flex">
            {icon}
          </motion.span>
        )}
        {children}
        {iconPosition === "right" && icon && (
          <motion.span animate={{ x: isHovered ? 5 : 0 }} className="ml-2 inline-flex">
            {icon}
          </motion.span>
        )}
      </Button>
    </div>
  )
}
