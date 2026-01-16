// =====================================================
// SUPABASE CONFIGURATION FILE
// ART de ONE - Student Management System
// =====================================================

/**
 * IMPORTANT: သင့်ရဲ့ Supabase credentials များကို ဒီ file မှာ သိမ်းဆည်းပါ
 * 
 * ဘယ်မှာရမလဲ?
 * 1. Supabase Dashboard သို့သွားပါ
 * 2. Settings (⚙️) → API
 * 3. Copy these two values:
 */

// =====================================================
// STEP 1: သင့်ရဲ့ Project URL ကို ဒီမှာထည့်ပါ
// =====================================================
// Example: 'https://xyzabcdefgh.supabase.co'
// ⚠️ '' မေ့မထည့်ပါနဲ့!

const SUPABASE_URL = 'https://supabase.com/dashboard/project/eyhyvlszpfsmsjyzijxg';


// =====================================================
// STEP 2: သင့်ရဲ့ Anon/Public Key ကို ဒီမှာထည့်ပါ
// =====================================================
// Example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdX...'
// ⚠️ အရမ်းရှည်ပါတယ် (200+ characters)

const SUPABASE_ANON_KEY = 'sb_publishable_BhPbsTtxI4ZuTNpnWA30uQ_Cfddf7OY';


// =====================================================
// STEP 3: Supabase Client ကို Initialize လုပ်ပါ
// =====================================================
// ဒါကို မပြောင်းပါနဲ့ - အလိုလို အလုပ်လုပ်ပါလိမ့်မယ်
const supabase = window.supabase.createClient('https://supabase.com/dashboard/project/eyhyvlszpfsmsjyzijxg', 'sb_publishable_BhPbsTtxI4ZuTNpnWA30uQ_Cfddf7OY');


// =====================================================
// VERIFICATION (Optional)
// =====================================================
// သင့် setup မှန်ကန်မှု test လုပ်ချင်ရင် browser console မှာ run ပါ:
// 
// console.log('Supabase URL:', SUPABASE_URL);
// console.log('Key length:', SUPABASE_ANON_KEY.length); // Should be ~200+
// 
// supabase.from('students').select('count').then(data => {
//     console.log('Database connection:', data.error ? 'FAILED' : 'SUCCESS');
// });


// =====================================================
// COMMON ERRORS & SOLUTIONS
// =====================================================
/**
 * ERROR: "Invalid API key"
 * SOLUTION: SUPABASE_ANON_KEY ကို မှန်မှန်ကန်ကန် copy လုပ်ထားမထားစစ်ပါ
 * 
 * ERROR: "Failed to fetch"
 * SOLUTION: SUPABASE_URL ကို https:// ပါအောင် အပြည့်အစုံ ထည့်ပါ
 * 
 * ERROR: "No rows returned"
 * SOLUTION: ဒါက error မဟုတ်ပါ - database က empty ဖြစ်နေလို့ပါ
 * 
 * ERROR: "Row Level Security policy violation"
 * SOLUTION: SQL Editor မှာ policies များ မှန်ကန်စွာ run ထားမထားစစ်ပါ
 */


// =====================================================
// CONFIGURATION COMPLETE!
// =====================================================
// သင့် credentials များ သိမ်းဆည်းပြီးပါက:
// 1. ဒီ file ကို သင့် website folder မှာ သိမ်းပါ
// 2. သင့် HTML files များ (student-login.html, etc) မှာ သုံးပါ
// 
// Example usage in HTML:
// <script src="supabase-config.js"></script>
// <script>
//     // Now you can use 'supabase' object
//     async function login(email, password) {
//         const { data, error } = await supabase.auth.signInWithPassword({
//             email, password
//         });
//     }
// </script>


// =====================================================
// SECURITY NOTES ⚠️
// =====================================================
/**
 * ✅ DO:
 * - Keep this file in your website root
 * - Use Environment Variables for production
 * - Enable Row Level Security in Supabase
 * 
 * ❌ DON'T:
 * - Share this file publicly on GitHub/etc
 * - Use service_role key (only use anon/public key)
 * - Disable Row Level Security
 */

// =====================================================
// BACKUP YOUR CREDENTIALS
// =====================================================
// သင့် credentials များကို လုံခြုံသောနေရာတွင် သိမ်းဆည်းပါ:
// 
// Project URL: ____________________________________
// Anon Key:    ____________________________________
// Database Password: ______________________________
// 
// Date: ___________
// Backed up by: ___________
