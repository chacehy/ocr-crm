'use client'

import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Film, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { signIn, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await signIn(email, password)
    
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Access Granted!')
      router.push('/dashboard')
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
          <CardHeader className="space-y-1 pt-8">
            <div className="flex justify-center mb-6">
               <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Film className="w-8 h-8 text-black" />
               </div>
            </div>
            <CardTitle className="text-3xl font-bold text-center tracking-tight">Bon retour !</CardTitle>
            <CardDescription className="text-center text-muted-foreground text-sm">
              Connectez-vous à votre compte professionnel
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 px-8">
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
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Mot de passe</Label>
                  <Link href="#" className="text-xs text-primary hover:underline font-bold">Oublié ?</Link>
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
                {loading ? "Chargement..." : "Se connecter"}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Vous n'avez pas de compte ?{' '}
                <Link href="/signup" className="text-primary font-bold hover:underline">
                  Inscrivez-vous
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
