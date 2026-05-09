/* ============================================================
   ART de ONE — AI CHATBOT ASSISTANT
   Supports: Quick-action buttons + Free-form AI chat
   Include AFTER the chatbot HTML markup.
   ============================================================ */

(function () {
    'use strict';

    // ── DOM Refs ──────────────────────────────────────────────
    const chatWindow = document.getElementById('chat-window');
    const messagesArea = document.getElementById('chat-messages');
    const optionsArea = document.getElementById('chat-options');
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send-btn');
    let isChatOpen = false;

    // ── Conversation history for AI ──────────────────────────
    let conversationHistory = [];

    // ── Inline SVG icons (18×18, Lucide-style, stroke-width 1.5) ──
    const ICONS = {
        palette: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
        bookOpen: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
        user: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
        phone: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.1 6.1l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
        mail: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
        globe: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
        tag: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>',
        smartphone: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
        printer: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
        tool: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
        monitor: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
        arrowLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>',
        externalLink: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
        flag: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>',
        messageCircle: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>',
        sparkles: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>',
        send: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
    };

    function btnHTML(iconKey, label) {
        var svg = ICONS[iconKey] || ICONS.messageCircle;
        return '<span style="display:inline-flex;align-items:center;gap:6px;pointer-events:none;">' + svg + label + '</span>';
    }

    // ══════════════════════════════════════════════════════════
    //  QUICK-ACTION BOT DATA (button-based navigation)
    // ══════════════════════════════════════════════════════════
    var botData = {

        start: {
            msg: "Mingalarpar! 👋 Welcome to ART de ONE.\nI can answer questions about our services, courses, and more.\n\nChoose a topic below or type your question!",
            options: [
                { icon: "palette", text: "Design Services", next: "en_services" },
                { icon: "bookOpen", text: "Courses", next: "en_courses" },
                { icon: "user", text: "About Us", next: "en_about" },
                { icon: "phone", text: "Contact", next: "en_contact" },
                { icon: "sparkles", text: "Ask AI anything", next: "ai_mode" }
            ]
        },

        ai_mode: {
            msg: "I'm now in AI mode! 🤖✨\nType any question about ART de ONE and I'll answer.\n\nExamples:\n• \"How much is logo design?\"\n• \"What courses do you offer?\"\n• \"Logo design ဈေးနှုန်းဘယ်လောက်လဲ?\"\n\nYou can type in English or Myanmar!",
            options: [
                { icon: "arrowLeft", text: "Quick Menu", next: "start" }
            ]
        },

        // [BUG FIX #3] Silent AI mode — shows a brief prompt instead of
        // re-displaying the full AI mode welcome when user clicks
        // "Ask another question" after an AI reply.
        ai_mode_silent: {
            msg: "Go ahead, type your question! 🤖",
            options: [
                { icon: "arrowLeft", text: "Quick Menu", next: "start" }
            ]
        },

        // ── ENGLISH ───────────────────────────────────────────

        en_about: {
            msg: "ART de ONE is a creative education studio based in Yangon, Myanmar.\n\nLead Instructor — Ko Phyo, with 9+ years of professional design experience + 3+ years teaching. Students from Germany, Thailand & Myanmar.\n\nOfficial collaboration with Huion. Trusted by brands across Southeast Asia including Jackery, VENUCIA, Yealink, CHANGAN, AVer and more.\n\nMission — Help anyone passionate about drawing build a career in digital art & design.",
            options: [
                { icon: "externalLink", text: "View Instructor Profile", action: "link", url: "https://artdeone.com/instructor.html" },
                { icon: "arrowLeft", text: "Main Menu", next: "start" }
            ]
        },

        en_services: {
            msg: "Choose a design service to learn more:",
            options: [
                { icon: "tag", text: "Logo Design", next: "en_logo" },
                { icon: "smartphone", text: "Social Media", next: "en_social" },
                { icon: "printer", text: "Printing Design", next: "en_print" },
                { icon: "tool", text: "Revision Packages", next: "en_revision" },
                { icon: "arrowLeft", text: "Main Menu", next: "start" }
            ]
        },

        en_logo: {
            msg: "Logo Design Package\n\nStarting at 300,000 MMK\n\nWhat's included:\n• 2–3 Professional Designer Concepts\n• 2 Custom Client Concepts (Free)\n• Brand Colors & Usage Guidelines (2-page PDF)\n• Full Source Files (Ai, EPS, SVG, PNG)\n• 3 Free Revisions\n• Delivery in 3–7 business days\n\nPayment: 50% upfront, 50% on final delivery\nNote: Revision ≠ new concept from scratch",
            options: [
                { icon: "tool", text: "View Revision Packages", next: "en_revision" },
                { icon: "phone", text: "Hire Now", next: "en_contact_action" },
                { icon: "arrowLeft", text: "Services", next: "en_services" }
            ]
        },

        en_revision: {
            msg: "Revision & Support Packages\n\nEssential — 150,000 MMK\n• 5 revisions total\n• Alignment / Spacing / Size tweaks\n• Minor color edits + B/W version\n• Format conversion (PNG, SVG, PDF)\n\nProfessional — 450,000 MMK\n• 15 revisions total\n• Layout & composition reworks\n• Logo Lockup variations\n• Priority turnaround\n\nFreedom — 900,000 MMK/month\n• 35 revisions/month\n• Major layout overhauls\n• VIP priority support",
            options: [
                { icon: "phone", text: "Get Started", next: "en_contact_action" },
                { icon: "arrowLeft", text: "Logo Details", next: "en_logo" },
                { icon: "arrowLeft", text: "Services", next: "en_services" }
            ]
        },

        en_social: {
            msg: "Social Media Design Packages\n\nStarter — 240,000 MMK/month\n• 8 posts/month, 2 free revisions\n\nGrowth — 432,000 MMK/month (10% OFF)\n• 16 posts/month, 2 free revisions\n\nPro — 648,000 MMK/month (10% OFF)\n• 20 posts/month, extended hours\n\nNotes: Content provided by you. 3-month commitment = 10% off.",
            options: [
                { icon: "phone", text: "Choose a Plan", next: "en_contact_action" },
                { icon: "arrowLeft", text: "Services", next: "en_services" }
            ]
        },

        en_print: {
            msg: "Printing Design\n\nStarting at 70,000 MMK\n\nServices:\n• Business Cards & Stationery\n• Flyers & Brochures\n• Packaging Design\n• VIP Card Design\n\nContact us for a custom quote.",
            options: [
                { icon: "phone", text: "Get a Quote", next: "en_contact_action" },
                { icon: "arrowLeft", text: "Services", next: "en_services" }
            ]
        },

        en_courses: {
            msg: "ART de ONE Courses\n\nWe teach Adobe Illustrator from Basic to Advanced level.\n\nTopics:\n• Vector Drawing & Illustration\n• Logo Design Principles\n• Typography & Layout\n• Color Theory\n\nFormats: 1-on-1 (private) & Batch Class (group)\nStudents from: 🇲🇲 🇹🇭 🇩🇪",
            options: [
                { icon: "phone", text: "Inquire About Classes", next: "en_contact_action" },
                { icon: "arrowLeft", text: "Main Menu", next: "start" }
            ]
        },

        en_contact: {
            msg: "Contact ART de ONE\n\n📞 Phone: 09 953 681 497\n📧 Email: artdeone.educators@gmail.com\n📍 Location: Yangon, Myanmar\n🕐 Hours: Mon–Sat, 9am–6pm\n\nAlso available via Viber / Telegram.",
            options: [
                { icon: "phone", text: "Call Now", action: "link", url: "tel:09953681497" },
                { icon: "mail", text: "Send Email", action: "link", url: "mailto:artdeone.educators@gmail.com" },
                { icon: "globe", text: "Visit Website", action: "link", url: "https://artdeone.com" },
                { icon: "arrowLeft", text: "Main Menu", next: "start" }
            ]
        },

        en_contact_action: {
            msg: "Let's talk details! 🤝\n\n📞 Phone: 09 953 681 497\n🕐 Hours: Mon–Sat, 9am–6pm\n\nFeel free to call or message us anytime.",
            options: [
                { icon: "phone", text: "Call Now", action: "link", url: "tel:09953681497" },
                { icon: "arrowLeft", text: "Main Menu", next: "start" }
            ]
        }

    }; // end botData


    // ══════════════════════════════════════════════════════════
    //  TOGGLE CHAT WINDOW
    // ══════════════════════════════════════════════════════════
    window.toggleChat = function () {
        isChatOpen = !isChatOpen;
        var toggleBtn = document.getElementById('chat-toggle-btn');
        var msgIcon = document.getElementById('chat-icon-msg');
        var closeIcon = document.getElementById('chat-icon-close');

        if (isChatOpen) {
            chatWindow.classList.remove('hidden');
            chatWindow.classList.add('flex');
            requestAnimationFrame(function () { chatWindow.classList.add('chat-visible'); });
            // Swap icons
            if (msgIcon) msgIcon.style.display = 'none';
            if (closeIcon) closeIcon.style.display = 'block';
            if (toggleBtn) toggleBtn.classList.add('chat-btn-active');
            // First open → show start
            // [BUG FIX #1] Capture typing ID and remove it before rendering
            // the start message, so the 3-dot indicator doesn't persist forever.
            if (messagesArea.children.length === 0) {
                var initTypingId = showTyping();
                setTimeout(function () {
                    removeTyping(initTypingId);
                    renderStep('start');
                }, 600);
            }
            // Focus input
            setTimeout(function () { if (chatInput) chatInput.focus(); }, 400);
        } else {
            chatWindow.classList.remove('chat-visible');
            // Swap icons back
            if (msgIcon) msgIcon.style.display = 'block';
            if (closeIcon) closeIcon.style.display = 'none';
            if (toggleBtn) toggleBtn.classList.remove('chat-btn-active');
            setTimeout(function () {
                chatWindow.classList.remove('flex');
                chatWindow.classList.add('hidden');
            }, 300);
        }
    };


    // ══════════════════════════════════════════════════════════
    //  HELPERS
    // ══════════════════════════════════════════════════════════
    function showTyping() {
        var id = 'typing-' + Date.now();
        messagesArea.insertAdjacentHTML('beforeend',
            '<div id="' + id + '" class="bot-msg w-fit mb-2">' +
            '  <div class="flex items-center h-4">' +
            '    <span class="typing-dot"></span>' +
            '    <span class="typing-dot"></span>' +
            '    <span class="typing-dot"></span>' +
            '  </div>' +
            '</div>');
        scrollToBottom();
        return id;
    }

    function removeTyping(id) {
        var el = document.getElementById(id);
        if (el) el.remove();
    }

    // [BUG FIX #2] addMessage now extracts URLs BEFORE HTML-encoding
    // so that & in URLs (e.g. ?a=1&b=2) is not double-encoded to &
    // in the href attribute. URLs are replaced with placeholders,
    // then restored as proper <a> tags after encoding.
    function addMessage(text, type) {
        var div = document.createElement('div');
        div.className = type === 'bot' ? 'bot-msg mb-2' : 'user-msg mb-2';

        // Step 1: Extract URLs before encoding so they aren't double-encoded
        var urlPlaceholders = [];
        var textWithPlaceholders = text.replace(/https?:\/\/[^\s<]+/g, function (url) {
            var idx = urlPlaceholders.length;
            urlPlaceholders.push(url);
            return '\x00URL' + idx + '\x00';
        });

        // Step 2: HTML-encode the remaining text
        var html = textWithPlaceholders
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>');

        // Step 3: Restore URLs as proper <a> links
        html = html.replace(/\x00URL(\d+)\x00/g, function (_, idx) {
            var url = urlPlaceholders[parseInt(idx, 10)];
            return '<a href="' + url + '" target="_blank" rel="noopener" style="color:var(--color-primary, #a7e169);text-decoration:underline;">' + url + '</a>';
        });

        div.innerHTML = html;
        messagesArea.appendChild(div);
        scrollToBottom();
    }

    function addRawBotMessage(html) {
        var div = document.createElement('div');
        div.className = 'bot-msg mb-2';
        div.innerHTML = html;
        messagesArea.appendChild(div);
        scrollToBottom();
    }

    // [FIX #2] Typewriter effect for bot messages
    function typeMessage(text, onDone) {
        var div = document.createElement('div');
        div.className = 'bot-msg mb-2 chat-typing';
        messagesArea.appendChild(div);
        scrollToBottom();

        var speed = Math.max(10, Math.min(25, 1400 / text.length)); // auto-speed
        var i = 0;
        var displayed = '';

        function step() {
            if (i < text.length) {
                displayed += text[i];
                // Basic display: escape HTML, convert \n to <br>
                var escaped = displayed
                    .replace(/&/g, '&')
                    .replace(/</g, '<')
                    .replace(/>/g, '>')
                    .replace(/\n/g, '<br>');
                div.innerHTML = escaped;
                i++;
                scrollToBottom();
                setTimeout(step, speed);
            } else {
                div.classList.remove('chat-typing');
                // Apply full formatting (bold, links, etc.)
                var urlPlaceholders = [];
                var textWithPlaceholders = text.replace(/https?:\/\/[^\s<]+/g, function (url) {
                    var idx = urlPlaceholders.length;
                    urlPlaceholders.push(url);
                    return '\x00URL' + idx + '\x00';
                });
                var html = textWithPlaceholders
                    .replace(/&/g, '&')
                    .replace(/</g, '<')
                    .replace(/>/g, '>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br>');
                html = html.replace(/\x00URL(\d+)\x00/g, function (_, idx) {
                    var url = urlPlaceholders[parseInt(idx, 10)];
                    return '<a href="' + url + '" target="_blank" rel="noopener" style="color:var(--color-primary, #a7e169);text-decoration:underline;">' + url + '</a>';
                });
                div.innerHTML = html;
                scrollToBottom();
                if (onDone) onDone();
            }
        }
        step();
        return div;
    }

    function scrollToBottom() {
        // [FIX #5] Use small timeout to ensure DOM has updated before scrolling
        setTimeout(function () {
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }, 30);
    }

    // ══════════════════════════════════════════════════════════
    //  RENDER STEP (Button-based navigation)
    // ══════════════════════════════════════════════════════════
    function renderStep(stepKey) {
        var data = botData[stepKey];
        if (!data) return;
        // [FIX #2] Typewriter effect; render options after typing completes
        typeMessage(data.msg, function () {
            renderOptions(data.options, stepKey);
            scrollToBottom();
        });
    }

    function renderOptions(options, currentStep) {
        optionsArea.innerHTML = '';
        if (options) {
            options.forEach(function (opt) {
                var btn = document.createElement('button');
                btn.className = 'chat-opt-btn';
                btn.innerHTML = btnHTML(opt.icon || 'messageCircle', opt.text);
                btn.onclick = function () { handleOptionClick(opt, currentStep); };
                optionsArea.appendChild(btn);
            });
        }
    }

    function handleOptionClick(opt, currentStep) {
        addMessage(opt.text.replace(/^[^\w\u1000-\u109F]*/, ''), 'user'); // strip leading emoji
        optionsArea.innerHTML = '';

        if (opt.action === 'link') {
            var tId = showTyping();
            setTimeout(function () {
                removeTyping(tId);
                addMessage("Opening link... 🔗", 'bot');
                window.open(opt.url, '_blank');
                setTimeout(function () { renderStep('start'); }, 900);
            }, 500);
            return;
        }

        if (opt.next) {
            var tId2 = showTyping();
            setTimeout(function () {
                removeTyping(tId2);
                renderStep(opt.next);
            }, 600);
        }
    }

    // ══════════════════════════════════════════════════════════
    //  AI CHAT (Free-form text input)
    // ══════════════════════════════════════════════════════════
    function sendToAI(userText) {
        // Add to conversation history
        conversationHistory.push({ role: 'user', content: userText });

        // Show user message
        addMessage(userText, 'user');
        optionsArea.innerHTML = '';

        // Show typing
        var tId = showTyping();

        // Disable input while waiting
        setInputEnabled(false);

        fetch('/.netlify/functions/ai-chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: conversationHistory })
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                removeTyping(tId);
                if (data.error) {
                    addMessage("Sorry, I couldn't process that right now. Please try again or use the quick menu. 😅", 'bot');
                    // Show quick-return options after error
                    renderOptions([
                        { icon: "sparkles", text: "Ask another question", next: "ai_mode_silent" },
                        { icon: "arrowLeft", text: "Quick Menu", next: "start" }
                    ], 'ai_mode');
                    setInputEnabled(true);
                    if (chatInput) chatInput.focus();
                } else {
                    var reply = data.reply || "I'm not sure how to answer that. Please contact us directly!";
                    conversationHistory.push({ role: 'assistant', content: reply });
                    // [FIX #2] Typewriter effect; options render after typing completes
                    typeMessage(reply, function () {
                        // [BUG FIX #3] Use ai_mode_silent instead of ai_mode so the
                        // full welcome message isn't re-displayed every time.
                        renderOptions([
                            { icon: "sparkles", text: "Ask another question", next: "ai_mode_silent" },
                            { icon: "arrowLeft", text: "Quick Menu", next: "start" }
                        ], 'ai_mode');
                        setInputEnabled(true);
                        if (chatInput) chatInput.focus();
                        scrollToBottom();
                    });
                }
            })
            .catch(function (err) {
                removeTyping(tId);
                console.error('Chatbot AI error:', err);
                addMessage("Connection error. Please try again later. 😔", 'bot');
                renderOptions([
                    { icon: "arrowLeft", text: "Quick Menu", next: "start" }
                ], 'start');
                setInputEnabled(true);
            });
    }

    function setInputEnabled(enabled) {
        if (chatInput) chatInput.disabled = !enabled;
        if (chatSendBtn) chatSendBtn.disabled = !enabled;
        if (chatInput) {
            chatInput.style.opacity = enabled ? '1' : '0.5';
        }
    }

    // ── Input event handlers ─────────────────────────────────
    function handleSend() {
        if (!chatInput) return;
        var text = chatInput.value.trim();
        if (!text) return;
        chatInput.value = '';
        sendToAI(text);
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', handleSend);
    }
    if (chatInput) {
        chatInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
            }
        });
    }

    // ══════════════════════════════════════════════════════════
    //  INIT — Replace feather icons if available
    // ══════════════════════════════════════════════════════════
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

})();
