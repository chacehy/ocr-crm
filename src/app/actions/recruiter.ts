'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateRecruiterProfile(formData: {
    full_name: string;
    company_name?: string;
    bio?: string;
    photo_url?: string;
    website?: string;
    phone_number?: string;
    whatsapp_number?: string;
    instagram_url?: string;
    facebook_url?: string;
    visibility_settings?: any;
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
        .from('recruiter_profiles')
        .upsert({
            user_id: user.id,
            ...formData,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })

    if (error) {
        console.error('Error updating recruiter profile:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath('/recruiter/' + user.id)
    return { success: true }
}

export async function getRecruiterProfile(userId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('recruiter_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

    if (error && error.code !== 'PGRST116') {
        console.error('Error fetching recruiter profile:', error)
        return null
    }

    return data
}
