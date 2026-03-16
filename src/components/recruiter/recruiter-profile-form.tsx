'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Upload, X, Save, Globe, Building2, User, Phone, Instagram, Facebook, MessageSquare } from 'lucide-react'
import { updateRecruiterProfile, getRecruiterProfile } from '@/app/actions/recruiter'
import { Checkbox } from '@/components/ui/checkbox'

export default function RecruiterProfileForm() {
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    company_name: '',
    bio: '',
    website: '',
    phone_number: '',
    whatsapp_number: '',
    instagram_url: '',
    facebook_url: '',
    photo: null as File | null,
    photo_url: '',
    visibility_settings: {
      phone: true,
      whatsapp: true,
      instagram: true,
      facebook: true,
      email: true
    }
  })
  const [subtype, setSubtype] = useState<'freelance' | 'agency' | null>(null)
  
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: profileBase } = await supabase.from('profiles').select('recruiter_subtype').eq('id', user.id).single()
      if (profileBase) {
        setSubtype(profileBase.recruiter_subtype as any)
      }

      const profile = await getRecruiterProfile(user.id)
      if (profile) {
        setFormData({
          full_name: profile.full_name || '',
          company_name: profile.company_name || '',
          bio: profile.bio || '',
          website: profile.website || '',
          phone_number: profile.phone_number || '',
           whatsapp_number: profile.whatsapp_number || '',
          instagram_url: profile.instagram_url || '',
          facebook_url: profile.facebook_url || '',
          photo: null,
          photo_url: profile.photo_url || '',
          visibility_settings: profile.visibility_settings || {
            phone: true,
            whatsapp: true,
            instagram: true,
            facebook: true,
            email: true
          }
        })
      }
      setInitializing(false)
    }
    init()
  }, [])

  const handleUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${user.id}/profile/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('recruiter-media')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('recruiter-media').getPublicUrl(filePath)
    return data.publicUrl
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      let final_photo_url = formData.photo_url
      if (formData.photo) {
        final_photo_url = await handleUpload(formData.photo)
      }

      const res = await updateRecruiterProfile({
        full_name: formData.full_name,
        company_name: formData.company_name,
        bio: formData.bio,
        website: formData.website,
        photo_url: final_photo_url,
        phone_number: formData.phone_number,
        whatsapp_number: formData.whatsapp_number,
        instagram_url: formData.instagram_url,
        facebook_url: formData.facebook_url,
        visibility_settings: formData.visibility_settings,
      })

      if (res.success) {
        toast.success('Profil mis à jour !')
        router.push('/dashboard')
        router.refresh()
      } else {
        toast.error(res.error || 'Erreur lors de la mise à jour')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (initializing) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse text-sm uppercase tracking-widest font-bold">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <Card className="rounded-2xl border-border/40 shadow-2xl bg-card/50 backdrop-blur-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6 text-primary" /> Identité Professionnelle
          </CardTitle>
          <CardDescription className="uppercase tracking-widest font-medium text-xs">Ces informations seront visibles par les talents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="grid gap-3">
            <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Photo de Profil / Logo</Label>
            {!formData.photo && !formData.photo_url ? (
              <Label htmlFor="photo_upload" className="border-3 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all">
                <Upload className="w-10 h-10 text-primary" />
                <div className="text-center">
                  <span className="text-sm font-bold block">Charger une photo</span>
                  <span className="text-xs text-muted-foreground">Format carré recommandé</span>
                </div>
                <Input id="photo_upload" type="file" className="hidden" accept="image/*" onChange={e => setFormData({ ...formData, photo: e.target.files?.[0] || null })} />
              </Label>
            ) : (
              <div className="relative w-40 h-40 rounded-2xl overflow-hidden shadow-xl mx-auto group ring-4 ring-primary/20">
                <img src={formData.photo ? URL.createObjectURL(formData.photo) : formData.photo_url} alt="Preview" className="w-full h-full object-cover" />
                <button onClick={() => setFormData({ ...formData, photo: null, photo_url: '' })} className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-lg text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {subtype !== 'agency' && (
            <div className="grid gap-3">
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Nom Complet</Label>
              <Input 
                placeholder="Votre nom ou le nom du contact" 
                value={formData.full_name} 
                onChange={e => setFormData({ ...formData, full_name: e.target.value })} 
                className="rounded-xl h-12 bg-background border-border" 
              />
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-3">
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex justify-between">
                <span>Téléphone</span>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Checkbox 
                    id="show_phone" 
                    checked={formData.visibility_settings.phone} 
                    onCheckedChange={(checked) => setFormData({ ...formData, visibility_settings: { ...formData.visibility_settings, phone: !!checked } })}
                  />
                  <span className="text-[10px] normal-case font-normal">Public</span>
                </div>
              </Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="0XXX XX XX XX" 
                  value={formData.phone_number} 
                  onChange={e => setFormData({ ...formData, phone_number: e.target.value })} 
                  className="rounded-xl h-12 bg-background border-border pl-12" 
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex justify-between">
                <span>WhatsApp</span>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Checkbox 
                    id="show_whatsapp" 
                    checked={formData.visibility_settings.whatsapp} 
                    onCheckedChange={(checked) => setFormData({ ...formData, visibility_settings: { ...formData.visibility_settings, whatsapp: !!checked } })}
                  />
                  <span className="text-[10px] normal-case font-normal">Public</span>
                </div>
              </Label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Ex: 213XXXXXXXXX" 
                  value={formData.whatsapp_number} 
                  onChange={e => setFormData({ ...formData, whatsapp_number: e.target.value })} 
                  className="rounded-xl h-12 bg-background border-border pl-12" 
                />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="grid gap-3">
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex justify-between">
                <span>Instagram</span>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Checkbox 
                    id="show_instagram" 
                    checked={formData.visibility_settings.instagram} 
                    onCheckedChange={(checked) => setFormData({ ...formData, visibility_settings: { ...formData.visibility_settings, instagram: !!checked } })}
                  />
                  <span className="text-[10px] normal-case font-normal">Public</span>
                </div>
              </Label>
              <div className="relative">
                <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="username" 
                  value={formData.instagram_url} 
                  onChange={e => setFormData({ ...formData, instagram_url: e.target.value })} 
                  className="rounded-xl h-12 bg-background border-border pl-12" 
                />
              </div>
            </div>

            <div className="grid gap-3">
              <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground flex justify-between">
                <span>Facebook</span>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Checkbox 
                    id="show_facebook" 
                    checked={formData.visibility_settings.facebook} 
                    onCheckedChange={(checked) => setFormData({ ...formData, visibility_settings: { ...formData.visibility_settings, facebook: !!checked } })}
                  />
                  <span className="text-[10px] normal-case font-normal">Public</span>
                </div>
              </Label>
              <div className="relative">
                <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="URL profil" 
                  value={formData.facebook_url} 
                  onChange={e => setFormData({ ...formData, facebook_url: e.target.value })} 
                  className="rounded-xl h-12 bg-background border-border pl-12" 
                />
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Nom de l'Agence / Entreprise</Label>
            <div className="relative">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Ex: Casting DZ Productions" 
                value={formData.company_name} 
                onChange={e => setFormData({ ...formData, company_name: e.target.value })} 
                className="rounded-xl h-12 bg-background border-border pl-12" 
              />
            </div>
          </div>

          <div className="grid gap-3">
            <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Site Web / Portfolio</Label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="https://votre-site.com" 
                value={formData.website} 
                onChange={e => setFormData({ ...formData, website: e.target.value })} 
                className="rounded-xl h-12 bg-background border-border pl-12" 
              />
            </div>
          </div>

          <div className="grid gap-3">
            <Label className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Présentation / Bio</Label>
            <textarea 
              placeholder="Présentez votre agence ou votre parcours de recruteur..." 
              value={formData.bio} 
              onChange={e => setFormData({ ...formData, bio: e.target.value })} 
              className="rounded-xl min-h-[120px] p-4 bg-background border border-border text-base outline-none w-full resize-none focus:ring-2 focus:ring-primary/20 transition-all" 
            />
          </div>
        </CardContent>
        <CardFooter className="p-8 border-t border-border/40 flex justify-between bg-muted/20">
          <Button variant="ghost" onClick={() => router.push('/dashboard')} className="rounded-xl px-8 h-12 font-bold hover:text-primary transition-colors">Annuler</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading || (subtype !== 'agency' && !formData.full_name) || (subtype === 'agency' && !formData.company_name)} 
            className="rounded-xl px-10 bg-primary text-black h-12 font-bold shadow-lg hover:opacity-90 transition-all"
          >
            {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Enregistrement...</> : <><Save className="w-5 h-5 mr-2" /> Enregistrer</>}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
