// Prompts Data Array
const promptsData = [
    {
        id: 1,
        title: "Hella Beauty",
        model: "Powerful Ai Model",
        // Main Image for Card
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770034731/Product-prompt-1_ygf3re.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770034731/Product-prompt-1_ygf3re.jpg",
        // ADDED: Gallery Images (ပုံ ၂-၃ ပုံ ပြချင်ရင် ဒီလို images: [] ထဲမှာ coma ခံပြီးထည့်ရပါတယ်)
        images: [
            "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770034731/Product-prompt-1_ygf3re.jpg",
            "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770357343/hella-beauty_mjlksy.png", 
            "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770357612/hella-beauty-2_t0p4l0.png"
        ],
        prompt: "Ultra-realistic skincare product shot, matte white pump bottle labeled hella beauty water bank moisture lotion, centered on layered natural stone. Surrounded by moss, white pom-pom flowers, cream daisies, sage rose. Soft warm beige background. Soft diffused daylight from upper left, shallow depth of field, sharp focus on label. 8k, minimal luxury, cinematic lighting, photorealistic."
    },
    {
        id: 2,
        title: "Strawberry Mountain",
        model: "Powerful Ai Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770035149/ADO_product_jayuu1.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770035149/ADO_product_jayuu1.jpg",
        images: [
            "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770035149/ADO_product_jayuu1.jpg",
            "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770358338/Google_AI_Studio_2026-02-05T07_51_56.886Z_bs2kvd.png", 
            "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770358698/straberry_hbkwue.jpg",
            "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770358813/straberry-2_abrtmf.jpg"
        ],
        prompt: "Cinematic macro shot, NFC Strawberry Juice bottle with heavy condensation and frost, resting on icy rocks. Snowy mountain background, drifting mist. Fresh strawberries on ice. Soft sunrise light, cold-meets-warm contrast, deep red highlights, premium feel. --ar 9:16"
    },
    {
        id: 3,
        title: "Product Realistic",
        model: "Powerful Ai Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770035389/hold_prodcut_dg1cqk.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770035389/hold_prodcut_dg1cqk.jpg",
        prompt: "A majestic Sphinx statue, synthwave aesthetic, low angle shot, vector art style, flat design, vibrant purple and neon pink color palette, sharp geometric shadows, clean lines, minimalist background, retrowave vibe, bold illustration --ar 3:4"
    },
    {
        id: 4,
        title: "Manipulation Style",
        model: "Powerful Ai Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770035599/coffee-1_laoc5l.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770035599/coffee-1_laoc5l.jpg",
        prompt: "Aerial surreal photography, giant white foam cup labeled AdO The Art of Intelligence sitting in the middle of Sule Pagoda Road, Yangon. Massive hand pouring steaming coffee from glass press. Background: Golden Sule Pagoda, vintage colonial buildings, red and yellow YBS buses, busy traffic. Warm golden sunset light, long shadows, dreamlike photo manipulation style, hyper-realistic, 8k resolution --ar 16:9"
    },
    {
        id: 5,
        title: "Gold Luxury Coffee",
        model: "Powerful Ai Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770035739/grok-image-bae21072-b2eb-46d7-8eda-62d478241fc7_1_pyirk5.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770035739/grok-image-bae21072-b2eb-46d7-8eda-62d478241fc7_1_pyirk5.jpg",
        prompt: "Ultra-cinematic premium coffee advertisement, rich deep red matte bottle labeled ADO BREW in elegant metallic gold typography. Floating upright amidst swirling espresso waves and flying roasted coffee beans. Gold foil accents, steam curling around bottle. Dramatic lighting with warm golden highlights and deep crimson shadows, ruby red color grading. Macro water droplets, cinematic depth of field, photorealistic, 8k, luxury branding aesthetic."
    },

    {
        id: 6,
        title: "Neon Retro",
        model: "Powerful Ai Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769654195/Neon_Retro-photo_cs1bxd.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769654195/Neon_Retro-photo_cs1bxd.jpg",
        prompt: "A classic black stovetop moka pot and a small green espresso cup on a counter, bright window with neon green stripes in background, heavy grain texture, noise shading, stipple effect, retro minimalist illustration, vibrant orange and neon green colors, geometric shapes, high contrast, flat perspective --ar 3:4"
    },
    {
        id: 7,
        title: "Mystic Reading Room",
        model: "Powerful Ai Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769654195/Mystic_Reading_Room-photo_rnroji.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769654195/Mystic_Reading_Room-photo_rnroji.jpg",
        prompt: "A person reading a giant ancient book at a wooden desk by candlelight, cozy magical library, tall candlesticks, bookshelf filled with books, view of starry night through window, woodcut or linocut illustration style, grainy texture, stippling shading, risograph print aesthetic, muted pink and deep blue color palette, whimsical and mystical atmosphere --ar 3:4"
    },
    {
        id: 8,
        title: "Vivid Mythic Fantasy",
        model: "Powerful Ai Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769654195/Vivid_Mythic_Fantasy-photo_meiscz.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769654195/Vivid_Mythic_Fantasy-photo_meiscz.jpg",
        prompt: "A majestic Sphinx statue, synthwave aesthetic, low angle shot, vector art style, flat design, vibrant purple and neon pink color palette, sharp geometric shadows, clean lines, minimalist background, retrowave vibe, bold illustration --ar 3:4"
    },
    {
        id: 9,
        title: "Modern Radiance",
        model: "Powerful Ai Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769654195/download_y0zxo3.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769654195/download_y0zxo3.jpg",
        prompt: "Surreal fashion illustration, side profile of a dark-skinned woman with short hair walking, wearing an abstract massive dress that expands into a rigid geometric pleated fan shape behind her, the fan has radial segments of cobalt blue and white, glowing peach and orange gradient rims, heavy grainy noise texture, retro-modern airbrush style, flat vector design with stippled shading, deep blue background, clean lines, editorial art --ar 3:4"
    },
    {
        id: 10,
        title: "Cozy Urban Play",
        model: "Powerful Ai Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769654195/download_1_q6aqc3.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769654195/download_1_q6aqc3.jpg",
        prompt: "A relaxed young woman sitting on the sidewalk leaning against a rust-colored tiled wall, listening to music with green headphones, holding a black smartphone, one hand resting behind her head, short brown bob hair, wearing a white polka-dot t-shirt with yellow striped sleeves and blue jeans, yellow socks, dark sneakers, stylized green trees in background, textured flat illustration, grainy chalk texture, modern indie art style, lo-fi aesthetic, soft afternoon light --ar 3:4"
    },

    {
        id: 11,
        title: "JBL Headphones",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769088478/31813806-a6be-4a6b-be08-cbe0e9f9ddaa_szmzow.png",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769088478/31813806-a6be-4a6b-be08-cbe0e9f9ddaa_szmzow.png",
        prompt: "A surreal and striking advertisement for JBL headphones, featuring two distinct panels. In the top panel, a young man with glasses and headphones is positioned centrally, with two exaggerated, angry faces on either side, mouths agape and contorted in fury, seemingly trying to engulf him. The colors are vibrant, with a focus on the reds and blues of the jackets and the pale skin tones of the aggressors. The lighting is dramatic, highlighting the tension and the wide-open mouths. The bottom panel mirrors this composition, but with different individuals. A young man with headphones is again at the center, looking serene with his eyes closed. On either side, two older men, one with grey hair and the other bald and bearded, are depicted with similarly aggressive, shouting expressions, their mouths wide open, their faces close to the central figure. The lighting and color palette are comparable to the top panel, emphasizing the contrast between the calm of the headphone-wearer and the chaos surrounding him. The JBL logo is subtly visible on both central figures' clothing, reinforcing the product's message of escape or immersion in sound amidst external noise or conflict. The overall style is hyperrealistic with a touch of caricature in the expressions of the surrounding figures, creating a powerful visual metaphor. --ar 9:16 --v 5.2"
    },

    {
        id: 12,
        title: "Crocs in Bloom",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769082824/4a31b2d9-f71b-42c9-b882-bf3b3695c135_jxek6a.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769082824/4a31b2d9-f71b-42c9-b882-bf3b3695c135_jxek6a.jpg",
        prompt: "A young man with curly brown hair, wearing a leopard-print jacket and tan pants, is leaping through a field of vibrant flowers under a bright blue sky with fluffy clouds. His left leg is extended forward, showcasing a brown Crocs sandal. The camera angle is low, emphasizing the dynamic movement and the blooming flora in the foreground. The overall mood is energetic and whimsical, with a shallow depth of field blurring the background."
    },
    {
        id: 13,
        title: "Low-angle Fisheye Shot",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769083370/6e559206-2ba9-49c9-98d2-aa248269b8df_bpoac2.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769083370/6e559206-2ba9-49c9-98d2-aa248269b8df_bpoac2.jpg",
        prompt: "A low-angle fisheye shot captures a young woman in mid-air, performing a dynamic stunt. Their right arm is outstretched towards the camera, fingers spread wide, while their left arm is bent, holding their body in a balanced pose. They wear a white tank top, blue jeans, and vibrant red sneakers with white accents. The background features brick buildings with visible windows, framing a bright blue sky. The perspective distorts the scene, emphasizing the action and the urban environment."
    },
    {
        id: 14,
        title: "Surreal Shot",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769083879/50efdb3c-0e07-44f4-b912-e611eb8bfac1_ly3kc5.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769083879/50efdb3c-0e07-44f4-b912-e611eb8bfac1_ly3kc5.jpg",

        images: [
            "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769083879/50efdb3c-0e07-44f4-b912-e611eb8bfac1_ly3kc5.jpg",
            "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770358131/Generated_Image_February_06_2026_-_12_34PM_cachtz.jpg", 
            "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1770358285/Generated_Image_February_06_2026_-_12_41PM_fa0lt9.jpg"
        ],
        prompt: "A low-angle, surreal shot of a Black woman with dark skin and braided hair, wearing a colorful striped long-sleeved shirt and denim shorts, her expression serene, towering over a cityscape. She holds a turquoise handbag in her right hand. Her left hand is extended slightly outwards, palm up. She is wearing an oversized, light-colored boot, suggesting a fantastical scale. In the background, the Seattle skyline is visible, complete with the Space Needle. The sky is a vibrant blue with scattered white clouds, and the overall lighting is bright and sunny. The image has a collage-like aesthetic, with the woman seemingly placed atop the city. The style is reminiscent of album art or avant-garde fashion photography. --ar 9:16 --style raw"
    },
    {
        id: 15,
        title: "Inflatable Tote Bag",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769085323/a212b9b0-801c-49c9-a294-0cfad6d5e34a_eenndx.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769085323/a212b9b0-801c-49c9-a294-0cfad6d5e34a_eenndx.jpg",
        prompt: "A giant, inflatable purple tote bag with 'THE TOTE BAG MARC JACOBS' printed on it stands in the middle of a narrow city street. Four people are looking up at the bag, some taking pictures. The bag is so large it dwarfs the surrounding buildings, which are a mix of brick and painted facades. The sky is visible between the buildings, with some green trees at the top. The lighting suggests it is daytime, with shadows cast on the street. The overall scene has a surreal and playful quality. --ar 16:9 --style raw --chaos 10"
    },
    {
        id: 16,
        title: "GUCCI Vintage Ad",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769086798/ratio-3-4_iukhad.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769086798/ratio-3-4_iukhad.jpg",
        prompt: "/imagine prompt: A Gucci advertisement featuring two models, a man and a woman, with dark skin and athletic builds, sitting on the tailgate of a vintage station wagon. The woman is wearing a green knit sweater with intricate beading around the neckline and a light-colored skirt. The man is wearing a light brown patterned sweater, green shorts, white socks, and brown loafers. They are both looking directly at the camera with serious expressions. In the foreground, a green Gucci duffel bag with red and green stripes rests on the ground. Behind the models, inside the open tailgate, are several other Gucci bags, including a beige tote bag and a woven bag. A tennis racket is propped up against the side of the car. The Gucci logo is prominently displayed at the top of the image. The lighting is soft and even, suggesting an outdoor setting, possibly a park or a sporty venue. The overall aesthetic is sophisticated and high-fashion, with a vintage feel. --ar 13:4 --style raw --v 6"
    },

    {
        id: 17,
        title: "Sunlit Scholars",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769082373/1._Sunlit_Scholars_mqfwsc.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769082373/1._Sunlit_Scholars_mqfwsc.jpg",
        prompt: "A young woman with round glasses sitting on the floor between outdoor bookshelves, reading a book intently, wearing a white t-shirt and shorts, soft warm sunlight filtering through, aesthetic library setting, film grain, vintage photography style, candid shot, 35mm lens, photorealistic."
    },
    {
        id: 18,
        title: "Warm Sunlit Urbanism",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769082372/2._Warm_Sunlit_Urbanism_usofwd.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769082372/2._Warm_Sunlit_Urbanism_usofwd.jpg",
        prompt: "Low angle shot of a man walking past a tall pastel pink building, clear blue sky, strong sunlight creating hard shadows, minimalist urban architecture, street photography, warm tones, sun flare, cinematic composition, high resolution."
    },
    {
        id: 19,
        title: "Sunlit Serendipity",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769082374/3._Sunlit_Serendipity_lxa13f.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769082374/3._Sunlit_Serendipity_lxa13f.jpg",
        prompt: "A candid shot of a happy couple laughing and dancing in a golden dry grass field, wearing casual autumn aesthetic clothes, warm golden hour sunlight, soft focus background, joyful expression, vintage film look, Kodak Portra 400 style."
    },
    {
        id: 20,
        title: "Sunlit Stripes",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769082372/4._Sunlit_Stripes_zurvbc.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769082372/4._Sunlit_Stripes_zurvbc.jpg",
        prompt: "A cinematic medium shot inside a vintage train carriage. A brunette woman is sleeping while sitting on a retro vertically-striped bench seat. She is holding a large open newspaper in front of her chest. Intense golden hour sunlight streaming through the window behind her, illuminating the newspaper to be translucent. High contrast shadows, warm yellow tones, film grain, Kodak Portra 400 aesthetic, nostalgic and peaceful atmosphere."
    },
    {
        id: 21,
        title: "Earthshine Vibes",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769082372/5._Earthshine_Vibes_kmiaxf.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1769082372/5._Earthshine_Vibes_kmiaxf.jpg",
        prompt: "Low angle outdoor shot of a woman kneeling on a mound of reddish-brown soil, planting a small green plant with her bare hands. She is wearing a vintage sleeveless patterned blouse and a brown skirt. A grey watering can sits on the dirt next to her. The background is a clear, deep blue sky without clouds. A prominent vertical rainbow light leak (spectral lens flare) cuts down from the top left of the frame. Harsh natural sunlight, sharp details on the soil texture, 1970s film aesthetic, Kodachrome colors, realistic and candid."
    },

    {
        id: 22,
        title: "Mystic Autumn",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1768474134/Mystic_Autumn_-_final_h4gtze.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1768474134/Mystic_Autumn_-_final_h4gtze.jpg",
        prompt: "A whimsical flat vector illustration of a young elf girl with pointed ears and braided hair sitting in front of a giant mushroom in a magical forest. The background features a large, intricate sun-like mandala pattern with swirling warm orange and red gradients. Hand-drawn charcoal texture, vibrant autumn color palette, storybook aesthetic, minimal shading, clean outlines, high contrast."
    },
    {
        id: 23,
        title: "Eternal Nexus Art",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1768474134/Eternal_Nexus_Art_-_final_qmvspf.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1768474134/Eternal_Nexus_Art_-_final_qmvspf.jpg",
        prompt: "A mystical illustration of a serene goddess sitting in a dark enchanted forest, holding a glowing digital tablet in her lap. The tablet screen emits a warm, magical light displaying a fiery leaf symbol. Above her, five glowing orb portraits float in a semi-circle, depicting diverse ethereal faces. The scene blends ancient mythology with modern technology, featuring textured brushstrokes, warm orange and green tones, soft ambient lighting, eternal nexus aesthetic, fantasy art style, detailed foliage background."
    },
    {
        id: 24,
        title: "Dynamic Primalism",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1768474135/Dynamic_Primalis_-_final_fd8rzt.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1768474135/Dynamic_Primalis_-_final_fd8rzt.jpg",
        prompt: "Surreal dark fantasy art of a cracked obsidian statue of a primal warrior or beast, standing perfectly still in a void. Through the glowing cracks in the stone skin, a chaotic swirling galaxy of neon fire and lightning is visible, revealing a hidden universe inside. Dynamic lighting focuses only on the cracks. The style blends classical sculpture with glitch art aesthetic. High contrast, hyper-realistic texture, hidden energy concept, 'Dynamic Primalism' visualized."
    },
    {
        id: 25,
        title: "Mystic Primalism",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1768474135/Mystic_Primalism_-_final_ctf7v9.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1768474135/Mystic_Primalism_-_final_ctf7v9.jpg",
        prompt: "Vintage dark fantasy illustration of a warrior emerging from deep teal and cyan mist. The warrior holds a glowing golden shield that illuminates the fog with amber light. Heavy film grain, stipple texture, and chalk pastel on rough paper style. High contrast between cold blue shadows and warm yellow highlights. 80s paperback cover art aesthetic, noisy, weathered look."
    },
    {
        id: 26,
        title: "Illuminated Landscape Etching",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1768474135/Illuminated_afylz2.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1768474135/Illuminated_afylz2.jpg",
        prompt: "A high-contrast woodcut print illustration of a rolling green hill illuminated by a bright, stylized sun bursting with rays. The sun's rays are depicted as sharp, linear etchings radiating across a black sky. The foreground features detailed white daisies and grass on a dark background. Bold linework, cross-hatching texture, folk art style, limited color palette of black, white, and moss green. Clean, graphic, and engraved aesthetic."
    },

    {
        id: 27,
        title: "Vintage Pastel Retro",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1767176100/Vintage_Pastel_Retro_rwrufl.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1767176100/Vintage_Pastel_Retro_rwrufl.jpg",
        prompt: "A high-angle POV shot of a teenage girl in a vintage pink blouse opening an open suitcase filled with old photographs and memories, seated on a red velvet sofa, another girl partially visible next to her, direct on-camera flash photography, harsh shadows, vibrant pastel colors, pink and red tones, 1990s disposable camera aesthetic, candid moment, nostalgic mood, soft vignette, grainy film texture, lo-fi aesthetic --ar 3:4 --v 6.0"
    },
    {
        id: 28,
        title: "Singer Sewing Machine",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1767176100/Nostalgic_Sewing_Scene_esnaq2.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1767176100/Nostalgic_Sewing_Scene_esnaq2.jpg",
        prompt: "A cozy, nostalgic medium shot of a woman sewing on a vintage black Singer sewing machine in a cluttered home corner, late 1980s aesthetic, wearing a floral patterned house dress and permed hair, sunlight streaming through a lace curtain window illuminating floating dust particles, table covered with fabric scraps, scissors, and a Royal Dansk butter cookie tin used for sewing supplies, warm golden afternoon lighting, shot on 35mm film, Kodak Gold 200, soft focus, slight film grain, sentimental atmosphere, homely and authentic --ar 4:5 --v 6.0"
    },
    {
        id: 29,
        title: "Wong Kar-wai",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1767176112/Wong_Kar-wai_g8mub6.png",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1767176112/Wong_Kar-wai_g8mub6.png",
        prompt: "A candid street photography shot of a stylish young Asian couple walking down a busy, neon-lit street at dusk, late 1980s Hong Kong aesthetic, the girl wearing a high-waisted denim skirt and an oversized white blouse tucked in, the boy in a loose patterned button-up shirt and pleated trousers, blurred passersby in the background, vibrant city lights reflecting on wet pavement, cinematic lighting, shot on 35mm Fujifilm Superia, greenish-blue film tone, moody and nostalgic, natural grain, Wong Kar-wai style atmosphere --ar 4:5 --v 6.0"
    },
    {
        id: 30,
        title: "Office Nostalgia",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1767176104/Office_Nostalgia_retk1u.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1767176104/Office_Nostalgia_retk1u.jpg",
        prompt: "A cinematic medium shot of a young businessman in a 1980s corporate office, talking on a vintage beige landline telephone receiver, wearing a white dress shirt and patterned tie, standing near a large office window with venetian blinds, golden hour sunlight casting horizontal shadow lines across his face and shirt, a female colleague in the foreground with her back to the camera (over-the-shoulder shot), dusty atmosphere, retro office aesthetic, shot on 35mm film, Kodak Ektar 100, warm tones, high contrast, dramatic lighting, authentic 80s hairstyle --ar 4:5 --v 6.0"
    },
    {
        id: 31,
        title: "Dusty Rangers",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1767176101/download_ptn8bt.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1767176101/download_ptn8bt.jpg",
        prompt: "A nostalgic late-1990s childhood scene, top-down view of two kids’ dirty hands throwing worn Power Rangers collectible cards on the dry dusty dirt ground, cards are faded, creased corners, scattered on the soil, small pebbles and dry leaves nearby, a small rubber band bundle of cards on the side, harsh afternoon sunlight casting strong shadows, outdoor street atmosphere, candid documentary style, shot on 35mm film, Fujifilm Superia 400 look, earthy tones, authentic film grain, slightly imperfect focus, sentimental mood --ar 4:5 --v 6.0"
    },

    
    {
        id: 32,
        title: "Cozy Noir-Blue",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766328159/Cozy_Noir-Blue_sskxbm.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766328159/Cozy_Noir-Blue_sskxbm.jpg",
        prompt: "Minimalist flat illustration of a smartphone charging on a window sill at night, moonlight casting long blue shadows, grainy texture, noise effect, risograph print style, deep blue and soft cream color palette, cozy noir atmosphere, clean lines, emotional storytelling, lo-fi aesthetic --ar 3:4"
    },
    {
        id: 33,
        title: "Digital Zen",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766328158/Digital_Zen_yvtotp.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766328158/Digital_Zen_yvtotp.jpg",
        prompt: "minimalist flat illustration of a quiet park, simple rounded trees and bushes, clean line art, warm yellow and deep blue color palette, a small white cat sitting calmly on a decorative bench, empty background with lots of white space, calm and balanced composition, digital zen aesthetic, vector style, no shading, smooth curves --ar 3:4"
    },
    {
        id: 34,
        title: "Eco Charm Illustration",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766328163/Eco_Charm_Illustration_hvihwa.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766328163/Eco_Charm_Illustration_hvihwa.jpg",
        prompt: "Charming hand-drawn nature illustration of a winding path through a green forest, top-down view, cute rounded trees and bushes, a small blue pond, soft textured style like colored pencils or chalk, earthy green and brown color palette, flat design, cozy and peaceful atmosphere, children's book illustration style, simple details --ar 3:4"
    },
    {
        id: 35,
        title: "Kaleidoscope Theater",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766328159/Kaleidoscope_Theater_dqsisz.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766328159/Kaleidoscope_Theater_dqsisz.jpg",
        prompt: "Vibrant festival illustration of traditional masks hanging on a string, a character wearing a blue kimono smiling, colorful confetti background, risograph print texture, grainy noise, bright primary colors like red, green, yellow and pink, folk art style, playful and festive atmosphere, flat vector design with bold patterns --ar 3:4"
    },
    {
        id: 36,
        title: "Urban Bloom",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766328158/urbanbloom_lpl5c2.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766328158/urbanbloom_lpl5c2.jpg",
        prompt: "Vibrant flat vector illustration of a futuristic night market under giant glowing solar panels shaped like trees, warm yellow street lights casting soft glows, diverse people shopping at colorful stalls, deep blue night sky with stylized stars, high contrast, clean lines, grainy texture, modern urban aesthetic, joyful and lively atmosphere, purple and orange color accents --ar 3:4"
    },

    

    {
        id: 37,
        title: "Rustic Market Elegance",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766129731/67175f64-6394-4cf7-a824-c308b06b753f_snf1en.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766129731/67175f64-6394-4cf7-a824-c308b06b753f_snf1en.jpg",
        prompt: "Candid street photography of a busy traditional morning market in Myanmar. A large red traditional Pathein umbrella dominates the foreground, shading bamboo baskets filled with fresh vegetables and flowers. A local man wearing a longyi and bamboo hat (Khamauk) is browsing. Golden morning sunlight filtering through dust, creating a warm, nostalgic atmosphere. Old wooden shop houses in the background. Authentic daily life in Mandalay, rich cultural colors, grainy film texture, 35mm photography --ar 3:4 --v 6"
    },
    {
        id: 38,
        title: "Retro Vibes Chic",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766129697/low-angle_fcrtrm.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766129697/low-angle_fcrtrm.jpg",
        prompt: "Low angle fantasy shot of a beautiful Myanmar girl sitting on a large branch of an ancient Banyan tree at night. She is wearing a modern traditional Burmese silk dress, soft Thanaka on her cheeks. Glowing giant magical mushrooms or lanterns attached to the tree bark are illuminating her face with warm amber light. Dreamy, surreal atmosphere. Dark blue night sky peaking through leaves. Mystical forest vibe, soft focus, ethereal glow, cinematic lighting, photorealistic fantasy art"
    },
    {
        id: 39,
        title: "Coastal Dreaming Vibes",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766129698/cozy-scene_ctbca1.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766129698/cozy-scene_ctbca1.jpg",
        prompt: "Cozy scene of a Myanmar girl sitting by a large window in a small apartment near the Yangon river at sunrise, wearing light cotton loungewear, writing in her journal. Warm yellow glow from a simple lamp contrasts with the cool blue morning sky outside, faint silhouettes of boats on the water, soft pastel colors, nostalgic quiet mood, light film grain, dust motes in the air, peaceful coastal dreaming vibes --ar 3:4 --style raw --v 6"
    },
    {
        id: 40,
        title: "Avant-Futuristic Chic",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766129697/low-angle-fashion_fvks8r.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766129697/low-angle-fashion_fvks8r.jpg",
        prompt: "Low angle fashion shot of a chic model stepping out of a vintage sage green car, door open. She is wearing a green patterned jacket, striped trousers, leather boots, and retro sunglasses. 1970s fashion aesthetic. Wide angle lens, distorting perspective slightly for a dynamic look. Overcast soft lighting, grassy field background. High-end editorial photography, Kodachrome film stock, rich colors, sharp focus on subject --ar 3:4 --style raw --v 6"
    },
    {
        id: 41,
        title: "Soft Horizon Chic",
        model: "Any AI Model",
        image: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766129698/fashion-editorial_r0okqj.jpg",
        fullImage: "https://res.cloudinary.com/ddkd9lxpr/image/upload/v1766129698/fashion-editorial_r0okqj.jpg",
        prompt: "Fashion editorial shot of a stylish woman with a short bob haircut wearing an oversized beige blazer and linen trousers, standing behind a blurred wire fence on a sandy hill. Soft morning sunlight casting gentle diagonal shadows. Minimalist composition, muted neutral color palette of cream, sand, and pale blue sky. Dreamy, nostalgic atmosphere, low angle shot, 35mm film grain aesthetic, high fashion magazine style --ar 3:4 --style raw --v 6"
    },
    
    // Add more prompts here as needed - the system will handle pagination automatically
];