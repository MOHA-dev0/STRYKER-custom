import type { Dictionary } from "./ar"

/**
 * English dictionary. Typed as `Dictionary`, so a key missing here (or renamed
 * in ar.ts) is a compile error rather than a blank string at runtime.
 */
export const en: Dictionary = {
  meta: {
    home: {
      title: "The Custom Bike Platform",
      description:
        "A Saudi and Arab platform built to showcase the world of custom bikes and custom shows: builders, workshops, projects, and judging held to international standards.",
      keywords: [
        "custom bikes",
        "custom bike show",
        "STRYKER",
        "motorcycle show",
        "Saudi Arabia",
      ],
    },
    about: {
      title: "About",
      description:
        "The story, vision and mission behind STRYKER CUSTOM BIKE SHOW, the fourteen stages of a show build, and the growth plan.",
    },
    submissions: {
      title: "Entries & Highlights",
      description:
        "The record of STRYKER's shows and events, plus the interest form for custom bike owners and workshops looking to enter the 2026 season.",
    },
    contact: {
      title: "Contact",
      description:
        "Reach the STRYKER CUSTOM BIKE SHOW team about sponsorship, workshop partnerships, entry questions, or anything else.",
    },
  },

  site: {
    location: "Kingdom of Saudi Arabia — Riyadh",
    tagline: "BUILT TO BE DIFFERENT",
  },

  nav: {
    links: {
      home: "Home",
      about: "About",
      submissions: "Entries",
      contact: "Contact",
    },
    partnerCta: "Become a partner",
    primaryLabel: "Primary navigation",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    languageLabel: "Change language",
    otherLanguage: "العربية",
  },

  hero: {
    slides: {
      discover: {
        eyebrow: "STRYKER CUSTOM BIKE SHOW 2026",
        title: "DISCOVER STRYKER",
        tagline: "Step into the STRYKER world",
        line: "A Saudi and Arab platform built to showcase the world of custom bikes and custom shows.",
        alt: "A custom STRYKER motorcycle under show lighting",
      },
      build: {
        eyebrow: "STRYKER BUILD & DEVELOPMENT PLAN 2026",
        title: "HOSAM 1 / CUSTOM 2026",
        tagline: "The build and development plan",
        line: "Fourteen stages from teardown to the show floor — one identity, and no half measures in the execution.",
        alt: "Build stages of a custom motorcycle inside the workshop",
      },
      shows: {
        eyebrow: "SHOWS & ACHIEVEMENTS",
        title: "BUILT TO BE DIFFERENT",
        tagline: "Shows and achievements",
        line: "Seven entries, five first places, and an open road toward Gulf and international competition.",
        alt: "Custom motorcycles lined up on the show floor",
      },
    },
    subtitle:
      "At STRYKER CUSTOM BIKE SHOW we celebrate bikes that carry their owner's fingerprint. Every modification, every detail, every bold idea has a place here. Join the largest gathering of custom bike enthusiasts in the Kingdom.",
    primaryCta: "Submit your entry",
    secondaryCta: "Explore the platform",
    scrollHint: "SCROLL",
  },

  stats: {
    first: { label: "First place", note: "FIRST PLACE" },
    entries: { label: "Official entries", note: "OFFICIAL ENTRIES" },
    launch: { label: "Year one", note: "EST." },
    stages: { label: "Build stages", note: "BUILD STAGES" },
  },

  essence: {
    eyebrow: "WHO WE ARE · VISION · MISSION",
    titleLead: "A Saudi platform shaping ",
    titleAccent: "the custom scene",
    lead: "STRYKER CUSTOM BIKE SHOW is a community and a platform that brings builders, workshops and project owners under one roof: we document every bike stage by stage, run shows with clear judging standards, and open the road for Saudi work to be seen locally, across the Gulf and worldwide.",
    marks: [
      { k: "2025", v: "Year one" },
      { k: "07", v: "Show entries" },
      { k: "14", v: "Build stages" },
    ],
    pillars: {
      story: {
        code: "OUR STORY",
        title: "Our story",
        body: "STRYKER CUSTOM BIKE SHOW grew out of a genuine passion for the custom bike world, and out of the Yamaha Stryker the project took its name from. The word STRYKER carries the sense of strength and initiative — and from it came an identity set on presenting custom work as art, done professionally.",
      },
      vision: {
        code: "OUR VISION",
        title: "Our vision",
        body: "For STRYKER CUSTOM BIKE SHOW to become a leading Saudi and Arab platform in Custom Show culture, raising the standard of organising and building to compete with Gulf and international events.",
      },
      mission: {
        code: "OUR MISSION",
        title: "Our mission",
        body: "To show the beauty of the custom bike as a work of art, to back the talent and the specialist workshops, and to connect them with an audience that cares and with partners and sponsors — while encouraging quality and responsibility.",
      },
    },
    cta: "Read the full story",
  },

  riderCode: {
    eyebrow: "THE RIDER CHARTER",
    code: "STRYKER CODE",
    titleLead: "Ride with responsibility, ",
    titleAccent: "carry the passion safely",
    lead: "We do not simply put custom bikes on a stand — we carry a culture built on safety, respect, and full compliance with the law.",
    pillars: {
      safety: {
        code: "SAFETY FIRST",
        title: "Safety first",
        body: "Full commitment to protective gear and a certified helmet, on the road and at every event.",
      },
      compliance: {
        code: "LEGAL & COMPLIANCE",
        title: "Respect for the law",
        body: "Riding by the book: traffic rules honoured, and no reckless showing off on public roads.",
      },
      community: {
        code: "COMMUNITY & BROTHERHOOD",
        title: "The spirit of the group",
        body: "Backing builders and entrants, and trading know-how in the spirit of the sport we share.",
      },
      culture: {
        code: "TRUE BIKER CULTURE",
        title: "The face we show",
        body: "Reflecting the civil, respectable face of the Kingdom's riding community to the public and the press.",
      },
    },
  },

  squad: {
    eyebrow: "THE MAIN SQUAD",
    titleLead: "The main squad — ",
    titleAccent: "the names behind the metal",
    lead: "Builders, entrants, judges and sponsors. Every name here adds a layer to the identity of the show.",
    categories: {
      builders: {
        label: "Builders",
        blurb:
          "Hands that read metal before they touch it — from the first sketch to the last bolt.",
        members: [
          { name: "Khalid Al-Harbi", role: "Frame design and welding" },
          { name: "Salman Al-Qahtani", role: "CNC parts and fabrication" },
          { name: "Rayan Al-Otaibi", role: "Paint and airbrush" },
          { name: "Majed Al-Shehri", role: "Engines and performance" },
        ],
      },
      participants: {
        label: "Entrants",
        blurb:
          "Project owners who brought their ideas to the show floor and faced the judges.",
        members: [
          { name: "Ahmed Al-Zahrani", role: "Custom Cruiser" },
          { name: "Fahd Al-Mutairi", role: "Bobber Build" },
          { name: "Abdullah Al-Shammari", role: "Chopper Long Fork" },
          { name: "Nawaf Al-Juhani", role: "Café Racer" },
        ],
      },
      judges: {
        label: "Judging panel",
        blurb:
          "Hands-on experience that measures the details: concept, execution, finish and identity.",
        members: [
          { name: "Saud Al-Fahd", role: "Head of the panel" },
          { name: "Turki Al-Subaie", role: "Engineering assessment" },
          { name: "Maher Al-Harbi", role: "Aesthetic assessment" },
        ],
      },
      sponsors: {
        label: "Sponsors",
        blurb:
          "Partners who make the difference between a one-off event and a platform that grows every year.",
        members: [
          { name: "Stryker Workshop", role: "Founding sponsor" },
          { name: "Moto Custom Saudi", role: "Equipment sponsor" },
          { name: "Al-Fahd Bike Garage", role: "Service sponsor" },
        ],
      },
    },
  },

  journey: {
    eyebrow: "OUR JOURNEY / LAUNCH STORY",
    title: "We launched in 2025",
    paragraphs: [
      "It started with a personal obsession with a Yamaha Stryker — one bike and one idea: make it different. The project grew from a private build in a small workshop into a full identity with a name, a story, and a clear development path.",
      "Out of that came the bigger question: why should the experience stay personal? Saudi Arabia has dozens of workshops, builders and designers producing work that deserves an audience — what they lack is a platform to bring them together, document their work, and give them real competition.",
      "STRYKER CUSTOM BIKE SHOW is that platform: it gathers creators, builders, workshops and champions under one roof, and lifts custom bike shows in the Kingdom to international standards.",
    ],
    milestones: [
      { k: "2025", v: "Identity and first project launched" },
      { k: "07", v: "Entries in local shows" },
      { k: "05", v: "First places" },
      { k: "2026", v: "National and Gulf expansion" },
    ],
    imageAlt: "A custom bike tank hand-painted with pine airbrush work",
    imageEyebrow: "EST. 2025 · RIYADH",
    imageCaption: "From a single workshop to a national platform",
    plate: "HOSAM 1",
  },

  cta: {
    eyebrow: "JOIN THE SHOW",
    titleLead: "This platform is built by the people who make it. ",
    titleAccent: "Take your place in 2026.",
    lead: "Whether you run a workshop, hold an airbrush gun, or are looking for a real audience for your brand — there is an open lane for you inside STRYKER CUSTOM BIKE SHOW.",
    lanes: {
      workshops: {
        code: "WORKSHOPS & BUILDERS",
        title: "Workshops and builders",
        body: "Register your workshop, document your projects on the platform, and get priority placement in upcoming shows.",
        cta: "Register your workshop",
      },
      artists: {
        code: "AIRBRUSH ARTISTS",
        title: "Airbrush artists",
        body: "Put your work on real tanks and fenders in front of an audience that reads the details, and take part in the live art corner.",
        cta: "Join as an artist",
      },
      sponsors: {
        code: "SPONSORS & BRANDS",
        title: "Sponsors and brands",
        body: "Sponsorship packages with presence across the show, the platform and the content, plus clear reach reporting after every event.",
        cta: "Request the sponsorship deck",
      },
    },
    primaryCta: "Register your early entry",
    secondaryCta: "Talk to the team",
    ticker: ["STRYKER 2026", "CUSTOM SHOWS", "SAUDI BUILDERS", "BUILT TO BE DIFFERENT"],
  },

  footer: {
    blurb:
      "A Saudi and Arab platform built to showcase the world of custom bikes and custom shows, bringing builders, workshops and project owners under one roof.",
    navHeading: "NAVIGATION",
    contactHeading: "CONTACT",
    ticker: [
      "BUILT TO BE DIFFERENT",
      "CUSTOM BIKE SHOW 2026",
      "SAUDI CUSTOM CULTURE",
      "MADE IN SAUDI ARABIA",
    ],
    copyright: "© 2026 STRYKER — ALL RIGHTS RESERVED",
    rights: "All rights reserved to the STRYKER custom bike platform",
    endorsement: {
      caption: "Supervised by the Ministry of Sport",
      logoAlt: "Emblem of the Ministry of Sport of the Kingdom of Saudi Arabia",
    },
  },

  participations: {
    eyebrow: "SHOWS & HIGHLIGHTS",
    titleLead: "The record of ",
    titleAccent: "shows and entries",
    lead: "A record of the milestones and expos the STRYKER platform and its bikes have taken part in.",
    detailsCta: "See the details",
    moreCta: "Explore more",
    truncated: "These are the latest {shown} of {total} entries in the record.",
    events: {
      "riyadh-custom-expo-2025": {
        title: "Riyadh Custom Bike Expo",
        location: "Riyadh — Kingdom of Saudi Arabia",
        badge: "First place 🏆",
        description:
          "The first official outing for the STRYKER bike in front of a specialist jury. It left the workshop after fourteen build stages and came back with first place in the custom cruiser class — with the jury singling out the clean frame and the wiring in particular.",
      },
      "jeddah-motor-show-2025": {
        title: "Jeddah Motor Show — custom corner",
        location: "Jeddah — Kingdom of Saudi Arabia",
        badge: "Official entry 🏁",
        description:
          "A stand of our own inside the custom bike corner, with a live demonstration of the paint and airbrush stages in front of visitors. It was the first time the project's full development line was shown end to end: from the first sketch to painted metal.",
      },
      "eastern-riders-meet-2025": {
        title: "Eastern Province riders' meet",
        location: "Dammam — Kingdom of Saudi Arabia",
        badge: "Best design 🎨",
        description:
          "A field meet that drew workshops from Dammam, Khobar and Jubail. The bike took the best design award for its CNC detailing and hand-built exhaust, and it opened our first partnership line with the workshops of the Eastern Province.",
      },
      "riyadh-season-motors-2026": {
        title: "Riyadh Season — motors zone",
        location: "Riyadh — Kingdom of Saudi Arabia",
        badge: "Guest of honour ⭐",
        description:
          "An invitation to take part in the motors zone as a local custom bike platform. Three bikes from the STRYKER community were shown alongside a stand introducing the platform and the judging standards we work to.",
      },
      "stryker-showcase-2026": {
        title: "STRYKER SHOWCASE — first edition",
        location: "Riyadh — Kingdom of Saudi Arabia",
        badge: "Main event 🔥",
        description:
          "The first edition of the show the platform runs itself: builders, workshops and airbrush artists under one roof, with a jury whose standards are published and a clear stage schedule for every entry.",
      },
    },
  },

  about: {
    hero: {
      eyebrow: "ABOUT STRYKER",
      mark: "ABOUT",
      title: "A platform turning a passion for custom work into an industry with standards",
      lead: "We are a Saudi community raising the level of custom bike shows: we document the projects, back local talent, and build a clear path toward Gulf and international competition.",
    },
    story: {
      eyebrow: "STORY · VISION · MISSION",
      titleLead: "We turn custom bikes into ",
      titleAccent: "documented works of art",
      lead: "STRYKER is not a seasonal event, it is infrastructure for a whole culture: documentation, judging, partnerships, and a clear growth path that lifts Saudi work to international show standards.",
      imageAlt: "A custom chopper with bespoke flame paintwork",
      imageEyebrow: "CRAFT OVER QUANTITY",
      imageCaption: "The metal tells the story, we put it on record",
      pillars: {
        story: {
          code: "OUR STORY",
          title: "The story",
          body: "STRYKER CUSTOM BIKE SHOW grew out of a genuine passion for the custom bike world, and out of the Yamaha Stryker the project took its name from. The word STRYKER carries the sense of strength and initiative — and from it came an identity set on presenting custom work as art, done professionally.",
        },
        vision: {
          code: "OUR VISION",
          title: "The vision",
          body: "For STRYKER CUSTOM BIKE SHOW to become a leading Saudi and Arab platform in Custom Show culture, raising the standard of organising and building to compete with Gulf and international events.",
        },
        mission: {
          code: "OUR MISSION",
          title: "The mission",
          body: "To show the beauty of the custom bike as a work of art, to back the talent and the specialist workshops, and to connect them with an audience that cares and with partners and sponsors — while encouraging quality and responsibility.",
        },
      },
    },
    stages: {
      eyebrow: "14 STAGES OF DEVELOPMENT",
      titleLead: "Building the STRYKER show bike — ",
      titleAccent: "fourteen stages",
      lead: "From the first coat of paint to the last pass of polish before the judging stand. Every stage has an acceptance standard, and the bike does not move on until it is signed off.",
      items: [
        {
          code: "PAINT & IDENTITY",
          title: "Paint & overall identity",
          desc: "Signing off the identity colour, the airbrush work and the tank logo.",
        },
        {
          code: "DESIGN & COHESION",
          title: "Design & detail cohesion",
          desc: "Aligning lines and proportions so the bike reads as one piece.",
        },
        {
          code: "ACCESSORIES & CNC",
          title: "Accessories & CNC parts",
          desc: "Machining bespoke parts to digital precision instead of off-the-shelf.",
        },
        {
          code: "CHROME & POLISH",
          title: "Chrome & polish",
          desc: "Treating the metal surfaces and bringing up the reflection.",
        },
        {
          code: "ENGINE & MECHANICAL",
          title: "Engine & mechanical prep",
          desc: "Full service, performance tuning and heat management.",
        },
        {
          code: "EXHAUST SYSTEM",
          title: "Exhaust system",
          desc: "A bespoke outlet balancing sound against performance.",
        },
        {
          code: "WHEELS & TIRES",
          title: "Wheels & tires",
          desc: "Custom widths matched to the line of the frame.",
        },
        {
          code: "SUSPENSION & STANCE",
          title: "Suspension & ride height",
          desc: "Setting the stance and the bike's line front and rear.",
        },
        {
          code: "LIGHTING",
          title: "Lighting",
          desc: "Integrated LED lighting that serves both form and function.",
        },
        {
          code: "SEAT",
          title: "Seat",
          desc: "Hand-stitched leather cut to the project's identity.",
        },
        {
          code: "TANK & FENDERS",
          title: "Tank & fenders",
          desc: "Reshaping the outer lines of the bike.",
        },
        {
          code: "FRAME & WIRING",
          title: "Frame & wiring loom",
          desc: "Strengthening the frame and hiding the loom for a clean look.",
        },
        {
          code: "SAFETY & BUILD QUALITY",
          title: "Safety & build quality",
          desc: "Brakes, fixings and welds reviewed before any stage is signed off.",
        },
        {
          code: "SHOW, PHOTO & INNOVATION",
          title: "Show, photo & innovation prep",
          desc: "Display angle, lighting and final photography before judging.",
        },
      ],
    },
    growth: {
      eyebrow: "SHORT GROWTH PLAN",
      titleLead: "The short growth plan — ",
      titleAccent: "from identity to the world stage",
      lead: "Six consecutive stages, starting with a finished identity and ending with the Kingdom represented at international custom bike shows.",
      stageLabel: "Stage",
      items: [
        {
          code: "IDENTITY",
          title: "Identity complete",
          body: "Finishing the visual and digital STRYKER identity and formally launching the online platform.",
        },
        {
          code: "COMMUNITY",
          title: "Building the community",
          body: "Bringing in workshops, builders and project owners and documenting their work on the platform.",
        },
        {
          code: "LOCAL SHOWS",
          title: "Local shows",
          body: "Running shows in the major cities alongside local authorities and sponsors.",
        },
        {
          code: "STANDARDS",
          title: "Judging standards",
          body: "Adopting a clear judging rulebook and competitive classes recognised locally.",
        },
        {
          code: "GCC EXPANSION",
          title: "Gulf expansion",
          body: "Partnerships with show organisers across the Gulf and exchanged entries.",
        },
        {
          code: "INTERNATIONAL",
          title: "International entries",
          body: "Representing the Kingdom at global custom bike shows with Saudi builds.",
        },
      ],
    },
  },

  submissions: {
    badge: "Early registration open",
    eyebrow: "SUBMISSIONS · 2026",
    backdrop: "ENTRIES",
    titleLead: "Enter your build in ",
    titleAccent: "season 2026",
    titlePlate: "ENTRIES · SEASON 2026",
    lead: "Both halves of taking part live here: the record of the shows and events we have been through, and the form to register your interest in putting your bike on the stage next season.",
    ticker: ["EARLY REGISTRATION OPEN", "BE FIRST IN THE QUEUE", "STRYKER 2026"],
    howEyebrow: "HOW IT WORKS",
    howTitle: "How an entry works",
    steps: [
      {
        code: "STEP 01",
        title: "Register interest",
        body: "Fill in the form with the entrant, bike and workshop details. There is no fee at this stage.",
      },
      {
        code: "STEP 02",
        title: "Project file",
        body: "We ask for project photos, build stages and custom parts to put together a complete file.",
      },
      {
        code: "STEP 03",
        title: "Technical review",
        body: "The panel reviews the file against concept, execution, finish and identity.",
      },
      {
        code: "STEP 04",
        title: "Entry confirmed",
        body: "Accepted entrants are told the show date and prep requirements with plenty of notice.",
      },
    ],
    form: {
      eyebrow: "EARLY REGISTRATION",
      title: "Register your early interest",
      lead: "Fill in your details and we will be in touch the moment entries officially open for the 2026 season.",
      nameLabel: "Entrant name",
      namePlaceholder: "e.g. Abdullah Al-Shammari",
      contactLabel: "Phone or email",
      contactPlaceholder: "05xxxxxxxx or name@mail.com",
      modelLabel: "Bike model",
      modelPlaceholder: "e.g. Yamaha Stryker 2014",
      garageLabel: "Workshop / garage name",
      garagePlaceholder: "Optional",
      garageHint: "Leave it blank if the build is your own.",
      cityLabel: "City",
      cityPlaceholder: "Select a city",
      notesLabel: "Project notes",
      notesPlaceholder:
        "Describe the concept, the modifications you carried out, and the custom parts…",
      notesHint: "The more detail you give, the faster the review.",
      submit: "Send the entry",
      submitting: "Sending",
      privacy: "Your details are used only to contact you about the entry.",
      doneTitle: "We have your entry — thank you",
      doneBody:
        "The organising team will be in touch when entries open. Start gathering your project photos and build stages now.",
      doneCta: "Register another entry",
      errors: {
        name: "Enter your full name or the name you are known by.",
        contactRequired: "Enter a phone number or an email address.",
        contactFormat: "That format is not valid — use a phone number or an email address.",
        model: "Enter the bike model and its year.",
        city: "Select a city.",
        notesMin: "Write at least 20 characters about the project.",
        notesMax: "900 characters maximum.",
      },
    },
  },

  contact: {
    hero: {
      eyebrow: "CONTACT THE CREW",
      mark: "CONTACT",
      title: "Get in touch — the team behind the platform is close by",
      lead: "Sponsorship, a workshop partnership, a question about entering, or just a question about the next show. Pick a subject and we will route your message to the right person.",
    },
    infoEyebrow: "CONTACT INFO",
    infoTitle: "Contact information",
    cards: {
      email: "EMAIL",
      location: "LOCATION",
      social: "SOCIAL",
    },
    emailNote: "For sponsorship, partnerships and enquiries",
    locationNote: "Shows run in the major cities according to the season schedule",
    socialTitle: "Follow along",
    hours: "Reply hours: Sunday – Thursday, 10am – 6pm Saudi time.",
    subjects: {
      sponsorship: "Sponsorship and commercial partnership",
      workshop: "Workshop or builder partnership",
      entry: "Question about entering",
      general: "General enquiry",
    },
    form: {
      eyebrow: "SEND A MESSAGE",
      title: "Send your message",
      lead: "Pick the right subject so your message lands with the right person on the team straight away.",
      nameLabel: "Name",
      namePlaceholder: "Full name",
      emailLabel: "Email address",
      emailPlaceholder: "name@mail.com",
      subjectLabel: "Subject",
      subjectPlaceholder: "Select a subject",
      messageLabel: "Message",
      messagePlaceholder: "Write the details of your request or question…",
      submit: "Send",
      submitting: "Sending",
      replyNote: "We reply within 1–3 working days.",
      doneTitle: "Your message is on its way",
      doneBody:
        "We usually reply within one to three working days. Thank you for reaching out to the STRYKER team.",
      doneCta: "Send another message",
      errors: {
        name: "Enter your full name.",
        emailRequired: "An email address is required.",
        emailFormat: "That email address is not valid.",
        subject: "Select a subject for your message.",
        messageMin: "Write at least 15 characters.",
        messageMax: "1200 characters maximum.",
      },
    },
  },

  faq: {
    eyebrow: "FAQ",
    titleLead: "Frequently asked ",
    titleAccent: "questions",
    lead: "The questions we get most before an entry or a sponsorship. Not finding your answer? Send us a message directly.",
    items: [
      {
        q: "What is STRYKER CUSTOM BIKE SHOW?",
        a: "A Saudi platform and initiative set up to develop the motorcycle customisation sector and put the work of builders, workshops and painters in front of an audience at a professional event.",
      },
      {
        q: "How do I enter my custom bike?",
        a: "Register through the “Submit your entry” option and send in the details of your custom bike for the jury to review.",
      },
      {
        q: "Is entry limited to Saudi Arabia only?",
        a: "We started in Saudi Arabia, and we welcome entries and garages from across the Gulf states and the Arab world.",
      },
      {
        q: "How do I reach the support team?",
        a: "Through the contact form on this page or at info@stryker-customs.com. We usually reply within one to three working days; during show season a reply can take a little longer.",
      },
      {
        q: "What is the partnership and sponsorship policy?",
        a: "We sign a clear agreement setting out the sponsorship period, the placements and the consideration. Fees are paid in instalments tied to delivery milestones, and either party may end the agreement under the written terms before the show opens.",
      },
    ],
  },

  cities: {
    riyadh: "Riyadh",
    jeddah: "Jeddah",
    dammam: "Dammam",
    khobar: "Khobar",
    makkah: "Makkah",
    madinah: "Madinah",
    taif: "Taif",
    abha: "Abha",
    buraydah: "Buraydah",
    tabuk: "Tabuk",
    hail: "Hail",
    other: "Other",
  },

  notFound: {
    eyebrow: "OFF THE ROUTE",
    title: "We came off the route — this page does not exist",
    body: "The link you opened is no longer available or has moved. Head back to the home page and pick the tour up from the start.",
    home: "Home",
    contact: "Contact us",
  },
}
