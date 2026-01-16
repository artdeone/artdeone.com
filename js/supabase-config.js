// =====================================================
// SUPABASE CONFIGURATION FILE
// =====================================================

// 1. Supabase Client ကို တိုက်ရိုက် Import လုပ်ပါ (Window object ကို မမှီခိုတော့ပါ)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// 2. သင့် Credentials များ
const SUPABASE_URL = 'https://eyhyvlszpfsmsjyzijxg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5aHl2bHN6cGZzbXNqeXppanhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1Mzc3MDcsImV4cCI6MjA4NDExMzcwN30.rvU2oh0zmdLVaAZFjqgQvKInX1ePCQudK9cBT4hiv80';

// 3. Initialize & EXPORT (ဒီနေရာမှာ export ပါမှ တခြားဖိုင်က သုံးလို့ရမယ်)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// console.log('Supabase Connected:', SUPABASE_URL);
