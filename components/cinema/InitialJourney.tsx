"use client"

import { motion, useMotionValue, useTransform } from "framer-motion"
import { Smartphone, Brain, Mic, Play, Lock } from "lucide-react"
import { useState } from "react"

interface Episode {
  id: string
  number: number
  title: string
  subtitle: string
  icon: React.ReactNode
  gradient: string
  image: string
  locked?: boolean
  onClick: () => void
}

interface EpisodeCardProps {
  episode: Episode
  index: number
}

function EpisodeCard({ episode, index }: EpisodeCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="flex-shrink-0 w-[420px] cursor-pointer group"
      onClick={episode.onClick}
    >
      <div className="relative overflow-hidden rounded-2xl aspect-video">
        {/* Background Image/Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${episode.gradient}`}>
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.6 }}
            className="w-full h-full flex items-center justify-center"
          >
            <div className="relative">
              {episode.icon}
              {/* Glow effect */}
              <motion.div
                animate={{
                  opacity: isHovered ? 0.6 : 0.3,
                  scale: isHovered ? 1.3 : 1,
                }}
                className="absolute inset-0 blur-3xl bg-white/20"
              />
            </div>
          </motion.div>
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* Lock Badge */}
        {episode.locked && (
          <div className="absolute top-4 right-4">
            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Lock className="w-5 h-5 text-white/80" />
            </div>
          </div>
        )}

        {/* Play Button Overlay */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/40">
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </div>
        </motion.div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-white/60">
              EPISÓDIO {episode.number}
            </span>
              {!episode.locked && (
              <span className="px-2 py-0.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-400 text-xs font-semibold">
                DISPONÍVEL
              </span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {episode.title}
          </h3>
          <p className="text-sm text-white/70">{episode.subtitle}</p>
        </div>

        {/* Hover Border Glow */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          className="absolute inset-0 rounded-2xl border-2 border-white/20"
        />
      </div>

      {/* Duration/Info */}
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0.7,
        }}
        className="mt-3 flex items-center gap-4 text-sm text-white/60"
      >
        <span>⏱️ 3 min</span>
        <span>•</span>
        <span>Passo-a-passo</span>
      </motion.div>
    </motion.div>
  )
}

interface InitialJourneyProps {
  onEpisode1Click: () => void
  onEpisode2Click: () => void
  onEpisode3Click: () => void
}

export default function InitialJourney({
  onEpisode1Click,
  onEpisode2Click,
  onEpisode3Click,
}: InitialJourneyProps) {
  const episodes: Episode[] = [
    {
      id: "app",
      number: 1,
      title: "O Aplicativo",
      subtitle: "Instale o Voice Pen no seu iPhone",
      icon: <Smartphone className="w-32 h-32 text-white" />,
      gradient: "from-blue-600 to-cyan-600",
      image: "/images/iphone.jpg",
      onClick: onEpisode1Click,
    },
    {
      id: "intelligence",
      number: 2,
      title: "A Inteligência",
      subtitle: "Instale o Cérebro Médico no seu gravador",
      icon: <Brain className="w-32 h-32 text-white" />,
      gradient: "from-purple-600 to-pink-600",
      image: "/images/brain.jpg",
      onClick: onEpisode2Click,
    },
    {
      id: "first-test",
      number: 3,
      title: "O Primeiro Teste",
      subtitle: "Grave sua primeira consulta guiada",
      icon: <Mic className="w-32 h-32 text-white" />,
  gradient: "from-brand-600 to-brand-600",
      image: "/images/mic.jpg",
      onClick: onEpisode3Click,
    },
  ]

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto mb-12"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            A Jornada Inicial
          </h2>
        </div>
        <p className="text-lg text-white/60 ml-7">
          Complete os 3 episódios para ativar seu escriba digital
        </p>
      </motion.div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide pb-8">
          <div className="flex gap-6 px-6 max-w-7xl mx-auto">
            {episodes.map((episode, index) => (
              <EpisodeCard key={episode.id} episode={episode} index={index} />
            ))}
          </div>
        </div>

        {/* Gradient Fade Edges */}
        <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
      </div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto mt-12 px-6"
      >
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/60">Seu progresso:</span>
          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden max-w-md">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "33%" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            />
          </div>
          <span className="text-sm text-white/60">1/3 completo</span>
        </div>
      </motion.div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
