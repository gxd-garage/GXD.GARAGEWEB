// Generador del sitio GXD Garage.
// Lee el contenido de /contenido, aplica las plantillas de /src y escribe el sitio listo en /dist.
// Uso:  node build.mjs            → sitio para publicar
//       node build.mjs --preview  → copia con enlaces relativos para revisar sin servidor
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import * as T from "./src/plantillas.mjs";

const require = createRequire(import.meta.url);
const { marked } = require("./vendor/marked.cjs");
const yaml = require("./vendor/js-yaml.cjs");

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const PREVIEW = process.argv.includes("--preview");
const SALIDA = path.join(RAIZ, PREVIEW ? "dist-preview" : "dist");
const avisos = [];

// ---------- lectura de contenido ----------
const sitio = JSON.parse(fs.readFileSync(path.join(RAIZ, "contenido/sitio.json"), "utf8"));

function leerColeccion(carpeta) {
  const dir = path.join(RAIZ, carpeta);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => {
      const texto = fs.readFileSync(path.join(dir, f), "utf8").replace(/^﻿/, "");
      const m = texto.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
      let datos = {};
      let cuerpo = texto;
      if (m) {
        try { datos = yaml.load(m[1]) || {}; }
        catch (e) { avisos.push(`${carpeta}/${f}: el encabezado tiene un error y se ignoró (${e.message.split("\n")[0]})`); }
        cuerpo = m[2];
      }
      return { archivo: `${carpeta}/${f}`, slug: T.slug(f.replace(/\.md$/, "")), datos, cuerpo, mtime: fs.statSync(path.join(dir, f)).mtime };
    });
}

const md = (s) =>
  marked.parse(s || "", { gfm: true })
    .replace(/<table>/g, '<div class="table"><table>').replace(/<\/table>/g, "</table></div>");

const ruta = (u) => {
  if (!u || typeof u !== "string") return null;
  u = u.trim();
  if (/^https?:\/\//.test(u)) return u;
  u = u.replace(/^(\.\/)?public\//, "");
  return u.startsWith("/") ? u : "/" + u;
};
const lista = (v) => (Array.isArray(v) ? v : v == null || v === "" ? [] : [v]);
const numero = (v) => {
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim()) { const n = Number(v.replace(/[^\d]/g, "")); return n > 0 ? n : null; }
  return null;
};
const fecha = (v, respaldo) => {
  const d = v instanceof Date ? v : v ? new Date(v) : null;
  return d && !isNaN(d) ? d : respaldo;
};

const coloresDefecto = lista(sitio.colores_por_defecto).flatMap((c) => String(c).split(",")).map((c) => c.trim()).filter((c) => {
  if (c && T.COLORES[c] === undefined) avisos.push(`contenido/sitio.json: el color por defecto "${c}" no está en la lista y se ignoró`);
  return c && T.COLORES[c] !== undefined;
});
const productos = leerColeccion("contenido/productos")
  .map(({ archivo, slug, datos: d, cuerpo }) => {
    if (!d.titulo) { avisos.push(`${archivo}: falta el nombre del producto, no se publicó`); return null; }
    let categoria = d.categoria ? String(d.categoria).trim() : T.CATEGORIAS[0];
    if (!T.CATEGORIAS.includes(categoria)) { avisos.push(`${archivo}: la categoría "${categoria}" no existe, se usó "${T.CATEGORIAS[0]}"`); categoria = T.CATEGORIAS[0]; }
    if (d.subcategoria && categoria === "Impresión 3D" && !T.SUBCATEGORIAS_3D.includes(String(d.subcategoria).trim())) avisos.push(`${archivo}: la subcategoría "${d.subcategoria}" no existe y se ignoró`);
    if (d.tipo_venta === "En stock" && categoria !== "Impresión 3D") avisos.push(`${archivo}: el stock solo se usa en Impresión 3D`);
    return {
      slug, titulo: String(d.titulo), categoria, etiqueta: d.etiqueta ? String(d.etiqueta).trim() : "", resumen: d.resumen ? String(d.resumen).trim() : "",
      precio: numero(d.precio), precio_desde: d.precio_desde === true,
      oferta_activa: d.oferta_activa === true, precio_oferta: numero(d.precio_oferta),
      oferta_texto: d.oferta_texto ? String(d.oferta_texto).trim() : "", oferta_detalle: d.oferta_detalle ? String(d.oferta_detalle).trim() : "",
      oferta_hasta: fecha(d.oferta_hasta, null),
      imagenes: lista(d.imagenes).map(ruta).filter(Boolean),
      detalles: lista(d.detalles).map(String).filter((s) => s.trim()),
      subcategoria: categoria === "Impresión 3D" && T.SUBCATEGORIAS_3D.includes(String(d.subcategoria || "").trim()) ? String(d.subcategoria).trim() : "",
      colores: lista(d.colores).flatMap((c) => String(c).split(",")).map((c) => c.trim()).filter((c) => {
        if (c && T.COLORES[c] === undefined) avisos.push(`${archivo}: el color "${c}" no está en la lista de colores y se ignoró`);
        return c && T.COLORES[c] !== undefined;
      }),
      tipo_venta: categoria === "Impresión 3D" && d.tipo_venta === "En stock" ? "En stock" : "Hecho a pedido",
      seccion_panel: d.seccion ? String(d.seccion).trim() : "",
      stock: typeof d.stock === "number" ? Math.max(0, Math.floor(d.stock)) : numero(d.stock) ?? 0,
      precio_visible: d.precio_visible === true,
      ocultar_colores: d.ocultar_colores === true,
      compatibilidad: lista(d.compatibilidad).map(String).map((s) => s.trim()).filter(Boolean),
      destacado: d.destacado === true, orden: numero(d.orden) ?? 100,
      publicado: d.publicado !== false, html: md(cuerpo),
    };
  })
  .map((p) => {
    if (!p || p.categoria !== "Impresión 3D") return p;
    const ok = T.SECCIONES_3D.some((x) => x.nombre === p.seccion_panel);
    if (p.seccion_panel && !ok) avisos.push(`${p.slug}: la sección "${p.seccion_panel}" no existe, se eligió una según el tipo`);
    return { ...p, seccion: ok ? p.seccion_panel : T.seccionPorDefecto(p) };
  })
  .filter((p) => p && p.publicado)
  // colores: los propios del producto o, si no tiene, los por defecto; nada si se ocultaron
  .map((p) => ({ ...p, colores: p.ocultar_colores ? [] : p.colores.length ? p.colores : coloresDefecto }))
  .sort((a, b) => a.orden - b.orden || a.titulo.localeCompare(b.titulo, "es"));

const portafolio = leerColeccion("contenido/portafolio")
  .map(({ archivo, datos: d }) => {
    if (!d.titulo) { avisos.push(`${archivo}: falta el nombre del trabajo, no se publicó`); return null; }
    let categoria = d.categoria ? String(d.categoria).trim() : T.CATEGORIAS[0];
    if (!T.CATEGORIAS.includes(categoria)) categoria = T.CATEGORIAS[0];
    return { titulo: String(d.titulo), categoria, imagen: ruta(d.imagen), orden: numero(d.orden) ?? 100, publicado: d.publicado !== false };
  })
  .filter((w) => w && w.publicado)
  .sort((a, b) => a.orden - b.orden || a.titulo.localeCompare(b.titulo, "es"));

const posts = leerColeccion("contenido/blog")
  .map(({ archivo, slug, datos: d, cuerpo, mtime }) => {
    if (!d.titulo) { avisos.push(`${archivo}: falta el título del artículo, no se publicó`); return null; }
    const palabras = cuerpo.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    let categoria = d.categoria ? String(d.categoria).trim() : "Novedades";
    if (!T.CATEGORIAS_BLOG.includes(categoria)) { avisos.push(`${archivo}: categoría "${categoria}" no existe, se usó "Novedades"`); categoria = "Novedades"; }
    return {
      slug, titulo: String(d.titulo), descripcion: d.descripcion ? String(d.descripcion).trim() : "", categoria,
      fecha: fecha(d.fecha, mtime), actualizado: fecha(d.actualizado, null), portada: ruta(d.portada),
      borrador: d.borrador === true, minutos: Math.max(1, Math.round(palabras / 200)), html: md(cuerpo),
    };
  })
  .filter((a) => a && !a.borrador)
  .sort((a, b) => b.fecha - a.fecha);

// ---------- escritura ----------
fs.rmSync(SALIDA, { recursive: true, force: true });
fs.mkdirSync(SALIDA, { recursive: true });

function copiar(origen, destino) {
  if (!fs.existsSync(origen)) return;
  for (const e of fs.readdirSync(origen, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue;
    const o = path.join(origen, e.name), d = path.join(destino, e.name);
    if (e.isDirectory()) { fs.mkdirSync(d, { recursive: true }); copiar(o, d); }
    else fs.copyFileSync(o, d);
  }
}
copiar(path.join(RAIZ, "public"), SALIDA);
fs.copyFileSync(path.join(RAIZ, "src/estilos.css"), path.join(SALIDA, "estilos.css"));
fs.copyFileSync(path.join(RAIZ, "src/cotizacion.js"), path.join(SALIDA, "cotizacion.js"));
fs.copyFileSync(path.join(RAIZ, "src/sitio.js"), path.join(SALIDA, "sitio.js"));
T.fijarVersion(Date.now().toString(36));
let promo = null;
const archivoPromo = path.join(RAIZ, "contenido/promocion.json");
if (fs.existsSync(archivoPromo)) {
  try {
    const d = JSON.parse(fs.readFileSync(archivoPromo, "utf8"));
    promo = { ...d, activa: d.activa === true, imagen: ruta(d.imagen), desde: fecha(d.desde, null), hasta: fecha(d.hasta, null) };
  } catch (e) { avisos.push(`contenido/promocion.json tiene un error y se ignoró (${e.message})`); }
}
for (const p of productos) {
  if (p.oferta_activa && !(p.precio_oferta > 0)) avisos.push(`${p.slug}: la oferta está activa pero no tiene precio de oferta, no se muestra`);
}
let banners = {};
const archivoServicios = path.join(RAIZ, "contenido/servicios.json");
if (fs.existsSync(archivoServicios)) {
  try {
    const d = JSON.parse(fs.readFileSync(archivoServicios, "utf8"));
    banners = { "3d": ruta(d.banner_3d), diseno: ruta(d.banner_diseno), digital: ruta(d.banner_digital) };
  } catch (e) { avisos.push(`contenido/servicios.json tiene un error y se ignoró (${e.message})`); }
}
T.fijarOpciones({ mostrarPrecios: sitio.mostrar_precios === true, promo, hoy: new Date(), banners });

function relativizar(html, archivo) {
  const prof = archivo.split("/").length - 1;
  const pre = "../".repeat(prof);
  return html.replace(/\b(href|src|data-src|data-root)="\/(?!\/)([^"]*)"/g, (_, attr, resto) => {
    let [p, hash] = resto.split("#");
    if (attr === "href" && (p === "" || p.endsWith("/"))) p += "index.html";
    return `${attr}="${pre}${p}${hash !== undefined ? "#" + hash : ""}"`;
  });
}

const paginas = [];
function escribir(archivo, html, enMapa = true, lastmod) {
  const destino = path.join(SALIDA, archivo);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, PREVIEW ? relativizar(html, archivo) : html);
  if (enMapa) paginas.push({ loc: "/" + archivo.replace(/index\.html$/, ""), lastmod });
}

const hoy = new Date();
escribir("index.html", T.paginaInicio({ sitio, productos, posts, portafolio }), true, hoy);
escribir("catalogo/index.html", T.paginaCatalogo({ sitio, productos }), true, hoy);
for (const g of T.GRUPOS) {
  const html = g.clave === "3d" ? T.paginaImpresion3D({ sitio, productos, portafolio, posts }) : T.paginaGrupo({ sitio, g, productos, portafolio });
  escribir(`${g.ruta.slice(1)}index.html`, html, true, hoy);
}
const redirecciones = [];
for (const p of productos) {
  // primero los de la misma subcategoría, después el resto de la misma línea
  const mismaLinea = productos.filter((r) => r.categoria === p.categoria && r.slug !== p.slug);
  const misma = (r) => (p.seccion ? r.seccion === p.seccion : true);
  const relacionados = [...mismaLinea.filter(misma), ...mismaLinea.filter((r) => !misma(r))].slice(0, 3);
  const destino = T.urlProducto(p);
  escribir(`${destino.slice(1)}index.html`, T.paginaProducto({ sitio, p, relacionados }), true, hoy);
  // las direcciones antiguas /catalogo/<producto>/ siguen funcionando
  redirecciones.push(`/catalogo/${p.slug}/ ${destino} 301`, `/catalogo/${p.slug} ${destino} 301`);
}
// páginas que se reemplazaron por una sección
redirecciones.push("/impresion-3d/repuesto-para-auto-a-medida/ /impresion-3d/#auto-a-medida 301", "/impresion-3d/repuesto-para-auto-a-medida /impresion-3d/#auto-a-medida 301");
if (!PREVIEW) fs.writeFileSync(path.join(SALIDA, "_redirects"), redirecciones.join("\n") + "\n");
escribir("cotizar/index.html", T.paginaCotizar({ sitio }), true, hoy);
const categorias = T.CATEGORIAS_BLOG;
escribir("blog/index.html", T.paginaBlog({ sitio, posts, categorias }), true, posts[0]?.fecha || hoy);
for (const c of categorias) {
  const deCat = posts.filter((a) => a.categoria === c);
  // las categorías vacías existen para el menú, pero no se envían a Google hasta tener artículos
  escribir(`blog/categoria/${T.slug(c)}/index.html`, T.paginaBlog({ sitio, posts, categorias, cat: c }), deCat.length > 0, deCat[0]?.fecha || hoy);
}
fs.writeFileSync(path.join(SALIDA, "blog/rss.xml"), T.rss({ sitio, posts }));
for (const a of posts) {
  escribir(`blog/${a.slug}/index.html`, T.paginaPost({ sitio, a, otros: posts.filter((o) => o.slug !== a.slug).slice(0, 3) }), true, a.actualizado || a.fecha);
}
escribir("404.html", T.pagina404({ sitio }), false);

const base = sitio.url.replace(/\/$/, "");
fs.writeFileSync(path.join(SALIDA, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  paginas.map((p) => `  <url><loc>${base}${p.loc}</loc>${p.lastmod ? `<lastmod>${T.fechaISO(p.lastmod)}</lastmod>` : ""}</url>`).join("\n") +
  `\n</urlset>\n`);
fs.writeFileSync(path.join(SALIDA, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);

console.log(`Sitio generado en ${path.relative(RAIZ, SALIDA)}/: ${productos.length} productos, ${posts.length} artículos, ${paginas.length} páginas en el mapa del sitio.`);
if (avisos.length) { console.log("\nRevisa esto:"); avisos.forEach((a) => console.log("  - " + a)); }
