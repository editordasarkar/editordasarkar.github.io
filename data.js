/* ==========================================================================
   HARSHKUMAR PUTHRAN — PORTFOLIO CONTENT
   --------------------------------------------------------------------------
   This is the ONLY file you need to edit.
     PART 1  → your video links (YouTube unlisted / Google Drive)
     PART 2  → your profile, résumé, skills, contact details
   Save the file and refresh the browser to see changes.
   ========================================================================== */


/* ==========================================================================
   PART 1 — YOUR VIDEO LINKS   ★ PASTE YOUR LINKS HERE ★
   --------------------------------------------------------------------------
   For every project, paste a link inside the quotes of  link: ""

   ✔ YouTube (unlisted is fine) — any of these formats work:
       https://youtu.be/VIDEO_ID
       https://www.youtube.com/watch?v=VIDEO_ID
       https://www.youtube.com/shorts/VIDEO_ID
     → thumbnail is picked up automatically.

   ✔ Google Drive:
       https://drive.google.com/file/d/FILE_ID/view?usp=sharing
     → In Drive: Share → General access → "Anyone with the link" (Viewer).
       Otherwise visitors will see "You need access".
     → Drive thumbnails don't always load, so you can add your own
       image in  thumbnail: ""  (e.g. "assets/thumbs/my-video.jpg").

   ✔ Any other link (Instagram, Vimeo, Behance…) opens in a new tab.

   Options per project:
     title     – name shown on the site
     type      – short label, e.g. "Reel", "Ad Film", "Campaign"
     year      – e.g. "2025"
     link      – your YouTube / Drive link ("" = shows "Coming soon")
     thumbnail – optional custom image path or URL
     vertical  – true for 9:16 videos (Reels / Shorts), false for 16:9

   Add a project: copy one { ... }, line, paste it below, change the text.
   Remove a project: delete its { ... }, line.
   ========================================================================== */

const SETTINGS = {
  // How videos open when clicked:  "popup" (plays on your site) or "newtab"
  openVideosIn: "popup",

  // Your main showreel — shows a "Play showreel" button on the first screen.
  // Leave "" to hide the button.
  showreel: "",
  showreelVertical: false,

  // ---- 3D CHARACTER ----------------------------------------------------
  // Put your 3D model file (.glb) in the "assets" folder and write its path
  // here, e.g. "assets/character.glb". Leave "" to use the violet 3D sculpture.
  // Make one free from a photo with an image-to-3D tool (Meshy, Tripo3D…)
  // and export it as GLB.
  character3D: "assets/character.glb",
  // If your model faces the wrong way, turn it here (in degrees, e.g. 90, 180).
  characterTurn: 0,
  // Make the model bigger/smaller (1 = default).
  characterScale: 1,
  // How shiny the 3D model looks: 0 = fully matte, 1 = glossy. Try 0.1 – 0.4.
  characterShine: 0.32,
  // What kind of model it is, so the camera frames it right:
  //   "bust"  = head & shoulders   "waist" = waist-up   "full" = full body
  characterFraming: "waist",
  // Soft fade at the bottom edge of the model (0 = off, 0.2 = gentle, 0.35 = long fade)
  characterFade: 0.28,
  // How much the model melts into the background (0 = crisp cut-out, 1 = very soft).
  characterBlend: 0.6,
  // Extra realism: sharper textures, skin pores, fabric weave (0 = off, 1 = normal, 1.5 = strong).
  characterDetail: 1,
};

// A short note shown under the Work section. Leave "" to hide it.
const WORK_NOTE =
  "Work from my time at BlueApple DigiMedia (2024 – 2025) is covered by a non-disclosure " +
  "agreement, so those projects aren't shown here. Happy to talk about my role there on a call.";

const WORKS = [
  {
    number: "01",
    title: "Rareminds",
    subtitle: "Education Campaign Video Series",
    role: "Visual Media Artist · Sept 2026 – Now",
    // Awards can be one line ("Award name") or a list of cards like below.
    award: [
      { title: "Rising Star Award", when: "Month 01", text: "Recognised in my first month for outstanding performance and contribution." },
      { title: "Peak Performer",    when: "Month 02", text: "Named Peak Performer in my second month for consistently high-impact work." },
    ],
    projects: [
      { title: "The Teacher Within — TDP Story Film", type: "AI Storytelling", year: "2026", link: "https://drive.google.com/file/d/1xP_4rWD5dv_W4Yh607rF8O6LcML6EUgV/view?usp=drive_link", thumbnail: "assets/thumbs/tdp-story-film.jpg", vertical: false },
      { title: "Assessment Should Lead Somewhere — SaaS Product Demo", type: "Product Communication", year: "2026", link: "https://drive.google.com/file/d/1d9U3OZdW0djhvMdo4rE6bwxXcg7jFoZD/view?usp=drive_link", thumbnail: "assets/thumbs/saas-product-demo.jpg", vertical: false },
      { title: "Student Video Résumé — Career Showcase", type: "Video Résumé", year: "2026", link: "https://drive.google.com/file/d/15n27U8JUxKcT-Rt2ywPkJHYVtN4kAsbE/view?usp=drive_link", thumbnail: "assets/thumbs/student-video-resume.jpg", vertical: false },
    ],
  },
  {
    number: "02",
    title: "Cricbaby",
    subtitle: "Brand Identity & Campaigns",
    role: "Creative Head · 2025 – 2026  ·  Graphic Designer · 2023 – 2024",
    award: "Impact Leadership",
    projects: [
      { title: "Black Friday Week — Carousel Campaign", type: "Social Carousel", year: "2025", thumbnail: "assets/thumbs/cricbaby-black-friday.jpg",
        link: "https://drive.google.com/drive/folders/1EbIDX1zjRmCCufzr43Nf2v0scMjQVhz9?usp=drive_link",
        // Image carousel: list the slides (Drive file links or IDs, or files in assets/). Opens as a swipeable gallery.
        images: [
          "1H-Mp1hjMlFHc85yYqSCcLdH3cu_SALnb",
          "168ZQC7GopDPGhcwwRGDxWZetvlyjP3rb",
          "1NJVwst6kFV_bbDgSN2a5cjGSYI1Usxxi",
          "1OIcAlL2COLTKne0IPYjqYumKPdQZTkys",
          "1HQAmfZInU691JFdhtFKuypxpNsfYdcSn",
          "1aCU8WoSZb6m9C3TjbIhfWPRPI1m9O2kW",
        ] },
      { title: "LIAM PLUNKETT x CRICBABY", type: "Live Edit", year: "2024", link: "https://drive.google.com/file/d/1OpDxcx8z2FN0cYsu8dhC3S8Ws6sJ8h-0/view?usp=drive_link", thumbnail: "assets/thumbs/cricbaby-liam-plunkett.jpg", vertical: true },
      { title: "CAPTAIN ANIKA KOLAN x CRICBABY", type: "Live Edit", year: "2024", link: "https://drive.google.com/file/d/1MMNjQ2mV0GIorwghvnRzCtB6kKHqcUJt/view?usp=drive_link", thumbnail: "assets/thumbs/cricbaby-anika-kolan.jpg", vertical: true },
    ],
  },
  {
    number: "03",
    title: "Freelance & Independent",
    subtitle: "Client Commissions · YouTube · Sales & Training",
    role: "Freelance Video Editor · Premiere Pro · After Effects",
    award: "",
    projects: [
      { title: "The Content Rule", type: "Sales Training", year: "2026", link: "https://drive.google.com/file/d/1yRUCRZtZZFlCuEGbzQo8CPxBcOXbMNXi/view?usp=drive_link", thumbnail: "assets/thumbs/content-rule.jpg", vertical: false },
      { title: "Funniest Code Red Ever — GTA 5 RP", type: "YouTube · Jimmy Gaming", year: "2026", link: "https://drive.google.com/file/d/1Hv6lti_v0VfsQHpLldV9gDTWI3rAwxoN/view?usp=drive_link", thumbnail: "assets/thumbs/gta-rp-code-red.jpg", vertical: false },
      { title: "She Is Funny & Interesting — GTA RP Highlights", type: "YouTube · Jimmy Gaming", year: "2026", link: "https://drive.google.com/file/d/1IE2VCYr9nKqglNKEirTSmD2uXFoqw052/view?usp=drive_link", thumbnail: "assets/thumbs/gta-rp-highlights.jpg", vertical: false },
    ],
  },
  {
    number: "04",
    title: "Brand Lab — The Shoe Factory",
    subtitle: "Concept Brand for Premium Custom Footwear · Identity & Advertising",
    role: "Branding & Advertising Project · B.A. Multimedia & Mass Communication",
    award: "",
    projects: [
      // A brand created from scratch in college. Add carousels with images: [ ... ] and videos with link: "".
      { title: "Brand Manual — Identity & Guidelines", type: "Brand Identity", year: "2023", thumbnail: "assets/thumbs/shoe-factory-brand-manual.jpg",
        link: "https://drive.google.com/drive/folders/1D5NCwBRRiZHT_TF3sohuH2MJL0FoXxDG?usp=drive_link",
        ratio: "1600 / 2270", // page shape (width / height) so the pages aren't cropped
        images: [
          "1s1TMycnPovrhdZhyd_A-P84fcNiuyUy3",
          "1Ar3Ki4IPcF1DhOdKCWRfnJr6bwIET3UG",
          "1JVstBDubShE7OgnUDZlVnxCueC1Ly0Tv",
          "1LoJzgv1w25Gg8rtq0QVBEv_NfKnXDltS",
          "1n8aJf-C-XU4c_XZvIjyJyMI-wXyd3yNZ",
          "1JaWOik7FBaHX6XOAMZVqBWIj15JD4CCS",
          "1WlpCjoxrcWxGfL07xg3vl_fMDuAO2bEK",
        ] },
      { title: "Print & Outdoor Campaign",       type: "Advertising",   year: "2023", link: "https://drive.google.com/file/d/1QeqXN5NrXwg80IKb5augDuwuZ1AF0ggp/view?usp=drive_link", thumbnail: "assets/thumbs/shoe-factory-print-campaign.jpg", vertical: false },
      { title: "Brand Commercial — Storyboard",  type: "Storyboard",    year: "2023", link: "https://drive.google.com/file/d/1YUNvjKWM0dNYJx73AsPx7laCtsvu0kbC/view?usp=drive_link", thumbnail: "assets/thumbs/shoe-factory-storyboard.jpg", vertical: false },
    ],
  },
  {
    number: "05",
    title: "AI Projects & Campaigns",
    subtitle: "AI Films · Generative Visuals · AI-Driven Campaigns",
    role: "Midjourney · ElevenLabs · Suno · Google Flow · Seedance",
    award: "",
    // While this is true the section shows a "Coming soon" panel. Add projects below and set it to false.
    comingSoon: true,
    comingSoonText: "New AI-led films and campaigns are in the edit bay. Check back soon.",
    projects: [],
  },
];


/* ==========================================================================
   PART 2 — PROFILE & RÉSUMÉ CONTENT
   ========================================================================== */

const PROFILE = {
  name: "Harshkumar Puthran",
  firstName: "Harsh",
  title: "Video Editor · Creative Strategist · Designer",
  location: "Bangalore, India",
  photo: "assets/portrait.jpg",
  avatar: "assets/avatar.jpg",   // round photo in the Contact section (square image works best)
  bio:
    "I'm Harsh — a video editor and creative strategist who brings ideas to life through " +
    "compelling visuals, editing and motion. I craft content that informs, engages and " +
    "drives real impact for brands.",
  tags: ["Edit", "Motion", "Design"],

  // Big statement that lights up word-by-word as visitors scroll
  statement:
    "I turn raw footage into stories that move people — and campaigns that move numbers. " +
    "Edit, motion and design, from first cut to final export.",

  // Words that scroll across the screen in the moving ticker
  marquee: ["Rareminds", "Cricbaby", "BlueApple DigiMedia", "Premiere Pro", "After Effects",
            "Motion Design", "Brand Campaigns", "AI Workflow"],

  stats: [
    { value: 3,   suffix: "+", label: "Years experience" },
    { value: 120, suffix: "+", label: "Videos edited" },
    { value: 10,  suffix: "+", label: "Brands worked with" },
    { value: 3,   suffix: "/3", label: "Companies that recognised my work" },
  ],

  email: "editor.dasarkar@gmail.com",
  phone: "+91 7821993692",
  // Optional links — leave "" to hide
  resumeLink: "",     // e.g. a Google Drive link to your résumé PDF
  instagram: "",
  linkedin: "",
  youtube: "",
};

const RESUME = [
  {
    years: "2020 – 2023",
    org: "Prahladrai Dalmia Lions College of Commerce & Economics",
    role: "B.A. in Multimedia & Mass Communication",
    details: ["Social Media Department — volunteer", "Multiple certificates for college events (Media Mantra, intercollegiate conferences & more)"],
  },
  {
    years: "2023 – 2024",
    org: "Cricbaby",
    role: "Graphic Designer",
    details: ["Designed marketing creatives, social media assets and campaign visuals for brand growth."],
  },
  {
    years: "2024 – 2025",
    org: "BlueApple DigiMedia",
    role: "Creative Designer & Video Editor (Project based)",
    details: ["End-to-end video editing, pre-editing & visual content for multiple brand projects under tight deadlines.", "Certificate of Achievement — IMTEX 2025: recognised for outstanding work on the urgent pre-editing of the screening video", "Projects under NDA — not shown in this portfolio"],
  },
  {
    years: "2025 – 2026",
    org: "Cricbaby",
    role: "Creative Head",
    details: ["Established brand identity and unified marketing creatives across all social platforms.", "Led a Black Friday campaign that drove a significant surge in revenue.", "Impact Leadership recognition"],
  },
  {
    years: "Sept 2026 – Now",
    org: "Rareminds",
    role: "Visual Media Artist",
    details: ["High-impact videos for strategic campaigns, product communication and institutional storytelling.", "Rising Star Award — in my first month", "Peak Performer — in my second month"],
  },
];

const EARLY_EDUCATION = [
  "HSC — St. Peter's College of Science and Commerce (2018 – 2020)",
  "SSC — Carmelite Convent English High School (2006 – 2018)",
];

const SKILLS = [
  {
    group: "Edit & Design",
    items: [
      { short: "Pr", name: "Premiere Pro" },
      { short: "Ae", name: "After Effects" },
      { short: "Ps", name: "Photoshop" },
      { short: "Ai", name: "Illustrator" },
      { short: "Lr", name: "Lightroom" },
      { short: "Cc", name: "CapCut" },
    ],
  },
  {
    group: "AI Creative Workflow",
    items: [
      { short: "Gp", name: "ChatGPT" },
      { short: "Mj", name: "Midjourney" },
      { short: "El", name: "ElevenLabs" },
      { short: "Gf", name: "Google Flow" },
      { short: "Sd", name: "Seedance" },
      { short: "Su", name: "Suno AI" },
    ],
  },
];

const RECOGNITIONS = [
  { title: "Rising Star Award",          by: "Rareminds",          text: "Recognised in my first month for outstanding performance and contribution." },
  { title: "Peak Performer",             by: "Rareminds",          text: "Named Peak Performer in my second month for consistently high-impact work." },
  { title: "Certificate of Achievement", by: "BlueApple DigiMedia · IMTEX 2025", text: "Recognised for outstanding work at IMTEX 2025, for my contribution to the screening video's pre-editing on an urgent turnaround." },
  { title: "Impact Leadership",          by: "Cricbaby",           text: "For establishing Cricbaby's brand presence across social platforms and leading a Black Friday campaign that drove a substantial revenue boost." },
];

const VOLUNTEER = [
  "Next Level Gaming",
  "Prahladrai Dalmia Lions College — Social Media Department",
  "Sparkling Wing NGO",
  "Waffle Wings",
];
