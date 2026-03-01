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
import { Film } from 'lucide-react'

export default function LoginPage() {
  const { signIn, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">Login</CardTitle>
            <CardDescription className="text-base">
              Access your professional dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-6">
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
                  <Link href="#" className="text-xs text-primary hover:underline font-bold">Forgot?</Link>
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
                {loading ? 'Authenticating...' : 'Enter Platform'}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                New to the network?{' '}
                <Link href="/signup" className="text-primary hover:underline font-bold">
                  Join for free
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
