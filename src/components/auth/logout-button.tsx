'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error('Erreur lors de la déconnexion')
    } else {
      toast.success('Déconnecté')
      // Force refresh and redirect
      window.location.href = '/'
    }
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="rounded-xl hover:bg-primary/10 text-primary"
      onClick={handleLogout}
    >
       <LogOut className="w-5 h-5" />
    </Button>
  )
}
