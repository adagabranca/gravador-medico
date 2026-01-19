"use client"

import { motion } from "framer-motion"
import { Smartphone, FileText, Cloud, Check } from "lucide-react"
import { useState } from "react"

interface TimelineStepProps {
  stepNumber: number
  icon: React.ReactNode
  title: string
  description: string
  features?: string[]
  buttonText: string
  onButtonClick: () => void
  isCompleted?: boolean
}

function TimelineStep({
  stepNumber,
  icon,
  title,
  description,
  features,
  buttonText,
  onButtonClick,
  isCompleted = false,
}: TimelineStepProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative"
    >
      {/* Glassmorphism Card */}
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative overflow-hidden rounded-3xl p-8 md:p-12"
        style={{
          background: "rgba(255, 255, 255, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Animated Background Glow */}
        <motion.div
          animate={{
            opacity: isHovered ? 0.3 : 0,
            scale: isHovered ? 1.5 : 1,
          }}
          className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"
        />

        <div className="relative z-10">
          {/* Step Number Badge */}
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold text-lg mb-6 shadow-lg"
          >
            {stepNumber}
          </motion.div>

          {/* Icon */}
          <motion.div
            animate={{
              y: isHovered ? -10 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-lg">
              {icon}
            </div>
          </motion.div>

          {/* Title */}
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {title}
          </h3>

          {/* Description */}
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">
            {description}
          </p>

          {/* Features Checklist */}
          {features && features.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-8 space-y-3"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-700 font-medium">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* CTA Button */}
          <motion.button
            onClick={onButtonClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full md:w-auto px-8 py-4 rounded-xl font-semibold text-lg shadow-xl transition-all ${
              stepNumber === 2
                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                : "bg-gradient-to-r from-slate-900 to-slate-800 text-white"
            }`}
          >
            {buttonText}
          </motion.button>

          {/* Completion Badge */}
          {isCompleted && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute top-8 right-8 w-16 h-16 rounded-full bg-brand-500 flex items-center justify-center shadow-lg"
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

interface JourneyTimelineProps {
  onInstallClick: () => void
  onCopyPromptClick: () => void
  onDriveClick: () => void
  promptCopied: boolean
}

export default function JourneyTimeline({
  onInstallClick,
  onCopyPromptClick,
  onDriveClick,
  promptCopied,
}: JourneyTimelineProps) {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Sua Jornada em{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              3 Passos
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Configure seu gravador médico em minutos e comece a transformar consultas em prontuários estruturados.
          </p>
        </motion.div>

        {/* Timeline Steps */}
        <div className="space-y-12">
          {/* Step 1: App Installation */}
          <TimelineStep
            stepNumber={1}
            icon={<Smartphone className="w-10 h-10 text-blue-600" />}
            title="A Ativação"
            description="Instale o VoicePen e ative o cancelamento de ruído para gravações médicas de alta qualidade."
            buttonText="Ver Guia Visual"
            onButtonClick={onInstallClick}
          />

          {/* Step 2: Master Prompt - DESTAQUE MÁXIMO */}
          <TimelineStep
            stepNumber={2}
            icon={<FileText className="w-10 h-10 text-purple-600" />}
            title="A Inteligência"
            description="Instale o Prompt de Anamnese Estruturada (SOAP) - O cérebro do seu prontuário automático."
            features={[
              "Anamnese completa seguindo metodologia SOAP",
              "Resumo executivo para decisões rápidas",
              "Insights clínicos baseados em guidelines",
              "Identificação de gaps diagnósticos",
            ]}
            buttonText={promptCopied ? "✓ Código Copiado!" : "COPIAR CÓDIGO DO PROMPT"}
            onButtonClick={onCopyPromptClick}
            isCompleted={promptCopied}
          />

          {/* Step 3: Cloud Integration */}
          <TimelineStep
            stepNumber={3}
            icon={<Cloud className="w-10 h-10 text-cyan-600" />}
            title="O Ecossistema"
            description="Conecte exportação direta para o Google Drive e mantenha seus prontuários seguros e acessíveis."
            buttonText="Conectar Drive"
            onButtonClick={onDriveClick}
          />
        </div>
      </div>
    </section>
  )
}
