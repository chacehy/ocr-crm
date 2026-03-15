import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifySignature } from '@chargily/chargily-pay';

/**
 * Chargily Pay V2 Webhook Handler
 */
export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-signature');
        const secretKey = process.env.CHARGILY_SECRET_KEY;

        if (!signature || !secretKey) {
            return NextResponse.json({ error: 'Missing signature or secret key' }, { status: 400 });
        }

        // Verify Signature
        const isValid = verifySignature(Buffer.from(rawBody), signature, secretKey);

        if (!isValid) {
            console.error('Chargily Webhook: Invalid signature');
            return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
        }

        const body = JSON.parse(rawBody);
        const event = body.type;
        const checkout = body.data;

        if (event === 'checkout.paid') {
            const { user_id, plan_id } = checkout.metadata;

            if (!user_id || !plan_id) {
                console.error('Chargily Webhook: Missing metadata in checkout.paid', checkout.metadata);
                return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
            }

            const { createAdminClient } = await import('@/lib/supabase/admin');
            const supabase = createAdminClient();

            console.log('Chargily fulfillment started for user:', user_id, 'plan:', plan_id);

            // Fullfil Payment based on Plan
            if (plan_id === 'freelance') {
                // Increment available castings credit
                const { error } = await supabase.rpc('increment_available_castings', {
                    p_user_id: user_id,
                    amount: 1
                });

                if (error) {
                    console.error('Supabase increment credits error:', error);
                    throw error;
                }
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

                if (error) {
                    console.error('Supabase subscriptions error:', error);
                    throw error;
                }
            }

            console.log('Chargily Webhook: Fulfillment successful for user', user_id, 'Plan:', plan_id);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Chargily Webhook Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
