// js/news-data.js
// Central news articles data — update this file only to publish new articles
// Newest articles first

const newsData = [
  {
    id: "nvidia-sana-wm-open-source",
    title: "NVIDIA, SANA-WM open-source world model အသစ်ကို မိတ်ဆက်",
    subtitle: "image တစ်ပုံနဲ့ camera trajectory ကိုအသုံးပြုပြီး 720p အရည်အသွေးရှိတဲ့ ၁ မိနစ်စာ controllable video ကို single GPU နဲ့ဖန်တီးနိုင်",
    category: "AI Model",
    author: "ART de ONE",
    date: "2026-05-17",
    dateDisplay: "၁၇ မေ ၂၀၂၆",
    thumbnail: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1779090650/Screenshot_2026-05-18_at_14.18.49_ztt44e.png",
    thumbnailAlt: "NVIDIA SANA-WM World Model",
    readTime: "၁ မိနစ်",
    content: [
      {
        type: "paragraph",
        text: "အခုအသစ်ထွက်လာမယ့် Model ကတော့ image တစ်ပုံနဲ့ camera trajectory ကိုအသုံးပြုပြီး 720p အရည်အသွေးရှိတဲ့ ၁ မိနစ်စာ controllable video ကို single GPU နဲ့ဖန်တီးနိုင်တယ်လို့ သိရပါတယ်။"
      },
      {
        type: "paragraph",
        text: "2.6B-parameter အရွယ်အစားရှိတဲ့ ဒီစနစ်မှာ 6-DoF camera control ပါဝင်ပြီး open-source model များထဲမှာ efficiency ပိုင်းအားကောင်းတဲ့နည်းပညာတစ်ခုအဖြစ် စိတ်ဝင်စားမှုရနေပါတယ်။"
      },
      {
        type: "video",
        src: "https://res.cloudinary.com/ddkd9lxpr/video/upload/v1779090456/screen-capture_1_ug5mne.mkv",
        caption: "SANA-WM Demo — 720p controllable video generation"
      },
      {
        type: "heading",
        text: "6-DoF camera control ဆိုတာ"
      },
      {
        type: "paragraph",
        text: "6-DoF camera control ဆိုတာ camera ကို နေရာရွှေ့ခြင်း ၃ မျိုး နဲ့ လှည့်ခြင်း ၃ မျိုး စုစုပေါင်း ၆ မျိုးအထိ ထိန်းနိုင်တာကို ဆိုလိုပါတယ်။"
      },
      {
        type: "heading",
        text: "Efficiency ဆိုတာ"
      },
      {
        type: "paragraph",
        text: "Efficiency ကတော့ model တစ်ခုက quality မကျဘဲ time, compute, GPU memory ကို ဘယ်လောက်သက်သာသက်သာနဲ့ output ထုတ်ပေးနိုင်လဲ ဆိုတဲ့ အဓိပ္ပာယ်ပါ။"
      }
    ],
    tags: ["NVIDIA", "SANA-WM", "World Model", "Open Source", "Video Generation"],
    sourceUrl: "https://nvlabs.github.io/Sana/WM/",
    sourceName: "NVIDIA SANA-WM",
    sourceUrl2: "https://github.com/NVlabs/Sana",
    sourceName2: "GitHub — NVlabs/Sana"
  }
];
