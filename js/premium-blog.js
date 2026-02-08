// premium-blog.js
export const blogPosts = [
    {
        id: 1,
        title: "Mastering Adobe Illustrator Pen Tool in 10 Minutes",
        category: "Tutorial",
        date: "Feb 8, 2026",
        image: "https://images.unsplash.com/photo-1626785774573-4b799312c95d?q=80&w=2070",
        type: "video", // options: video, article, resource
        description: "Pen tool က Design သမားတိုင်းအတွက် မရှိမဖြစ်ပါ။ ဒီ Video မှာတော့ အခြေခံကနေစပြီး complex shape တွေဆွဲတဲ့အထိ လေ့လာရမှာပါ။",
        videoId: "dQw4w9WgXcQ", // Youtube Video ID (v= နောက်ကဂဏန်းများ)
        content: `
            <p class="mb-4">Pen tool သည် Vector design ရေးဆွဲရာတွင် အရေးပါဆုံးသော tool တစ်ခုဖြစ်သည်။ ဤသင်ခန်းစာတွင် pen tool ၏ အခြေခံသဘောတရားများ၊ anchor point များအသုံးပြုပုံနှင့် handle များထိန်းချုပ်ပုံကို လေ့လာရမည်ဖြစ်သည်။</p>
            
            <h3 class="text-xl font-medium text-gray-900 dark:text-white mt-6 mb-3">သင်ခန်းစာ အနှစ်ချုပ်:</h3>
            <ul class="list-disc pl-5 space-y-2 mb-6">
                <li>Straight Lines ဆွဲနည်း</li>
                <li>Curves (အကွေး) များ ထိန်းချုပ်နည်း</li>
                <li>Complex Shapes များပုံဖော်နည်း</li>
            </ul>
        `
    },
    {
        id: 2,
        title: "Top 5 Fonts for Modern Branding in 2026",
        category: "Tips",
        date: "Feb 5, 2026",
        image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000",
        type: "article",
        description: "2026 ခုနှစ်မှာ လူကြိုက်များလာမယ့် Font တွေကို စုစည်းပေးထားပါတယ်။ Client Projects တွေမှာ သုံးဖို့ အဆင်အပြေဆုံး Font တွေပါ။",
        videoId: null,
        content: `
            <p class="mb-4">Branding ပြုလုပ်ရာတွင် Font ရွေးချယ်မှုသည် အလွန်အရေးကြီးပါသည်။ 2026 Trend အရ Sans-serif font များသည် လူကြိုက်အများဆုံး စာရင်းတွင် ပါဝင်နေဆဲဖြစ်သည်။</p>
            <p>ဒီဆောင်းပါးမှာတော့ Free ရော Paid ပါ ရနိုင်မယ့် အကောင်းဆုံး Font ၅ မျိုးကို မိတ်ဆက်ပေးလိုက်ပါတယ်။</p>
        `
    },
    {
        id: 3,
        title: "Free Download: 50+ Custom Brushes",
        category: "Resources",
        date: "Jan 28, 2026",
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974",
        type: "resource",
        description: "ကျွန်တော့်ကျောင်းသားတွေအတွက် သီးသန့်ဖန်တီးထားတဲ့ Brush Set လေးကို ဒီမှာ Download ရယူနိုင်ပါပြီ။",
        videoId: null,
        content: `
            <p class="mb-6">Digital Painting အတွက် အထူးဖန်တီးထားသော Brush များဖြစ်ပါသည်။ အောက်ပါ Button ကိုနှိပ်ပြီး Download ရယူနိုင်ပါသည်။</p>
            
            <a href="#" class="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:opacity-80 transition-opacity">
                <i class="fa-solid fa-download"></i> Download Brushes (.abr)
            </a>
        `
    }
];
