"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Brain, Play, Copy, Check, ChevronRight } from "lucide-react"
import { useState } from "react"

interface EducationalModalProps {
  isOpen: boolean
  onClose: () => void
  intelligenceType?: "default" | "detailed" | "concise"
}

export default function EducationalModal({
  isOpen,
  onClose,
  intelligenceType = "default",
}: EducationalModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [copied, setCopied] = useState(false)

  // Intelligence content based on type
  const intelligenceContent = {
    default: {
      title: "A Inteligência",
      explanation:
        "A Inteligência é o cérebro do seu gravador médico. Ela transforma sua consulta gravada em um prontuário estruturado e completo.",
      howItWorks: [
        "Você grava a consulta normalmente",
        "A Inteligência escuta e interpreta tudo",
        "Em segundos, gera o prontuário formatado",
      ],
      promptText: `Você é um assistente médico especializado. Transcreva esta consulta em formato de prontuário SOAP:

**Subjetivo (S):**
- Queixa principal
- História da doença atual
- Sintomas relatados

**Objetivo (O):**
- Exame físico
- Sinais vitais mencionados

**Avaliação (A):**
- Hipóteses diagnósticas
- Análise clínica

**Plano (P):**
- Conduta
- Prescrições
- Orientações
- Retorno

Mantenha linguagem técnica-profissional e preserve informações clínicas exatas.`,
    },
    detailed: {
      title: "Inteligência Detalhada",
      explanation:
        "Versão avançada que captura até conversas paralelas, dúvidas do paciente e observações sutis durante a consulta.",
      howItWorks: [
        "Captura contexto completo da consulta",
        "Inclui perguntas e respostas do paciente",
        "Adiciona observações comportamentais",
      ],
      promptText: `Você é um assistente médico especializado. Transcreva esta consulta em formato DETALHADO com contexto completo:

**Narrativa da Consulta:**
- Diálogo completo médico-paciente
- Perguntas e respostas
- Observações comportamentais

**Subjetivo (S):**
- Queixa principal e evolução
- História da doença atual com timeline
- Sintomas com intensidade/frequência

**Objetivo (O):**
- Exame físico completo
- Sinais vitais
- Observações físicas

**Avaliação (A):**
- Hipóteses diagnósticas justificadas
- Diagnósticos diferenciais
- Análise clínica detalhada

**Plano (P):**
- Conduta terapêutica completa
- Prescrições com posologia
- Orientações detalhadas
- Exames solicitados
- Data retorno

Preserve nuances da comunicação médico-paciente.`,
    },
    concise: {
      title: "Inteligência Concisa",
      explanation:
        "Versão rápida e objetiva, ideal para consultas de retorno ou casos simples que precisam de documentação ágil.",
      howItWorks: [
        "Foca nos pontos-chave da consulta",
        "Gera prontuário resumido",
        "Perfeito para alto volume de atendimentos",
      ],
      promptText: `Você é um assistente médico. Transcreva esta consulta em formato CONCISO:

**S:** Queixa e sintomas principais

**O:** Achados relevantes no exame

**A:** Diagnóstico

**P:** Conduta, prescrição e retorno

Linguagem objetiva e direta. Máximo 200 palavras.`,
    },
  }

  const content = intelligenceContent[intelligenceType]

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content.promptText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      handleCopy()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center justify-center group"
              >
                <X className="w-5 h-5 text-white/80 group-hover:text-white" />
              </button>

              {/* Progress Steps */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <motion.div
                    key={step}
                    initial={false}
                    animate={{
                      scale: currentStep === step ? 1.2 : 1,
                      backgroundColor:
                        currentStep >= step ? "rgba(139, 92, 246, 0.8)" : "rgba(255, 255, 255, 0.1)",
                    }}
                    className="w-2 h-2 rounded-full"
                  />
                ))}
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="p-8 md:p-12">
                  {/* Step 1: What is this? */}
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        {/* Icon */}
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                          className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/50"
                        >
                          <Brain className="w-10 h-10 text-white" />
                        </motion.div>

                        {/* Title */}
                        <div className="text-center">
                          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            O que é isso?
                          </h2>
                          <p className="text-xl text-white/70 leading-relaxed">
                            {content.explanation}
                          </p>
                        </div>

                        {/* Visual Metaphor */}
                        <div className="flex items-center justify-center gap-4 py-8">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-blue-500/20 backdrop-blur-sm flex items-center justify-center mb-2">
                              <Play className="w-8 h-8 text-blue-400" />
                            </div>
                            <span className="text-sm text-white/50">Consulta</span>
                          </div>

                          <ChevronRight className="w-8 h-8 text-white/30" />

                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-purple-500/20 backdrop-blur-sm flex items-center justify-center mb-2">
                              <Brain className="w-8 h-8 text-purple-400" />
                            </div>
                            <span className="text-sm text-white/50">Inteligência</span>
                          </div>

                          <ChevronRight className="w-8 h-8 text-white/30" />

                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-brand-500/20 backdrop-blur-sm flex items-center justify-center mb-2">
                              <Check className="w-8 h-8 text-brand-400" />
                            </div>
                            <span className="text-sm text-white/50">Prontuário</span>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: How to use? */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="text-center mb-8">
                          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            Como usar?
                          </h2>
                          <p className="text-xl text-white/60">
                            Simples como 1, 2, 3
                          </p>
                        </div>

                        {/* Steps */}
                        <div className="space-y-6">
                          {content.howItWorks.map((step, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.2 }}
                              className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                            >
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg font-bold text-white">{index + 1}</span>
                              </div>
                              <p className="text-lg text-white/80 leading-relaxed pt-1.5">
                                {step}
                              </p>
                            </motion.div>
                          ))}
                        </div>

                        {/* Demo Preview */}
                        <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                          <div className="flex items-center gap-3 mb-4">
                            <Play className="w-5 h-5 text-purple-400" />
                            <span className="text-sm font-semibold text-purple-300">
                              Quer ver funcionando?
                            </span>
                          </div>
                          <p className="text-white/70 text-sm">
                            Assista ao vídeo de 30 segundos mostrando a mágica acontecendo em tempo real
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Copy Intelligence */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="text-center mb-6">
                          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                            {content.title}
                          </h2>
                          <p className="text-white/60">
                            Copie e cole no seu gravador médico
                          </p>
                        </div>

                        {/* Prompt Box */}
                        <div className="relative">
                          <pre className="p-6 rounded-2xl bg-black/40 border border-white/10 text-sm text-white/80 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                            {content.promptText}
                          </pre>

                          {/* Copy Button */}
                          <button
                            onClick={handleCopy}
                            className="absolute top-4 right-4 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors flex items-center gap-2 group"
                          >
                                {copied ? (
                              <>
                                <Check className="w-4 h-4 text-brand-400" />
                                <span className="text-sm font-semibold text-brand-400">
                                  Copiado!
                                </span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 text-white/70 group-hover:text-white" />
                                <span className="text-sm font-semibold text-white/70 group-hover:text-white">
                                  Copiar
                                </span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Info Card */}
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                          <p className="text-sm text-blue-200">
                            <strong>Dica:</strong> Cole essa inteligência nas configurações do seu
                            aplicativo de gravação (ex: Otter, Grain, etc.)
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10">
                    {currentStep > 1 && (
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
                      >
                        Voltar
                      </button>
                    )}

                    <button
                      onClick={handleNextStep}
                      className="ml-auto px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 text-white font-bold transition-all flex items-center gap-2"
                    >
                      {currentStep === 3 ? (
                        <>
                          <Copy className="w-5 h-5" />
                          Copiar Inteligência
                        </>
                      ) : (
                        <>
                          Próximo
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Aurora Glow Effect */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-full blur-3xl pointer-events-none"
              />
              <motion.div
                animate={{
                  opacity: [0.2, 0.5, 0.2],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-600/30 to-cyan-600/30 rounded-full blur-3xl pointer-events-none"
              />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
