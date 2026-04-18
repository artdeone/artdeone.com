// ═══════════════════════════════════════════════════════════════
// Firebase Custom Auth Token Generator
// ═══════════════════════════════════════════════════════════════
// Supabase JWT token ကို verify လုပ်ပြီး Firebase Custom Token generate ပေးတယ်
// Student/Admin login ပြီးတိုင်း ဒီ endpoint ကို ခေါ်ပြီး Firebase Auth ကိုပါ sign in လုပ်တယ်

const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');

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
        // ── Supabase JWT token ကို extract ──
        const authHeader = event.headers.authorization || event.headers.Authorization || '';
        const supabaseToken = authHeader.replace('Bearer ', '');

        if (!supabaseToken) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'No authorization token provided' })
            };
        }

        // ── Supabase JWT ကို verify ──
        const jwtSecret = process.env.SUPABASE_JWT_SECRET;
        if (!jwtSecret) {
            console.error('SUPABASE_JWT_SECRET is not configured');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Server configuration error' })
            };
        }

        let decoded;
        try {
            // Supabase JWT ကို verify — algorithms HS256 specified
            decoded = jwt.verify(supabaseToken, jwtSecret, {
                algorithms: ['HS256']
            });
        } catch (jwtError) {
            console.error('JWT verification failed:', jwtError.message);
            console.error('JWT secret length:', jwtSecret.length);
            console.error('Token preview:', supabaseToken.substring(0, 20) + '...');
            
            // If verification fails, try decoding without verification to check structure
            try {
                const unverified = jwt.decode(supabaseToken);
                console.error('Token decoded (unverified):', JSON.stringify({
                    sub: unverified?.sub,
                    email: unverified?.email,
                    iss: unverified?.iss,
                    exp: unverified?.exp,
                    aud: unverified?.aud
                }));
            } catch(e) {}
            
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid or expired token',
                    detail: jwtError.message 
                })
            };
        }

        const userId = decoded.sub; // Supabase user ID
        const email = decoded.email;

        if (!userId) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'Invalid token: no user ID' })
            };
        }

        // ── Admin check ──
        const adminEmail = process.env.ADMIN_EMAIL || '';
        const isAdmin = email && email === adminEmail;

        // ── Firebase Custom Token generate ──
        const customToken = await admin.auth().createCustomToken(userId, {
            isAdmin: isAdmin,
            email: email || '',
        });

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
            body: JSON.stringify({ error: 'Failed to generate Firebase token' })
        };
    }
};
