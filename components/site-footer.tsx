"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

interface FooterLink {
  label: string
  href: string
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

interface SiteFooterProps {
  logo?: string
  description?: string
  columns?: FooterColumn[]
  contactInfo?: {
    email?: string
    phone?: string
    address?: string
  }
  socialLinks?: {
    icon: React.ReactNode
    href: string
    label: string
  }[]
}

export function SiteFooter({
  logo = "/placeholder.svg?height=40&width=120",
  description = "Parte de Grupo MW, un holding de empresas dedicado al asesoramiento integral de empresas en Argentina.",
  columns = [
    {
      title: "Producto",
      links: [
        { label: "Características", href: "#" },
        { label: "Precios", href: "#pricing" },
        { label: "Casos de éxito", href: "#" },
        { label: "Seguridad", href: "#" },
      ],
    },
    {
      title: "Recursos",
      links: [
        { label: "Blog", href: "#" },
        { label: "Documentación", href: "#" },
        { label: "Webinars", href: "#" },
        { label: "Soporte", href: "#" },
      ],
    },
  ],
  contactInfo = {
    email: "info@evalia.com.ar",
    phone: "+54 11 5555-5555",
    address: "Buenos Aires, Argentina",
  },
  socialLinks = [
    {
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      href: "#",
      label: "LinkedIn",
    },
  ],
}: SiteFooterProps) {
  return (
    <footer className="relative py-12 border-t border-white/10 bg-blue-950">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Image src={logo || "/placeholder.svg"} alt="Logo" width={120} height={40} className="h-10 w-auto mb-4" />
            <p className="text-sm text-blue-200">{description}</p>
          </motion.div>

          {columns.map((column, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              viewport={{ once: true }}
            >
              <h3 className="text-white font-semibold mb-4">{column.title}</h3>
              <ul className="space-y-2 text-sm">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link href={link.href} className="text-blue-200 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              {contactInfo.email && <li>{contactInfo.email}</li>}
              {contactInfo.phone && <li>{contactInfo.phone}</li>}
              {contactInfo.address && <li>{contactInfo.address}</li>}
            </ul>
            <div className="flex gap-4 mt-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="text-blue-300 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <span className="sr-only">{social.label}</span>
                  {social.icon}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-sm text-blue-200">© {new Date().getFullYear()} Evalia. Todos los derechos reservados.</p>
        </motion.div>
      </div>
    </footer>
  )
}
