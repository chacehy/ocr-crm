'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useAuth() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    async function signUp(email: string, password: string, metadata: any) {
        setLoading(true)
        setError(null)
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata,
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })
        setLoading(false)
        if (signUpError) setError(signUpError.message)
        return { error: signUpError }
    }

    async function signIn(email: string, password: string) {
        setLoading(true)
        setError(null)
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        setLoading(false)
        if (signInError) setError(signInError.message)
        return { error: signInError }
    }

    async function signOut() {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/')
    }

    return { signUp, signIn, signOut, loading, error }
}
