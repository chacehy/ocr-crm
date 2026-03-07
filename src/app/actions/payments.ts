'use server'

import { createSlickPayInvoice } from '@/lib/payments/slickpay';
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

    // Create Slick-Pay Invoice
    const response = await createSlickPayInvoice({
        amount,
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/payment-success`,
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/webhooks/slickpay`,
        email: user.email,
        firstname: user.user_metadata?.full_name?.split(' ')[0] || 'User',
        lastname: user.user_metadata?.full_name?.split(' ')[1] || 'Guest',
        webhook_meta_data: {
            user_id: user.id,
            plan_id: planId,
        },
    });

    if (response.success && response.url) {
        redirect(response.url);
    }

    return { error: response.message };
}
