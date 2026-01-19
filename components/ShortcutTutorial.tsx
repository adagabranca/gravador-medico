'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Smartphone,
  Zap,
  Check,
  ChevronRight,
  Play,
  Download,
  Settings
} from 'lucide-react';

interface ShortcutTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShortcutTutorial({ isOpen, onClose }: ShortcutTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      number: 1,
      title: 'Abra o App Atalhos',
      description: 'Encontre e abra o aplicativo "Atalhos (Shortcuts)" no seu iPhone',
      icon: '📱',
      details: [
        'Busque por "Atalhos" na tela inicial',
        'Ou procure na pasta "Utilitários"',
        'É o app nativo da Apple (ícone azul e branco)'
      ]
    },
    {
      number: 2,
      title: 'Crie um Novo Atalho',
      description: 'Toque no "+" no canto superior direito para um novo atalho',
      icon: '➕',
      details: [
        'Vá para a aba "Meus Atalhos"',
        'Toque no botão "+" no topo',
        'Você verá a tela de criação'
      ]
    },
    {
      number: 3,
      title: 'Adicione Ação',
      description: 'Toque em "Adicionar Ação" e busque por "Gravador"',
      icon: '🔍',
      details: [
        'Toque em "Adicionar Ação"',
        'Na barra de pesquisa, digite "Gravador"',
        'Você verá ações relacionadas a gravação'
      ]
    },
    {
      number: 4,
      title: 'Selecione "Criar Gravação"',
      description: 'Escolha a ação "Criar Gravação" para iniciar gravação de voz',
      icon: '🎙️',
      details: [
        'Selecione "Criar Gravação" da lista',
        'Esta ação inicia uma nova gravação',
        'Você pode personalizar configurações (opcional)'
      ]
    },
    {
      number: 5,
      title: 'Configure a Ação',
      description: 'Opcionalmente configure áudio ou formato',
      icon: '⚙️',
      details: [
        'Toque em "Gravação" para escolher Áudio ou Vídeo',
        'Dê um nome ao arquivo (ex: "Consulta {{Data}}")',
        'Defina qualidade (recomendo Alta)'
      ]
    },
    {
      number: 6,
      title: 'Adicione à Tela de Início',
      description: 'Opcional: Crie ícone na tela principal para acesso rápido',
      icon: '🏠',
      details: [
        'Toque no ícone de informações (i) no topo',
        'Selecione "Adicionar à Tela de Início"',
        'Escolha um ícone e nome personalizado',
        'Toque em "Adicionar" - pronto!'
      ]
    },
    {
      number: 7,
      title: 'Atalho de Voz com Siri',
      description: 'Configure comando de voz para gravação mãos-livres',
      icon: '🗣️',
      details: [
        'Nas configurações do atalho, toque "Adicionar à Siri"',
        'Grave uma frase como "Começar gravação"',
        'Agora só dizer: "Ei Siri, começar gravação"',
        'Gravação inicia instantaneamente!'
      ]
    },
    {
      number: 8,
      title: 'Teste Seu Atalho',
      description: 'Faça um teste rápido para garantir que está funcionando',
      icon: '✅',
      details: [
        'Toque no atalho recém-criado',
        'Ou diga o comando de voz configurado',
        'A gravação deve iniciar automaticamente',
        'Pronto para usar em consultas!'
      ]
    }
  ];

  const methods = [
    {
      title: 'Método 1: App Atalhos (Mais Personalizável)',
      pros: [
        'Controle total sobre configurações',
        'Nome automático com data/hora',
        'Pode adicionar ações pós-gravação',
        'Salvar direto em pasta específica'
      ],
      recommended: true
    },
    {
      title: 'Método 2: Central de Controle (Mais Rápido)',
      pros: [
        'Acesso com apenas um swipe',
        'Adicione "Gravador" na Central de Controle',
        'Toque e já está gravando',
        'Perfeito para emergências'
      ],
      recommended: false
    }
  ];

  const currentStepData = steps[currentStep];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-40"
            onClick={onClose}
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-amber-900/20 to-orange-900/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-amber-500/20">
                      <Zap className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Como Criar Atalho no iPhone
                      </h2>
                      <p className="text-sm text-gray-400">
                        Para gravar consultas com 1 toque
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Progress Steps */}
                <div className="flex gap-2">
                  {steps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentStep(index)}
                      className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? 'bg-amber-500'
                          : index < currentStep
                          ? 'bg-amber-500/50'
                          : 'bg-white/10'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Current Step */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-center mb-8">
                      <div className="text-7xl mb-4">{currentStepData.icon}</div>
                      <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 text-sm font-bold rounded-full mb-3">
                        PASSO {currentStepData.number} de {steps.length}
                      </span>
                      <h3 className="text-3xl font-bold text-white mb-3">
                        {currentStepData.title}
                      </h3>
                      <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        {currentStepData.description}
                      </p>
                    </div>

                    {/* Details */}
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl p-6 border border-amber-500/20 mb-8">
                      <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-amber-400" />
                        Detalhes do passo:
                      </h4>
                      <ul className="space-y-3">
                        {currentStepData.details.map((detail, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3"
                          >
                            <Check className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-300">{detail}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Methods (shown on first step) */}
                    {currentStep === 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {methods.map((method, index) => (
                          <div
                            key={index}
                            className={`p-6 rounded-xl border-2 ${
                              method.recommended
                                ? 'bg-amber-500/10 border-amber-500/30'
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            {method.recommended && (
                              <span className="inline-block px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full mb-3">
                                RECOMENDADO
                              </span>
                            )}
                            <h4 className="font-bold text-white mb-3">{method.title}</h4>
                            <ul className="space-y-2">
                              {method.pros.map((pro, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                                  <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                                  <span>{pro}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer Navigation */}
              <div className="p-6 border-t border-white/10 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                  Voltar
                </button>

                <div className="text-sm text-gray-500">
                  {currentStep + 1} / {steps.length}
                </div>

                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    Próximo
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-all duration-300"
                  >
                    <Check className="w-5 h-5" />
                    Concluído!
                  </button>
                )}
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
