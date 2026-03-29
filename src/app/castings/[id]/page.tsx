'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  MapPin, 
  User, 
  Calendar, 
  Languages, 
  Tag, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  UserCircle,
  DollarSign,
  Star
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { redirect, useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function CastingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [casting, setCasting] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [hasApplied, setHasApplied] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isOwner, setIsOwner] = useState(false)
  const [talentSub, setTalentSub] = useState<any>(null)
  const [showSubModal, setShowSubModal] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    fetchCastingData()
  }, [id])

  async function fetchCastingData() {
    setLoading(true)
    
    // Get casting details
    const { data: castingData, error: castingError } = await supabase
      .from('castings')
      .select('*, recruiter_profiles(*)')
      .eq('id', id)
      .single()

    if (castingError) {
      console.error('Error fetching casting:', castingError)
      setLoading(false)
      return
    }
    setCasting(castingData)

    // Get current user and their talent profile
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user && user.id === castingData.recruiter_id) {
      setIsOwner(true)
    } else if (castingData.status === 'draft') {
      // Hide drafts from non-owners!
      setCasting(null)
      setLoading(false)
      return
    }

    if (user) {
      const { data: profileData } = await supabase
        .from('talent_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      setUserProfile(profileData)

      if (profileData) {
        // Check if already applied
        const { data: appData } = await supabase
          .from('applications')
          .select('id')
          .eq('casting_id', id)
          .eq('talent_id', profileData.id)
          .single()
        
        if (appData) setHasApplied(true)
      }

      // Check talent subscription
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .order('end_date', { ascending: false })
        .limit(1)
        .maybeSingle()
      
      setTalentSub(subData)
    }

    setLoading(false)
  }

  async function handleApply() {
    if (!userProfile) {
      toast.error("Veuillez d'abord compléter votre profil talent.")
      return
    }

    // Check talent subscription
    if (!talentSub) {
      setShowSubModal(true)
      return
    }

    // Check premium restriction
    if (casting.is_premium && talentSub.plan === 'talent_basic') {
      toast.error('Ce casting est réservé aux talents Premium et Pro. Mettez à jour votre abonnement.')
      setShowSubModal(true)
      return
    }

    setApplying(true)
    const { error } = await supabase
      .from('applications')
      .insert({
        casting_id: id,
        talent_id: userProfile.id,
        status: 'submitted'
      })

    if (error) {
      toast.error("Erreur lors de la candidature.")
      console.error(error)
    } else {
      toast.success("Candidature envoyée avec succès !")
      setHasApplied(true)
    }
    setApplying(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    )
  }

  if (!casting) {
    return (
      <div className="min-h-screen bg-black text-white p-12 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold">Casting non trouvé</h1>
        <Button asChild variant="link" className="text-amber-500 mt-4">
          <Link href="/castings">Retour aux castings</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="text-slate-400 hover:text-white mb-8 group">
          <Link href="/castings">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Retour aux castings
          </Link>
        </Button>

        <Dialog open={showSubModal} onOpenChange={setShowSubModal}>
          <DialogContent className="bg-slate-900 border-slate-800 text-white rounded-3xl p-8 max-w-md">
            <DialogHeader className="text-center mb-4">
              <div className="mx-auto w-16 h-16 bg-amber-500/10 flex items-center justify-center rounded-full mb-4">
                <Star className="w-8 h-8 text-amber-500" />
              </div>
              <DialogTitle className="text-2xl font-bold">Abonnement requis</DialogTitle>
              <DialogDescription className="text-slate-400 text-base mt-2">
                {casting?.is_premium && talentSub?.plan === 'talent_basic'
                  ? 'Ce casting est réservé aux talents Premium et Pro. Mettez à jour votre abonnement pour postuler.'
                  : 'Pour postuler aux castings, vous devez souscrire à un abonnement annuel.'
                }
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-col gap-3">
              <Button asChild className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl">
                <Link href="/talent-pricing">Voir les abonnements</Link>
              </Button>
              <Button onClick={() => setShowSubModal(false)} variant="ghost" className="w-full text-slate-400 hover:text-white rounded-xl">
                Annuler
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <div className="flex gap-2 mb-4">
               <Badge className="bg-amber-500 text-black font-bold">
                 {casting.project_type || 'Casting'}
               </Badge>
               {casting.is_premium && (
                 <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                   <Star className="w-3 h-3 mr-1" /> Premium
                 </Badge>
               )}
               {casting.status === 'draft' ? (
                 <Badge variant="outline" className="border-slate-500 text-slate-400">Brouillon</Badge>
               ) : (
                 <Badge variant="outline" className="border-slate-700 text-slate-400">
                   {casting.status === 'open' ? 'Actif' : 'Clôturé'}
                 </Badge>
               )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              {casting.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-amber-500" /> {casting.city}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-amber-500" /> Publié le {new Date(casting.created_at).toLocaleDateString()}
              </span>
              {casting.rate && (
                <span className="flex items-center gap-1 text-green-400 font-bold">
                  <DollarSign className="w-4 h-4" /> {casting.rate}
                </span>
              )}
            </div>

            {/* Recruiter info */}
            <Link href={`/recruiter/${casting.recruiter_id}`} className="mt-8 flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all w-fit group">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 flex-shrink-0 border-2 border-amber-500/20">
                {casting.recruiter_profiles?.photo_url ? (
                  <img src={casting.recruiter_profiles.photo_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <UserCircle className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Publié par</p>
                <p className="font-bold text-white group-hover:text-amber-500 transition-colors">
                  {casting.recruiter_profiles?.full_name || 'Recruteur'}
                </p>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full md:w-auto"
          >
            {isOwner ? (
              <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 text-center max-w-xs ml-auto">
                <UserCircle className="w-10 h-10 text-primary mx-auto mb-2" />
                <p className="text-white font-bold mb-4">C'est votre annonce</p>
                <Button asChild className="w-full bg-primary text-primary-foreground font-bold">
                  <Link href={`/dashboard/recruiter/castings/${casting.id}/applications`}>
                    Voir Candidatures
                  </Link>
                </Button>
              </div>
            ) : hasApplied ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <p className="text-green-500 font-bold">Candidature Envoyée</p>
                <p className="text-slate-400 text-xs mt-1">Status: En attente</p>
              </div>
            ) : (
              <Button 
                size="lg" 
                className="w-full md:w-64 bg-amber-500 text-black hover:bg-amber-400 font-bold py-8 text-xl rounded-2xl shadow-lg shadow-amber-500/10"
                onClick={handleApply}
                disabled={applying || casting.status !== 'open'}
              >
                {applying ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Postuler Maintenant'}
              </Button>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                Description du projet
              </h2>
              <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
                {casting.description}
              </p>
            </section>

            <section className="bg-slate-900/30 border border-slate-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">Profil recherché</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                     <User className="w-5 h-5 text-amber-500" />
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Âge</p>
                     <p className="text-white">{casting.age_min} - {casting.age_max} ans</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                     <Tag className="w-5 h-5 text-amber-500" />
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Genre</p>
                     <p className="text-white">{casting.gender_pref === 'any' ? 'Homme ou Femme' : casting.gender_pref === 'male' ? 'Homme' : 'Femme'}</p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                     <Languages className="w-5 h-5 text-amber-500" />
                   </div>
                   <div>
                     <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Langues</p>
                     <p className="text-white">{casting.languages_required?.join(', ') || 'Non spécifié'}</p>
                   </div>
                 </div>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold mb-4">Détails supplémentaires</h3>
              <div className="space-y-4">
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Ville</span>
                   <span className="text-white font-medium">{casting.city}</span>
                 </div>
                 {casting.rate && (
                   <div className="flex justify-between text-sm">
                     <span className="text-slate-500">Tarif</span>
                     <span className="text-green-400 font-bold">{casting.rate}</span>
                   </div>
                 )}
                 <div className="flex justify-between text-sm">
                   <span className="text-slate-500">Expire le</span>
                   <span className="text-white font-medium">{casting.expiry_date ? new Date(casting.expiry_date).toLocaleDateString() : 'Non spécifié'}</span>
                 </div>
              </div>
            </div>
            
            <div className="p-6 border border-amber-500/20 rounded-2xl bg-amber-500/5">
              <p className="text-sm text-slate-400 itali">
                "CastingConnect DZ vérifie l'authenticité de tous les recruteurs inscrits."
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
