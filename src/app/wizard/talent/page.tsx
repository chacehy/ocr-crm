'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Upload, X, CheckCircle2, Film, ArrowRight } from 'lucide-react'

// Constants
const CITIES = ['Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Batna', 'Sétif', 'Chlef', 'Djelfa', 'Sidi Bel Abbès']
const CATEGORIES = ['Actor', 'Model', 'Dancer', 'Voice Over', 'Extra', 'Influencer', 'Singer']
const LANGUAGES = [
  { id: 'AR', label: 'Arabic' },
  { id: 'DZ', label: 'Derja' },
  { id: 'KAB', label: 'Kabyle' },
  { id: 'FR', label: 'French' },
  { id: 'EN', label: 'English' },
]

export default function TalentWizard() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    city: '',
    gender: 'any',
    age_play_min: 18,
    age_play_max: 30,
    categories: [] as string[],
    languages: [] as string[],
    bio: '',
    video_url: '',
    main_photo: null as File | null,
    gallery: [] as File[],
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) router.push('/login')
      setUser(user)
    }
    getUser()
  }, [])

  const nextStep = () => setStep(step + 1)
  const prevStep = () => setStep(step - 1)

  const handleUpload = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${user.id}/${path}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('talent-media')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('talent-media').getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // 1. Upload Main Photo
      let main_photo_url = ''
      if (formData.main_photo) {
        main_photo_url = await handleUpload(formData.main_photo, 'profile')
      }

      // 2. Upload Gallery
      const gallery_photo_urls = []
      for (const file of formData.gallery) {
        const url = await handleUpload(file, 'gallery')
        gallery_photo_urls.push(url)
      }

      // 3. Create Talent Profile
      const { error: profileError } = await supabase.from('talent_profiles').insert({
        user_id: user.id,
        full_name: formData.full_name,
        city: formData.city,
        gender: formData.gender,
        age_play_min: formData.age_play_min,
        age_play_max: formData.age_play_max,
        categories: formData.categories,
        languages: formData.languages,
        bio: formData.bio,
        main_photo_url,
        gallery_photo_urls,
      })

      if (profileError) throw profileError

      // 4. Update Profile Video (if any)
      if (formData.video_url) {
        const { data: profile } = await supabase.from('talent_profiles').select('id').eq('user_id', user.id).single()
        if (profile) {
          await supabase.from('talent_videos').insert({
            talent_profile_id: profile.id,
            type: 'showreel',
            url: formData.video_url,
            title: 'My Video Demo',
          })
        }
      }

      toast.success('Your profile is now live in the spotlight!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 rounded-full blur-[120px] -mt-40 pointer-events-none" />

      <div className="w-full max-w-2xl relative z-10">
        <div className="flex justify-center mb-10">
           <div className="text-3xl font-bold tracking-tighter text-primary flex items-center gap-2">
             <Film className="w-7 h-7" />
             <span>CastingConnect<span className="text-foreground">DZ</span></span>
          </div>
        </div>

        <div className="mb-12 flex justify-between items-center px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= s ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(251,191,36,0.4)]' : 'bg-muted text-muted-foreground'}`}>
                {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
              </div>
              <span className={`text-sm font-bold uppercase tracking-widest hidden sm:block ${step >= s ? 'text-primary' : 'text-muted-foreground'}`}>
                {s === 1 ? 'Identity' : s === 2 ? 'Professional' : 'Media'}
              </span>
              {s < 3 && <div className={`h-[2px] w-8 sm:w-20 transition-all duration-500 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} key="step1">
              <Card className="rounded-2xl border-border/40 shadow-2xl bg-card/50 backdrop-blur-xl overflow-hidden">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold">Identity</CardTitle>
                  <CardDescription className="text-base text-muted-foreground uppercase tracking-widest font-medium">Step 1 of 3</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-4">
                  <div className="grid gap-3">
                    <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Full Name</Label>
                    <Input placeholder="John Doe" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} className="rounded-xl h-14 bg-background border-border text-lg focus:ring-primary/20 transition-all" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="grid gap-3">
                      <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">City</Label>
                      <Select value={formData.city} onValueChange={v => setFormData({ ...formData, city: v })}>
                        <SelectTrigger className="rounded-xl h-14 bg-background border-border text-lg"><SelectValue placeholder="Select city" /></SelectTrigger>
                        <SelectContent className="rounded-xl border-border">{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3">
                      <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Gender</Label>
                      <Select value={formData.gender} onValueChange={v => setFormData({ ...formData, gender: v })}>
                        <SelectTrigger className="rounded-xl h-14 bg-background border-border text-lg"><SelectValue placeholder="Gender" /></SelectTrigger>
                        <SelectContent className="rounded-xl border-border">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="any">Other / Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-3">
                      <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Min Play Age</Label>
                      <Input type="number" value={formData.age_play_min} onChange={e => setFormData({ ...formData, age_play_min: parseInt(e.target.value) })} className="rounded-xl h-14 bg-background border-border text-lg focus:ring-primary/20" />
                    </div>
                    <div className="grid gap-3">
                      <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Max Play Age</Label>
                      <Input type="number" value={formData.age_play_max} onChange={e => setFormData({ ...formData, age_play_max: parseInt(e.target.value) })} className="rounded-xl h-14 bg-background border-border text-lg focus:ring-primary/20" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-8 border-t border-border/40 flex justify-end bg-muted/20">
                  <Button onClick={nextStep} disabled={!formData.full_name || !formData.city} className="rounded-xl px-12 bg-primary text-primary-foreground h-14 text-lg font-bold shadow-[0_4px_20px_rgba(251,191,36,0.2)] hover:opacity-90 transition-all">Continue <ArrowRight className="ml-2 w-5 h-5" /></Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} key="step2">
              <Card className="rounded-2xl border-border/40 shadow-2xl bg-card/50 backdrop-blur-xl overflow-hidden">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold">Professional</CardTitle>
                  <CardDescription className="text-base text-muted-foreground uppercase tracking-widest font-medium">Step 2 of 3</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-4">
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">My Categories</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {CATEGORIES.map(cat => (
                        <div key={cat} className={`flex items-center justify-center p-4 rounded-xl border-2 transition-all cursor-pointer ${formData.categories.includes(cat) ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background text-muted-foreground hover:border-primary/40'}`}
                             onClick={() => {
                               if (formData.categories.includes(cat)) setFormData({ ...formData, categories: formData.categories.filter(c => c !== cat) })
                               else setFormData({ ...formData, categories: [...formData.categories, cat] })
                             }}>
                          <span className="text-sm font-bold tracking-wide">{cat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Languages I Speak</Label>
                    <div className="flex flex-wrap gap-3">
                      {LANGUAGES.map(lang => (
                        <div key={lang.id} className={`px-5 py-3 rounded-full border-2 transition-all cursor-pointer ${formData.languages.includes(lang.id) ? 'border-primary bg-primary text-primary-foreground font-bold shadow-lg' : 'border-border bg-background text-muted-foreground'}`}
                             onClick={() => {
                               if (formData.languages.includes(lang.id)) setFormData({ ...formData, languages: formData.languages.filter(l => l !== lang.id) })
                               else setFormData({ ...formData, languages: [...formData.languages, lang.id] })
                             }}>
                          <span className="text-sm uppercase tracking-tighter">{lang.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-3 pt-4">
                    <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">My Bio</Label>
                    <textarea 
                      placeholder="Briefly describe your experience, training, and what makes you unique..." 
                      value={formData.bio} 
                      onChange={e => setFormData({ ...formData, bio: e.target.value })} 
                      className="rounded-xl min-h-[120px] p-4 bg-background border border-border text-lg focus:ring-primary/20 outline-none w-full resize-none transition-all" 
                    />
                  </div>
                </CardContent>
                <CardFooter className="p-8 border-t border-border/40 flex justify-between bg-muted/20">
                  <Button variant="ghost" onClick={prevStep} className="rounded-xl px-10 h-14 font-bold text-lg hover:text-primary transition-colors">Back</Button>
                  <Button onClick={nextStep} disabled={formData.categories.length === 0} className="rounded-xl px-12 bg-primary text-primary-foreground h-14 text-lg font-bold shadow-[0_4px_20px_rgba(251,191,36,0.2)] hover:opacity-90 transition-all">Next Step <ArrowRight className="ml-2 w-5 h-5" /></Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} key="step3">
              <Card className="rounded-2xl border-border/40 shadow-2xl bg-card/50 backdrop-blur-xl overflow-hidden">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl font-bold">Media</CardTitle>
                  <CardDescription className="text-base text-muted-foreground uppercase tracking-widest font-medium">Step 3 of 3</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8 pt-4">
                  <div className="grid gap-3">
                    <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Main Profile Photo</Label>
                    {!formData.main_photo ? (
                      <Label htmlFor="main_photo" className="border-3 border-dashed border-border rounded-2xl p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all">
                        <Upload className="w-12 h-12 text-primary shadow-[0_0_10px_rgba(251,191,36,0.2)]" />
                        <div className="text-center">
                          <span className="text-lg font-bold block mb-1">Click to browse</span>
                          <span className="text-sm text-muted-foreground">High-quality portrait recommended</span>
                        </div>
                        <Input id="main_photo" type="file" className="hidden" accept="image/*" onChange={e => setFormData({ ...formData, main_photo: e.target.files?.[0] || null })} />
                      </Label>
                    ) : (
                      <div className="relative w-48 h-64 rounded-2xl overflow-hidden shadow-2xl mx-auto group ring-4 ring-primary/20">
                        <img src={URL.createObjectURL(formData.main_photo)} alt="Preview" className="w-full h-full object-cover" />
                        <button onClick={() => setFormData({ ...formData, main_photo: null })} className="absolute top-3 right-3 bg-red-500 p-2 rounded-xl text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-3 pt-4">
                    <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Video Showreel Link (YouTube/Vimeo)</Label>
                    <Input placeholder="https://youtube.com/watch?v=..." value={formData.video_url} onChange={e => setFormData({ ...formData, video_url: e.target.value })} className="rounded-xl h-14 bg-background border-border text-lg focus:ring-primary/20 transition-all" />
                  </div>

                  <div className="grid gap-3 pt-4">
                    <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Portfolio Gallery (Max 5)</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                      {formData.gallery.map((f, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-border shadow-lg">
                          <img src={URL.createObjectURL(f)} alt="Gallery Preview" className="w-full h-full object-cover" />
                          <button onClick={() => setFormData({ ...formData, gallery: formData.gallery.filter((_, idx) => idx !== i) })} className="absolute top-1 right-1 bg-red-500/80 p-1.5 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-all">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {formData.gallery.length < 5 && (
                        <Label htmlFor="gallery" className="aspect-square border-2 border-dashed border-border rounded-xl flex items-center justify-center cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all">
                          <Upload className="w-6 h-6 text-muted-foreground" />
                          <Input id="gallery" type="file" className="hidden" accept="image/*" multiple onChange={e => {
                            const files = Array.from(e.target.files || [])
                            setFormData({ ...formData, gallery: [...formData.gallery, ...files].slice(0, 5) })
                          }} />
                        </Label>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-8 border-t border-border/40 flex justify-between bg-muted/20">
                  <Button variant="ghost" onClick={prevStep} className="rounded-xl px-10 h-14 font-bold text-lg hover:text-primary transition-colors">Back</Button>
                  <Button onClick={handleSubmit} disabled={loading || !formData.main_photo} className="rounded-xl px-12 bg-primary text-primary-foreground h-14 text-lg font-bold shadow-[0_4px_25px_rgba(251,191,36,0.4)] hover:opacity-90 transition-all">
                    {loading ? <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Publishing...</> : 'Launch My Profile'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
