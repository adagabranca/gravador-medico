"use client"

import { motion } from "framer-motion"
import { CheckCircle2, Download, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

export default function CheckoutSuccessPage() {
  const [email, setEmail] = useState("")

  useEffect(() => {
    // Efeito de confete
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    })

    // Pega email dos query params
    const params = new URLSearchParams(window.location.search)
    setEmail(params.get("email") || "seu email")
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full mb-6"
          >
            <CheckCircle2 className="w-14 h-14 text-white" />
          </motion.div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Pagamento Confirmado! 🎉
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Bem-vindo ao Método Gravador Médico!
          </p>

          {/* Info Cards */}
          <div className="space-y-4 mb-8">
            <div className="bg-brand-50 border-2 border-brand-200 rounded-2xl p-6 text-left">
              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-brand-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Verifique seu Email
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Enviamos para <strong>{email}</strong> todos os links de acesso, 
                    instruções de instalação e seus 4 bônus exclusivos.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-brand-50 border-2 border-brand-200 rounded-2xl p-6 text-left">
              <div className="flex items-start gap-4">
                <Download className="w-6 h-6 text-brand-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Instalação em 5 Minutos
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Siga o passo a passo que enviamos por email. É simples, rápido 
                    e guiado. Em 5 minutos você estará gravando sua primeira consulta.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4">
            <Link href="/dashboard">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-brand-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-gradient-to-r from-brand-600 to-brand-600 text-white px-8 py-4 rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2">
                  ACESSAR ÁREA DE MEMBROS
                  <ArrowRight className="w-5 h-5" />
                </div>
              </motion.button>
            </Link>

            <p className="text-sm text-gray-500">
              Dúvidas? Entre em contato pelo suporte
            </p>
          </div>

          {/* Next Steps */}
          <div className="mt-12 pt-8 border-t-2 border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Próximos Passos:</h3>
            <div className="space-y-3 text-left">
              {[
                "1. Verifique seu email (inclusive spam)",
                "2. Clique no link de acesso à área de membros",
                "3. Siga o tutorial de instalação de 5 minutos",
                "4. Configure seu prompt com seus dados",
                "5. Comece a gravar suas consultas!",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-600 font-bold text-sm flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
