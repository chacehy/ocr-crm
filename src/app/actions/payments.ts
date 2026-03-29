'use server'

import { createChargilyCheckout } from '@/lib/payments/chargily';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

type PlanId = 'freelance' | 'agency_6m' | 'agency_12m' | 'talent_basic' | 'talent_premium' | 'talent_pro';

export async function initiatePayment(planId: PlanId) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Define amounts
    const prices: Record<PlanId, number> = {
        freelance: 2500,
        agency_6m: 15000,
        agency_12m: 25000,
        talent_basic: 2000,
        talent_premium: 5000,
        talent_pro: 12000,
    };

    const amount = prices[planId];

    // Create Chargily Checkout
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://castingconnectdz.vercel.app';
    const response = await createChargilyCheckout({
        amount,
        success_url: `${appUrl}/dashboard/payment-success`,
        failure_url: `${appUrl}/pricing`,
        webhook_endpoint: `${appUrl}/api/webhooks/chargily`,
        metadata: {
            user_id: user.id,
            plan_id: planId,
        },
        email: user.email,
        name: user.user_metadata?.full_name || 'User',
    });

    if (response.success && response.url) {
        redirect(response.url);
    }

    return { error: response.message };
}

