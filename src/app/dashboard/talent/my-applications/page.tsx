import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Film, MapPin, Calendar, ArrowLeft, Clock, CheckCircle2, XCircle } from 'lucide-react'

export default async function MyApplicationsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return redirect('/login')

  const { data: talentProfile } = await supabase
    .from('talent_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!talentProfile) return redirect('/wizard/talent')

  const { data: applications, error } = await supabase
    .from('applications')
    .select(`
      *,
      casting:castings (
        title,
        city,
        project_type,
        status
      )
    `)
    .eq('talent_id', talentProfile.id)
    .order('created_at', { ascending: false })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'booked':
        return <Badge className="bg-green-500 text-white border-none px-3 py-1 font-bold">Accepté (Booked)</Badge>
      case 'preselected':
        return <Badge className="bg-blue-500 text-white border-none px-3 py-1 font-bold">Présélectionné</Badge>
      case 'rejected':
        return <Badge className="bg-red-500 text-white border-none px-3 py-1 font-bold">Refusé</Badge>
      default:
        return <Badge className="bg-amber-500 text-black border-none px-3 py-1 font-bold">Soumis</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'booked': return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />
      default: return <Clock className="w-5 h-5 text-amber-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center text-primary font-bold mb-8 hover:gap-2 transition-all gap-1">
          <ArrowLeft className="w-5 h-5" /> Retour au Dashboard
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
            Mes <span className="text-primary italic">Candidatures</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Suivez l'état de vos demandes et préparez vos prochaines auditions.
          </p>
        </header>

        {error || !applications || applications.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-border/40 rounded-[2rem] bg-card/20">
            <Film className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-xl font-bold">Aucune candidature</h3>
            <p className="text-muted-foreground mt-2">Vous n'avez pas encore postulé à des castings.</p>
            <Link href="/castings">
              <Button className="mt-6 rounded-xl bg-primary text-black font-bold h-12 px-8">
                Parcourir les Castings
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app: any) => (
              <Card key={app.id} className="rounded-2xl border-border/40 bg-card/40 backdrop-blur-lg shadow-xl overflow-hidden hover:border-primary/20 transition-all group">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-6 gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        {getStatusIcon(app.status)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {app.casting?.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {app.casting?.city}</span>
                          <span className="flex items-center gap-1.5 font-medium uppercase tracking-wider text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                             {app.casting?.project_type}
                          </span>
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(app.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                      {getStatusBadge(app.status)}
                      <Link href={`/castings/${app.casting_id}`}>
                        <Button variant="ghost" size="sm" className="rounded-lg font-bold text-xs hover:bg-primary/10 text-primary">
                          Voir l'annonce
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
