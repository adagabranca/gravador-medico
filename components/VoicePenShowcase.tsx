'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Zap, 
  MessageSquare, 
  Users, 
  WifiOff, 
  Sparkles,
  Upload,
  Share2,
  Smartphone,
  Lock,
  Globe,
  X,
  ChevronRight
} from 'lucide-react';

interface Feature {
  id: string;
  icon: any;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  color: string;
  gradient: string;
}

const features: Feature[] = [
  {
    id: 'recording',
    icon: Clock,
    title: 'Up to 2 hours recordings',
    subtitle: 'Gravações Longas',
    description: 'Perfect for long meetings, lectures, and interviews.',
    details: [
      'Grave consultas completas de até 2 horas',
      'Qualidade de áudio profissional',
      'Sem perda de informações importantes',
      'Ideal para anamneses extensas'
    ],
    color: 'from-blue-500 to-indigo-600',
    gradient: 'bg-gradient-to-br from-blue-500/20 to-indigo-600/20'
  },
  {
    id: 'transcription',
    icon: Zap,
    title: 'Fast transcription',
    subtitle: 'Transcrição Rápida',
    description: 'Transcribe 1 hour of audio or video in 30 seconds.',
    details: [
      'Processamento em até 30 segundos',
      'Transcrição de 1 hora de áudio',
      'Tecnologia de IA avançada',
      'Economize horas de trabalho manual'
    ],
    color: 'from-yellow-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-yellow-500/20 to-orange-600/20'
  },
  {
    id: 'chat',
    icon: MessageSquare,
    title: 'Chat with your notes',
    subtitle: 'Chat Inteligente',
    description: 'Turn your notes into a smart assistant. Just type a question and get instant insights.',
    details: [
      'Faça perguntas sobre suas notas',
      'Respostas instantâneas e contextualizadas',
      'IA compreende o contexto médico',
      'Revise consultas anteriores rapidamente'
    ],
    color: 'from-purple-500 to-pink-600',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-600/20'
  },
  {
    id: 'speakers',
    icon: Users,
    title: 'Speaker separation',
    subtitle: 'Separação de Falantes',
    description: 'Each speaker is automatically identified and labeled, so you always know who said what.',
    details: [
      'Identifica automaticamente cada falante',
      'Separa médico e paciente',
      'Útil para reuniões com múltiplos profissionais',
      'Transcrições mais organizadas'
    ],
  color: 'from-brand-500 to-brand-600',
  gradient: 'bg-gradient-to-br from-brand-500/20 to-brand-600/20'
  },
  {
    id: 'offline',
    icon: WifiOff,
    title: 'Offline recording',
    subtitle: 'Gravação Offline',
    description: 'Offline-ready. Never miss a moment, even without signal.',
    details: [
      'Funciona sem internet',
      'Sincroniza quando voltar online',
      'Perfeito para áreas rurais',
      'Nunca perca uma consulta'
    ],
  color: 'from-brand-500 to-brand-600',
  gradient: 'bg-gradient-to-br from-brand-500/20 to-brand-600/20'
  },
  {
    id: 'styles',
    icon: Sparkles,
    title: '25+ rewrite options',
    subtitle: 'Estilos de Escrita',
    description: 'Explore more than 25 rewriting options that help you express your ideas clearly.',
    details: [
      'Summary: Resumo conciso',
      'Brain Dump: Brainstorming completo',
      'Study Note: Formato acadêmico',
      'Custom Style: Crie seu próprio estilo'
    ],
    color: 'from-pink-500 to-rose-600',
    gradient: 'bg-gradient-to-br from-pink-500/20 to-rose-600/20'
  },
  {
    id: 'upload',
    icon: Upload,
    title: 'Upload anything',
    subtitle: 'Upload Universal',
    description: 'Files, videos, podcasts, YouTube content, Voice Memos, Zoom recordings, Instagram posts, WhatsApp messages.',
    details: [
      'Aceita múltiplos formatos',
      'Importa de redes sociais',
      'Suporta vídeos do YouTube',
      'Integração com WhatsApp e Telegram'
    ],
    color: 'from-indigo-500 to-blue-600',
    gradient: 'bg-gradient-to-br from-indigo-500/20 to-blue-600/20'
  },
  {
    id: 'export',
    icon: Share2,
    title: 'Share & export',
    subtitle: 'Compartilhamento',
    description: 'Whether you need a polished PDF for presentations or an editable DOC file for further editing.',
    details: [
      'Exporta em PDF profissional',
      'DOC editável para ajustes',
      'Compartilhe por e-mail ou WhatsApp',
      'Integração com sistemas de prontuário'
    ],
    color: 'from-amber-500 to-yellow-600',
    gradient: 'bg-gradient-to-br from-amber-500/20 to-yellow-600/20'
  },
  {
    id: 'devices',
    icon: Smartphone,
    title: 'Access on any device',
    subtitle: 'Multi-Dispositivo',
    description: 'Whether you\'re on a smartphone, tablet, or desktop, your files and transcripts are always within reach.',
    details: [
      'Acesse de iPhone, iPad, Mac',
      'Sincronização via iCloud',
      'Dados sempre disponíveis',
      'Comece no celular, termine no computador'
    ],
  color: 'from-cyan-500 to-brand-600',
  gradient: 'bg-gradient-to-br from-cyan-500/20 to-brand-600/20'
  },
  {
    id: 'private',
    icon: Lock,
    title: 'Private',
    subtitle: 'Privacidade Total',
    description: 'Sync in your iCloud — nothing stores in our servers.',
    details: [
      'Dados armazenados no seu iCloud',
      'Nenhum dado em servidores externos',
      'Conformidade com LGPD',
      'Privacidade médico-paciente garantida'
    ],
    color: 'from-gray-500 to-slate-600',
    gradient: 'bg-gradient-to-br from-gray-500/20 to-slate-600/20'
  },
  {
    id: 'languages',
    icon: Globe,
    title: '80+ languages',
    subtitle: 'Multilíngue',
    description: 'Expand your reach and communicate effortlessly in multiple languages with ease.',
    details: [
      'Suporta mais de 80 idiomas',
      'Português brasileiro nativo',
      'Atenda pacientes internacionais',
      'Traduções automáticas'
    ],
    color: 'from-violet-500 to-purple-600',
    gradient: 'bg-gradient-to-br from-violet-500/20 to-purple-600/20'
  }
];

interface VoicePenShowcaseProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VoicePenShowcase({ isOpen, onClose }: VoicePenShowcaseProps) {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

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
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-7xl max-h-[90vh] overflow-hidden"
            >
              <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-2">
                        Funcionalidades do VoicePen
                      </h2>
                      <p className="text-lg text-gray-400">
                        11 recursos poderosos para transformar sua prática médica
                      </p>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                      <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedFeature(feature)}
                        className={`${feature.gradient} rounded-2xl border border-white/10 p-6 cursor-pointer hover:scale-[1.02] transition-transform group`}
                      >
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                          <feature.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {feature.subtitle}
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                          {feature.description}
                        </p>
                        <div className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                          <span className="text-sm font-medium">Ver detalhes</span>
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Feature Detail Modal */}
          <AnimatePresence>
            {selectedFeature && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60]"
                  onClick={() => setSelectedFeature(null)}
                />
                <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full max-w-2xl"
                  >
                    <div className={`${selectedFeature.gradient} rounded-3xl border border-white/20 p-8`}>
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${selectedFeature.color} flex items-center justify-center`}>
                          <selectedFeature.icon className="w-10 h-10 text-white" />
                        </div>
                        <button
                          onClick={() => setSelectedFeature(null)}
                          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                      </div>
                      
                      <h3 className="text-3xl font-bold text-white mb-2">
                        {selectedFeature.subtitle}
                      </h3>
                      <p className="text-gray-400 mb-6">
                        {selectedFeature.description}
                      </p>

                      <div className="space-y-3">
                        {selectedFeature.details.map((detail, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start gap-3 bg-white/5 rounded-xl p-4"
                          >
                            <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${selectedFeature.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <ChevronRight className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-white font-medium">
                              {detail}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
