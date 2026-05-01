'use client'
import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export function ScrollReveal({ children, className = '', delay = 0, direction = 'up' }: {
  children: ReactNode; className?: string; delay?: number; direction?: 'up' | 'down' | 'left' | 'right'
}) {
  const dirs = { up: { y: 60 }, down: { y: -60 }, left: { x: 60 }, right: { x: -60 } }
  return (
    <motion.div
      initial={{ opacity: 0, ...dirs[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Spotlight({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Soft glow pool under the element */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
        style={{
          width: '400px',
          height: '140px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(251,191,36,0.22) 0%, rgba(251,191,36,0.06) 55%, transparent 80%)',
        }}
        animate={{ opacity: [0.6, 1, 0.6], scale: [0.95, 1.05, 0.95] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

/** Full-section stage spotlights — place inside a relative/overflow-hidden container */
export function HeroSpotlights() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Left beam — originates from top-left, shines down-right */}
      <motion.div
        className="absolute"
        style={{
          top: 0,
          left: '20%',
          width: '350px',
          height: '80%',              // ← LENGTH: 80% of section height
          transformOrigin: 'top center',
          background: 'linear-gradient(to bottom, rgba(251,191,36,0.06) 0%, rgba(251,191,36,0.12) 60%, rgba(251,191,36,0.02) 100%)',
          clipPath: 'polygon(45% 0%, 55% 0%, 85% 100%, 15% 100%)',
          filter: 'blur(4px)',
        }}
        animate={{ rotate: [-14, -10, -14] }}   // ← more angled inward
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Right beam — originates from top-right, shines down-left */}
      <motion.div
        className="absolute"
        style={{
          top: 0,
          right: '20%',
          width: '350px',
          height: '80%',              // ← LENGTH: 80% of section height
          transformOrigin: 'top center',
          background: 'linear-gradient(to bottom, rgba(251,191,36,0.05) 0%, rgba(251,191,36,0.10) 60%, rgba(251,191,36,0.02) 100%)',
          clipPath: 'polygon(45% 0%, 55% 0%, 85% 100%, 15% 100%)',
          filter: 'blur(5px)',
        }}
        animate={{ rotate: [14, 10, 14] }}       // ← more angled inward
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Center beam — straight down */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: 0,
          width: '300px',
          height: '700px',
          background: 'linear-gradient(to bottom, rgba(251,191,36,0.04) 0%, rgba(251,191,36,0.14) 55%, rgba(251,191,36,0.03) 100%)',
          clipPath: 'polygon(42% 0%, 58% 0%, 78% 100%, 22% 100%)',
          filter: 'blur(3px)',
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Glow pool on the "stage floor" — bottom of section */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: '70%',
          height: '220px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, rgba(251,191,36,0.12) 0%, rgba(251,191,36,0.04) 50%, transparent 75%)',
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

export function FloatingCard({ children, className = '', delay = 0 }: {
  children: ReactNode; className?: string; delay?: number
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
    >
      {children}
    </motion.div>
  )
}

export function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {target.toLocaleString('fr-FR')}{suffix}
      </motion.span>
    </motion.span>
  )
}
