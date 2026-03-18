'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'framer-motion'
import { 
  Loader2, 
  Film, 
  ArrowLeft, 
  PlusCircle, 
  MapPin, 
  Users, 
  Calendar, 
  AlertTriangle 
} from 'lucide-react'
import Link from 'next/link'
import { WILAYAS, PROJECT_TYPES } from '@/lib/constants'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'


export default function PostCastingPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    project_type: '',
    gender_pref: 'any',
    age_min: 18,
    age_max: 60,
  })

  const [status, setStatus] = useState<{ is_active: boolean; reason: string; role: string; subtype: string; access_type?: string } | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    checkStatus()
    // Check for duplicate param
    const dup = new URLSearchParams(window.location.search).get('duplicate')
    if (dup) {
      loadDuplicate(dup)
    }
  }, [])

  async function loadDuplicate(castingId: string) {
    const { data } = await supabase.from('castings').select('*').eq('id', castingId).single()
    if (data) {
      setFormData({
        title: `${data.title} (Copie)`,
        description: data.description || '',
        city: data.city || '',
        project_type: data.project_type || '',
        gender_pref: data.gender_pref || 'any',
        age_min: data.age_min || 18,
        age_max: data.age_max || 60,
      })
      toast.info('Casting dupliqué — modifiez les champs puis publiez.')
    }
  }

  async function checkStatus() {
    setChecking(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Call the RPC function we created just to get subtype
    const { data: statusData } = await supabase.rpc('check_recruiter_active', { p_user_id: user.id })
    const { data: profile } = await supabase.from('profiles').select('role, recruiter_subtype').eq('id', user.id).single()
    
    setStatus({ role: profile?.role, subtype: profile?.recruiter_subtype, is_active: statusData?.[0]?.is_active || false, reason: '', access_type: statusData?.[0]?.access_type })
    setChecking(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      // Insert as draft. No expiry date set yet.
      const { error } = await supabase.from('castings').insert({
          recruiter_id: user.id,
          ...formData,
          status: 'draft'
      })
      
      if (error) throw error

      toast.success('Brouillon enregistré ! Allez dans le tableau de bord pour publier.')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    )
  }

  // Remove restricting view block so anyone can save as draft

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
            <Link href="/dashboard">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary p-0">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Retour au Dashboard
                </Button>
            </Link>
            <div className="text-2xl font-bold tracking-tighter text-primary flex items-center gap-2">
                <Film className="w-6 h-6" />
                <span>CastingConnect<span className="text-foreground">DZ</span></span>
            </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="rounded-[2rem] border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl overflow-hidden">
            <CardHeader className="p-10 pb-4">
               <div className="flex items-center gap-3 text-primary mb-2">
                 <PlusCircle className="w-6 h-6" />
                 <span className="text-xs font-black uppercase tracking-[0.2em]">Studio Recruteur</span>
               </div>
               <CardTitle className="text-4xl font-bold">Publier un <span className="text-primary italic">Casting</span></CardTitle>
               <CardDescription className="text-lg">Créez une annonce pour trouver les meilleurs talents pour votre projet.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="p-10 space-y-8">
                <div className="grid gap-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Film className="w-4 h-4" /> Titre du Casting
                  </Label>
                  <Input 
                    placeholder="ex: Acteur Principal pour Long-Métrage 'Le Rêve du Sahara'" 
                    required 
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="rounded-xl h-14 bg-background border-border text-lg focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Lieu du Tournage
                    </Label>
                    <Select value={formData.city} onValueChange={v => setFormData({ ...formData, city: v })}>
                      <SelectTrigger className="rounded-xl h-14 bg-background border-border text-lg">
                        <SelectValue placeholder="Sélectionnez une ville" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl max-h-80">
                      {WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                    </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <PlusCircle className="w-4 h-4" /> Type de Projet
                    </Label>
                    <Select value={formData.project_type} onValueChange={v => setFormData({ ...formData, project_type: v })}>
                      <SelectTrigger className="rounded-xl h-14 bg-background border-border text-lg">
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border">
                        {PROJECT_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" /> Sexe du Rôle
                    </Label>
                    <Select value={formData.gender_pref} onValueChange={v => setFormData({ ...formData, gender_pref: v })}>
                      <SelectTrigger className="rounded-xl h-14 bg-background border-border text-lg">
                        <SelectValue placeholder="Peu importe" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border">
                        <SelectItem value="male">Homme</SelectItem>
                        <SelectItem value="female">Femme</SelectItem>
                        <SelectItem value="any">Peu importe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Âge Min</Label>
                    <Input type="number" value={formData.age_min} onChange={e => setFormData({ ...formData, age_min: parseInt(e.target.value) })} className="rounded-xl h-14 bg-background border-border text-lg" />
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Âge Max</Label>
                    <Input type="number" value={formData.age_max} onChange={e => setFormData({ ...formData, age_max: parseInt(e.target.value) })} className="rounded-xl h-14 bg-background border-border text-lg" />
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Description du Projet & Exigences</Label>
                  <Textarea 
                    placeholder="Décrivez le rôle, l'histoire et ce que vous recherchez chez l'artiste..." 
                    required 
                    className="rounded-2xl min-h-[150px] p-6 bg-background border-border text-lg focus:ring-primary/20 outline-none w-full resize-none transition-all"
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                 <div className="grid gap-3">
                   <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                     <Calendar className="w-4 h-4" /> Durée de publication
                   </Label>
                   <div className="h-14 px-4 flex items-center bg-muted/20 border border-border rounded-xl text-muted-foreground italic">
                     {status?.subtype === 'freelance' ? 'Paiement requis à la publication (1 crédit)' : 'Actif tant que votre abonnement est valide'}
                   </div>
                </div>
              </CardContent>
               <CardFooter className="p-10 border-t border-border/40 bg-muted/20 flex justify-end">
                <Button type="submit" className="rounded-2xl bg-amber-500 text-black h-16 px-12 font-bold text-xl shadow-[0_4px_30px_rgba(251,191,36,0.3)] hover:opacity-90 transition-all" disabled={loading}>
                  {loading ? 'Enregistrement...' : 'Enregistrer le Brouillon'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
