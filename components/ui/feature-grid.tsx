"use client"

import type React from "react"

import { motion } from "framer-motion"

interface Feature {
  title: string
  description: string
  icon: React.ReactNode
}

interface FeatureGridProps {
  features: Feature[]
  columns?: 2 | 3 | 4
  className?: string
}

export function FeatureGrid({ features, columns = 3, className = "" }: FeatureGridProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className={`grid grid-cols-1 md:grid-cols-${columns} gap-8 ${className}`}
    >
      {features.map((feature, index) => (
        <motion.div
          key={index}
          variants={item}
          className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-6 hover:shadow-xl transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative z-10">
            <div className="h-12 w-12 bg-orange-600/20 text-orange-400 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-600/30 transition-colors duration-300">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-orange-300 transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-blue-100/80">{feature.description}</p>
          </div>

          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-orange-600/30 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      ))}
    </motion.div>
  )
}
