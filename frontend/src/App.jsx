import { useEffect, useState } from "react";
import { brochures, featureImage, hero, productFamilies, services, stats, teamMembers } from "./content.js";
import mechmarkLogo from "../../assets/images/mechmark-logo.png";

const productIcons = {
  copraCutter: (
    <svg viewBox="0 0 180 110" role="img" aria-hidden="true">
      <path d="M40 26h79l11 18v18H55L40 45z" />
      <path d="M57 62h74v23H57zM70 85v18M118 85v18" />
      <path d="M82 44h31M78 54h42M132 53h18v22h-18" />
      <circle cx="118" cy="72" r="9" />
      <path d="M57 63l-15 20M39 33v52M34 103h44M106 103h43" />
    </svg>
  ),
  oilPress: (
    <svg viewBox="0 0 180 110" role="img" aria-hidden="true">
      <path d="M53 18h64l-13 28H67z" />
      <path d="M43 46h73v43H43zM116 48h30v41h-30z" />
      <path d="M48 60H24l-8 9h32M54 58h45M54 70h45M54 82h45" />
      <path d="M126 59h10M126 70h10M126 81h10" />
      <path d="M61 89v12M135 89v12" />
    </svg>
  ),
  filterPress: (
    <svg viewBox="0 0 180 110" role="img" aria-hidden="true">
      <path d="M24 58h132M33 44v45M146 44v45M47 89h86" />
      <path d="M57 35h66M57 45h66M57 55h66" />
      <path d="M68 29v42M78 29v42M88 29v42M98 29v42M108 29v42M118 29v42" />
      <path d="M28 35a18 18 0 1 0 0 36M28 44h-12M28 62h-12" />
      <path d="M40 89l-18 14M138 89l18 14M43 76h91l10 13H33z" />
    </svg>
  ),
  storageTank: (
    <svg viewBox="0 0 180 110" role="img" aria-hidden="true">
      <path d="M58 16h64l6 9v45l-20 22H72L52 70V25z" />
      <path d="M66 29h48M66 43h48M66 57h48" />
      <path d="M126 37h18M126 53h18M144 35v8M144 51v8" />
      <path d="M52 37H36M52 53H36M36 35v8M36 51v8" />
      <path d="M75 92v12M105 92v12M58 104h64M88 92v12" />
    </svg>
  )
};

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Mechmark home">
        <img src={mechmarkLogo} alt="Mechmark" />
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
      <div className="hero-stage hero-placeholder" aria-label="Mechmark opening animation placeholder">
        <div className="placeholder-frame">
          <span>Opening animation</span>
          <h1>Animation coming soon</h1>
          <p>
            This space is reserved for the custom product opening animation. A static placeholder is
            shown until the animation asset is ready.
          </p>
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
          <p>{product.detail}</p>
          <p>{product.summary}</p>
        </div>
        <div className="product-detail-image">
          <img src={product.image} alt={product.title} />
        </div>
      </div>

      <div className="product-detail-specs" aria-label={`${product.title} highlights`}>
        {product.features.map((feature) => (
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

function TeamSection() {
  return (
    <section className="team-section" id="team">
      <div className="team-heading">
        <p>Our team</p>
        <h2>Meet Our Dynamic Mechmark Team</h2>
        <span>A committed team working tirelessly to deliver exceptional food processing solutions for you.</span>
      </div>
      <div className="team-grid">
        {teamMembers.map((member) => (
          <article className="team-card" key={member.name}>
            <div className="team-photo-ring">
              <img src={member.image} alt={member.name} />
            </div>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
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

function getSelectedProduct() {
  const hash = window.location.hash.replace("#", "");
  return productFamilies.find((product) => product.slug === hash) || null;
}

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(getSelectedProduct);

  useEffect(() => {
    const handleHashChange = () => {
      const nextProduct = getSelectedProduct();
      setSelectedProduct(nextProduct);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      window.scrollTo({ top: 0, behavior: "auto" });
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
            <ProductGrid />
            <TeamSection />
            <CapabilityBand />
            <Catalogues />
            <Services />
            <Contact />
          </>
        )}
      </main>
      <footer className="site-footer">
        <strong>Mechmark Industries</strong>
        <span>React + Django redesign draft</span>
      </footer>
    </>
  );
}
