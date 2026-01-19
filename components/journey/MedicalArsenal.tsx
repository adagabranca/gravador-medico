"use client"

import { motion } from "framer-motion"
import { MessageSquare, Calendar, Headphones, Lock, Sparkles } from "lucide-react"
import { useState } from "react"

interface ArsenalCardProps {
  icon: React.ReactNode
  title: string
  description: string
  price: string
  features: string[]
  isLocked?: boolean
  gradient: string
  onUnlock: () => void
}

function ArsenalCard({
  icon,
  title,
  description,
  price,
  features,
  isLocked = true,
  gradient,
  onUnlock,
}: ArsenalCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      {/* Glassmorphism Card */}
      <motion.div
        className="relative overflow-hidden rounded-3xl p-8 h-full"
        style={{
          background: isLocked
            ? "rgba(15, 23, 42, 0.6)"
            : "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          border: isLocked
            ? "1px solid rgba(255, 255, 255, 0.1)"
            : "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Glow Effect on Hover */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.6 : 0,
            scale: isHovered ? 1.2 : 0.8,
          }}
          transition={{ duration: 0.4 }}
          className={`absolute inset-0 bg-gradient-to-br ${gradient} blur-3xl`}
        />

        {/* Shimmer Effect */}
        {isHovered && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
          />
        )}

        <div className="relative z-10">
          {/* Lock Badge */}
          {isLocked && (
            <motion.div
              animate={{
                rotate: isHovered ? [0, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center"
            >
              <Lock className="w-5 h-5 text-white" />
            </motion.div>
          )}

          {/* Icon */}
          <motion.div
            animate={{
              y: isHovered ? -5 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            className="mb-6"
          >
            <div
              className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
            >
              {icon}
            </div>
          </motion.div>

          {/* Title */}
          <h3
            className={`text-2xl font-bold mb-3 ${
              isLocked ? "text-white" : "text-slate-900"
            }`}
          >
            {title}
          </h3>

          {/* Description */}
          <p
            className={`text-sm mb-6 leading-relaxed ${
              isLocked ? "text-slate-300" : "text-slate-600"
            }`}
          >
            {description}
          </p>

          {/* Features */}
          <div className="mb-6 space-y-2">
            {features.slice(0, 3).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-2"
              >
                <Sparkles
                  className={`w-4 h-4 flex-shrink-0 ${
                    isLocked ? "text-cyan-400" : "text-blue-600"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isLocked ? "text-slate-300" : "text-slate-700"
                  }`}
                >
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Price & CTA */}
          <div className="pt-6 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p
                  className={`text-xs ${
                    isLocked ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Investimento
                </p>
                <p
                  className={`text-3xl font-bold ${
                    isLocked ? "text-white" : "text-slate-900"
                  }`}
                >
                  {price}
                </p>
              </div>
            </div>

            <motion.button
              onClick={onUnlock}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                isLocked
                  ? "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
                  : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
              }`}
            >
              {isLocked ? (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Desbloquear
                </span>
              ) : (
                "Adquirir Agora"
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Animated Border Glow */}
      {isHovered && isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-3xl"
          style={{
            background: `linear-gradient(135deg, ${gradient})`,
            filter: "blur(20px)",
            zIndex: -1,
          }}
        />
      )}
    </motion.div>
  )
}

interface MedicalArsenalProps {
  onUnlockWhatsApp: () => void
  onUnlockSocialMedia: () => void
  onUnlockVipSupport: () => void
}

export default function MedicalArsenal({
  onUnlockWhatsApp,
  onUnlockSocialMedia,
  onUnlockVipSupport,
}: MedicalArsenalProps) {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-slate-100" />

      {/* Decorative Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 text-white text-sm font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Extras Premium
          </motion.div>

          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Arsenal Médico{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              Avançado
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Expanda suas capacidades com ferramentas profissionais desenvolvidas
            especificamente para médicos modernos.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArsenalCard
            icon={<MessageSquare className="w-8 h-8 text-white" />}
            title="Pacote WhatsApp"
            description="Biblioteca completa de mensagens profissionais para comunicação com pacientes."
            price="R$ 47"
            features={[
              "50+ templates de mensagens",
              "Respostas automáticas personalizáveis",
              "Lembretes de consulta pré-formatados",
            ]}
            gradient="from-brand-500 to-brand-600"
            onUnlock={onUnlockWhatsApp}
          />

          <ArsenalCard
            icon={<Calendar className="w-8 h-8 text-white" />}
            title="Planejamento 2026"
            description="Calendário editorial completo com conteúdos para suas redes sociais médicas."
            price="R$ 67"
            features={[
              "365 ideias de posts prontas",
              "Templates visuais editáveis",
              "Estratégia de crescimento inclusa",
            ]}
            gradient="from-blue-500 to-indigo-600"
            onUnlock={onUnlockSocialMedia}
          />

          <ArsenalCard
            icon={<Headphones className="w-8 h-8 text-white" />}
            title="Suporte VIP"
            description="Acesso prioritário ao suporte técnico com respostas em até 2 horas."
            price="R$ 90"
            features={[
              "Suporte prioritário WhatsApp",
              "Ajustes de prompt personalizados",
              "Consultoria de implementação",
            ]}
            gradient="from-purple-500 to-pink-600"
            onUnlock={onUnlockVipSupport}
          />
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
            <p className="text-slate-600 text-lg">
            💡 <strong>Dica:</strong> Adquira os 3 pacotes juntos e ganhe{" "}
            <span className="text-brand-600 font-bold">30% de desconto</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
