// Site content for the Mechmark homepage.
// Everything here is designed to move into the Django admin later (see admin-panel task).
// Fields set to null render a "coming soon" placeholder until real content is uploaded.

import multiPurposePdf from "../../assets/brochures/Multi Purpose Dehydrate Systems.pdf";
import firewoodPdf from "../../assets/brochures/firewood tray type copra Dryer.pdf";
import electricPdf from "../../assets/brochures/Electric Drayer BXD.pdf";
import oilPdf from "../../assets/brochures/Mini Commercial Oil Processing Unit.pdf";

// Client product photos exist in assets/images/products/ but are not final.
// Re-enable by importing them and setting `image` below, or upload via admin later.

export const company = {
  name: "Mechmark Industries",
  tagline: "Precision in Machinery, Excellence in Quality",
  address: "8/620A, Nagalikavu, Puthoor (PO), Omassery, Kozhikode (Dist), Kerala, India - 673582",
  phones: [
    { label: "+91 9496 801 821", tel: "+919496801821", note: "Main" },
    { label: "+91 9496 801 499", tel: "+919496801499" },
    { label: "+91 6235 116 306", tel: "+916235116306" }
  ],
  whatsapp: "https://wa.me/919496801821",
  email: "mechmarks3@gmail.com",
  social: {
    facebook: "https://www.facebook.com/mechmarkpoultry",
    instagram: "https://www.instagram.com/mechmark_industries"
  }
};

export const hero = {
  title: "Food Processing Machinery, Built in Kerala",
  text: "Dryers, oil processing units and coconut cutting machines - manufactured in our own factory and supported across India.",
  quickLinks: [
    { label: "Dryers", href: "#dryers" },
    { label: "Oil Press", href: "#mco3-oil-press" },
    { label: "Copra Cutter", href: "#copra-cutter" }
  ]
};

export const featured = {
  eyebrow: "From the Mechmark blog",
  title: "Coconut Oil Production: Start a Profitable Business with a Small Budget",
  text: "Coconut oil is a versatile, high-demand product used in cooking, cosmetics and wellness. Here is how a compact Mechmark oil processing setup can get a small unit running.",
  href: "https://mechmark.in/Start-a-Profitable-Business-with-a-Small-Budget.html",
  cta: "Read more"
};

export const productFamilies = [
  {
    title: "Dryers",
    code: "ELDR / DYR Series",
    icon: "dryer",
    slug: "dryers",
    image: null,
    summary:
      "Electric, trayless and firewood tray-type dryers for copra, spices, fruits and other food products.",
    detail:
      "Quick, hygienic drying with automatic control of temperature, time and moisture exhaust on electric models, and cost-effective firewood operation on tray-type copra dryers.",
    features: [
      "Electric: ELDR-3 / 4 / 5 (3-5 trays)",
      "Trayless BXD-900 / BXD-1500",
      "Firewood: 250-500 coconuts per batch",
      "Auto temperature & moisture control"
    ]
  },
  {
    title: "Copra Cutter",
    code: "CTR Series",
    icon: "copraCutter",
    slug: "copra-cutter",
    image: null,
    summary: "Heavy-duty coconut/copra cutting machine with hopper, belt drive, and rigid frame.",
    detail:
      "A sturdy copra cutting machine designed for coconut processing units that need consistent cutting, easy loading, and dependable daily operation.",
    features: ["Wide feed hopper", "Rigid painted frame", "Belt driven cutting assembly", "Electric motor setup"]
  },
  {
    title: "MCO3 Oil Press",
    code: "MCO Series",
    icon: "oilPress",
    slug: "mco3-oil-press",
    image: null,
    summary: "Compact stainless oil processing unit with feed hopper, press chamber, and control panel.",
    detail:
      "A compact stainless oil processing unit built for controlled pressing, clean product flow, and straightforward operation in small commercial spaces.",
    features: ["Stainless body", "Feed hopper", "Integrated controls", "Compact production footprint"]
  },
  {
    title: "Filter Press 10-10",
    code: "Filter Series",
    icon: "filterPress",
    slug: "filter-press-10-10",
    image: null,
    summary: "Manual filter press with plate stack, hand wheel, stainless tray, and collection tank.",
    detail:
      "A manual filter press for oil filtration workflows, with a clear plate stack layout, collection tray, hand wheel, and stainless collection tank.",
    features: ["10-10 plate stack", "Manual hand wheel", "Stainless collection tray", "Separate collection tank"]
  },
  {
    title: "Storage Tank",
    code: "Tank Series",
    icon: "storageTank",
    slug: "storage-tank",
    image: null,
    summary: "Stainless storage tank with tall stand, tapered base, and multiple outlet taps.",
    detail:
      "A stainless storage tank made for clean holding and controlled outlet flow, supported by a tall stand and tapered bottom section.",
    features: ["Stainless tank body", "Tapered base", "Multiple outlet taps", "Tall support stand"]
  }
];

export const about = {
  eyebrow: "About Mechmark",
  title: "Precision in Machinery, Excellence in Quality",
  paragraphs: [
    "Mechmark Industries, established in 2010, manufactures food processing machinery from its own factory at Puthoor, Kozhikode - about 30 km from Calicut city.",
    "Our dryers, oil processing units and coconut cutting machines help food producers work faster and more hygienically while preserving the nutritional value of what they make. We provide genuine service across India and partially worldwide."
  ],
  cta: { label: "Talk to our team", href: "#contact" }
};

// TODO: confirm figures with client before go-live (taken from current mechmark.in).
export const stats = [
  ["12", "States served"],
  ["1250+", "Happy clients"],
  ["4600+", "Machines sold"],
  ["10", "Awards"]
];

export const brochures = [
  ["Multi Purpose Dehydrate Systems", multiPurposePdf],
  ["Firewood Tray Type Copra Dryer", firewoodPdf],
  ["Electric Dryer BXD", electricPdf],
  ["Mini Commercial Oil Processing Unit", oilPdf]
];

export const services = [
  {
    title: "Machine selection guidance",
    text: "Not sure which dryer or oil unit fits your output? Our team helps you choose the right capacity for your business.",
    href: "#contact",
    cta: "Ask an expert"
  },
  {
    title: "Installation & operator support",
    text: "We install your machine on site and train your operators so production starts smoothly from day one.",
    href: "#contact",
    cta: "Learn more"
  },
  {
    title: "Genuine spare parts",
    text: "Original Mechmark parts for a longer and stronger machine life, supplied directly from our factory.",
    href: "#contact",
    cta: "Request parts"
  },
  {
    title: "Pan-India service",
    text: "Service support across India and partially worldwide, so your production keeps running with minimal downtime.",
    href: "#contact",
    cta: "Book service"
  }
];

// TODO: confirm Anshad Mohd's current role (old site says "Service Advisor").
export const teamMembers = [
  { name: "Mohd. Irshad", role: "CEO & Founder", image: null },
  { name: "Ansar Ibnu Ali", role: "General Manager", image: null },
  { name: "Anshad Mohd", role: "Operations", image: null },
  { name: "Shreyas KS", role: "Marketing Manager", image: null }
];
