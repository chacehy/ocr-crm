'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Users, Video, Film, Camera, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation */}
      <nav className="border-b border-border/40 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto backdrop-blur-md sticky top-0 z-50">
        <div className="text-2xl font-bold tracking-tighter text-primary flex items-center gap-2">
          <Film className="w-6 h-6" />
          <span>CastingConnect<span className="text-foreground">DZ</span></span>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-medium hover:text-primary transition-colors">Connexion</Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-primary text-primary-foreground hover:opacity-90 rounded-lg h-10 px-6 transition-all shadow-[0_0_15px_rgba(251,191,36,0.2)]">Rejoindre</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-24 sm:py-36 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-8"
          >
            <Sparkles className="w-4 h-4 fill-primary" />
            <span>Le Premier Réseau de l'Entertainment en Algérie</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-8xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            Entrez dans la <br /> <span className="text-primary italic">Lumière</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed"
          >
            La plateforme premium connectant acteurs, mannequins et danseurs avec les meilleures maisons de production. Votre voyage vers l'écran commence ici.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto"
          >
            <Link href="/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90 rounded-xl h-16 px-10 text-xl font-bold w-full sm:w-72 shadow-[0_0_30px_rgba(251,191,36,0.3)] group transition-all">
                Créer mon Profil <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/talents">
              <Button variant="outline" size="lg" className="rounded-xl h-16 px-10 text-xl font-medium w-full sm:w-64 border-border hover:bg-muted transition-colors">
                Trouver des Talents
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats/Logo Section */}
      <section className="border-y border-border/40 bg-card py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-1">5k+</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Talents</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-1">200+</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Productions</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-1">1k+</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Succès</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-1">24/7</div>
            <div className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Support</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
          <div className="group space-y-6 p-8 rounded-2xl bg-card border border-border/40 hover:border-primary/40 transition-all">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.2)] group-hover:scale-110 transition-transform">
              <Users className="text-primary-foreground w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Vivier de Talents Premium</h3>
            <p className="text-muted-foreground leading-relaxed">Accédez à une base de données rigoureusement sélectionnée des meilleurs professionnels créatifs d'Algérie.</p>
          </div>
          <div className="group space-y-6 p-8 rounded-2xl bg-card border border-border/40 hover:border-primary/40 transition-all">
            <div className="w-14 h-14 bg-foreground rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video className="text-background w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Showreels Digitaux</h3>
            <p className="text-muted-foreground leading-relaxed">Montrez l'étendue de votre talent avec des liens vidéo intégrés et des galeries photos professionnelles.</p>
          </div>
          <div className="group space-y-6 p-8 rounded-2xl bg-card border border-border/40 hover:border-primary/40 transition-all">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
              <Camera className="text-primary w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Casting Intelligent</h3>
            <p className="text-muted-foreground leading-relaxed">Filtrez par ville, âge et compétences avec notre moteur de recherche adapté au marché algérien.</p>
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-border/40 text-center">
        <div className="text-2xl font-bold tracking-tighter text-primary mb-6 flex justify-center items-center gap-2">
          <Film className="w-6 h-6" />
          <span>CastingConnect<span className="text-foreground">DZ</span></span>
        </div>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8">Élever les standards du casting et de la gestion de production en Algérie.</p>
        <div className="text-slate-600 text-xs tracking-widest uppercase">
          &copy; 2026 CastingConnect DZ. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}
