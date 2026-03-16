'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { toast } from 'sonner'
import { Film, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignUpPage() {
  const { signUp, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [roleSelection, setRoleSelection] = useState('talent')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let role = 'talent'
    let recruiter_subtype = null
    
    if (roleSelection === 'recruiter_freelance') {
      role = 'recruiter'
      recruiter_subtype = 'freelance'
    } else if (roleSelection === 'recruiter_agency') {
      role = 'recruiter'
      recruiter_subtype = 'agency'
    }

    const supabase = createClient()
    
    // Check if user already exists in profiles table
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingProfile) {
      toast.error('Cet e-mail est déjà utilisé. Veuillez vous connecter.')
      return
    }

    const { error } = await signUp(email, password, { 
      role, 
      recruiter_subtype,
      phone_number: phone 
    })
    
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Check your email to confirm registration!')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-48" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="flex justify-center mb-10">
          <Link href="/" className="text-4xl font-bold tracking-tighter text-primary flex items-center gap-3">
             <Film className="w-9 h-9" />
             <span>CastingConnect<span className="text-foreground">DZ</span></span>
          </Link>
        </div>
        
        <Card className="border-border/40 shadow-2xl rounded-2xl bg-card/50 backdrop-blur-xl">
            <CardHeader className="space-y-1 pt-8 pb-4">
              <div className="flex justify-center mb-6">
                 <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <Film className="w-8 h-8 text-black" />
                 </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center tracking-tight">Créer un compte</CardTitle>
              <CardDescription className="text-center text-muted-foreground text-sm">
                Rejoignez la plus grande communauté de castings en Algérie
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 px-8">
              {/* Role Selection */}
              <div className="space-y-4">
                <Label className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Vous êtes ?</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRoleSelection('talent')}
                    className={`h-12 rounded-xl text-sm font-bold border transition-all ${
                      roleSelection === 'talent' 
                        ? 'bg-primary text-black border-primary' 
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    Talent / Artiste
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (roleSelection === 'talent') {
                        setRoleSelection('recruiter_agency')
                      } else {
                        // toggle between recruiter types if already on recruiter
                        setRoleSelection(roleSelection === 'recruiter_agency' ? 'recruiter_freelance' : 'recruiter_agency')
                      }
                    }}
                    className={`h-12 rounded-xl text-sm font-bold border transition-all ${
                      roleSelection.startsWith('recruiter') 
                        ? 'bg-primary text-black border-primary' 
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    Recruteur / Agence
                  </button>
                </div>

                {roleSelection.startsWith('recruiter') && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex flex-col gap-2 p-3 rounded-xl bg-white/5 border border-white/5"
                  >
                    <Label className="text-[10px] text-slate-500 uppercase font-black mb-1">Précisez votre activité :</Label>
                    <div className="flex gap-2">
                       <Button 
                         type="button"
                         variant="ghost" 
                         size="sm"
                         className={`flex-1 rounded-lg text-xs h-8 ${roleSelection === 'recruiter_freelance' ? 'bg-primary/20 text-primary border border-primary/20' : 'text-slate-400'}`}
                         onClick={() => setRoleSelection('recruiter_freelance')}
                       >
                         Indépendant / Freelance
                       </Button>
                       <Button 
                         type="button"
                         variant="ghost" 
                         size="sm"
                         className={`flex-1 rounded-lg text-xs h-8 ${roleSelection === 'recruiter_agency' ? 'bg-primary/20 text-primary border border-primary/20' : 'text-slate-400'}`}
                         onClick={() => setRoleSelection('recruiter_agency')}
                       >
                         Agence / Studio
                       </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nom@exemple.com" 
                  required 
                  className="rounded-xl h-12 bg-background border-border focus:ring-primary/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Numéro de téléphone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  placeholder="0XXX XX XX XX" 
                  required 
                  className="rounded-xl h-12 bg-background border-border focus:ring-primary/20"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Mot de passe</Label>
                </div>
                <div className="relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="rounded-xl h-12 bg-background border-border focus:ring-primary/20 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6 mt-4 pb-8">
              <Button 
                type="submit" 
                className="w-full h-12 rounded-xl bg-primary text-black font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20" 
                disabled={loading}
              >
                {loading ? "Chargement..." : "S'inscrire"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Vous avez déjà un compte ?{' '}
                <Link href="/login" className="text-primary font-bold hover:underline">
                  Se connecter
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
