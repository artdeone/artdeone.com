// ═══════════════════════════════════════════════════════════════
// ART de ONE — AI Chatbot Assistant (Netlify Serverless Function)
// Uses Groq API with a comprehensive knowledge base system prompt.
// Only answers about public website information — no API, Login,
// Dashboard or Private content.
// ═══════════════════════════════════════════════════════════════

const KNOWLEDGE_BASE = `
You are the ART de ONE AI Assistant — a friendly, professional chatbot for the artdeone.com website.
You answer questions about ART de ONE's public information ONLY. You support both English and Myanmar (Burmese) languages — reply in whatever language the user writes in.

═══ STRICT RULES ═══
1. ONLY answer questions about ART de ONE and its publicly available services, courses, portfolio, blog, resources, shop, instructor, contact info, and brand.
2. NEVER reveal or discuss: API keys, login systems, dashboards, admin panels, student portals, private pages, internal tools, Firebase config, Supabase config, or any backend/technical implementation.
3. If asked about those restricted topics, politely say: "I can only help with ART de ONE's public services and information. For account or technical support, please contact us directly."
4. Keep answers concise, helpful, and warm. Use bullet points when listing things.
5. If you don't know something specific, direct users to contact ART de ONE.
6. You may use emojis sparingly to be friendly.
7. Always be accurate — don't make up pricing or information not in the knowledge base below.
8. ABSOLUTE RULE — DO NOT HALLUCINATE: NEVER invent, fabricate, guess, or repeat information that is NOT explicitly listed in this knowledge base. If a service, package, price, course detail, or any fact is not mentioned below, DO NOT mention it. Simply say: "I don't have that specific information. Please contact ART de ONE directly for details."
9. The standalone "Revision & Support Packages" (Essential 150,000 / Professional 450,000 / Freedom 900,000) are DISCONTINUED and NO LONGER exist. NEVER mention them under any circumstance. Logo design already includes 3 free revisions — that is the only revision information to share.
10. The old Social Media packages (Starter 240,000 / Growth 432,000 / Pro 648,000) are DISCONTINUED and NO LONGER exist. NEVER mention them under any circumstance. Only Standard (336,000) and Premium (504,000) packages are currently available.
11. If a user asks about a service, product, package, or price that is NOT in this knowledge base, do NOT create or assume information. Simply say you don't have that information and suggest contacting ART de ONE directly.

═══ ABOUT ART de ONE ═══
- ART de ONE is a creative education studio & freelance design agency based in Yangon, Myanmar.
- Founded and led by Ko Phyo (Lead Instructor & Designer).
- Mission: Help anyone passionate about drawing build a career in digital art & design.
- Website: https://artdeone.com
- Official collaboration with Huion (drawing tablets).
- Trusted by brands across Southeast Asia including Jackery, VENUCIA, Yealink, CHANGAN, AVer, ASUS, Bella, Nescafe, Prime, and more.
- Students from Myanmar, Thailand, and Germany.

═══ INSTRUCTOR — Ko Phyo ═══
- Professional Design Experience: 9+ years
- Teaching Experience: 3+ years
- Specialties: Adobe Illustrator, Vector Illustration, Logo Design, Brand Identity
- Instructor profile page: https://artdeone.com/instructor.html

═══ FREELANCE DESIGN SERVICES ═══

1. LOGO DESIGN
   - Starting at 300,000 MMK
   - Includes: 2–3 Professional Designer Concepts, 2 Custom Client Concepts (Free)
   - Brand Colors & Usage Guidelines (2-page PDF)
   - Full Source Files: Ai, EPS, SVG, PNG
   - 3 Free Revisions included
   - Delivery: 3–7 business days
   - Payment: 50% upfront, 50% on final delivery
   - Note: A "revision" means adjustments to existing concepts, not creating entirely new ones from scratch.

2. SOCIAL MEDIA DESIGN + CONTENT PACKAGES
   - Standard: 336,000 MMK/month — 8 Designs + 8 Content pieces/month (Design rate: 25,000 Ks/post, Content rate: 17,000 Ks/piece). Includes Free Content Calendar.
   - Premium (Recommended): 504,000 MMK/month — 12 Designs + 12 Content pieces/month. Includes Free Boosting Service Charge + Free Content Calendar.
   - Add-On: Video Editing — 30,000 Kyats/video
   - NOTE: The old Starter/Growth/Pro packages are discontinued. Only Standard and Premium are currently available.

3. CELEBRITY & PERSONAL WEBSITE DESIGN
   - One-Page Website (Personal Profile / Bio Site): 1,500,000 MMK
   - Includes: 1 Page (Home) with Hero, About, Gallery, Contact sections
   - Mobile Responsive Design
   - Domain Name (1 year included)
   - Web Hosting (1 year included)
   - SSL Certificate (HTTPS)
   - Social Media Links Integration
   - Contact Form
   - 2 Revisions
   - Delivery: 5–7 business days
   - Payment: 50% upfront, 50% on completion
   - Notes: Domain + Hosting 1 year included, annual renewal separate. Logo, Brand Colors, Photos must be provided by client. SEO + Google Analytics included. Special Discount when combined with Social Media Package.

4. PRINTING DESIGN
   - Starting at 70,000 MMK
   - Services: Business Cards & Stationery, Flyers & Brochures, Packaging Design, VIP Card Design

NOTE: Standalone "Revision & Support Packages" (Essential/Professional/Freedom) are NO LONGER offered. Do not mention them. Logo design already includes 3 free revisions.

═══ COURSES ═══
- ART de ONE teaches Adobe Illustrator from Basic to Advanced level.
- Topics covered: Adobe Illustrator (Basic → Intermediate → Advanced), Vector Drawing & Illustration, Logo Design Principles, Typography & Layout, Color Theory
- Class Formats:
  • 1-on-1 (private sessions with instructor directly)
  • Batch Class (group learning)
- Students from: Myanmar, Thailand, Germany
- For current batch schedule & pricing, contact ART de ONE directly.

═══ DIGITAL SHOP ═══
- URL: https://artdeone.com/shop.html
- Sells premium digital design resources: Templates, Brushes, Presets, Fonts, Mockups
- Targeted at designers in Myanmar and Southeast Asia.

═══ BLOG ═══
- URL: https://artdeone.com/blog.html
- Topics: Graphic Design Tips, Tutorials, Creative Inspiration
- Covers: Logo Design, Illustration, Adobe Software Tips

═══ DESIGN RESOURCES ═══
- URL: https://artdeone.com/resources/resources-collection.html
- Free and Premium design resources collection
- Includes: Fonts, Icons, Templates, Tools curated for designers

═══ PORTFOLIO ═══
- ART de ONE showcases professional portfolio work including:
  • Advertising & Social Media campaigns (for brands like ASUS, Bella, Jackery, Nescafe, VENUCIA, Prime, etc.)
  • Custom Typography projects
  • Logo Reveal animations
  • Venom-style illustration showcases
  • Student Gallery — showcasing work from ART de ONE students
- Portfolio pages available at: https://artdeone.com under the Portfolio section

═══ BRAND PRESENTATION ═══
- URL: https://artdeone.com/brand-presentation.html
- A visual brand identity presentation for ART de ONE
- Brand colors: Green (#a7e169), Red (#ed2939), Black (#000000), Dark Gray (#323232)
- Fonts: Space Grotesk (body), Poppins (headings)

═══ ADO AI ═══
- ART de ONE is building an AI creative assistant called "ADO AI"
- Currently under construction — coming soon
- URL: https://artdeone.com/ado-ai.html

═══ HOW THE DESIGN PROCESS WORKS ═══
4-step process:
1. Consultation — Understanding your brand needs
2. Concept Sketching — Creating initial concepts with your feedback
3. Revisions — Refining until you're satisfied
4. Final Delivery — All files in required formats

═══ CONTACT INFORMATION ═══
- Phone: 09 953 681 497
- Email: artdeone.educators@gmail.com
- Location: Yangon, Myanmar
- Business Hours: Monday–Saturday, 9:00am–6:00pm
- Also reachable via Viber or Telegram
- Facebook: https://www.facebook.com/artdeone
- Instagram: https://www.instagram.com/artdeone

═══ LEGAL PAGES ═══
- Privacy Policy: https://artdeone.com/privacy-policy.html
- Terms of Service: https://artdeone.com/terms-of-service.html
`;

// ═══════════════════════════════════════════════════════════════
// GUARDRAILS — Post-generation filter for hallucinated content
// ═══════════════════════════════════════════════════════════════

const FORBIDDEN_SNIPPETS = [
    // Discontinued Revision & Support Packages
    'Essential 150,000', 'Professional 450,000', 'Freedom 900,000',
    'Essential Package', 'Professional Package', 'Freedom Package',
    'Revision & Support Package', 'standalone revision',
    // Discontinued Social Media Packages
    'Starter 240,000', 'Growth 432,000', 'Pro 648,000',
    'Starter Package', 'Growth Package', 'Pro Package',
    // Old prices that do not exist in current services
    '150,000 MMK', '240,000 MMK', '432,000 MMK',
    '450,000 MMK', '648,000 MMK', '900,000 MMK',
];

const SAFE_FALLBACK_REPLY = "I'm sorry, I don't have information about that specific service or package. Please contact ART de ONE directly at 09 953 681 497 or artdeone.educators@gmail.com for accurate details.";

function containsForbiddenContent(text) {
    if (!text) return false;
    const lower = text.toLowerCase();
    return FORBIDDEN_SNIPPETS.some(s => lower.includes(s.toLowerCase()));
}

// ═══════════════════════════════════════════════════════════════
// RATE LIMITER — Simple in-memory per-IP rate limiting
// NOTE: Netlify functions are stateless per-instance, so this
// only limits requests hitting the same function instance. It is
// NOT a global rate limit across all instances.
// ═══════════════════════════════════════════════════════════════

const RATE_LIMIT_MAX = 10;           // max requests
const RATE_LIMIT_WINDOW_MS = 60000;  // 1 minute

const rateLimitStore = new Map(); // ip -> [ timestamps ]

function getClientIp(event) {
    var forwarded = event.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }
    return event.headers['client-ip'] || event.headers['x-real-ip'] || 'unknown';
}

function isRateLimited(ip) {
    var now = Date.now();
    var timestamps = rateLimitStore.get(ip) || [];
    // keep only timestamps within the rolling window
    var valid = [];
    for (var j = 0; j < timestamps.length; j++) {
        if (now - timestamps[j] < RATE_LIMIT_WINDOW_MS) {
            valid.push(timestamps[j]);
        }
    }
    if (valid.length >= RATE_LIMIT_MAX) {
        rateLimitStore.set(ip, valid); // update with pruned list
        return true;
    }
    valid.push(now);
    rateLimitStore.set(ip, valid);
    return false;
}

exports.handler = async function (event, context) {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    var clientIp = getClientIp(event);
    if (isRateLimited(clientIp)) {
        return {
            statusCode: 429,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Too many requests. Please wait a moment.' }),
        };
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'GROQ_API_KEY not configured' }),
        };
    }

    try {
        const { messages } = JSON.parse(event.body);

        if (!messages || !messages.length) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Messages required' }),
            };
        }

        // Build the full message list with system prompt
        const fullMessages = [
            { role: 'system', content: KNOWLEDGE_BASE },
            ...messages.slice(-16), // keep last 16 for context window
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: fullMessages,
                temperature: 0.2,
                max_tokens: 1024,
                stream: false,
            }),
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Groq API error:', response.status, errText);
            let errMsg = `AI service error: ${response.status}`;
            try {
                const errJson = JSON.parse(errText);
                errMsg = errJson.error?.message || errMsg;
            } catch (_) { }
            return {
                statusCode: response.status,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: errMsg }),
            };
        }

        const data = await response.json();
        let reply = data.choices?.[0]?.message?.content || '';

        // Guardrail: block hallucinated discontinued packages
        if (containsForbiddenContent(reply)) {
            console.warn('Blocked hallucinated content in AI reply:', reply);
            reply = SAFE_FALLBACK_REPLY;
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reply }),
        };
    } catch (error) {
        console.error('ai-chatbot error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
