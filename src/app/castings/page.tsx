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
  Clock, 
  Briefcase, 
  Filter,
  ChevronRight,
  Film
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function CastingsPage() {
  const [castings, setCastings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCity, setSelectedCity] = useState('All')
  const supabase = createClient()

  useEffect(() => {
    fetchCastings()
  }, [])

  async function fetchCastings() {
    setLoading(true)
    let query = supabase
      .from('castings')
      .select('*, profiles(email)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (selectedCity !== 'All') {
      query = query.eq('city', selectedCity)
    }

    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching castings:', error)
    } else {
      setCastings(data || [])
    }
    setLoading(true) // Should be false, wait
    setLoading(false)
  }

  const filteredCastings = castings.filter(casting => 
    casting.title.toLowerCase().includes(search.toLowerCase()) ||
    casting.description.toLowerCase().includes(search.toLowerCase())
  )

  const cities = ['All', 'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida']

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Trouvez votre prochain rôle
            </h1>
            <p className="text-slate-400 text-lg flex items-center gap-2">
              <span>Explorez les derniers castings en Algérie.</span>
              <span className="text-xs bg-slate-800 px-2 py-0.5 rounded font-arabic" dir="rtl">اكتشف آخر تجارب الأداء</span>
            </p>
          </motion.div>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
              placeholder="Rechercher un casting..." 
              className="pl-10 bg-slate-900/50 border-slate-800 text-white focus:ring-amber-500 focus:border-amber-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {cities.map(city => (
              <Button
                key={city}
                variant={selectedCity === city ? 'default' : 'outline'}
                className={selectedCity === city ? 'bg-amber-500 text-black' : 'border-slate-800 text-slate-300 hover:bg-slate-900'}
                onClick={() => {
                   setSelectedCity(city);
                   // We'll filter client side for now as we have a list, but we could re-fetch
                }}
              >
                {city}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-slate-900/50 animate-pulse rounded-2xl border border-slate-800" />
            ))}
          </div>
        ) : filteredCastings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCastings.map((casting, index) => (
              <motion.div
                key={casting.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-slate-900/40 border-slate-800 hover:border-amber-500/50 transition-all duration-300 backdrop-blur-sm group h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                       <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                         {casting.project_type || 'Casting'}
                       </Badge>
                       <span className="text-xs text-slate-500 flex items-center gap-1">
                         <Clock className="w-3 h-3" /> {new Date(casting.created_at).toLocaleDateString()}
                       </span>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-amber-400 transition-colors">
                      {casting.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3 h-3" /> {casting.city}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-slate-300 text-sm line-clamp-3 mb-4">
                      {casting.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                       <span className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs text-slate-300">
                         <User className="w-3 h-3" /> {casting.age_min}-{casting.age_max} ans
                       </span>
                       <span className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded text-xs text-slate-300">
                         <Briefcase className="w-3 h-3" /> {casting.gender_pref === 'any' ? 'H/F' : casting.gender_pref === 'male' ? 'H' : 'F'}
                       </span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-slate-800/50">
                    <Button asChild className="w-full bg-white/10 hover:bg-amber-500 hover:text-black transition-all group/btn">
                      <Link href={`/castings/${casting.id}`}>
                        Voir les détails <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
            <Film className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-400">Aucun casting trouvé</h3>
            <p className="text-slate-500 mt-2">Essayez de modifier vos filtres ou revenez plus tard.</p>
          </div>
        )}
      </div>
    </div>
  )
}
