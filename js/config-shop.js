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

// =====================================================
// 🔐 GOOGLE AUTH FUNCTIONS (Customer Dashboard)
// =====================================================

export async function signInWithGoogle() {
    const { data, error } = await supabaseShop.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/auth/callback'
        }
    });
    return { data, error };
}

export async function signOutCustomer() {
    const { error } = await supabaseShop.auth.signOut();
    return { error };
}

export async function getAuthSession() {
    const { data: { session } } = await supabaseShop.auth.getSession();
    return session;
}

export function onAuthChange(callback) {
    return supabaseShop.auth.onAuthStateChange(callback);
}

// =====================================================
// 📧 EMAIL/PASSWORD AUTH FUNCTIONS
// =====================================================

export async function signUpWithEmail(email, password, fullName) {
    const { data, error } = await supabaseShop.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            },
            emailRedirectTo: window.location.origin + '/auth/callback'
        }
    });
    return { data, error };
}

export async function signInWithEmail(email, password) {
    const { data, error } = await supabaseShop.auth.signInWithPassword({
        email,
        password
    });
    return { data, error };
}

export async function resetPassword(email) {
    const { data, error } = await supabaseShop.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
    });
    return { data, error };
}

// =====================================================
// 👤 FIND OR CREATE CUSTOMER (Google + Email support)
// =====================================================

export async function findOrCreateCustomer(user) {
    console.log('🔍 findOrCreateCustomer called for:', user.email);

    const provider = user.app_metadata?.provider || 'email';

    const { data: existing, error: fetchError } = await supabaseShop
        .from('shop_customers')
        .select('*')
        .eq('email', user.email)
        .maybeSingle();

    if (fetchError) {
        console.error('❌ Fetch customer error:', fetchError);
        throw fetchError;
    }

    if (existing) {
        if (existing.auth_provider !== provider) {
            await supabaseShop
                .from('shop_customers')
                .update({
                    auth_provider: provider,
                    auth_uid: user.id,
                    avatar_url: user.user_metadata?.avatar_url || existing.avatar_url || null
                })
                .eq('id', existing.id);
            existing.auth_provider = provider;
            existing.avatar_url = user.user_metadata?.avatar_url || existing.avatar_url || null;
        }
        return existing;
    }

    const prefix = provider === 'google' ? 'G-' : 'E-';
    const autoCode = prefix + Math.random().toString(36).substr(2, 6).toUpperCase();
    const { data: newCustomer, error } = await supabaseShop
        .from('shop_customers')
        .insert([{
            name: user.user_metadata?.full_name || user.email.split('@')[0],
            email: user.email,
            phone: user.phone || '',
            access_code: autoCode,
            is_active: true,
            auth_provider: provider,
            auth_uid: user.id,
            avatar_url: user.user_metadata?.avatar_url || null
        }])
        .select()
        .single();

    if (error) {
        console.error('Create customer error:', error);
        throw error;
    }
    return newCustomer;
}