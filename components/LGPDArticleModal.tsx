'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Shield, CheckCircle2 } from 'lucide-react';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LGPDArticleModal({ isOpen, onClose }: ArticleModalProps) {
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
              className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-white/10 bg-gradient-to-r from-brand-600/20 to-brand-700/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-brand/20 text-brand-500 text-xs font-bold border border-brand/30">
                        Conformidade
                      </span>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>5 min de leitura</span>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <X className="w-6 h-6 text-white" />
                    </button>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    LGPD na Medicina: Proteja os Dados dos Seus Pacientes
                  </h2>
                  
                  <p className="text-lg text-gray-400">
                    Entenda as obrigações legais e boas práticas para manter sua clínica 100% conforme com a Lei Geral de Proteção de Dados.
                  </p>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-8">
                  <div className="space-y-6 text-gray-300">
                    <section>
                      <h3 className="text-2xl font-bold text-white mb-3">Por Que a LGPD Importa Para Médicos?</h3>
                      <p className="mb-3">
                        A Lei Geral de Proteção de Dados (LGPD) estabelece regras claras sobre como dados pessoais devem ser coletados, 
                        armazenados e utilizados. Para profissionais da saúde, isso significa uma responsabilidade ainda maior, já que 
                        lidamos com <strong className="text-white">dados sensíveis</strong> sobre a saúde dos pacientes.
                      </p>
                      <p>
                        O não cumprimento da LGPD pode resultar em multas de até <strong className="text-brand-400">R$ 50 milhões</strong> 
                        ou 2% do faturamento anual da empresa, além de danos irreparáveis à reputação profissional.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-2xl font-bold text-white mb-4">Os 5 Pilares da LGPD na Prática Médica</h3>
                      
                      <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-brand-50 border border-brand-50">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="text-lg font-bold text-white mb-1">1. Consentimento Claro</h4>
                              <p className="text-sm text-gray-400">
                                O paciente deve autorizar expressamente o tratamento de seus dados. Use termos de consentimento 
                                específicos para cada finalidade (atendimento, pesquisa, marketing, etc.).
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-brand-50 border border-brand-50">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="text-lg font-bold text-white mb-1">2. Minimização de Dados</h4>
                              <p className="text-sm text-gray-400">
                                Colete apenas informações estritamente necessárias para o atendimento. Evite dados desnecessários 
                                que aumentam o risco de vazamento.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-brand-50 border border-brand-50">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="text-lg font-bold text-white mb-1">3. Segurança da Informação</h4>
                              <p className="text-sm text-gray-400">
                                Use sistemas com criptografia, controle de acesso e backups regulares. Prontuários em papel devem 
                                ser guardados em local seguro com acesso restrito.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-brand-50 border border-brand-50">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="text-lg font-bold text-white mb-1">4. Direitos do Titular</h4>
                              <p className="text-sm text-gray-400">
                                Pacientes têm direito a acessar, corrigir, excluir ou portar seus dados. Estabeleça um fluxo 
                                para atender essas solicitações em até 15 dias.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20">
                          <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-brand-400 flex-shrink-0 mt-1" />
                            <div>
                              <h4 className="text-lg font-bold text-white mb-1">5. Transparência e Responsabilidade</h4>
                              <p className="text-sm text-gray-400">
                                Documente todas as práticas de tratamento de dados. Tenha uma Política de Privacidade atualizada 
                                e nomeie um Encarregado de Dados (DPO) se aplicável.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="p-6 rounded-2xl bg-gradient-to-br from-brand-600/20 to-brand-700/20 border border-brand-50">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-brand-500" />
                        Checklist de Conformidade LGPD
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-brand-500 mt-1">✓</span>
                          <span>Termo de Consentimento LGPD assinado por todos os pacientes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-brand-400 mt-1">✓</span>
                          <span>Política de Privacidade visível no consultório e site</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-brand-400 mt-1">✓</span>
                          <span>Sistema de prontuário eletrônico com criptografia</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-brand-400 mt-1">✓</span>
                          <span>Contratos com fornecedores incluindo cláusulas LGPD</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-brand-400 mt-1">✓</span>
                          <span>Processo para exclusão de dados após o período legal</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-brand-400 mt-1">✓</span>
                          <span>Treinamento periódico da equipe sobre LGPD</span>
                        </li>
                      </ul>
                    </section>

                    <section>
                      <h3 className="text-2xl font-bold text-white mb-3">Conclusão</h3>
                      <p className="mb-3">
                        A conformidade com a LGPD não é apenas uma obrigação legal, mas uma demonstração de respeito e profissionalismo 
                        com seus pacientes. Ao implementar essas práticas, você protege sua clínica e constrói uma relação de confiança 
                        sólida.
                      </p>
                      <div className="p-4 rounded-xl bg-brand-50 border border-brand-50">
                        <p className="text-brand-500 font-semibold">
                          💡 Dica: Use o método VoicePen com criptografia end-to-end e exclusão automática de áudios para estar 100% 
                          em conformidade com a LGPD.
                        </p>
                      </div>
                    </section>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
