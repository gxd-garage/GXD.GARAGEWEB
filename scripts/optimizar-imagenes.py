#!/usr/bin/env python3
"""Genera versiones WebP livianas de las fotos de public/media para que el sitio cargue rápido en celulares.

Uso (desde la raíz del proyecto):   python3 scripts/optimizar-imagenes.py

- Crea public/media/opt/<nombre>-<ancho>.webp en varios anchos (480, 800, 1200 y 1600 px, sin agrandar).
- Escribe src/imagenes.json con el tamaño original y las versiones de cada foto; build.mjs lo usa para
  armar srcset, width y height. Una foto nueva sin versiones se sigue mostrando normal (solo que más pesada).
- Solo procesa lo que cambió: si la versión WebP es más nueva que la foto, la deja tal cual.
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
MEDIA = RAIZ / "public" / "media"
OPT = MEDIA / "opt"
MANIFIESTO = RAIZ / "src" / "imagenes.json"
ANCHOS = [480, 800, 1200, 1600]
CALIDAD = 78

OPT.mkdir(exist_ok=True)
datos = {}
vistos = set()
for f in sorted(MEDIA.iterdir()):
    if f.suffix.lower() not in (".jpg", ".jpeg", ".png") or not f.is_file():
        continue
    im = ImageOps.exif_transpose(Image.open(f))
    w, h = im.size
    anchos = [a for a in ANCHOS if a < w] + [min(w, ANCHOS[-1])]
    versiones = []
    for a in sorted(set(anchos)):
        destino = OPT / f"{f.stem}-{a}.webp"
        vistos.add(destino.name)
        if not destino.exists() or destino.stat().st_mtime < f.stat().st_mtime:
            alto = round(h * a / w)
            copia = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB").resize((a, alto), Image.LANCZOS)
            copia.save(destino, "WEBP", quality=CALIDAD, method=6)
        versiones.append([a, f"/media/opt/{destino.name}"])
    datos[f"/media/{f.name}"] = {"w": w, "h": h, "webp": versiones}

# borra versiones de fotos que ya no existen
for v in OPT.glob("*.webp"):
    if v.name not in vistos:
        v.unlink()

MANIFIESTO.write_text(json.dumps(datos, ensure_ascii=False, indent=1) + "\n")
antes = sum((MEDIA / Path(k).name).stat().st_size for k in datos)
despues = sum((OPT / Path(v["webp"][-1][1]).name).stat().st_size for v in datos.values())
print(f"{len(datos)} fotos · originales {antes/1024:.0f} KB · WebP más grande de cada una {despues/1024:.0f} KB")
