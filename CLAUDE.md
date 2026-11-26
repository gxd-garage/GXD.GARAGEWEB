# GXD Garage · gxdgarage.cl

Sitio estático de GXD Garage SpA: impresión 3D, diseño gráfico e impresión digital, taller en Talagante (Región Metropolitana), despachos a regiones. El dueño escribe en español de Chile; todo texto visible va en ese registro ("garage" se escribe así, no "garaje").

## Cómo se trabaja
- **Todo cambio pasa por el visto bueno del dueño antes de publicarse.** Primero se muestra (capturas o vista previa local) y se explica qué cambia; solo con su aprobación se hace commit y push. Esto incluye textos, diseño, contenido, SEO y archivos técnicos.
- Contenido en `contenido/` (md con front matter y `sitio.json`), editable en Pages CMS (`.pages.yml`). Plantillas en `src/plantillas.mjs`, estilos en `src/estilos.css`, JS en `src/sitio.js`. `node build.mjs` genera `dist/`.
- Cloudflare publica solo al hacer push a `main`. Flujo: commit → `git pull --rebase` → `node build.mjs` → `git push`.
- Fotos nuevas en `public/media/`: correr `python3 scripts/optimizar-imagenes.py` (también lo hace la GitHub Action) para generar WebP y `src/imagenes.json`.
- Nada de fotos generadas con IA presentadas como trabajos reales (portafolio, portada, casos). Si se usa una imagen referencial en un producto, debe decirlo.

## Regla permanente: SEO para Google y para buscadores con IA
Cada cambio, por chico que sea, se revisa con esta lista antes de publicar:

1. **Qué hacemos, dicho en palabras que la gente busca.** Títulos, H1 y primeros párrafos deben nombrar el servicio y el lugar ("impresión 3D", "Talagante", "Región Metropolitana"). Un slogan nunca reemplaza al H1 con palabras clave.
2. **Intención correcta.** Repuestos = *piezas plásticas impresas en 3D*, nunca "repuestos para autos" a secas (atrae a gente que busca tiendas de repuestos mecánicos). Decir también lo que NO hacemos cuando evita leads equivocados.
3. **Un solo H1 por página; title ≤ 60 caracteres; meta description de 70 a 160 caracteres;** URLs limpias y estables (no renombrar slugs publicados sin redirección 301 en `build.mjs`).
4. **Datos estructurados al día:** LocalBusiness (#negocio), WebSite, Product/Service con precio cuando es visible, FAQPage, BreadcrumbList, CreativeWork en casos. Validar que el JSON-LD parsee después de cada build.
5. **Contenido que la IA pueda citar:** respuestas directas al inicio, títulos en forma de pregunta (¿…?), listas y tablas, datos concretos y verdaderos (precios, materiales, plazos reales). Nunca inventar cifras, clientes ni plazos.
6. **Fotos:** texto alternativo descriptivo, versión WebP, ancho/alto definidos; las importantes van al mapa del sitio.
7. **Enlaces internos:** cada página nueva enlaza y recibe enlaces de productos, casos o guías relacionadas.
8. **Mapa del sitio y robots:** páginas públicas en `sitemap.xml`; las de uso interno (`/ig/`, `/tiktok/`) con `noindex`. No bloquear buscadores de IA (OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude) en robots ni en Cloudflare.
9. **Misma descripción del negocio en todas partes** (sitio, Instagram, Perfil de Google, Marketplace): "GXD Garage: taller de impresión 3D en Talagante que fabrica repuestos plásticos, letreros y emblemas a medida, con diseño propio y despacho a regiones."
10. **Velocidad y celular primero:** revisar en 390 px y 1440 px; nada que tape contenido; contraste suficiente (texto negro sobre el verde de WhatsApp).
