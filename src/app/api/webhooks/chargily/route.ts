import { NextResponse } from 'next/server';
import { verifySignature } from '@chargily/chargily-pay';

/**
 * Chargily Pay V2 Webhook Handler
 */
export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        // Chargily sends the HMAC signature in the 'signature' header (not 'x-signature')
        const signature = req.headers.get('signature');
        const secretKey = process.env.CHARGILY_SECRET_KEY;

        if (!signature || !secretKey) {
            console.error('Chargily Webhook: Missing signature or secret key', {
                hasSignature: !!signature,
                hasSecretKey: !!secretKey,
            });
            return NextResponse.json({ error: 'Missing signature or secret key' }, { status: 400 });
        }

        // Verify Signature — SDK throws on invalid, so wrap in try/catch
        try {
            verifySignature(Buffer.from(rawBody), signature, secretKey);
        } catch (sigError: any) {
            console.error('Chargily Webhook: Invalid signature', sigError.message);
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
                // Check for existing active subscription
                const { data: existingSub } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user_id)
                    .eq('status', 'active')
                    .gte('end_date', new Date().toISOString())
                    .order('end_date', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                const months = plan_id === 'agency_6m' ? 6 : 12;
                const timeToAdd = months * 30 * 24 * 60 * 60 * 1000;

                let newStartDate = new Date();
                let newEndDate = new Date(Date.now() + timeToAdd);

                // If user currently has an active subscription, stack the time
                if (existingSub) {
                    newStartDate = new Date(existingSub.start_date);
                    newEndDate = new Date(new Date(existingSub.end_date).getTime() + timeToAdd);

                    // Delete the old sub or just update it, let's update it or just let it be and insert new
                    // Better to update the existing one if we want to keep one active row, or invalidate old ones
                    await supabase.from('subscriptions').update({ status: 'replaced' }).eq('id', existingSub.id);
                }

                // Create/Update Subscription
                const { error: subError } = await supabase
                    .from('subscriptions')
                    .insert({
                        user_id,
                        plan: plan_id,
                        start_date: newStartDate.toISOString(),
                        end_date: newEndDate.toISOString(),
                        status: 'active'
                    });

                if (subError) {
                    console.error('Supabase subscriptions error:', subError);
                    throw subError;
                }

                // Upgrade user role to agency in profiles
                const { error: profileError } = await supabase
                    .from('profiles')
                    .update({ recruiter_subtype: 'agency' })
                    .eq('id', user_id);

                if (profileError) {
                    console.error('Supabase profile upgrade error:', profileError);
                }
            } else if (plan_id.startsWith('talent_')) {
                // Handle talent subscription
                const { data: existingSub } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', user_id)
                    .eq('status', 'active')
                    .gte('end_date', new Date().toISOString())
                    .order('end_date', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                const timeToAdd = 365 * 24 * 60 * 60 * 1000; // 1 year

                let newStartDate = new Date();
                let newEndDate = new Date(Date.now() + timeToAdd);

                // Stack time if existing active subscription
                if (existingSub) {
                    newStartDate = new Date(existingSub.start_date);
                    newEndDate = new Date(new Date(existingSub.end_date).getTime() + timeToAdd);
                    await supabase.from('subscriptions').update({ status: 'replaced' }).eq('id', existingSub.id);
                }

                const { error: subError } = await supabase
                    .from('subscriptions')
                    .insert({
                        user_id,
                        plan: plan_id,
                        start_date: newStartDate.toISOString(),
                        end_date: newEndDate.toISOString(),
                        status: 'active'
                    });

                if (subError) {
                    console.error('Supabase talent subscription error:', subError);
                    throw subError;
                }

                // If Pro plan, add 2 training credits
                if (plan_id === 'talent_pro') {
                    const { data: talentProfile } = await supabase
                        .from('talent_profiles')
                        .select('training_credits')
                        .eq('user_id', user_id)
                        .single();

                    if (talentProfile) {
                        await supabase
                            .from('talent_profiles')
                            .update({ training_credits: (talentProfile.training_credits || 0) + 2 })
                            .eq('user_id', user_id);
                    }
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
