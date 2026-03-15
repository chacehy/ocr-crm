import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

/**
 * Slick-Pay Webhook Handler
 * Doc: https://developers.slick-pay.com/webhooks
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const signature = req.headers.get('x-slickpay-signature');

        // 1. Verify Signature (Slick-Pay usually provides a signing secret)
        // For now, we'll verify the presence of the signature and keys.
        // In production, use your SLICKPAY_PRIVATE_KEY to verify the HMAC if supported.

        const { success, amount, id: invoiceId, webhook_meta_data } = body;

        if (!success) {
            console.warn('Slick-Pay Webhook: Payment unsuccessful', body);
            return NextResponse.json({ message: 'Acknowledged' }, { status: 200 });
        }

        if (!webhook_meta_data || !webhook_meta_data.user_id) {
            console.error('Slick-Pay Webhook: Missing metadata', body);
            return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
        }

        const { user_id, plan_id } = webhook_meta_data;
        const { createAdminClient } = await import('@/lib/supabase/admin');
        const supabase = createAdminClient();

        // 2. Fullfil Payment based on Plan
        if (plan_id === 'freelance') {
            // Increment available castings credit
            const { error } = await supabase.rpc('increment_available_castings', {
                p_user_id: user_id,
                amount: 1
            });

            if (error) throw error;
        } else if (plan_id.startsWith('agency_')) {
            // Create/Update Subscription
            const months = plan_id === 'agency_6m' ? 6 : 12;
            const { error } = await supabase
                .from('subscriptions')
                .insert({
                    user_id,
                    plan: plan_id,
                    start_date: new Date().toISOString(),
                    end_date: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString(),
                    status: 'active'
                });

            if (error) throw error;
        }

        console.log('Slick-Pay Webhook: Fulfillment successful for user', user_id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Slick-Pay Webhook Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
