// =====================================================
// SHOP SYSTEM CONFIGURATION
// =====================================================

import { supabaseRevision } from './config-revision.js';

export const supabaseShop = supabaseRevision;

// Product Categories
export const PRODUCT_CATEGORIES = {
    template: 'Templates',
    brush: 'Brushes & Assets',
    preset: 'Presets',
    font: 'Fonts',
    mockup: 'Mockups',
    course: 'Online Courses',
    ebook: 'E-Books & Guides',
    other: 'Other'
};

// Order Status
export const ORDER_STATUS = {
    pending: 'Payment Pending',
    confirmed: 'Payment Confirmed',
    delivered: 'Delivered',
    cancelled: 'Cancelled'
};

// Admin login ကို Supabase table ကနေ verify လုပ်မယ်
export async function verifyAdminCode(code) {
    const { data } = await supabaseShop
        .from('admin_auth')
        .select('role')
        .eq('role', 'shop_admin')
        .eq('access_code', code)
        .single();
    return !!data;
}
