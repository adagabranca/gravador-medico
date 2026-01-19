"use client"

import { motion } from "framer-motion"
import { Lock, Check } from "lucide-react"
import { useState } from "react"

interface ToolCardProps {
  title: string
  description: string
  icon: React.ReactNode
  gradient: string
  badge: string
  locked: boolean
  price?: string
  onClick: () => void
}

export default function ToolCard({
  title,
  description,
  icon,
  gradient,
  badge,
  locked,
  price,
  onClick,
}: ToolCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="relative cursor-pointer group"
    >
      {/* Card Container */}
      <motion.div
        whileHover={{ scale: 1.03, y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
  className="relative h-full rounded-2xl bg-gradient-to-br from-brand-700 to-brand backdrop-blur-xl border border-brand overflow-hidden"
      >
        {/* Gradient Background */}
  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`} />

        {/* Glow Effect on Hover */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.3 : 0,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.4 }}
          className={`absolute inset-0 bg-gradient-to-br ${gradient} blur-2xl`}
        />

        {/* Border Glow */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: isHovered ? `0 0 40px rgba(16, 185, 129, 0.4)` : "none",
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-6">
          {/* Top Section */}
          <div className="flex items-start justify-between mb-6">
            {/* Icon */}
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
              {icon}
            </div>

            {/* Badge */}
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                    locked
                      ? "bg-background text-foreground border-2 border-border"
                      : "bg-brand text-white border-2 border-brand-700"
                  }`}
            >
              {badge}
            </div>
          </div>

          {/* Title & Description */}
          <div className="mb-6 min-h-[120px]">
            <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2">{title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{description}</p>
          </div>

          {/* Bottom Section */}
          <div className="flex items-center justify-between">
            {locked ? (
              <>
                      <div className="text-2xl font-bold text-foreground">{price || "R$ 0"}</div>
                      <div className="w-10 h-10 rounded-full bg-danger/80 backdrop-blur-sm flex items-center justify-center border border-danger">
                        <Lock className="w-5 h-5 text-white" />
                </div>
              </>
            ) : (
              <>
                <div className="text-brand font-semibold text-sm">Desbloqueado</div>
                <div className="w-10 h-10 rounded-full bg-brand/20 backdrop-blur-sm flex items-center justify-center border border-brand-700/30">
                  <Check className="w-5 h-5 text-brand" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sparkle Effect on Hover (Unlocked Only) */}
        {!locked && (
          <motion.div
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.8,
            }}
            className="absolute top-4 right-4 w-3 h-3 bg-brand rounded-full blur-sm"
          />
        )}
      </motion.div>
    </motion.div>
  )
}
