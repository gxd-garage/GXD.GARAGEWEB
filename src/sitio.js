// Interacciones del diseño GXD: cursor, aparición al hacer scroll, pestañas del catálogo,
// filtro del portafolio, menú móvil, galería de la ficha y formulario de contacto.
(function () {
  "use strict";

  // ---------- Cursor (solo con mouse) ----------
  var fino = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var cur = document.getElementById("cursor"), ring = document.getElementById("cursorRing");
  if (fino && cur && ring) {
    var mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener("mousemove", function (e) { mx = e.clientX; my = e.clientY; cur.style.left = mx + "px"; cur.style.top = my + "px"; });
    (function anim() { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx + "px"; ring.style.top = ry + "px"; requestAnimationFrame(anim); })();
    document.addEventListener("mouseover", function (e) { ring.classList.toggle("hover", !!e.target.closest("a, button, input, select, textarea, label")); });
  }

  // ---------- Aparición al hacer scroll ----------
  var els = document.querySelectorAll(".fade-up");
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(function (el) { obs.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add("visible"); });
  }

  // ---------- Menú móvil ----------
  var tg = document.querySelector(".nav-toggle"), links = document.querySelector(".nav-links");
  if (tg && links) {
    tg.addEventListener("click", function () {
      var abierto = links.classList.toggle("open");
      tg.setAttribute("aria-expanded", String(abierto));
    });
    links.addEventListener("click", function (e) { if (e.target.closest("a")) { links.classList.remove("open"); tg.setAttribute("aria-expanded", "false"); } });
  }

  // ---------- Pestañas del catálogo ----------
  function setTab(id) {
    var btn = document.getElementById(id), panel = document.getElementById("panel-" + id);
    if (!btn || !panel) return;
    document.querySelectorAll(".catalog-tab").forEach(function (t) { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
    document.querySelectorAll(".catalog-panel").forEach(function (p) { p.classList.remove("active"); });
    btn.classList.add("active"); btn.setAttribute("aria-selected", "true");
    panel.classList.add("active");
    panel.querySelectorAll(".fade-up:not(.visible)").forEach(function (el) { setTimeout(function () { el.classList.add("visible"); }, 80); });
  }
  document.querySelectorAll(".catalog-tab").forEach(function (t) { t.addEventListener("click", function () { setTab(t.id); }); });
  document.querySelectorAll("[data-set-tab]").forEach(function (a) { a.addEventListener("click", function () { setTab(a.dataset.setTab); }); });
  var h = (location.hash || "").slice(1);
  if (h && document.getElementById("panel-" + h)) setTab(h);

  // ---------- Filtro del portafolio ----------
  var fbtns = document.querySelectorAll(".portfolio-filter .filter-btn");
  fbtns.forEach(function (b) {
    b.addEventListener("click", function () {
      fbtns.forEach(function (x) { x.classList.remove("active"); x.setAttribute("aria-pressed", "false"); });
      b.classList.add("active"); b.setAttribute("aria-pressed", "true");
      var f = b.dataset.f;
      document.querySelectorAll(".portfolio-card").forEach(function (c) { c.hidden = !!f && c.dataset.cat !== f; });
    });
  });

  // ---------- Galería de la ficha ----------
  var foto = document.getElementById("foto");
  document.querySelectorAll(".thumb").forEach(function (b, _, all) {
    b.addEventListener("click", function () {
      if (foto) foto.src = b.dataset.src;
      all.forEach(function (x) { x.setAttribute("aria-current", String(x === b)); });
    });
  });

  // ---------- Copiar número ----------
  document.querySelectorAll("[data-copy]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      var txt = b.dataset.copy, orig = b.textContent;
      function ok(m) { b.textContent = m; setTimeout(function () { b.textContent = orig; }, 1600); }
      try { navigator.clipboard.writeText(txt).then(function () { ok("Copiado"); }, function () { ok(txt); }); } catch (err) { ok(txt); }
    });
  });

  // ---------- Ofertas con fecha de término ----------
  // Si una oferta ya venció (y el sitio aún no se ha vuelto a publicar), se oculta en el navegador.
  var hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  function vencida(iso) { if (!iso) return false; var d = new Date(iso + "T23:59:59"); return d < hoy; }
  document.querySelectorAll("[data-oferta-hasta]").forEach(function (el) {
    if (vencida(el.dataset.ofertaHasta)) {
      var cont = el.closest(".product-card, .prod-info") || el;
      cont.classList.add("oferta-vencida");
    }
  });

  // ---------- Ventana promocional ----------
  var promo = document.querySelector("[data-promo]");
  if (promo) {
    var id = "gxd-promo-" + promo.dataset.promo;
    var desde = promo.dataset.desde ? new Date(promo.dataset.desde + "T00:00:00") : null;
    var hasta = promo.dataset.hasta ? new Date(promo.dataset.hasta + "T23:59:59") : null;
    var ahora = new Date();
    var vigente = (!desde || ahora >= desde) && (!hasta || ahora <= hasta);
    var visto = null;
    try { visto = promo.dataset.frecuencia === "Una vez por día" ? sessionStorage.getItem(id + "-" + ahora.toDateString()) : localStorage.getItem(id); } catch (e) { visto = null; }
    if (promo.dataset.frecuencia === "Cada visita") visto = null;
    if (vigente && !visto) {
      var anterior = null;
      var abrir = function () {
        anterior = document.activeElement;
        promo.hidden = false;
        document.documentElement.classList.add("promo-abierta");
        var b = promo.querySelector(".promo-x"); if (b) b.focus();
      };
      var cerrar = function () {
        promo.hidden = true;
        document.documentElement.classList.remove("promo-abierta");
        try {
          if (promo.dataset.frecuencia === "Una vez por día") sessionStorage.setItem(id + "-" + new Date().toDateString(), "1");
          else localStorage.setItem(id, "1");
        } catch (e) { /* sin almacenamiento: se volverá a mostrar */ }
        if (anterior && anterior.focus) anterior.focus();
      };
      promo.querySelectorAll("[data-promo-cerrar]").forEach(function (b) { b.addEventListener("click", cerrar); });
      var cta = promo.querySelector("[data-promo-cta]"); if (cta) cta.addEventListener("click", function () { setTimeout(cerrar, 50); });
      document.addEventListener("keydown", function (e) {
        if (promo.hidden) return;
        if (e.key === "Escape") cerrar();
        if (e.key === "Tab") {
          var f = promo.querySelectorAll("a, button"); if (!f.length) return;
          var first = f[0], last = f[f.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      });
      setTimeout(abrir, (Number(promo.dataset.retraso) || 0) * 1000);
    }
  }

  // ---------- Formulario de contacto del inicio → WhatsApp ----------
  var f = document.getElementById("contacto-form");
  if (f) {
    var err = document.getElementById("contacto-error");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var n = f.nombre.value.trim(), m = f.mensaje.value.trim(), faltan = [];
      if (!n) faltan.push("tu nombre");
      if (!m) faltan.push("tu idea");
      if (faltan.length) { err.textContent = "Para enviar, escribe " + faltan.join(" y ") + "."; err.hidden = false; (n ? f.mensaje : f.nombre).focus(); return; }
      err.hidden = true;
      var txt = "Hola GXD Garage, quiero cotizar:\n\n• Servicio: " + (f.servicio.value || "Por definir") +
        "\n• " + f.tengo.value + "\n• Detalle: " + m + "\n\nMi nombre es " + n + ".";
      window.location.href = "https://wa.me/" + (window.GXD_WA || "") + "?text=" + encodeURIComponent(txt);
    });
  }
})();
