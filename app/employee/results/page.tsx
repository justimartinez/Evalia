"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileQuestion, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Datos de ejemplo para los gráficos
const progressData = [
  { name: "Ene", score: 65 },
  { name: "Feb", score: 70 },
  { name: "Mar", score: 75 },
  { name: "Abr", score: 80 },
  { name: "May", score: 85 },
  { name: "Jun", score: 90 },
]

const categoryData = [
  { name: "Seguridad", score: 85 },
  { name: "Procesos", score: 78 },
  { name: "Técnico", score: 92 },
  { name: "Comunicación", score: 88 },
  { name: "Normativa", score: 75 },
]

const distributionData = [
  { name: "Correctas", value: 85 },
  { name: "Incorrectas", value: 15 },
]

const COLORS = ["#22c55e", "#ef4444"]

export default function EmployeeResults() {
  const [results, setResults] = useState([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // En una aplicación real, estos datos vendrían de una API
    const mockResults = [
      {
        id: 1,
        title: "Seguridad Informática Básica",
        date: "10/05/2023",
        score: 92,
        questions: 15,
        correct: 14,
        incorrect: 1,
        timeTaken: 25,
      },
      {
        id: 2,
        title: "Atención al Cliente",
        date: "28/04/2023",
        score: 88,
        questions: 20,
        correct: 18,
        incorrect: 2,
        timeTaken: 38,
      },
      {
        id: 3,
        title: "Protocolos de Emergencia",
        date: "15/04/2023",
        score: 75,
        questions: 12,
        correct: 9,
        incorrect: 3,
        timeTaken: 18,
      },
    ]

    setResults(mockResults)
  }, [])

  // Filtrar resultados según búsqueda
  const filteredResults = results.filter((result) => result.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mis Resultados</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Resultados
        </Button>
      </div>

      {/* Resumen de rendimiento */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Progreso de Rendimiento</CardTitle>
            <CardDescription>Evolución de tus puntuaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Categoría</CardTitle>
            <CardDescription>Puntuación por área de conocimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtro de búsqueda */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar resultados..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Lista de resultados */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredResults.map((result) => (
          <Card key={result.id}>
            <CardHeader className="pb-3">
              <CardTitle>{result.title}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">Completada</Badge>
                <span className="text-xs text-muted-foreground">Fecha: {result.date}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center mb-4">
                <div className="h-32 w-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Correctas", value: result.correct },
                          { name: "Incorrectas", value: result.incorrect },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={50}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {distributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Puntuación</div>
                  <div className="font-bold text-lg">{result.score}%</div>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Correctas</div>
                  <div className="font-bold text-lg">
                    {result.correct}/{result.questions}
                  </div>
                </div>
                <div className="p-2 bg-muted rounded-lg">
                  <div className="text-xs text-muted-foreground">Tiempo</div>
                  <div className="font-bold text-lg">{result.timeTaken} min</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/employee/results/${result.id}`}>Ver Detalles</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredResults.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
          <FileQuestion className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No se encontraron resultados</h3>
          <p className="text-muted-foreground text-center mt-1 mb-4">
            {searchQuery ? "Intenta con otros términos de búsqueda" : "Aún no has completado ninguna evaluación"}
          </p>
          <Button asChild>
            <Link href="/employee/evaluations">Ver Evaluaciones Pendientes</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
