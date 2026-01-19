'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Check,
  Sparkles,
  ShoppingCart,
  MessageSquare,
  TrendingUp,
  FileCheck,
  Headphones,
  Zap,
  Star,
  ArrowRight
} from 'lucide-react';

interface ToolDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolId: string;
}

export default function ToolDetailModal({ isOpen, onClose, toolId }: ToolDetailModalProps) {
  const tools: Record<string, any> = {
  whatsapp: {
      icon: MessageSquare,
      title: 'Gerador WhatsApp Pós-Consulta',
      subtitle: 'Fidelize pacientes automaticamente',
      price: 'GRÁTIS',
  gradient: 'from-brand-500 to-brand-600',
      description: 'Transforme cada consulta em uma oportunidade de fidelização. Envie mensagens personalizadas profissionais em 1 clique.',
      features: [
        {
          title: '50+ Templates Prontos',
          description: 'Mensagens para pós-consulta, lembrete de retorno, resultados de exames e muito mais',
          icon: '💬'
        },
        {
          title: 'Personalização Automática',
          description: 'Insere automaticamente nome do paciente, data da consulta e próximos passos',
          icon: '✨'
        },
        {
          title: 'Múltiplas Categorias',
          description: 'Agradecimento, Orientações, Resultados, Retorno, Aniversário, Feedback',
          icon: '📂'
        },
        {
          title: 'Copy & Send',
          description: 'Copie e cole direto no WhatsApp - sem complicação',
          icon: '📱'
        }
      ],
      benefits: [
        'Aumente a satisfação do paciente',
        'Reduza faltas em retornos',
        'Profissionalize sua comunicação',
        'Economize tempo em cada atendimento'
      ],
      testimonial: {
        text: 'Meus pacientes adoram receber as mensagens! Reduzi 40% das faltas em retornos.',
        author: 'Dra. Ana Paula',
        specialty: 'Cardiologista'
      },
      cta: 'Começar a Usar Grátis'
    },
    marketing: {
      icon: TrendingUp,
      title: 'Marketing Médico Express',
      subtitle: 'Consultas → Posts automáticos',
      price: 'R$ 37,00',
      gradient: 'from-blue-500 to-indigo-600',
      description: 'Transforme suas consultas em conteúdo educativo para redes sociais. Crie posts profissionais em segundos.',
      features: [
        {
          title: 'IA Especializada em Saúde',
          description: 'Gera posts seguindo ética médica e boas práticas do CFM',
          icon: '🤖'
        },
        {
          title: 'Multi-Formato',
          description: 'Stories, Posts Feed, Carrosséis, Reels roteiros - tudo automatizado',
          icon: '📸'
        },
        {
          title: 'Calendário de Conteúdo',
          description: 'Planeje semanas de posts com base em temas das suas consultas',
          icon: '📅'
        },
        {
          title: 'Hashtags Inteligentes',
          description: 'Sugestões de #hashtags relevantes para cada especialidade',
          icon: '#️⃣'
        },
        {
          title: 'Banco de Imagens Médicas',
          description: 'Acesso a biblioteca com 1000+ imagens profissionais',
          icon: '🖼️'
        },
        {
          title: 'Análise de Engajamento',
          description: 'Descubra quais temas geram mais interesse nos seus seguidores',
          icon: '📊'
        }
      ],
      benefits: [
        'Poste 3x mais em menos tempo',
        'Conteúdo sempre ético e profissional',
        'Aumente seguidores organicamente',
        'Posicione-se como autoridade'
      ],
      testimonial: {
        text: 'Passei de 5 para 20 posts/mês. Meu Instagram cresceu 300% em 3 meses!',
        author: 'Dr. Carlos Eduardo',
        specialty: 'Ortopedista'
      },
      cta: 'Comprar por R$ 37,00'
    },
    auditor: {
      icon: FileCheck,
      title: 'Auditor Clínico IA',
      subtitle: 'Valide prontuários em tempo real',
      price: 'R$ 29,00',
      gradient: 'from-purple-500 to-pink-600',
      description: 'Evite erros e melhore a qualidade dos seus prontuários. IA analisa e sugere melhorias antes de finalizar.',
      features: [
        {
          title: 'Checklist Automatizado',
          description: 'Verifica se todos os campos obrigatórios foram preenchidos',
          icon: '✅'
        },
        {
          title: 'Validação de Diagnósticos',
          description: 'Compara com CID-10 e sugere códigos corretos',
          icon: '🔍'
        },
        {
          title: 'Alertas de Inconsistência',
          description: 'Detecta contradições entre sintomas, exames e diagnóstico',
          icon: '⚠️'
        },
        {
          title: 'Conformidade LGPD',
          description: 'Identifica dados sensíveis desnecessários no prontuário',
          icon: '🔒'
        },
        {
          title: 'Sugestões de Melhoria',
          description: 'IA recomenda informações adicionais relevantes',
          icon: '💡'
        },
        {
          title: 'Score de Qualidade',
          description: 'Cada prontuário recebe nota de 0-100 com áreas de melhoria',
          icon: '📈'
        }
      ],
      benefits: [
        'Reduza erros em até 90%',
        'Proteja-se juridicamente',
        'Melhore qualidade documental',
        'Facilite auditorias externas'
      ],
      testimonial: {
        text: 'Passei em auditoria da operadora sem nenhuma pendência. Primeira vez!',
        author: 'Dr. Roberto Santos',
        specialty: 'Clínico Geral'
      },
      cta: 'Comprar por R$ 29,00'
    },
    vip: {
      icon: Headphones,
      title: 'Suporte VIP & Setup Personalizado',
      subtitle: 'Especialista dedicado 1-on-1',
      price: 'R$ 97,00',
      gradient: 'from-amber-500 to-orange-600',
      description: 'Sessão individual com especialista + configuração completa do seu fluxo + suporte prioritário por 30 dias.',
      features: [
        {
          title: 'Sessão 1-on-1 de 60min',
          description: 'Videochamada com especialista para entender seu workflow',
          icon: '👨‍💻'
        },
        {
          title: 'Setup Completo',
          description: 'Configuramos VoicePen, prompts e integrações para você',
          icon: '⚙️'
        },
        {
          title: 'Prompts Personalizados',
          description: 'Criamos 5 prompts únicos para sua especialidade',
          icon: '✍️'
        },
        {
          title: 'Integração com Prontuário',
          description: 'Conectamos com seu sistema (Conexa, iClinic, MV, etc)',
          icon: '🔗'
        },
        {
          title: 'Suporte WhatsApp 30 dias',
          description: 'Linha direta com especialista - resposta em até 2h',
          icon: '💬'
        },
        {
          title: 'Revisões Ilimitadas',
          description: 'Ajustamos configurações quantas vezes precisar',
          icon: '🔄'
        }
      ],
      benefits: [
        'Economize 10+ horas de configuração',
        'Comece usar no mesmo dia',
        'Zero frustração técnica',
        'ROI garantido em 1 semana'
      ],
      testimonial: {
        text: 'Valeu cada centavo. Em 1h estava tudo funcionando perfeitamente!',
        author: 'Dra. Juliana Alves',
        specialty: 'Pediatra'
      },
      cta: 'Agendar Sessão - R$ 97,00',
      badge: 'Apenas 5 vagas/mês'
    }
  };

  const tool = tools[toolId];

  if (!tool) return null;

  const Icon = tool.icon;

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
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl max-h-[90vh] overflow-hidden"
            >
              <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
              {/* Header with Gradient */}
              <div className={`p-8 border-b border-white/10 bg-gradient-to-r ${tool.gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10">
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>

                  <div className="flex items-start gap-6">
                    <div className="p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                      <Icon className="w-12 h-12 text-white" />
                    </div>
                    <div className="flex-1">
                      {tool.badge && (
                        <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-3">
                          {tool.badge}
                        </span>
                      )}
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {tool.title}
                      </h2>
                      <p className="text-xl text-white/90 mb-4">{tool.subtitle}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-white">{tool.price}</span>
                        {tool.price !== 'GRÁTIS' && (
                          <span className="text-sm text-white/70">pagamento único</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-8">
                {/* Description */}
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {tool.description}
                </p>

                {/* Features Grid */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-white mb-6">O que você recebe:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tool.features.map((feature: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                      >
                        <div className="text-4xl mb-3">{feature.icon}</div>
                        <h4 className="font-bold text-white mb-2">{feature.title}</h4>
                        <p className="text-sm text-gray-400">{feature.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-white mb-6">Benefícios:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {tool.benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-brand-500/10 to-brand-500/10 border border-brand-500/20">
                        <Check className="w-6 h-6 text-brand-400 flex-shrink-0" />
                        <span className="text-white font-medium">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonial */}
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg text-white italic mb-4">"{tool.testimonial.text}"</p>
                  <div>
                    <p className="font-bold text-white">{tool.testimonial.author}</p>
                    <p className="text-sm text-gray-400">{tool.testimonial.specialty}</p>
                  </div>
                </div>

                {/* Guarantee */}
                <div className="p-6 rounded-xl bg-gradient-to-r from-brand-900/20 to-brand-900/20 border border-brand-500/30 text-center">
                  <Sparkles className="w-12 h-12 text-brand-400 mx-auto mb-3" />
                  <h4 className="font-bold text-white mb-2">Garantia de 7 dias</h4>
                  <p className="text-gray-400">
                    Não gostou? Devolvemos 100% do seu dinheiro, sem perguntas
                  </p>
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-6 border-t border-white/10 bg-black/40">
                <button className={`w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r ${tool.gradient} shadow-lg flex items-center justify-center gap-3`}>
                  <ShoppingCart className="w-6 h-6" />
                  {tool.cta}
                  <ArrowRight className="w-6 h-6" />
                </button>
                <p className="text-center text-xs text-gray-500 mt-3">
                  Pagamento seguro • Acesso imediato • Suporte em português
                </p>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
