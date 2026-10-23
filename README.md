# Sitio web de GXD Garage

Sitio de GXD Garage construido sobre su diseño original (Bebas Neue, DM Mono e Instrument Serif), con portada, catálogo de productos para cotizar por WhatsApp y blog para posicionarse en Google. El contenido se edita desde un panel web, sin tocar código.

**Cómo funciona, en una línea:** el proyecto vive en GitHub, Cloudflare lo publica gratis cada vez que algo cambia, y tú editas productos y artículos desde Pages CMS, que guarda los cambios en GitHub.

```
Tú editas en Pages CMS  →  se guarda en GitHub  →  Cloudflare publica  →  gxdgarage.cl
```

Lo único que se paga es el dominio .cl.

---

## Paso 1. Subir el proyecto a GitHub

1. Crea una cuenta gratuita en [github.com](https://github.com) con el correo de GXD.
2. Arriba a la derecha, toca **+** y luego **New repository**.
3. Ponle de nombre `gxd-garage-web`, marca **Private** y toca **Create repository**.
4. En la página del repositorio vacío, toca el enlace **uploading an existing file**.
5. Abre la carpeta del proyecto en tu computador, selecciona **todo su contenido** (no la carpeta misma) y arrástralo a la página.
   - Hay un archivo oculto llamado `.pages.yml` que también debe subirse. En Mac, presiona `Cmd + Shift + .` en el Finder para ver los archivos ocultos. En Windows, actívalos en el Explorador desde **Vista → Mostrar → Elementos ocultos**.
6. Abajo, toca **Commit changes**.

## Paso 2. Publicar el sitio en Cloudflare Pages

1. Crea una cuenta gratuita en [cloudflare.com](https://dash.cloudflare.com/sign-up).
2. En el panel, entra a **Workers y Pages**, toca **Crear** y elige la pestaña **Pages**.
3. Elige **Conectar a Git** (o **Importar un repositorio de Git**), autoriza tu cuenta de GitHub y selecciona `gxd-garage-web`.
4. En la configuración de compilación escribe exactamente esto:

   | Campo | Valor |
   |---|---|
   | Framework preset | None (Ninguno) |
   | Build command | `node build.mjs` |
   | Build output directory | `dist` |

5. Toca **Guardar e implementar**. En uno o dos minutos el sitio queda en línea en una dirección del tipo `gxd-garage-web.pages.dev`.

Desde ese momento, cada cambio que se guarde en GitHub vuelve a publicar el sitio automáticamente.

> Los nombres de los botones de Cloudflare pueden variar un poco con el tiempo, pero los tres valores de la tabla son siempre los mismos.

## Paso 3. Conectar tu dominio .cl

1. Busca el nombre en [nic.cl](https://www.nic.cl) (por ejemplo `gxdgarage.cl`) e inscríbelo.
2. En Cloudflare, abre tu proyecto de Pages, entra a **Dominios personalizados** y toca **Configurar un dominio personalizado**. Escribe `gxdgarage.cl`.
3. Cloudflare te pedirá agregar el dominio a tu cuenta (el plan gratuito sirve) y te mostrará **dos servidores de nombres**, parecidos a `ana.ns.cloudflare.com`.
4. Entra a tu cuenta en NIC Chile, abre el dominio y reemplaza los servidores DNS por los dos que te dio Cloudflare.
5. El cambio puede tardar desde unos minutos hasta 24 horas. El certificado de seguridad (el candado https) se activa solo.
6. Repite el punto 2 de esta lista con `www.gxdgarage.cl` para que el sitio también abra con www.

Si usas otro dominio, cámbialo en el panel de edición, en **Datos del negocio → Dirección del sitio**. Esa dirección se usa para Google y para los enlaces que se comparten.

## Paso 4. Editar el contenido con Pages CMS

1. Entra a [app.pagescms.org](https://app.pagescms.org) y toca **Sign in with GitHub**.
2. Instala la aplicación de Pages CMS en tu cuenta de GitHub cuando te lo pida y dale acceso al repositorio `gxd-garage-web`.
3. Abre el repositorio. En el menú verás tres secciones:
   - **Catálogo:** agregar, editar, ordenar u ocultar productos. Cada producto va en una de las tres líneas de servicio (Impresión 3D, Diseño gráfico o Impresión digital), que son las pestañas del catálogo.
   - **Portafolio:** las fotos de trabajos reales que aparecen en el inicio.
   - **Blog:** escribir y publicar artículos.
   - **Datos del negocio:** WhatsApp, Instagram, dirección, horario y textos para Google.
4. Edita lo que necesites y toca **Save**. El sitio se actualiza solo en uno o dos minutos.

### Agregar un producto

1. En **Catálogo**, toca **Add an entry**.
2. Completa el nombre, la categoría y un resumen corto.
3. **Valor de referencia** es opcional. Por defecto el catálogo no muestra precios y cada producto aparece como "A cotizar". Si algún día quieres mostrar valores de referencia, actívalo en **Datos del negocio → Mostrar valores de referencia**.
4. Sube las fotos. La primera es la portada del producto.
5. Activa **Destacado** si quieres que aparezca en la portada del sitio.
6. Toca **Save**.

Para ocultar un producto sin borrarlo, desactiva **Publicado**.

### Cómo funciona la cotización

El sitio no vende en línea: todo se cotiza.

- En cada producto, el cliente elige la cantidad y toca **Agregar a mi cotización**. Puede juntar varios productos.
- En la página **Cotizar** ve su lista, cuenta su idea, indica si tiene la pieza, fotos, un archivo o solo la idea, y elige un plazo.
- Al tocar **Enviar por WhatsApp**, se abre WhatsApp con un mensaje ordenado con todo eso, listo para enviarte. Después puede adjuntar fotos en el mismo chat.

La lista se guarda en el navegador del cliente, así que no tienes que administrar nada.

### Categorías del blog

Cada artículo lleva una categoría, y cada categoría tiene su propia página:

- **Guías:** responden preguntas que la gente busca en Google, como materiales, cómo pedir un repuesto o qué es un llavero NFC. Son las que más tráfico orgánico traen.
- **Proyectos:** trabajos reales, con el encargo, el proceso y el resultado. Usa fotos tuyas y menciona la comuna o el tipo de cliente.
- **Novedades:** nuevos productos, eventos, promociones o equipos nuevos del taller.

El sitio genera también un feed RSS en `/blog/rss.xml` y agrega cada artículo al mapa del sitio para Google.

### Tamaños de imagen

El sitio nunca deforma las fotos: las recorta para llenar su espacio. Por eso conviene subirlas en la proporción indicada y con lo importante al centro.

| Dónde | Proporción | Tamaño ideal | Mínimo | Peso máximo |
|---|---|---|---|---|
| Fotos de producto (Catálogo) | 4:3 horizontal | 1600 × 1200 px | 1200 × 900 px | 500 KB |
| Portafolio | 4:3 horizontal | 1600 × 1200 px | 1200 × 900 px | 500 KB |
| Portada de artículo (Blog) | 16:9 horizontal | 1600 × 900 px | 1200 × 675 px | 500 KB |
| Ventana promocional | 1:1 cuadrada | 1200 × 1200 px | 800 × 800 px | 400 KB |

- **Si se ve pixelada**, la foto es más chica que el mínimo. Usa el original del celular, no una descargada de Instagram o WhatsApp, que vienen comprimidas.
- **Si se corta algo importante**, la foto no tiene la proporción indicada. Recórtala antes de subirla o deja más espacio alrededor del objeto.
- **Si el sitio carga lento**, la foto pesa demasiado. Las del celular suelen pesar entre 3 y 6 MB.

Cómo prepararlas gratis en [squoosh.app](https://squoosh.app): arrastra la foto, en "Resize" pon el ancho (1600 o 1200), en el formato elige WebP o MozJPEG con calidad 75 a 80, revisa que el peso quede bajo el máximo y descárgala. Para recortar a la proporción exacta puedes usar el editor de fotos del celular, eligiendo 4:3, 16:9 o cuadrado.

### Recomendaciones para las fotos

- Usa fotos propias, con buena luz y fondo limpio, como las de tu Instagram.
- Antes de subirlas, redúcelas a unos 1.600 píxeles de ancho y menos de 500 KB. Puedes usar [squoosh.app](https://squoosh.app), que es gratis. Las fotos livianas hacen que el sitio cargue rápido, y eso también ayuda en Google.
- Las fotos de ejemplo que trae el sitio vienen de capturas de Instagram y tienen baja resolución. Reemplázalas por los originales.

## Paso 5. Que Google encuentre el sitio

1. **Google Search Console.** Entra a [search.google.com/search-console](https://search.google.com/search-console), agrega tu dominio y verifícalo (Cloudflare te ayuda con el registro DNS). Luego, en **Sitemaps**, envía `https://gxdgarage.cl/sitemap.xml`. El sitio genera ese archivo solo y lo mantiene al día.
2. **Perfil de Empresa en Google.** Crea o reclama tu ficha en [google.com/business](https://www.google.com/business) con la dirección, el WhatsApp, el enlace al sitio y fotos de tus trabajos. Es lo que más pesa cuando alguien busca "impresión 3D cerca de mí" o "impresión 3D Talagante".

El sitio ya incluye lo técnico: títulos y descripciones por página, enlaces canónicos, mapa del sitio, `robots.txt` y datos estructurados de negocio local, productos y artículos.

## Cómo escribir artículos que posicionen

- **Un artículo, una pregunta.** Piensa en lo que tus clientes escriben en Google: "cómo hacer un repuesto plástico", "qué es un llavero NFC", "letrero 3D para negocio".
- **El título es la búsqueda.** Escríbelo como lo escribiría la gente.
- **La descripción importa.** Entre 120 y 160 caracteres que resuman el artículo e inviten a hacer clic.
- **Responde de verdad.** Apunta a 600 palabras o más, con subtítulos y ejemplos de tus trabajos.
- **Enlaza tus productos.** Un artículo sobre repuestos debería enlazar al producto "Repuesto a medida", y al revés.
- **Menciona dónde estás** cuando sea natural: Talagante y la Región Metropolitana.
- **Publica con constancia.** Uno o dos artículos al mes funcionan mejor que diez de una vez.

---

## Referencia técnica

```
contenido/
  sitio.json          Datos del negocio
  productos/*.md      Un archivo por producto
  blog/*.md           Un archivo por artículo
public/
  media/              Fotos subidas desde el panel
  brand/              Logos, íconos e imagen para compartir
src/
  estilos.css         Diseño del sitio
  plantillas.mjs      HTML de cada página
  cotizacion.js       Lista de cotización y mensaje de WhatsApp
  sitio.js            Cursor, animaciones, pestañas, menú móvil y formulario de contacto
contenido/portafolio/ Trabajos del portafolio
vendor/               Bibliotecas incluidas (ver LICENCIAS.md)
build.mjs             Genera el sitio en dist/
.pages.yml            Campos del panel de edición
```

- El sitio no necesita instalar dependencias. Solo requiere Node.js 18 o superior, que Cloudflare ya trae.
- Para revisarlo en tu computador, instala [Node.js](https://nodejs.org), abre una terminal en la carpeta y ejecuta `node build.mjs --preview`. Luego abre `dist-preview/index.html` en el navegador.
- Si un producto o artículo tiene un error (por ejemplo, le falta el nombre), la publicación sigue adelante y el aviso aparece en el registro de compilación de Cloudflare.
