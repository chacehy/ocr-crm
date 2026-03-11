import TalentWizard from '@/components/talent/talent-wizard'
import { Film } from 'lucide-react'
import Link from 'next/link'

export default function EditProfilePage() {
  return (
    <div className="min-h-screen bg-background p-6 sm:p-10 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none" />
      
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <Link href="/dashboard" className="text-2xl font-bold tracking-tighter text-primary flex items-center gap-2">
            <Film className="w-6 h-6" />
            <span>CastingConnect<span className="text-foreground">DZ</span></span>
          </Link>
          <div className="text-right">
             <h1 className="text-2xl font-bold">Modifier votre profil</h1>
             <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest">Édition Talent</p>
          </div>
        </div>

        <TalentWizard isEditing={true} />
      </div>
    </div>
  )
}
