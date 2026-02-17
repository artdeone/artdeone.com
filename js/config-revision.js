// =====================================================
// REVISION SYSTEM CONFIGURATION
// =====================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://eyhyvlszpfsmsjyzijxg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aHl2bHN6cGZzbXNqeXppanhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1Mzc3MDcsImV4cCI6MjA4NDExMzcwN30.rvU2oh0zmdLVaAZFjqgQvKInX1ePCQudK9cBT4hiv80';

// Revision System အတွက် Supabase Client
export const supabaseRevision = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        lock: false,
        storageKey: 'sb-artdeone-auth'
    }
});

// Package Configuration
export const PACKAGES = {
  essential: {
    name: 'Essential',
    name_mm: 'အခြေခံ',
    price: 150000,
    revisions: 5,
    duration_days: 30
  },
  professional: {
    name: 'Professional',
    name_mm: 'ပရော်ဖက်ရှင်နယ်',
    price: 450000,
    revisions: 15,
    duration_days: 60
  },
  freedom: {
    name: 'Freedom',
    name_mm: 'လွတ်လပ်စွာ',
    price: 900000,
    revisions: 35,
    duration_days: 30
  }
};

// Revision Types
export const REVISION_TYPES = {
  alignment: 'Alignment / Spacing / Size',
  color: 'အရောင်ပြင်ဆင်ခြင်း',
  format: 'Format ပြောင်းလဲခြင်း (PNG, SVG, PDF)',
  layout: 'Layout / Composition',
  composition: 'Brand Color / Variation',
  export: 'Export / File Version',
  other: 'အခြား'
};

// Status Text
export const STATUS_TEXT = {
  pending: 'စောင့်ဆိုင်းဆဲ',
  approved: 'လက်ခံပြီး',
  rejected: 'ငြင်းပယ်ခဲ့',
  completed: 'ပြီးစီးပြီ'
};

// Designer Access Code — verified via Supabase
export async function verifyDesignerCode(code) {
    const { data } = await supabaseRevision
        .from('admin_auth')
        .select('role')
        .eq('role', 'designer')
        .eq('access_code', code)
        .single();
    return !!data;
}
