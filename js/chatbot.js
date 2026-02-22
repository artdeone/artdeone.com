/* ============================================================
   ART de ONE SMART CHATBOT — chatbot.js
   Standalone file. Include AFTER the chatbot HTML markup.
   ============================================================ */

(function () {

    // ── DOM Refs ──────────────────────────────────────────────
    const chatWindow   = document.getElementById('chat-window');
    const messagesArea = document.getElementById('chat-messages');
    const optionsArea  = document.getElementById('chat-options');
    let isChatOpen = false;

    // ── Inline SVG icons (14x14, stroke-based) ───────────────
    const ICONS = {
        palette:      `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
        book:         `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
        user:         `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
        phone:        `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.1 6.1l.97-.97a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
        mail:         `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
        globe:        `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
        tag:          `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
        smartphone:   `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
        printer:      `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
        tool:         `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
        monitor:      `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
        arrowLeft:    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
        externalLink: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
        flag:         `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`,
        messageCircle:`<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    };

    function btnHTML(iconKey, label) {
        const svg = ICONS[iconKey] || ICONS.messageCircle;
        return `<span style="display:inline-flex;align-items:center;gap:6px;pointer-events:none;">${svg}${label}</span>`;
    }

    // ══════════════════════════════════════════════════════════
    //  BOT DATA
    // ══════════════════════════════════════════════════════════
    const botData = {

        start: {
            msg: "Mingalarpar! Welcome to ART de ONE.\nPlease choose your language.",
            options: [
                { icon: "flag", text: "မြန်မာ",  next: "mm_menu" },
                { icon: "flag", text: "English", next: "en_menu"  }
            ]
        },

        // ── MYANMAR ───────────────────────────────────────────

        mm_menu: {
            msg: "မင်္ဂလာပါ။ ART de ONE မှ ကြိုဆိုပါတယ်ခင်ဗျ။\nဘာအကြောင်းအရာ သိလိုပါသလဲ?",
            options: [
                { icon: "palette",  text: "Freelance ဝန်ဆောင်မှုများ", next: "mm_services" },
                { icon: "book",     text: "သင်တန်းအကြောင်း",           next: "mm_courses"  },
                { icon: "user",     text: "ဆရာအကြောင်း",               next: "mm_about"    },
                { icon: "phone",    text: "ဆက်သွယ်ရန်",                next: "mm_contact"  }
            ]
        },

        mm_about: {
            msg: "ART de ONE ဟာ Yangon အခြေစိုက် Design & Illustration ပညာပေးလုပ်ငန်းတစ်ခုဖြစ်ပါတယ်။\n\nဆရာ — Professional Design (9 နှစ်) နှင့် Teaching Experience (3 နှစ်) ရှိပြီး Germany, Thailand, Myanmar မှ Students များ တက်ရောက်နေပါတယ်။\n\nHuion (Official Collaboration) အပါ Southeast Asia ရှိ Brand များနှင့် ပူးပေါင်းဆောင်ရွက်လျက်ရှိပါတယ်။",
            options: [
                { icon: "externalLink", text: "Instructor Profile ကြည့်ရန်", action: "link", url: "https://artdeone.com/instructor" },
                { icon: "arrowLeft",    text: "ပင်မမီနူး",                    next: "mm_menu" }
            ]
        },

        mm_services: {
            msg: "ကျွန်တော်တို့ရဲ့ Design ဝန်ဆောင်မှုများ ရွေးချယ်ပါ။",
            options: [
                { icon: "tag",       text: "Logo Design",      next: "mm_logo"     },
                { icon: "smartphone",text: "Social Media",      next: "mm_social"   },
                { icon: "printer",   text: "Printing Design",   next: "mm_print"    },
                { icon: "tool",      text: "Revision Packages", next: "mm_revision" },
                { icon: "arrowLeft", text: "ပင်မမီနူး",         next: "mm_menu"     }
            ]
        },

        mm_logo: {
            msg: "Logo Design Package\n\nစတင်စျေးနှုန်း — 300,000 MMK\n\nပါဝင်သည့်အချက်များ:\n· Professional Designer Concept (2–3 ခု)\n· Client Request Custom Concept (2 ခု) အခမဲ့\n· Brand Colors & Usage Guidelines (PDF 2 Pages)\n· Source Files အစုံ (Ai, EPS, SVG, PNG)\n· Free Revision 3 ကြိမ်\n· ကြာချိန် — ၃ ရက် မှ ၇ ရက်\n\nမှတ်ချက်:\n· Revision = အသစ်ဖန်တီးချက် မဟုတ်ပါ\n· ငွေကြိုတင် 50% + ပြီးမှ 50%",
            options: [
                { icon: "tool",      text: "Revision Package ကြည့်ရန်", next: "mm_revision"       },
                { icon: "phone",     text: "အလုပ်အပ်မည်",              next: "mm_contact_action" },
                { icon: "arrowLeft", text: "ဝန်ဆောင်မှုများ",           next: "mm_services"       }
            ]
        },

        mm_revision: {
            msg: "Revision & Support Packages\n\nEssential — 150,000 MMK\n· ပြင်ဆင်မှု 5 ကြိမ်\n· Alignment / Spacing / Size ညှိနှိုင်းမှုများ\n· အရောင်အသေးစား + B/W Version\n· Format ပြောင်းပေးခြင်း (PNG, SVG, PDF)\n· Typeface ညှိနှိုင်းမှုများ\n\nProfessional — 450,000 MMK\n· ပြင်ဆင်မှု 15 ကြိမ်\n· Layout / Composition ပြင်ဆင်မှု\n· Logo Lockup Versions မျိုးစုံ\n· Brand Color Variation\n· ဦးစားပေး အမြန်လုပ်ဆောင်ပေးခြင်း\n\nFreedom — 900,000 MMK / month\n· 1 လ = ပြင်ဆင်မှု 35 ကြိမ်\n· Asset Management\n· VIP ဦးစားပေး Support",
            options: [
                { icon: "phone",     text: "အလုပ်အပ်မည်",   next: "mm_contact_action" },
                { icon: "arrowLeft", text: "Logo Details",   next: "mm_logo"           },
                { icon: "arrowLeft", text: "ဝန်ဆောင်မှုများ", next: "mm_services"       }
            ]
        },

        mm_social: {
            msg: "Social Media Design Packages\n\nStarter — 240,000 MMK / month\n· Design 8 ခု/လ\n· Revision 2 ကြိမ် အခမဲ့\n· PNG/JPG Final Files\n· နံနက် 8:30 — ည 6:30\n\nGrowth — 432,000 MMK / month (10% OFF)\n· Design 16 ခု/လ\n· Revision 2 ကြိမ် အခမဲ့\n\nPro — 648,000 MMK / month (10% OFF)\n· Design 20 ခု/လ\n· Revision 2 ကြိမ် အခမဲ့\n· နံနက် 8:30 — ည 9:30\n\nမှတ်ချက် — Content ကိုယ်တိုင်ရေးပေးရမည်။\n3 လ commitment = 10% discount",
            options: [
                { icon: "phone",     text: "Starter ရွေးမည်",  next: "mm_contact_action" },
                { icon: "phone",     text: "Growth ရွေးမည်",   next: "mm_contact_action" },
                { icon: "phone",     text: "Pro ရွေးမည်",      next: "mm_contact_action" },
                { icon: "arrowLeft", text: "ဝန်ဆောင်မှုများ",  next: "mm_services"       }
            ]
        },

        mm_print: {
            msg: "Printing Design\n\nစတင်စျေးနှုန်း — 70,000 MMK\n\nပါဝင်သည့် Services:\n· Business Cards & Stationery\n· Flyers & Brochures\n· Packaging Design\n· VIP Card Design\n\nအသေးစိတ်သိလိုပါက ဆက်သွယ်ပေးပါ။",
            options: [
                { icon: "phone",     text: "စျေးနှုန်းမေးမည်", next: "mm_contact_action" },
                { icon: "arrowLeft", text: "ဝန်ဆောင်မှုများ",  next: "mm_services"       }
            ]
        },

        mm_courses: {
            msg: "ART de ONE သင်တန်းများ\n\nAdobe Illustrator ကို Basic မှ Advanced အထိ သင်ကြားပေးနေပါတယ်။\n1-by-1 နှင့် Batch Class နှစ်မျိုးရှိပါတယ်။",
            options: [
                { icon: "book",      text: "သင်တန်းပုံစံ & ဈေးနှုန်း", next: "mm_course_details"            },
                { icon: "monitor",   text: "Student Login",              action: "link", url: "/private/student-login" },
                { icon: "phone",     text: "သင်တန်းစုံစမ်းရန်",         next: "mm_contact_action"             },
                { icon: "arrowLeft", text: "ပင်မမီနူး",                 next: "mm_menu"                       }
            ]
        },

        mm_course_details: {
            msg: "သင်တန်းအသေးစိတ်\n\nသင်ကြားပေးသောပညာရပ်:\n· Adobe Illustrator (Basic → Intermediate → Advanced)\n· Vector Drawing & Illustration\n· Logo Design Principles\n· Typography & Layout\n· Color Theory\n\nClass ပုံစံ:\n· 1-on-1 (တစ်ကိုယ်တော် — ဆရာကိုယ်တိုင်နှင့်)\n· Batch Class (Group Learning)\n\nတက်ရောက်သူနိုင်ငံများ — Germany, Thailand, Myanmar\n\nBatch ရက်/ဈေးနှုန်းအတွက် ဆက်သွယ်ပေးပါ။",
            options: [
                { icon: "phone",     text: "ဆက်သွယ်မေးမြန်းမည်", next: "mm_contact_action"            },
                { icon: "monitor",   text: "Student Login",        action: "link", url: "/private/student-login" },
                { icon: "arrowLeft", text: "သင်တန်းမီနူး",         next: "mm_courses"                  }
            ]
        },

        mm_contact: {
            msg: "ဆက်သွယ်ရန်\n\nဖုန်း — 09 953 681 497\nEmail — artdeone.educators@gmail.com\nတည်နေရာ — Yangon, Myanmar\nဖွင့်ချိန် — Mon–Sat, 9am–6pm\n\nViber / Telegram မှတစ်ဆင့်လည်း မေးမြန်းနိုင်ပါတယ်။",
            options: [
                { icon: "phone",     text: "ဖုန်းခေါ်မည်",   action: "link", url: "tel:09953681497"                    },
                { icon: "mail",      text: "Email ပို့မည်",   action: "link", url: "mailto:artdeone.educators@gmail.com" },
                { icon: "globe",     text: "Website သွားမည်", action: "link", url: "https://artdeone.com"                },
                { icon: "arrowLeft", text: "ပင်မမီနူး",       next: "mm_menu"                                            }
            ]
        },

        mm_contact_action: {
            msg: "အသေးစိတ်ဆွေးနွေးဖို့ ဆက်သွယ်ပေးပါခင်ဗျာ။\n\nဖုန်း — 09 953 681 497\nဖွင့်ချိန် — Mon–Sat, 9am–6pm",
            options: [
                { icon: "phone",     text: "Call Now",   action: "link", url: "tel:09953681497" },
                { icon: "arrowLeft", text: "ပင်မမီနူး",  next: "mm_menu"                        }
            ]
        },

        // ── ENGLISH ───────────────────────────────────────────

        en_menu: {
            msg: "Hello! Welcome to ART de ONE.\nHow can I help you today?",
            options: [
                { icon: "palette", text: "Freelance Services", next: "en_services" },
                { icon: "book",    text: "About Courses",      next: "en_courses"  },
                { icon: "user",    text: "About Us",           next: "en_about"    },
                { icon: "phone",   text: "Contact Info",       next: "en_contact"  }
            ]
        },

        en_about: {
            msg: "ART de ONE is a creative education studio based in Yangon, Myanmar.\n\nLead Instructor — 9 years of professional design experience + 3 years teaching. Students from Germany, Thailand & Myanmar.\n\nOfficial collaboration with Huion. Trusted by brands across Southeast Asia including Jackery, VENUCIA, Yealink, CHANGAN, AVer and more.\n\nMission — Help anyone passionate about drawing build a career in digital art & design.",
            options: [
                { icon: "externalLink", text: "View Instructor Profile", action: "link", url: "https://artdeone.com/instructor" },
                { icon: "arrowLeft",    text: "Main Menu",               next: "en_menu" }
            ]
        },

        en_services: {
            msg: "Choose a design service to learn more.",
            options: [
                { icon: "tag",       text: "Logo Design",      next: "en_logo"     },
                { icon: "smartphone",text: "Social Media",      next: "en_social"   },
                { icon: "printer",   text: "Printing Design",   next: "en_print"    },
                { icon: "tool",      text: "Revision Packages", next: "en_revision" },
                { icon: "arrowLeft", text: "Main Menu",         next: "en_menu"     }
            ]
        },

        en_logo: {
            msg: "Logo Design Package\n\nStarting at 300,000 MMK\n\nWhat's included:\n· 2–3 Professional Designer Concepts\n· 2 Custom Client Concepts (Free)\n· Brand Colors & Usage Guidelines (2-page PDF)\n· Full Source Files (Ai, EPS, SVG, PNG)\n· 3 Free Revisions\n· Delivery in 3–7 business days\n\nNotes:\n· Revision is not a new concept from scratch\n· 50% upfront, 50% on final delivery",
            options: [
                { icon: "tool",      text: "View Revision Packages", next: "en_revision"       },
                { icon: "phone",     text: "Hire Now",               next: "en_contact_action" },
                { icon: "arrowLeft", text: "Services",               next: "en_services"       }
            ]
        },

        en_revision: {
            msg: "Revision & Support Packages\n\nEssential — 150,000 MMK\n· 5 revisions total\n· Alignment / Spacing / Size tweaks\n· Minor color edits + B/W version\n· Format conversion (PNG, SVG, PDF)\n· Typeface kerning / spacing\n\nProfessional — 450,000 MMK\n· 15 revisions total\n· Layout & composition reworks\n· Logo Lockup variations\n· Brand color refinement\n· Priority turnaround\n\nFreedom — 900,000 MMK / month\n· 35 revisions per month\n· Major layout overhauls included\n· Asset management\n· VIP priority support",
            options: [
                { icon: "phone",     text: "Get Started",  next: "en_contact_action" },
                { icon: "arrowLeft", text: "Logo Details", next: "en_logo"           },
                { icon: "arrowLeft", text: "Services",     next: "en_services"       }
            ]
        },

        en_social: {
            msg: "Social Media Design Packages\n\nStarter — 240,000 MMK / month\n· 8 posts/month\n· 2 free revisions\n· PNG/JPG delivery\n· Hours: 8:30am – 6:30pm\n\nGrowth — 432,000 MMK / month (10% OFF)\n· 16 posts/month\n· 2 free revisions\n\nPro — 648,000 MMK / month (10% OFF)\n· 20 posts/month\n· 2 free revisions\n· Extended hours: 8:30am – 9:30pm\n\nNotes:\n· Content must be provided by you (design-only)\n· Unused posts don't roll over\n· 3-month commitment = 10% off",
            options: [
                { icon: "phone",     text: "Choose Starter", next: "en_contact_action" },
                { icon: "phone",     text: "Choose Growth",  next: "en_contact_action" },
                { icon: "phone",     text: "Choose Pro",     next: "en_contact_action" },
                { icon: "arrowLeft", text: "Services",       next: "en_services"       }
            ]
        },

        en_print: {
            msg: "Printing Design\n\nStarting at 70,000 MMK\n\nServices include:\n· Business Cards & Stationery\n· Flyers & Brochures\n· Packaging Design\n· VIP Card Design\n\nContact us for a custom quote.",
            options: [
                { icon: "phone",     text: "Get a Quote", next: "en_contact_action" },
                { icon: "arrowLeft", text: "Services",    next: "en_services"       }
            ]
        },

        en_courses: {
            msg: "ART de ONE Courses\n\nWe teach Adobe Illustrator from Basic to Advanced level — both 1-on-1 and Batch classes available.",
            options: [
                { icon: "book",      text: "Course Details & Pricing", next: "en_course_details"            },
                { icon: "monitor",   text: "Student Login",            action: "link", url: "/private/student-login" },
                { icon: "phone",     text: "Inquire About Classes",    next: "en_contact_action"             },
                { icon: "arrowLeft", text: "Main Menu",                next: "en_menu"                       }
            ]
        },

        en_course_details: {
            msg: "Course Details\n\nWhat you'll learn:\n· Adobe Illustrator (Basic → Intermediate → Advanced)\n· Vector Drawing & Illustration\n· Logo Design Principles\n· Typography & Layout\n· Color Theory\n\nClass Formats:\n· 1-on-1 (private, with instructor directly)\n· Batch Class (group learning)\n\nStudents from — Germany, Thailand, Myanmar\n\nFor current batch schedule & pricing, please reach out directly.",
            options: [
                { icon: "phone",     text: "Inquire Now",   next: "en_contact_action"            },
                { icon: "monitor",   text: "Student Login", action: "link", url: "/private/student-login" },
                { icon: "arrowLeft", text: "Courses",       next: "en_courses"                   }
            ]
        },

        en_contact: {
            msg: "Contact ART de ONE\n\nPhone — 09 953 681 497\nEmail — artdeone.educators@gmail.com\nLocation — Yangon, Myanmar\nHours — Mon–Sat, 9am–6pm\n\nYou can also reach us via Viber or Telegram.",
            options: [
                { icon: "phone",     text: "Call Now",      action: "link", url: "tel:09953681497"                    },
                { icon: "mail",      text: "Send Email",    action: "link", url: "mailto:artdeone.educators@gmail.com" },
                { icon: "globe",     text: "Visit Website", action: "link", url: "https://artdeone.com"                },
                { icon: "arrowLeft", text: "Main Menu",     next: "en_menu"                                            }
            ]
        },

        en_contact_action: {
            msg: "Let's talk details!\n\nPhone — 09 953 681 497\nHours — Mon–Sat, 9am–6pm\n\nFeel free to call or message us anytime.",
            options: [
                { icon: "phone",     text: "Call Now",  action: "link", url: "tel:09953681497" },
                { icon: "arrowLeft", text: "Main Menu", next: "en_menu"                        }
            ]
        }

    }; // end botData


    // ══════════════════════════════════════════════════════════
    //  TOGGLE
    // ══════════════════════════════════════════════════════════
    window.toggleChat = function () {
        isChatOpen = !isChatOpen;
        if (isChatOpen) {
            chatWindow.classList.remove('hidden');
            chatWindow.classList.add('flex');
            requestAnimationFrame(() => chatWindow.classList.add('chat-visible'));
            if (messagesArea.children.length === 0) {
                showTyping();
                setTimeout(() => renderStep('start'), 600);
            }
        } else {
            chatWindow.classList.remove('chat-visible');
            setTimeout(() => {
                chatWindow.classList.remove('flex');
                chatWindow.classList.add('hidden');
            }, 300);
        }
    };

    // ══════════════════════════════════════════════════════════
    //  HELPERS
    // ══════════════════════════════════════════════════════════
    function showTyping() {
        const id = 'typing-' + Date.now();
        messagesArea.insertAdjacentHTML('beforeend', `
            <div id="${id}" class="bot-msg w-fit mb-2">
                <div class="flex items-center h-4">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>`);
        scrollToBottom();
        return id;
    }

    function removeTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function addMessage(text, type) {
        const div = document.createElement('div');
        div.className = type === 'bot' ? 'bot-msg mb-2' : 'user-msg mb-2';
        div.innerHTML = text.replace(/\n/g, '<br>');
        messagesArea.appendChild(div);
        scrollToBottom();
    }

    function scrollToBottom() {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    // ══════════════════════════════════════════════════════════
    //  RENDER
    // ══════════════════════════════════════════════════════════
    function renderStep(stepKey) {
        const data = botData[stepKey];
        if (!data) return;
        addMessage(data.msg, 'bot');
        optionsArea.innerHTML = '';
        if (data.options) {
            data.options.forEach(opt => {
                const btn = document.createElement('button');
                btn.className = 'chat-opt-btn';
                btn.innerHTML = btnHTML(opt.icon || 'messageCircle', opt.text);
                btn.onclick = () => handleOptionClick(opt, stepKey);
                optionsArea.appendChild(btn);
            });
        }
    }

    function handleOptionClick(opt, currentStep) {
        addMessage(opt.text, 'user');
        optionsArea.innerHTML = '';

        if (opt.action === 'link') {
            const tId = showTyping();
            setTimeout(() => {
                removeTyping(tId);
                addMessage("Opening link...", 'bot');
                window.open(opt.url, '_blank');
                const backMenu = currentStep.startsWith('mm') ? 'mm_menu' : 'en_menu';
                setTimeout(() => renderStep(backMenu), 900);
            }, 500);
            return;
        }

        if (opt.next) {
            const tId = showTyping();
            setTimeout(() => {
                removeTyping(tId);
                renderStep(opt.next);
            }, 600);
        }
    }

    // ══════════════════════════════════════════════════════════
    //  INIT
    // ══════════════════════════════════════════════════════════
    if (typeof feather !== 'undefined') {
        feather.replace();
        const defaultPanel = document.querySelector('.service-panel:not(.hidden)');
        if (defaultPanel) {
            defaultPanel.querySelectorAll('.pop-in-icon').forEach((icon, i) => {
                icon.style.animationDelay = (i * 100) + 'ms';
                icon.classList.add('animate');
            });
        }
    }

})();
