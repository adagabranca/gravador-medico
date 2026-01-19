"use client"

import { X, Brain, Activity, Shield, TrendingUp, CheckCircle2, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AICardioArticleModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AICardioArticleModal({ isOpen, onClose }: AICardioArticleModalProps) {
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-zinc-900 via-zinc-900 to-purple-900/20 rounded-3xl shadow-2xl border border-white/10"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[90vh] p-8 md:p-12">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-6 h-6 text-purple-400" />
                    <span className="text-sm font-bold text-purple-400 uppercase tracking-wider">
                      Inteligência Artificial
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    IA na Cardiologia: O Futuro Já Chegou
                  </h1>
                  <p className="text-lg text-zinc-400 leading-relaxed">
                    Como ferramentas de inteligência artificial estão revolucionando diagnósticos cardíacos e reduzindo erros médicos em 40%.
                  </p>
                </div>

                {/* Featured Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="w-8 h-8 text-purple-400" />
                      <span className="text-3xl font-bold text-white">40%</span>
                    </div>
                    <p className="text-sm text-zinc-400">Redução de erros diagnósticos</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Activity className="w-8 h-8 text-blue-400" />
                      <span className="text-3xl font-bold text-white">92%</span>
                    </div>
                    <p className="text-sm text-zinc-400">Precisão em ECG automático</p>
                  </div>
                  <div className="bg-gradient-to-br from-brand-500/10 to-brand-500/10 rounded-xl p-6 border border-brand-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Shield className="w-8 h-8 text-brand-400" />
                      <span className="text-3xl font-bold text-white">60%</span>
                    </div>
                    <p className="text-sm text-zinc-400">Mais rápido na triagem</p>
                  </div>
                </div>

                {/* Introduction */}
                <div className="prose prose-invert max-w-none mb-12">
                  <p className="text-zinc-300 leading-relaxed text-lg mb-6">
                    A cardiologia está vivendo uma <strong className="text-white">revolução silenciosa</strong>. 
                    Algoritmos de inteligência artificial já conseguem analisar eletrocardiogramas com precisão 
                    superior a muitos cardiologistas experientes, detectar padrões invisíveis ao olho humano 
                    e prever eventos cardiovasculares antes que aconteçam.
                  </p>
                  <p className="text-zinc-300 leading-relaxed text-lg">
                    Mas não se trata de substituir médicos - trata-se de <strong className="text-white">potencializar 
                    decisões clínicas</strong> com dados precisos e insights em tempo real.
                  </p>
                </div>

                {/* Main Applications */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Brain className="w-8 h-8 text-purple-400" />
                    Principais Aplicações da IA
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Application 1 */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-transparent rounded-xl p-6 border-l-4 border-purple-500">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-purple-400" />
                        Análise Automática de ECG
                      </h3>
                      <p className="text-zinc-300 leading-relaxed mb-4">
                        Sistemas de IA podem analisar traçados eletrocardiográficos em segundos, identificando 
                        arritmias, bloqueios e sinais precoces de infarto com <strong>precisão de até 92%</strong>. 
                        O algoritmo da Apple Watch, por exemplo, já salvou milhares de vidas detectando fibrilação atrial.
                      </p>
                      <div className="flex items-start gap-2 text-sm text-brand-400">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Detecta padrões que passam despercebidos em leituras manuais</span>
                      </div>
                    </div>

                    {/* Application 2 */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl p-6 border-l-4 border-blue-500">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-blue-400" />
                        Predição de Eventos Cardiovasculares
                      </h3>
                      <p className="text-zinc-300 leading-relaxed mb-4">
                        Machine learning pode processar milhares de variáveis clínicas (idade, pressão arterial, 
                        colesterol, histórico familiar, exames laboratoriais) e calcular o risco individual de 
                        infarto ou AVC nos próximos 5-10 anos com <strong>precisão superior aos escores tradicionais</strong>.
                      </p>
                      <div className="flex items-start gap-2 text-sm text-brand-400">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Personaliza planos de prevenção baseados em perfil único do paciente</span>
                      </div>
                    </div>

                    {/* Application 3 */}
                    <div className="bg-gradient-to-r from-pink-500/10 to-transparent rounded-xl p-6 border-l-4 border-pink-500">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-pink-400" />
                        Análise de Imagens Cardíacas
                      </h3>
                      <p className="text-zinc-300 leading-relaxed mb-4">
                        Deep learning está revolucionando a interpretação de ecocardiogramas, ressonâncias e 
                        tomografias cardíacas. A IA consegue calcular fração de ejeção, detectar valvopatias 
                        e identificar áreas isquêmicas com <strong>velocidade 10x superior</strong> ao radiologista humano.
                      </p>
                      <div className="flex items-start gap-2 text-sm text-brand-400">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Reduz tempo de laudo de 2 horas para 12 minutos</span>
                      </div>
                    </div>

                    {/* Application 4 */}
                    <div className="bg-gradient-to-r from-cyan-500/10 to-transparent rounded-xl p-6 border-l-4 border-cyan-500">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-cyan-400" />
                        Monitoramento Remoto Inteligente
                      </h3>
                      <p className="text-zinc-300 leading-relaxed mb-4">
                        Dispositivos vestíveis com IA monitoram frequência cardíaca, pressão arterial e saturação 
                        24/7, alertando o médico automaticamente quando detectam anomalias. Isso permite 
                        <strong> intervenção precoce</strong> antes de eventos graves.
                      </p>
                      <div className="flex items-start gap-2 text-sm text-brand-400">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Pacientes com insuficiência cardíaca têm redução de 30% nas internações</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Challenges */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-amber-400" />
                    Desafios e Limitações
                  </h2>
                  
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
                    <ul className="space-y-3 text-zinc-300">
                      <li className="flex items-start gap-3">
                        <span className="text-amber-400 font-bold mt-1">•</span>
                        <span><strong className="text-white">Viés Algorítmico:</strong> IAs treinadas com dados 
                        de populações específicas podem ter menor precisão em outros grupos</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-400 font-bold mt-1">•</span>
                        <span><strong className="text-white">Responsabilidade Médica:</strong> Quem é responsável 
                        por um erro de diagnóstico: o médico ou o algoritmo?</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-400 font-bold mt-1">•</span>
                        <span><strong className="text-white">Privacidade de Dados:</strong> Modelos de IA precisam 
                        de grandes volumes de dados sensíveis para treinar</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-400 font-bold mt-1">•</span>
                        <span><strong className="text-white">Custo de Implementação:</strong> Nem todos os hospitais 
                        têm recursos para adquirir sistemas avançados</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Conclusion */}
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-8 border border-purple-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">O Futuro é Colaborativo</h2>
                  <p className="text-zinc-300 leading-relaxed mb-6">
                    A IA não veio para substituir cardiologistas, mas para <strong className="text-white">ampliá-los</strong>. 
                    O futuro da cardiologia é uma parceria entre a intuição clínica humana e a precisão computacional 
                    da inteligência artificial.
                  </p>
                  <p className="text-zinc-300 leading-relaxed">
                    Médicos que dominarem essas ferramentas terão vantagem competitiva significativa, oferecendo 
                    diagnósticos mais precisos, tratamentos personalizados e melhores resultados para seus pacientes.
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-zinc-400">
                    Quer ver a IA em ação na sua prática médica?
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-purple-500/25"
                  >
                    Explorar VoicePen com IA
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
