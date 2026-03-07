import axios from 'axios';

const SLICKPAY_PUBLIC_KEY = process.env.NEXT_PUBLIC_SLICKPAY_PUBLIC_KEY;
const SLICKPAY_PRIVATE_KEY = process.env.SLICKPAY_PRIVATE_KEY;
const SLICKPAY_BASE_URL = process.env.NEXT_PUBLIC_SLICKPAY_BASE_URL || 'https://devapi.slick-pay.com/api/v2';

const slickpayClient = axios.create({
    baseURL: SLICKPAY_BASE_URL,
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${SLICKPAY_PUBLIC_KEY}`, // Note: Docs sometimes require Public Hub key for frontend or Private for backend. Using Public for now as found in browser search.
    },
});

export interface SlickPayInvoiceRequest {
    amount: number;
    url: string; // Return URL
    webhook_url?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    address?: string;
    items?: any[];
    webhook_meta_data?: any;
}

export interface SlickPayInvoiceResponse {
    success: boolean;
    message: string;
    id: number;
    url: string; // The URL to redirect the user to
    errors?: any;
}

/**
 * Create a Slick-Pay Invoice (SATIM/CIB Payment)
 */
export async function createSlickPayInvoice(data: SlickPayInvoiceRequest): Promise<SlickPayInvoiceResponse> {
    try {
        const response = await axios.post(`${SLICKPAY_BASE_URL}/users/invoices`, data, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${SLICKPAY_PRIVATE_KEY || SLICKPAY_PUBLIC_KEY}`,
            },
        });

        if (response.data.success) {
            return {
                success: true,
                message: response.data.message,
                id: response.data.id,
                url: response.data.url,
            };
        }

        return {
            success: false,
            message: response.data.message || 'Invoice creation failed',
            id: 0,
            url: '',
            errors: response.data.errors,
        };
    } catch (error: any) {
        console.error('Slick-Pay Invoice Error:', error.response?.data || error.message);
        return {
            success: false,
            message: error.response?.data?.message || 'An unexpected error occurred with Slick-Pay',
            id: 0,
            url: '',
            errors: error.response?.data?.errors,
        };
    }
}

/**
 * Verify Invoice Status
 */
export async function getInvoiceStatus(id: number | string) {
    try {
        const response = await axios.get(`${SLICKPAY_BASE_URL}/users/invoices/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${SLICKPAY_PRIVATE_KEY || SLICKPAY_PUBLIC_KEY}`,
            },
        });
        return response.data;
    } catch (error: any) {
        console.error('Slick-Pay Status Error:', error.response?.data || error.message);
        return null;
    }
}
