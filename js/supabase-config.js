// =====================================================
// SUPABASE CONFIGURATION FILE
// =====================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://eyhyvlszpfsmsjyzijxg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aHl2bHN6cGZzbXNqeXppanhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1Mzc3MDcsImV4cCI6MjA4NDExMzcwN30.rvU2oh0zmdLVaAZFjqgQvKInX1ePCQudK9cBT4hiv80';

// 1. ပုံမှန် Client (Admin Login ဝင်ထားသော Session ကို သုံးမည်)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Session မသိမ်းသော Client (User အသစ်ဖန်တီးတဲ့အခါ Admin Session မပြုတ်သွားအောင် သုံးမည်)
export const supabaseNoSession = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: false, // Session မမှတ်ပါနှင့်
        autoRefreshToken: false,
        detectSessionInUrl: false
    }
});
