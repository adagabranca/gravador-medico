"use client"

import { X, TrendingUp, Clock, Zap, Target, CheckCircle2, Brain, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ProductivityArticleModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProductivityArticleModal({ isOpen, onClose }: ProductivityArticleModalProps) {
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
              className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-br from-zinc-900 via-zinc-900 to-blue-900/20 rounded-3xl shadow-2xl border border-white/10"
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
                    <TrendingUp className="w-6 h-6 text-blue-400" />
                    <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">
                      Produtividade
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                    Gestão de Tempo: 3 Horas a Mais por Dia
                  </h1>
                  <p className="text-lg text-zinc-400 leading-relaxed">
                    Estratégias comprovadas para médicos que querem atender mais pacientes sem aumentar a jornada de trabalho.
                  </p>
                </div>

                {/* Featured Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-8 h-8 text-blue-400" />
                      <span className="text-3xl font-bold text-white">3h</span>
                    </div>
                    <p className="text-sm text-zinc-400">Ganho médio por dia</p>
                  </div>
                  <div className="bg-gradient-to-br from-brand-50 to-brand-50 rounded-xl p-6 border border-brand-50">
                      <div className="flex items-center gap-3 mb-2">
                      <Zap className="w-8 h-8 text-brand-400" />
                      <span className="text-3xl font-bold text-white">45%</span>
                    </div>
                    <p className="text-sm text-zinc-400">Mais produtivo</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-8 h-8 text-purple-400" />
                      <span className="text-3xl font-bold text-white">8+</span>
                    </div>
                    <p className="text-sm text-zinc-400">Pacientes extras/dia</p>
                  </div>
                </div>

                {/* Introduction */}
                <div className="prose prose-invert max-w-none mb-12">
                  <p className="text-zinc-300 leading-relaxed text-lg mb-6">
                    "Não tenho tempo." Essa é a frase mais repetida por médicos no Brasil. Entre consultas, 
                    prontuários, atualização científica e tarefas administrativas, o dia parece ter 
                    <strong className="text-white"> menos de 24 horas</strong>.
                  </p>
                  <p className="text-zinc-300 leading-relaxed text-lg">
                    Mas e se eu te dissesse que é possível recuperar <strong className="text-white">3 horas 
                    por dia</strong> sem atender menos pacientes ou comprometer a qualidade do atendimento? 
                    Não é mágica - é gestão estratégica de tempo.
                  </p>
                </div>

                {/* The Time Trap */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Clock className="w-8 h-8 text-red-400" />
                    A Armadilha do Tempo
                  </h2>
                  
                  <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-xl p-6 border border-red-500/20 mb-6">
                    <p className="text-zinc-300 leading-relaxed mb-4">
                      Um estudo de 2023 com 847 médicos brasileiros revelou que <strong className="text-white">68% 
                      passam mais de 2 horas diárias apenas com prontuários</strong>. Isso equivale a:
                    </p>
                    <ul className="space-y-2 text-zinc-300">
                      <li className="flex items-start gap-3">
                        <span className="text-red-400 font-bold mt-1">•</span>
                        <span><strong className="text-white">10 horas por semana</strong> digitando</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-400 font-bold mt-1">•</span>
                        <span><strong className="text-white">43 horas por mês</strong> em trabalho burocrático</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-red-400 font-bold mt-1">•</span>
                        <span><strong className="text-white">520 horas por ano</strong> que poderiam ser consultas</span>
                      </li>
                    </ul>
                  </div>

                  <p className="text-zinc-400 text-sm italic">
                    Se cada consulta dura 30 minutos, você está perdendo o equivalente a 
                    <strong className="text-white"> 1.040 consultas por ano</strong> só com digitação.
                  </p>
                </div>

                {/* Strategies */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Zap className="w-8 h-8 text-yellow-400" />
                    As 5 Estratégias Transformadoras
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Strategy 1 */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl p-6 border-l-4 border-blue-500">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <span className="text-2xl text-blue-400">1.</span>
                        Automação de Prontuários
                      </h3>
                      <p className="text-zinc-300 leading-relaxed mb-4">
                        <strong className="text-white">Impacto: Economiza 1h30 por dia</strong>
                      </p>
                      <p className="text-zinc-300 leading-relaxed mb-4">
                        Ferramentas de transcrição automática (como VoicePen) transformam sua fala em prontuário 
                        estruturado SOAP enquanto você atende. Você foca no paciente, a IA cuida da documentação.
                      </p>
                      <div className="flex items-start gap-2 text-sm text-brand-400">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Reduz tempo de prontuário de 12 minutos para 2 minutos</span>
                      </div>
                    </div>

                    {/* Strategy 2 */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-transparent rounded-xl p-6 border-l-4 border-purple-500">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <span className="text-2xl text-purple-400">2.</span>
                        Blocos de Tempo (Time Blocking)
                      </h3>
                      <p className="text-zinc-300 leading-relaxed mb-4">
                        <strong className="text-white">Impacto: Economiza 45 minutos por dia</strong>
                      </p>
                      <p className="text-zinc-300 leading-relaxed mb-4">
                        Agrupe tarefas similares em blocos. Exemplo: Responda TODAS as dúvidas de WhatsApp de uma 
                        vez (10h), faça TODOS os prontuários pendentes juntos (14h), atualize-se cientificamente 
                        apenas em horários fixos (19h).
                      </p>
                      <div className="flex items-start gap-2 text-sm text-brand-400">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Elimina "troca de contexto" que consome 23 minutos por interrupção</span>
                      </div>
                    </div>

                    {/* Strategy 3 */}
                    <div className="bg-gradient-to-r from-brand-50 to-transparent rounded-xl p-6 border-l-4 border-brand">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl text-brand-400">3.</span>
                        Delegação Inteligente
                      </h3>
                      <p className="text-zinc-300 leading-relaxed mb-4">
                        <strong className="text-white">Impacto: Economiza 30 minutos por dia</strong>
                      </p>
                      <p className="text-zinc-300 leading-relaxed mb-4">
                        Tudo que não exige decisão médica deve ser delegado: agendamentos, renovação de receitas 
                        simples, preenchimento de formulários, retornos de exames normais. Secretárias e 
                        enfermeiras qualificadas são seus maiores aliados.
                      </p>
                      <div className="flex items-start gap-2 text-sm text-brand-400">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Médicos que delegam bem atendem 35% mais pacientes</span>
                      </div>
                    </div>

                    {/* Strategy 4 */}
                    <div className="bg-gradient-to-r from-orange-500/10 to-transparent rounded-xl p-6 border-l-4 border-orange-500">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <span className="text-2xl text-orange-400">4.</span>
                        Protocolo de Triagem Eficiente
                      </h3>
                      <p className="text-zinc-300 leading-relaxed mb-4">
                        <strong className="text-white">Impacto: Economiza 25 minutos por dia</strong>
                      </p>
                      <p className="text-zinc-300 leading-relaxed mb-4">
                        Questionários pré-consulta digitais (Google Forms, TypeForm) coletam histórico do paciente 
                        ANTES da consulta. Você chega já sabendo queixa principal, medicações e alergias - economiza 
                        5 minutos por paciente.
                      </p>
                      <div className="flex items-start gap-2 text-sm text-brand-400">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Consultas mais objetivas e focadas no que realmente importa</span>
                      </div>
                    </div>

                    {/* Strategy 5 */}
                    <div className="bg-gradient-to-r from-pink-500/10 to-transparent rounded-xl p-6 border-l-4 border-pink-500">
                      <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                        <span className="text-2xl text-pink-400">5.</span>
                        Regra dos 2 Minutos
                      </h3>
                      <p className="text-zinc-300 leading-relaxed mb-4">
                        <strong className="text-white">Impacto: Economiza 20 minutos por dia</strong>
                      </p>
                      <p className="text-zinc-300 leading-relaxed mb-4">
                        Se uma tarefa leva menos de 2 minutos, faça IMEDIATAMENTE. Não adicione à lista de "depois". 
                        Isso inclui: responder um e-mail rápido, assinar um documento, confirmar um agendamento.
                      </p>
                      <div className="flex items-start gap-2 text-sm text-brand-400">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Evita acúmulo de "mini-tarefas" que viram montanha no fim do dia</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real Case */}
                <div className="mb-12">
                  <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Brain className="w-8 h-8 text-cyan-400" />
                    Caso Real: Dr. Rafael
                  </h2>
                  
                  <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20">
                    <p className="text-zinc-300 leading-relaxed mb-4">
                      <strong className="text-white">Antes:</strong> Cardiologista atendia 18 pacientes/dia, 
                      gastava 2h30 com prontuários após expediente, chegava em casa às 21h exausto.
                    </p>
                    <p className="text-zinc-300 leading-relaxed mb-4">
                      <strong className="text-white">Mudanças implementadas:</strong>
                    </p>
                    <ul className="space-y-2 text-zinc-300 mb-4">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-brand-400 mt-1 flex-shrink-0" />
                        <span>Passou a usar VoicePen para transcrição automática</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-brand-400 mt-1 flex-shrink-0" />
                        <span>Criou questionário pré-consulta no Google Forms</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-brand-400 mt-1 flex-shrink-0" />
                        <span>Delegou renovação de receitas crônicas para enfermeira</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-brand-400 mt-1 flex-shrink-0" />
                        <span>Implementou time blocking para WhatsApp (10h, 14h, 18h)</span>
                      </li>
                    </ul>
                    <p className="text-zinc-300 leading-relaxed">
                      <strong className="text-white">Depois:</strong> Atende 26 pacientes/dia (+44%), prontuários 
                      finalizados durante o expediente, sai às 18h30, recuperou tempo para família e exercícios.
                    </p>
                  </div>
                </div>

                {/* Action Plan */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-brand-400" />
                    Plano de Ação: Primeiros 30 Dias
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-brand-50 to-transparent rounded-xl p-4 border-l-4 border-brand">
                      <div className="flex items-start gap-3">
                        <span className="text-brand-400 font-bold mt-1">Semana 1:</span>
                        <span className="text-zinc-300">Implemente automação de prontuários (VoicePen ou similar)</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-500/10 to-transparent rounded-xl p-4 border-l-4 border-blue-500">
                      <div className="flex items-start gap-3">
                        <span className="text-blue-400 font-bold mt-1">Semana 2:</span>
                        <span className="text-zinc-300">Crie questionário pré-consulta e teste com 5 pacientes</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-purple-500/10 to-transparent rounded-xl p-4 border-l-4 border-purple-500">
                      <div className="flex items-start gap-3">
                        <span className="text-purple-400 font-bold mt-1">Semana 3:</span>
                        <span className="text-zinc-300">Estabeleça blocos de tempo fixos para tarefas repetitivas</span>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-orange-500/10 to-transparent rounded-xl p-4 border-l-4 border-orange-500">
                      <div className="flex items-start gap-3">
                        <span className="text-orange-400 font-bold mt-1">Semana 4:</span>
                        <span className="text-zinc-300">Identifique 3 tarefas para delegar e treine sua equipe</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conclusion */}
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20">
                  <h2 className="text-2xl font-bold text-white mb-4">Tempo É Vida</h2>
                  <p className="text-zinc-300 leading-relaxed mb-6">
                    Cada hora que você economiza é uma hora que pode ser investida em mais pacientes, em educação 
                    continuada, em família, em qualidade de vida. <strong className="text-white">Médicos produtivos 
                    não trabalham mais - trabalham melhor</strong>.
                  </p>
                  <p className="text-zinc-300 leading-relaxed">
                    As estratégias deste artigo foram testadas por centenas de médicos brasileiros. A média de 
                    ganho reportada é de <strong className="text-white">2h50min por dia</strong>. Em um mês, 
                    isso equivale a <strong className="text-white">57 horas extras</strong> - sem trabalhar um 
                    minuto a mais.
                  </p>
                </div>

                {/* CTA */}
                <div className="mt-8 text-center">
                  <p className="text-sm text-zinc-400">
                    Pronto para recuperar 3 horas por dia?
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-blue-500/25"
                  >
                    Começar com VoicePen
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
