'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Download, 
  Settings, 
  FileText, 
  Zap, 
  Mic,
  Check,
  ChevronRight,
  ChevronLeft,
  ExternalLink
} from 'lucide-react';

interface SetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetupWizard({ isOpen, onClose }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const steps = [
    {
      number: 1,
      title: 'Instale o VoicePen',
      subtitle: 'Leva 20 segundos',
      icon: Download,
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-brand-500/10 to-brand-600/10 rounded-2xl border border-brand-500/20">
            <div className="p-4 rounded-xl bg-brand-500/20">
              <Download className="w-8 h-8 text-brand-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">VoicePen</h3>
              <p className="text-sm text-gray-400">App de transcrição médica</p>
            </div>
          </div>

          <a
            href="https://apps.apple.com/us/app/ai-note-taker-voicepen/id6462815872"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
          >
            Baixar pela App Store
            <ExternalLink className="w-4 h-4" />
          </a>

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="p-1 rounded-full bg-brand-500/20">
                <Check className="w-4 h-4 text-brand-400" />
              </div>
              <span className="text-gray-300">App instalado</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="p-1 rounded-full bg-brand-500/20">
                <Check className="w-4 h-4 text-brand-400" />
              </div>
              <span className="text-gray-300">Permissões de microfone ok</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Você faz isso uma única vez
          </p>
        </div>
      )
    },
    {
      number: 2,
      title: 'Configure do jeito seguro',
      subtitle: 'Dois ajustes e pronto',
      icon: Settings,
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl border border-blue-500/20">
            <div className="p-4 rounded-xl bg-blue-500/20">
              <Settings className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Configurações do VoicePen</h3>
              <p className="text-sm text-gray-400">3 ajustes rápidos</p>
            </div>
          </div>

          <details className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer text-white font-medium hover:bg-white/5 transition-colors">
              Ver como fazer
            </summary>
            <div className="px-6 pb-4 space-y-3 border-t border-white/10 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Idioma PT-BR configurado</p>
                  <p className="text-xs text-gray-400 mt-1">Para transcrição em português</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Salvar no iCloud ou aparelho</p>
                  <p className="text-xs text-gray-400 mt-1">Seus dados ficam seguros</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Formato de saída: texto estruturado</p>
                  <p className="text-xs text-gray-400 mt-1">Para prontuários organizados</p>
                </div>
              </div>
            </div>
          </details>
        </div>
      )
    },
    {
      number: 3,
      title: 'Cole seu Prompt Clínico',
      subtitle: 'Um toque para copiar, um toque para colar',
      icon: FileText,
      content: (
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-2xl border border-purple-500/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              SOAP (padrão ouro)
              <span className="ml-auto px-2 py-1 bg-brand-500/20 text-brand-300 text-xs rounded-full">
                Recomendado
              </span>
            </h3>
            <div className="bg-black/40 rounded-xl p-4 font-mono text-xs text-gray-300 space-y-1 border border-white/5">
              <p>S: Queixa principal...</p>
              <p>O: Exame físico...</p>
              <p>A: Hipótese diagnóstica...</p>
              <p>P: Plano terapêutico...</p>
            </div>
            <button className="mt-4 w-full py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              Copiar
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors cursor-pointer">
              <h4 className="text-sm font-semibold text-white mb-2">Evolução + Conduta</h4>
              <p className="text-xs text-gray-400">Para acompanhamento</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors cursor-pointer">
              <h4 className="text-sm font-semibold text-white mb-2">Retorno / Follow-up</h4>
              <p className="text-xs text-gray-400">Para consultas de retorno</p>
            </div>
          </div>
        </div>
      )
    },
    {
      number: 4,
      title: 'Crie o botão de 1 toque',
      subtitle: 'Pra começar a gravação sem abrir nada',
      icon: Zap,
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-amber-500/10 to-amber-600/10 rounded-2xl border border-amber-500/20">
            <div className="p-4 rounded-xl bg-amber-500/20">
              <Zap className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Atalho do iPhone</h3>
              <p className="text-sm text-gray-400">Comece a gravar com um toque</p>
            </div>
          </div>

          <button className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
            Adicionar atalho no iPhone
            <ExternalLink className="w-4 h-4" />
          </button>

          <details className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer text-white font-medium hover:bg-white/5 transition-colors">
              Ver tutorial com prints
            </summary>
            <div className="px-6 pb-4 space-y-3 border-t border-white/10 pt-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Atalho apareceu na tela inicial</p>
                  <p className="text-xs text-gray-400 mt-1">Direto na home do iPhone</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Testei e abriu a gravação</p>
                  <p className="text-xs text-gray-400 mt-1">Funcionando perfeitamente</p>
                </div>
              </div>
            </div>
          </details>
        </div>
      )
    },
    {
      number: 5,
      title: 'Faça seu primeiro teste',
      subtitle: 'Você vai ver o antes/depois na hora',
      icon: Mic,
      content: (
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-brand-500/10 to-brand-600/10 rounded-2xl border border-brand-500/20">
            <div className="p-4 rounded-xl bg-brand-500/20">
              <Mic className="w-8 h-8 text-brand-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Script de teste</h3>
              <p className="text-sm text-gray-400">Fale em voz alta (sem paciente)</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/5 to-brand-500/5 rounded-xl p-6 border border-blue-500/20">
            <p className="text-sm text-gray-300 leading-relaxed italic">
              "Paciente teste, 35 anos, sexo masculino. Queixa de dor de cabeça há 3 dias, tipo pressão, 
              localização frontal. Sem febre. Tomou paracetamol com melhora parcial. Ao exame: BEG, 
              afebril, sem sinais de irritação meníngea. Hipótese de cefaleia tensional. Conduta: 
              orientações, analgésico se necessário, retorno se piora."
            </p>
          </div>

          <details className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer text-white font-medium hover:bg-white/5 transition-colors">
              Ver exemplo de saída
            </summary>
            <div className="px-6 pb-4 border-t border-white/10 pt-4">
              <div className="bg-black/40 rounded-xl p-4 font-mono text-xs text-gray-300 space-y-2">
                <p className="text-brand-400 font-semibold">S (Subjetivo):</p>
                <p>• Dor de cabeça há 3 dias</p>
                <p>• Tipo pressão, localização frontal</p>
                <p>• Sem febre</p>
                <p className="text-brand-400 font-semibold mt-3">O (Objetivo):</p>
                <p>• BEG, afebril</p>
                <p>• Sem sinais de irritação meníngea</p>
                <p className="text-brand-400 font-semibold mt-3">A (Avaliação):</p>
                <p>• Hipótese: Cefaleia tensional</p>
                <p className="text-brand-400 font-semibold mt-3">P (Plano):</p>
                <p>• Orientações gerais</p>
                <p>• Analgésico se necessário</p>
                <p>• Retorno se piora</p>
              </div>
            </div>
          </details>

          <button className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2">
            Concluir configuração
            <Check className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-40"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              {/* Header with Progress */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-brand-500/20 to-blue-500/20">
                      <currentStepData.icon className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {currentStepData.number}/{totalSteps} {currentStepData.title}
                      </h2>
                      <p className="text-sm text-gray-400">{currentStepData.subtitle}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                      key={index}
                      className="h-1.5 flex-1 rounded-full overflow-hidden bg-white/10"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: index < currentStep ? '100%' : '0%' 
                        }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-brand-500 to-brand-600"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {currentStepData.content}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer Navigation */}
              <div className="p-6 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Voltar
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                >
                  {currentStep === totalSteps ? 'Concluir' : 'Próximo'}
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
