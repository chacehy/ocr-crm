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

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const WILAYAS = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Sétif', 'Side Bel Abbès', 'Tlemcen', 'Béjaïa']
const PROJECT_TYPES = ['Film', 'Series', 'Commercial', 'Music Video', 'Theatre', 'Photoshoot']
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

  const [status, setStatus] = useState<{ is_active: boolean; reason: string; role: string; subtype: string } | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    setChecking(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Call the RPC function we created
    const { data: statusData, error } = await supabase.rpc('check_recruiter_active', { p_user_id: user.id })
    
    if (error) {
      console.error('Error checking status:', error)
      toast.error('Erreur lors de la vérification du compte.')
    } else {
      // Get role info to decide if we allow posting
      const { data: profile } = await supabase.from('profiles').select('role, recruiter_subtype').eq('id', user.id).single()
      
      const res = statusData[0]
      setStatus({ ...res, role: profile?.role, subtype: profile?.recruiter_subtype })

      if (!res.is_active) {
        toast.error(res.reason)
        // We allow them to SEE the page but they can't submit? 
        // Or better: redirect to pricing if not active.
        setTimeout(() => router.push('/pricing'), 2000)
      } else if (profile?.recruiter_subtype === 'freelance') {
        // Enforce 1 active casting for Freelance
        const { count } = await supabase
          .from('castings')
          .select('*', { count: 'exact', head: true })
          .eq('recruiter_id', user.id)
          .eq('status', 'open')
        
        if (count && count >= 1) {
          toast.error("Limite atteinte: Les freelances ne peuvent avoir qu'un seul casting actif.")
          setTimeout(() => router.push('/dashboard'), 2000)
        }
      }
    }
    setChecking(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      const { error } = await supabase.from('castings').insert({
        recruiter_id: user.id,
        ...formData
      })

      if (error) throw error

      toast.success('Casting call published successfully!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
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

  if (status && !status.is_active) {
    return (
      <div className="min-h-screen bg-black text-white p-12 flex flex-col items-center justify-center text-center">
        <AlertTriangle className="w-16 h-16 text-amber-500 mb-6" />
        <h1 className="text-3xl font-bold mb-4 italic">Accès Restreint</h1>
        <p className="text-slate-400 max-w-md mb-8">
          Vous devez avoir un pack "Casting Express" ou un abonnement actif pour publier un nouveau casting.
        </p>
        <Button asChild className="bg-amber-500 text-black px-8 py-6 rounded-xl font-bold">
          <Link href="/pricing">Voir les offres</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
            <Link href="/dashboard">
                <Button variant="ghost" className="text-muted-foreground hover:text-primary p-0">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Back to Dashboard
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
                 <span className="text-xs font-black uppercase tracking-[0.2em]">Recruiter Studio</span>
               </div>
               <CardTitle className="text-4xl font-bold">Post a New <span className="text-primary italic">Casting</span></CardTitle>
               <CardDescription className="text-lg">Publish a call for talents and start receiving applications.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="p-10 space-y-8">
                <div className="grid gap-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Film className="w-4 h-4" /> Casting Title
                  </Label>
                  <Input 
                    placeholder="e.g. Lead Actor for Feature Film 'The Sahara Dream'" 
                    required 
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="rounded-xl h-14 bg-background border-border text-lg focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Shooting Location
                    </Label>
                    <Select value={formData.city} onValueChange={v => setFormData({ ...formData, city: v })}>
                      <SelectTrigger className="rounded-xl h-14 bg-background border-border text-lg">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border">
                        {WILAYAS.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <PlusCircle className="w-4 h-4" /> Project Type
                    </Label>
                    <Select value={formData.project_type} onValueChange={v => setFormData({ ...formData, project_type: v })}>
                      <SelectTrigger className="rounded-xl h-14 bg-background border-border text-lg">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border">
                        {PROJECT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <Users className="w-4 h-4" /> Role Gender
                    </Label>
                    <Select value={formData.gender_pref} onValueChange={v => setFormData({ ...formData, gender_pref: v })}>
                      <SelectTrigger className="rounded-xl h-14 bg-background border-border text-lg">
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="any">Any</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Min Age</Label>
                    <Input type="number" value={formData.age_min} onChange={e => setFormData({ ...formData, age_min: parseInt(e.target.value) })} className="rounded-xl h-14 bg-background border-border text-lg" />
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Max Age</Label>
                    <Input type="number" value={formData.age_max} onChange={e => setFormData({ ...formData, age_max: parseInt(e.target.value) })} className="rounded-xl h-14 bg-background border-border text-lg" />
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Project Description & Requirements</Label>
                  <Textarea 
                    placeholder="Describe the role, the story, and what you are looking for in the artist..." 
                    required 
                    className="rounded-2xl min-h-[150px] p-6 bg-background border-border text-lg focus:ring-primary/20 outline-none w-full resize-none transition-all"
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="grid gap-3">
                   <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                     <Calendar className="w-4 h-4" /> Listing Visible For
                   </Label>
                   <div className="h-14 px-4 flex items-center bg-muted/20 border border-border rounded-xl text-muted-foreground italic">
                     {status?.subtype === 'freelance' ? '7-10 jours (Inclus dans le pack)' : '30 jours (Standard Agency)'}
                   </div>
                </div>
              </CardContent>
              <CardFooter className="p-10 border-t border-border/40 bg-muted/20 flex justify-end">
                <Button type="submit" className="rounded-2xl bg-amber-500 text-black h-16 px-12 font-bold text-xl shadow-[0_4px_30px_rgba(251,191,36,0.3)] hover:opacity-90 transition-all" disabled={loading}>
                  {loading ? 'Publishing...' : 'Launch Casting Call'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
