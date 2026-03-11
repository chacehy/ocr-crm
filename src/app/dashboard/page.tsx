import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, UserCircle, ListFilter, Film, LogOut, LayoutDashboard, Settings } from 'lucide-react'

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

  if (profile.role === 'talent') {
    const { data: talentProfile } = await supabase.from('talent_profiles').select('id').eq('user_id', user.id).single()
    if (!talentProfile) {
      return redirect('/wizard/talent')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Dashboard Nav */}
      <nav className="bg-card/50 backdrop-blur-md border-b border-border/40 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-primary flex items-center gap-2">
            <Film className="w-6 h-6" />
            <span>CastingConnect<span className="text-foreground">DZ</span></span>
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-sm font-bold text-muted-foreground hidden sm:block uppercase tracking-widest">{user.email}</span>
            <form action="/auth/logout" method="post">
              <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground hover:text-primary transition-colors">
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </Button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 sm:p-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Bienvenue, <span className="text-primary italic">{profile.full_name || (profile.role === 'talent' ? 'Artiste' : 'Recruteur')}</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg flex items-center gap-2">
              <span>Gérez votre présence {profile.role === 'talent' ? 'artistique' : 'professionnelle'}.</span>
              <span className="text-xs bg-slate-800 px-2 py-0.5 rounded font-arabic" dir="rtl">مرحباً بك في لوحة التحكم</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {profile.role === 'talent' && (
              <div className="flex gap-4">
                <Link href="/dashboard/talent/edit-profile">
                  <Button variant="outline" className="rounded-xl border-primary/20 bg-primary/5 text-primary h-14 px-8 font-bold text-lg hover:bg-primary/10">
                    <Settings className="w-6 h-6 mr-2" /> Modifier Profil
                  </Button>
                </Link>
                <Link href="/castings">
                  <Button className="rounded-xl bg-primary text-black h-14 px-8 font-bold text-lg shadow-lg hover:opacity-90">
                    <Film className="w-6 h-6 mr-2" /> Voir les Castings <span className="ml-2 text-xs opacity-70 font-arabic" dir="rtl">تصفح الأدوار</span>
                  </Button>
                </Link>
              </div>
            )}
            
            {profile.role === 'recruiter' && (
              <>
                <Link href="/talents">
                  <Button variant="outline" className="rounded-xl border-primary/20 bg-primary/5 text-primary h-14 px-8 font-bold text-lg hover:bg-primary/10">
                    <UserCircle className="w-6 h-6 mr-2" /> Base de Talents <span className="ml-2 text-xs opacity-70 font-arabic" dir="rtl">قاعدة المواهب</span>
                  </Button>
                </Link>
                <Link href="/dashboard/recruiter/post-casting">
                  <Button className="rounded-xl bg-primary text-black h-14 px-8 font-bold text-lg shadow-lg hover:opacity-90">
                    <PlusCircle className="w-6 h-6 mr-2" /> Publier un Casting <span className="ml-2 text-xs opacity-70 font-arabic" dir="rtl">نشر إعلان</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-10">
          <Card className="rounded-2xl border-border/40 bg-card/40 backdrop-blur-lg shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Network Reach</CardTitle>
              <ListFilter className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0 Active</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Wait for your first application.</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl border-border/40 bg-card/40 backdrop-blur-lg shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Portfolio Status</CardTitle>
              <UserCircle className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">80%</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">Your profile is trending.</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/40 bg-primary/5 backdrop-blur-lg border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-primary">Pro Tools</CardTitle>
              <Settings className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground italic">MVP</div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">More features coming soon.</p>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder for Content */}
        <div className="mt-12 text-center p-20 border-2 border-dashed border-border/40 rounded-[2rem] bg-card/20 backdrop-blur-sm relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <div className="mx-auto w-20 h-20 bg-primary rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(251,191,36,0.2)]">
            <Film className="w-10 h-10 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Lights, Camera, Action!</h3>
          <p className="text-muted-foreground max-w-sm mx-auto text-lg">Your activity stream is ready for your first professional move.</p>
        </div>
      </main>
    </div>
  )
}
