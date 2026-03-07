'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleShortlist(talentId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    // Check if exists
    const { data: existing } = await supabase
        .from('shortlists')
        .select('id')
        .eq('recruiter_id', user.id)
        .eq('talent_id', talentId)
        .single();

    if (existing) {
        await supabase.from('shortlists').delete().eq('id', existing.id);
        revalidatePath('/talents');
        return { status: 'removed' };
    } else {
        await supabase.from('shortlists').insert({
            recruiter_id: user.id,
            talent_id: talentId
        });
        revalidatePath('/talents');
        return { status: 'added' };
    }
}

export async function updateShortlistNotes(talentId: string, notes: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Unauthorized');

    const { error } = await supabase
        .from('shortlists')
        .update({ notes })
        .eq('recruiter_id', user.id)
        .eq('talent_id', talentId);

    if (error) throw error;
    return { success: true };
}
