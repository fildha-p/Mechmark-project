import { useEffect, useRef, useState } from "react";
import { ContentProvider, submitEnquiry, useContent } from "./siteContent.jsx";
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

const genericIcon = (
  <svg viewBox="0 0 220 130" role="img" aria-hidden="true">
    <path d="M36 104h148" className="icon-base" />
    <path d="M56 40h108v58H56z" />
    <path d="M72 56h40M72 70h40M72 84h40" className="icon-detail" />
    <circle cx="140" cy="70" r="14" />
    <circle cx="140" cy="70" r="4" className="icon-accent" />
    <path d="M70 98v14M150 98v14" />
  </svg>
);

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

/* Shows the uploaded image, or the placeholder when there isn't one yet. */
function Media({ src, alt, label, className = "" }) {
  if (!src) return <MediaPlaceholder className={className} label={label} />;
  return <img className={`media-image ${className}`} src={src} alt={alt} loading="lazy" />;
}

function isExternal(href) {
  return /^https?:\/\//.test(href || "");
}

const navItems = [
  ["#products", "Products"],
  ["#about", "About"],
  ["#catalogues", "Catalogues"],
  ["#services", "Parts & Service"],
  ["#contact", "Contact"]
];

function Header() {
  const { company } = useContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const mainPhone = company.phones[0];

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
    <>
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
          {mainPhone && (
            <a className="header-call" href={`tel:${mainPhone.tel}`}>
              Call {mainPhone.label}
            </a>
          )}
          {company.whatsapp && (
            <a className="header-cta" href={company.whatsapp}>
              WhatsApp
            </a>
          )}
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
      </header>

      {/* Outside <header>: its backdrop-filter would otherwise trap this fixed panel. */}
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
    </>
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

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function HeroStage({ hero }) {
  if (hero.animation) {
    const reduced = prefersReducedMotion();
    return (
      <div className="hero-stage hero-stage-media">
        <video
          src={hero.animation}
          poster={hero.image || undefined}
          autoPlay={!reduced}
          controls={reduced}
          muted
          playsInline
          preload="auto"
          aria-label="Mechmark opening animation"
        />
      </div>
    );
  }
  if (hero.image) {
    return (
      <div className="hero-stage hero-stage-media">
        <img src={hero.image} alt="Mechmark machinery" />
      </div>
    );
  }
  return (
    <div className="hero-stage" aria-label="Opening animation placeholder">
      <div className="hero-placeholder-label">
        <span>Opening animation</span>
        <strong>Coming soon</strong>
        <p>The final animation will appear here.</p>
      </div>
    </div>
  );
}

function OpeningHero() {
  const { hero } = useContent();
  return (
    <section className="hero-section" id="top">
      <HeroStage hero={hero} />
      <div className="hero-intro">
        <h1>{hero.title}</h1>
        {hero.text && <p>{hero.text}</p>}
        {hero.quickLinks?.length > 0 && (
          <div className="hero-actions">
            {hero.quickLinks.map((link) => (
              <a className="btn btn-primary" href={link.href} key={link.label}>
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturedStory() {
  const { featured } = useContent();
  if (!featured) return null;
  const external = isExternal(featured.href);
  return (
    <section className="section split-feature">
      <Media className="feature-media" src={featured.image} alt={featured.title} label="Article image coming soon" />
      <div className="split-feature-copy">
        <p className="eyebrow">{featured.eyebrow}</p>
        <h2>{featured.title}</h2>
        <p>{featured.text}</p>
        <a
          className="btn btn-primary"
          href={featured.href}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        >
          {featured.cta}
        </a>
      </div>
    </section>
  );
}

function ProductGrid() {
  const { productFamilies } = useContent();
  return (
    <section className="section" id="products">
      <h2 className="section-title">Select your product</h2>
      <div className="product-icon-grid">
        {productFamilies.map((product) => (
          <a className="product-icon-card" href={`#${product.slug}`} key={product.slug}>
            {productIcons[product.icon] || genericIcon}
            <span>{product.title}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function ProductDetail({ product }) {
  const features = product.features?.length ? product.features.slice(0, 4) : ["Specifications coming soon"];
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
          {product.code && <p className="eyebrow">{product.code}</p>}
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
        {features.map((feature) => (
          <span key={feature}>{feature}</span>
        ))}
        <div className="product-detail-actions">
          <a className="btn btn-primary" href="#contact">Enquire now</a>
          <a className="btn btn-secondary" href="#products">View all products</a>
        </div>
      </div>

      {product.models?.length > 0 && (
        <div className="model-section">
          <h2 className="section-title">Available models</h2>
          <div className="model-grid">
            {product.models.map((model) => (
              <article className="model-card" key={model.slug}>
                <Media className="model-media" src={model.image} alt={model.modelCode || model.name} />
                <div className="model-body">
                  {model.modelCode && <p className="eyebrow">{model.modelCode}</p>}
                  <h3>{model.name}</h3>
                  {model.summary && <p>{model.summary}</p>}
                  {model.specs?.length > 0 && (
                    <ul>
                      {model.specs.map((spec) => (
                        <li key={spec}>{spec}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function AboutBlock() {
  const { about } = useContent();
  return (
    <section className="section split-feature split-feature-reverse" id="about">
      <div className="split-feature-copy">
        <p className="eyebrow">{about.eyebrow}</p>
        <h2>{about.title}</h2>
        {about.paragraphs.map((text) => (
          <p key={text.slice(0, 32)}>{text}</p>
        ))}
        <a className="btn btn-primary" href={about.cta.href}>
          {about.cta.label}
        </a>
      </div>
      <Media className="feature-media" src={about.image} alt="Mechmark factory" label="Factory image coming soon" />
    </section>
  );
}

function StatsStrip() {
  const { stats } = useContent();
  if (!stats.length) return null;
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
  const { teamMembers } = useContent();
  if (!teamMembers.length) return null;
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
  const { brochures, catalogueImage } = useContent();
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
      <Media className="feature-media" src={catalogueImage} alt="Mechmark machinery" label="Video coming soon" />
    </section>
  );
}

function Services() {
  const { services } = useContent();
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
  }, [services.length]);

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
            <Media className="service-media" src={service.image} alt={service.title} />
            <h3>{service.title}</h3>
            <p>{service.text}</p>
            <a className="btn btn-primary btn-small" href={service.href}>
              {service.cta}
            </a>
          </article>
        ))}
      </div>
      {!(atStart && atEnd) && (
        <div className="carousel-controls">
          <button type="button" onClick={() => step(-1)} disabled={atStart}>
            ← Previous
          </button>
          <button type="button" onClick={() => step(1)} disabled={atEnd}>
            Next →
          </button>
        </div>
      )}
    </section>
  );
}

const EMPTY_FORM = { name: "", phone: "", email: "", productInterest: "", message: "", website: "" };

function Contact() {
  const { company, productFamilies } = useContent();
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState({ state: "idle", message: "", fields: [] });

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const missing = ["name", "phone"].filter((field) => !form[field].trim());
    if (missing.length) {
      setStatus({ state: "error", message: "Please fill in your name and phone number.", fields: missing });
      return;
    }
    setStatus({ state: "sending", message: "", fields: [] });
    try {
      await submitEnquiry(form);
      setForm(EMPTY_FORM);
      setStatus({ state: "sent", message: "Thank you! Our team will contact you shortly.", fields: [] });
    } catch (error) {
      setStatus({ state: "error", message: error.message, fields: error.fields || [] });
    }
  };

  const invalid = (field) => status.fields.includes(field);
  const mainPhone = company.phones[0];

  return (
    <section className="contact-section" id="contact">
      <div>
        <p className="eyebrow">Contact</p>
        <h2>Get in touch with Mechmark</h2>
        <p>
          For enquiries, partnerships or support, reach out to us. We are here to help with all your food
          processing machinery needs.
        </p>
        {company.address && <p>{company.address}</p>}
        <p className="contact-lines">
          {company.phones.map((phone) => (
            <a href={`tel:${phone.tel}`} key={phone.tel}>
              {phone.label}
              {phone.note ? ` (${phone.note})` : ""}
            </a>
          ))}
          {company.email && <a href={`mailto:${company.email}`}>{company.email}</a>}
        </p>
      </div>
      <form className="enquiry-form" onSubmit={handleSubmit} noValidate>
        <input name="name" placeholder="Name *" value={form.name} onChange={update} aria-invalid={invalid("name")} autoComplete="name" />
        <input name="phone" placeholder="Phone *" value={form.phone} onChange={update} aria-invalid={invalid("phone")} type="tel" autoComplete="tel" />
        <input name="email" placeholder="Email" value={form.email} onChange={update} type="email" autoComplete="email" />
        <select name="productInterest" value={form.productInterest} onChange={update}>
          <option value="">Product interest</option>
          {productFamilies.map((product) => (
            <option key={product.slug}>{product.title}</option>
          ))}
        </select>
        <textarea name="message" placeholder="Requirement" rows="4" value={form.message} onChange={update} />
        {/* Honeypot: hidden from people, bots fill it in. */}
        <input className="hp-field" name="website" value={form.website} onChange={update} tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <button type="submit" disabled={status.state === "sending"}>
          {status.state === "sending" ? "Sending..." : "Submit enquiry"}
        </button>
        {status.message && (
          <p className={`form-status form-status-${status.state}`} role="status">
            {status.message}
            {status.state === "error" && mainPhone && (
              <>
                {" "}
                You can also call <a href={`tel:${mainPhone.tel}`}>{mainPhone.label}</a>
                {company.whatsapp && (
                  <>
                    {" "}or <a href={company.whatsapp}>WhatsApp us</a>
                  </>
                )}
                .
              </>
            )}
          </p>
        )}
      </form>
    </section>
  );
}

function Footer() {
  const { company, productFamilies, brochures } = useContent();
  const social = [
    ["Facebook", company.social?.facebook],
    ["Instagram", company.social?.instagram],
    ["YouTube", company.social?.youtube]
  ].filter(([, url]) => url);
  const mainPhone = company.phones[0];

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
          {company.whatsapp && <a href={company.whatsapp}>WhatsApp</a>}
        </div>
        <div className="footer-contact">
          <h4>Contact</h4>
          {company.address && <p>{company.address}</p>}
          {company.phones.map((phone) => (
            <a href={`tel:${phone.tel}`} key={phone.tel}>
              {phone.label}
            </a>
          ))}
          {company.email && <a href={`mailto:${company.email}`}>{company.email}</a>}
        </div>
      </div>
      <div className="footer-social">
        {social.map(([label, url]) => (
          <a href={url} key={label} target="_blank" rel="noreferrer">
            {label}
          </a>
        ))}
        {mainPhone && <strong>Call us: {mainPhone.label}</strong>}
      </div>
      <div className="footer-bottom">
        <a className="brand brand-small" href="#top" aria-label="Mechmark home">
          <img src={mechmarkLogo} alt="Mechmark" />
        </a>
        <span>
          © {new Date().getFullYear()} {company.name}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}

function useHashProduct(productFamilies) {
  const read = () => {
    const hash = window.location.hash.replace("#", "");
    return productFamilies.find((product) => product.slug === hash) || null;
  };
  const [selected, setSelected] = useState(read);

  useEffect(() => {
    setSelected(read()); // content may arrive from the API after first render
    const handleHashChange = () => setSelected(read());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productFamilies]);

  return selected;
}

function Site() {
  const { productFamilies } = useContent();
  const selectedProduct = useHashProduct(productFamilies);
  const selectedSlug = selectedProduct?.slug;

  useEffect(() => {
    if (selectedSlug) {
      window.scrollTo({ top: 0, behavior: "auto" });
    } else {
      // Returning from a product page to a homepage anchor: scroll to that section.
      const id = window.location.hash.replace("#", "");
      const target = id && document.getElementById(id);
      if (target) target.scrollIntoView();
    }
  }, [selectedSlug]);

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

export default function App() {
  return (
    <ContentProvider>
      <Site />
    </ContentProvider>
  );
}
