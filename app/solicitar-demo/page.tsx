"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ParticlesBackground } from "@/components/particles-background"

// Definir el esquema de validación
const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre es requerido" }),
  email: z.string().email({ message: "Ingrese un email válido" }),
  telefono: z.string().min(8, { message: "Ingrese un número de teléfono válido" }),
  empresa: z.string().min(2, { message: "El nombre de la empresa es requerido" }),
  razonSocial: z.string().min(2, { message: "La razón social es requerida" }),
  direccion: z.string().min(5, { message: "La dirección es requerida" }),
  empleados: z.string({ required_error: "Seleccione una opción" }),
  mensaje: z.string().optional(),
})

export default function SolicitarDemo() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Inicializar el formulario
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      email: "",
      telefono: "",
      empresa: "",
      razonSocial: "",
      direccion: "",
      empleados: "",
      mensaje: "",
    },
  })

  // Función para manejar el envío del formulario
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // Aquí iría la lógica para enviar los datos a un servidor
    // Por ahora solo mostramos un mensaje de éxito
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-blue-950 via-blue-900 to-indigo-900">
        <ParticlesBackground />
        <div className="absolute inset-0 hero-parallax">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/30 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-6 py-24 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center text-orange-300 hover:text-orange-400 mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Solicitar una Demo</h1>
            <p className="text-xl text-blue-100">
              Complete el formulario a continuación y un representante se pondrá en contacto con usted para coordinar
              una demostración personalizada.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-6">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">¡Solicitud enviada con éxito!</h2>
              <p className="text-blue-100 mb-6">
                Gracias por su interés en Evalia. Nos pondremos en contacto con usted a la brevedad para coordinar la
                demostración.
              </p>
              <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                <Link href="/">Volver al inicio</Link>
              </Button>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 md:p-8 border border-white/20">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                        Datos personales
                      </h3>

                      <FormField
                        control={form.control}
                        name="nombre"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-100">Nombre completo</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ingrese su nombre"
                                {...field}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-orange-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-100">Correo electrónico</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="ejemplo@empresa.com"
                                type="email"
                                {...field}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-orange-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="telefono"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-100">Teléfono</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="+54 11 1234-5678"
                                {...field}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-orange-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
                        Datos de la empresa
                      </h3>

                      <FormField
                        control={form.control}
                        name="empresa"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-100">Nombre de la empresa</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nombre comercial"
                                {...field}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-orange-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="razonSocial"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-100">Razón social</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Razón social de la empresa"
                                {...field}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-orange-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="direccion"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-100">Dirección</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Dirección de la empresa"
                                {...field}
                                className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-orange-500"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="empleados"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-100">Número de empleados</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white/5 border-white/10 text-white focus:ring-orange-500">
                                  <SelectValue placeholder="Seleccione una opción" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-blue-900 border-white/10 text-white">
                                <SelectItem value="1-10">1-10 empleados</SelectItem>
                                <SelectItem value="11-50">11-50 empleados</SelectItem>
                                <SelectItem value="51-200">51-200 empleados</SelectItem>
                                <SelectItem value="201-500">201-500 empleados</SelectItem>
                                <SelectItem value="501+">Más de 500 empleados</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="mensaje"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-100">Mensaje (opcional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Cuéntenos sobre sus necesidades específicas de capacitación"
                            {...field}
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus-visible:ring-orange-500 min-h-[100px]"
                          />
                        </FormControl>
                        <FormDescription className="text-blue-200">
                          Incluya cualquier información adicional que considere relevante para la demostración.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end">
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6">
                      Enviar solicitud
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
