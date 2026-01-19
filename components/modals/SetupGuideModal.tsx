"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, Settings, CheckCircle, Smartphone, Apple } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

interface SetupGuideModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function SetupGuideModal({ open, onOpenChange }: SetupGuideModalProps) {
  const [completed, setCompleted] = useState(false)
  
  const handleComplete = () => {
    setCompleted(true)
    setTimeout(() => {
      onOpenChange(false)
      setCompleted(false)
    }, 1500)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-blue-600" />
            Guia de Instalação - Voice Pen
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="download" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="download">
              <Download className="w-4 h-4 mr-2" />
              Download
            </TabsTrigger>
            <TabsTrigger value="config">
              <Settings className="w-4 h-4 mr-2" />
              Configuração
            </TabsTrigger>
            <TabsTrigger value="complete">
              <CheckCircle className="w-4 h-4 mr-2" />
              Concluir
            </TabsTrigger>
          </TabsList>
          
          {/* ABA 1: Download */}
          <TabsContent value="download" className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Baixe o Voice Pen no seu dispositivo
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Escaneie o QR Code correspondente ao seu sistema operacional
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* App Store */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white rounded-full p-3 shadow-md">
                    <Apple className="w-8 h-8 text-slate-900" />
                  </div>
                </div>
                <h4 className="text-center font-semibold text-slate-900 mb-3">iOS - App Store</h4>
                
                {/* QR Code Simulado */}
                <div className="bg-white rounded-lg p-4 shadow-sm mb-3">
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                    <div className="grid grid-cols-8 gap-1 p-4">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-sm ${
                            Math.random() > 0.5 ? "bg-slate-900" : "bg-white"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-center text-slate-600">
                  iPhone e iPad
                </p>
              </motion.div>
              
              {/* Play Store */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-xl p-6 border-2 border-brand-200"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white rounded-full p-3 shadow-md">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                      <path d="M3 20.5L21 12L3 3.5V20.5Z" fill="#34A853"/>
                      <path d="M3 3.5L13.5 14L3 20.5V3.5Z" fill="#4285F4"/>
                      <path d="M13.5 14L21 12L16.5 9.5L13.5 14Z" fill="#FBBC04"/>
                      <path d="M13.5 14L16.5 9.5L3 3.5L13.5 14Z" fill="#EA4335"/>
                    </svg>
                  </div>
                </div>
                <h4 className="text-center font-semibold text-slate-900 mb-3">Android - Play Store</h4>
                
                {/* QR Code Simulado */}
                <div className="bg-white rounded-lg p-4 shadow-sm mb-3">
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                    <div className="grid grid-cols-8 gap-1 p-4">
                      {Array.from({ length: 64 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-sm ${
                            Math.random() > 0.5 ? "bg-slate-900" : "bg-white"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                <p className="text-xs text-center text-slate-600">
                  Smartphones e Tablets
                </p>
              </motion.div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-900 text-center">
                💡 <strong>Dica:</strong> Use a câmera do seu celular para escanear o QR Code
              </p>
            </div>
          </TabsContent>
          
          {/* ABA 2: Configuração */}
          <TabsContent value="config" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Configure o Voice Pen
                </h3>
                <p className="text-sm text-slate-600">
                  Siga estas etapas para otimizar a qualidade de gravação
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: "Abra o aplicativo Voice Pen",
                    description: "Toque no ícone do Voice Pen na tela inicial do seu dispositivo"
                  },
                  {
                    step: 2,
                    title: "Acesse as Configurações",
                    description: "Toque no ícone de engrenagem (⚙️) no canto superior direito"
                  },
                  {
                    step: 3,
                    title: "Ative 'High Quality Audio'",
                    description: "Na seção 'Qualidade de Gravação', ative a opção 'High Quality Audio'"
                  },
                  {
                    step: 4,
                    title: "Permita acesso ao Microfone",
                    description: "Quando solicitado, permita que o app acesse o microfone do dispositivo"
                  },
                  {
                    step: 5,
                    title: "Configure o Backup Automático",
                    description: "Ative a sincronização com sua conta para não perder suas gravações"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-amber-900">
                  ⚠️ <strong>Importante:</strong> A qualidade de áudio alta consome mais espaço de armazenamento, mas garante transcrições mais precisas.
                </p>
              </div>
            </motion.div>
          </TabsContent>
          
          {/* ABA 3: Concluir */}
          <TabsContent value="complete" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-8"
            >
              <AnimatePresence mode="wait">
                {!completed ? (
                  <motion.div
                    key="ready"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="flex justify-center mb-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Tudo Pronto!
                    </h3>
                    <p className="text-slate-600 mb-8">
                      Seu Voice Pen está configurado e pronto para uso.
                      <br />
                      Comece a gravar suas consultas com qualidade profissional.
                    </p>
                    
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-6">
                      <h4 className="font-semibold text-slate-900 mb-3">Próximos passos:</h4>
                      <ul className="text-sm text-left space-y-2 text-slate-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                          <span>Copie o Prompt Mestre no dashboard</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                          <span>Cole o prompt nas configurações do gravador</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                          <span>Faça sua primeira gravação de teste</span>
                        </li>
                      </ul>
                    </div>
                    
                    <Button
                      onClick={handleComplete}
                      variant="primary"
                      size="lg"
                      className="w-full max-w-xs"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Tudo Pronto!
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12"
                  >
                    <div className="flex justify-center mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-24 h-24 bg-brand-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <CheckCircle className="w-12 h-12 text-white" />
                      </motion.div>
                    </div>
                    <h3 className="text-2xl font-bold text-brand-600">
                      Configuração Concluída! 🎉
                    </h3>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
