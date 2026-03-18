'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Film, MapPin, Calendar, Users, PlusCircle, Copy, 
  Loader2, AlertTriangle, Eye, ChevronRight, Clock, Rocket, RefreshCw, XCircle
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { publishCasting } from '@/app/actions/castings'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function MyCastingsPage() {
  const [castings, setCastings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState<string | null>(null)
  const [appCounts, setAppCounts] = useState<Record<string, number>>({})
  const [showPricingModal, setShowPricingModal] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchMyCastings()
  }, [])

  async function fetchMyCastings() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data, error } = await supabase
      .from('castings')
      .select('*')
      .eq('recruiter_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      toast.error('Erreur lors du chargement')
    } else {
      setCastings(data || [])
      // Fetch application counts for each casting
      const counts: Record<string, number> = {}
      for (const c of (data || [])) {
        const { count } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('casting_id', c.id)
        counts[c.id] = count || 0
      }
      setAppCounts(counts)
    }
    setLoading(false)
  }

  function getDaysLeft(expiryDate: string | null): number | null {
    if (!expiryDate) return null
    const diff = new Date(expiryDate).getTime() - Date.now()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  function getStatusBadge(casting: any) {
    if (casting.status === 'draft') {
      return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">Brouillon</Badge>
    }
    const daysLeft = getDaysLeft(casting.expiry_date)
    if (casting.status === 'expired' || (daysLeft !== null && daysLeft <= 0 && casting.status === 'open')) {
      return <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Expiré</Badge>
    }
    if (casting.status === 'closed') {
      return <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/20">Clôturé</Badge>
    }
    if (daysLeft !== null && daysLeft <= 2 && casting.status === 'open') {
      return <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse">Expire bientôt</Badge>
    }
    return <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Actif</Badge>
  }

  async function handleDuplicate(casting: any) {
    router.push(`/dashboard/recruiter/post-casting?duplicate=${casting.id}`)
  }

  async function handlePublish(castingId: string) {
    setPublishing(castingId)
    try {
      const res = await publishCasting(castingId)
      if (!res.success) {
        const errorLower = res.error?.toLowerCase() || ''
        const triggerKeywords = ['crédit', 'credit', 'abonnement', 'subscription', 'accès']
        if (triggerKeywords.some(kw => errorLower.includes(kw))) {
          setShowPricingModal(true)
        } else {
          toast.error(res.error)
        }
      } else {
        toast.success('Casting publié avec succès !')
        fetchMyCastings()
      }
    } catch (error: any) {
      toast.error('Erreur lors de la publication')
    } finally {
      setPublishing(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="bg-card/50 backdrop-blur-md border-b border-border/40 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold tracking-tighter text-primary flex items-center gap-2">
            <Film className="w-6 h-6" />
            <span>CastingConnect<span className="text-foreground">DZ</span></span>
          </Link>
          <Link href="/dashboard/recruiter/post-casting">
            <Button className="rounded-xl bg-primary text-primary-foreground h-12 px-6 font-bold shadow-lg hover:opacity-90">
              <PlusCircle className="w-5 h-5 mr-2" /> Nouveau Casting
            </Button>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 sm:p-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Mes Castings</h1>
          <p className="text-muted-foreground mt-2 text-lg">Gérez vos annonces et consultez les candidatures.</p>
        </div>

        <Dialog open={showPricingModal} onOpenChange={setShowPricingModal}>
          <DialogContent className="bg-slate-900 border-slate-800 text-white rounded-3xl p-8 max-w-md">
            <DialogHeader className="text-center mb-4">
              <div className="mx-auto w-16 h-16 bg-red-500/10 flex items-center justify-center rounded-full mb-4">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <DialogTitle className="text-2xl font-bold">Publier votre Casting</DialogTitle>
              <DialogDescription className="text-slate-400 text-base mt-2">
                Vous n'avez pas de crédits suffisants ou d'abonnement actif pour publier ce casting.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-col gap-3">
              <Button asChild className="w-full h-12 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl">
                <Link href="/pricing">Voir les offres</Link>
              </Button>
              <Button onClick={() => setShowPricingModal(false)} variant="ghost" className="w-full text-slate-400 hover:text-white rounded-xl">
                Annuler
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Expiration Alert */}
        {castings.some(c => {
          const d = getDaysLeft(c.expiry_date)
          return d !== null && d > 0 && d <= 2 && c.status === 'open'
        }) && (
          <div className="mb-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <p className="font-bold text-amber-400">Votre annonce expire bientôt !</p>
              <p className="text-sm text-amber-300/70">Achetez un nouveau pack pour rester visible auprès des talents.</p>
            </div>
            <Link href="/pricing" className="ml-auto">
              <Button size="sm" className="bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400">
                Renouveler
              </Button>
            </Link>
          </div>
        )}

        {castings.length === 0 ? (
          <div className="text-center py-32 bg-card/20 rounded-3xl border border-dashed border-border/40">
            <Film className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-muted-foreground">Aucun casting publié</h3>
            <p className="text-muted-foreground mt-2">Publiez votre premier casting pour commencer à recevoir des candidatures.</p>
            <Link href="/dashboard/recruiter/post-casting">
              <Button className="mt-6 rounded-xl bg-primary text-primary-foreground px-8 h-14 font-bold text-lg">
                <PlusCircle className="w-5 h-5 mr-2" /> Publier un Casting
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {castings.map(casting => {
              const daysLeft = getDaysLeft(casting.expiry_date)
              return (
                <Card key={casting.id} className="rounded-2xl border-border/40 bg-card/40 backdrop-blur-lg shadow-lg hover:border-primary/30 transition-all overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusBadge(casting)}
                          <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                            {casting.project_type}
                          </Badge>
                          {casting.status === 'open' && daysLeft !== null && daysLeft > 0 && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {daysLeft}j restants
                            </span>
                          )}
                        </div>
                        <Link href={`/castings/${casting.id}`} className="hover:underline hover:text-amber-500 transition-colors">
                          <h3 className="text-xl font-bold truncate">{casting.title}</h3>
                        </Link>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {casting.city}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(casting.created_at).toLocaleDateString('fr-FR')}</span>
                          <span className="flex items-center gap-1 font-bold text-primary">
                            <Users className="w-3 h-3" /> {appCounts[casting.id] || 0} candidature{(appCounts[casting.id] || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {casting.status === 'draft' && (
                          <Button onClick={() => handlePublish(casting.id)} disabled={publishing === casting.id} className="rounded-xl bg-amber-500 text-black hover:bg-amber-400 font-bold">
                            {publishing === casting.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Rocket className="w-4 h-4 mr-2" />}
                            Publier
                          </Button>
                        )}
                        {(casting.status === 'expired' || (casting.status === 'open' && getDaysLeft(casting.expiry_date)! <= 0)) && (
                          <Button onClick={() => handlePublish(casting.id)} disabled={publishing === casting.id} className="rounded-xl bg-amber-500 text-black hover:bg-amber-400 font-bold">
                            {publishing === casting.id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                            Réactiver
                          </Button>
                        )}
                        <Link href={`/dashboard/recruiter/castings/${casting.id}/applications`}>
                          <Button variant="outline" size="sm" className="rounded-xl border-border hover:border-primary/40 font-bold">
                            <Eye className="w-4 h-4 mr-1" /> Candidatures <ChevronRight className="w-4 h-4 ml-1" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" className="rounded-xl hover:bg-primary/10 text-muted-foreground" onClick={() => handleDuplicate(casting)}>
                          <Copy className="w-4 h-4 mr-1" /> Dupliquer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
