'use client'

import { useState, useEffect, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Film, ArrowLeft, Loader2, User, MapPin, Languages, 
  CheckCircle2, XCircle, Star, Clock, Eye
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

const STATUS_OPTIONS = [
  { value: 'submitted', label: 'En attente', color: 'text-slate-400 bg-slate-500/10 border-slate-500/20' },
  { value: 'preselected', label: 'Pré-sélectionné', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { value: 'rejected', label: 'Refusé', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  { value: 'booked', label: 'Retenu ✓', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
]

export default function ApplicationsManagerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: castingId } = use(params)
  const [casting, setCasting] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [castingId])

  async function fetchData() {
    setLoading(true)

    // Get casting info
    const { data: castingData } = await supabase
      .from('castings')
      .select('*')
      .eq('id', castingId)
      .single()
    
    setCasting(castingData)

    // Get applications with talent profiles
    const { data: appData, error } = await supabase
      .from('applications')
      .select('*, talent_profiles:talent_id(id, full_name, city, main_photo_url, categories, age_play_min, age_play_max, languages)')
      .eq('casting_id', castingId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error(error)
      toast.error('Erreur lors du chargement des candidatures')
    } else {
      setApplications(appData || [])
    }
    setLoading(false)
  }

  async function handleStatusChange(applicationId: string, newStatus: string) {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', applicationId)

    if (error) {
      toast.error('Erreur lors de la mise à jour')
    } else {
      toast.success('Statut mis à jour')
      setApplications(prev => prev.map(a => a.id === applicationId ? { ...a, status: newStatus } : a))
    }
  }

  function getStatusInfo(status: string) {
    return STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0]
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
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 sm:p-10">
        <Button asChild variant="ghost" className="mb-6 text-muted-foreground hover:text-primary group">
          <Link href="/dashboard/recruiter/my-castings">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Retour à mes castings
          </Link>
        </Button>

        {casting && (
          <div className="mb-10">
            <h1 className="text-4xl font-bold tracking-tight">Candidatures</h1>
            <p className="text-muted-foreground mt-2 text-lg">
              <span className="text-primary font-bold">{casting.title}</span> — {casting.city}
            </p>
            <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
              <span>{applications.length} candidature{applications.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{applications.filter(a => a.status === 'preselected').length} pré-sélectionné{applications.filter(a => a.status === 'preselected').length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{applications.filter(a => a.status === 'booked').length} retenu{applications.filter(a => a.status === 'booked').length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}

        {applications.length === 0 ? (
          <div className="text-center py-32 bg-card/20 rounded-3xl border border-dashed border-border/40">
            <User className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-muted-foreground">Aucune candidature</h3>
            <p className="text-muted-foreground mt-2">Les talents n'ont pas encore postulé à ce casting.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app, index) => {
              const talent = app.talent_profiles
              const statusInfo = getStatusInfo(app.status)
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="rounded-2xl border-border/40 bg-card/40 backdrop-blur-lg shadow-lg hover:border-primary/30 transition-all overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                        {/* Avatar */}
                        <Link href={`/talents/${talent?.id}`} className="shrink-0">
                          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-border bg-muted">
                            {talent?.main_photo_url ? (
                              <img src={talent.main_photo_url} alt={talent.full_name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center"><User className="w-8 h-8 text-muted-foreground" /></div>
                            )}
                          </div>
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/talents/${talent?.id}`} className="hover:text-primary transition-colors">
                            <h3 className="text-lg font-bold truncate">{talent?.full_name || 'Talent inconnu'}</h3>
                          </Link>
                          <div className="flex flex-wrap gap-3 mt-1 text-sm text-muted-foreground">
                            {talent?.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {talent.city}</span>}
                            {talent?.age_play_min && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {talent.age_play_min}-{talent.age_play_max} ans</span>}
                            {talent?.languages && <span className="flex items-center gap-1"><Languages className="w-3 h-3" /> {talent.languages.join(', ')}</span>}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {talent?.categories?.slice(0, 3).map((c: string) => (
                              <Badge key={c} variant="outline" className="text-[10px] border-border">{c}</Badge>
                            ))}
                          </div>
                          {app.message && (
                            <p className="text-sm text-muted-foreground mt-2 italic border-l-2 border-primary/30 pl-3">
                              "{app.message}"
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground/60 mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Postulé le {new Date(app.created_at).toLocaleDateString('fr-FR')}
                          </p>
                        </div>

                        {/* Status & Actions */}
                        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                          <Select value={app.status} onValueChange={(v) => handleStatusChange(app.id, v)}>
                            <SelectTrigger className={`rounded-xl h-11 w-full sm:w-48 font-bold border ${statusInfo.color}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              {STATUS_OPTIONS.map(s => (
                                <SelectItem key={s.value} value={s.value}>
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Link href={`/talents/${talent?.id}`}>
                            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-primary/10">
                              <Eye className="w-5 h-5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
