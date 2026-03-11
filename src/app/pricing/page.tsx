'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles, Film, Building2, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { initiatePayment } from '@/app/actions/payments'
import { toast } from 'sonner'

const plans = [
  {
    id: 'freelance',
    name: 'Casting Express',
    description: 'Perfect for one-off projects.',
    price: '2,500',
    unit: 'per projet',
    icon: Zap,
    features: [
      '1 Casting actif',
      'Visible pendant 10 jours',
      'Candidatures illimitées',
      'Support standard',
    ],
    color: 'from-blue-500 to-cyan-500',
    buttonText: 'Commencer',
    popular: false,
  },
  {
    id: 'agency_6m',
    name: 'Agence Pro',
    description: 'Full database access for 6 months.',
    price: '15,000',
    unit: '6 mois',
    icon: Film,
    features: [
      'Castings illimités',
      'Accès base Talents complète',
      'Matching avancé',
      'Support prioritaire',
    ],
    color: 'from-amber-400 to-orange-600',
    buttonText: 'S\'abonner',
    popular: true,
  },
  {
    id: 'agency_12m',
    name: 'Studio Elite',
    description: 'The best value for power recruiters.',
    price: '25,000',
    unit: '12 mois',
    icon: Building2,
    features: [
      'Tout le plan Pro',
      'Priorité dans les résultats',
      'Badge "Agence Partenaire"',
      'Account Manager dédié',
    ],
    color: 'from-purple-500 to-indigo-600',
    buttonText: 'Obtenir Elite',
    popular: false,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (planId: string) => {
    setLoading(planId)
    try {
      const result = await initiatePayment(planId as any)
      if (result?.error) {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error('Une erreur est survenue.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Choisissez votre plan
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Propulsez vos castings avec les outils professionnels de CastingConnect DZ.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`relative h-full bg-slate-900/50 border-slate-800 backdrop-blur-xl hover:border-amber-500/50 transition-all duration-300 group ${plan.popular ? 'ring-2 ring-amber-500 shadow-2xl shadow-amber-500/10' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-black px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Plus Populaire
                  </div>
                )}
                
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-lg shadow-black/20`}>
                    <plan.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-slate-400">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400 font-medium">DZD</span>
                    <span className="text-slate-500 text-sm ml-1">/ {plan.unit}</span>
                  </div>

                  <ul className="space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-slate-300">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <Check className="w-3 h-3 text-amber-500" />
                        </div>
                        <span className="text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="mt-8">
                  <Button
                    className={`w-full py-6 text-lg font-bold rounded-xl transition-all duration-300 shadow-lg ${
                      plan.popular 
                        ? 'bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20' 
                        : 'bg-white/10 text-white hover:bg-white/20 border-white/5'
                    }`}
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading !== null}
                  >
                    {loading === plan.id ? 'Traitement...' : plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-slate-500 text-sm">
            Paiement sécurisé via SATIM / CIB / Edahabia par <strong>Chargily</strong>.
            <br />
            Aucune coordonnée bancaire n'est stockée sur nos serveurs.
          </p>
        </div>
      </div>
    </div>
  )
}
