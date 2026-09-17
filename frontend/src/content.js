import heroDryer from "../../assets/images/banner/banner-28.jpg";
import serviceImage from "../../assets/images/background/cta-bg-2.png";
import copraCutter from "../../assets/images/products/copra-cutter.jpeg";
import mco3 from "../../assets/images/products/mco3.jpeg";
import filterPress from "../../assets/images/products/filter-10-10.jpeg";
import storageTank from "../../assets/images/products/storage-tank.png";
import multiPurposePdf from "../../assets/brochures/Multi Purpose Dehydrate Systems.pdf";
import firewoodPdf from "../../assets/brochures/firewood tray type copra Dryer.pdf";
import electricPdf from "../../assets/brochures/Electric Drayer BXD.pdf";
import oilPdf from "../../assets/brochures/Mini Commercial Oil Processing Unit.pdf";
import irshadAvatar from "../../assets/images/team/team-22.png";
import ansarAvatar from "../../assets/images/team/team-23.png";
import anshadAvatar from "../../assets/images/team/team-24.png";
import shreyasAvatar from "../../assets/images/team/team-25.png";

export const hero = {
  eyebrow: "Food processing machinery from Kerala",
  title: "Precision machinery for drying, oil extraction, and value-added production.",
  text:
    "A cleaner industrial website direction for Mechmark, using real product imagery, fast catalogue browsing, and a memorable opening reveal animation.",
  image: heroDryer,
  primaryAction: "Explore machines",
  secondaryAction: "Send enquiry"
};

export const productFamilies = [
  {
    title: "Copra Cutter",
    code: "CTR Series",
    icon: "copraCutter",
    slug: "copra-cutter",
    image: copraCutter,
    href: "#copra-cutter",
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
    image: mco3,
    href: "#mco3-oil-press",
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
    image: filterPress,
    href: "#filter-press-10-10",
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
    image: storageTank,
    href: "#storage-tank",
    summary: "Stainless storage tank with tall stand, tapered base, and multiple outlet taps.",
    detail:
      "A stainless storage tank made for clean holding and controlled outlet flow, supported by a tall stand and tapered bottom section.",
    features: ["Stainless tank body", "Tapered base", "Multiple outlet taps", "Tall support stand"]
  }
];

export const stats = [
  ["2010", "Established"],
  ["1.3k+", "Clients served"],
  ["India", "Service network"],
  ["4", "Product catalogues"]
];

export const brochures = [
  ["Multi Purpose Dehydrate Systems", multiPurposePdf],
  ["Firewood Tray Type Copra Dryer", firewoodPdf],
  ["Electric Dryer BXD", electricPdf],
  ["Mini Commercial Oil Processing Unit", oilPdf]
];

export const services = [
  "Machine selection guidance",
  "Installation and operator support",
  "Genuine spare parts assistance",
  "Pan-India service coordination"
];

export const teamMembers = [
  {
    name: "Mohd. Irshad",
    role: "CEO & Founder",
    image: irshadAvatar
  },
  {
    name: "Ansar Ibnu Ali",
    role: "General Manager",
    image: ansarAvatar
  },
  {
    name: "Anshad Mohd",
    role: "Operations",
    image: anshadAvatar
  },
  {
    name: "Shreyas KS",
    role: "Marketing Manager",
    image: shreyasAvatar
  }
];

export const featureImage = serviceImage;
