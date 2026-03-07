'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  MapPin, 
  User, 
  Filter,
  Star,
  ChevronRight,
  UserCheck,
  Languages,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Image from 'next/image'

import { toggleShortlist } from '@/app/actions/shortlist'
import { toast } from 'sonner'

export default function TalentDiscoveryPage() {
  const [talents, setTalents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set())
  const supabase = createClient()

  useEffect(() => {
    fetchTalents()
  }, [])

  async function fetchTalents() {
    setLoading(true)
    
    // Get talents
    const { data, error } = await supabase
      .from('talent_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching talents:', error)
    } else {
      setTalents(data || [])
    }

    // Get current shortlists
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: shortlistData } = await supabase
        .from('shortlists')
        .select('talent_id')
        .eq('recruiter_id', user.id)
      
      if (shortlistData) {
        setShortlistedIds(new Set(shortlistData.map(s => s.talent_id)))
      }
    }

    setLoading(false)
  }

  const handleToggle = async (e: React.MouseEvent, talentId: string) => {
    e.preventDefault()
    try {
      const res = await toggleShortlist(talentId)
      const newIds = new Set(shortlistedIds)
      if (res.status === 'added') {
        newIds.add(talentId)
        toast.success('Talent ajouté aux favoris')
      } else {
        newIds.delete(talentId)
        toast.success('Retiré des favoris')
      }
      setShortlistedIds(newIds)
    } catch (error) {
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const categories = ['All', 'Acteur', 'Mannequin', 'Figurant', 'Voix-off', 'Danseur']

  const filteredTalents = talents.filter(talent => {
    const matchesSearch = talent.full_name.toLowerCase().includes(search.toLowerCase()) ||
                         talent.bio?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || 
                           talent.categories?.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-2 text-amber-500 mb-2">
               <UserCheck className="w-5 h-5" />
               <span className="text-xs font-black uppercase tracking-widest">Base de Données Talents</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
              Découvrez les <span className="text-amber-500 italic">Nouveaux Talents</span>
            </h1>
            <p className="text-slate-400 mt-2 text-lg flex items-center gap-2">
              <span>Parcourez les profils vérifiés pour vos projets.</span>
              <span className="text-xs bg-slate-800 px-2 py-0.5 rounded font-arabic" dir="rtl">اكتشف أفضل المواهب لمشاريعك</span>
            </p>
          </motion.div>
          
          <div className="flex gap-2">
             <Button variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-900 rounded-xl">
               <Filter className="w-4 h-4 mr-2" /> Filtres Avancés
             </Button>
          </div>
        </header>

        {/* Discovery Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input 
              placeholder="Rechercher par nom, bio, compétences..." 
              className="pl-12 h-14 bg-slate-900/30 border-slate-800 text-white rounded-2xl focus:ring-amber-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'ghost'}
                className={`h-14 px-6 rounded-2xl font-bold transition-all ${
                  selectedCategory === cat 
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-[3/4] bg-slate-900/50 animate-pulse rounded-3xl border border-slate-800" />
            ))}
          </div>
        ) : filteredTalents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTalents.map((talent, index) => (
              <motion.div
                key={talent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link href={`/talents/${talent.id}`}>
                  <Card className="bg-slate-900/40 border-slate-800 hover:border-amber-500/50 transition-all duration-500 overflow-hidden group cursor-pointer h-full">
                    <div className="aspect-[3/4] relative overflow-hidden">
                      {talent.main_photo_url ? (
                        <img 
                          src={talent.main_photo_url} 
                          alt={talent.full_name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                           <User className="w-16 h-16 text-slate-700" />
                        </div>
                      )}
                      
                      {/* Hover Overlay */}
                      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black via-black/60 to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                         <div className="flex gap-2 mb-2">
                           {talent.categories?.slice(0,2).map((c: string) => (
                             <Badge key={c} className="bg-amber-500/20 text-amber-500 border-none text-[10px] uppercase font-bold px-1.5">
                               {c}
                             </Badge>
                           ))}
                         </div>
                         <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                           {talent.full_name}
                         </h3>
                         <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                           <MapPin className="w-3 h-3" /> {talent.city}
                         </div>
                      </div>
                      
                      {/* Shortlist Button */}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-md transition-all ${
                          shortlistedIds.has(talent.id) 
                            ? 'bg-amber-500 text-black opacity-100' 
                            : 'bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-white/20'
                        }`}
                        onClick={(e) => handleToggle(e, talent.id)}
                      >
                        <Star className={`w-5 h-5 ${shortlistedIds.has(talent.id) ? 'fill-black' : ''}`} />
                      </Button>

                      {/* Verified Badge */}
                      {talent.is_verified && (
                        <div className="absolute top-4 left-4 bg-blue-500 p-1.5 rounded-full shadow-lg">
                           <UserCheck className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
            <User className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-400">Aucun talent trouvé</h3>
            <p className="text-slate-500 mt-2">Affinez vos critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  )
}
