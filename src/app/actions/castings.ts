'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function publishCasting(castingId: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'Non autorisé' }
        }

        // 1. Check if user is active (has credits or subscription)
        const { data: statusData, error: statusError } = await supabase.rpc('check_recruiter_active', { p_user_id: user.id })
        if (statusError || !statusData || statusData.length === 0 || !statusData[0].is_active) {
            return { success: false, error: statusData?.[0]?.reason || 'Vous n\'avez pas accès à la publication.' }
        }

        const { access_type } = statusData[0]

        // 2. If access_type is credit, consume 1 credit
        if (access_type === 'credit') {
            const adminClient = createAdminClient()
            const { data: profile } = await adminClient
                .from('profiles')
                .select('available_castings')
                .eq('id', user.id)
                .single()

            if (!profile || (profile.available_castings || 0) <= 0) {
                return { success: false, error: 'Crédits insuffisants.' }
            }

            const { error: consumeError } = await adminClient
                .from('profiles')
                .update({ available_castings: (profile.available_castings || 0) - 1 })
                .eq('id', user.id)

            if (consumeError) {
                console.error('Error consuming credit:', consumeError)
                return { success: false, error: 'Erreur lors de la consommation du crédit.' }
            }
        }

        // 3. Update casting status and expiry date
        const days = access_type === 'credit' ? 10 : 30
        const timeToAdd = days * 24 * 60 * 60 * 1000

        const { data: currentCasting } = await supabase
            .from('castings')
            .select('expiry_date, status')
            .eq('id', castingId)
            .single()

        let baseDate = Date.now()
        // Stack time only if it's a credit and the casting is currently open and not yet expired
        if (access_type === 'credit' && currentCasting?.status === 'open' && currentCasting.expiry_date) {
            const currentExpiry = new Date(currentCasting.expiry_date).getTime()
            if (currentExpiry > Date.now()) {
                baseDate = currentExpiry
            }
        }

        const expiryDateStr = new Date(baseDate + timeToAdd).toISOString()

        const { error: updateError } = await supabase
            .from('castings')
            .update({ status: 'open', expiry_date: expiryDateStr })
            .eq('id', castingId)
            .eq('recruiter_id', user.id)

        if (updateError) {
            console.error('Error publishing casting:', updateError)
            return { success: false, error: 'Erreur lors de la publication du casting.' }
        }

        revalidatePath('/dashboard/recruiter/my-castings')
        return { success: true }

    } catch (error: any) {
        console.error('Publish error:', error)
        return { success: false, error: 'Une erreur interne est survenue.' }
    }
}
