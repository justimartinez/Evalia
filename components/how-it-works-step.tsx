"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { LucideIcon } from "lucide-react"

interface HowItWorksStepProps {
  step: number
  title: string
  description: string
  icon: LucideIcon
  imageSrc: string
  imageAlt: string
  features: string[] // Añadir un array de características específicas
  delay?: number
  reversed?: boolean
}

export function HowItWorksStep({
  step,
  title,
  description,
  icon: Icon,
  imageSrc,
  imageAlt,
  features, // Usar las características pasadas como prop
  delay = 0,
  reversed = false,
}: HowItWorksStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center mb-16`}
    >
      <div className="md:w-1/2">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-50"></div>
          <div className="relative bg-blue-900/40 backdrop-blur-xl rounded-xl p-1 border border-white/10">
            <div className="bg-blue-950/60 rounded-lg overflow-hidden">
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={imageAlt}
                width={600}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="md:w-1/2 space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-orange-600/20 text-orange-400 rounded-full flex items-center justify-center font-bold text-xl border border-orange-500/30">
            {step}
          </div>
          <h3 className="text-2xl font-bold text-white">{title}</h3>
        </div>

        <div className="pl-16">
          <p className="text-blue-100 text-lg mb-6">{description}</p>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-orange-600/20 text-orange-400 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1">Características clave:</h4>
                <ul className="space-y-2 text-blue-100">
                  {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="bg-blue-500/30 text-blue-200 rounded-full h-5 w-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
