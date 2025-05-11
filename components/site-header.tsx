"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NavItem {
  label: string
  href: string
}

interface SiteHeaderProps {
  logo?: string
  navItems?: NavItem[]
}

export function SiteHeader({
  logo = "/placeholder.svg?height=40&width=120",
  navItems = [
    { label: "Cómo funciona", href: "/#how-it-works" },
    { label: "Beneficios", href: "/#benefits" },
    { label: "Casos de uso", href: "/#use-cases" },
    { label: "Integración", href: "/#integration" },
    { label: "Precios", href: "/#pricing" },
  ],
}: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-blue-950/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="relative z-10 flex items-center gap-2">
            <Image src={logo || "/placeholder.svg"} alt="Logo" width={120} height={40} className="h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="text-sm font-medium text-blue-100 hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-orange-400 after:transition-all hover:after:w-full"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-orange-300/30 text-orange-300 hover:bg-orange-500/20 transition-all duration-300"
              >
                Log in
              </Button>
            </Link>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300">
              Solicitar Demo
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-blue-900/95 backdrop-blur-md border-b border-white/10"
          >
            <div className="container mx-auto px-6 py-4">
              <nav className="flex flex-col gap-4">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-blue-100 hover:text-white py-2 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 mt-4">
                  <Link href="/login">
                    <Button
                      variant="outline"
                      className="border-orange-300/30 text-orange-300 hover:bg-orange-500/20 w-full"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full">Solicitar Demo</Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
