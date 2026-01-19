"use client"

import { motion } from "framer-motion"
import { Home, Settings, Sparkles, Wrench, ShoppingBag, HelpCircle, User } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

interface NavItem {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  badge?: string
}

export default function Sidebar() {
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const navItems: NavItem[] = [
    {
      id: "home",
      label: "Início",
      icon: <Home className="w-5 h-5" />,
      href: "/dashboard",
    },
    {
      id: "setup",
      label: "Configuração",
      icon: <Settings className="w-5 h-5" />,
      href: "/dashboard/setup",
      badge: "Core",
    },
    {
      id: "prompts",
      label: "Prompts",
      icon: <Sparkles className="w-5 h-5" />,
      href: "/dashboard/prompts",
    },
    {
      id: "tools",
      label: "Ferramentas",
      icon: <Wrench className="w-5 h-5" />,
      href: "/dashboard/tools",
      badge: "Bônus",
    },
    {
      id: "store",
      label: "Loja VIP",
      icon: <ShoppingBag className="w-5 h-5" />,
      href: "/dashboard/store",
    },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed left-0 top-0 h-screen w-[280px] z-40 p-6 flex flex-col"
    >
      {/* Glassmorphism Container */}
      <div className="relative h-full rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Animated Aurora Glow */}
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 h-full flex flex-col p-6">
          {/* Logo/Brand */}
          <div className="mb-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Gravador</h1>
                <p className="text-xs text-white/50">Médico Pro</p>
              </div>
            </motion.div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const active = isActive(item.href)
              const hovered = hoveredItem === item.id

              return (
                <motion.a
                  key={item.id}
                  href={item.href}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  whileHover={{ x: 4 }}
                  className="relative block"
                >
                  {/* Active/Hover Background */}
                  <motion.div
                    initial={false}
                    animate={{
                      opacity: active ? 1 : hovered ? 0.5 : 0,
                      scale: active || hovered ? 1 : 0.95,
                    }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/10"
                  />

                  {/* Content */}
                  <div className="relative flex items-center gap-3 px-4 py-3">
                    <div
                      className={`transition-colors ${
                        active ? "text-white" : "text-white/60"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        active ? "text-white" : "text-white/70"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Badge */}
                    {item.badge && (
                      <motion.span
                        animate={{
                          scale: hovered ? 1.1 : 1,
                        }}
                        className="ml-auto px-2 py-0.5 rounded-full bg-blue-500/20 text-[10px] font-bold text-blue-300 border border-blue-500/30"
                      >
                        {item.badge}
                      </motion.span>
                    )}

                    {/* Active Indicator */}
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-blue-500 to-purple-600"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </div>
                </motion.a>
              )
            })}
          </nav>

          {/* Footer: User & Help */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            {/* Help Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-white/60" />
              <span className="text-sm font-medium text-white/70">Central de Ajuda</span>
            </motion.button>

            {/* User Profile */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center ring-2 ring-white/20">
                <User className="w-5 h-5 text-white" />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Dr. Silva</p>
                <p className="text-xs text-white/50 truncate">Cardiologista</p>
              </div>

              {/* Settings Dots */}
              <div className="w-1 h-1 rounded-full bg-white/40" />
              <div className="w-1 h-1 rounded-full bg-white/40 -ml-2" />
              <div className="w-1 h-1 rounded-full bg-white/40 -ml-2" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
