'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  MapPin, 
  User, 
  Star, 
  Languages, 
  ArrowLeft,
  Loader2,
  Phone,
  Mail,
  Film,
  MessageSquare,
  Instagram,
  Clapperboard,
  Video
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { toggleShortlist, updateShortlistNotes } from '@/app/actions/shortlist'
import { Textarea } from '@/components/ui/textarea'

export default function TalentProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [talent, setTalent] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isShortlisted, setIsShortlisted] = useState(false)
  const [notes, setNotes] = useState('')
  const [notesSaving, setNotesSaving] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchTalentData()
  }, [id])

  async function fetchTalentData() {
    setLoading(true)
    
    // 1. Get talent profile
    const { data: talentData, error: talentError } = await supabase
      .from('talent_profiles')
      .select('*, profiles(email)')
      .eq('id', id)
      .single()

    if (talentError) {
      console.error('Error fetching talent:', talentError)
      setLoading(false)
      return
    }
    setTalent(talentData)

    // 2. Get talent videos
    const { data: videoData } = await supabase
      .from('talent_videos')
      .select('*')
      .eq('talent_profile_id', id)
      .order('position', { ascending: true })
    
    setVideos(videoData || [])

    // 3. Check shortlist status & notes
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: shortlistData } = await supabase
        .from('shortlists')
        .select('*')
        .eq('recruiter_id', user.id)
        .eq('talent_id', id)
        .single()
      
      if (shortlistData) {
        setIsShortlisted(true)
        setNotes(shortlistData.notes || '')
      }
    }

    setLoading(false)
  }

  const handleToggleShortlist = async () => {
    try {
      const res = await toggleShortlist(id)
      setIsShortlisted(res.status === 'added')
      toast.success(res.status === 'added' ? 'Talent ajouté aux favoris' : 'Retiré des favoris')
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des favoris')
    }
  }

  const handleSaveNotes = async () => {
    setNotesSaving(true)
    try {
      await updateShortlistNotes(id, notes)
      toast.success('Notes enregistrées')
    } catch (error) {
      toast.error('Erreur lors de l\'enregistrement des notes')
    }
    setNotesSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    )
  }

  if (!talent) {
    return (
      <div className="min-h-screen bg-black text-white p-12 text-center">
        <h1 className="text-2xl font-bold">Profil non trouvé</h1>
        <Button asChild variant="link" className="text-amber-500 mt-4">
          <Link href="/talents">Retour à la recherche</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 pb-24">
      <div className="max-w-6xl mx-auto">
        <Button asChild variant="ghost" className="text-slate-400 hover:text-white mb-8 group">
          <Link href="/talents">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Retour à la recherche
          </Link>
        </Button>

        {/* Profile Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-4">
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative aspect-[3/4] rounded-3xl overflow-hidden border-2 border-slate-800 shadow-2xl shadow-amber-500/5 group"
             >
               {talent.main_photo_url ? (
                 <img src={talent.main_photo_url} alt={talent.full_name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700">
                    <User className="w-24 h-24" />
                 </div>
               )}
               <Button 
                 onClick={handleToggleShortlist}
                 className={`absolute top-6 right-6 w-14 h-14 rounded-2xl backdrop-blur-md border border-white/10 flex items-center justify-center transition-all ${
                    isShortlisted ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : 'bg-black/40 text-white hover:bg-white/20'
                 }`}
               >
                 <Star className={`w-6 h-6 ${isShortlisted ? 'fill-black' : ''}`} />
               </Button>
             </motion.div>
          </div>

          <div className="lg:col-span-8 flex flex-col justify-center">
             <div className="flex flex-wrap gap-2 mb-4">
                {talent.categories?.map((c: string) => (
                  <Badge key={c} className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs px-3 py-1">
                    {c}
                  </Badge>
                ))}
             </div>
             <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">
               {talent.full_name}
             </h1>
             <div className="flex flex-wrap gap-6 text-slate-400 text-lg mb-8 italic">
               <span className="flex items-center gap-2">
                 <MapPin className="w-5 h-5 text-amber-500" /> {talent.city}
               </span>
               <span className="flex items-center gap-2">
                 <User className="w-5 h-5 text-amber-500" /> {talent.age_play_min} - {talent.age_play_max} ans
               </span>
               <span className="flex items-center gap-2">
                 <Languages className="w-5 h-5 text-amber-500" /> {talent.languages?.join(', ')}
               </span>
             </div>

             <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 mb-8 backdrop-blur-sm">
                <p className="text-slate-300 leading-relaxed italic text-lg whitespace-pre-wrap">
                  "{talent.bio || 'Aucune biographie renseignée.'}"
                </p>
             </div>

             <div className="flex flex-wrap gap-4">
               <Button className="bg-amber-500 text-black hover:bg-amber-400 font-bold px-8 h-14 rounded-xl shadow-lg shadow-amber-500/10">
                 <Mail className="w-5 h-5 mr-2" /> Contacter
               </Button>
               <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-white/5 h-14 rounded-xl px-8">
                 <Instagram className="w-5 h-5 mr-2" /> Réseaux Sociaux
               </Button>
             </div>
          </div>
        </div>

        {/* Content Tabs/Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2 space-y-12">
              <section>
                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                   <Clapperboard className="w-6 h-6 text-amber-500" /> Vidéos & Showreel
                 </h2>
                 {videos.length > 0 ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {videos.map((video) => (
                        <div key={video.id} className="aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative group">
                           <div className="w-full h-full flex items-center justify-center">
                              <Video className="w-12 h-12 text-slate-700" />
                           </div>
                           <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black to-transparent">
                              <p className="text-sm font-bold text-white uppercase tracking-wider">{video.title || video.type}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                 ) : (
                   <div className="py-12 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500">
                      <Film className="w-8 h-8 mb-2 opacity-20" />
                      <p>Aucune vidéo disponible.</p>
                   </div>
                 )}
              </section>

              <section>
                 <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                   <Film className="w-6 h-6 text-amber-500" /> Galerie Photos
                 </h2>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {talent.gallery_photo_urls?.map((url: string, i: number) => (
                      <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-800 group">
                         <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    ))}
                    {(!talent.gallery_photo_urls || talent.gallery_photo_urls.length === 0) && (
                      <div className="col-span-full py-12 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500">
                        <User className="w-8 h-8 mb-2 opacity-20" />
                        <p>Aucune photo dans la galerie.</p>
                      </div>
                    )}
                 </div>
              </section>
           </div>

           <aside className="space-y-6">
              {isShortlisted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-8"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-500" /> Notes Internes
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 uppercase font-bold tracking-widest">
                    Visible uniquement par votre équipe
                  </p>
                  <Textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Excellent profil pour le projet 'Sahara', à recontacter fin mars..."
                    className="bg-black/50 border-slate-800 rounded-xl min-h-[150px] mb-4 focus:ring-amber-500"
                  />
                  <Button 
                    onClick={handleSaveNotes} 
                    disabled={notesSaving}
                    className="w-full bg-amber-500 text-black hover:bg-amber-400 font-bold rounded-xl"
                  >
                    {notesSaving ? 'Enregistrement...' : 'Enregistrer les Notes'}
                  </Button>
                </motion.div>
              )}

              <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
                 <h3 className="font-bold mb-6 text-xl">Information Candidat</h3>
                 <div className="space-y-6">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-500 flex items-center gap-2"><MapPin className="w-4 h-4" /> Ville de résidence</span>
                       <span className="text-white font-bold">{talent.city}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-500 flex items-center gap-2"><User className="w-4 h-4" /> Âge de jeu</span>
                       <span className="text-white font-bold">{talent.age_play_min}-{talent.age_play_max} ans</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-slate-500 flex items-center gap-2"><Languages className="w-4 h-4" /> Langues</span>
                       <span className="text-white font-bold text-right">{talent.languages?.join(', ')}</span>
                    </div>
                 </div>
              </div>

              <div className="p-8 border border-slate-800 rounded-3xl bg-slate-900/20 text-center">
                 <p className="text-sm text-slate-500 italic">
                   Membre depuis {new Date(talent.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                 </p>
              </div>
           </aside>
        </div>
      </div>
    </div>
  )
}
