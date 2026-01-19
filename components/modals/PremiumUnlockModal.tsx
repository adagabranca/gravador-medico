"use client"

import { motion } from "framer-motion"
import { CheckCircle, Lock, Sparkles, CreditCard } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"

interface PremiumUnlockModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  price: string
  description: string
  benefits: string[]
  badge?: "premium" | "protection"
  icon?: React.ReactNode
}

export default function PremiumUnlockModal({
  open,
  onOpenChange,
  title,
  price,
  description,
  benefits,
  badge = "premium",
  icon
}: PremiumUnlockModalProps) {
  const { toast } = useToast()
  
  const handleUnlock = () => {
    // Simular processo de compra
    toast("Redirecionando para pagamento seguro... 🔒", "success")
    
    setTimeout(() => {
      toast("Em breve você terá acesso ao conteúdo premium!", "success")
      onOpenChange(false)
    }, 2000)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <div className="flex items-center justify-between mb-3">
              <div className={`p-3 rounded-xl ${
                badge === "premium" 
                  ? "bg-gradient-to-br from-amber-100 to-amber-200" 
                  : "bg-gradient-to-br from-blue-100 to-blue-200"
              }`}>
                {icon || (
                  badge === "premium" 
                    ? <Sparkles className="w-8 h-8 text-amber-600" />
                    : <Lock className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <Badge variant={badge} className="text-sm px-3 py-1">
                {badge === "premium" ? "Premium" : "Proteção"}
              </Badge>
            </div>
            
            <DialogTitle className="text-2xl">{title}</DialogTitle>
            <DialogDescription className="text-base mt-2">
              {description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 space-y-6">
            {/* Benefícios */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-brand-600" />
                O que está incluído:
              </h4>
              
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                    className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                  >
                    <CheckCircle className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-slate-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Preço em Destaque */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className={`relative overflow-hidden rounded-xl border-2 ${
                badge === "premium"
                  ? "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300"
                  : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300"
              } p-6`}
            >
              {/* Decoração de fundo */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full -ml-12 -mb-12"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                      badge === "premium" ? "text-amber-700" : "text-blue-700"
                    }`}>
                      Investimento Único
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-slate-900">{price}</span>
                      <span className="text-sm text-slate-600 line-through">R$ 49,90</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">Acesso vitalício • Sem mensalidade</p>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    badge === "premium"
                      ? "bg-amber-600 text-white"
                      : "bg-blue-600 text-white"
                  }`}>
                    -40% OFF
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-4 pt-4 border-t border-slate-300">
                  <CreditCard className="w-4 h-4" />
                  <span>Pagamento 100% seguro</span>
                </div>
              </div>
            </motion.div>
            
            {/* Garantia */}
            <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-brand-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-brand-900 text-sm mb-1">
                    Garantia de 7 dias
                  </h5>
                  <p className="text-xs text-brand-800">
                    Se não ficar satisfeito, devolvemos 100% do seu dinheiro. Sem perguntas.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Agora não
            </Button>
            <Button 
              variant="primary" 
              size="lg" 
              onClick={handleUnlock}
              className="flex-1 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Desbloquear Agora
              </span>
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
