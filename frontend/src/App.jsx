import { brochures, featureImage, hero, productFamilies, services, stats } from "./content.js";

const productIcons = {
  electric: (
    <svg viewBox="0 0 180 110" role="img" aria-hidden="true">
      <path d="M24 88h132M37 28h84c12 0 22 10 22 22v38H37z" />
      <path d="M51 39h54v49H51zM116 39h14v13h-14zM116 60h14M116 70h14" />
      <path d="M59 51h34M59 62h34M59 73h34" />
      <circle cx="52" cy="88" r="7" />
      <circle cx="128" cy="88" r="7" />
    </svg>
  ),
  firewood: (
    <svg viewBox="0 0 180 110" role="img" aria-hidden="true">
      <path d="M22 87h136M34 42h88v45H34zM122 53h24l10 34h-34z" />
      <path d="M44 52h62M44 64h62M44 76h62" />
      <path d="M138 59c-7 5-9 14-4 22M148 62c-8 4-11 12-8 21" />
      <circle cx="52" cy="87" r="7" />
      <circle cx="136" cy="87" r="7" />
    </svg>
  ),
  oil: (
    <svg viewBox="0 0 180 110" role="img" aria-hidden="true">
      <path d="M33 87h116M45 31h55v56H45zM100 47h25c9 0 17 8 17 17v23h-42z" />
      <path d="M56 44h33M56 56h33M56 68h33" />
      <path d="M130 47V32h14M144 32v12" />
      <path d="M124 70c8 8 8 17 0 17s-8-9 0-17z" />
      <circle cx="59" cy="87" r="7" />
      <circle cx="128" cy="87" r="7" />
    </svg>
  ),
  trayless: (
    <svg viewBox="0 0 180 110" role="img" aria-hidden="true">
      <path d="M27 87h128M44 35h72c13 0 24 11 24 24v28H44z" />
      <path d="M58 49h44M58 62h44M58 75h44" />
      <path d="M118 46h10M118 57h10M118 68h10" />
      <path d="M38 35l-12 16v36h18" />
      <circle cx="58" cy="87" r="7" />
      <circle cx="132" cy="87" r="7" />
    </svg>
  )
};

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Mechmark home">
        <span className="brand-mark">M</span>
        <span>Mechmark</span>
      </a>
      <nav className="nav-links" aria-label="Primary navigation">
        <a href="#products">Products</a>
        <a href="#capabilities">Capabilities</a>
        <a href="#catalogues">Catalogues</a>
        <a href="#contact">Contact</a>
      </nav>
      <a className="header-cta" href="https://wa.me/919496801821">
        WhatsApp
      </a>
    </header>
  );
}

function OpeningHero() {
  return (
    <section className="hero-section" id="top">
      <div className="hero-copy">
        <p className="eyebrow">{hero.eyebrow}</p>
        <h1>{hero.title}</h1>
        <p className="hero-text">{hero.text}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#products">
            {hero.primaryAction}
          </a>
          <a className="btn btn-secondary" href="#contact">
            {hero.secondaryAction}
          </a>
        </div>
      </div>
      <div className="hero-stage" aria-label="Opening product animation concept">
        <div className="reveal-panel reveal-panel-left" />
        <div className="reveal-panel reveal-panel-right" />
        <img src={hero.image} alt="Mechmark multi purpose dryer with food products" />
        <div className="scan-line" />
        <div className="hero-spec-card">
          <span>Opening animation placeholder</span>
          <strong>Product reveal slot</strong>
        </div>
      </div>
    </section>
  );
}

function ProductGrid() {
  return (
    <section className="section" id="products">
      <div className="section-heading">
        <p className="eyebrow">Select your product</p>
        <h2>Choose a Mechmark machine category.</h2>
      </div>
      <div className="product-icon-grid">
        {productFamilies.map((product) => (
          <a className="product-icon-card" href={product.href} key={product.title}>
            {productIcons[product.icon]}
            <span>{product.title}</span>
          </a>
        ))}
      </div>
      <div className="section-heading catalogue-heading">
        <p className="eyebrow">Product catalogue</p>
        <h2>Featured ranges with real product visuals.</h2>
      </div>
      <div className="product-grid">
        {productFamilies.map((product) => (
          <article className="product-card" id={product.slug} key={product.title}>
            <img src={product.image} alt={product.title} />
            <div>
              <span>{product.code}</span>
              <h3>{product.title}</h3>
              <p>{product.summary}</p>
              <a href={product.href}>View range</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CapabilityBand() {
  return (
    <section className="capability-band" id="capabilities">
      <div className="capability-copy">
        <p className="eyebrow">Better production, cleaner buying journey</p>
        <h2>Built around products first, then proof, support, and enquiry.</h2>
        <p>
          The reference site uses a strong first image, offer blocks, product selection, brand proof,
          and service support. This redesign keeps that rhythm, but translates it for Mechmark with
          real machinery, brochure downloads, and enquiry-led conversion.
        </p>
      </div>
      <div className="stats-grid">
        {stats.map(([value, label]) => (
          <div className="stat" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Catalogues() {
  return (
    <section className="section split-section" id="catalogues">
      <div>
        <p className="eyebrow">Download product catalogues</p>
        <h2>Keep the buyer close to technical material.</h2>
        <p>
          Existing brochures are preserved so prospects can move from homepage discovery to a
          product PDF without hunting through a heavy menu.
        </p>
        <div className="brochure-list">
          {brochures.map(([label, href]) => (
            <a href={href} key={label}>
              <span>{label}</span>
              <strong>PDF</strong>
            </a>
          ))}
        </div>
      </div>
      <img className="feature-image" src={featureImage} alt="Mechmark support and catalogue visual" />
    </section>
  );
}

function Services() {
  return (
    <section className="service-section">
      <div className="section-heading">
        <p className="eyebrow">Services and support</p>
        <h2>Support is a main sales message, not an afterthought.</h2>
      </div>
      <div className="service-grid">
        {services.map((service, index) => (
          <article key={service}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{service}</h3>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div>
        <p className="eyebrow">Talk to Mechmark</p>
        <h2>Send a machine enquiry.</h2>
        <p>Nagalikavu, Omassery, Calicut, Kerala - 673582</p>
        <p>
          <a href="mailto:mechmarks3@gmail.com">mechmarks3@gmail.com</a>
          <br />
          <a href="tel:+919496801821">+91 9496 801 821</a>
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
            <option key={product.title}>{product.title}</option>
          ))}
        </select>
        <textarea name="message" placeholder="Requirement" rows="4" />
        <button type="button">Submit enquiry</button>
      </form>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <OpeningHero />
        <ProductGrid />
        <CapabilityBand />
        <Catalogues />
        <Services />
        <Contact />
      </main>
      <footer className="site-footer">
        <strong>Mechmark Industries</strong>
        <span>React + Django redesign draft</span>
      </footer>
    </>
  );
}
