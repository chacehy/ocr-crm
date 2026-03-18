import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  Globe, 
  MapPin, 
  Mail, 
  Film, 
  ArrowLeft,
  Calendar,
  ExternalLink,
  UserCircle,
  MessageSquare,
  Instagram,
  Facebook,
  Phone
} from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function PublicRecruiterProfilePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch recruiter profile
  const { data: profile } = await supabase
    .from('recruiter_profiles')
    .select('*, profiles(email, recruiter_subtype)')
    .eq('user_id', id)
    .single()

  if (!profile) {
    // If no custom profile, check if user exists at all
    const { data: userExists } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('id', id)
      .single()
    
    if (!userExists || userExists.role !== 'recruiter') {
      return notFound()
    }
  }

  // 2. Fetch active castings by this recruiter
  const { data: castings } = await supabase
    .from('castings')
    .select('*')
    .eq('recruiter_id', id)
    .eq('status', 'open')
    .gte('expiry_date', new Date().toISOString())
    .order('created_at', { ascending: false })

  const isAgency = profile?.profiles?.recruiter_subtype === 'agency'
  const displayName = isAgency ? (profile?.company_name || 'Agence') : (profile?.full_name || id.split('-')[0])
  const showFullName = !isAgency
  const visibility = profile?.visibility_settings || { phone: true, whatsapp: true, instagram: true, facebook: true, email: true }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header / Hero Section */}
      <div className="relative bg-card/30 border-b border-border/40 py-20 px-6">
        <div className="max-w-5xl mx-auto relative z-10">
          <Button asChild variant="ghost" className="mb-8 text-muted-foreground hover:text-primary pl-0">
            <Link href="/castings">
              <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux castings
            </Link>
          </Button>

          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
            <div className="w-40 h-40 rounded-[2.5rem] bg-slate-800 overflow-hidden border-4 border-primary/20 shadow-2xl flex-shrink-0">
              {profile?.photo_url ? (
                <img src={profile.photo_url} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <UserCircle className="w-20 h-20 text-slate-700" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="space-y-1">
                <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-widest text-[10px] font-black">
                  Recruteur Vérifié
                </Badge>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                  {displayName}
                </h1>
                {isAgency && profile?.full_name && (
                   <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs mt-2">
                      Contact: {profile.full_name} (Privé)
                   </p>
                )}
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-muted-foreground font-medium">
                {profile?.company_name && (
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" /> {profile.company_name}
                  </span>
                )}
                {profile?.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                    <Globe className="w-4 h-4" /> Site Web <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {profile?.bio && (
                <p className="text-muted-foreground leading-relaxed max-w-2xl text-lg italic">
                  "{profile.bio}"
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      </div>

      <main className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Castings List */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              <Film className="w-8 h-8 text-primary" />
              Castings en cours
            </h2>

            {castings && castings.length > 0 ? (
              <div className="grid gap-6">
                {castings.map((casting) => (
                  <Link key={casting.id} href={`/castings/${casting.id}`}>
                    <div className="group bg-card border border-border/40 rounded-3xl p-6 hover:border-primary/40 hover:bg-primary/[0.02] transition-all relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <Badge className="bg-primary/5 text-primary border-primary/10">
                          {casting.project_type}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                          {casting.city}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">
                        {casting.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                        {casting.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> Posté le {new Date(casting.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card/20 rounded-[3rem] border-2 border-dashed border-border/40">
                <Film className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground font-medium">Aucun casting actif pour le moment.</p>
              </div>
            )}
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-6">
             <div className="bg-primary/5 border border-primary/10 rounded-[2.5rem] p-8">
                <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
                   Contact
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-4 bg-background/50 rounded-2xl border border-border/20">
                      <Mail className="w-5 h-5 text-primary" />
                      <div className="flex flex-col">
                         <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Email</span>
                         <span className="text-sm font-bold truncate max-w-[180px]">{profile?.profiles?.email || 'N/A'}</span>
                      </div>
                   </div>

                   {profile?.phone_number && visibility.phone && (
                      <div className="flex items-center gap-3 p-4 bg-background/50 rounded-2xl border border-border/20">
                         <Phone className="w-5 h-5 text-primary" />
                         <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Téléphone</span>
                            <span className="text-sm font-bold">{profile.phone_number}</span>
                         </div>
                      </div>
                   )}

                   {profile?.whatsapp_number && visibility.whatsapp && (
                      <a href={`https://wa.me/${profile.whatsapp_number.replace(/\s+/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 bg-background/50 rounded-2xl border border-border/20 hover:border-primary/40 transition-colors group">
                         <MessageSquare className="w-5 h-5 text-green-500" />
                         <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">WhatsApp</span>
                            <span className="text-sm font-bold">Lancer la discussion</span>
                         </div>
                      </a>
                   )}

                   <div className="flex gap-4 pt-2">
                      {profile?.instagram_url && visibility.instagram && (
                         <a href={`https://instagram.com/${profile.instagram_url}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center bg-background/50 rounded-2xl border border-border/20 hover:border-primary/40 transition-colors">
                            <Instagram className="w-5 h-5 text-[#E4405F]" />
                         </a>
                      )}
                      {profile?.facebook_url && visibility.facebook && (
                         <a href={profile.facebook_url.startsWith('http') ? profile.facebook_url : `https://facebook.com/${profile.facebook_url}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center bg-background/50 rounded-2xl border border-border/20 hover:border-primary/40 transition-colors">
                            <Facebook className="w-5 h-5 text-[#1877F2]" />
                         </a>
                      )}
                   </div>
                </div>
                
                <div className="mt-8 p-6 bg-primary text-primary-foreground rounded-2xl text-center">
                   <p className="text-sm font-bold">Vérifié par CastingConnect DZ</p>
                   <p className="text-[10px] opacity-80 mt-1 uppercase tracking-widest">Garantie de fiabilité</p>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
