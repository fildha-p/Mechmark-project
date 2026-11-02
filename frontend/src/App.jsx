import { useEffect, useRef, useState } from "react";
import {
  about,
  brochures,
  company,
  featured,
  hero,
  productFamilies,
  services,
  stats,
  teamMembers
} from "./content.js";
import mechmarkLogo from "../../assets/images/mechmark-logo.png";

const productIcons = {
  dryer: (
    <svg viewBox="0 0 220 130" role="img" aria-hidden="true">
      <path d="M40 112h140" className="icon-base" />
      <path d="M62 14h96v92H62z" />
      <path d="M110 14v92" className="icon-detail" />
      <path d="M72 32h28M72 50h28M72 68h28M72 86h28M120 32h28M120 50h28M120 68h28M120 86h28" className="icon-detail" />
      <path d="M70 106v10M150 106v10" />
      <path d="M158 30h14v24h-14" />
      <circle cx="165" cy="42" r="3" className="icon-accent" />
    </svg>
  ),
  copraCutter: (
    <svg viewBox="0 0 220 130" role="img" aria-hidden="true">
      <path d="M38 92h148" className="icon-base" />
      <path d="M58 42h96l14 20v28H72L58 66z" />
      <path d="M72 90v22M148 90v22M55 112h42M132 112h48" />
      <path d="M72 42l-18 22v34" />
      <path d="M92 58h44M88 70h56" className="icon-detail" />
      <path d="M168 64h24v24h-24z" />
      <circle cx="144" cy="80" r="10" className="icon-accent" />
      <path d="M56 88l-20 14" className="icon-detail" />
    </svg>
  ),
  oilPress: (
    <svg viewBox="0 0 220 130" role="img" aria-hidden="true">
      <path d="M34 94h154" className="icon-base" />
      <path d="M78 28h72l-15 34H93z" />
      <path d="M58 62h92v42H58z" />
      <path d="M150 66h40v38h-40z" />
      <path d="M58 74H31l-13 12h40" />
      <path d="M75 76h55M75 88h55" className="icon-detail" />
      <path d="M164 76h13M164 88h13" className="icon-detail" />
      <circle cx="176" cy="100" r="5" className="icon-accent" />
      <path d="M72 104v14M174 104v14" />
    </svg>
  ),
  filterPress: (
    <svg viewBox="0 0 220 130" role="img" aria-hidden="true">
      <path d="M32 94h156" className="icon-base" />
      <path d="M50 50v52M174 50v52M62 102h100" />
      <path d="M74 38v48M86 38v48M98 38v48M110 38v48M122 38v48M134 38v48M146 38v48" />
      <path d="M70 44h82M70 86h82" className="icon-detail" />
      <circle cx="42" cy="70" r="20" />
      <path d="M42 50v40M22 70h40" className="icon-accent" />
      <path d="M62 94l-24 24M162 94l24 24" className="icon-detail" />
    </svg>
  ),
  storageTank: (
    <svg viewBox="0 0 220 130" role="img" aria-hidden="true">
      <path d="M72 22h76l12 14v58l-24 24H84L60 94V36z" />
      <path d="M84 42h52M84 58h52M84 74h52" className="icon-detail" />
      <path d="M160 52h24M160 76h24M184 48v10M184 72v10" />
      <path d="M60 52H36M60 76H36M36 48v10M36 72v10" />
      <path d="M90 118v8M130 118v8M76 126h68" className="icon-base" />
      <path d="M110 22v-12M94 10h32" className="icon-accent" />
    </svg>
  )
};

/* Neutral stand-in for any image that hasn't been supplied yet. */
function MediaPlaceholder({ label = "Image coming soon", className = "" }) {
  return (
    <div className={`media-placeholder ${className}`} role="img" aria-label={label}>
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="6" y="10" width="36" height="28" rx="2" />
        <circle cx="17" cy="20" r="3.5" />
        <path d="M6 33l11-10 8 7 6-5 11 9" />
      </svg>
      <span>{label}</span>
    </div>
  );
}

const navItems = [
  ["#products", "Products"],
  ["#about", "About"],
  ["#catalogues", "Catalogues"],
  ["#services", "Parts & Service"],
  ["#contact", "Contact"]
];

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => event.key === "Escape" && setMenuOpen(false);
    const onResize = () => window.innerWidth > 900 && setMenuOpen(false);
    document.body.classList.add("menu-open");
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Mechmark home" onClick={close}>
        <img src={mechmarkLogo} alt="Mechmark" />
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        {navItems.map(([href, label]) => (
          <a href={href} key={href}>
            {label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <a className="header-call" href={`tel:${company.phones[0].tel}`}>
          Call {company.phones[0].label}
        </a>
        <a className="header-cta" href={company.whatsapp}>
          WhatsApp
        </a>
        <button
          type="button"
          className={`menu-toggle${menuOpen ? " is-open" : ""}`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " is-open" : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        {navItems.map(([href, label]) => (
          <a href={href} key={href} onClick={close} tabIndex={menuOpen ? 0 : -1}>
            {label}
          </a>
        ))}
        <div className="mobile-menu-contact">
          {company.phones.map((phone) => (
            <a href={`tel:${phone.tel}`} key={phone.tel} tabIndex={menuOpen ? 0 : -1}>
              Call {phone.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" role="img" aria-label="Home">
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.5V20h13v-9.5" />
      <path d="M10 20v-5h4v5" />
    </svg>
  );
}

function OpeningHero() {
  return (
    <section className="hero-section" id="top">
      {/* Animation slot: replace .hero-stage contents with the opening animation when ready. */}
      <div className="hero-stage" aria-label="Opening animation placeholder">
        <div className="hero-placeholder-label">
          <span>Opening animation</span>
          <strong>Coming soon</strong>
          <p>The final animation will appear here.</p>
        </div>
      </div>
      <div className="hero-intro">
        <h1>{hero.title}</h1>
        <p>{hero.text}</p>
        <div className="hero-actions">
          {hero.quickLinks.map((link) => (
            <a className="btn btn-primary" href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedStory() {
  return (
    <section className="section split-feature">
      <MediaPlaceholder className="feature-media" label="Article image coming soon" />
      <div className="split-feature-copy">
        <p className="eyebrow">{featured.eyebrow}</p>
        <h2>{featured.title}</h2>
        <p>{featured.text}</p>
        <a className="btn btn-primary" href={featured.href} target="_blank" rel="noreferrer">
          {featured.cta}
        </a>
      </div>
    </section>
  );
}

function ProductGrid() {
  return (
    <section className="section" id="products">
      <h2 className="section-title">Select your product</h2>
      <div className="product-icon-grid">
        {productFamilies.map((product) => (
          <a className="product-icon-card" href={`#${product.slug}`} key={product.slug}>
            {productIcons[product.icon]}
            <span>{product.title}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function ProductDetail({ product }) {
  return (
    <section className="product-detail-page">
      <nav className="product-breadcrumb" aria-label="Breadcrumb">
        <a href="#top" aria-label="Home">
          <HomeIcon />
        </a>
        <span>/</span>
        <a href="#products">Products</a>
        <span>/</span>
        <strong>{product.title}</strong>
      </nav>

      <div className="product-detail-hero">
        <div className="product-detail-copy">
          <p className="eyebrow">{product.code}</p>
          <h1>{product.title}</h1>
          {product.detail || product.summary ? (
            <>
              {product.detail && <p>{product.detail}</p>}
              {product.summary && <p>{product.summary}</p>}
            </>
          ) : (
            <p className="muted-note">Product details coming soon.</p>
          )}
        </div>
        <div className="product-detail-image">
          {product.image ? (
            <img src={product.image} alt={product.title} />
          ) : (
            <MediaPlaceholder label="Product image coming soon" />
          )}
        </div>
      </div>

      <div className="product-detail-specs" aria-label={`${product.title} highlights`}>
        {(product.features?.length ? product.features : ["Specifications coming soon"]).map((feature) => (
          <span key={feature}>{feature}</span>
        ))}
        <div className="product-detail-actions">
          <a className="btn btn-primary" href="#contact">Enquire now</a>
          <a className="btn btn-secondary" href="#products">View all products</a>
        </div>
      </div>
    </section>
  );
}

function AboutBlock() {
  return (
    <section className="section split-feature split-feature-reverse" id="about">
      <div className="split-feature-copy">
        <p className="eyebrow">{about.eyebrow}</p>
        <h2>{about.title}</h2>
        {about.paragraphs.map((text) => (
          <p key={text.slice(0, 24)}>{text}</p>
        ))}
        <a className="btn btn-primary" href={about.cta.href}>
          {about.cta.label}
        </a>
      </div>
      <MediaPlaceholder className="feature-media" label="Factory image coming soon" />
    </section>
  );
}

function StatsStrip() {
  return (
    <section className="stats-strip" aria-label="Mechmark in numbers">
      {stats.map(([value, label]) => (
        <div className="stat" key={label}>
          <strong>{value}</strong>
          <span>{label}</span>
        </div>
      ))}
    </section>
  );
}

function initials(name) {
  return name
    .replace(/\./g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function TeamSection() {
  return (
    <section className="section" id="team">
      <h2 className="section-title">Meet the Mechmark team</h2>
      <div className="team-grid">
        {teamMembers.map((member) => (
          <article className="team-card" key={member.name}>
            <div className="team-avatar">
              {member.image ? <img src={member.image} alt={member.name} /> : <span>{initials(member.name)}</span>}
            </div>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Catalogues() {
  return (
    <section className="section split-feature" id="catalogues">
      <div className="split-feature-copy">
        <p className="eyebrow">Product catalogues</p>
        <h2>Download our brochures</h2>
        <p>Full specifications, capacities and model details for each Mechmark machine range.</p>
        <div className="brochure-list">
          {brochures.map(([label, href]) => (
            <a href={href} key={label} target="_blank" rel="noreferrer">
              <span>{label}</span>
              <strong>PDF ↓</strong>
            </a>
          ))}
        </div>
      </div>
      <MediaPlaceholder className="feature-media" label="Video coming soon" />
    </section>
  );
}

function Services() {
  const trackRef = useRef(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const updateEdges = () => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, []);

  const step = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector(".service-card");
    const amount = card ? card.getBoundingClientRect().width + 24 : el.clientWidth;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <section className="section" id="services">
      <h2 className="section-title">Services &amp; Support</h2>
      <div className="service-track" ref={trackRef} onScroll={updateEdges}>
        {services.map((service) => (
          <article className="service-card" key={service.title}>
            <MediaPlaceholder className="service-media" />
            <h3>{service.title}</h3>
            <p>{service.text}</p>
            <a className="btn btn-primary btn-small" href={service.href}>
              {service.cta}
            </a>
          </article>
        ))}
      </div>
      <div className="carousel-controls">
        <button type="button" onClick={() => step(-1)} disabled={atStart}>
          ← Previous
        </button>
        <button type="button" onClick={() => step(1)} disabled={atEnd}>
          Next →
        </button>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div>
        <p className="eyebrow">Contact</p>
        <h2>Get in touch with Mechmark</h2>
        <p>For enquiries, partnerships or support, reach out to us. We are here to help with all your food processing machinery needs.</p>
        <p>{company.address}</p>
        <p className="contact-lines">
          {company.phones.map((phone) => (
            <a href={`tel:${phone.tel}`} key={phone.tel}>
              {phone.label}
              {phone.note ? ` (${phone.note})` : ""}
            </a>
          ))}
          <a href={`mailto:${company.email}`}>{company.email}</a>
        </p>
      </div>
      <form className="enquiry-form">
        <input name="name" placeholder="Name" />
        <input name="phone" placeholder="Phone" />
        <input name="email" placeholder="Email" />
        <select name="product" defaultValue="">
          <option value="" disabled>
            Product interest
          </option>
          {productFamilies.map((product) => (
            <option key={product.slug}>{product.title}</option>
          ))}
        </select>
        <textarea name="message" placeholder="Requirement" rows="4" />
        <button type="button">Submit enquiry</button>
      </form>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-columns">
        <div>
          <h4>Products</h4>
          {productFamilies.map((product) => (
            <a href={`#${product.slug}`} key={product.slug}>
              {product.title}
            </a>
          ))}
        </div>
        <div>
          <h4>Parts &amp; Service</h4>
          <a href="#services">Installation &amp; support</a>
          <a href="#services">Genuine spare parts</a>
          <a href="#services">Pan-India service</a>
        </div>
        <div>
          <h4>Catalogues</h4>
          {brochures.map(([label, href]) => (
            <a href={href} key={label} target="_blank" rel="noreferrer">
              {label}
            </a>
          ))}
        </div>
        <div>
          <h4>Company</h4>
          <a href="#about">About us</a>
          <a href="#team">Our team</a>
          <a href="#contact">Contact us</a>
          <a href={company.whatsapp}>WhatsApp</a>
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>{company.address}</p>
          {company.phones.map((phone) => (
            <a href={`tel:${phone.tel}`} key={phone.tel}>
              {phone.label}
            </a>
          ))}
          <a href={`mailto:${company.email}`}>{company.email}</a>
        </div>
      </div>
      <div className="footer-social">
        <a href={company.social.facebook} target="_blank" rel="noreferrer">Facebook</a>
        <a href={company.social.instagram} target="_blank" rel="noreferrer">Instagram</a>
        <strong>Call us: {company.phones[0].label}</strong>
      </div>
      <div className="footer-bottom">
        <a className="brand brand-small" href="#top" aria-label="Mechmark home">
          <img src={mechmarkLogo} alt="Mechmark" />
        </a>
        <span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span>
      </div>
    </footer>
  );
}

function getSelectedProduct() {
  const hash = window.location.hash.replace("#", "");
  return productFamilies.find((product) => product.slug === hash) || null;
}

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(getSelectedProduct);

  useEffect(() => {
    const handleHashChange = () => setSelectedProduct(getSelectedProduct());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      // Returning from a product page to a homepage anchor: scroll to that section.
      const id = window.location.hash.replace("#", "");
      const target = id && document.getElementById(id);
      if (target) target.scrollIntoView();
    }
  }, [selectedProduct]);

  return (
    <>
      <Header />
      <main>
        {selectedProduct ? (
          <ProductDetail product={selectedProduct} />
        ) : (
          <>
            <OpeningHero />
            <FeaturedStory />
            <ProductGrid />
            <AboutBlock />
            <StatsStrip />
            <Services />
            <Catalogues />
            <TeamSection />
            <Contact />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
