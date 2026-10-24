// Plantillas HTML del sitio GXD Garage.
// Base visual: el diseño original de GXD (Bebas Neue + DM Mono + Instrument Serif, negro, verde WhatsApp).
// Cada función devuelve un string de HTML. No hay dependencias externas.

// ---------- categorías ----------
// Las tres líneas de servicio del diseño original; son también las pestañas del catálogo.
export const GRUPOS = [
  { nombre: "Impresión 3D", id: "tab-3d", abrev: "3D", ruta: "/impresion-3d/", clave: "3d" },
  { nombre: "Diseño gráfico", id: "tab-design", abrev: "DG", ruta: "/diseno-grafico/", clave: "diseno" },
  { nombre: "Impresión digital", id: "tab-print", abrev: "ID", ruta: "/impresion-digital/", clave: "digital" },
];
// Subcategorías de Impresión 3D (las mismas del panel). El orden define el orden de los filtros.
// Impresión 3D se ordena en tres secciones; el "tipo" (subcategoría) es opcional y sirve para filtros y grupos
export const SECCIONES_3D = [
  { nombre: "Repuestos para autos", id: "auto-a-medida", num: "01" },
  { nombre: "Productos", id: "productos", num: "02" },
  { nombre: "Hecho a medida", id: "a-medida", num: "03" },
];
const SECCION_POR_TIPO = {
  "Repuestos para autos": "Repuestos para autos", "Accesorios para autos": "Repuestos para autos",
  "Fidgets y juguetes": "Productos", "Lámparas y decoración": "Productos", "Llaveros NFC": "Productos",
  "Hogar y repuestos varios": "Hecho a medida", "Letreros y emblemas": "Hecho a medida", "Figuras y miniaturas": "Hecho a medida", "Prototipos y modelado": "Hecho a medida",
};
export const seccionPorDefecto = (p) => SECCION_POR_TIPO[p.subcategoria] || (p.tipo_venta === "En stock" ? "Productos" : "Hecho a medida");
const seccion3D = (nombre) => SECCIONES_3D.find((x) => x.nombre === nombre) || SECCIONES_3D[2];
export const SUBCATEGORIAS_3D = ["Repuestos para autos", "Accesorios para autos", "Fidgets y juguetes", "Lámparas y decoración", "Hogar y repuestos varios", "Llaveros NFC", "Letreros y emblemas", "Figuras y miniaturas", "Prototipos y modelado"];
// Colores de filamento disponibles en el panel y su muestra en pantalla
export const COLORES = {
  "Negro": "#121212", "Blanco": "#f2f2ee", "Gris": "#8a8a86", "Plateado": "#c4c6c8", "Rojo": "#c62828",
  "Naranjo": "#ef6c00", "Amarillo": "#f9c80e", "Verde": "#2e7d32", "Azul": "#1565c0", "Celeste": "#64b5f6",
  "Morado": "#6a1b9a", "Rosado": "#ec6fa8", "Café": "#6d4c41", "Dorado": "#c9a227", "Madera": "#a47148",
  "Transparente": "linear-gradient(135deg,rgba(255,255,255,.55),rgba(255,255,255,.08))",
  "Multicolor": "conic-gradient(#c62828,#f9c80e,#2e7d32,#1565c0,#6a1b9a,#c62828)",
};
export const urlProducto = (p) => GRUPOS.find((g) => g.nombre === p.categoria)?.ruta + p.slug + "/";
export const CATEGORIAS = GRUPOS.map((g) => g.nombre);
export const CATEGORIAS_BLOG = ["Guías", "Proyectos", "Novedades"];
export const SERVICIOS = ["Repuesto para auto", "Repuesto a medida", "Impresión 3D", "Lámparas y decoración", "Diseño gráfico", "Impresión digital", "Llaveros NFC", "Otro"];
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

let OPC = { mostrarPrecios: false, promo: null, hoy: new Date() };
export const fijarOpciones = (o) => { OPC = { ...OPC, ...o }; };
let VERSION = "1";
export const fijarVersion = (v) => { VERSION = v; };

// Precio: se muestra si el interruptor general está activo, si el producto lo pide ("Mostrar precio")
// o si es una pieza en stock con precio
export const precioTexto = (p) => {
  if (!(OPC.mostrarPrecios || p.precio_visible || p.tipo_venta === "En stock") || typeof p.precio !== "number" || !(p.precio > 0)) return null;
  return (p.precio_desde ? "Desde " : "") + pesos(p.precio);
};

// Oferta vigente de un producto (se revisa al publicar y otra vez en el navegador del visitante)
export const ofertaDe = (p) => {
  if (!p.oferta_activa || !(p.precio_oferta > 0)) return null;
  if (p.oferta_hasta && p.oferta_hasta < finDelDia(OPC.hoy, -1)) return null;
  return {
    ahora: pesos(p.precio_oferta),
    antes: p.precio > 0 && p.precio > p.precio_oferta ? pesos(p.precio) : null,
    texto: p.oferta_texto || "Oferta",
    detalle: p.oferta_detalle || "",
    hasta: p.oferta_hasta ? fechaISO(p.oferta_hasta) : "",
    hastaLarga: p.oferta_hasta ? fechaLarga(p.oferta_hasta) : "",
  };
};
// Disponibilidad de piezas en stock
export const disponibilidad = (p) => {
  if (p.tipo_venta !== "En stock") return p.categoria === "Impresión 3D" ? { txt: "Hecho a pedido", cls: "pedido" } : null;
  if (!(p.stock > 0)) return { txt: "Agotado", cls: "agotado", agotado: true };
  return { txt: p.stock > 5 ? "Disponible" : `Quedan ${p.stock}`, cls: "ok" };
};
const muestras = (colores, max = 6) => colores.length ? `<span class="swatches" aria-label="Colores: ${esc(colores.join(", "))}">${colores.slice(0, max).map((c) => `<span class="sw" style="background:${COLORES[c] || "#555"}" title="${esc(c)}"></span>`).join("")}${colores.length > max ? `<span class="sw-mas">+${colores.length - max}</span>` : ""}</span>` : "";

function finDelDia(d, dias = 0) { const x = new Date(d); x.setUTCDate(x.getUTCDate() + dias); x.setUTCHours(23, 59, 59, 999); return x; }

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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Montserrat:wght@400;500;600&display=swap">
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
    ${GRUPOS.map((g) => nav(g.ruta, g.nombre, g.clave)).join("\n    ")}
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
${popup(sitio, ruta)}
</body>
</html>`;
}

// Ventana promocional (se configura en contenido/promocion.json desde el panel)
function popup(sitio, ruta) {
  const pr = OPC.promo;
  if (!pr || !pr.activa || !pr.titulo) return "";
  if (pr.paginas === "Solo el inicio" && ruta !== "/") return "";
  if (pr.hasta && pr.hasta < finDelDia(OPC.hoy, -1)) return "";
  const id = slug(`${pr.titulo}-${pr.desde ? fechaISO(pr.desde) : ""}-${pr.hasta ? fechaISO(pr.hasta) : ""}`).slice(0, 60);
  const enlace = pr.boton_enlace || "";
  const esWa = !enlace || enlace === "whatsapp";
  const href = esWa ? waLink(sitio, pr.mensaje_whatsapp || `Hola GXD Garage, vi la promoción "${pr.titulo}" en la web.`) : enlace;
  const externo = esWa || /^https?:/.test(href);
  return `<div class="promo" data-promo="${esc(id)}" data-desde="${pr.desde ? fechaISO(pr.desde) : ""}" data-hasta="${pr.hasta ? fechaISO(pr.hasta) : ""}" data-retraso="${Math.max(0, Number(pr.retraso) || 0)}" data-frecuencia="${esc(pr.frecuencia || "Una vez")}" hidden>
  <div class="promo-fondo" data-promo-cerrar></div>
  <div class="promo-caja" role="dialog" aria-modal="true" aria-labelledby="promo-titulo">
    <button class="promo-x" type="button" data-promo-cerrar aria-label="Cerrar promoción">×</button>
    ${pr.imagen ? `<div class="promo-img"><img src="${esc(pr.imagen)}" alt=""></div>` : ""}
    <div class="promo-cuerpo">
      ${pr.etiqueta ? `<p class="section-label" style="margin:0">// ${esc(pr.etiqueta)}</p>` : ""}
      <h2 class="section-title" id="promo-titulo">${esc(pr.titulo)}${pr.titulo_cursiva ? `<br><em>${esc(pr.titulo_cursiva)}</em>` : ""}</h2>
      ${pr.texto ? `<p class="promo-texto">${esc(pr.texto)}</p>` : ""}
      <div class="hero-actions">
        <a class="${esWa ? "btn-wa" : "btn-primary"}" href="${esc(href)}"${externo ? ` ${ext}` : ""} data-promo-cta>${esWa ? WA : ""}${esc(pr.boton_texto || "Lo quiero")}</a>
        <button class="mini" type="button" data-promo-cerrar>Ahora no</button>
      </div>
      ${pr.hasta ? `<p class="fine">Válida hasta el ${esc(fechaLarga(pr.hasta))}.</p>` : ""}
    </div>
  </div>
</div>`;
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
    <ul>${GRUPOS.map((g) => `<li><a href="${g.ruta}">${esc(g.nombre)}</a></li>`).join("")}<li><a href="/impresion-3d/#auto-a-medida">Repuestos para autos</a></li></ul>
  </div>
  <div class="footer-col">
    <h4>Sitio</h4>
    <ul>
      <li><a href="/catalogo/">Catálogo completo</a></li>
      <li><a href="/cotizar/">Cotizar</a></li>
      <li><a href="/#portafolio">Portafolio</a></li>
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
  const disp = disponibilidad(p);
  const etiqueta = p.subcategoria || p.etiqueta;
  const buscar = [p.titulo, p.resumen, etiqueta, ...(p.compatibilidad || []), ...(p.colores || [])].join(" ").toLowerCase();
  const of = ofertaDe(p);
  const msg = of ? `Hola GXD Garage, quiero la oferta: *${p.titulo}* (${of.texto}, ${of.ahora})\n\nDetalles:` : `Hola GXD Garage, quiero cotizar: *${p.titulo}*\n\nDetalles:`;
  const normal = ref || of || disp?.cls === "ok" || disp?.agotado
    ? `<span class="product-price${ref ? "" : " cot"}${of ? " solo-normal" : ""}">${esc(ref || "A cotizar")}</span>`
    : `<span class="service-arrow${of ? " solo-normal" : ""}">Ver detalles →</span>`;
  const precio = of
    ? `<span class="product-price oferta solo-oferta">${of.antes ? `<s>${esc(of.antes)}</s>` : ""}${esc(of.ahora)}</span>${normal}`
    : normal;
  return `<article class="product-card fade-up${disp?.agotado ? " is-agotado" : ""}" data-sub="${esc(slug(p.subcategoria || ""))}"${disp?.cls === "ok" ? ' data-stock="1"' : ""} data-q="${esc(buscar)}"${of && of.hasta ? ` data-oferta-hasta="${of.hasta}"` : ""}>
  <a class="product-link" href="${urlProducto(p)}">
    <div class="product-img">${img ? `<img src="${esc(img)}" alt="${esc(p.titulo)} - ${esc(sitio.nombre)}" loading="lazy">` : `<div class="product-img-placeholder">${g.abrev}</div>`}${of ? `<span class="badge-oferta solo-oferta">${esc(of.texto)}</span>` : ""}${disp && disp.cls !== "pedido" ? `<span class="badge-stock ${disp.cls}">${esc(disp.txt)}</span>` : ""}</div>
    <div class="product-body">
      <span class="product-cat">${esc(g.nombre)}${etiqueta ? ` · ${esc(etiqueta)}` : ""}</span>
      <h3 class="product-name">${esc(p.titulo)}</h3>
      ${p.compatibilidad?.length ? `<p class="compat">Para: ${esc(p.compatibilidad.slice(0, 2).join(" · "))}${p.compatibilidad.length > 2 ? " y más" : ""}</p>` : ""}
      <p class="product-desc">${esc(p.resumen)}</p>
      ${muestras(p.colores || [])}
    </div>
  </a>
  <div class="product-footer">
    ${precio}
    <a class="btn-wa-product" href="${waLink(sitio, msg)}" ${ext}>${WA}${disp?.cls === "ok" || ref || of ? "Pedir" : "Cotizar"}</a>
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
  const marcados = productos.filter((p) => p.destacado);
  const destacados = (marcados.length ? marcados : productos).slice(0, 6);
  const marquee = ["Impresión 3D", "Diseño Gráfico", "Impresión Digital", "Repuestos a medida", "Lámparas", "Prototipos", "Branding", "Llaveros NFC", "Innovación capa por capa"];
  const catsPorta = GRUPOS.map((g) => g.nombre).filter((c) => portafolio.some((w) => w.categoria === c));
  const cuerpo = `
<section id="hero">
  <div class="hero-left">
    <div class="hero-tag">${esc(sitio.slogan)}</div>
    <h1 class="hero-title">Creamos<br><em>lo que</em><br>imaginas</h1>
    <p class="hero-subtitle">Impresión 3D, diseño gráfico e impresión digital en ${esc(sitio.comuna)}. Transformamos tus ideas en objetos reales: repuestos que ya no venden, lámparas, regalos y la identidad de tu marca.</p>
    <div class="hero-actions">
      <a href="/impresion-3d/" class="btn-primary">Ver Impresión 3D</a>
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
      <p class="service-desc">Nuestro fuerte: <b>repuestos para autos a medida</b>. Además, piezas en stock, fidgets, lámparas, prototipos y piezas personalizadas en PLA, PETG o resina.</p>
      <a href="/impresion-3d/" class="service-arrow">Ver Impresión 3D →</a>
    </article>
    <article class="service-card fade-up">
      <div class="service-num">02</div>
      ${ICONO["Diseño gráfico"]}
      <h3 class="service-name">Diseño Gráfico</h3>
      <p class="service-desc">Identidad visual, logotipos, packaging y piezas para redes sociales. Diseño estratégico que conecta tu marca con tu audiencia.</p>
      <a href="/diseno-grafico/" class="service-arrow">Ver Diseño gráfico →</a>
    </article>
    <article class="service-card fade-up">
      <div class="service-num">03</div>
      ${ICONO["Impresión digital"]}
      <h3 class="service-name">Impresión Digital</h3>
      <p class="service-desc">Stickers, vinilos adhesivos, banners y material impreso con colores vibrantes y acabados profesionales para tu negocio o tu evento.</p>
      <a href="/impresion-digital/" class="service-arrow">Ver Impresión digital →</a>
    </article>
  </div>
</section>

<div class="section-divider"></div>

<section id="destacados" class="section-alt">
  ${cabecera("// 02 — destacados", "Lo más", "pedido", "Una selección de lo que hacemos. Cada línea tiene su página con todo el detalle.")}
  <div class="catalog-panel active">${destacados.map((p) => tarjetaProducto(sitio, p)).join("")}</div>
  <div class="catalog-more">${GRUPOS.map((g) => `<a href="${g.ruta}" class="btn-primary">${esc(g.nombre)} →</a>`).join("")}</div>
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
    ${contactoInfo(sitio, `Estamos en ${esc(sitio.comuna)} y listos para fabricar tu proyecto. Ya sea una pieza única en 3D, la identidad de tu marca o material impreso, en ${esc(sitio.nombre)} lo hacemos realidad.`)}
    ${formContacto(sitio)}
  </div>
</section>`;
  return layout({ sitio, ruta: "/", titulo: "Impresión 3D, diseño gráfico e impresión digital en Talagante", descripcion: sitio.descripcion, jsonld: [ldNegocio(sitio)], cuerpo });
}

// ---------- bloque de repuestos para autos (siempre presente en Impresión 3D) ----------
const EJEMPLOS_AUTO = ["Clips y grapas de tapiz", "Tapas y embellecedores", "Perillas y botones", "Soportes y bases", "Rejillas de ventilación", "Piezas descontinuadas"];
export function bloqueAuto(sitio, compacto = false, piezas = []) {
  const msg = "Hola GXD Garage, necesito un repuesto para mi auto.\n\n• Marca y modelo:\n• Año:\n• Pieza:";
  if (compacto) return `<section class="strip-sec" aria-labelledby="auto-strip-t">
  <div class="auto-strip fade-up">
  <div class="auto-strip-txt">
    <p class="section-label">// repuestos para autos a medida</p>
    <h2 class="section-title" id="auto-strip-t">¿Buscas una pieza <em>para tu auto?</em></h2>
    <p>Clips, tapas, perillas o soportes que ya no venden. Tráenos la pieza original, como sea que esté, y la fabricamos en 3D.</p>
  </div>
  <div class="hero-actions">
    <a class="btn-primary" href="/impresion-3d/#auto-a-medida">Cotizar mi repuesto</a>
    <a class="btn-wa" href="${waLink(sitio, msg)}" ${ext}>${WA}WhatsApp</a>
  </div>
  </div>
</section>`;
  return `<section id="auto-a-medida" class="auto-block">
  ${cabecera("// 01 — repuestos para autos", "Repuestos para autos", "a medida", "Esa pieza plástica que ya no venden o que cuesta encontrar. Tráenos la original, como sea que esté, y la fabricamos en 3D.")}
  <div class="auto-layout">
    <div class="auto-info fade-up">
      <ul class="auto-chips" aria-label="Ejemplos de piezas">${EJEMPLOS_AUTO.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>
      <ol class="cz-steps">
        <li><span><b>Trae la pieza, como sea que esté.</b> Rota, incompleta o en partes: tenerla en la mano es lo que más nos ayuda. Si no puedes, envíanos fotos con una regla al lado.</span></li>
        <li><span><b>Cotizamos el diseño.</b> Su valor depende de la complejidad de la pieza.</span></li>
        <li><span><b>Con el diseño listo,</b> te damos el valor de la impresión según el material y la cantidad.</span></li>
      </ol>
      <p class="fine">Elegimos el material según dónde va la pieza: dentro del auto, al sol o cerca del calor.</p>
    </div>
    <form class="contact-form auto-form fade-up" id="auto-form" novalidate>
      <div class="form-row tres">
        <div class="form-group"><label for="auto-marca">Marca</label><input id="auto-marca" name="marca" type="text" placeholder="Ej.: Toyota" autocomplete="off"></div>
        <div class="form-group"><label for="auto-modelo">Modelo</label><input id="auto-modelo" name="modelo" type="text" placeholder="Ej.: Yaris" autocomplete="off"></div>
        <div class="form-group"><label for="auto-anio">Año</label><input id="auto-anio" name="anio" type="text" inputmode="numeric" maxlength="4" placeholder="Ej.: 2012" autocomplete="off"></div>
      </div>
      <div class="form-group"><label for="auto-pieza">¿Qué pieza necesitas?</label><textarea id="auto-pieza" name="pieza" placeholder="Ej.: El clip que sujeta el tapiz de la puerta del conductor. Se quebró y no lo encuentro."></textarea></div>
      <div class="form-group">
        <span class="section-label" id="auto-tengo-l" style="margin-bottom:0.25rem">¿Tienes la pieza original?</span>
        <div class="choices" role="radiogroup" aria-labelledby="auto-tengo-l">
          <label class="choice"><input type="radio" name="tengo" value="Tengo la pieza original (aunque esté rota)" checked>Sí, la tengo</label>
          <label class="choice"><input type="radio" name="tengo" value="Tengo fotos de la pieza">Solo fotos</label>
        </div>
      </div>
      <div class="form-group"><label for="auto-nombre">Tu nombre</label><input id="auto-nombre" name="nombre" type="text" autocomplete="name" placeholder="Tu nombre"></div>
      <p class="cz-error" id="auto-error" role="alert" hidden></p>
      <button type="submit" class="btn-submit">${WA}Cotizar por WhatsApp</button>
      <p class="form-hint">Después puedes enviar fotos de la pieza en el mismo chat.</p>
    </form>
  </div>
  ${piezas.length ? `<div class="sub-bloque">
    <div class="sub-head"><h3>Piezas para autos</h3><p>Listas para pedir en el color que elijas.</p></div>
    <div class="catalog-panel active">${piezas.map((p) => tarjetaProducto(sitio, p)).join("")}</div>
  </div>` : ""}
</section>`;
}

// Formulario de contacto (inicio y páginas de servicio) → WhatsApp
const formContacto = (sitio, pre = "") => `<form class="contact-form fade-up" id="contacto-form" novalidate>
      <div class="form-row">
        <div class="form-group"><label for="nombre">Nombre</label><input type="text" id="nombre" name="nombre" placeholder="Tu nombre" autocomplete="name"></div>
        <div class="form-group"><label for="servicio">Servicio</label>
          <select id="servicio" name="servicio"><option value="">Seleccionar servicio...</option>${SERVICIOS.map((s) => `<option${s === pre ? " selected" : ""}>${esc(s)}</option>`).join("")}</select></div>
      </div>
      <div class="form-group"><label for="tengo">¿Qué tienes para partir?</label>
        <select id="tengo" name="tengo">${(pre === "Diseño gráfico" || pre === "Impresión digital"
          ? ["Tengo mi logo o diseño listo", "Tengo referencias o bocetos", "Solo tengo la idea"]
          : ["Tengo la pieza física", "Tengo fotos de referencia", "Tengo un archivo 3D o de diseño", "Solo tengo la idea"]).map((o) => `<option>${o}</option>`).join("")}</select></div>
      <div class="form-group"><label for="mensaje">Mensaje</label><textarea id="mensaje" name="mensaje" placeholder="Cuéntanos sobre tu proyecto..."></textarea></div>
      <p class="cz-error" id="contacto-error" role="alert" hidden></p>
      <button type="submit" class="btn-submit">${WA}Enviar por WhatsApp →</button>
      <p class="form-hint">¿Varios productos? <a href="/cotizar/">Arma tu cotización completa →</a></p>
    </form>`;

const contactoInfo = (sitio, texto) => `<div class="contact-info fade-up">
      <h3>Trabajemos juntos</h3>
      <p>${texto}</p>
      <div class="contact-links">
        <a href="https://www.instagram.com/${esc(sitio.instagram)}/" class="contact-link" ${ext}>${ICONO_CONTACTO.ig}@${esc(sitio.instagram)}</a>
        <a href="${waLink(sitio)}" class="contact-link" ${ext}>${ICONO_CONTACTO.wa}WhatsApp ${esc(sitio.whatsapp_visible)}<span class="mini copy" data-copy="+${esc(sitio.whatsapp)}" role="button" tabindex="0">Copiar</span></a>
        <a href="${mapa(sitio)}" class="contact-link" ${ext}>${ICONO_CONTACTO.pin}${esc(sitio.direccion)}, ${esc(sitio.comuna)}</a>
      </div>
    </div>`;

const ldLista = (sitio, lista) => ({
  "@context": "https://schema.org", "@type": "ItemList",
  itemListElement: lista.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: sitio.url.replace(/\/$/, "") + urlProducto(p), name: p.titulo })),
});

const portafolioDe = (portafolio, cat, label) => {
  const lista = portafolio.filter((w) => w.categoria === cat);
  return lista.length ? `<section>
  ${cabecera(label, "Salido del", "taller", "Trabajos reales que hicimos para nuestros clientes.")}
  <div class="portfolio-grid tres">${lista.map(tarjetaPortafolio).join("")}</div>
</section>` : "";
};

// ---------- Impresión 3D ----------
export function paginaImpresion3D({ sitio, productos, portafolio, posts = [] }) {
  const g = GRUPOS[0];
  const items = [["Inicio", "/"], [g.nombre, null]];
  const lista = productos.filter((p) => p.categoria === g.nombre);
  const de = (n) => lista.filter((p) => p.seccion === n);
  const autos = de("Repuestos para autos"), prods = de("Productos"), medida = de("Hecho a medida");
  // filtros y buscador solo cuando hay suficientes productos para que sirvan
  const subs = SUBCATEGORIAS_3D.filter((t) => prods.some((p) => p.subcategoria === t));
  const conFiltros = prods.length >= 6 && subs.length >= 2;
  const conBuscador = prods.length >= 8;
  const conStock = prods.some((p) => disponibilidad(p)?.cls === "ok") && prods.some((p) => disponibilidad(p)?.cls !== "ok");
  const marca = medida.filter((p) => p.subcategoria === "Letreros y emblemas");
  const proyecto = medida.filter((p) => p.subcategoria !== "Letreros y emblemas");
  const guia = posts.find((a) => a.slug === "pla-petg-o-resina");
  const port = portafolio.filter((w) => w.categoria === g.nombre);
  const secciones = [
    ["Repuestos para autos", "auto-a-medida", "01"],
    ...(prods.length ? [["Productos", "productos", "02"]] : []),
    ...(medida.length ? [["Hecho a medida", "a-medida", prods.length ? "03" : "02"]] : []),
    ["Materiales", "materiales", ""],
    ...(port.length ? [["Trabajos", "trabajos", ""]] : []),
  ];
  const grupoMedida = (titulo, desc, arr) => arr.length ? `<div class="sub-bloque">
    <div class="sub-head"><h3>${esc(titulo)}</h3><p>${esc(desc)}</p></div>
    <div class="catalog-panel active">${arr.map((p) => tarjetaProducto(sitio, p)).join("")}</div>
  </div>` : "";
  const cuerpo = `
${heroInterior(items, "// impresión 3d", "Impresión", "3D",
    `Repuestos para autos a medida, productos en el color que elijas y piezas hechas a medida en ${esc(sitio.comuna)}. Todo impreso capa por capa y cotizado por WhatsApp.`,
    `<div class="hero-actions" style="margin-top:2.5rem"><a class="btn-primary" href="#auto-a-medida">Repuesto para mi auto</a><a class="btn-line" href="#${prods.length ? "productos" : "a-medida"}">Ver productos</a></div>`)}
<div class="subnav" role="navigation" aria-label="Secciones de Impresión 3D">
  <div class="subnav-in">${secciones.map(([t, id, n]) => `<a href="#${id}" data-subnav="${id}">${n ? `<span>${n}</span>` : ""}${esc(t)}</a>`).join("")}</div>
</div>
${bloqueAuto(sitio, false, autos)}
${prods.length ? `<section id="productos" class="section-alt">
  ${cabecera(`// 02 — productos`, "Elige tu", "color", "Productos listos para pedir. Los que dicen “Disponible” están en stock; el resto lo fabricamos a pedido en el color que elijas.")}
  ${conFiltros || conBuscador || conStock ? `<div class="tienda-bar fade-up">
    ${conFiltros ? `<div class="filter-row chips" role="group" aria-label="Filtrar por tipo de producto">
      <button class="filter-btn active" type="button" data-sub="" aria-pressed="true">Todo <span class="n">${prods.length}</span></button>
      ${subs.map((t) => `<button class="filter-btn" type="button" data-sub="${esc(slug(t))}" aria-pressed="false">${esc(t)} <span class="n">${prods.filter((p) => p.subcategoria === t).length}</span></button>`).join("")}
    </div>` : ""}
    ${conBuscador || conStock ? `<div class="tienda-tools">
      ${conBuscador ? `<div class="form-group tienda-search"><label for="buscar3d">Buscar</label><input id="buscar3d" type="search" placeholder="Lámpara, llavero, fidget..." data-buscar autocomplete="off"></div>` : "<span></span>"}
      ${conStock ? `<label class="choice solo-stock"><input type="checkbox" data-solo-stock>Solo en stock</label>` : ""}
    </div>` : ""}
  </div>` : ""}
  <div class="catalog-panel active" data-tienda>${prods.map((p) => tarjetaProducto(sitio, p)).join("")}</div>
  <p class="cz-vacio tienda-vacio" data-tienda-vacio hidden>No encontramos productos con ese filtro. <a href="#a-medida">Revisa lo que hacemos a medida</a> o escríbenos.</p>
</section>` : ""}
${medida.length ? `<section id="a-medida"${prods.length ? "" : ' class="section-alt"'}>
  ${cabecera(`// ${prods.length ? "03" : "02"} — hecho a medida`, "Hecho", "a medida", "Lo diseñamos y fabricamos para ti. Primero cotizamos el diseño y, con el diseño listo, la impresión.")}
  ${grupoMedida("Para tu marca o institución", "Letreros, emblemas y escudos con tu logo en relieve.", marca)}
  ${grupoMedida("Para tu proyecto", "Modelado, prototipos, figuras y repuestos para el hogar.", proyecto)}
</section>` : ""}
<section id="materiales" class="section-alt">
  ${cabecera("// materiales", "PLA, PETG", "o resina", "Te recomendamos el material según dónde va la pieza y cuánto esfuerzo tiene que aguantar.")}
  <div class="services-grid">
    <article class="service-card fade-up"><div class="service-num">PLA</div><h3 class="service-name">Uso general</h3><p class="service-desc">Rígido y con buen acabado. Para decoración, lámparas, figuras, letreros y piezas de interior.</p></article>
    <article class="service-card fade-up"><div class="service-num">PETG</div><h3 class="service-name">Piezas que aguantan</h3><p class="service-desc">Más tenaz y resistente al calor y la humedad. Para piezas del auto, de exterior o que soportan esfuerzo.</p></article>
    <article class="service-card fade-up"><div class="service-num">Resina</div><h3 class="service-name">Máximo detalle</h3><p class="service-desc">Superficie lisa y detalles finos. Para miniaturas, figuras y piezas pequeñas de precisión.</p></article>
  </div>
  ${guia ? `<div class="catalog-more"><a href="/blog/${guia.slug}/" class="btn-primary">Leer la guía de materiales</a></div>` : ""}
</section>
${port.length ? `<section id="trabajos">
  ${cabecera("// trabajos 3d", "Salido del", "taller", "Trabajos reales que hicimos para nuestros clientes.")}
  <div class="portfolio-grid tres">${port.map(tarjetaPortafolio).join("")}</div>
</section>` : ""}
<section class="section-alt">
  ${cabecera("// ¿algo distinto?", "¿No está", "lo que buscas?", "Lo diseñamos desde cero. Cuéntanos tu idea y te enviamos una propuesta.")}
  <div class="hero-actions fade-up"><a class="btn-primary" href="/cotizar/">Cotizar mi idea</a><a class="btn-wa" href="${waLink(sitio, "Hola GXD Garage, quiero cotizar una impresión 3D.")}" ${ext}>${WA}Escribir por WhatsApp</a></div>
</section>`;
  return layout({
    sitio, ruta: g.ruta, actual: g.clave, titulo: `Impresión 3D en ${sitio.comuna}: repuestos para autos a medida`,
    descripcion: `Impresión 3D en ${sitio.comuna}: repuestos para autos a medida, emblemas, lámparas, llaveros NFC, letreros y escudos en relieve, prototipos y modelado 3D. Cotiza por WhatsApp.`,
    jsonld: [ldMigas(sitio, items), ldLista(sitio, lista)], cuerpo,
  });
}

// ---------- Diseño gráfico e Impresión digital ----------
const INFO_GRUPO = {
  "Diseño gráfico": {
    t1: "Diseño", t2: "gráfico",
    desc: "Identidad visual, logotipos, packaging y piezas para redes sociales. Diseño estratégico que conecta tu marca con tu audiencia.",
    seo: "Diseño gráfico en Talagante: logos, identidad visual y packaging",
    seoDesc: (s) => `Diseño gráfico en ${s.comuna}: logotipos, identidad visual, tarjetas de presentación, packaging y piezas para redes sociales. Cotiza tu proyecto por WhatsApp.`,
    productos: ["Lo que", "diseñamos"],
    pasos: [
      ["Conversamos tu marca", "Qué haces, a quién le vendes y qué referencias te gustan. Si ya tienes logo o colores, partimos de ahí."],
      ["Propuesta y ajustes", "Te mostramos la propuesta y la ajustamos contigo hasta que represente bien a tu marca."],
      ["Archivos listos para usar", "Te entregamos los archivos para redes y para imprimir. Si quieres, también los imprimimos: stickers, tarjetas o letreros 3D."],
    ],
    cruce: { t: "Tu marca, también impresa", d: "Llevamos tu diseño a stickers, vinilos y banners, o a un letrero o emblema en 3D.", links: [["/impresion-digital/", "Impresión digital"], ["/impresion-3d/letrero-3d/", "Letreros 3D"]] },
    contacto: "Cuéntanos sobre tu marca o tu proyecto. Te respondemos por WhatsApp con una propuesta y el valor del diseño.",
  },
  "Impresión digital": {
    t1: "Impresión", t2: "digital",
    desc: "Stickers, vinilos adhesivos, banners y pendones con colores vibrantes y acabados profesionales para tu negocio o tu evento.",
    seo: "Impresión digital en Talagante: stickers, vinilos y banners",
    seoDesc: (s) => `Impresión digital en ${s.comuna}: stickers personalizados, vinilo adhesivo, banners y pendones para tu negocio o evento. Cotiza por WhatsApp.`,
    productos: ["Lo que", "imprimimos"],
    pasos: [
      ["Envíanos tu diseño o tu idea", "Si ya tienes el archivo, lo revisamos. Si no, lo diseñamos: primero cotizamos el diseño."],
      ["Cotizamos medida y cantidad", "El valor depende del tamaño, el material y la cantidad. Te lo confirmamos antes de imprimir."],
      ["Imprimimos y entregamos", "Te avisamos cuando esté listo y coordinamos la entrega."],
    ],
    cruce: { t: "¿Aún no tienes diseño?", d: "Creamos tu logo y tus piezas gráficas, y las dejamos listas para imprimir.", links: [["/diseno-grafico/", "Diseño gráfico"], ["/cotizar/", "Cotizar"]] },
    contacto: "Cuéntanos qué necesitas imprimir, la medida aproximada y la cantidad. Te respondemos por WhatsApp.",
  },
};

export function paginaGrupo({ sitio, g, productos, portafolio }) {
  const info = INFO_GRUPO[g.nombre];
  const items = [["Inicio", "/"], [g.nombre, null]];
  const lista = productos.filter((p) => p.categoria === g.nombre);
  const cuerpo = `
${heroInterior(items, `// ${g.nombre.toLowerCase()}`, info.t1, info.t2, esc(info.desc),
    `<div class="hero-actions" style="margin-top:2.5rem"><a class="btn-primary" href="#contacto">Cotizar mi proyecto</a><a class="btn-wa" href="${waLink(sitio, `Hola GXD Garage, quiero cotizar ${g.nombre.toLowerCase()}.`)}" ${ext}>${WA}WhatsApp</a></div>`)}
${lista.length ? `<section id="productos" class="section-alt">
  ${cabecera("// servicios", info.productos[0], info.productos[1], "Todo se hace a pedido. Elige lo que necesitas y te respondemos con una propuesta.")}
  <div class="catalog-panel active">${lista.map((p) => tarjetaProducto(sitio, p)).join("")}</div>
</section>` : ""}
<section id="proceso">
  ${cabecera("// cómo trabajamos", "Paso", "a paso")}
  <div class="services-grid process-grid">${info.pasos.map(([t, d], i) => `
    <article class="service-card fade-up"><div class="service-num">0${i + 1}</div><h3 class="service-name">${esc(t)}</h3><p class="service-desc">${esc(d)}</p></article>`).join("")}
  </div>
</section>
${portafolioDe(portafolio, g.nombre, `// trabajos de ${g.nombre.toLowerCase()}`)}
<section class="strip-sec section-alt">
  <div class="auto-strip fade-up">
    <div class="auto-strip-txt"><p class="section-label">// también hacemos</p><h2 class="section-title">${esc(info.cruce.t)}</h2><p>${esc(info.cruce.d)}</p></div>
    <div class="hero-actions">${info.cruce.links.map(([h, t], i) => `<a class="${i ? "mini" : "btn-primary"}" href="${h}">${esc(t)}${i ? " →" : ""}</a>`).join("")}</div>
  </div>
</section>
<section id="contacto">
  ${cabecera("// hablemos", "¿Tienes un", "proyecto?", "Cotizamos sin compromiso. Te respondemos por WhatsApp.")}
  <div class="contact-layout">
    ${contactoInfo(sitio, esc(info.contacto))}
    ${formContacto(sitio, g.nombre)}
  </div>
</section>`;
  return layout({
    sitio, ruta: g.ruta, actual: g.clave, titulo: info.seo, descripcion: info.seoDesc(sitio),
    jsonld: [ldMigas(sitio, items), ...(lista.length ? [ldLista(sitio, lista)] : [])], cuerpo,
  });
}

// ---------- catálogo completo ----------
export function paginaCatalogo({ sitio, productos }) {
  const items = [["Inicio", "/"], ["Catálogo", null]];
  const grupos = GRUPOS.filter((g) => productos.some((p) => p.categoria === g.nombre));
  const cuerpo = `
${heroInterior(items, "// catálogo completo", "Todo lo", "que hacemos", `Impresión 3D, diseño gráfico e impresión digital en ${esc(sitio.comuna)}, en una sola página. Agrega lo que te interese a tu cotización o escríbenos directo por WhatsApp.`)}
<section>
  <div class="filter-row" role="navigation" aria-label="Líneas de servicio">
    ${grupos.map((g) => `<a class="filter-btn" href="#${g.id}">${esc(g.nombre)}</a>`).join("")}
  </div>
  ${grupos.map((g, i) => {
    const lista = productos.filter((p) => p.categoria === g.nombre);
    return `<div id="${g.id}" style="scroll-margin-top:110px;${i ? "margin-top:6rem" : ""}">
    <div class="grupo-head"><p class="section-label">// 0${i + 1} — ${esc(g.nombre.toLowerCase())}</p><a class="service-arrow" href="${g.ruta}">Ir a ${esc(g.nombre)} →</a></div>
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
    descripcion: `Catálogo completo de ${sitio.nombre}: repuestos para autos a medida, impresión 3D, logos, stickers, vinilos y llaveros NFC en ${sitio.comuna}. Cotiza por WhatsApp.`,
    jsonld: [ldMigas(sitio, items), ldLista(sitio, productos)], cuerpo,
  });
}

// ---------- ficha de producto ----------
const mensajeProducto = (p, url, { color = "", cant = 1, of = null, stock = false } = {}) => {
  const l = [of ? `Hola GXD Garage, quiero la oferta: *${p.titulo}* (${of.texto}, ${of.ahora})` : `Hola GXD Garage, quiero ${stock ? "pedir" : "cotizar"}: *${p.titulo}*`];
  if (color) l.push(`• Color: ${color}`);
  l.push(`• Cantidad: ${cant}`);
  l.push(url, "", "Detalles:");
  return l.join("\n");
};

export function paginaProducto({ sitio, p, relacionados }) {
  const g = grupo(p.categoria);
  const es3D = g.clave === "3d";
  const sec = es3D ? seccion3D(p.seccion) : null;
  const items = [["Inicio", "/"], [g.nombre, g.ruta], ...(sec ? [[sec.nombre, `${g.ruta}#${sec.id}`]] : []), [p.titulo, null]];
  const base = sitio.url.replace(/\/$/, "");
  const abs = (u) => (u.startsWith("http") ? u : base + u);
  const url = base + urlProducto(p);
  const ref = precioTexto(p);
  const of = ofertaDe(p);
  const disp = disponibilidad(p);
  const enStock = disp?.cls === "ok";
  const agotado = disp?.agotado === true;
  const colores = p.colores || [];
  const ldServ = {
    "@context": "https://schema.org", "@type": p.tipo_venta === "En stock" ? "Product" : "Service",
    name: p.titulo, description: p.resumen, url,
    ...(p.tipo_venta === "En stock" ? { category: p.subcategoria || g.nombre, ...(colores.length ? { color: colores.join(", ") } : {}), brand: { "@type": "Brand", name: sitio.nombre } }
      : { serviceType: g.nombre, provider: { "@type": "LocalBusiness", name: sitio.nombre, telephone: "+" + sitio.whatsapp,
        address: { "@type": "PostalAddress", streetAddress: sitio.direccion, addressLocality: sitio.comuna, addressRegion: sitio.region, addressCountry: "CL" } },
        areaServed: [{ "@type": "City", name: sitio.comuna }, { "@type": "AdministrativeArea", name: sitio.region }] }),
    ...(p.imagenes.length ? { image: p.imagenes.map(abs) } : {}),
    ...(of ? { offers: { "@type": "Offer", priceCurrency: "CLP", price: p.precio_oferta, url, ...(of.hasta ? { priceValidUntil: of.hasta } : {}) } }
      : p.tipo_venta === "En stock" && ref && p.precio > 0 ? { offers: { "@type": "Offer", priceCurrency: "CLP", price: p.precio, url, availability: agotado ? "https://schema.org/OutOfStock" : "https://schema.org/InStock" } } : {}),
  };
  const galeria = p.imagenes.length
    ? `<div class="gallery-main"><img id="foto" src="${esc(p.imagenes[0])}" alt="${esc(p.titulo)}"></div>
       ${p.imagenes.length > 1 ? `<div class="thumbs">${p.imagenes.map((src, i) => `<button class="thumb" type="button" data-src="${esc(src)}" aria-label="Ver foto ${i + 1}" aria-current="${i === 0}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}`
    : `<div class="gallery-main"><div class="product-img-placeholder" style="font-size:7rem">${g.abrev}</div></div>`;
  const selector = colores.length ? `<fieldset class="color-pick">
        <legend>Color: <b data-color-nombre>${esc(colores[0])}</b>${colores.length > 1 ? ` <span>· ${colores.length} disponibles</span>` : ""}</legend>
        <div class="sw-pick">${colores.map((c, i) => `<label class="swp" title="${esc(c)}"><input type="radio" name="color" value="${esc(c)}"${i === 0 ? " checked" : ""}><span class="swp-c" style="background:${COLORES[c] || "#555"}"></span><span class="sr-only">${esc(c)}</span></label>`).join("")}</div>
      </fieldset>` : "";
  const ruta = urlProducto(p);
  const waMsg = agotado ? `Hola GXD Garage, quiero que me avisen cuando vuelva a haber stock de: *${p.titulo}*${colores.length ? `\n• Color: ${colores[0]}` : ""}\n${url}`
    : mensajeProducto(p, url, { color: colores[0] || "", of, stock: enStock });
  const cuerpo = `
<header class="page-hero" style="padding-bottom:2rem">${migas(items)}</header>
<section style="padding-top:4rem">
  <div class="prod-detail">
    <div class="fade-up">${galeria}</div>
    <div class="prod-info" data-producto data-titulo="${esc(p.titulo)}" data-url="${esc(url)}" data-oferta="${of ? esc(`${of.texto}, ${of.ahora}`) : ""}" data-modo="${agotado ? "avisar" : enStock ? "pedir" : "cotizar"}">
      <span class="product-cat">${esc(g.nombre)}${p.subcategoria || p.etiqueta ? ` · ${esc(p.subcategoria || p.etiqueta)}` : ""}</span>
      <h1 class="section-title">${esc(p.titulo)}</h1>
      ${disp ? `<p class="estado ${disp.cls}"><span class="dot"></span>${esc(disp.txt)}${disp.cls === "pedido" ? " · lo fabricamos en el color que elijas" : ""}</p>` : ""}
      ${p.resumen ? `<p class="lead">${esc(p.resumen)}</p>` : ""}
      ${p.compatibilidad?.length ? `<div class="compat-box"><span class="product-cat">Compatible con</span><ul>${p.compatibilidad.map((c) => `<li>${esc(c)}</li>`).join("")}</ul></div>` : ""}
      ${of ? `<div class="offer-box solo-oferta"${of.hasta ? ` data-oferta-hasta="${of.hasta}"` : ""}>
        <span class="badge-oferta">${esc(of.texto)}</span>
        <p class="ref-price">${of.antes ? `<s>${esc(of.antes)}</s>` : ""}${esc(of.ahora)}</p>
        ${of.detalle ? `<p class="lead">${esc(of.detalle)}</p>` : ""}
        ${of.hastaLarga ? `<p class="fine">Válida hasta el ${esc(of.hastaLarga)}.</p>` : ""}
      </div>` : ""}
      ${ref ? `<p class="ref-price${of ? " solo-normal" : ""}"><small>${enStock || agotado ? "Precio" : "Valor de referencia"}</small>${esc(ref)}</p>` : ""}
      ${selector}
      <div class="quote-box">
        ${agotado ? `<p class="agotado-txt">Por ahora no nos queda stock. Te avisamos cuando vuelva, o lo fabricamos a pedido.</p>`
          : `<div class="form-group"><label for="cant">Cantidad</label><input id="cant" type="number" min="1" max="${enStock ? p.stock : 9999}" value="1" inputmode="numeric"></div>
        <button class="btn-primary" type="button" data-add data-slug="${esc(p.slug)}" data-titulo="${esc(p.titulo)}" data-url="${esc(ruta.slice(1))}">Agregar a mi cotización</button>`}
      </div>
      <p class="added" data-added hidden>Agregado a tu cotización. <a href="/cotizar/">Ver mi cotización →</a></p>
      <a class="btn-wa" style="align-self:flex-start" data-wa-producto href="${waLink(sitio, waMsg)}" ${ext}>${WA}${agotado ? "Avísame cuando vuelva" : of ? "Pedir esta oferta por WhatsApp" : enStock ? "Pedir por WhatsApp" : "Cotizar directo por WhatsApp"}</a>
      ${p.detalles.length ? `<ul class="spec-list">${p.detalles.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>` : ""}
      <p class="fine">${enStock || agotado ? "Coordinamos el pago y la entrega por WhatsApp. Los colores pueden variar levemente con respecto a la foto."
        : "Cada pieza se fabrica a pedido. El valor depende de la complejidad del diseño, el tamaño, el material y la cantidad, y te lo confirmamos en la cotización."}</p>
    </div>
  </div>
  ${p.html.trim() ? `<div class="prose fade-up" style="margin-top:6rem">${p.html}</div>` : ""}
</section>
${es3D ? bloqueAuto(sitio, true) : ""}
${relacionados.length ? `<section class="section-alt">
  ${cabecera("// también te puede servir", "Más de", esc(g.nombre))}
  <div class="catalog-panel active">${relacionados.map((r) => tarjetaProducto(sitio, r)).join("")}</div>
  <div class="catalog-more"><a href="${g.ruta}" class="btn-primary">Ver todo ${esc(g.nombre)}</a></div>
</section>` : ""}`;
  return layout({
    sitio, ruta, actual: g.clave, titulo: p.titulo,
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
        <p class="cz-vacio" id="cz-vacio">Todavía no agregas productos. Puedes elegirlos en <a href="/impresion-3d/">Impresión 3D</a>, <a href="/diseno-grafico/">Diseño gráfico</a> o <a href="/impresion-digital/">Impresión digital</a>, o describir tu idea abajo.</p>
      </fieldset>
      <fieldset class="cz-block">
        <legend><span>02</span>Tu solicitud</legend>
        <div class="form-group"><label for="cz-servicio">¿Qué necesitas?</label>
          <select id="cz-servicio" name="servicio"><option>Varios o por definir</option>${SERVICIOS.map((s) => `<option>${esc(s)}</option>`).join("")}</select></div>
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
  <div class="hero-actions"><a class="btn-primary" href="/">Volver al inicio</a><a class="btn-wa" href="/impresion-3d/">${WA}Ver Impresión 3D</a></div>
</section>`;
  return layout({ sitio, ruta: "/404", titulo: "Página no encontrada", descripcion: "Esta página no existe.", cuerpo, noindex: true });
}
