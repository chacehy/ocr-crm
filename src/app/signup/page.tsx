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
import { Film } from 'lucide-react'

export default function SignUpPage() {
  const { signUp, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

    const { error } = await signUp(email, password, { role, recruiter_subtype })
    
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
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">Create an account</CardTitle>
            <CardDescription className="text-base">
              Choose your role and start your journey
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="role" className="text-sm font-medium text-muted-foreground uppercase tracking-widest">I am a...</Label>
                <Select value={roleSelection} onValueChange={setRoleSelection}>
                  <SelectTrigger id="role" className="rounded-xl h-12 bg-background border-border focus:ring-primary/20">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border">
                    <SelectItem value="talent">Talent (Actor, Model...)</SelectItem>
                    <SelectItem value="recruiter_freelance">Freelance Recruiter</SelectItem>
                    <SelectItem value="recruiter_agency">Agency / Studio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@email.com" 
                  required 
                  className="rounded-xl h-12 bg-background border-border focus:ring-primary/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Password</Label>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="rounded-xl h-12 bg-background border-border focus:ring-primary/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6 mt-4 pb-8">
              <Button type="submit" className="w-full rounded-xl bg-primary text-primary-foreground hover:opacity-90 h-14 font-bold text-lg shadow-[0_4px_20px_rgba(251,191,36,0.3)] transition-all" disabled={loading}>
                {loading ? 'Processing...' : 'Start Now'}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                Already part of the network?{' '}
                <Link href="/login" className="text-primary hover:underline font-bold">
                  Login here
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
