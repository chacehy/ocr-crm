/**
 * Notification Service Placeholder
 * In production, this would integrate with Resend, Postmark, or SendGrid.
 */

export async function sendEmailNotification(to: string, subject: string, template: string, data: any) {
    console.log(`[EMAIL NOTIFICATION] to: ${to}, subject: ${subject}`);
    console.log(`[TEMPLATE] ${template}`, data);

    // Logic to insert into a 'notifications' table for history
    return { success: true, message: 'Notification queued' };
}

export async function notifyNewApplication(recruiterEmail: string, castingTitle: string, talentName: string) {
    return sendEmailNotification(
        recruiterEmail,
        `Nouvelle candidature pour: ${castingTitle}`,
        'new_application',
        { castingTitle, talentName }
    );
}

export async function notifyPaymentSuccess(userEmail: string, planName: string) {
    return sendEmailNotification(
        userEmail,
        `Paiement confirmé - Pack ${planName}`,
        'payment_success',
        { planName }
    );
}
