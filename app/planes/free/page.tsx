"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowLeft, CheckCircle, Play, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

// Registrar ScrollTrigger con GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Componente de partículas para el fondo
const ParticlesBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    let particles = []
    let animationFrameId

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particles = []
      const particleCount = Math.floor(window.innerWidth / 10)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          color: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
        })
      }
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Actualizar posición
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Rebote en los bordes
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
      })

      // Dibujar líneas entre partículas cercanas
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(drawParticles)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    drawParticles()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30" />
}

// Componente de tarjeta de características
const FeatureCard = ({ title, features, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 hover:border-blue-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
    >
      <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-blue-100">{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function FreePlanPage() {
  const heroRef = useRef(null)

  useEffect(() => {
    // Animación del héroe
    const heroTl = gsap.timeline()

    heroTl.from(".hero-title", {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: "power3.out",
    })

    heroTl.from(
      ".hero-subtitle",
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.4",
    )

    heroTl.from(
      ".price-card",
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.3",
    )

    // Animación de las secciones al hacer scroll
    gsap.utils.toArray(".animate-section").forEach((section) => {
      gsap.from(section, {
        opacity: 0,
        y: 50,
        duration: 0.8,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      })
    })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 backdrop-blur-md bg-blue-950/70">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image
                src="/placeholder.svg?height=40&width=120"
                alt="Evalia Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/#how-it-works"
              className="text-sm font-medium text-blue-100 hover:text-white transition-colors"
            >
              Cómo funciona
            </Link>
            <Link href="/#benefits" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">
              Beneficios
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-blue-100 hover:text-white transition-colors">
              Precios
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-orange-300/30 text-orange-300 hover:bg-orange-500/20 transition-all duration-300"
            >
              Log in
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 transition-all duration-300">Solicitar Demo</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        <ParticlesBackground />

        {/* Hero Section */}
        <section ref={heroRef} className="py-20 relative">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl" />

          <div className="container mx-auto px-6 relative z-10">
            <Link
              href="/#pricing"
              className="inline-flex items-center text-orange-300 hover:text-orange-100 mb-8 group transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver a planes
            </Link>

            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <h1 className="hero-title text-4xl md:text-5xl font-bold mb-4 text-white">Plan Free</h1>
                <p className="hero-subtitle text-xl text-blue-100 mb-6">
                  Comience a explorar el poder de la capacitación potenciada por IA sin costo alguno.
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="price-card bg-white/10 backdrop-blur-md p-6 rounded-lg border border-white/20 mb-8 hover:border-blue-400/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="text-3xl font-bold text-white">
                      $0<span className="text-sm font-normal text-blue-200">/mes</span>
                    </div>
                    <div className="bg-blue-500/20 px-3 py-1 rounded-full text-xs font-semibold text-blue-300">
                      GRATIS
                    </div>
                  </div>
                  <p className="text-blue-200 mb-6">Ideal para probar la plataforma</p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 group transition-all duration-300">
                    Comenzar Gratis
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </div>

              <div className="md:w-1/2">
                {/* Video Section */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="relative rounded-xl overflow-hidden shadow-xl aspect-video">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-50"></div>
                    <div className="relative rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 to-indigo-900/60 flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-white/10 p-8 rounded-xl text-center max-w-md backdrop-blur-md border border-white/20">
                          <Sparkles className="h-8 w-8 text-orange-400 mx-auto mb-3" />
                          <h3 className="text-xl font-semibold mb-3 text-white">Video explicativo</h3>
                          <p className="text-blue-100 mb-6">Vea cómo aprovechar al máximo el plan gratuito de Evalia</p>
                          <Button className="bg-orange-500 hover:bg-orange-600 group transition-all duration-300">
                            <Play className="h-5 w-5 mr-2" /> Ver video
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 animate-section relative">
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Características incluidas</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                Todo lo que necesita para comenzar con su capacitación empresarial
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                title="Documentos"
                features={["Hasta 10 páginas de conversión de documentos", "Formatos PDF, DOCX, TXT"]}
                delay={0.1}
              />

              <FeatureCard
                title="Usuarios y consultas"
                features={["1 usuario", "Hasta 10 consultas al asistente de capacitación"]}
                delay={0.2}
              />

              <FeatureCard
                title="Contenido multimedia"
                features={["3 minutos de video", "5 minutos de audio (podcast)"]}
                delay={0.3}
              />

              <FeatureCard
                title="Evaluaciones"
                features={["1 cuestionario de evaluación", "Hasta 10 preguntas por cuestionario"]}
                delay={0.4}
              />

              <FeatureCard title="Soporte" features={["Documentación en línea", "Soporte por email"]} delay={0.5} />

              <FeatureCard
                title="Limitaciones"
                features={["Sin acceso a reportes avanzados", "Sin integraciones con sistemas externos"]}
                delay={0.6}
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 animate-section relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20" />

          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-6 text-white">¿Listo para comenzar?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
                Pruebe Evalia gratis y descubra cómo la IA puede transformar sus procesos de capacitación.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full group transition-all duration-300">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  className="border-orange-300/30 text-orange-300 hover:bg-orange-500/20 px-8 py-3 rounded-full transition-all duration-300"
                >
                  Ver otros planes
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-200 py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <Image
                src="/placeholder.svg?height=40&width=120"
                alt="Evalia Logo"
                width={120}
                height={40}
                className="h-10 w-auto mb-4"
              />
              <p className="text-sm max-w-xs">
                Parte de Grupo MW, un holding de empresas dedicado al asesoramiento integral de empresas en Argentina.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Producto</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/#how-it-works" className="hover:text-white transition-colors">
                      Cómo funciona
                    </Link>
                  </li>
                  <li>
                    <Link href="/#benefits" className="hover:text-white transition-colors">
                      Beneficios
                    </Link>
                  </li>
                  <li>
                    <Link href="/#pricing" className="hover:text-white transition-colors">
                      Precios
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Contacto</h3>
                <ul className="space-y-2 text-sm">
                  <li>info@evalia.com.ar</li>
                  <li>+54 11 5555-5555</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-sm text-center">
            <p>© {new Date().getFullYear()} Evalia. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
