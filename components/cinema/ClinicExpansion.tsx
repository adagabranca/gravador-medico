"use client"

import { motion } from "framer-motion"
import { MessageSquare, Calendar, Headphones, Lock, Sparkles, ArrowRight } from "lucide-react"
import { useState } from "react"

interface UpsellCard {
  id: string
  icon: React.ReactNode
  title: string
  subtitle: string
  description: string
  price: string
  gradient: string
  benefits: string[]
  locked: boolean
  onClick: () => void
}

interface UpsellCardProps {
  card: UpsellCard
  index: number
}

function ClinicCard({ card, index }: UpsellCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative flex-shrink-0 w-full md:w-[380px] cursor-pointer group"
      onClick={card.onClick}
    >
      {/* Card Container */}
      <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
        {/* Animated Glow */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.4 : 0,
            scale: isHovered ? 1.5 : 1,
          }}
          transition={{ duration: 0.6 }}
          className={`absolute inset-0 bg-gradient-to-br ${card.gradient} blur-3xl`}
        />

        {/* Lock Badge */}
        {card.locked && (
          <div className="absolute top-4 right-4 z-10">
            <motion.div
              animate={{
                rotate: isHovered ? [0, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center border border-white/20"
            >
              <Lock className="w-5 h-5 text-white/80" />
            </motion.div>
          </div>
        )}

        <div className="relative z-10 p-8">
          {/* Icon */}
          <motion.div
            animate={{
              y: isHovered ? -5 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            className="mb-6"
          >
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-xl`}>
              {card.icon}
            </div>
          </motion.div>

          {/* Content */}
          <div className="mb-6">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider">
              {card.subtitle}
            </span>
            <h3 className="text-2xl font-bold text-white mt-2 mb-3">
              {card.title}
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              {card.description}
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-2 mb-6">
            {card.benefits.slice(0, 3).map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-start gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-white/70">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* Price & CTA */}
          <div className="pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-white/50">A partir de</span>
                <div className="text-3xl font-bold text-white">{card.price}</div>
              </div>
              <motion.div
                animate={{
                  x: isHovered ? 5 : 0,
                }}
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20"
              >
                <ArrowRight className="w-6 h-6 text-white" />
              </motion.div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Desbloquear Agora
            </motion.button>
          </div>
        </div>

        {/* Hover Border Effect */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          className={`absolute inset-0 rounded-2xl border-2 bg-gradient-to-br ${card.gradient} opacity-20`}
        />
      </div>
    </motion.div>
  )
}

interface ClinicExpansionProps {
  onUnlockWhatsApp: () => void
  onUnlockSocialMedia: () => void
  onUnlockConsultancy: () => void
}

export default function ClinicExpansion({
  onUnlockWhatsApp,
  onUnlockSocialMedia,
  onUnlockConsultancy,
}: ClinicExpansionProps) {
  const cards: UpsellCard[] = [
      {
      id: "whatsapp",
      icon: <MessageSquare className="w-8 h-8 text-white" />,
      title: "Fidelização Automática",
      subtitle: "COMUNICAÇÃO",
      description: "Mensagens profissionais prontas para engajar seus pacientes via WhatsApp.",
      price: "R$ 47",
      gradient: "from-brand-500 to-brand-600",
      benefits: [
        "50+ templates de mensagens",
        "Confirmações automáticas",
        "Scripts de acolhimento",
      ],
      locked: true,
      onClick: onUnlockWhatsApp,
    },
    {
      id: "social",
      icon: <Calendar className="w-8 h-8 text-white" />,
      title: "Redes Sociais",
      subtitle: "MARKETING MÉDICO",
      description: "Planejamento completo 2026 com posts prontos para Instagram e LinkedIn.",
      price: "R$ 67",
      gradient: "from-blue-500 to-indigo-600",
      benefits: [
        "365 posts planejados",
        "Templates editáveis",
        "Estratégia de crescimento",
      ],
      locked: true,
      onClick: onUnlockSocialMedia,
    },
    {
      id: "vip",
      icon: <Headphones className="w-8 h-8 text-white" />,
      title: "Setup com Especialista",
      subtitle: "CONSULTORIA VIP",
      description: "Sessão 1-on-1 para configurar perfeitamente seu gravador médico.",
      price: "R$ 90",
      gradient: "from-purple-500 to-pink-600",
      benefits: [
        "Sessão ao vivo 60min",
        "Personalização total",
        "Suporte prioritário 30 dias",
      ],
      locked: true,
      onClick: onUnlockConsultancy,
    },
  ]

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-purple-600/5 to-blue-600/5 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Expanda sua Clínica
            </h2>
          </div>
          <p className="text-lg text-white/60 ml-7">
            Ferramentas premium para levar sua prática ao próximo nível
          </p>
        </motion.div>

        {/* Horizontal Scroll Cards */}
        <div className="overflow-x-auto scrollbar-hide pb-8">
          <div className="flex gap-6">
            {cards.map((card, index) => (
              <ClinicCard key={card.id} card={card} index={index} />
            ))}
          </div>
        </div>

        {/* Bundle Offer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-1">
                  Bundle Completo
                </h4>
                <p className="text-sm text-white/60">
                  Adquira os 3 pacotes e ganhe{" "}
                  <span className="text-brand-400 font-bold">30% de desconto</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-white/50 line-through">R$ 204</div>
                <div className="text-3xl font-bold text-white">R$ 143</div>
              </div>
              <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
                Ver Bundle
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
