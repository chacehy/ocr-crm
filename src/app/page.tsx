'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Star, Users, Film, Camera, Sparkles, CheckCircle2, Trophy, TrendingUp, Zap, Eye, Heart, Shield, MessageCircle } from 'lucide-react'
import { ScrollReveal, Spotlight, FloatingCard, HeroSpotlights } from '@/components/landing/ScrollReveal'

const stepsData = [
  { icon: Camera, title: 'Créez votre Profil', desc: 'Photos, vidéos, mensurations, compétences — tout en un seul endroit.' },
  { icon: Eye, title: 'Soyez Visible', desc: 'Notre algorithme vous met en avant auprès des recruteurs qui cherchent votre profil.' },
  { icon: MessageCircle, title: 'Recevez des Offres', desc: 'Les productions vous contactent directement. Postulez en 1 clic.' },
  { icon: Trophy, title: 'Décrochez le Rôle', desc: 'Passez du casting au tournage. Votre carrière décolle ici.' },
]

const testimonialsData = [
  { name: 'Yasmine B.', role: 'Comédienne', text: "En 2 semaines j'ai reçu 3 propositions de casting. CastingConnect a changé ma carrière.", avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150&h=150' },
  { name: 'Karim D.', role: 'Mannequin', text: "Je n'avais aucun réseau dans le milieu. Aujourd'hui je travaille avec les plus grandes agences d'Alger.", avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150' },
  { name: 'Lina M.', role: 'Figurante → Actrice', text: "J'ai commencé comme figurante et grâce à la visibilité sur la plateforme, j'ai décroché mon premier rôle principal.", avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150' },
]

const benefitsData = [
  { icon: Zap, title: '100% Gratuit', desc: "Créez votre portfolio et postulez aux castings sans rien payer. Zéro frais cachés." },
  { icon: Shield, title: 'Profil Vérifié', desc: "Un badge de confiance qui rassure les recruteurs et vous distingue des autres." },
  { icon: TrendingUp, title: 'Visibilité Boostée', desc: "Notre algorithme recommande votre profil aux recruteurs qui matchent vos compétences." },
  { icon: Heart, title: 'Communauté', desc: "Rejoignez des milliers de talents algériens ambitieux qui partagent votre passion." },
]

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Film className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>Casting<span className="text-primary">Connect</span></span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/login" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Connexion</Link>
            <Link href="/signup?role=talent">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-full h-11 px-6 shadow-[0_0_24px_rgba(251,191,36,0.25)] hover:shadow-[0_0_40px_rgba(251,191,36,0.45)] transition-all">
                Rejoindre gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-20 overflow-hidden">
        {/* Parallax bg layers */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[130px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/8 rounded-full blur-[200px]" />
        </motion.div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />
        {/* Stage spotlight beams from top */}
        <HeroSpotlights />

        <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 text-sm font-bold mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">La plateforme n°1 des talents en Algérie</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-7xl md:text-[5.5rem] font-black tracking-tighter mb-8 leading-[1.05]">
            Votre Talent Mérite<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-400 to-yellow-500">d&#39;Être Vu.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
            className="text-lg sm:text-xl text-muted-foreground mb-14 max-w-2xl leading-relaxed">
            Créez votre portfolio professionnel, soyez repéré par les meilleures maisons de production et décrochez vos prochains castings — <strong className="text-foreground">100% gratuitement.</strong>
          </motion.p>

          {/* ★ SPOTLIGHT CTA ★ */}
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
            <Spotlight className="rounded-full">
              <Link href="/signup?role=talent">
                <Button size="lg" className="relative bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-16 sm:h-[4.5rem] px-10 sm:px-14 text-lg sm:text-xl font-black shadow-[0_0_60px_rgba(251,191,36,0.35)] hover:shadow-[0_0_80px_rgba(251,191,36,0.55)] group transition-all duration-300">
                  Créer Mon Portfolio Gratuit
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </Spotlight>
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="mt-6 text-sm text-muted-foreground">
            Déjà <span className="text-primary font-bold">5 000+</span> talents inscrits • Aucune carte bancaire requise
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <motion.div className="w-1.5 h-1.5 rounded-full bg-primary"
              animate={{ opacity: [1, 0.3, 1], y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ STATS STRIP ═══ */}
      <section className="relative z-10 border-y border-white/5 bg-card/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { val: '5 000+', label: 'Talents Inscrits' },
            { val: '250+', label: 'Productions Partenaires' },
            { val: '1 200+', label: 'Castings Réussis' },
            { val: '0 DA', label: 'Frais pour les Talents' },
          ].map((s, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="text-4xl md:text-5xl font-black text-foreground">{s.val}</div>
              <div className="text-xs md:text-sm text-primary uppercase tracking-[0.2em] font-bold mt-2">{s.label}</div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-28 sm:py-36 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[160px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-primary text-sm font-bold mb-6">
              <Zap className="w-4 h-4" /> Simple & Rapide
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Comment ça <span className="text-primary">marche ?</span>
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepsData.map((step, i) => (
              <FloatingCard key={i} delay={i * 0.12}
                className="relative bg-card/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 group hover:border-primary/30 transition-all duration-500">
                <div className="absolute top-4 right-4 text-6xl font-black text-white/[0.03] select-none">{i + 1}</div>
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                {i < 3 && <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[2px] bg-primary/30" />}
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS ═══ */}
      <section className="py-28 sm:py-36 px-6 relative bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 text-purple-400 text-sm font-bold mb-6">
              <Star className="w-4 h-4" /> Avantages Exclusifs
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Pourquoi rejoindre <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">CastingConnect ?</span>
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefitsData.map((b, i) => (
              <FloatingCard key={i} delay={i * 0.1}
                className="bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 group hover:border-primary/20 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-all duration-700 pointer-events-none" />
                <div className="flex items-start gap-5 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-all">
                    <b.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{b.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TALENT SHOWCASE ═══ */}
      <section className="py-28 sm:py-36 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-primary/15 to-purple-500/10 rounded-[2.5rem] blur-3xl" />
              <div className="relative bg-black border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="aspect-[3/4] relative">
                  <img src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=800" alt="Talent" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                      className="inline-flex items-center gap-2 bg-primary text-black text-xs font-bold px-3 py-1.5 rounded-full mb-3">
                      <Sparkles className="w-3 h-3" /> PROFIL VÉRIFIÉ
                    </motion.div>
                    <h3 className="text-3xl font-black text-white mb-1">Amira K.</h3>
                    <p className="text-white/70 font-medium">Actrice, Modèle • Alger</p>
                    <div className="flex gap-2 mt-4">
                      {['Cinéma', 'Publicité', 'Théâtre'].map(t => (
                        <span key={t} className="text-xs bg-white/10 backdrop-blur-md text-white/80 px-3 py-1 rounded-full">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating notification */}
              <motion.div
                initial={{ opacity: 0, x: 40, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -right-4 top-1/4 bg-card/90 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 shadow-2xl max-w-[220px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Nouvelle Offre !</p>
                    <p className="text-[10px] text-muted-foreground">Production XYZ vous a contacté</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 text-purple-400 text-sm font-bold">
              <Star className="w-4 h-4" /> Votre Vitrine Pro
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              Un portfolio qui fait la <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 italic">différence.</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Mettez en valeur vos photos, showreels et compétences dans un profil professionnel qui attire l&#39;attention des recruteurs.
            </p>
            <ul className="space-y-5">
              {[
                'Portfolio multimédia (Photos, Vidéos, Showreels)',
                'Mensurations, langues et compétences détaillées',
                'Candidatures en 1 clic aux castings',
                'Notifications en temps réel des offres',
              ].map((item, i) => (
                <ScrollReveal key={i} delay={0.1 * i}>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground/90 font-medium">{item}</span>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
            <Link href="/signup?role=talent" className="inline-block pt-2">
              <Button className="bg-gradient-to-r from-primary to-amber-500 hover:from-primary/90 hover:to-amber-500/90 text-primary-foreground rounded-full h-14 px-8 text-lg font-bold shadow-[0_0_30px_rgba(251,191,36,0.3)] hover:shadow-[0_0_50px_rgba(251,191,36,0.5)] transition-all group">
                Commencer Maintenant <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="py-28 sm:py-36 px-6 relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/6 rounded-full blur-[180px] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <ScrollReveal className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-primary text-sm font-bold mb-6">
              <Users className="w-4 h-4" /> Témoignages
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Ils ont lancé leur <span className="text-primary">carrière</span> ici.
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonialsData.map((t, i) => (
              <FloatingCard key={i} delay={i * 0.12}
                className="bg-card/50 backdrop-blur-xl border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
                <div className="absolute top-4 right-6 text-5xl text-primary/10 font-serif select-none">&ldquo;</div>
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-primary/20" />
                  <div>
                    <h4 className="font-bold text-foreground">{t.name}</h4>
                    <p className="text-xs text-primary font-semibold uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex gap-1 mt-4">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="w-4 h-4 text-primary fill-primary" />)}
                </div>
              </FloatingCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="py-28 sm:py-36 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.04] to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/12 blur-[160px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-500/8 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              Prêt à briller <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-400 to-yellow-500">sous les projecteurs ?</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Rejoignez la communauté de talents qui fait bouger la scène algérienne. Inscription gratuite, résultats concrets.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <Spotlight className="inline-block rounded-full">
              <Link href="/signup?role=talent">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full h-16 sm:h-[4.5rem] w-full sm:w-auto px-12 text-xl font-black shadow-[0_0_60px_rgba(251,191,36,0.35)] hover:shadow-[0_0_90px_rgba(251,191,36,0.5)] transition-all group">
                  Créer Mon Portfolio Gratuit <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </Spotlight>
            <p className="mt-6 text-sm text-muted-foreground">Aucune carte bancaire requise • Prêt en 2 minutes</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/5 bg-card/30 backdrop-blur-xl py-14">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <Film className="w-5 h-5 text-primary" />
            <span>CastingConnect</span>
          </Link>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">Politique de confidentialité</Link>
            <Link href="#" className="hover:text-primary transition-colors">CGV</Link>
            <Link href="#" className="hover:text-primary transition-colors">Contact</Link>
          </div>
          <div className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} CastingConnect DZ.</div>
        </div>
      </footer>
    </div>
  )
}
