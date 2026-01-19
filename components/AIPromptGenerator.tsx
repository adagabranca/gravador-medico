'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Copy, 
  Check, 
  Sparkles,
  Loader2,
  Download,
  Edit
} from 'lucide-react';
import type { MedicalProfile } from './MedicalProfileWizard';

interface AIPromptGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  profile: MedicalProfile;
}

export default function AIPromptGenerator({ isOpen, onClose, profile }: AIPromptGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Simulate AI generation (replace with actual OpenAI API call)
  useState(() => {
    if (isOpen) {
      setTimeout(() => {
        const prompt = generatePromptFromProfile(profile);
        setGeneratedPrompt(prompt);
        setIsGenerating(false);
      }, 2000);
    }
  });

  const generatePromptFromProfile = (prof: MedicalProfile): string => {
    const formatMap: Record<string, string> = {
      soap: `S (Subjetivo): Queixa principal, história da doença atual, antecedentes relevantes
O (Objetivo): Exame físico detalhado, sinais vitais
A (Avaliação): Hipótese diagnóstica principal e diferenciais
P (Plano): Conduta terapêutica, exames solicitados, orientações`,
      evolution: `DIA DE INTERNAÇÃO: [número]
QUEIXAS DO DIA: 
EXAME FÍSICO: Sinais vitais e sistemas
EXAMES/RESULTADOS:
AVALIAÇÃO E CONDUTA:`,
      followup: `MOTIVO DO RETORNO:
EVOLUÇÃO desde última consulta:
EXAMES trazidos:
NOVO EXAME FÍSICO:
REAVALIAÇÃO E CONDUTA:`
    };

    const careContext = prof.careType.length > 0 
      ? `\nContexto: Atendimento em ${prof.careType.join(', ').toLowerCase()}.` 
      : '';

    const patientContext = prof.patientType.length > 0
      ? ` Pacientes: ${prof.patientType.join(', ').toLowerCase()}.`
      : '';

    const subspecialty = prof.subspecialties.length > 0
      ? ` com foco em ${prof.subspecialties.join(', ')}`
      : '';

    const customSection = prof.customNotes 
      ? `\n\nOrientações específicas:\n${prof.customNotes}` 
      : '';

    return `Você é um assistente de documentação médica especializado em ${prof.specialty}${subspecialty}.${careContext}${patientContext}

Organize a transcrição da consulta no seguinte formato:

${formatMap[prof.preferredFormat] || formatMap.soap}

IMPORTANTE:
- Mantenha terminologia médica precisa
- Preserve todos os dados clínicos relevantes
- Organize de forma clara e estruturada
- Destaque informações críticas${customSection}

---
[TRANSCRIÇÃO DA CONSULTA]`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadAsFile = () => {
    const blob = new Blob([generatedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_${profile.specialty.toLowerCase().replace(/\s/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-xl z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl border border-white/10 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20">
                <Sparkles className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Seu Prompt Personalizado</h2>
                <p className="text-sm text-gray-400">
                  Otimizado para {profile.specialty}
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="relative mb-6">
                <Loader2 className="w-16 h-16 text-brand-400 animate-spin" />
                <Sparkles className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Gerando seu prompt...</h3>
              <p className="text-sm text-gray-400 text-center max-w-md">
                Estamos criando um prompt único baseado no seu perfil médico e preferências
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Profile Summary */}
              <div className="p-4 bg-gradient-to-br from-brand-50 to-blue-500/10 rounded-xl border border-brand-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">Dr(a). {profile.name}</h3>
                    <p className="text-sm text-gray-400">{profile.crm} • {profile.specialty}</p>
                  </div>
                  <span className="px-3 py-1 bg-brand-500/20 text-brand-300 text-xs rounded-full">
                    Personalizado
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.careType.map(type => (
                    <span key={type} className="px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full">
                      {type}
                    </span>
                  ))}
                  {profile.patientType.map(type => (
                    <span key={type} className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Generated Prompt */}
              <div className="relative">
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-xl rounded-lg transition-all duration-300 border border-white/10"
                  >
                    {isCopied ? (
                      <Check className="w-4 h-4 text-brand-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="bg-black/40 rounded-xl p-6 border border-white/10 font-mono text-sm text-gray-300 whitespace-pre-wrap">
                  {generatedPrompt}
                </div>
              </div>

              {/* Tips */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  Como usar
                </h4>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                    <span className="text-brand-400 mt-0.5">1.</span>
                    <span>Copie este prompt e cole no VoicePen</span>
                  </li>
                    <li className="flex items-start gap-2">
                    <span className="text-brand-400 mt-0.5">2.</span>
                    <span>Faça sua gravação normalmente</span>
                  </li>
                    <li className="flex items-start gap-2">
                    <span className="text-brand-400 mt-0.5">3.</span>
                    <span>O prontuário será estruturado automaticamente</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        {!isGenerating && (
          <div className="p-6 border-t border-white/10 flex gap-3">
            <button
              onClick={downloadAsFile}
              className="flex items-center justify-center gap-2 flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all duration-300 border border-white/10"
            >
              <Download className="w-5 h-5" />
              Baixar .txt
            </button>
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 flex-1 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-semibold transition-all duration-300"
            >
              {isCopied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copiar Prompt
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
