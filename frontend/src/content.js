import heroDryer from "../../assets/images/banner/banner-28.jpg";
import firewoodDryer from "../../assets/images/banner/banner-29.jpg";
import oilUnit from "../../assets/images/project/Mini-Commercial-MU.jpg";
import electricDryer from "../../assets/images/project/Electric-Drayer-MU.jpg";
import firewoodCatalog from "../../assets/images/project/firewood-tray-MU.jpg";
import multiPurposeCatalog from "../../assets/images/project/Multi-Purpose-MU.jpg";
import serviceImage from "../../assets/images/background/cta-bg-2.png";
import multiPurposePdf from "../../assets/brochures/Multi Purpose Dehydrate Systems.pdf";
import firewoodPdf from "../../assets/brochures/firewood tray type copra Dryer.pdf";
import electricPdf from "../../assets/brochures/Electric Drayer BXD.pdf";
import oilPdf from "../../assets/brochures/Mini Commercial Oil Processing Unit.pdf";

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
    title: "Multi-Purpose Electric Dryers",
    code: "ELDR Series",
    icon: "electric",
    slug: "electric-dryers",
    image: electricDryer,
    href: "#electric-dryers",
    summary: "Tray-based electric dryers for fruit, spices, coconut, herbs, and food products."
  },
  {
    title: "Firewood Tray Type Copra Dryers",
    code: "DYR Series",
    icon: "firewood",
    slug: "firewood-dryers",
    image: firewoodCatalog,
    href: "#firewood-dryers",
    summary: "Heavy-duty drying systems for copra and agricultural processing."
  },
  {
    title: "Oil Processing Units",
    code: "MCO Series",
    icon: "oil",
    slug: "oil-processing",
    image: oilUnit,
    href: "#oil-processing",
    summary: "Mini commercial oil press machines and supporting coconut processing equipment."
  },
  {
    title: "Trayless Electric Dryers",
    code: "BXD Series",
    icon: "trayless",
    slug: "trayless-dryers",
    image: firewoodDryer,
    href: "#trayless-dryers",
    summary: "Compact electric dryers designed for higher throughput and simpler handling."
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

export const featureImage = serviceImage;
