"use client"

import { motion } from "framer-motion"
import { ArrowLeft, Check, Lock, Sparkles, MessageSquare, TrendingUp, FileCheck, Headphones } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/toast"

export default function StorePage() {
  const router = useRouter()
  const { toast } = useToast()

  const products = [
    {
      id: "whatsapp",
      name: "Gerador WhatsApp Pós-Consulta",
      description: "Fidelize pacientes em 1 clique com 50+ templates profissionais de mensagens para engajamento e follow-up.",
  icon: <MessageSquare className="w-8 h-8 text-background" />,
  gradient: "from-brand to-brand-700",
      price: 0,
      originalPrice: 47,
      features: [
        "50+ templates personalizáveis",
        "Mensagens de confirmação automáticas",
        "Scripts de acolhimento e retorno",
        "Lembretes de exames",
        "Follow-up pós-consulta",
      ],
      badge: "LIBERADO",
      locked: false,
    },
    {
      id: "marketing",
      name: "Marketing Médico Express",
      description: "Transforme suas consultas em conteúdo educativo. 365 posts prontos para Instagram e LinkedIn com planejamento completo 2026.",
  icon: <TrendingUp className="w-8 h-8 text-background" />,
  gradient: "from-brand-600 to-brand-700",
      price: 37,
      features: [
        "365 posts planejados (1 ano completo)",
        "Templates editáveis no Canva",
        "Estratégia de crescimento mensal",
        "Legendas prontas otimizadas para SEO",
        "Calendário de postagens",
      ],
      badge: "POPULAR",
      locked: true,
    },
    {
      id: "auditor",
      name: "Auditor Clínico IA",
      description: "Valide prontuários contra diretrizes médicas atualizadas. Detecte inconsistências e melhore a qualidade da documentação.",
  icon: <FileCheck className="w-8 h-8 text-background" />,
  gradient: "from-secondary to-danger",
      price: 29,
      features: [
        "Validação automática de prontuários",
        "Checagem contra protocolos atualizados",
        "Detecção de inconsistências",
        "Sugestões de melhoria",
        "Relatórios de qualidade",
      ],
      badge: "NOVO",
      locked: true,
    },
    {
      id: "vip",
      name: "Suporte VIP & Setup Personalizado",
      description: "Sessão individual 1-on-1 de 60min com especialista. Configuração personalizada + suporte prioritário por 30 dias.",
  icon: <Headphones className="w-8 h-8 text-background" />,
  gradient: "from-warning to-warning-dark",
      price: 97,
      features: [
        "Sessão ao vivo 60 minutos",
        "Configuração 100% personalizada",
        "Suporte prioritário 30 dias",
        "Acesso direto ao especialista",
        "Gravação da sessão para consulta",
      ],
      badge: "PREMIUM",
      locked: true,
    },
  ]

  const handlePurchase = (product: typeof products[0]) => {
    if (product.locked) {
      toast(`🔒 "${product.name}" - Checkout em breve! Preço: R$ ${product.price}`)
    } else {
      toast(`✅ Acessando "${product.name}"...`)
    }
  }

  return (
    <main className="min-h-screen relative px-6 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <button
            onClick={() => router.push("/dashboard")}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Dashboard
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-info to-secondary flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-background" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-foreground">Loja Premium</h1>
              <p className="text-xl text-muted-foreground mt-2">
                Ferramentas para potencializar sua prática médica
              </p>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative p-8 rounded-3xl bg-gradient-to-br from-background/5 to-background/[0.02] backdrop-blur-xl border border-border overflow-hidden group"
            >
              {/* Gradient Glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center shadow-lg`}>
                    {product.icon}
                  </div>
                  <div
                    className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                      product.locked
                        ? "bg-muted/80 text-muted-foreground border border-border"
                        : "bg-brand/20 text-brand border border-brand-700/30"
                    }`}
                  >
                    {product.badge}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-foreground mb-3">{product.name}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{product.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div>
                    {product.locked ? (
                      <>
                        <div className="text-4xl font-bold text-foreground">
                          R$ {product.price}
                        </div>
                        {product.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            R$ {product.originalPrice}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-2xl font-bold text-brand">
                        GRÁTIS
                      </div>
                    )}
                  </div>

                  <motion.button
                    onClick={() => handlePurchase(product)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
                      product.locked
                        ? "bg-gradient-to-r from-brand-700 to-brand text-white shadow-lg shadow-brand/30"
                        : "bg-brand/20 text-brand border border-brand-700/30 hover:bg-brand/30"
                    }`}
                  >
                    {product.locked ? (
                      <>
                        <Lock className="w-5 h-5" />
                        Desbloquear
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Acessar
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bundle Offer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-secondary-dark/20 to-danger-dark/20 border border-secondary/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-danger flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-background" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-foreground mb-1">
                  Bundle Completo - Método 360°
                </h4>
                <p className="text-muted-foreground">
                  Adquira todos os produtos e ganhe{" "}
                  <strong className="text-success">35% de desconto</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-muted-foreground line-through">R$ 210</div>
                <div className="text-4xl font-bold text-foreground">R$ 137</div>
              </div>
              <button
                onClick={() => toast("🎁 Bundle em breve!")}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-secondary to-danger text-background font-bold shadow-lg shadow-secondary/50 hover:shadow-secondary/70 transition-all whitespace-nowrap"
              >
                Ver Bundle
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
