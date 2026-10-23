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
