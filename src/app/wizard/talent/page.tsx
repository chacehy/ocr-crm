import TalentWizard from '@/components/talent/talent-wizard'

export default function TalentWizardPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[120px] -mt-40 pointer-events-none" />
      
      <TalentWizard />
    </div>
  )
}
