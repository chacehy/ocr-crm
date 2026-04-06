import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, UserCircle, ListFilter, Film, LayoutDashboard, Settings, Star, CheckCircle2, Search, MessageSquare, Zap, MapPin } from 'lucide-react'
import { LogoutButton } from '@/components/auth/logout-button'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  if (!profile) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading identity...</div>
  }

  // Fetch recruiter metadata if applicable
  let recruiterMeta = null
  if (profile.role === 'recruiter') {
    const { data: rMeta } = await supabase.from('recruiter_profiles').select('*').eq('user_id', user.id).single()
    recruiterMeta = rMeta
  }

  if (profile.role === 'talent') {
    const { data: talentProfile } = await supabase.from('talent_profiles').select('id').eq('user_id', user.id).single()
    if (!talentProfile) {
      return redirect('/wizard/talent')
    }
  }

  // Fetch Stats
  let stats = {
    first: { label: 'Applicants', value: '0', sub: 'Wait for your first application.' },
    second: { label: 'Active Castings', value: '0', sub: 'Post your first casting.' }
  }

  if (profile.role === 'recruiter') {
    // 1. Get all recruiter castings
    const { data: myCastings } = await supabase
      .from('castings')
      .select('id, status')
      .eq('recruiter_id', user.id)

    const activeCount = myCastings?.filter(c => c.status === 'open').length || 0
    const castingIds = myCastings?.map(c => c.id) || []

    stats.second = { 
      label: 'Active Castings', 
      value: activeCount.toString(), 
      sub: activeCount > 0 ? 'Your search is live.' : 'No active listings.' 
    }

    if (castingIds.length > 0) {
      // 2. Count total applications across all castings
      const { count: appCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .in('casting_id', castingIds)

      stats.first = { 
        label: 'Applicants', 
        value: (appCount || 0).toString(), 
        sub: (appCount || 0) > 0 ? 'Keep reviewing candidates!' : 'Waiting for applicants.' 
      }
    }
  } else {
    // Talent Stats: Completeness
    const { data: tp } = await supabase.from('talent_profiles').select('*').eq('user_id', user.id).single()
    if (tp) {
      const fields = ['full_name', 'gender', 'city', 'age_play_min', 'bio', 'main_photo_url']
      const filled = fields.filter(f => tp[f as keyof typeof tp]).length
      const completeness = Math.round((filled / fields.length) * 100)
      
      // Talent Insights: Shortlist and History
      const { count: shortlistCount } = await supabase
        .from('shortlists')
        .select('*', { count: 'exact', head: true })
        .eq('talent_id', tp.id)
      
      const { data: recentApps } = await supabase
        .from('applications')
        .select('*, castings(title, city)')
        .eq('talent_id', tp.id)
        .order('created_at', { ascending: false })
        .limit(3)

      const { count: talentAppCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('talent_id', tp.id)

      stats.first = { 
        label: 'Statut du Profil', 
        value: `${completeness}%`, 
        sub: completeness === 100 ? 'Votre profil est parfait !' : 'Complétez votre profil pour plus de visibilité.'
      }

      stats.second = {
        label: 'Mes Candidatures',
        value: (talentAppCount || 0).toString(),
        sub: (talentAppCount || 0) > 0 ? 'Consultez le statut de vos candidatures.' : 'Postulez aux castings dès maintenant.'
      }

      // @ts-ignore
      stats.shortlistCount = shortlistCount || 0
      // @ts-ignore
      stats.recentApps = recentApps || []
    }
  }

  // Recruiter Insights: Matching profiles
  let matchingTalents: any[] = []
  if (profile.role === 'recruiter') {
    const { data: latestCasting } = await supabase
      .from('castings')
      .select('city, project_type')
      .eq('recruiter_id', user.id)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (latestCasting) {
      const { data: matches } = await supabase
        .from('talent_profiles')
        .select('*')
        .eq('city', latestCasting.city)
        .limit(3)
      matchingTalents = matches || []
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Dashboard Nav */}
      <nav className="bg-card/50 backdrop-blur-md border-b border-border/40 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tighter text-primary flex items-center gap-2">
            <Film className="w-6 h-6 shrink-0" />
            <span className="truncate">CastingConnect<span className="text-foreground shrink-0">DZ</span></span>
          </Link>
            <div className="flex items-center gap-4 sm:gap-6 shrink-0">
              <Link href="/dashboard" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Tableau de Bord</span>
              </Link>
              <div className="flex items-center gap-3 pl-6 border-l border-border/40">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold leading-tight uppercase tracking-tight">
                    {/* @ts-ignore */}
                    {recruiterMeta?.full_name || profile?.email?.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black text-primary">{profile?.role}</p>
                </div>
                <LogoutButton />
              </div>
            </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 sm:p-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="w-full md:w-auto">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Bienvenue, <span className="text-primary italic">{profile.full_name || (profile.role === 'talent' ? 'Artiste' : 'Recruteur')}</span>
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
              <p className="text-muted-foreground text-lg">
                Gérez votre présence {profile.role === 'talent' ? 'artistique' : 'professionnelle'}.
              </p>
              <div className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full flex items-center gap-2 w-fit">
                <span className="text-primary font-arabic text-sm" dir="rtl">مرحباً بك في لوحة التحكم</span>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center">
            {profile.role === 'talent' && (
              <div className="grid grid-cols-1 sm:flex gap-4 w-full">
                <Link href="/dashboard/talent/edit-profile" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full rounded-xl border-primary/20 bg-primary/5 text-primary h-14 px-8 font-bold text-lg hover:bg-primary/10 transition-all flex items-center justify-center gap-3">
                    <Settings className="w-6 h-6" /> 
                    <span>Modifier Profil</span>
                  </Button>
                </Link>
                <Link href="/castings" className="w-full sm:w-auto">
                  <Button className="w-full rounded-xl bg-primary text-black h-14 px-8 font-bold text-lg shadow-[0_4px_15px_rgba(251,191,36,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-3">
                    <Film className="w-6 h-6" /> 
                    <span>Voir les Castings</span>
                    <span className="text-sm opacity-90 font-arabic border-l border-black/10 pl-2 ml-1" dir="rtl">تصفح الأدوار</span>
                  </Button>
                </Link>
              </div>
            )}
            
            {profile.role === 'recruiter' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-4 w-full lg:w-auto">
                {profile.recruiter_subtype === 'agency' && (
                  <Link href="/talents" className="w-full lg:w-auto">
                    <Button variant="outline" className="w-full rounded-xl border-primary/20 bg-primary/5 text-primary h-14 px-6 font-bold text-lg hover:bg-primary/10 transition-all flex items-center justify-center gap-3">
                      <UserCircle className="w-6 h-6" /> 
                      <div className="flex flex-col items-start leading-tight">
                        <span>Base de Talents</span>
                        <span className="text-xs opacity-70 font-arabic" dir="rtl">قاعدة المواهب</span>
                      </div>
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard/recruiter/my-castings" className="w-full lg:w-auto">
                  <Button variant="outline" className="w-full rounded-xl border-primary/20 bg-primary/5 text-primary h-14 px-6 font-bold text-lg hover:bg-primary/10 transition-all flex items-center justify-center gap-3">
                    <ListFilter className="w-6 h-6" /> 
                    <div className="flex flex-col items-start leading-tight">
                      <span>Mes Castings</span>
                      <span className="text-xs opacity-70 font-arabic" dir="rtl">إعلاناتي</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/dashboard/recruiter/settings" className="w-full lg:w-auto">
                  <Button variant="outline" className="w-full rounded-xl border-primary/20 bg-primary/5 text-primary h-14 px-6 font-bold text-lg hover:bg-primary/10 transition-all flex items-center justify-center gap-3">
                    <Settings className="w-6 h-6" /> 
                    <div className="flex flex-col items-start leading-tight">
                      <span>Mon Profil Pro</span>
                      <span className="text-xs opacity-70 font-arabic" dir="rtl">ملفي الشخضي</span>
                    </div>
                  </Button>
                </Link>
                <Link href="/dashboard/recruiter/post-casting" className="w-full lg:w-auto sm:col-span-2 lg:col-span-1">
                  <Button className="w-full rounded-xl bg-primary text-black h-14 px-8 font-bold text-lg shadow-[0_4px_15px_rgba(251,191,36,0.3)] hover:scale-105 transition-all flex items-center justify-center gap-3">
                    <PlusCircle className="w-6 h-6" /> 
                    <div className="flex flex-col items-start leading-tight">
                      <span>Publier un Casting</span>
                      <span className="text-xs opacity-90 font-arabic" dir="rtl">نشر إعلان</span>
                    </div>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 mb-10">
          <Card className="rounded-2xl border-border/40 bg-card/40 backdrop-blur-lg shadow-xl hover:border-primary/20 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{stats.first.label}</CardTitle>
              <UserCircle className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tight">{stats.first.value}</div>
              <p className="text-sm text-muted-foreground mt-2 font-medium">{stats.first.sub}</p>
            </CardContent>
          </Card>
          
          <Link href={profile.role === 'talent' ? "/dashboard/talent/my-applications" : "/dashboard/recruiter/my-castings"}>
            <Card className="rounded-2xl border-border/40 bg-card/40 backdrop-blur-lg shadow-xl hover:border-primary/20 transition-all cursor-pointer group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{stats.second.label}</CardTitle>
                <ListFilter className="w-4 h-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold tracking-tight text-primary">{stats.second.value}</div>
                <p className="text-sm text-muted-foreground mt-2 font-medium">{stats.second.sub}</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Insights & Opportunities Section */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-amber-500 fill-amber-500/20" />
            <h2 className="text-2xl font-bold tracking-tight">Insights & Opportunités</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {profile.role === 'talent' ? (
              <>
                {/* Shortlist Insight */}
                <Card className="lg:col-span-1 rounded-2xl border-amber-500/10 bg-amber-500/[0.02] backdrop-blur-lg overflow-hidden group">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-amber-500/60 flex items-center gap-2">
                       <Star className="w-4 h-4 fill-amber-500/20" /> Favoris
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* @ts-ignore */}
                    <div className="text-5xl font-bold tracking-tighter mb-2">{stats.shortlistCount}</div>
                    <p className="text-slate-400 font-medium">Nombre de fois où vous avez été ajouté aux favoris des recruteurs.</p>
                  </CardContent>
                </Card>

                {/* Recent Application Status */}
                <Card className="lg:col-span-2 rounded-2xl border-border/40 bg-card/40 backdrop-blur-lg overflow-hidden">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Candidatures Récentes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* @ts-ignore */}
                      {stats.recentApps.length > 0 ? stats.recentApps.map((app: any) => (
                        <div key={app.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-200">{app.castings?.title}</span>
                            <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" /> {app.castings?.city}</span>
                          </div>
                          <Badge className={`${
                            app.status === 'accepted' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 
                            app.status === 'rejected' ? 'bg-rose-500/20 text-rose-400 border-rose-500/20' : 
                            'bg-amber-500/20 text-amber-400 border-amber-500/20'
                          } font-bold px-3 py-1 rounded-lg`}>
                            {app.status === 'accepted' ? 'Accepté' : app.status === 'rejected' ? 'Refusé' : 'En attente'}
                          </Badge>
                        </div>
                      )) : (
                        <div className="text-center py-6 text-slate-500">Aucune candidature récente.</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Recruiters Matching Section */}
                <Card className="lg:col-span-3 rounded-2xl border-border/40 bg-card/40 backdrop-blur-lg overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Talents Recommandés
                      </CardTitle>
                      <CardDescription>Profils correspondants à vos recherches actuelles.</CardDescription>
                    </div>
                    <Link href="/talents">
                      <Button variant="ghost" size="sm" className="text-amber-500 font-bold hover:bg-amber-500/10">
                        <Search className="w-4 h-4 mr-2" /> Tout parcourir
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {matchingTalents.length > 0 ? matchingTalents.map((t: any) => (
                        <div key={t.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/30 hover:bg-amber-500/[0.02] transition-all group relative">
                          <div className="flex items-start gap-4 mb-3">
                            <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden flex-shrink-0 border-2 border-slate-700">
                              {t.main_photo_url ? (
                                <img src={t.main_photo_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center"><UserCircle className="w-6 h-6 text-slate-600" /></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-slate-200 truncate">{t.full_name}</h4>
                              <p className="text-xs text-slate-500 flex items-center gap-1 capitalize"><MapPin className="w-3 h-3" /> {t.city}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                             <Button asChild size="sm" className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-8 text-[11px]">
                                <Link href={`https://wa.me/${t.phone?.replace('+', '')}`} target="_blank">
                                  <MessageSquare className="w-3 h-3 mr-1" /> WhatsApp
                                </Link>
                             </Button>
                             <Button asChild variant="outline" size="sm" className="w-full rounded-lg border-white/10 hover:bg-white/10 font-bold h-8 text-[11px]">
                                <Link href={`/talents/${t.id}`}>Profil</Link>
                             </Button>
                          </div>
                        </div>
                      )) : (
                        <div className="sm:col-span-3 text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
                           <UserCircle className="w-10 h-10 text-slate-700 mx-auto mb-3" />
                           <p className="text-slate-500 font-medium">Publiez votre premier casting pour voir des talents recommandés.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
