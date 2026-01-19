'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Stethoscope, 
  FileText, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2
} from 'lucide-react';

interface MedicalProfileWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: MedicalProfile) => void;
}

export interface MedicalProfile {
  name: string;
  crm: string;
  specialty: string;
  subspecialties: string[];
  preferredFormat: string;
  careType: string[];
  patientType: string[];
  customNotes: string;
}

export default function MedicalProfileWizard({ isOpen, onClose, onComplete }: MedicalProfileWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const [profile, setProfile] = useState<MedicalProfile>({
    name: '',
    crm: '',
    specialty: '',
    subspecialties: [],
    preferredFormat: '',
    careType: [],
    patientType: [],
    customNotes: ''
  });

  const specialties = [
    'Clínica Geral',
    'Cardiologia',
    'Ginecologia',
    'Ortopedia',
    'Dermatologia',
    'Pediatria',
    'Neurologia',
    'Psiquiatria',
    'Endocrinologia',
    'Gastroenterologia',
    'Pneumologia',
    'Reumatologia',
    'Urologia',
    'Oncologia',
    'Oftalmologia',
    'Otorrinolaringologia'
  ];

  const formats = [
    { id: 'soap', name: 'SOAP (Padrão Ouro)', description: 'Subjetivo, Objetivo, Avaliação, Plano' },
    { id: 'evolution', name: 'Evolução + Conduta', description: 'Para acompanhamento hospitalar' },
    { id: 'followup', name: 'Retorno / Follow-up', description: 'Consultas de retorno' }
  ];

  const careTypes = [
    'Ambulatório',
    'Hospitalar',
    'Pronto-Socorro',
    'UTI',
    'Domiciliar',
    'Telemedicina'
  ];

  const patientTypes = [
    'Adulto',
    'Pediátrico',
    'Geriátrico',
    'Gestante'
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(profile);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const steps = [
    {
      number: 1,
      title: 'Dados Profissionais',
      icon: User,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nome completo
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Dr(a). Seu Nome"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CRM
            </label>
            <input
              type="text"
              value={profile.crm}
              onChange={(e) => setProfile({ ...profile, crm: e.target.value })}
              placeholder="CRM/UF 123456"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Especialidade principal
            </label>
            <select
              value={profile.specialty}
              onChange={(e) => setProfile({ ...profile, specialty: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-brand-500/50 transition-colors"
            >
              <option value="" className="bg-gray-900">Selecione...</option>
              {specialties.map(spec => (
                <option key={spec} value={spec} className="bg-gray-900">
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subespecialidades (opcional)
            </label>
            <input
              type="text"
              value={profile.subspecialties.join(', ')}
              onChange={(e) => setProfile({ 
                ...profile, 
                subspecialties: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              placeholder="Ex: Ecocardiografia, Hemodinâmica"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-500/50 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Separe por vírgulas</p>
          </div>
        </div>
      )
    },
    {
      number: 2,
      title: 'Formato Preferido',
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-400 mb-4">
            Qual formato você prefere para seus prontuários?
          </p>
          {formats.map(format => (
            <button
              key={format.id}
              onClick={() => setProfile({ ...profile, preferredFormat: format.id })}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                profile.preferredFormat === format.id
                  ? 'bg-brand-50 border-brand text-brand-500'
                  : 'bg-white/5 border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-white mb-1">{format.name}</h3>
                  <p className="text-sm text-gray-400">{format.description}</p>
                </div>
                {profile.preferredFormat === format.id && (
                  <Check className="w-5 h-5 text-brand-400 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>
      )
    },
    {
      number: 3,
      title: 'Tipo de Atendimento',
      icon: Stethoscope,
      content: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Onde você atende? (pode selecionar vários)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {careTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setProfile({ 
                    ...profile, 
                    careType: toggleArrayItem(profile.careType, type)
                  })}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 text-sm font-medium ${
                    profile.careType.includes(type)
                      ? 'bg-brand-50 border-brand text-brand-500'
                      : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Tipo de paciente (pode selecionar vários)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {patientTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setProfile({ 
                    ...profile, 
                    patientType: toggleArrayItem(profile.patientType, type)
                  })}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 text-sm font-medium ${
                    profile.patientType.includes(type)
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                      : 'bg-white/5 border-white/10 hover:border-white/30 text-gray-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      number: 4,
      title: 'Detalhes Finais',
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Informações adicionais (opcional)
            </label>
            <textarea
              value={profile.customNotes}
              onChange={(e) => setProfile({ ...profile, customNotes: e.target.value })}
              placeholder="Ex: Sempre incluir sinais vitais, mencionar alergias conhecidas, focar em..."
              rows={6}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500/50 transition-colors resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Isso ajudará a IA a personalizar ainda mais seus prompts
            </p>
          </div>

          <div className="p-4 bg-gradient-to-br from-brand-50 to-blue-500/10 rounded-xl border border-brand-50">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">Prompt Personalizado</h4>
                <p className="text-sm text-gray-400">
                  Com base nas suas informações, vamos gerar um prompt único otimizado para seu estilo de trabalho.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep - 1];
  const Icon = currentStepData.icon;

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return profile.name && profile.crm && profile.specialty;
      case 2:
        return profile.preferredFormat;
      case 3:
        return profile.careType.length > 0 && profile.patientType.length > 0;
      case 4:
        return true;
      default:
        return false;
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
                    <div className="p-2 rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20">
                      <Icon className="w-5 h-5 text-teal-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {currentStepData.number}/{totalSteps} {currentStepData.title}
                      </h2>
                      <p className="text-sm text-gray-400">Configure seu perfil médico</p>
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
                  disabled={!canProceed()}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
                >
                  {currentStep === totalSteps ? (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Gerar Meu Prompt
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
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
