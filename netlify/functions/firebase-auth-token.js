// ═══════════════════════════════════════════════════════════════
// Firebase Custom Auth Token Generator
// ═══════════════════════════════════════════════════════════════
// Supabase access_token ကို verify လုပ်ပြီး Firebase Custom Token generate ပေးတယ်
//
// ✅ Fix: jwt.verify() (HS256 only) မသုံးတော့ဘဲ
//         Supabase /auth/v1/user endpoint ကို ခေါ်ပြီး token ကို server-side validate လုပ်တယ်
//         ဒါဟာ ပိုပြီး secure & reliable ပါ

const admin = require('firebase-admin');

// Initialize Firebase Admin (once)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        databaseURL: "https://ado-chat-app-default-rtdb.firebaseio.com"
    });
}

exports.handler = async (event) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    // POST only
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    try {
        // ── Supabase access_token extract ──
        const authHeader = event.headers.authorization || event.headers.Authorization || '';
        const supabaseToken = authHeader.replace('Bearer ', '').trim();

        if (!supabaseToken) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'No authorization token provided' })
            };
        }

        // ── Supabase env vars check ──
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('Missing Supabase env vars:', {
                hasUrl: !!supabaseUrl,
                hasKey: !!supabaseServiceKey
            });
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Server configuration error: missing Supabase config' })
            };
        }

        // ── Supabase /auth/v1/user ကို ခေါ်ပြီး token validate ──
        // ဒါက jwt.verify() ထက် reliable ပါ — RS256/HS256 algorithm ပြဿနာ မရှိ
        const supabaseUserResp = await fetch(`${supabaseUrl}/auth/v1/user`, {
            headers: {
                'Authorization': `Bearer ${supabaseToken}`,
                'apikey': supabaseServiceKey
            }
        });

        if (!supabaseUserResp.ok) {
            const errText = await supabaseUserResp.text();
            console.error('Supabase token validation failed:', supabaseUserResp.status, errText);
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Invalid or expired Supabase token' })
            };
        }

        const supabaseUser = await supabaseUserResp.json();
        const userId = supabaseUser.id;
        const email = supabaseUser.email;

        if (!userId) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Invalid token: no user ID' })
            };
        }

        // ── Admin check ──
        const adminEmail = process.env.ADMIN_EMAIL || '';
        const isAdmin = !!(email && email === adminEmail);

        // ── Firebase Custom Token generate ──
        const customToken = await admin.auth().createCustomToken(userId, {
            isAdmin: isAdmin,
            email: email || '',
        });

        console.log(`✅ Firebase token generated for user: ${userId} (admin: ${isAdmin})`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                token: customToken,
                uid: userId
            })
        };

    } catch (error) {
        console.error('Firebase token generation error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to generate Firebase token', detail: error.message })
        };
    }
};
