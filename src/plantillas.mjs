// Plantillas HTML del sitio GXD Garage.
// Base visual: el diseño original de GXD (Bebas Neue + DM Mono + Instrument Serif, negro, verde WhatsApp).
// Cada función devuelve un string de HTML. No hay dependencias externas.

// ---------- categorías ----------
// Las tres líneas de servicio del diseño original; son también las pestañas del catálogo.
export const GRUPOS = [
  { nombre: "Impresión 3D", id: "tab-3d", abrev: "3D" },
  { nombre: "Diseño gráfico", id: "tab-design", abrev: "DG" },
  { nombre: "Impresión digital", id: "tab-print", abrev: "ID" },
];
export const CATEGORIAS = GRUPOS.map((g) => g.nombre);
export const CATEGORIAS_BLOG = ["Guías", "Proyectos", "Novedades"];
export const SERVICIOS = ["Repuesto a medida", "Impresión 3D", "Lámparas y decoración", "Diseño gráfico", "Impresión digital", "Llaveros NFC", "Otro"];
const grupo = (cat) => GRUPOS.find((g) => g.nombre === cat) || GRUPOS[0];

// ---------- utilidades ----------
export const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
export const fechaLarga = (d) => `${d.getUTCDate()} de ${MESES[d.getUTCMonth()]} de ${d.getUTCFullYear()}`;
export const fechaISO = (d) => d.toISOString().slice(0, 10);
const fechaCorta = (d) => `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}`;
export const pesos = (n) => "$" + Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const slug = (s) =>
  String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const waLink = (sitio, texto) =>
  `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(texto || sitio.mensaje_whatsapp)}`;
const mapa = (sitio) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${sitio.direccion}, ${sitio.comuna}, Chile`);
const ext = 'target="_blank" rel="noopener"';

let OPC = { mostrarPrecios: false };
export const fijarOpciones = (o) => { OPC = { ...OPC, ...o }; };
let VERSION = "1";
export const fijarVersion = (v) => { VERSION = v; };

// Valor de referencia: solo si el interruptor está activo y el producto tiene precio
export const precioTexto = (p) => {
  if (!OPC.mostrarPrecios || typeof p.precio !== "number" || !(p.precio > 0)) return null;
  return (p.precio_desde ? "Desde " : "") + pesos(p.precio);
};

// ---------- gráficos ----------
const LOGO_D = "M4839.9,3312.8c-127,110.3-274.9,161.9-440.6,179.4l-1118.1.2-446.1-446-447,445.8-417.8-2.9,652.9-654.9-621-620.3-2.7,259.1-687.3,1.3c-107.3.2-208.1,41.1-286.9,107-85.6,71.6-121.4,177.2-90.5,287.8,46,164.6,191.3,308.1,367.6,322.5,136.9,11.2,266.6.9,401.1,3.8l.7-364.3,295.6-.9-.5,529.6c0,67.8-67.7,134-135.9,132.1-202.1-5.8-393.2,12.3-595.7-5.4-297.9-26.1-545.5-261.2-621-543.2-61.5-229.7,18.7-455.2,199.3-601.1,130.8-105.6,287.4-158.9,458.1-165.5h1084.2c0,.1,446.4,446.2,446.4,446.2l446.2-446,417.8,3.1-652.5,654.7,621,620.3,2.7-259.1,687.4-1.2c107.3-.2,208-41.2,286.8-107.1,85.6-71.6,121.4-177.2,90.5-287.8-46-164.7-191.3-307.9-367.6-322.5-136.8-11.3-266.6-.9-401.1-3.9l-.7,364.5-295.6.9.5-529.7c0-68,67.6-133.9,136-132,202.1,5.8,393.2-12.3,595.8,5.4,300.1,26.3,549.8,264.9,622.6,550.1,55.9,219-15.3,433.2-184.5,580Z";
const logo = (fondo = "#0a0a0a", trazo = "#fff", extra = "") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5669.3 5669.3" ${extra} aria-hidden="true"><rect width="5669.3" height="5669.3" fill="${fondo}"/><path fill="${trazo}" d="${LOGO_D}"/></svg>`;
const WA = `<svg viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.112 1.523 5.837L.057 23.928l6.257-1.439A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.848 0-3.575-.504-5.063-1.383l-.363-.214-3.724.856.883-3.63-.235-.374A9.957 9.957 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>`;
const ICONO = {
  "Impresión 3D": `<svg class="service-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="8" y="24" width="32" height="20" rx="1" stroke="white" stroke-width="1.5"/><path d="M24 4L38 14H10L24 4Z" stroke="white" stroke-width="1.5"/><line x1="24" y1="14" x2="24" y2="24" stroke="white" stroke-width="1.5"/><line x1="16" y1="30" x2="32" y2="30" stroke="white" stroke-width="1.5"/><line x1="16" y1="36" x2="26" y2="36" stroke="white" stroke-width="1.5"/></svg>`,
  "Diseño gráfico": `<svg class="service-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="6" y="6" width="28" height="36" rx="1" stroke="white" stroke-width="1.5"/><path d="M20 6h16l6 6v30H34" stroke="white" stroke-width="1.5"/><circle cx="17" cy="20" r="4" stroke="white" stroke-width="1.5"/><line x1="10" y1="30" x2="28" y2="30" stroke="white" stroke-width="1.5"/><line x1="10" y1="36" x2="22" y2="36" stroke="white" stroke-width="1.5"/></svg>`,
  "Impresión digital": `<svg class="service-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true"><rect x="4" y="10" width="40" height="28" rx="2" stroke="white" stroke-width="1.5"/><line x1="4" y1="18" x2="44" y2="18" stroke="white" stroke-width="1.5"/><circle cx="10" cy="14" r="1.5" fill="white"/><circle cx="16" cy="14" r="1.5" fill="white"/><circle cx="22" cy="14" r="1.5" fill="white"/><rect x="10" y="24" width="12" height="8" rx="1" stroke="white" stroke-width="1.5"/><line x1="26" y1="26" x2="38" y2="26" stroke="white" stroke-width="1.5"/><line x1="26" y1="30" x2="38" y2="30" stroke="white" stroke-width="1.5"/></svg>`,
};
const ICONO_CONTACTO = {
  ig: `<svg class="contact-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>`,
  wa: `<svg class="contact-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M21 12a9 9 0 01-9 9 8.965 8.965 0 01-4.636-1.284L3 21l1.338-4.22A8.953 8.953 0 013 12a9 9 0 019-9 9 9 0 019 9z"/></svg>`,
  pin: `<svg class="contact-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 22s7-6.1 7-12a7 7 0 0 0-14 0c0 5.9 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
};

// ---------- estructura común ----------
export function layout({ sitio, titulo, descripcion, ruta, imagen, tipo = "website", jsonld = [], actual = "", cuerpo, noindex = false, flotante = true }) {
  const base = sitio.url.replace(/\/$/, "");
  const url = base + ruta;
  const img = base + (imagen || "/brand/compartir.jpg");
  const tituloCompleto = ruta === "/" ? `${sitio.nombre} | ${titulo}` : `${titulo} | ${sitio.nombre}`;
  const nav = (href, txt, key) => `<li><a href="${href}"${actual === key ? ' aria-current="page"' : ""}>${txt}</a></li>`;
  return `<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(tituloCompleto)}</title>
<meta name="description" content="${esc(descripcion)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${esc(url)}">`}
<meta property="og:type" content="${tipo}">
<meta property="og:site_name" content="${esc(sitio.nombre)}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descripcion)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(img)}">
<meta property="og:locale" content="es_CL">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0a0a0a">
<link rel="icon" type="image/png" sizes="32x32" href="/brand/favicon-32.png">
<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">
<link rel="alternate" type="application/rss+xml" title="Blog de ${esc(sitio.nombre)}" href="/blog/rss.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&display=swap">
<link rel="stylesheet" href="/estilos.css?v=${VERSION}">
<script>document.documentElement.classList.add("js");window.GXD_WA=${JSON.stringify(sitio.whatsapp)};</script>
<script src="/sitio.js?v=${VERSION}" defer></script>
<script src="/cotizacion.js?v=${VERSION}" defer></script>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`).join("\n")}
</head>
<body data-root="/">
<div class="cursor" id="cursor" aria-hidden="true"></div>
<div class="cursor-ring" id="cursorRing" aria-hidden="true"></div>

<nav aria-label="Principal">
  <a class="nav-logo" href="/" aria-label="${esc(sitio.nombre)}, inicio">${logo()}<span class="nav-brand">GXD GARAGE</span></a>
  <ul class="nav-links" id="menu">
    ${nav("/#servicios", "Servicios", "servicios")}
    ${nav("/catalogo/", "Catálogo", "catalogo")}
    ${nav("/#portafolio", "Portafolio", "portafolio")}
    ${nav("/blog/", "Blog", "blog")}
    ${nav("/#contacto", "Contacto", "contacto")}
  </ul>
  <div class="nav-right">
    <a href="/cotizar/" class="nav-cta"${actual === "cotizar" ? ' aria-current="page"' : ""}>${WA}<span class="cta-txt">Cotizar</span><span class="cot-count" data-cot-count hidden></span></a>
    <button class="nav-toggle" type="button" aria-label="Abrir menú" aria-controls="menu" aria-expanded="false"><span></span></button>
  </div>
</nav>

<main id="contenido">
${cuerpo}
</main>

${pie(sitio)}
${flotante ? `<a class="wa-float" href="${waLink(sitio, "Hola GXD Garage, quiero consultar sobre sus servicios.")}" ${ext} aria-label="Escríbenos por WhatsApp">${WA}</a>` : ""}
<div class="toast" role="status" aria-live="polite" data-toast hidden></div>
</body>
</html>`;
}

function pie(sitio) {
  const anio = new Date().getUTCFullYear();
  return `<footer>
  <div class="footer-brand">
    <span class="nav-brand">GXD GARAGE</span>
    <p class="footer-slogan">${esc(sitio.slogan)}.<br>Impresión 3D · Diseño Gráfico<br>Impresión Digital · ${esc(sitio.comuna)}</p>
  </div>
  <div class="footer-col">
    <h4>Servicios</h4>
    <ul>${GRUPOS.map((g) => `<li><a href="/catalogo/#${g.id}">${esc(g.nombre)}</a></li>`).join("")}</ul>
  </div>
  <div class="footer-col">
    <h4>Sitio</h4>
    <ul>
      <li><a href="/catalogo/">Catálogo</a></li>
      <li><a href="/cotizar/">Cotizar</a></li>
      <li><a href="/blog/">Blog</a></li>
    </ul>
  </div>
  <div class="footer-col">
    <h4>Contacto</h4>
    <ul>
      <li><a href="https://www.instagram.com/${esc(sitio.instagram)}/" ${ext}>Instagram</a></li>
      <li><a href="${waLink(sitio)}" ${ext}>WhatsApp ${esc(sitio.whatsapp_visible)}</a></li>
      <li><a href="${mapa(sitio)}" ${ext}>${esc(sitio.direccion)}, ${esc(sitio.comuna)}</a></li>
    </ul>
  </div>
</footer>
<div class="footer-bottom">
  <span class="footer-copy">© ${anio} ${esc(sitio.nombre)} — ${esc(sitio.comuna)}, ${esc(sitio.region)}, Chile</span>
  <div class="footer-social">
    <a href="https://www.instagram.com/${esc(sitio.instagram)}/" ${ext}>Instagram</a>
    <a href="/#contacto">Contacto</a>
  </div>
</div>`;
}

// ---------- piezas ----------
const migas = (items) =>
  `<ol class="crumbs">${items.map(([t, h]) => `<li>${h ? `<a href="${h}">${esc(t)}</a>` : `<span aria-current="page">${esc(t)}</span>`}</li>`).join("")}</ol>`;
const ldMigas = (sitio, items) => ({
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: items.map(([t, h], i) => ({ "@type": "ListItem", position: i + 1, name: t, ...(h ? { item: sitio.url.replace(/\/$/, "") + h } : {}) })),
});
// Encabezado de sección como en el diseño original: "// 01 — etiqueta", título con palabra en cursiva
const cabecera = (label, t1, t2, desc) => `<div class="section-header fade-up">
    <div>
      <p class="section-label">${label}</p>
      <h2 class="section-title">${t1}<br><em>${t2}</em></h2>
    </div>
    ${desc ? `<p class="section-desc">${desc}</p>` : ""}
  </div>`;
const heroInterior = (items, label, t1, t2, desc, extra = "") => `<header class="page-hero">
  <div class="hero-grid-lines" aria-hidden="true"></div>
  ${migas(items)}
  <p class="section-label">${label}</p>
  <h1 class="section-title">${t1}${t2 ? `<br><em>${t2}</em>` : ""}</h1>
  ${desc ? `<p class="section-desc">${desc}</p>` : ""}
  ${extra}
</header>`;

export function tarjetaProducto(sitio, p) {
  const g = grupo(p.categoria);
  const img = p.imagenes[0];
  const ref = precioTexto(p);
  const msg = `Hola GXD Garage, quiero cotizar: *${p.titulo}*\n\nDetalles:`;
  return `<article class="product-card fade-up">
  <a class="product-link" href="/catalogo/${p.slug}/">
    <div class="product-img">${img ? `<img src="${esc(img)}" alt="${esc(p.titulo)} - ${esc(sitio.nombre)}" loading="lazy">` : `<div class="product-img-placeholder">${g.abrev}</div>`}</div>
    <div class="product-body">
      <span class="product-cat">${esc(g.nombre)}${p.etiqueta ? ` · ${esc(p.etiqueta)}` : ""}</span>
      <h3 class="product-name">${esc(p.titulo)}</h3>
      <p class="product-desc">${esc(p.resumen)}</p>
    </div>
  </a>
  <div class="product-footer">
    <span class="product-price${ref ? "" : " cot"}">${esc(ref || "A cotizar")}</span>
    <a class="btn-wa-product" href="${waLink(sitio, msg)}" ${ext}>${WA}Cotizar</a>
  </div>
</article>`;
}

export function tarjetaPost(a, destacado = false) {
  return `<a class="post-card${destacado ? " post-feature" : ""} fade-up" href="/blog/${a.slug}/">
  <div class="post-card-img">${a.portada ? `<img src="${esc(a.portada)}" alt="" loading="lazy">` : `<div class="product-img-placeholder">GXD</div>`}</div>
  <div class="post-card-body">
    <div class="post-meta"><span>// ${esc(a.categoria)}</span><time datetime="${fechaISO(a.fecha)}">${fechaCorta(a.fecha)}</time></div>
    <h3 class="post-title">${esc(a.titulo)}</h3>
    <p class="post-excerpt">${esc(a.descripcion)}</p>
    <span class="service-arrow">Leer artículo →</span>
  </div>
</a>`;
}

function tarjetaPortafolio(w) {
  return `<figure class="portfolio-card fade-up" data-cat="${esc(slug(w.categoria))}" tabindex="0">
  ${w.imagen ? `<img class="portfolio-card-img" src="${esc(w.imagen)}" alt="${esc(w.titulo)}" loading="lazy">` : `<div class="portfolio-card-content"><div class="p-card-visual">${esc(grupo(w.categoria).abrev)}</div></div>`}
  <figcaption class="portfolio-card-overlay"><div class="p-card-category">${esc(w.categoria)}</div><div class="p-card-title">${esc(w.titulo)}</div></figcaption>
</figure>`;
}

const ldNegocio = (sitio) => ({
  "@context": "https://schema.org", "@type": "LocalBusiness",
  name: sitio.nombre, description: sitio.descripcion, slogan: sitio.slogan, url: sitio.url,
  image: sitio.url.replace(/\/$/, "") + "/brand/icono-512.png", logo: sitio.url.replace(/\/$/, "") + "/brand/icono-512.png",
  telephone: "+" + sitio.whatsapp,
  address: { "@type": "PostalAddress", streetAddress: sitio.direccion, addressLocality: sitio.comuna, addressRegion: sitio.region, postalCode: sitio.codigo_postal, addressCountry: "CL" },
  sameAs: [`https://www.instagram.com/${sitio.instagram}/`],
  contactPoint: { "@type": "ContactPoint", contactType: "customer service", telephone: "+" + sitio.whatsapp, availableLanguage: "Spanish" },
});

// ---------- inicio ----------
export function paginaInicio({ sitio, productos, posts, portafolio }) {
  const marquee = ["Impresión 3D", "Diseño Gráfico", "Impresión Digital", "Repuestos a medida", "Lámparas", "Prototipos", "Branding", "Llaveros NFC", "Innovación capa por capa"];
  const catsPorta = GRUPOS.map((g) => g.nombre).filter((c) => portafolio.some((w) => w.categoria === c));
  const cuerpo = `
<section id="hero">
  <div class="hero-left">
    <div class="hero-tag">${esc(sitio.slogan)}</div>
    <h1 class="hero-title">Creamos<br><em>lo que</em><br>imaginas</h1>
    <p class="hero-subtitle">Impresión 3D, diseño gráfico e impresión digital en ${esc(sitio.comuna)}. Transformamos tus ideas en objetos reales: repuestos que ya no venden, lámparas, regalos y la identidad de tu marca.</p>
    <div class="hero-actions">
      <a href="/catalogo/" class="btn-primary">Ver catálogo</a>
      <a href="${waLink(sitio, "Hola GXD Garage, quiero cotizar un proyecto.")}" ${ext} class="btn-wa">${WA}Cotizar ahora</a>
    </div>
  </div>
  <div class="hero-right" aria-hidden="true">
    <div class="hero-grid-lines"></div>
    <div class="hero-logo-bg">${logo("white", "black", 'width="800" height="800"')}</div>
    <div class="hero-logo-center">${logo()}</div>
  </div>
  <div class="hero-stats">
    <div><div class="stat-num">3</div><div class="stat-label">Servicios</div></div>
    <div><div class="stat-num">3</div><div class="stat-label">Materiales</div></div>
    <div><div class="stat-num">100%</div><div class="stat-label">A pedido</div></div>
  </div>
</section>

<div class="marquee-section" aria-hidden="true">
  <div class="marquee-track">${[...marquee, ...marquee].map((m) => `<span class="marquee-item">${esc(m)}</span>`).join("")}</div>
</div>

<section id="servicios">
  ${cabecera("// 01 — lo que hacemos", "Nuestros", "Servicios", "Unimos el diseño gráfico con la tecnología 3D para darte soluciones que no encuentras en tiendas.")}
  <div class="services-grid">
    <article class="service-card fade-up">
      <div class="service-num">01</div>
      ${ICONO["Impresión 3D"]}
      <h3 class="service-name">Impresión 3D</h3>
      <p class="service-desc">Fabricamos repuestos que ya no venden, prototipos, lámparas y piezas personalizadas con tecnología FDM y resina. Te asesoramos en el material: PLA, PETG o resina.</p>
      <a href="#catalogo" class="service-arrow" data-set-tab="tab-3d">Ver productos →</a>
    </article>
    <article class="service-card fade-up">
      <div class="service-num">02</div>
      ${ICONO["Diseño gráfico"]}
      <h3 class="service-name">Diseño Gráfico</h3>
      <p class="service-desc">Identidad visual, logotipos, packaging y piezas para redes sociales. Diseño estratégico que conecta tu marca con tu audiencia.</p>
      <a href="#catalogo" class="service-arrow" data-set-tab="tab-design">Ver productos →</a>
    </article>
    <article class="service-card fade-up">
      <div class="service-num">03</div>
      ${ICONO["Impresión digital"]}
      <h3 class="service-name">Impresión Digital</h3>
      <p class="service-desc">Stickers, vinilos adhesivos, banners y material impreso con colores vibrantes y acabados profesionales para tu negocio o tu evento.</p>
      <a href="#catalogo" class="service-arrow" data-set-tab="tab-print">Ver productos →</a>
    </article>
  </div>
</section>

<div class="section-divider"></div>

<section id="catalogo" class="section-alt">
  ${cabecera("// 02 — productos", "Catálogo", "de servicios", "Todo se fabrica a pedido. Elige lo que necesitas y escríbenos por WhatsApp: te respondemos con una propuesta.")}
  <div class="catalog-tabs" role="tablist" aria-label="Líneas de servicio">
    ${GRUPOS.map((g, i) => `<button class="catalog-tab${i === 0 ? " active" : ""}" id="${g.id}" role="tab" aria-selected="${i === 0}" aria-controls="panel-${g.id}">${esc(g.nombre)}</button>`).join("")}
  </div>
  ${GRUPOS.map((g, i) => {
    const lista = productos.filter((p) => p.categoria === g.nombre).slice(0, 6);
    return `<div class="catalog-panel${i === 0 ? " active" : ""}" id="panel-${g.id}" role="tabpanel" aria-labelledby="${g.id}">
    ${lista.map((p) => tarjetaProducto(sitio, p)).join("")}
  </div>`;
  }).join("")}
  <div class="catalog-more"><a href="/catalogo/" class="btn-primary">Ver catálogo completo</a></div>
</section>

<section id="proceso">
  ${cabecera("// 03 — cómo cotizamos", "De tu idea", "a tu mano", "Cada pieza es distinta, por eso cotizamos en dos etapas: primero el diseño, después la impresión.")}
  <div class="services-grid process-grid">
    <article class="service-card fade-up">
      <div class="service-num">01</div>
      <h3 class="service-name">Trae tu pieza o tu idea</h3>
      <p class="service-desc">Si es un repuesto, tráelo como sea que esté: roto, incompleto o en partes. Tenerlo en la mano es lo que más nos ayuda. Si no puedes, envíanos fotos con una regla al lado.</p>
    </article>
    <article class="service-card fade-up">
      <div class="service-num">02</div>
      <h3 class="service-name">Cotizamos el diseño</h3>
      <p class="service-desc">El valor del modelado depende de la complejidad de la pieza. Te mostramos la propuesta antes de imprimir.</p>
    </article>
    <article class="service-card fade-up">
      <div class="service-num">03</div>
      <h3 class="service-name">Imprimimos capa por capa</h3>
      <p class="service-desc">Con el diseño listo, te damos el valor de la impresión según el material, el tamaño y la cantidad, y te entregamos la pieza lista.</p>
    </article>
  </div>
</section>

${portafolio.length ? `<div class="section-divider"></div>
<section id="portafolio">
  ${cabecera("// 04 — trabajos", "Nuestro", "Portafolio", "Proyectos reales que salieron de nuestro taller.")}
  <div class="portfolio-layout">
    <div class="portfolio-sidebar">
      <p style="font-size:0.78rem;color:var(--dim);line-height:1.9;margin-bottom:2rem;">Cada proyecto es una oportunidad para superar límites. Exploramos lo que es posible con las herramientas que tenemos.</p>
      <div class="portfolio-filter" role="group" aria-label="Filtrar trabajos">
        <button class="filter-btn active" type="button" data-f="" aria-pressed="true">Todo</button>
        ${catsPorta.map((c) => `<button class="filter-btn" type="button" data-f="${esc(slug(c))}" aria-pressed="false">${esc(c)}</button>`).join("")}
      </div>
    </div>
    <div class="portfolio-grid">${portafolio.map(tarjetaPortafolio).join("")}</div>
  </div>
</section>` : ""}

${posts.length ? `<section id="blog" class="section-alt">
  ${cabecera("// 05 — blog", "Guías y", "novedades", "Respondemos lo que más nos preguntan sobre impresión 3D, materiales y diseño.")}
  <div class="blog-grid">${posts.slice(0, 3).map((a) => tarjetaPost(a)).join("")}</div>
  <div class="catalog-more"><a href="/blog/" class="btn-primary">Ver todos los artículos</a></div>
</section>` : ""}

<section id="contacto"${posts.length ? "" : ' class="section-alt"'}>
  ${cabecera("// 06 — hablemos", "¿Tienes un", "Proyecto?", "Cuéntanos tu idea y cotizamos sin compromiso. Te respondemos por WhatsApp.")}
  <div class="contact-layout">
    <div class="contact-info fade-up">
      <h3>Trabajemos juntos</h3>
      <p>Estamos en ${esc(sitio.comuna)} y listos para fabricar tu proyecto. Ya sea una pieza única en 3D, la identidad de tu marca o material impreso, en ${esc(sitio.nombre)} lo hacemos realidad.</p>
      <div class="contact-links">
        <a href="https://www.instagram.com/${esc(sitio.instagram)}/" class="contact-link" ${ext}>${ICONO_CONTACTO.ig}@${esc(sitio.instagram)}</a>
        <a href="${waLink(sitio)}" class="contact-link" ${ext}>${ICONO_CONTACTO.wa}WhatsApp ${esc(sitio.whatsapp_visible)}<span class="mini copy" data-copy="+${esc(sitio.whatsapp)}" role="button" tabindex="0">Copiar</span></a>
        <a href="${mapa(sitio)}" class="contact-link" ${ext}>${ICONO_CONTACTO.pin}${esc(sitio.direccion)}, ${esc(sitio.comuna)}</a>
      </div>
    </div>
    <form class="contact-form fade-up" id="contacto-form" novalidate>
      <div class="form-row">
        <div class="form-group"><label for="nombre">Nombre</label><input type="text" id="nombre" name="nombre" placeholder="Tu nombre" autocomplete="name"></div>
        <div class="form-group"><label for="servicio">Servicio</label>
          <select id="servicio" name="servicio"><option value="">Seleccionar servicio...</option>${SERVICIOS.map((s) => `<option>${esc(s)}</option>`).join("")}</select></div>
      </div>
      <div class="form-group"><label for="tengo">¿Qué tienes para partir?</label>
        <select id="tengo" name="tengo"><option>Tengo la pieza física</option><option>Tengo fotos de referencia</option><option>Tengo un archivo 3D o de diseño</option><option>Solo tengo la idea</option></select></div>
      <div class="form-group"><label for="mensaje">Mensaje</label><textarea id="mensaje" name="mensaje" placeholder="Cuéntanos sobre tu proyecto..."></textarea></div>
      <p class="cz-error" id="contacto-error" role="alert" hidden></p>
      <button type="submit" class="btn-submit">${WA}Enviar por WhatsApp →</button>
      <p class="form-hint">¿Varios productos? <a href="/cotizar/">Arma tu cotización completa →</a></p>
    </form>
  </div>
</section>`;
  return layout({ sitio, ruta: "/", titulo: "Impresión 3D, diseño gráfico e impresión digital en Talagante", descripcion: sitio.descripcion, jsonld: [ldNegocio(sitio)], cuerpo });
}

// ---------- catálogo ----------
export function paginaCatalogo({ sitio, productos }) {
  const items = [["Inicio", "/"], ["Catálogo", null]];
  const grupos = GRUPOS.filter((g) => productos.some((p) => p.categoria === g.nombre));
  const ldLista = {
    "@context": "https://schema.org", "@type": "ItemList",
    itemListElement: productos.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: sitio.url.replace(/\/$/, "") + `/catalogo/${p.slug}/`, name: p.titulo })),
  };
  const cuerpo = `
${heroInterior(items, "// catálogo", "Catálogo", "de servicios", `Ideas y productos que fabricamos a pedido en ${esc(sitio.comuna)}. Agrega lo que te interese a tu cotización o escríbenos directo por WhatsApp.`)}
<section>
  <div class="filter-row" role="navigation" aria-label="Líneas de servicio">
    ${grupos.map((g) => `<a class="filter-btn" href="#${g.id}">${esc(g.nombre)}</a>`).join("")}
  </div>
  ${grupos.map((g, i) => {
    const lista = productos.filter((p) => p.categoria === g.nombre);
    return `<div id="${g.id}" style="scroll-margin-top:110px;${i ? "margin-top:6rem" : ""}">
    <p class="section-label">// 0${i + 1} — ${esc(g.nombre.toLowerCase())}</p>
    <div class="catalog-panel active" style="margin-top:1.5rem">${lista.map((p) => tarjetaProducto(sitio, p)).join("")}</div>
  </div>`;
  }).join("")}
</section>
<section class="section-alt">
  ${cabecera("// a medida", "¿No encuentras", "lo que buscas?", "Lo diseñamos desde cero. Cuéntanos tu idea y te enviamos una propuesta.")}
  <div class="hero-actions fade-up"><a class="btn-primary" href="/cotizar/">Cotizar mi idea</a><a class="btn-wa" href="${waLink(sitio, "Hola GXD Garage, busco algo que no está en el catálogo.")}" ${ext}>${WA}Escribir por WhatsApp</a></div>
</section>`;
  return layout({
    sitio, ruta: "/catalogo/", actual: "catalogo", titulo: "Catálogo de impresión 3D, diseño e impresión digital",
    descripcion: `Catálogo de ${sitio.nombre}: repuestos a medida, lámparas, letreros 3D, logos, stickers, vinilos y llaveros NFC hechos a pedido en ${sitio.comuna}. Cotiza por WhatsApp.`,
    jsonld: [ldMigas(sitio, items), ldLista], cuerpo,
  });
}

// ---------- ficha de producto ----------
export function paginaProducto({ sitio, p, relacionados }) {
  const g = grupo(p.categoria);
  const items = [["Inicio", "/"], ["Catálogo", "/catalogo/"], [g.nombre, `/catalogo/#${g.id}`], [p.titulo, null]];
  const base = sitio.url.replace(/\/$/, "");
  const abs = (u) => (u.startsWith("http") ? u : base + u);
  const url = `${base}/catalogo/${p.slug}/`;
  const ref = precioTexto(p);
  const ldServ = {
    "@context": "https://schema.org", "@type": "Service",
    name: p.titulo, description: p.resumen, serviceType: g.nombre, url,
    ...(p.imagenes.length ? { image: p.imagenes.map(abs) } : {}),
    provider: { "@type": "LocalBusiness", name: sitio.nombre, telephone: "+" + sitio.whatsapp,
      address: { "@type": "PostalAddress", streetAddress: sitio.direccion, addressLocality: sitio.comuna, addressRegion: sitio.region, addressCountry: "CL" } },
    areaServed: [{ "@type": "City", name: sitio.comuna }, { "@type": "AdministrativeArea", name: sitio.region }],
  };
  const galeria = p.imagenes.length
    ? `<div class="gallery-main"><img id="foto" src="${esc(p.imagenes[0])}" alt="${esc(p.titulo)}"></div>
       ${p.imagenes.length > 1 ? `<div class="thumbs">${p.imagenes.map((src, i) => `<button class="thumb" type="button" data-src="${esc(src)}" aria-label="Ver foto ${i + 1}" aria-current="${i === 0}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}`
    : `<div class="gallery-main"><div class="product-img-placeholder" style="font-size:7rem">${g.abrev}</div></div>`;
  const cuerpo = `
<header class="page-hero" style="padding-bottom:2rem">${migas(items)}</header>
<section style="padding-top:4rem">
  <div class="prod-detail">
    <div class="fade-up">${galeria}</div>
    <div class="prod-info">
      <span class="product-cat">${esc(g.nombre)}${p.etiqueta ? ` · ${esc(p.etiqueta)}` : ""}</span>
      <h1 class="section-title">${esc(p.titulo)}</h1>
      ${p.resumen ? `<p class="lead">${esc(p.resumen)}</p>` : ""}
      ${ref ? `<p class="ref-price"><small>Valor de referencia</small>${esc(ref)}</p>` : ""}
      <div class="quote-box">
        <div class="form-group"><label for="cant">Cantidad</label><input id="cant" type="number" min="1" max="9999" value="1" inputmode="numeric"></div>
        <button class="btn-primary" type="button" data-add data-slug="${esc(p.slug)}" data-titulo="${esc(p.titulo)}">Agregar a mi cotización</button>
      </div>
      <p class="added" data-added hidden>Agregado a tu cotización. <a href="/cotizar/">Ver mi cotización →</a></p>
      <a class="btn-wa" style="align-self:flex-start" href="${waLink(sitio, `Hola GXD Garage, quiero cotizar: *${p.titulo}*\n${url}\n\nDetalles:`)}" ${ext}>${WA}Cotizar directo por WhatsApp</a>
      ${p.detalles.length ? `<ul class="spec-list">${p.detalles.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>` : ""}
      <p class="fine">Cada pieza se fabrica a pedido. El valor depende de la complejidad del diseño, el tamaño, el material y la cantidad, y te lo confirmamos en la cotización.</p>
    </div>
  </div>
  ${p.html.trim() ? `<div class="prose fade-up" style="margin-top:6rem">${p.html}</div>` : ""}
</section>
${relacionados.length ? `<section class="section-alt">
  ${cabecera("// también te puede servir", "Más de", esc(g.nombre))}
  <div class="catalog-panel active">${relacionados.map((r) => tarjetaProducto(sitio, r)).join("")}</div>
</section>` : ""}`;
  return layout({
    sitio, ruta: `/catalogo/${p.slug}/`, actual: "catalogo", titulo: p.titulo,
    descripcion: p.resumen || `${p.titulo} hecho a pedido por ${sitio.nombre} en ${sitio.comuna}. Cotiza por WhatsApp.`,
    imagen: p.imagenes[0], jsonld: [ldMigas(sitio, items), ldServ], cuerpo,
  });
}

// ---------- cotizar ----------
export function paginaCotizar({ sitio }) {
  const items = [["Inicio", "/"], ["Cotizar", null]];
  const cuerpo = `
${heroInterior(items, "// cotizar", "Cotiza tu", "idea", "Cuéntanos qué necesitas y armamos tu mensaje de WhatsApp. Te respondemos con una propuesta y el valor del diseño.")}
<section>
  <form class="cotizador" id="cotizador" novalidate>
    <div class="cz-main">
      <fieldset class="cz-block">
        <legend><span>01</span>Productos en tu cotización</legend>
        <ul class="cz-lista" id="cz-lista"></ul>
        <p class="cz-vacio" id="cz-vacio">Todavía no agregas productos. Puedes elegirlos en el <a href="/catalogo/">catálogo</a> o describir tu idea abajo.</p>
      </fieldset>
      <fieldset class="cz-block">
        <legend><span>02</span>Tu solicitud</legend>
        <div class="form-group"><label for="cz-servicio">¿Qué necesitas?</label>
          <select id="cz-servicio" name="servicio">${SERVICIOS.map((s) => `<option>${esc(s)}</option>`).join("")}</select></div>
        <div class="form-group"><label for="cz-detalle">Cuéntanos tu idea (obligatorio si no agregaste productos)</label>
          <textarea id="cz-detalle" name="detalle" placeholder="Ej.: Se me rompió la perilla de la cocina y ya no la venden. Necesito 2."></textarea></div>
        <div class="form-group">
          <span class="section-label" id="cz-tengo-l" style="margin-bottom:0.25rem">¿Qué tienes para partir?</span>
          <div class="choices" role="radiogroup" aria-labelledby="cz-tengo-l">
            <label class="choice"><input type="radio" name="tengo" value="Tengo la pieza física" checked>La pieza física</label>
            <label class="choice"><input type="radio" name="tengo" value="Tengo fotos de referencia">Fotos de referencia</label>
            <label class="choice"><input type="radio" name="tengo" value="Tengo un archivo 3D o de diseño">Un archivo 3D o de diseño</label>
            <label class="choice"><input type="radio" name="tengo" value="Solo tengo la idea">Solo la idea</label>
          </div>
        </div>
        <div class="form-group"><label for="cz-plazo">¿Para cuándo lo necesitas?</label>
          <select id="cz-plazo" name="plazo"><option>Sin apuro</option><option>Dentro de las próximas 2 semanas</option><option>Esta semana</option><option>Para una fecha específica</option></select></div>
      </fieldset>
      <fieldset class="cz-block">
        <legend><span>03</span>Tus datos</legend>
        <div class="form-row">
          <div class="form-group"><label for="cz-nombre">Nombre</label><input id="cz-nombre" name="nombre" type="text" autocomplete="name" placeholder="Tu nombre"></div>
          <div class="form-group"><label for="cz-comuna">Comuna</label><input id="cz-comuna" name="comuna" type="text" autocomplete="address-level2" placeholder="Ej.: Talagante"></div>
        </div>
      </fieldset>
    </div>
    <aside class="cz-side">
      <h3>Así cotizamos</h3>
      <ol class="cz-steps">
        <li><span><b>Revisamos tu idea.</b> Si es un repuesto, lo mejor es traer la pieza, como sea que esté.</span></li>
        <li><span><b>Cotizamos el diseño.</b> Su valor depende de la complejidad de la pieza.</span></li>
        <li><span><b>Con el diseño listo,</b> te damos el valor de la impresión según material y cantidad.</span></li>
      </ol>
      <p class="cz-error" id="cz-error" role="alert" hidden></p>
      <button class="btn-submit" type="submit">${WA}Enviar por WhatsApp →</button>
      <p class="fine">Se abrirá WhatsApp con tu mensaje listo. Después puedes adjuntar fotos en el mismo chat.</p>
      <details class="cz-copy">
        <summary>¿No se abrió WhatsApp?</summary>
        <p>Copia el mensaje y envíalo al ${esc(sitio.whatsapp_visible)}.</p>
        <button class="mini" type="button" id="cz-copiar">Copiar mensaje</button>
      </details>
    </aside>
  </form>
</section>`;
  return layout({
    sitio, ruta: "/cotizar/", actual: "cotizar", titulo: "Cotiza tu proyecto de impresión 3D o diseño",
    descripcion: `Cotiza con ${sitio.nombre}: repuestos a medida, impresión 3D, lámparas, diseño gráfico, stickers y llaveros NFC en ${sitio.comuna}. Arma tu solicitud y envíala por WhatsApp.`,
    jsonld: [ldMigas(sitio, items)], cuerpo, flotante: false,
  });
}

// ---------- blog ----------
const INTRO_CAT = {
  "Guías": "Respuestas prácticas a lo que más nos preguntan: materiales, repuestos, diseño y cómo pedir tu pieza.",
  "Proyectos": "Trabajos reales que salieron del taller: el encargo, el proceso y el resultado.",
  "Novedades": "Lo nuevo en GXD Garage: productos, eventos, promociones y lo que estamos probando.",
};
export const rutaCat = (c) => `/blog/categoria/${slug(c)}/`;

export function paginaBlog({ sitio, posts, categorias, cat = null }) {
  const lista = cat ? posts.filter((a) => a.categoria === cat) : posts;
  const items = cat ? [["Inicio", "/"], ["Blog", "/blog/"], [cat, null]] : [["Inicio", "/"], ["Blog", null]];
  const [primero, ...resto] = lista;
  const cuerpo = `
${heroInterior(items, cat ? "// blog — categoría" : "// blog", cat ? esc(cat) : "Guías y", cat ? "" : "novedades",
    cat ? esc(INTRO_CAT[cat] || "") : "Guías, proyectos y novedades sobre impresión 3D, materiales, diseño y cómo sacarle partido a tu marca.")}
<section>
  <div class="filter-row" role="navigation" aria-label="Categorías del blog">
    <a class="filter-btn" href="/blog/"${!cat ? ' aria-current="page"' : ""}>Todo</a>
    ${categorias.map((c) => `<a class="filter-btn" href="${rutaCat(c)}"${cat === c ? ' aria-current="page"' : ""}>${esc(c)}</a>`).join("")}
  </div>
  ${primero ? tarjetaPost(primero, true) : `<p class="cz-vacio">Pronto publicaremos el primer artículo${cat ? " en esta categoría" : ""}.</p>`}
  ${resto.length ? `<div class="blog-grid">${resto.map((a) => tarjetaPost(a)).join("")}</div>` : ""}
</section>`;
  return layout({
    sitio, ruta: cat ? rutaCat(cat) : "/blog/", actual: "blog",
    titulo: cat ? `${cat} sobre impresión 3D y diseño` : "Blog de impresión 3D y diseño",
    descripcion: cat ? `${INTRO_CAT[cat] || ""} Blog de ${sitio.nombre}, ${sitio.comuna}.`.trim()
      : `Guías, proyectos y novedades de ${sitio.nombre} sobre impresión 3D, materiales como PLA, PETG y resina, repuestos a medida, lámparas y diseño para tu marca.`,
    jsonld: [ldMigas(sitio, items)], cuerpo,
  });
}

export function paginaPost({ sitio, a, otros }) {
  const items = [["Inicio", "/"], ["Blog", "/blog/"], [a.categoria, rutaCat(a.categoria)], [a.titulo, null]];
  const base = sitio.url.replace(/\/$/, "");
  const abs = (u) => (u.startsWith("http") ? u : base + u);
  const ldPost = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: a.titulo, description: a.descripcion,
    datePublished: fechaISO(a.fecha), dateModified: fechaISO(a.actualizado || a.fecha),
    author: { "@type": "Organization", name: sitio.nombre, url: sitio.url },
    publisher: { "@type": "Organization", name: sitio.nombre, logo: { "@type": "ImageObject", url: abs("/brand/icono-512.png") } },
    mainEntityOfPage: `${base}/blog/${a.slug}/`, image: abs(a.portada || "/brand/compartir.jpg"),
    articleSection: a.categoria, inLanguage: "es-CL",
  };
  const cuerpo = `
<header class="page-hero">
  <div class="hero-grid-lines" aria-hidden="true"></div>
  ${migas(items)}
  <div class="post-meta" style="margin-bottom:1.5rem"><a href="${rutaCat(a.categoria)}" style="text-decoration:none">// ${esc(a.categoria)}</a><time datetime="${fechaISO(a.fecha)}">${fechaLarga(a.fecha)}</time><span>${a.minutos} min de lectura</span></div>
  <h1 class="section-title" style="max-width:20ch">${esc(a.titulo)}</h1>
  ${a.descripcion ? `<p class="section-desc">${esc(a.descripcion)}</p>` : ""}
</header>
<section style="padding-top:4rem">
  ${a.portada ? `<div class="article-cover fade-up"><img src="${esc(a.portada)}" alt="${esc(a.titulo)}"></div>` : ""}
  <div class="article-layout">
    <article class="prose">${a.html}</article>
    <aside class="aside-card">
      <p class="section-label" style="margin:0">// ${esc(sitio.nombre)}</p>
      <h3>¿Tienes una pieza o una idea en mente?</h3>
      <p>Cuéntanos qué necesitas y te ayudamos a definir el diseño, el material y el valor.</p>
      <a class="btn-primary" href="/cotizar/" style="text-align:center">Cotizar mi idea</a>
      <a class="btn-wa" href="${waLink(sitio, `Hola GXD Garage, leí "${a.titulo}" y quiero cotizar.`)}" ${ext} style="justify-content:center">${WA}WhatsApp</a>
    </aside>
  </div>
</section>
${otros.length ? `<section class="section-alt">
  ${cabecera("// sigue leyendo", "Más", "artículos")}
  <div class="blog-grid">${otros.map((o) => tarjetaPost(o)).join("")}</div>
</section>` : ""}`;
  return layout({
    sitio, ruta: `/blog/${a.slug}/`, actual: "blog", titulo: a.titulo, descripcion: a.descripcion,
    imagen: a.portada, tipo: "article", jsonld: [ldMigas(sitio, items), ldPost], cuerpo,
  });
}

export function rss({ sitio, posts }) {
  const base = sitio.url.replace(/\/$/, "");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(sitio.nombre)} · Blog</title>
<link>${base}/blog/</link>
<atom:link href="${base}/blog/rss.xml" rel="self" type="application/rss+xml"/>
<description>${esc(sitio.descripcion)}</description>
<language>es-cl</language>
${posts.slice(0, 30).map((a) => `<item>
<title>${esc(a.titulo)}</title>
<link>${base}/blog/${a.slug}/</link>
<guid>${base}/blog/${a.slug}/</guid>
<category>${esc(a.categoria)}</category>
<pubDate>${a.fecha.toUTCString()}</pubDate>
<description>${esc(a.descripcion)}</description>
</item>`).join("\n")}
</channel>
</rss>
`;
}

export function pagina404({ sitio }) {
  const cuerpo = `
<section class="nf">
  <p class="section-label">// error 404</p>
  <h1 class="hero-title">Esta página<br><em>no</em><br>existe</h1>
  <p class="hero-subtitle" style="margin-bottom:0">Puede que el enlace esté mal escrito o que el contenido se haya movido.</p>
  <div class="hero-actions"><a class="btn-primary" href="/">Volver al inicio</a><a class="btn-wa" href="/catalogo/">${WA}Ver catálogo</a></div>
</section>`;
  return layout({ sitio, ruta: "/404", titulo: "Página no encontrada", descripcion: "Esta página no existe.", cuerpo, noindex: true });
}
