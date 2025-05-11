"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Save, Building, Mail, Bell, Shield, Database, Globe } from "lucide-react"

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general")
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Mi Empresa",
    companyLogo: "",
    adminEmail: "admin@miempresa.com",
    language: "es",
    timezone: "America/Mexico_City",
  })
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newUserNotification: true,
    completedTrainingNotification: true,
    failedEvaluationNotification: true,
    reminderNotification: true,
    reminderDays: "3",
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    passwordExpiration: true,
    passwordExpirationDays: "90",
    sessionTimeout: "30",
    allowMultipleSessions: false,
  })
  const [trainingSettings, setTrainingSettings] = useState({
    defaultPassingScore: "70",
    allowRetakes: true,
    maxRetakes: "3",
    showCorrectAnswers: true,
    shuffleQuestions: true,
    shuffleOptions: true,
  })

  const handleGeneralChange = (e) => {
    const { name, value } = e.target
    setGeneralSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (name, value) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSecurityChange = (name, value) => {
    setSecuritySettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleTrainingChange = (name, value) => {
    setTrainingSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleSaveSettings = () => {
    // En una aplicación real, aquí enviaríamos los datos a la API
    console.log("Guardando configuración:", {
      generalSettings,
      notificationSettings,
      securitySettings,
      trainingSettings,
    })

    // Simulamos una respuesta exitosa
    setTimeout(() => {
      alert("Configuración guardada con éxito")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configuración</h1>
        <Button onClick={handleSaveSettings}>
          <Save className="mr-2 h-4 w-4" />
          Guardar Cambios
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
          <TabsTrigger value="security">Seguridad</TabsTrigger>
          <TabsTrigger value="training">Capacitaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>Configura los ajustes básicos de tu plataforma de capacitación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Información de la Empresa
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nombre de la Empresa</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    value={generalSettings.companyName}
                    onChange={handleGeneralChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyLogo">Logo de la Empresa (URL)</Label>
                  <Input
                    id="companyLogo"
                    name="companyLogo"
                    value={generalSettings.companyLogo}
                    onChange={handleGeneralChange}
                    placeholder="https://ejemplo.com/logo.png"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contacto
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email de Administración</Label>
                  <Input
                    id="adminEmail"
                    name="adminEmail"
                    type="email"
                    value={generalSettings.adminEmail}
                    onChange={handleGeneralChange}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Localización
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select
                      value={generalSettings.language}
                      onValueChange={(value) => handleGeneralChange({ target: { name: "language", value } })}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Selecciona un idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">Inglés</SelectItem>
                        <SelectItem value="fr">Francés</SelectItem>
                        <SelectItem value="pt">Portugués</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select
                      value={generalSettings.timezone}
                      onValueChange={(value) => handleGeneralChange({ target: { name: "timezone", value } })}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Selecciona una zona horaria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                        <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Los Ángeles (GMT-8)</SelectItem>
                        <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                        <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Notificaciones</CardTitle>
              <CardDescription>Configura cómo y cuándo se envían las notificaciones.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notificaciones Generales
                </h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
                    <p className="text-sm text-muted-foreground">
                      Habilitar el envío de notificaciones por correo electrónico
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Eventos de Notificación</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newUserNotification">Nuevo Usuario</Label>
                      <p className="text-sm text-muted-foreground">Notificar cuando se registre un nuevo usuario</p>
                    </div>
                    <Switch
                      id="newUserNotification"
                      checked={notificationSettings.newUserNotification}
                      onCheckedChange={(checked) => handleNotificationChange("newUserNotification", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="completedTrainingNotification">Capacitación Completada</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar cuando un usuario complete una capacitación
                      </p>
                    </div>
                    <Switch
                      id="completedTrainingNotification"
                      checked={notificationSettings.completedTrainingNotification}
                      onCheckedChange={(checked) => handleNotificationChange("completedTrainingNotification", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="failedEvaluationNotification">Evaluación Fallida</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar cuando un usuario no apruebe una evaluación
                      </p>
                    </div>
                    <Switch
                      id="failedEvaluationNotification"
                      checked={notificationSettings.failedEvaluationNotification}
                      onCheckedChange={(checked) => handleNotificationChange("failedEvaluationNotification", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Recordatorios</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reminderNotification">Recordatorios de Capacitación</Label>
                    <p className="text-sm text-muted-foreground">Enviar recordatorios para capacitaciones pendientes</p>
                  </div>
                  <Switch
                    id="reminderNotification"
                    checked={notificationSettings.reminderNotification}
                    onCheckedChange={(checked) => handleNotificationChange("reminderNotification", checked)}
                  />
                </div>
                {notificationSettings.reminderNotification && (
                  <div className="space-y-2">
                    <Label htmlFor="reminderDays">Días de Anticipación</Label>
                    <Select
                      value={notificationSettings.reminderDays}
                      onValueChange={(value) => handleNotificationChange("reminderDays", value)}
                    >
                      <SelectTrigger id="reminderDays">
                        <SelectValue placeholder="Selecciona los días" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 día antes</SelectItem>
                        <SelectItem value="3">3 días antes</SelectItem>
                        <SelectItem value="5">5 días antes</SelectItem>
                        <SelectItem value="7">7 días antes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Seguridad</CardTitle>
              <CardDescription>Configura las opciones de seguridad para proteger tu plataforma.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Autenticación
                </h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="twoFactorAuth">Autenticación de Dos Factores</Label>
                    <p className="text-sm text-muted-foreground">Requerir verificación adicional al iniciar sesión</p>
                  </div>
                  <Switch
                    id="twoFactorAuth"
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Políticas de Contraseña</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="passwordExpiration">Expiración de Contraseña</Label>
                    <p className="text-sm text-muted-foreground">Requerir cambio de contraseña periódicamente</p>
                  </div>
                  <Switch
                    id="passwordExpiration"
                    checked={securitySettings.passwordExpiration}
                    onCheckedChange={(checked) => handleSecurityChange("passwordExpiration", checked)}
                  />
                </div>
                {securitySettings.passwordExpiration && (
                  <div className="space-y-2">
                    <Label htmlFor="passwordExpirationDays">Días para Expiración</Label>
                    <Select
                      value={securitySettings.passwordExpirationDays}
                      onValueChange={(value) => handleSecurityChange("passwordExpirationDays", value)}
                    >
                      <SelectTrigger id="passwordExpirationDays">
                        <SelectValue placeholder="Selecciona los días" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 días</SelectItem>
                        <SelectItem value="60">60 días</SelectItem>
                        <SelectItem value="90">90 días</SelectItem>
                        <SelectItem value="180">180 días</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sesiones</h3>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Tiempo de Inactividad (minutos)</Label>
                  <Select
                    value={securitySettings.sessionTimeout}
                    onValueChange={(value) => handleSecurityChange("sessionTimeout", value)}
                  >
                    <SelectTrigger id="sessionTimeout">
                      <SelectValue placeholder="Selecciona el tiempo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">60 minutos</SelectItem>
                      <SelectItem value="120">120 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowMultipleSessions">Sesiones Múltiples</Label>
                    <p className="text-sm text-muted-foreground">Permitir iniciar sesión desde varios dispositivos</p>
                  </div>
                  <Switch
                    id="allowMultipleSessions"
                    checked={securitySettings.allowMultipleSessions}
                    onCheckedChange={(checked) => handleSecurityChange("allowMultipleSessions", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Capacitaciones</CardTitle>
              <CardDescription>
                Configura las opciones predeterminadas para capacitaciones y evaluaciones.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Evaluaciones
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="defaultPassingScore">Puntuación Mínima para Aprobar (%)</Label>
                  <Select
                    value={trainingSettings.defaultPassingScore}
                    onValueChange={(value) => handleTrainingChange("defaultPassingScore", value)}
                  >
                    <SelectTrigger id="defaultPassingScore">
                      <SelectValue placeholder="Selecciona la puntuación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">60%</SelectItem>
                      <SelectItem value="65">65%</SelectItem>
                      <SelectItem value="70">70%</SelectItem>
                      <SelectItem value="75">75%</SelectItem>
                      <SelectItem value="80">80%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowRetakes">Permitir Reintentos</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir a los usuarios volver a intentar evaluaciones fallidas
                    </p>
                  </div>
                  <Switch
                    id="allowRetakes"
                    checked={trainingSettings.allowRetakes}
                    onCheckedChange={(checked) => handleTrainingChange("allowRetakes", checked)}
                  />
                </div>
                {trainingSettings.allowRetakes && (
                  <div className="space-y-2">
                    <Label htmlFor="maxRetakes">Número Máximo de Reintentos</Label>
                    <Select
                      value={trainingSettings.maxRetakes}
                      onValueChange={(value) => handleTrainingChange("maxRetakes", value)}
                    >
                      <SelectTrigger id="maxRetakes">
                        <SelectValue placeholder="Selecciona el número" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 reintento</SelectItem>
                        <SelectItem value="2">2 reintentos</SelectItem>
                        <SelectItem value="3">3 reintentos</SelectItem>
                        <SelectItem value="5">5 reintentos</SelectItem>
                        <SelectItem value="unlimited">Ilimitados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Opciones de Preguntas</h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showCorrectAnswers">Mostrar Respuestas Correctas</Label>
                    <p className="text-sm text-muted-foreground">
                      Mostrar las respuestas correctas después de completar la evaluación
                    </p>
                  </div>
                  <Switch
                    id="showCorrectAnswers"
                    checked={trainingSettings.showCorrectAnswers}
                    onCheckedChange={(checked) => handleTrainingChange("showCorrectAnswers", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="shuffleQuestions">Mezclar Preguntas</Label>
                    <p className="text-sm text-muted-foreground">Mostrar las preguntas en orden aleatorio</p>
                  </div>
                  <Switch
                    id="shuffleQuestions"
                    checked={trainingSettings.shuffleQuestions}
                    onCheckedChange={(checked) => handleTrainingChange("shuffleQuestions", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="shuffleOptions">Mezclar Opciones</Label>
                    <p className="text-sm text-muted-foreground">
                      Mostrar las opciones de respuesta en orden aleatorio
                    </p>
                  </div>
                  <Switch
                    id="shuffleOptions"
                    checked={trainingSettings.shuffleOptions}
                    onCheckedChange={(checked) => handleTrainingChange("shuffleOptions", checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings} className="ml-auto">
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
