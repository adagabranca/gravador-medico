"use client"

import { motion } from "framer-motion"
import { BookOpen, Shield, Brain, Clock, ArrowRight, TrendingUp } from "lucide-react"
import { useState } from "react"

interface ArticleCard {
  id: string
  category: string
  title: string
  excerpt: string
  readTime: string
  thumbnail: React.ReactNode
  gradient: string
  trending?: boolean
}

interface ArticleCardProps {
  article: ArticleCard
  index: number
  onClick: () => void
}

function ArticleCard({ article, index, onClick }: ArticleCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="relative flex-shrink-0 w-full md:w-[420px] cursor-pointer group"
    >
      {/* Card Container */}
      <div className="relative h-full overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10">
        {/* Thumbnail Section */}
        <div className="relative h-48 overflow-hidden">
          {/* Animated Background */}
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? 2 : 0,
            }}
            transition={{ duration: 0.6 }}
            className={`absolute inset-0 bg-gradient-to-br ${article.gradient}`}
          />

          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                scale: isHovered ? 1.2 : 1,
                rotate: isHovered ? 10 : 0,
              }}
              className="relative z-10"
            >
              {article.thumbnail}
            </motion.div>
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Trending Badge */}
          {article.trending && (
            <div className="absolute top-4 right-4">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="px-3 py-1.5 rounded-full bg-brand-500/90 backdrop-blur-sm flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4 text-white" />
                <span className="text-xs font-bold text-white">Em Alta</span>
              </motion.div>
            </div>
          )}

          {/* Read Time Badge */}
          <div className="absolute bottom-4 left-4">
            <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm flex items-center gap-2 border border-white/20">
              <Clock className="w-3.5 h-3.5 text-white/80" />
              <span className="text-xs text-white/80 font-medium">{article.readTime}</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Category */}
          <div className="mb-3">
            <span className="text-xs font-bold text-white/50 uppercase tracking-wider">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 leading-tight">
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-white/60 leading-relaxed mb-4 line-clamp-2">
            {article.excerpt}
          </p>

          {/* Read More Button */}
          <motion.button
            whileHover={{ x: 5 }}
            className="flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors group"
          >
            <span>Ler artigo completo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Hover Border Glow */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          className={`absolute inset-0 rounded-2xl border-2 bg-gradient-to-br ${article.gradient} opacity-20`}
        />
      </div>
    </motion.div>
  )
}

interface KnowledgeHubProps {
  onArticleClick?: (articleId: string) => void
}

export default function KnowledgeHub({ onArticleClick }: KnowledgeHubProps) {
  const articles: ArticleCard[] = [
    {
      id: "lgpd-medical",
      category: "CONFORMIDADE",
      title: "LGPD na Medicina: Proteja os Dados dos Seus Pacientes",
      excerpt:
        "Entenda as obrigações legais e boas práticas para manter sua clínica 100% conforme com a Lei Geral de Proteção de Dados.",
      readTime: "5 min",
      thumbnail: <Shield className="w-20 h-20 text-white" />,
  gradient: "from-brand-500 to-brand-600",
      trending: true,
    },
    {
      id: "ai-cardiology",
      category: "INTELIGÊNCIA ARTIFICIAL",
      title: "IA na Cardiologia: O Futuro Já Chegou",
      excerpt:
        "Como ferramentas de inteligência artificial estão revolucionando diagnósticos cardíacos e reduzindo erros médicos em 40%.",
      readTime: "7 min",
      thumbnail: <Brain className="w-20 h-20 text-white" />,
      gradient: "from-purple-500 to-pink-600",
      trending: false,
    },
    {
      id: "time-management",
      category: "PRODUTIVIDADE",
      title: "Gestão de Tempo: Atenda Mais Sem Trabalhar Mais",
      excerpt:
        "Técnicas comprovadas para otimizar sua agenda, automatizar tarefas repetitivas e recuperar horas do seu dia.",
      readTime: "4 min",
      thumbnail: <Clock className="w-20 h-20 text-white" />,
      gradient: "from-blue-500 to-cyan-600",
      trending: true,
    },
  ]

  const handleArticleClick = (articleId: string) => {
    if (onArticleClick) {
      onArticleClick(articleId)
    }
    // Fallback: could open in new tab or trigger modal
    console.log(`Opening article: ${articleId}`)
  }

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-brand-600/5 to-cyan-600/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Medicina 4.0 & Insights
            </h2>
          </div>
          <p className="text-lg text-white/60 ml-7">
            Artigos exclusivos sobre tecnologia, gestão e futuro da medicina
          </p>
        </motion.div>

        {/* Horizontal Scroll Articles */}
        <div className="overflow-x-auto scrollbar-hide pb-8">
          <div className="flex gap-6">
            {articles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                index={index}
                onClick={() => handleArticleClick(article.id)}
              />
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-12 relative overflow-hidden rounded-2xl"
        >
          {/* Animated Background */}
          <motion.div
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 bg-[length:200%_100%]"
          />

          {/* Content */}
          <div className="relative z-10 p-8 border border-white/10 backdrop-blur-sm rounded-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">
                    Assine Nossa Newsletter
                  </h4>
                  <p className="text-white/60">
                    Receba artigos semanais sobre inovação médica e inteligência artificial
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full bg-white text-black font-bold hover:shadow-xl hover:shadow-white/30 transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <span>Quero Receber</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}
