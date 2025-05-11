"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function LoginButton() {
  return (
    <Button
      variant="outline"
      className="border-orange-300/30 text-orange-300 hover:bg-orange-500/20 transition-all duration-300"
      asChild
    >
      <Link href="/login">Iniciar Sesión</Link>
    </Button>
  )
}
