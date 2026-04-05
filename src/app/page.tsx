'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Users, Video, Film, Camera, Sparkles, CheckCircle2, PlayCircle, Trophy, TrendingUp, Search } from 'lucide-react'

export default function LandingPage() {
  const [isSearching, setIsSearching] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsSearching(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Navigation */}
      <nav className="border-b border-border/40 px-6 py-5 flex justify-between items-center max-w-7xl mx-auto sticky top-0 z-50 bg-background/60 backdrop-blur-xl">
        <div className="text-2xl font-black tracking-tighter flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-primary-foreground" />
          </div>
          <span>Casting<span className="text-primary">Connect</span></span>
        </div>
        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
            Connexion
          </Link>
          <Link href="/signup">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-full h-11 px-6 transition-all shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)]">
              Rejoindre
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none dark:opacity-100 opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen pointer-events-none dark:opacity-100 opacity-50" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 bg-background border border-border/50 rounded-full px-5 py-2 text-sm font-medium text-foreground mb-8 backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent font-bold">
              Révolutionnez vos Castings
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
            className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter mb-8 leading-[1.05]"
          >
            Le Talent Rencontre <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-400 to-yellow-500">L'Opportunité.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl sm:text-2xl text-muted-foreground mb-12 max-w-3xl leading-relaxed font-light"
          >
            La plateforme n°1 en Algérie qui connecte instantanément les talents d'exception avec les meilleures maisons de production.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
          >
            <Link href="/signup?role=talent">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-16 px-8 text-lg font-bold w-full sm:w-auto shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] group transition-all duration-300">
                Je suis un Talent <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/signup?role=recruiter">
              <Button variant="outline" size="lg" className="bg-background/50 backdrop-blur-md rounded-full h-16 px-8 text-lg font-bold w-full sm:w-auto border-border hover:bg-muted text-foreground transition-all duration-300 group">
                Je Recrute <Search className="ml-2 w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust & Stats Strip */}
      <section className="border-y border-border/40 bg-card/30 backdrop-blur-md py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/50">
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-4xl md:text-5xl font-black text-foreground">5 000+</div>
            <div className="text-xs md:text-sm text-primary uppercase tracking-widest font-bold">Talents Inscrits</div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 pl-8">
            <div className="text-4xl md:text-5xl font-black text-foreground">250+</div>
            <div className="text-xs md:text-sm text-primary uppercase tracking-widest font-bold">Maisons de Prod</div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 pl-8">
            <div className="text-4xl md:text-5xl font-black text-foreground">1 200+</div>
            <div className="text-xs md:text-sm text-primary uppercase tracking-widest font-bold">Matchs Réussis</div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 pl-8">
            <div className="text-4xl md:text-5xl font-black text-foreground">0</div>
            <div className="text-xs md:text-sm text-primary uppercase tracking-widest font-bold">Frais Cachés</div>
          </div>
        </div>
      </section>

      {/* Value Prop: Recruiters */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 text-primary text-sm font-bold tracking-wide">
              <Camera className="w-4 h-4" /> Pour les Recruteurs
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight text-foreground">
              Le casting, réinventé pour la <span className="text-primary italic">performance.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Fini les boîtes mails saturées et les fichiers Excel interminables. Notre algorithme et nos filtres avancés vous permettent de trouver le profil parfait en quelques clics.
            </p>
            <ul className="space-y-5">
              {[
                "Recherche ultra-précise (Mensurations, Langues, Compétences)",
                "Gestion de vos offres de casting centralisée",
                "Accès direct aux Showreels et portfolios vidéo"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <span className="text-foreground/90 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup?role=recruiter" className="inline-block pt-4">
              <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full h-14 px-8 text-lg font-bold transition-all shadow-lg">
                Publier un Casting
              </Button>
            </Link>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 rounded-[2rem] blur-2xl" />
            <div className="relative bg-card border border-border/50 rounded-[2rem] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Recherche Avancée</h4>
                    <p className="text-xs text-muted-foreground">Filtre appliqué: "Bilingue, Homme, 25-30 ans"</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {isSearching ? (
                  [1, 2, 3].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-lg bg-muted-foreground/20 animate-pulse" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted-foreground/30 rounded w-1/3" />
                        <div className="h-3 bg-muted-foreground/20 rounded w-1/4" />
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-full">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  [
                    { name: 'Yanis M.', type: 'Comédien', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150' },
                    { name: 'Sarah B.', type: 'Mannequin', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150' },
                    { name: 'Rayan A.', type: 'Figurant', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150' }
                  ].map((talent, i) => (
                    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 border border-border/50 hover:bg-muted transition-colors cursor-pointer group">
                      <img src={talent.img} alt={talent.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <div className="font-bold text-sm text-foreground">{talent.name}</div>
                        <div className="text-xs text-muted-foreground tracking-wide uppercase">{talent.type}</div>
                      </div>
                      <Button variant="ghost" size="icon" className="shrink-0 text-primary hover:text-primary/80 hover:bg-primary/10 rounded-full">
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Prop: Talents */}
      <section className="py-32 px-6 relative bg-gradient-to-b from-transparent to-muted/20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 bg-purple-500/10 rounded-[2rem] blur-2xl" />
            <div className="relative bg-black border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="aspect-[4/5] bg-gray-900 relative">
                <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800" alt="Amine K." className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">PREMIUM</span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2">Amine K.</h3>
                  <p className="text-white/80 font-medium">Acteur, Modèle • Alger</p>
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 rounded-full px-4 py-2 text-purple-600 dark:text-purple-400 text-sm font-bold tracking-wide">
              <Star className="w-4 h-4" /> Pour les Talents
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight text-foreground">
              Prenez le contrôle de votre <span className="text-purple-600 dark:text-purple-400 italic">carrière.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Créez un portfolio qui marque les esprits. Mettez en valeur vos showreels, postulez aux castings exclusifs et faites-vous repérer par les grandes productions.
            </p>
            <ul className="space-y-5">
              {[
                "Portfolio professionnel (Vidéos, Photos, Compétences)",
                "Candidatures en 1 clic aux castings",
                "Visibilité accrue avec notre algorithme de recommandation"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                  <span className="text-foreground/90 font-medium">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup?role=talent" className="inline-block pt-4">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full h-14 px-8 text-lg font-bold transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                Créer mon Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 text-foreground">
            Prêt à passer <br/> <span className="text-primary">à l'action ?</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Rejoignez des milliers de talents et de recruteurs qui ont déjà transformé leur façon de travailler.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-16 w-full sm:w-80 text-xl font-black shadow-[0_0_40px_rgba(251,191,36,0.4)] hover:shadow-[0_0_60px_rgba(251,191,36,0.6)] transition-all group">
              Commencer Maintenant <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer minimaliste premium */}
      <footer className="border-t border-border/40 bg-background py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            <span>CastingConnect</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-primary transition-colors">CGV</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} CastingConnect DZ.
          </div>
        </div>
      </footer>
    </div>
  )
}
