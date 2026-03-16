'use server'

import { createChargilyCheckout } from '@/lib/payments/chargily';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function initiatePayment(planId: 'freelance' | 'agency_6m' | 'agency_12m') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Define amounts (examples)
    const prices = {
        freelance: 2500, // 2500 DZD for "Casting Express"
        agency_6m: 15000, // 15,000 DZD
        agency_12m: 25000, // 25,000 DZD
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
