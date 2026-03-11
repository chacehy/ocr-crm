'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Film, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden text-foreground">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-48" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10 text-center"
      >
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-primary rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(251,191,36,0.4)] relative">
             <CheckCircle2 className="w-12 h-12 text-primary-foreground" />
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border-2 border-dashed border-primary-foreground/30 rounded-[2rem]"
             />
          </div>
        </div>

        <h1 className="text-4xl font-bold tracking-tight mb-4">Paiement Réussi !</h1>
        <p className="text-xl text-muted-foreground mb-10">
          Votre compte a été mis à jour avec succès. Vos privilèges sont désormais actifs.
        </p>

        <div className="space-y-4">
           <Link href="/dashboard" className="w-full block">
            <Button className="w-full rounded-2xl bg-primary text-black h-16 text-xl font-bold shadow-lg hover:opacity-90 transition-all">
              Aller au Dashboard <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            Redirection automatique dans <span className="text-primary font-bold">{countdown}</span> secondes...
          </p>
        </div>

        <div className="mt-16 flex items-center justify-center gap-2 text-primary">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-widest">CastingConnect DZ Spotlight</span>
        </div>
      </motion.div>
    </div>
  )
}
