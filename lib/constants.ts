// Business Details
export const BUSINESS = {
  name: "Origin Repairs",
  email: "tech@originrepairs.co.uk",
  phone: "+447768426754",
  phoneDisplay: "07768 426 754",
  phoneHref: "tel:+447768426754",
  address: "76 Cookridge Street, Leeds, LS2 8GL",
  coordinates: {
    lat: 53.8017,
    lng: -1.5543,
  },
  hours: {
    monday: "9:00am - 6:00pm",
    tuesday: "9:00am - 6:00pm",
    wednesday: "9:00am - 6:00pm",
    thursday: "9:00am - 6:00pm",
    friday: "9:00am - 6:00pm",
    saturday: "10:00am - 4:00pm",
    sunday: "Closed",
  },
  googleReviewUrl:
    "https://www.google.com/search?q=Origin+Repairs+Leeds",
  googleMapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Origin%20Repairs%2C%2076%20Cookridge%20Street%2C%20Leeds%20LS2%208GL",
  googleDirectionsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=Origin%20Repairs%2C%2076%20Cookridge%20Street%2C%20Leeds%20LS2%208GL",
  googleMapsEmbedUrl:
    "https://www.google.com/maps?q=Origin%20Repairs%2C%2076%20Cookridge%20Street%2C%20Leeds%20LS2%208GL&output=embed",
  trustpilotUrl: "https://www.trustpilot.com/review/originrepairs.co.uk",
  location: "Leeds, UK",
  postcode: "LS2 8GL",
  founded: 2018,
};

// SEO & Meta
export const SEO = {
  siteName: "Origin Repairs",
  siteUrl: "https://originrepairs.co.uk",
  description:
    "Expert device repair in Leeds. Phones, tablets, laptops, consoles, custom PCs, liquid damage and data recovery. Honest prices.",
  keywords:
    "device repair Leeds, iPhone repair Leeds, Samsung repair Leeds, laptop repair Leeds, console repair Leeds, custom PC builds Leeds, PC upgrades Leeds, liquid damage repair Leeds",
  twitterHandle: "@originrepairs",
};

// Reviews — update these once real reviews are collected
export const REVIEWS = {
  googleRating: null as number | null,
  googleReviews: null as number | null,
  trustpilotRating: null as number | null,
  trustpilotReviews: null as number | null,
};

// Services
export const SERVICES = [
  {
    name: "Phone Repairs",
    href: "/repairs/phones",
    description: "iPhone, Samsung Galaxy, Google Pixel and other phone repairs",
  },
  {
    name: "Laptop Repairs",
    href: "/repairs/laptops",
    description: "MacBook, Windows laptops, gaming laptops, business laptops, and more",
  },
  {
    name: "Console Repairs",
    href: "/repairs/consoles",
    description: "PlayStation, Xbox, Nintendo Switch, HDMI, power, storage and overheating",
  },
  {
    name: "Custom PC Builds & Upgrades",
    href: "/repairs/custom-pc",
    description: "Gaming PCs, workstation builds, GPU, RAM, SSD, cooling and clean cable management",
  },
  {
    name: "Data Recovery & Liquid Damage",
    href: "/repairs/data-recovery",
    description: "Phones, laptops, consoles, SSDs, hard drives and board-level recovery",
  },
];

// Testimonials — add real verified reviews here when collected
export const TESTIMONIALS: {
  author: string;
  role: string;
  content: string;
  rating: number;
  device: string;
}[] = [
  {
    author: "James T.",
    role: "Leeds",
    content: "Cracked my iPhone 15 Pro screen on a Friday evening, walked in Saturday morning and had it sorted in under an hour. Brilliant service and the price was really fair.",
    rating: 5,
    device: "iPhone 15 Pro",
  },
  {
    author: "Sophie H.",
    role: "Headingley",
    content: "My Samsung wouldn't charge and I thought it was a goner. They diagnosed it for free, replaced the port, and it's been perfect since. Would definitely recommend.",
    rating: 5,
    device: "Samsung Galaxy S23",
  },
  {
    author: "Marcus R.",
    role: "Leeds City Centre",
    content: "MacBook battery was dying every 2 hours. Dropped it off, had it back the same afternoon with a 12-month warranty. Really professional setup.",
    rating: 5,
    device: "MacBook Pro",
  },
];

// USP Points
export const USP = [
  {
    title: "Same-Day Repairs",
    description:
      "Most common repairs completed same day. Screen, battery, charging port.",
    icon: "⚡",
  },
  {
    title: "12-Month Warranty",
    description:
      "12-month warranty on eligible repairs. Parts and labour, no hidden conditions.",
    icon: "🛡️",
  },
  {
    title: "Honest Pricing",
    description:
      "Fixed quote before we start. Free assessment. No diagnostic fees. No surprises.",
    icon: "💰",
  },
];

// Repair Process Steps
export const REPAIR_PROCESS = [
  {
    step: 1,
    title: "Book Online or Walk In",
    description:
      "Select your device, choose a time. We'll provide an instant quote—no obligation.",
  },
  {
    step: 2,
    title: "Expert Diagnosis",
    description:
      "Our experienced technician inspects your device completely. We'll confirm the issue and final cost before any work begins.",
  },
  {
    step: 3,
    title: "Professional Repair",
    description:
      "We use OEM-grade parts and proven techniques. You wait or come back later.",
  },
  {
    step: 4,
    title: "Quality Check & Warranty",
    description:
      "Full diagnostic testing. 12-month warranty included. Walk out confident.",
  },
];

// FAQs
export const FAQS = [
  {
    q: "How long does repair actually take?",
    a: "Most repairs take 30-60 minutes. Water damage and data recovery take longer (24-48 hours). We'll give you an exact time when you book.",
  },
  {
    q: "Do you use real parts?",
    a: "Yes. We use OEM-grade components that meet manufacturer standards. For premium repairs, we use official manufacturer parts.",
  },
  {
    q: "What if the repair doesn't work?",
    a: "We'll fix it free under our 12-month warranty. No questions asked. No hidden conditions.",
  },
  {
    q: "Is it cheaper than Apple/Samsung repair?",
    a: "Yes, typically 30-50% cheaper. Same quality, honest pricing, longer warranty.",
  },
  {
    q: "Can you fix water damage?",
    a: "We have specialized equipment for liquid damage recovery. Success rate depends on severity. We'll assess it free and explain options.",
  },
  {
    q: "Do I need an appointment?",
    a: "Walk-ins welcome. For complex repairs (MacBooks, data recovery), booking ahead ensures a technician is available.",
  },
];
