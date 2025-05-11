"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle,
  Clock,
  Code,
  Database,
  Layers,
  MessageSquare,
  Play,
  Rocket,
  Users,
  ArrowUpRight,
  Sparkles,
  Brain,
  Award,
  UserCircle,
  Building2,
  ChevronRight,
  Trophy,
  AlertCircle,
  TrendingUp,
  Target,
  Upload,
  Cpu,
  LineChart,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useInView } from "react-intersection-observer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"

// Importar el componente TrainingWidget
import { TrainingWidget } from "@/components/training-widget"

// Importar los componentes del carrusel
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

// Importar el componente HowItWorksStep
import { HowItWorksStep } from "@/components/how-it-works-step"

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

// Componente de cursor personalizado
const CustomCursor = () => {
  const cursorRef = useRef(null)
  const cursorRingRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const cursorRing = cursorRingRef.current

    const moveCursor = (e) => {
      const { clientX, clientY } = e

      gsap.to(cursor, {
        x: clientX,
        y: clientY,
        duration: 0.1,
      })

      gsap.to(cursorRing, {
        x: clientX,
        y: clientY,
        duration: 0.3,
      })
    }

    const handleMouseEnter = () => {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.3 })
      gsap.to(cursorRing, { scale: 1, opacity: 1, duration: 0.3 })
    }

    const handleMouseLeave = () => {
      gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.3 })
      gsap.to(cursorRing, { scale: 0, opacity: 0, duration: 0.3 })
    }

    const handleMouseDown = () => {
      gsap.to(cursorRing, { scale: 0.8, duration: 0.2 })
    }

    const handleMouseUp = () => {
      gsap.to(cursorRing, { scale: 1, duration: 0.2 })
    }

    const handleLinkHover = () => {
      gsap.to(cursor, { scale: 1.5, backgroundColor: "rgba(37, 99, 235, 0.5)", duration: 0.3 })
      gsap.to(cursorRing, { scale: 1.5, borderColor: "rgba(37, 99, 235, 0.5)", duration: 0.3 })
    }

    const handleLinkLeave = () => {
      gsap.to(cursor, { scale: 1, backgroundColor: "rgba(255, 255, 255, 0.5)", duration: 0.3 })
      gsap.to(cursorRing, { scale: 1, borderColor: "rgba(255, 255, 255, 0.5)", duration: 0.3 })
    }

    document.addEventListener("mousemove", moveCursor)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)

    const links = document.querySelectorAll("a, button")
    links.forEach((link) => {
      link.addEventListener("mouseenter", handleLinkHover)
      link.addEventListener("mouseleave", handleLinkLeave)
    })

    return () => {
      document.removeEventListener("mousemove", moveCursor)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)

      links.forEach((link) => {
        link.removeEventListener("mouseenter", handleLinkHover)
        link.removeEventListener("mouseleave", handleLinkLeave)
      })
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed w-4 h-4 rounded-full bg-white/50 pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ opacity: 0 }}
      />
      <div
        ref={cursorRingRef}
        className="fixed w-10 h-10 rounded-full border-2 border-white/50 pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ opacity: 0 }}
      />
    </>
  )
}

// Componente de contador animado
const AnimatedCounter = ({ value, duration = 2, title, icon: Icon }) => {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  useEffect(() => {
    if (inView) {
      let start = 0
      const end = Number.parseInt(value)
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
      className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20"
    >
      <div className="mb-4 p-3 bg-blue-600/20 rounded-full">
        <Icon className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="text-4xl font-bold text-white mb-2">{count}+</h3>
      <p className="text-blue-100 text-center">{title}</p>
    </motion.div>
  )
}

// Componente de tarjeta con efecto hover
const HoverCard = ({ title, description, icon: Icon, delay = 0 }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10">
        <div className="h-12 w-12 bg-orange-600/20 text-orange-400 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-600/30 transition-colors duration-300">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-orange-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-blue-100/80">{description}</p>
      </div>

      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-600/30 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
}

// Componente de tarjeta de precios
const PricingCard = ({ title, price, period, description, features, buttonText, popular = false, href, delay = 0 }) => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative overflow-hidden rounded-xl backdrop-blur-md border transition-all duration-300",
        popular
          ? "bg-gradient-to-br from-blue-900/80 to-blue-800/80 border-blue-500/50 shadow-lg shadow-blue-500/20"
          : "bg-gradient-to-br from-white/10 to-white/5 border-white/10",
      )}
    >
      {popular && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          POPULAR
        </div>
      )}

      <div className="p-6 text-center">
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <div className="text-3xl font-bold mb-1 text-white">
          {price}
          <span className="text-sm font-normal text-blue-200">{period}</span>
        </div>
        <p className={popular ? "text-blue-200" : "text-blue-100/80"}>{description}</p>
      </div>

      <div className="p-6 border-t border-white/10">
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle
                className={cn("h-5 w-5 mr-2 mt-0.5 flex-shrink-0", popular ? "text-blue-400" : "text-green-500")}
              />
              <span className="text-sm text-blue-100/80">{feature}</span>
            </li>
          ))}
        </ul>
        <Link href={href}>
          <Button
            className={cn(
              "w-full transition-all duration-300",
              popular ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-white/10 hover:bg-white/20 text-white",
            )}
          >
            {buttonText}
          </Button>
        </Link>
      </div>

      {popular && <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl" />}
    </motion.div>
  )
}

// Componente de resultados de entrenamiento
function TrainingResults({ userResults, showAdminView = true }) {
  // Datos para el gráfico de barras del empleado
  const employeeData = [
    { name: "Atención al Cliente", puntaje: userResults.score, promedio: 75 },
    { name: "Protocolos", puntaje: 82, promedio: 70 },
    { name: "Ventas", puntaje: 65, promedio: 68 },
    { name: "Sistemas", puntaje: 90, promedio: 85 },
  ]

  // Datos para el gráfico de barras por departamento - Reducido a 4 departamentos para mejor visualización
  const departmentData = [
    { name: "Atención", puntaje: 75 },
    { name: "Ventas", puntaje: 68 },
    { name: "Sistemas", puntaje: 85 },
    { name: "Marketing", puntaje: 72 },
  ]

  // Datos para el gráfico circular de distribución de resultados
  const distributionData = [
    { name: "Excelente (90-100%)", value: 15 },
    { name: "Bueno (75-89%)", value: 45 },
    { name: "Regular (60-74%)", value: 30 },
    { name: "Insuficiente (<60%)", value: 10 },
  ]

  // Datos para el gráfico de tendencia mensual
  const monthlyTrendData = [
    { month: "Ene", promedio: 65 },
    { month: "Feb", promedio: 68 },
    { month: "Mar", promedio: 70 },
    { month: "Abr", promedio: 72 },
    { month: 500, promedio: 74 },
    { month: "Jun", promedio: 76 },
  ]

  // Datos para el gráfico de completitud de capacitación
  const completionData = [
    { name: "Completado", value: 78 },
    { name: "Pendiente", value: 22 },
  ]

  // Datos para el gráfico de tiempo promedio
  const timeData = [
    { name: "Atención", tiempo: 45 },
    { name: "Ventas", tiempo: 60 },
    { name: "Sistemas", tiempo: 35 },
    { name: "Marketing", tiempo: 50 },
  ]

  const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#ef4444"]
  const COMPLETION_COLORS = ["#3b82f6", "#94a3b8"]

  return (
    <Tabs defaultValue="employee" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="employee" className="flex items-center gap-2">
          <UserCircle className="h-4 w-4" />
          Resultados del Empleado
        </TabsTrigger>
        {showAdminView && (
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Tablero Administrativo
          </TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="employee" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/10 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-400" />
                Puntuación
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{userResults.score}%</div>
              <p className="text-blue-200 text-sm">
                {userResults.score >= 80
                  ? "Excelente rendimiento!"
                  : userResults.score >= 60
                    ? "Buen trabajo, sigue mejorando"
                    : "Necesita mejorar"}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Correctas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{userResults.correct}</div>
              <p className="text-blue-200 text-sm">de {userResults.total} preguntas</p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                Incorrectas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-white">{userResults.incorrect}</div>
              <p className="text-blue-200 text-sm">de {userResults.total} preguntas</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Comparativa de Rendimiento</CardTitle>
            <CardDescription className="text-blue-200">Tu rendimiento comparado con el promedio</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                puntaje: {
                  label: "Tu puntaje",
                  color: "hsl(var(--chart-1))",
                },
                promedio: {
                  label: "Promedio",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={employeeData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="puntaje" fill="var(--color-puntaje)" />
                  <Bar dataKey="promedio" fill="var(--color-promedio)" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <h3 className="text-white font-medium mb-2 flex items-center gap-2">
            <ChevronRight className="h-5 w-5 text-blue-300" />
            Recomendaciones de mejora
          </h3>
          <ul className="space-y-2 text-blue-100 text-sm">
            <li className="flex items-start gap-2">
              <span className="bg-blue-500/30 text-blue-200 rounded-full h-5 w-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                1
              </span>
              <span>Revisa los protocolos de atención al cliente para mejorar tu puntuación.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-500/30 text-blue-200 rounded-full h-5 w-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                2
              </span>
              <span>Practica con los casos de estudio disponibles en la plataforma.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-blue-500/30 text-blue-200 rounded-full h-5 w-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                3
              </span>
              <span>Programa una sesión de capacitación con tu supervisor para reforzar conceptos.</span>
            </li>
          </ul>
        </div>
      </TabsContent>

      {showAdminView && (
        <TabsContent value="admin" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/10 border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Promedio General</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">76%</div>
                <p className="text-blue-200 text-sm">+3% vs mes anterior</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Empleados Evaluados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">42</div>
                <p className="text-blue-200 text-sm">de 50 totales</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Mejor Departamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-white">Sistemas</div>
                <p className="text-blue-200 text-sm">85% promedio</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Necesita Atención</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-white">Ventas</div>
                <p className="text-blue-200 text-sm">68% promedio</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Rendimiento por Departamento</CardTitle>
                <CardDescription className="text-blue-200">Puntuación promedio por área</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <div className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={departmentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      barSize={40}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.8)" }} />
                      <YAxis
                        stroke="rgba(255,255,255,0.5)"
                        domain={[0, 100]}
                        tick={{ fill: "rgba(255,255,255,0.8)" }}
                      />
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Puntaje"]}
                        contentStyle={{
                          backgroundColor: "rgba(30, 41, 59, 0.9)",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                        labelStyle={{ color: "white" }}
                      />
                      <Bar
                        dataKey="puntaje"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        label={{
                          position: "top",
                          fill: "rgba(255,255,255,0.8)",
                          formatter: (value) => `${value}%`,
                        }}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Distribución de Resultados</CardTitle>
                <CardDescription className="text-blue-200">
                  Porcentaje de empleados por nivel de rendimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={distributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value, name) => [value, name]} />
                      <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nuevos gráficos y datos para el panel de administrador */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  Tendencia Mensual
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Evolución del rendimiento promedio en los últimos 6 meses
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={monthlyTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.8)" }} />
                    <YAxis stroke="rgba(255,255,255,0.5)" domain={[60, 80]} tick={{ fill: "rgba(255,255,255,0.8)" }} />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Promedio"]}
                      contentStyle={{
                        backgroundColor: "rgba(30, 41, 59, 0.9)",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                      labelStyle={{ color: "white" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="promedio"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={{ r: 4, fill: "#3b82f6", stroke: "#3b82f6" }}
                      activeDot={{ r: 6, fill: "#3b82f6", stroke: "#fff" }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-400" />
                  Tiempo Promedio de Capacitación
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Minutos promedio por departamento para completar la capacitación
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" tick={{ fill: "rgba(255,255,255,0.8)" }} />
                    <YAxis
                      stroke="rgba(255,255,255,0.5)"
                      tick={{ fill: "rgba(255,255,255,0.8)" }}
                      label={{
                        value: "Minutos",
                        angle: -90,
                        position: "insideLeft",
                        fill: "rgba(255,255,255,0.8)",
                      }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value} min`, "Tiempo"]}
                      contentStyle={{
                        backgroundColor: "rgba(30, 41, 59, 0.9)",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                      labelStyle={{ color: "white" }}
                    />
                    <Area type="monotone" dataKey="tiempo" stroke="#f97316" fill="#f97316" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-400" />
                  Áreas de Mejora Prioritarias
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Temas con menor rendimiento que requieren atención
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                      <span className="text-white">Protocolos de escalamiento</span>
                    </div>
                    <span className="text-red-400 font-medium">58%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5">
                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "58%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-orange-500 rounded-full"></div>
                      <span className="text-white">Manejo de objeciones</span>
                    </div>
                    <span className="text-orange-400 font-medium">62%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5">
                    <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: "62%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-white">Políticas de devolución</span>
                    </div>
                    <span className="text-yellow-400 font-medium">65%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full border-blue-500/30 text-blue-300 hover:bg-blue-500/20">
                  Ver plan de acción detallado
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Acciones Recomendadas</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="bg-blue-500/30 text-blue-200 rounded-full h-6 w-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Capacitación adicional para el departamento de Ventas</h4>
                    <p className="text-sm text-blue-200 mt-1">
                      El rendimiento está por debajo del objetivo del 75%. Programar sesiones de refuerzo.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <div className="bg-green-500/30 text-green-200 rounded-full h-6 w-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Reconocer al equipo de Sistemas</h4>
                    <p className="text-sm text-blue-200 mt-1">
                      Mantienen el mejor rendimiento por tercer mes consecutivo. Considerar incentivos para mantener la
                      motivación.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <div className="bg-orange-500/30 text-orange-200 rounded-full h-6 w-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Actualizar materiales de capacitación</h4>
                    <p className="text-sm text-blue-200 mt-1">
                      Los temas relacionados con protocolos de atención muestran resultados inconsistentes. Revisar y
                      actualizar contenidos.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="bg-purple-500/30 text-purple-200 rounded-full h-6 w-6 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Implementar programa de mentores</h4>
                    <p className="text-sm text-blue-200 mt-1">
                      Asignar empleados de alto rendimiento como mentores para aquellos que necesitan mejorar.
                    </p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </Tabs>
  )
}

// Componente de entrenamiento interactivo
// Eliminar la función TrainingWidget completa del archivo app/page.tsx y usar el componente importado en su lugar.

// Componente de evaluación de inversión en IA
function AIInvestmentWidget() {
  const [investment, setInvestment] = useState("")
  const [showResponse, setShowResponse] = useState(false)
  const [responseIndex, setResponseIndex] = useState(0)

  // Diferentes respuestas para mostrar
  const responses = [
    "ES POCO",
    "ES MUY POCO",
    "POQUÍSIMO",
    "SIGUE SIENDO POCO",
    "CREERÍAS QUE ESTÁ BIEN, PERO ES POCO",
    "ESCASO",
    "INSUFICIENTE",
    "NECESITAS INVERTIR MÁS",
    "APENAS RASCA LA SUPERFICIE",
    "LA COMPETENCIA INVIERTE MÁS",
  ]

  const handleInputChange = (e) => {
    setInvestment(e.target.value)
  }

  const handleEvaluate = () => {
    // Mostrar una respuesta diferente cada vez
    setResponseIndex((prevIndex) => (prevIndex + 1) % responses.length)
    setShowResponse(true)
  }

  return (
    <div className="flex flex-col w-full">
      <div className="mb-4">
        <label htmlFor="ai-investment" className="block text-white font-medium mb-2">
          ¿Cuánto estás invirtiendo en Inteligencia Artificial en tu empresa?
        </label>
        <div className="flex space-x-2">
          <input
            id="ai-investment"
            type="text"
            value={investment}
            onChange={handleInputChange}
            placeholder="Ingresa tu respuesta aquí..."
            className="w-full p-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Button
            onClick={handleEvaluate}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 flex-shrink-0"
            aria-label="Evaluar inversión"
          >
            Evaluar
          </Button>
        </div>
      </div>

      {showResponse && (
        <div className="my-4 p-4 bg-orange-500/20 border border-orange-500/30 rounded-md">
          <p className="text-center font-bold text-xl text-orange-400">{responses[responseIndex]}</p>
        </div>
      )}

      <div className="mt-4">
        <p className="text-blue-100 text-sm">
          La mayoría de las empresas no están aprovechando todo el potencial de la IA para capacitación y desarrollo de
          talento.
        </p>
      </div>
    </div>
  )
}

// Componente VideoPlayer
function VideoPlayer({ src, title, description }) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlayClick = () => {
    const video = document.getElementById("demo-video")
    if (video) {
      if (isPlaying) {
        video.pause()
      } else {
        video.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="relative w-full">
      <video
        id="demo-video"
        src={src}
        className="w-full rounded-xl aspect-video object-cover"
        controls={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      ></video>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/60 to-indigo-900/60 rounded-xl">
          <div className="bg-white/10 p-8 rounded-xl text-center max-w-md backdrop-blur-md border border-white/20">
            <h3 className="text-xl font-semibold mb-3 text-white">{title}</h3>
            <p className="text-blue-100 mb-6">{description}</p>
            <Button
              onClick={handlePlayClick}
              className="bg-orange-500 hover:bg-orange-600 text-white group transition-all duration-300"
            >
              <Play className="h-5 w-5 mr-2" /> Ver video
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const heroRef = useRef(null)
  const statsRef = useRef(null)

  // Efecto para animaciones al cargar la página
  useEffect(() => {
    // Animación del héroe
    const heroTl = gsap.timeline()

    heroTl.from(".hero-title span", {
      opacity: 0,
      y: 50,
      stagger: 0.1,
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
      ".hero-buttons",
      {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      },
      "-=0.3",
    )

    // Animación de parallax en el héroe
    if (heroRef.current) {
      gsap.to(".hero-parallax", {
        y: "30%",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
    }

    // Animación de las estadísticas
    if (statsRef.current) {
      gsap.from(".stats-item", {
        opacity: 0,
        y: 50,
        stagger: 0.1,
        duration: 0.8,
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
      })
    }

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
    <div className="min-h-screen text-white overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-900">
        <ParticlesBackground />
        <div className="absolute inset-0 hero-parallax">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/30 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
      </div>
      <CustomCursor />

      {/* Navegación */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-blue-950/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="relative z-10 flex items-center gap-2">
              <span className="text-2xl font-bold text-white">
                Evalia <span className="text-orange-400">360</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-blue-100 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-400 after:transition-all hover:after:w-full"
              >
                Cómo funciona
              </Link>
              <Link
                href="#benefits"
                className="text-sm font-medium text-blue-100 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-400 after:transition-all hover:after:w-full"
              >
                Beneficios
              </Link>
              <Link
                href="#use-cases"
                className="text-sm font-medium text-blue-100 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-400 after:transition-all hover:after:w-full"
              >
                Casos de uso
              </Link>
              <Link
                href="#integration"
                className="text-sm font-medium text-blue-100 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-400 after:transition-all hover:after:w-full"
              >
                Integración
              </Link>
              <Link
                href="#pricing"
                className="text-sm font-medium text-blue-100 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-blue-400 after:transition-all hover:after:w-full"
              >
                Precios
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-orange-300/30 text-orange-300 hover:bg-orange-500/20 transition-all duration-300"
              >
                <Link href="/login" className="w-full h-full flex items-center justify-center">
                  Log in
                </Link>
              </Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300">
                <Link href="/solicitar-demo">Solicitar Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-screen flex items-center pt-20 overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 space-y-8">
                <h1 className="hero-title text-5xl md:text-6xl font-bold tracking-tight text-white">
                  <span className="block">Capacitación empresarial</span>
                  <span className="block text-orange-400">potenciada por IA</span>
                </h1>
                <p className="hero-subtitle text-xl text-blue-100">
                  Transforme sus manuales y procesos en entrenamientos interactivos con evaluaciones automáticas y
                  métricas claras.
                </p>
                <div className="hero-buttons flex flex-col sm:flex-row gap-4">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6 rounded-full group transition-all duration-300">
                    <Link href="/solicitar-demo">Solicitar Demo</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-orange-300/30 text-orange-300 hover:bg-orange-500/20 text-lg px-8 py-6 rounded-full transition-all duration-300"
                  >
                    Conocer más
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 mt-12 md:mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="relative w-full h-full"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-50"></div>
                  <div className="relative bg-blue-900/40 backdrop-blur-xl rounded-xl p-1 border border-white/10 h-full">
                    <div className="bg-blue-950/60 rounded-lg p-6 h-full">
                      <TrainingWidget />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-0 right-0 flex justify-center">
            <a
              href="#how-it-works"
              className="animate-bounce bg-white/10 p-2 rounded-full backdrop-blur-sm border border-white/20"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                ></path>
              </svg>
            </a>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-20 relative">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <AnimatedCounter value="70" title="Reducción en tiempo de capacitación" icon={Clock} />
              <AnimatedCounter value="85" title="Mejora en retención de información" icon={Brain} />
              <AnimatedCounter value="500" title="Empresas confían en nosotros" icon={Award} />
              <AnimatedCounter value="95" title="Satisfacción de clientes" icon={Sparkles} />
            </div>
          </div>
        </section>

        {/* How it works - Versión mejorada y más visual */}
        <section id="how-it-works" className="py-20 relative animate-section">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Cómo funciona Evalia</h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Una plataforma intuitiva que transforma su contenido en experiencias de aprendizaje interactivas
                </p>
              </motion.div>
            </div>
            // Actualizar la sección "How it works" con características específicas para cada paso
            <div className="space-y-16">
              <HowItWorksStep
                step={1}
                title="Cargue su contenido"
                description="Suba sus manuales, procesos y materiales de capacitación a la plataforma Evalia. Nuestro sistema acepta documentos en múltiples formatos como PDF, Word, PowerPoint y más."
                icon={Upload}
                imageSrc="/images/upload-content.png"
                imageAlt="Carga de contenido a la plataforma"
                features={[
                  "Soporte para múltiples formatos (PDF, DOCX, PPTX, TXT, HTML)",
                  "Carga masiva de documentos con organización automática",
                  "Extracción inteligente de texto desde imágenes y PDFs escaneados",
                ]}
                delay={0.1}
              />

              <HowItWorksStep
                step={2}
                title="IA en acción"
                description="Nuestra inteligencia artificial analiza automáticamente su contenido, identificando conceptos clave, preguntas potenciales y estructurando el material en módulos de aprendizaje interactivos."
                icon={Cpu}
                imageSrc="/images/ai-processing.png"
                imageAlt="Procesamiento de IA transformando contenido"
                features={[
                  "Identificación automática de conceptos clave y términos importantes",
                  "Generación de preguntas relevantes basadas en el contenido",
                  "Creación de módulos de aprendizaje con dificultad progresiva",
                ]}
                delay={0.2}
                reversed={true}
              />

              <HowItWorksStep
                step={3}
                title="Analice resultados"
                description="Obtenga métricas detalladas sobre el desempeño por área, persona o temática. Identifique brechas de conocimiento y tome decisiones basadas en datos para mejorar la capacitación."
                icon={LineChart}
                imageSrc="/images/analytics-dashboard.png"
                imageAlt="Dashboard de análisis de resultados"
                features={[
                  "Dashboards personalizables con métricas clave de rendimiento",
                  "Identificación automática de áreas que requieren refuerzo",
                  "Exportación de informes detallados en múltiples formatos",
                ]}
                delay={0.3}
              />
            </div>
            <div className="mt-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Button className="bg-orange-500 hover:bg-orange-600 text-white group transition-all duration-300">
                  Ver demostración{" "}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Evaluación de inversión en IA - Sección completa */}
        <section className="py-20 relative animate-section bg-gradient-to-br from-blue-900/40 to-indigo-900/40">
          <div className="container mx-auto px-6">
            <div className="text-center mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Evaluación de inversión en IA</h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Descubra si tu empresa está aprovechando todo el potencial de la inteligencia artificial
                </p>
              </motion.div>
            </div>

            <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8">
              <AIInvestmentWidget />
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section id="benefits" className="py-20 relative animate-section">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Beneficios de Evalia</h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Optimice sus procesos de capacitación y mida el conocimiento real dentro de su organización
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <HoverCard
                title="Ahorro de tiempo"
                description="Reduzca hasta un 70% el tiempo dedicado a crear y evaluar capacitaciones."
                icon={Clock}
                delay={0.1}
              />
              <HoverCard
                title="Métricas claras"
                description="Dashboards intuitivos que muestran el progreso y áreas de mejora."
                icon={BarChart3}
                delay={0.2}
              />
              <HoverCard
                title="Automatización"
                description="Evaluaciones automáticas con retroalimentación inmediata para los empleados."
                icon={Rocket}
                delay={0.3}
              />
              <HoverCard
                title="Personalización"
                description="Adapte el contenido a las necesidades específicas de cada área o equipo."
                icon={Users}
                delay={0.4}
              />
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section id="use-cases" className="py-20 relative animate-section">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Casos de uso</h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Descubra cómo Evalia se adapta a diferentes necesidades empresariales
                </p>
              </motion.div>
            </div>

            {/* Video demostrativo centrado y más grande */}
            <div className="mb-16 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  <VideoPlayer
                    src="https://thedatamindgroup.com/assets/videos/evalia/induccion-mw.mp4"
                    title="Video demostrativo"
                    description="Vea cómo Evalia transforma la capacitación empresarial en la práctica"
                  />
                </div>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <HoverCard
                title="Onboarding de empleados"
                description="Acelere la incorporación de nuevos talentos con entrenamientos interactivos sobre procesos y políticas."
                icon={BookOpen}
                delay={0.1}
              />
              <HoverCard
                title="Atención al cliente"
                description="Capacite a su equipo en protocolos de atención y resolución de problemas con casos prácticos."
                icon={MessageSquare}
                delay={0.2}
              />
              <HoverCard
                title="Cumplimiento normativo"
                description="Asegure que todos los empleados comprendan y cumplan con las regulaciones y políticas internas."
                icon={Layers}
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* Integration */}
        <section id="integration" className="py-20 relative animate-section">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur opacity-50"></div>
                    <div className="relative bg-blue-900/40 backdrop-blur-xl rounded-xl p-1 border border-white/10">
                      <div className="bg-blue-950/60 rounded-lg p-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center justify-center p-4 bg-white/5 rounded-lg border border-white/10">
                            <Image
                              src="/placeholder.svg?height=40&width=120"
                              alt="Integration Partner"
                              width={120}
                              height={40}
                            />
                          </div>
                          <div className="flex items-center justify-center p-4 bg-white/5 rounded-lg border border-white/10">
                            <Image
                              src="/placeholder.svg?height=40&width=120"
                              alt="Integration Partner"
                              width={120}
                              height={40}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="md:w-1/2 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Integración con sus sistemas</h2>
                  <p className="text-xl text-blue-100 mt-4">
                    Evalia se conecta fácilmente con sus herramientas existentes para una experiencia sin fricciones.
                  </p>

                  <div className="space-y-6 mt-8">
                    <div className="flex items-start">
                      <div className="h-12 w-12 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center mr-4">
                        <Database className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Sistemas de gestión de RRHH</h3>
                        <p className="text-blue-100">Sincronice datos de empleados y resultados de capacitación.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="h-12 w-12 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center mr-4">
                        <Code className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">API abierta</h3>
                        <p className="text-blue-100">Conecte con cualquier sistema mediante nuestra API documentada.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="h-12 w-12 bg-orange-500/20 text-orange-400 rounded-lg flex items-center justify-center mr-4">
                        <Layers className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">Plataformas de aprendizaje</h3>
                        <p className="text-blue-100">Compatible con LMS populares y sistemas de gestión documental.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 relative animate-section">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Planes y Precios</h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Elija el plan que mejor se adapte a las necesidades de su organización
                </p>
              </motion.div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <PricingCard
                title="Free"
                price="$0"
                period="/mes"
                description="Para probar la plataforma"
                features={[
                  "Hasta 10 páginas de conversión de documentos",
                  "1 usuario",
                  "Hasta 10 consultas al asistente de capacitación",
                  "3 minutos de video",
                  "5 minutos de audio (podcast)",
                  "1 cuestionario de evaluación",
                ]}
                buttonText="Comenzar Gratis"
                href="/planes/free"
                delay={0.1}
              />

              <PricingCard
                title="Básico"
                price="$360"
                period=" inicial + $40/mes"
                description="Ideal para pequeñas empresas"
                features={[
                  "Hasta 100 páginas de conversión de documentos",
                  "5 usuarios",
                  "Hasta 500 consultas al asistente de capacitación",
                  "Hasta 20 minutos de video",
                  "Hasta 40 minutos de audio (podcast)",
                ]}
                buttonText="Comenzar Ahora"
                href="/planes/basico"
                delay={0.2}
              />

              <PricingCard
                title="Profesional"
                price="$990"
                period=" inicial + $60/mes"
                description="Para empresas en crecimiento"
                features={[
                  "Hasta 1000 páginas de conversión de documentos",
                  "50 usuarios",
                  "Consultas ilimitadas al asistente de capacitación",
                  "60 minutos de video/mes",
                  "120 minutos de audio (podcast)/mes",
                  "Cuestionarios de evaluación ilimitados",
                  "Sistema de scoring",
                  "Tableros de gestión de capacitación",
                ]}
                buttonText="Comenzar Ahora"
                href="/planes/profesional"
                popular={true}
                delay={0.3}
              />
            </div>

            {/* Plan Empresarial (separado) */}
            <div className="mt-16 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Link href="/planes/empresarial" className="block">
                  <div className="relative overflow-hidden rounded-xl backdrop-blur-md border border-blue-400/30 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                    <div className="p-8 text-center">
                      <h3 className="text-2xl font-bold mb-2 text-white">Empresarial</h3>
                      <div className="text-3xl font-bold mb-1 text-white">Precio a consultar</div>
                      <p className="text-blue-200">Solución personalizada para grandes organizaciones</p>
                    </div>
                    <div className="p-8 border-t border-blue-400/20">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-blue-100">Usuarios ilimitados</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-blue-100">Cursos ilimitados</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-blue-100">Reportes personalizados</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-blue-100">Soporte 24/7 con gerente dedicado</span>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <ul className="space-y-3">
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-blue-100">Almacenamiento ilimitado</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-blue-100">API completa e integraciones avanzadas</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-blue-100">Implementación personalizada</span>
                            </li>
                            <li className="flex items-start">
                              <CheckCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-blue-100">Capacitación para administradores</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="mt-6">
                        <Button className="w-full bg-orange-500 hover:bg-orange-600 py-3 group">
                          Contactar Ventas
                          <ArrowUpRight className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                      </div>
                    </div>

                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Carousel Section */}
        <section className="py-20 relative animate-section">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-red-600/80">
            <Image
              src="/images/capacitacion-empresarial.jpg"
              alt="Capacitación empresarial"
              fill
              className="object-cover mix-blend-overlay opacity-60"
            />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Carousel
                opts={{
                  align: "center",
                  loop: true,
                }}
                className="w-full max-w-4xl mx-auto"
                autoplay={true}
                interval={5000}
              >
                <CarouselContent>
                  <CarouselItem>
                    <div className="p-1">
                      <div className="flex flex-col items-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                          Mejore el rendimiento de su equipo con Evalia
                        </h2>
                        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                          Descubra cómo nuestra plataforma de capacitación impulsada por IA puede aumentar la retención
                          de conocimientos y reducir los costos de capacitación.
                        </p>
                        <Button className="bg-orange-500 text-white hover:bg-orange-600 text-lg px-8 py-6 rounded-full group transition-all duration-300">
                          <Link href="/solicitar-demo">Solicitar una Demo Personalizada</Link>
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="p-1">
                      <div className="flex flex-col items-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                          Transforme sus manuales en entrenamientos interactivos
                        </h2>
                        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                          Evalia convierte sus documentos en experiencias de aprendizaje atractivas con evaluaciones
                          automáticas y métricas claras.
                        </p>
                        <Button className="bg-orange-500 text-white hover:bg-orange-600 text-lg px-8 py-6 rounded-full group transition-all duration-300">
                          <Link href="/solicitar-demo">Probar Evalia Gratis</Link>
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem>
                    <div className="p-1">
                      <div className="flex flex-col items-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                          Capacitación a medida para cada empleado
                        </h2>
                        <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
                          Evalia personaliza el contenido de la capacitación para satisfacer las necesidades específicas
                          de cada área y equipo.
                        </p>
                        <Button className="bg-orange-500 text-white hover:bg-orange-600 text-lg px-8 py-6 rounded-full group transition-all duration-300">
                          <Link href="/solicitar-demo">Solicitar una Consulta Gratuita</Link>
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <div className="flex justify-center mt-8">
                  <CarouselPrevious className="relative static mr-2 bg-white/20 hover:bg-white/30 border-white/40" />
                  <CarouselNext className="relative static ml-2 bg-white/20 hover:bg-white/30 border-white/40" />
                </div>
              </Carousel>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="inline-block mb-4">
                <span className="text-2xl font-bold text-white">
                  Evalia <span className="text-orange-400">360</span>
                </span>
              </div>
              <p className="text-sm text-blue-200">
                Parte de Grupo MW, un holding de empresas dedicado al asesoramiento integral de empresas en Argentina.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Producto</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                    Características
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                    Precios
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                    Casos de éxito
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                    Seguridad
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                    Documentación
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                    Webinars
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-blue-200 hover:text-white transition-colors">
                    Soporte
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li>info@evalia.com.ar</li>
                <li>+54 11 5555-5555</li>
                <li>Buenos Aires, Argentina</li>
              </ul>
              <div className="flex gap-4 mt-4">
                <Link href="#" className="text-blue-300 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-sm text-blue-200">© {new Date().getFullYear()} Evalia. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
