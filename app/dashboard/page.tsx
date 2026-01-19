"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Sparkles,
  Clock,
  Users,
  TrendingUp,
  Play,
  Shield,
  BookOpen,
  Smartphone,
  Brain,
  Mic,
  MessageSquare,
  BarChart3,
  FileCheck,
  Headphones,
} from "lucide-react"
import ContentModal from "@/components/ContentModal"
import ToolCard from "@/components/ToolCard"
import ConfettiButton from "@/components/ConfettiButton"
import SetupWizard from "@/components/SetupWizard"
import MedicalProfileWizard from "@/components/MedicalProfileWizard"
import AIPromptGenerator from "@/components/AIPromptGenerator"
import VoicePenFeatures from "@/components/VoicePenFeatures"
import VoicePenShowcase from "@/components/VoicePenShowcase"
import ShortcutTutorial from "@/components/ShortcutTutorial"
import ToolDetailModal from "@/components/ToolDetailModal"
import LGPDArticleModal from "@/components/LGPDArticleModal"
import AICardioArticleModal from "@/components/AICardioArticleModal"
import ProductivityArticleModal from "@/components/ProductivityArticleModal"
import DockSidebar from "@/components/DockSidebar"
import ProtectedRoute from "@/components/ProtectedRoute"
import type { MedicalProfile } from "@/components/MedicalProfileWizard"
import { useToast } from "@/components/ui/toast"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}

function DashboardContent() {
  const [selectedModal, setSelectedModal] = useState<string | null>(null)
  const [showSetupWizard, setShowSetupWizard] = useState(false)
  const [showProfileWizard, setShowProfileWizard] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [showVoicePenFeatures, setShowVoicePenFeatures] = useState(false)
  const [showVoicePenShowcase, setShowVoicePenShowcase] = useState(false)
  const [showShortcutTutorial, setShowShortcutTutorial] = useState(false)
  const [showToolDetail, setShowToolDetail] = useState<string | null>(null)
  const [showLGPDArticle, setShowLGPDArticle] = useState(false)
  const [showAICardioArticle, setShowAICardioArticle] = useState(false)
  const [showProductivityArticle, setShowProductivityArticle] = useState(false)
  const [medicalProfile, setMedicalProfile] = useState<MedicalProfile | null>(null)
  const { toast } = useToast()

  const promptMestre = `Você é um assistente médico especializado altamente qualificado. Sua função é transcrever consultas médicas em formato de prontuário eletrônico estruturado, seguindo rigorosamente o método SOAP (Subjetivo, Objetivo, Avaliação e Plano).

**INSTRUÇÕES CRÍTICAS:**

1. **Subjetivo (S):**
   - Queixa principal do paciente
   - História da doença atual com timeline detalhado
   - Sintomas relatados (intensidade, frequência, duração)
   - Histórico médico relevante
   
2. **Objetivo (O):**
   - Sinais vitais mencionados
   - Achados do exame físico
   - Observações clínicas objetivas
   
3. **Avaliação (A):**
   - Hipóteses diagnósticas com justificativas
   - Diagnósticos diferenciais
   - Análise clínica fundamentada
   
4. **Plano (P):**
   - Conduta terapêutica detalhada
   - Prescrições com posologia completa
   - Exames complementares solicitados
   - Orientações ao paciente
   - Data e condições de retorno

**DIRETRIZES DE QUALIDADE:**
- Use terminologia médica técnica e precisa
- Preserve todas as informações clínicas relevantes
- Mantenha confidencialidade (remova nomes se necessário)
- Estruture de forma clara e profissional
- Inclua apenas informações clinicamente relevantes

**FORMATO DE SAÍDA:**
Prontuário estruturado em seções SOAP, pronto para ser arquivado no sistema do consultório.`

  const educationCards = [
    {
      id: "digitacao",
      title: "O Fim da Digitação",
      description: "Descubra como médicos economizam +2 horas por dia",
  gradient: "from-brand-800 to-brand-900",
      image: "/images/fim-digitacao.png",
      content: (
        <>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">A Revolução Operacional</h3>
          <p className="mb-4">
            Médicos brasileiros perdem em média <strong className="text-gray-900">2-3 horas por dia</strong> digitando prontuários.
            Isso representa 40% do tempo que poderia ser dedicado aos pacientes.
          </p>
          <p className="mb-4">
            Com o método VoicePen + Inteligência Artificial, você:
          </p>
          <ul className="space-y-2 ml-4">
            <li>✅ Grava a consulta naturalmente</li>
            <li>✅ Foca 100% no paciente</li>
            <li>✅ Recebe o prontuário estruturado em segundos</li>
            <li>✅ Recupera até 10 horas por semana</li>
          </ul>
          <div className="mt-6 p-4 rounded-xl bg-brand-600 border border-brand-700">
            <p className="text-gray-900 text-sm">
              <strong>Dados Reais:</strong> Cardiologistas que adotaram este método reduziram em 67% o tempo de documentação.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "prompt",
      title: "O Que é um Prompt?",
      description: "Entenda o 'Residente Digital' que trabalha para você",
  gradient: "from-brand-800 to-brand-900",
      image: "/images/cavador-medico.png",
      content: (
        <>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Seu Residente Digital</h3>
          <p className="mb-4">
            Um <strong className="text-gray-900">Prompt</strong> é um conjunto de instruções precisas que você dá à Inteligência Artificial.
            Pense nele como um <em>residente médico digital</em> que você treinou para documentar exatamente como você gosta.
          </p>
          <p className="mb-4">
            <strong className="text-gray-900">O Prompt Mestre que você copiará:</strong>
          </p>
          <ul className="space-y-2 ml-4">
            <li>📋 Estrutura suas consultas no formato SOAP</li>
            <li>🎯 Usa terminologia médica adequada</li>
            <li>🔍 Preserva detalhes clínicos importantes</li>
            <li>⚡ Gera prontuários em 30 segundos</li>
          </ul>
          <div className="mt-6 p-4 rounded-xl bg-brand-600 border border-brand-700">
            <p className="text-gray-900 text-sm">
              <strong>Analogia:</strong> Se o gravador é o estetoscópio digital, o Prompt é o protocolo clínico que ele segue.
            </p>
          </div>
        </>
      ),
    },
    {
      id: "seguranca",
      title: "Segurança & Ética",
      description: "LGPD, consentimento e boas práticas",
  gradient: "from-brand-600 to-brand-600",
      image: "/images/seguranca-etica.png",
      content: (
        <>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Conformidade Total</h3>
          <p className="mb-4">
            Este método foi desenhado respeitando a <strong className="text-gray-900">LGPD</strong> (Lei Geral de Proteção de Dados)
            e as diretrizes do <strong className="text-gray-900">Conselho Federal de Medicina</strong>.
          </p>
          <h4 className="text-xl font-bold text-gray-900 mb-3">Checklist de Segurança:</h4>
          <ul className="space-y-2 ml-4">
            <li>🔒 <strong className="text-gray-900">Consentimento:</strong> Sempre informe o paciente sobre a gravação</li>
            <li>🛡️ <strong className="text-gray-900">Criptografia:</strong> Use aplicativos com criptografia end-to-end</li>
            <li>🗑️ <strong className="text-gray-900">Exclusão:</strong> Delete áudios após transcrição</li>
            <li>📜 <strong className="text-gray-900">Anonimização:</strong> Remova dados pessoais desnecessários</li>
          </ul>
          <div className="mt-6 p-4 rounded-xl bg-brand-600 border border-brand-700">
            <p className="text-gray-900 text-sm">
              <strong>Termo Sugerido:</strong> "Doutor(a), permito a gravação desta consulta para fins de registro médico, 
              conforme a LGPD. Compreendo que o áudio será excluído após a transcrição."
            </p>
          </div>
        </>
      ),
    },
  ]

  const tools = [
    {
      id: "whatsapp",
      title: "Gerador WhatsApp Pós-Consulta",
      description: "Fidelize pacientes em 1 clique. 50+ templates profissionais para engajamento.",
      icon: <MessageSquare className="w-7 h-7 text-gray-900" />,
  gradient: "from-brand-500 to-brand-600",
      badge: "LIBERADO",
      locked: false,
    },
    {
      id: "marketing",
      title: "Marketing Médico Express",
      description: "Transforme consultas em Posts. Crie conteúdo educativo para redes sociais automaticamente.",
      icon: <TrendingUp className="w-7 h-7 text-gray-900" />,
  gradient: "from-brand-500 to-brand-600",
      badge: "R$ 37,00",
      locked: true,
      price: "R$ 37",
    },
    {
      id: "auditor",
      title: "Auditor Clínico IA",
      description: "Valide prontuários contra diretrizes médicas. Detecte inconsistências antes de finalizar.",
      icon: <FileCheck className="w-7 h-7 text-gray-900" />,
  gradient: "from-purple-500 to-brand-600",
      badge: "R$ 29,00",
      locked: true,
      price: "R$ 29",
    },
    {
      id: "vip",
      title: "Suporte VIP & Setup",
      description: "Sessão 1-on-1 com especialista. Configuração personalizada e suporte prioritário por 30 dias.",
      icon: <Headphones className="w-7 h-7 text-gray-900" />,
      gradient: "from-amber-500 to-orange-600",
      badge: "R$ 97,00",
      locked: true,
      price: "R$ 97",
    },
  ]

  const handleToolClick = (toolId: string, locked: boolean) => {
    setShowToolDetail(toolId)
  }
  return (
    <>
      <DockSidebar />
      <main className="min-h-screen relative bg-white ml-0 lg:ml-20">
        {/* SEÇÃO A: HERO */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 bg-white">
        <div className="max-w-5xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-600 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-bold text-white">Método Gravador Médico</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900 leading-tight px-2">
              Recupere seu{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-600">
                Tempo
              </span>
              , Doutor.
            </h1>

            {/* Subheadline */}
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed px-4">
              Grave consultas com <span className="font-bold text-brand-600">1 toque no iPhone</span> e receba{" "}
              <span className="font-bold text-brand-600">prontuários completos</span> automaticamente.
            </p>

            {/* CTA Button */}
            <motion.button
              onClick={() => {
                document.querySelector("#intelligence")?.scrollIntoView({ behavior: "smooth" })
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 md:px-10 py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-brand-600 to-brand-600 text-white text-base sm:text-lg font-bold shadow-lg shadow-brand-500/50 overflow-hidden group"
            >
              {/* Pulse Animation */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-brand-400 rounded-2xl"
              />
              
              <Play className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Entenda o Método</span>
            </motion.button>

            {/* Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 pt-8 px-4"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
                <span className="text-gray-600 text-xs sm:text-sm">
                  <strong className="text-gray-900">+2h/dia</strong> economizadas
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
                <span className="text-gray-600 text-xs sm:text-sm">
                  <strong className="text-gray-900">500+</strong> médicos ativos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
                <span className="text-gray-600 text-xs sm:text-sm">
                  <strong className="text-gray-900">67%</strong> menos tempo digitando
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO B: INTELLIGENCE HUB */}
      <section id="intelligence" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Entenda Antes de Começar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Masterclass de 3 minutos sobre o método que está mudando a medicina brasileira
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {educationCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                onClick={() => setSelectedModal(card.id)}
                whileHover={{ scale: 1.03, y: -5 }}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group"
              >
                {/* Background Image */}
                {card.image && (
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                
                {/* Fallback Gradient */}
                {!card.image && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-90`} />
                )}

                {/* Overlay on Hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
                >
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    <Play className="w-8 h-8 text-gray-900 fill-white ml-1" />
                  </div>
                </motion.div>

                {/* Content */}
                <div className="relative h-full p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-900/90 text-sm">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEÇÃO C: JORNADA DE CONFIGURAÇÃO */}
      <section id="journey" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Configuração em 3 Passos
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Siga esta jornada e estará pronto em menos de 10 minutos
            </p>
          </motion.div>

          {/* Quick Setup Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <motion.button
              onClick={() => setShowSetupWizard(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-brand-800 to-brand-900 border-2 border-brand-700 hover:border-brand-600 hover:shadow-xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-brand-700 group-hover:bg-brand-600 transition-colors shadow-lg">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Setup Guiado em 5 Etapas</h3>
                  <p className="text-sm text-gray-200 mb-4 font-medium">
                    Instalação completa do VoicePen com tutorial passo a passo
                  </p>
                  <div className="flex items-center gap-2 text-brand-300 font-bold text-sm">
                    Começar agora
                    <Play className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setShowProfileWizard(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-brand-800 to-brand-900 border-2 border-brand-700 hover:border-brand-600 hover:shadow-xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-brand-700 group-hover:bg-brand-600 transition-colors shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Gerar Prompt Personalizado</h3>
                  <p className="text-sm text-gray-200 mb-4 font-medium">
                    IA cria prompt único baseado na sua especialidade e perfil
                  </p>
                  <div className="flex items-center gap-2 text-brand-300 font-bold text-sm">
                    Criar meu prompt
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.button>

            <motion.button
              onClick={() => setShowShortcutTutorial(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-brand-800 to-brand-900 border-2 border-brand-700 hover:border-brand-600 hover:shadow-xl transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-brand-700 group-hover:bg-brand-600 transition-colors shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">Criar Atalho no iPhone</h3>
                  <p className="text-sm text-gray-200 mb-4 font-medium">
                    Grave consultas com 1 toque - tutorial completo
                  </p>
                  <div className="flex items-center gap-2 text-brand-300 font-bold text-sm">
                    Ver tutorial
                    <Play className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.button>
          </motion.div>

          <div className="space-y-12">
            {/* Passo 1 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-start gap-6"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-800 to-brand-900 flex items-center justify-center shadow-lg">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-brand-700 text-white text-xs shadow-md font-bold">PASSO 1</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Instalar o App</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Baixe o VoicePen AI Note Taker na App Store. 
                  Configure em seu iPhone em 2 minutos e prepare-se para a transformação.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://apps.apple.com/us/app/ai-note-taker-voicepen/id6462815872"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold"
                  >
                    Baixar VoicePen na App Store →
                  </a>
                  <button
                    onClick={() => setShowVoicePenShowcase(true)}
                    className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 font-semibold text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Ver todas as funcionalidades do VoicePen
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Passo 2 - DESTAQUE */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative p-8 rounded-3xl bg-gradient-to-br from-brand-800 to-brand-900 border border-brand-600"
            >
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-brand-700 flex items-center justify-center shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-brand-600 text-white text-xs shadow-md font-bold">PASSO 2 - O GRANDE MOMENTO</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Ativar a Inteligência</h3>
                  <p className="text-gray-200 mb-6 leading-relaxed">
                    Cole o <strong className="text-white">Prompt Mestre</strong> nas configurações do app. 
                    Este é o código que transforma o gravador em especialista médico.
                  </p>

                  {/* Prompt Display */}
                  <div className="relative mb-6 p-6 rounded-2xl bg-brand-950/60 border border-brand-700 backdrop-blur-sm">
                    <div className="max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                        {promptMestre.substring(0, 300)}...
                      </pre>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                  </div>

                  {/* Copy Button */}
                  <div className="flex justify-center">
                    <ConfettiButton promptText={promptMestre} />
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    💡 Dica: Cole este prompt na seção "Custom Instructions" ou "System Prompt" do seu app
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Passo 3 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-start gap-6"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-brand-700 flex items-center justify-center shadow-lg">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full bg-brand-700 text-white text-xs shadow-md font-bold">PASSO 3</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Teste Real</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Grave uma consulta de teste (pode ser simulada). Veja a mágica acontecer: 
                  em 30 segundos você terá um prontuário SOAP perfeito.
                </p>
                <button
                  onClick={() => setShowShortcutTutorial(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500/20 hover:bg-brand-700 text-gray-900 font-semibold transition-colors"
                >
                  Ver Tutorial Completo
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SEÇÃO D: BLOG */}
      <section id="blog" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Medicina 4.0 & Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Artigos sobre tecnologia, gestão e futuro da medicina
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Article 1 */}
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
              onClick={() => setShowLGPDArticle(true)}
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-brand-800 to-brand-900 border border-brand-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-16 h-16 text-white" />
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-brand-600 text-gray-900 text-xs shadow-md font-bold border border-brand-500/30">
                  Em Alta
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Conformidade
                </span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                  LGPD na Medicina: Proteja os Dados dos Seus Pacientes
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Entenda as obrigações legais e boas práticas para manter sua clínica 100% conforme com a Lei Geral de Proteção de Dados.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>5 min de leitura</span>
                </div>
              </div>
            </motion.article>

            {/* Article 2 */}
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
              onClick={() => setShowAICardioArticle(true)}
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-brand-800 to-brand-900 border border-white/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Brain className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Inteligência Artificial
                </span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                  IA na Cardiologia: O Futuro Já Chegou
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Como ferramentas de inteligência artificial estão revolucionando diagnósticos cardíacos e reduzindo erros médicos em 40%.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>7 min de leitura</span>
                </div>
              </div>
            </motion.article>

            {/* Article 3 */}
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
              onClick={() => setShowProductivityArticle(true)}
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-brand-800 to-brand-900 border border-brand-600">
                <div className="absolute inset-0 flex items-center justify-center">
                  <TrendingUp className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                  Produtividade
                </span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                  Gestão de Tempo: Atenda Mais Sem Trabalhar Mais
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Técnicas comprovadas para otimizar sua agenda, automatizar tarefas repetitivas e recuperar horas do seu dia.
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>4 min de leitura</span>
                </div>
              </div>
            </motion.article>
          </div>

          {/* CTA Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-brand-800 to-brand-900 border border-brand-600"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-700 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">
                    Assine Nossa Newsletter
                  </h4>
                  <p className="text-gray-200">
                    Receba artigos semanais sobre inovação médica e inteligência artificial
                  </p>
                </div>
              </div>
              <button
                onClick={() => toast("📬 Newsletter em breve!")}
                className="px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold hover:shadow-xl transition-all whitespace-nowrap"
              >
                Quero Receber
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SEÇÃO E: APPS DE POTENCIALIZAÇÃO */}
      <section id="tools" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Apps de Potencialização
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ferramentas premium para levar sua prática ao próximo nível
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <ToolCard
                key={tool.id}
                title={tool.title}
                description={tool.description}
                icon={tool.icon}
                gradient={tool.gradient}
                badge={tool.badge}
                locked={tool.locked}
                price={tool.price}
                onClick={() => handleToolClick(tool.id, tool.locked)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Spacer */}
      <div className="h-32" />

      {/* Modals */}
      {educationCards.map((card) => (
        <ContentModal
          key={card.id}
          isOpen={selectedModal === card.id}
          onClose={() => setSelectedModal(null)}
          title={card.title}
          content={card.content}
          videoPlaceholder={true}
        />
      ))}

      {/* Setup Wizard */}
      <SetupWizard 
        isOpen={showSetupWizard} 
        onClose={() => setShowSetupWizard(false)} 
      />

      {/* Medical Profile Wizard */}
      <MedicalProfileWizard
        isOpen={showProfileWizard}
        onClose={() => setShowProfileWizard(false)}
        onComplete={(profile) => {
          setMedicalProfile(profile)
          setShowProfileWizard(false)
          setShowAIGenerator(true)
        }}
      />

      {/* AI Prompt Generator */}
      {medicalProfile && (
        <AIPromptGenerator
          isOpen={showAIGenerator}
          onClose={() => setShowAIGenerator(false)}
          profile={medicalProfile}
        />
      )}

      {/* VoicePen Features */}
      <VoicePenFeatures
        isOpen={showVoicePenFeatures}
        onClose={() => setShowVoicePenFeatures(false)}
      />

      {/* VoicePen Showcase */}
      <VoicePenShowcase
        isOpen={showVoicePenShowcase}
        onClose={() => setShowVoicePenShowcase(false)}
      />

      {/* Shortcut Tutorial */}
      <ShortcutTutorial
        isOpen={showShortcutTutorial}
        onClose={() => setShowShortcutTutorial(false)}
      />

      {/* Tool Detail Modal */}
      {showToolDetail && (
        <ToolDetailModal
          isOpen={!!showToolDetail}
          onClose={() => setShowToolDetail(null)}
          toolId={showToolDetail}
        />
      )}

      {/* LGPD Article Modal */}
      <LGPDArticleModal
        isOpen={showLGPDArticle}
        onClose={() => setShowLGPDArticle(false)}
      />

      {/* AI Cardio Article Modal */}
      <AICardioArticleModal
        isOpen={showAICardioArticle}
        onClose={() => setShowAICardioArticle(false)}
      />

      {/* Productivity Article Modal */}
      <ProductivityArticleModal
        isOpen={showProductivityArticle}
        onClose={() => setShowProductivityArticle(false)}
      />
    </main>
    </>
  )
}
