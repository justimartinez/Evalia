import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProfessionalPlanPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
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
              className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
            >
              Cómo funciona
            </Link>
            <Link
              href="/#benefits"
              className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
            >
              Beneficios
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
            >
              Precios
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50">
              Log in
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600">Solicitar Demo</Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-orange-50">
          <div className="container">
            <Link href="/#pricing" className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-8">
              <ArrowLeft className="h-4 w-4 mr-2" /> Volver a planes
            </Link>
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="md:w-1/2">
                <div className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-4">
                  POPULAR
                </div>
                <h1 className="text-4xl font-bold mb-4">Plan Profesional</h1>
                <p className="text-xl text-gray-600 mb-6">
                  La solución completa para empresas en crecimiento que buscan optimizar su capacitación.
                </p>
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <div className="text-3xl font-bold mb-2">
                    $990<span className="text-sm font-normal"> inicial</span>
                  </div>
                  <div className="text-xl font-bold mb-2">
                    + $60<span className="text-sm font-normal">/mes</span>
                  </div>
                  <p className="text-gray-600 mb-6">Para empresas en crecimiento</p>
                  <Button className="w-full bg-orange-500 hover:bg-orange-600">Comenzar Ahora</Button>
                </div>
              </div>
              <div className="md:w-1/2">
                {/* Video Section */}
                <div className="relative rounded-xl overflow-hidden shadow-xl aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-orange-700/20 flex items-center justify-center">
                    <div className="bg-white/90 p-8 rounded-xl text-center max-w-md">
                      <h3 className="text-xl font-semibold mb-3">Video explicativo</h3>
                      <p className="text-gray-600 mb-4">Descubra todas las ventajas del plan Profesional de Evalia</p>
                      <Button className="bg-orange-500 hover:bg-orange-600">
                        <Play className="h-4 w-4 mr-2" /> Ver video
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold mb-12 text-center">Características incluidas</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Documentos</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Hasta 1000 páginas de conversión de documentos</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Todos los formatos de archivo soportados</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Usuarios y consultas</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>50 usuarios</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Consultas ilimitadas al asistente de capacitación</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Contenido multimedia</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>60 minutos de video/mes</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>120 minutos de audio (podcast)/mes</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Evaluaciones</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Cuestionarios de evaluación ilimitados</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Sistema de scoring avanzado</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Tableros y reportes</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Tableros de gestión de capacitación</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Reportes personalizados por departamento</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Soporte y asistencia</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Asistencia comercial personalizada</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Soporte prioritario (tiempo de respuesta: 4 horas)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Integraciones</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>API para integraciones personalizadas</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Integración con sistemas de RRHH</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Personalización</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Personalización de marca</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Dominio personalizado</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-xl font-semibold mb-4">Seguridad</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Autenticación de dos factores</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Encriptación de datos avanzada</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-orange-50">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">¿Listo para llevar su capacitación al siguiente nivel?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Optimice la capacitación de su empresa con nuestro plan Profesional y vea resultados inmediatos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-orange-500 hover:bg-orange-600 px-8 py-3">Comenzar Ahora</Button>
              <Button variant="outline" className="border-orange-300 text-orange-700 hover:bg-orange-50 px-8 py-3">
                Solicitar Demo
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container">
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
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>© {new Date().getFullYear()} Evalia. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
