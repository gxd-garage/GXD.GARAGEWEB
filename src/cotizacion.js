// Lista de cotización de GXD Garage.
// Guarda en el navegador del visitante los productos que quiere cotizar
// y arma el mensaje de WhatsApp desde la página /cotizar/.
(function () {
  "use strict";
  var CLAVE = "gxd-cotizacion";
  // Raíz del sitio (en la vista previa sin servidor las rutas son relativas)
  var RAIZ = (document.body && document.body.hasAttribute("data-root") ? document.body.dataset.root : "/");
  function ruta(r) { return RAIZ + r + (RAIZ === "/" ? "" : "index.html"); }

  function leer() {
    try {
      var v = JSON.parse(localStorage.getItem(CLAVE) || "[]");
      return Array.isArray(v) ? v.filter(function (x) { return x && x.slug && x.titulo; }) : [];
    } catch (e) { return []; }
  }
  function guardar(lista) {
    try { localStorage.setItem(CLAVE, JSON.stringify(lista)); } catch (e) { /* sin almacenamiento */ }
    contar(lista);
  }
  function contar(lista) {
    var n = (lista || leer()).reduce(function (s, x) { return s + (Number(x.cant) || 1); }, 0);
    document.querySelectorAll("[data-cot-count]").forEach(function (el) {
      el.textContent = n > 99 ? "99+" : String(n);
      el.hidden = n === 0;
    });
  }
  function avisar(texto) {
    var t = document.querySelector("[data-toast]");
    if (!t) return;
    t.innerHTML = texto;
    t.hidden = false;
    clearTimeout(avisar._t);
    avisar._t = setTimeout(function () { t.hidden = true; }, 3200);
  }
  function cantidad(v) {
    var n = parseInt(v, 10);
    return isNaN(n) || n < 1 ? 1 : Math.min(n, 9999);
  }

  // ---------- ficha de producto ----------
  function fichas() {
    document.querySelectorAll("[data-add]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var input = document.getElementById("cant");
        var tope = input && Number(input.max) > 0 ? Number(input.max) : 9999;
        var cant = Math.min(cantidad(input && input.value), tope);
        var sel = document.querySelector('input[name="color"]:checked');
        var color = sel ? sel.value : "";
        var lista = leer();
        // un mismo producto en otro color es otra línea de la cotización
        var item = lista.find(function (x) { return x.slug === btn.dataset.slug && (x.color || "") === color; });
        if (item) item.cant = Math.min(cantidad(item.cant + cant), tope);
        else lista.push({ slug: btn.dataset.slug, titulo: btn.dataset.titulo, cant: cant, color: color, url: btn.dataset.url || "" });
        guardar(lista);
        var ok = document.querySelector("[data-added]");
        if (ok) ok.hidden = false;
        btn.textContent = "Agregado ✓";
        setTimeout(function () { btn.textContent = "Agregar a mi cotización"; }, 1800);
        avisar('Agregado a tu cotización. <a href="' + ruta("cotizar/") + '">Ver cotización</a>');
      });
    });
  }

  // ---------- página /cotizar/ ----------
  function cotizador() {
    var form = document.getElementById("cotizador");
    if (!form) return;
    var ul = document.getElementById("cz-lista");
    var vacio = document.getElementById("cz-vacio");
    var error = document.getElementById("cz-error");

    function pintar() {
      var lista = leer();
      ul.innerHTML = "";
      vacio.hidden = lista.length > 0;
      lista.forEach(function (x, i) {
        var li = document.createElement("li");
        li.className = "cz-item";
        var a = document.createElement("a");
        a.href = ruta(x.url || "catalogo/" + encodeURIComponent(x.slug) + "/");
        a.textContent = x.titulo + (x.color ? " — " + x.color : "");
        var qty = document.createElement("input");
        qty.type = "number"; qty.min = "1"; qty.max = "9999"; qty.value = cantidad(x.cant);
        qty.id = "cz-cant-" + i;
        qty.setAttribute("aria-label", "Cantidad de " + x.titulo);
        qty.addEventListener("change", function () {
          var l = leer(); if (!l[i]) return;
          l[i].cant = cantidad(qty.value); qty.value = l[i].cant; guardar(l);
        });
        var quitar = document.createElement("button");
        quitar.type = "button"; quitar.className = "mini"; quitar.textContent = "Quitar";
        quitar.setAttribute("aria-label", "Quitar " + x.titulo);
        quitar.addEventListener("click", function () {
          var l = leer(); l.splice(i, 1); guardar(l); pintar();
        });
        li.appendChild(a); li.appendChild(qty); li.appendChild(quitar);
        ul.appendChild(li);
      });
    }

    function mensaje() {
      var d = new FormData(form);
      var lista = leer();
      var lineas = ["Hola GXD, quiero cotizar:"];
      lineas.push("");
      lineas.push("• Tipo de trabajo: " + d.get("servicio"));
      if (lista.length) {
        lineas.push("• Productos del catálogo:");
        lista.forEach(function (x) { lineas.push("   - " + x.titulo + " (" + (x.color ? x.color + ", " : "") + "x" + cantidad(x.cant) + ")"); });
      }
      var det = String(d.get("detalle") || "").trim();
      if (det) lineas.push("• Detalle: " + det);
      lineas.push("• " + d.get("tengo"));
      lineas.push("• Plazo: " + d.get("plazo"));
      lineas.push("");
      var nombre = String(d.get("nombre") || "").trim();
      var comuna = String(d.get("comuna") || "").trim();
      lineas.push("Mi nombre es " + nombre + (comuna ? ", de " + comuna : "") + ".");
      return lineas.join("\n");
    }

    function validar() {
      var nombre = form.nombre.value.trim();
      var det = form.detalle.value.trim();
      var msgs = [];
      if (!nombre) msgs.push("escribe tu nombre");
      if (!leer().length && !det) msgs.push("agrega un producto del catálogo o cuéntanos tu idea");
      if (msgs.length) {
        error.textContent = "Para enviar tu solicitud, " + msgs.join(" y ") + ".";
        error.hidden = false;
        (nombre ? form.detalle : form.nombre).focus();
        return false;
      }
      error.hidden = true;
      return true;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validar()) return;
      var url = "https://wa.me/" + (window.GXD_WA || "") + "?text=" + encodeURIComponent(mensaje());
      window.location.href = url;
    });

    var copiar = document.getElementById("cz-copiar");
    if (copiar) copiar.addEventListener("click", function () {
      if (!validar()) return;
      var txt = mensaje();
      function ok() { copiar.textContent = "Copiado ✓"; setTimeout(function () { copiar.textContent = "Copiar mensaje"; }, 1800); }
      try { navigator.clipboard.writeText(txt).then(ok, function () { window.prompt("Copia el mensaje:", txt); }); }
      catch (err) { window.prompt("Copia el mensaje:", txt); }
    });

    pintar();
  }

  function iniciar() { RAIZ = (document.body && document.body.hasAttribute("data-root") ? document.body.dataset.root : "/"); contar(); fichas(); cotizador(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
