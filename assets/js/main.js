/* =========================================================
   مجمع حلقات جامع الحوامي — السكربت الرئيسي
   لا يعتمد على أي مكتبة خارجية.
   ========================================================= */
(function () {
  "use strict";

  var doc = document.documentElement;
  doc.classList.add("js");

  // منع تضمين الموقع داخل إطار من موقع آخر (Clickjacking)
  if (window.top !== window.self) {
    try { window.top.location = window.self.location; } catch (e) { document.body.innerHTML = ""; }
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- التاريخ الهجري (أم القرى) يتحدث يوميًا ---------- */
  var HIJRI_LOCALE = "ar-SA-u-ca-islamic-umalqura-nu-latn";
  function hijriParts(date) {
    var out = {};
    try {
      new Intl.DateTimeFormat(HIJRI_LOCALE, { day: "numeric", month: "long", year: "numeric", weekday: "long" })
        .formatToParts(date).forEach(function (p) { out[p.type] = p.value; });
    } catch (e) { /* متصفح قديم */ }
    return out;
  }
  function hijriYear(date) {
    var p = hijriParts(date || new Date());
    var y = parseInt(p.year, 10);
    return isNaN(y) ? 1448 : y;
  }
  window.HAWAMY = window.HAWAMY || {};
  window.HAWAMY.hijriYear = hijriYear;

  function renderHijri() {
    var now = new Date();
    var p = hijriParts(now);
    if (!p.year) return;
    var full = p.weekday + "، " + p.day + " " + p.month + " " + p.year + "هـ";
    var short = p.day + " " + p.month + " " + p.year + "هـ";
    var greg = "";
    try { greg = new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", { day: "numeric", month: "long", year: "numeric" }).format(now) + "م"; } catch (e) {}
    $$("[data-hijri]").forEach(function (el) {
      var f = $(".hijri-full", el), s = $(".hijri-short", el);
      if (f) f.textContent = full;
      if (s) s.textContent = short;
      if (!f && !s) el.textContent = full;
      if (greg) el.setAttribute("title", "الموافق " + greg);
      var t = $("time", el);
      if (t) t.setAttribute("datetime", now.toISOString().slice(0, 10));
    });
    var y = String(p.year);
    $$("[data-hijri-year]").forEach(function (el) { el.textContent = y; });
    // سنوات العطاء منذ 1421هـ
    $$("[data-years-since]").forEach(function (el) {
      var from = parseInt(el.getAttribute("data-years-since"), 10);
      var n = Math.max(1, hijriYear(now) - from - 1);
      el.setAttribute("data-count", n);
      if (!el.dataset.counted) el.textContent = n;
    });
  }
  function scheduleMidnight() {
    var now = new Date();
    var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
    setTimeout(function () { renderHijri(); scheduleMidnight(); }, next - now);
  }
  renderHijri();
  scheduleMidnight();
  document.addEventListener("visibilitychange", function () { if (!document.hidden) renderHijri(); });

  /* ---------- الهيدر وشريط التقدم ---------- */
  var header = $(".site-header");
  var progress = $(".progress");
  var ticking = false;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 12);
    if (progress) {
      var h = doc.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (h > 0 ? Math.min(1, y / h) : 0) + ")";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- قائمة الجوال ---------- */
  var toggle = $(".menu-toggle");
  function setMenu(open) {
    doc.classList.toggle("menu-open", open);
    document.body.classList.toggle("no-scroll", open);
    if (toggle) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
    }
  }
  if (toggle) {
    toggle.addEventListener("click", function () { setMenu(!doc.classList.contains("menu-open")); });
    $$(".main-nav a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
    window.addEventListener("resize", function () { if (window.innerWidth > 940) setMenu(false); });
  }

  /* ---------- حركات الظهور عند التمرير ---------- */
  function initReveal(root) {
    var els = $$("[data-reveal]", root).filter(function (el) { return !el.classList.contains("is-visible"); });
    // تأخير متدرج للعناصر الشقيقة
    $$("[data-stagger]", root).forEach(function (group) {
      var step = parseFloat(group.getAttribute("data-stagger")) || 0.08;
      $$(":scope > [data-reveal]", group).forEach(function (el, i) { el.style.setProperty("--d", (i * step).toFixed(2) + "s"); });
    });
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (el) { io.observe(el); });
  }
  window.HAWAMY.reveal = initReveal;
  initReveal(document);

  /* ---------- العدّادات ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;
    el.dataset.counted = "1";
    if (reduceMotion) { el.textContent = target; return; }
    var start = performance.now(), dur = 1800;
    var from = target > 1000 ? target - 60 : 0;
    function step(t) {
      var k = Math.min(1, (t - start) / dur);
      var e = 1 - Math.pow(1 - k, 4);
      el.textContent = Math.round(from + (target - from) * e);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$("[data-count]");
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (c) { cio.observe(c); });
    } else counters.forEach(animateCount);
  }

  /* ---------- جسيمات ذهبية خفيفة في الواجهة ---------- */
  var canvas = $("#particles");
  if (canvas && !reduceMotion && canvas.getContext) {
    var ctx = canvas.getContext("2d");
    var dots = [], W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), running = true, raf;
    function size() {
      var r = canvas.getBoundingClientRect();
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(46, (W * H) / 26000));
      dots = [];
      for (var i = 0; i < n; i++) {
        dots.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2.2 + .6, vy: -(Math.random() * .25 + .08), vx: (Math.random() - .5) * .15, a: Math.random() * .5 + .25, p: Math.random() * Math.PI * 2 });
      }
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx; d.y += d.vy; d.p += .02;
        if (d.y < -10) { d.y = H + 10; d.x = Math.random() * W; }
        var al = d.a * (.6 + .4 * Math.sin(d.p));
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(179,149,86," + al.toFixed(3) + ")";
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(draw);
    }
    size(); draw();
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(size, 200); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        var vis = en[0].isIntersecting;
        if (vis && !running) { running = true; draw(); }
        if (!vis) { running = false; cancelAnimationFrame(raf); }
      }).observe(canvas);
    }
  }

  /* ---------- المقطع التعريفي: يُحمَّل يوتيوب عند الضغط فقط ---------- */
  $$("[data-yt]").forEach(function (btn) {
    var img = $("img", btn), fb = img && img.getAttribute("data-fallback");
    function useFallback() { if (fb && img.src !== fb) img.src = fb; }
    if (img) {
      img.addEventListener("error", function () { if (fb && img.src !== fb) useFallback(); else img.hidden = true; });
      // يوتيوب يعيد صورة 120×90 حين لا تتوفر النسخة عالية الدقة
      img.addEventListener("load", function () { if (img.naturalWidth <= 120) useFallback(); });
      if (img.complete && img.naturalWidth && img.naturalWidth <= 120) useFallback();
    }
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-yt");
      if (!/^[A-Za-z0-9_-]{11}$/.test(id)) return;
      var wrap = document.createElement("div");
      wrap.className = "video-frame";
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
      f.title = btn.getAttribute("data-yt-title") || "مقطع فيديو";
      f.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      f.setAttribute("allowfullscreen", "");
      f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      wrap.appendChild(f);
      btn.parentNode.replaceChild(wrap, btn);
    });
  });

  /* ---------- زر العودة للأعلى ---------- */
  $$("[data-to-top]").forEach(function (b) {
    b.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); });
  });

  /* ---------- حماية المحتوى المرئي (تقليل التنزيل) ---------- */
  document.addEventListener("contextmenu", function (e) {
    if (e.target.closest("img, .lightbox, .g-item, .album, .ach-media, .feature-media, video")) e.preventDefault();
  });
  document.addEventListener("dragstart", function (e) { if (e.target.tagName === "IMG") e.preventDefault(); });

  /* =========================================================
     العارض (Lightbox): صور + يوتيوب، سحب، تكبير، لوحة مفاتيح
     ========================================================= */
  var ICONS = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/></svg>'
  };

  var LB = null;
  function buildLightbox() {
    var el = document.createElement("div");
    el.className = "lightbox";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", "عارض الصور");
    el.innerHTML =
      '<div class="lb-top"><span class="lb-counter"></span><div class="lb-actions">' +
      '<button class="lb-btn lb-zoom" type="button" aria-label="تكبير">' + ICONS.zoom + '</button>' +
      '<button class="lb-btn lb-close" type="button" aria-label="إغلاق">' + ICONS.close + '</button></div></div>' +
      '<div class="lb-stage"><button class="lb-btn lb-nav lb-prev" type="button" aria-label="السابق">' + ICONS.prev + '</button>' +
      '<div class="lb-track"></div>' +
      '<button class="lb-btn lb-nav lb-next" type="button" aria-label="التالي">' + ICONS.next + '</button></div>' +
      '<div class="lb-cap" aria-live="polite"></div>';
    document.body.appendChild(el);

    var state = { items: [], i: 0, scale: 1, tx: 0, ty: 0, lastFocus: null };
    var track = $(".lb-track", el), cap = $(".lb-cap", el), counter = $(".lb-counter", el);
    var zoomBtn = $(".lb-zoom", el);
    var media = null;

    function apply(anim) {
      if (!media) return;
      media.style.transition = anim ? "" : "none";
      media.style.transform = "translate(" + state.tx + "px," + state.ty + "px) scale(" + state.scale + ")";
      media.classList.toggle("zoomed", state.scale > 1);
    }
    function resetZoom() { state.scale = 1; state.tx = 0; state.ty = 0; apply(true); }

    function render() {
      var it = state.items[state.i];
      track.textContent = "";
      media = document.createElement("div");
      media.className = "lb-media enter";
      if (it.type === "youtube") {
        var v = document.createElement("div");
        v.className = "lb-video";
        var f = document.createElement("iframe");
        f.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(it.id) + "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
        f.title = it.caption || "مقطع فيديو";
        f.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen";
        f.setAttribute("allowfullscreen", "");
        f.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        f.loading = "lazy";
        v.appendChild(f);
        media.appendChild(v);
        zoomBtn.hidden = true;
      } else {
        var img = document.createElement("img");
        img.src = it.src;
        img.alt = it.caption || "";
        img.draggable = false;
        img.decoding = "async";
        media.appendChild(img);
        var sh = document.createElement("div");
        sh.className = "shield";
        media.appendChild(sh);
        zoomBtn.hidden = false;
      }
      track.appendChild(media);
      cap.textContent = it.caption || "";
      counter.textContent = state.items.length > 1 ? (state.i + 1) + " / " + state.items.length : "";
      var multi = state.items.length > 1;
      $(".lb-prev", el).hidden = !multi;
      $(".lb-next", el).hidden = !multi;
      state.scale = 1; state.tx = 0; state.ty = 0;
      // تحميل مسبق للصورة التالية
      var nx = state.items[(state.i + 1) % state.items.length];
      if (nx && nx.type !== "youtube") { var pre = new Image(); pre.src = nx.src; }
    }
    function go(d) {
      if (state.items.length < 2) return;
      state.i = (state.i + d + state.items.length) % state.items.length;
      render();
    }
    function open(items, i) {
      state.items = items; state.i = i || 0; state.lastFocus = document.activeElement;
      render();
      el.classList.add("open");
      document.body.classList.add("no-scroll");
      setTimeout(function () { $(".lb-close", el).focus({ preventScroll: true }); }, 50);
    }
    function close() {
      el.classList.remove("open");
      document.body.classList.remove("no-scroll");
      setTimeout(function () { if (!el.classList.contains("open")) track.textContent = ""; }, 350);
      if (state.lastFocus && state.lastFocus.focus) state.lastFocus.focus({ preventScroll: true });
    }

    $(".lb-close", el).addEventListener("click", close);
    // في واجهة RTL: «التالي» على اليسار
    $(".lb-next", el).addEventListener("click", function () { go(1); });
    $(".lb-prev", el).addEventListener("click", function () { go(-1); });
    zoomBtn.addEventListener("click", function () {
      if (state.scale > 1) resetZoom(); else { state.scale = 2.2; apply(true); }
    });
    $(".lb-stage", el).addEventListener("click", function (e) { if (e.target === e.currentTarget || e.target === track) close(); });
    document.addEventListener("keydown", function (e) {
      if (!el.classList.contains("open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") go(1);
      else if (e.key === "ArrowRight") go(-1);
      else if (e.key === "Tab") {
        var f = $$("button:not([hidden])", el);
        var idx = f.indexOf(document.activeElement);
        e.preventDefault();
        f[(idx + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
      }
    });

    // اللمس: سحب للتنقل، نقر مزدوج للتكبير، سحب للتحريك عند التكبير، قرصة للتكبير
    var pts = {}, startX = 0, startY = 0, dx = 0, dy = 0, lastTap = 0, pinchDist = 0, pinchScale = 1, moved = false;
    var stage = $(".lb-stage", el);
    function dist() { var k = Object.keys(pts); if (k.length < 2) return 0; var a = pts[k[0]], b = pts[k[1]]; return Math.hypot(a.x - b.x, a.y - b.y); }
    stage.addEventListener("pointerdown", function (e) {
      if (e.target.closest(".lb-btn")) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      if (Object.keys(pts).length === 2) { pinchDist = dist(); pinchScale = state.scale; return; }
      startX = e.clientX - state.tx; startY = e.clientY - state.ty;
      dx = 0; dy = 0; moved = false;
      stage.setPointerCapture && stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener("pointermove", function (e) {
      if (!pts[e.pointerId] || !media) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var keys = Object.keys(pts);
      if (keys.length === 2 && pinchDist) {
        state.scale = Math.max(1, Math.min(4, pinchScale * dist() / pinchDist));
        apply(false); moved = true; return;
      }
      if (state.scale > 1) {
        state.tx = e.clientX - startX; state.ty = e.clientY - startY; apply(false); moved = true;
      } else {
        dx = e.clientX - (startX + state.tx); dy = e.clientY - (startY + state.ty);
        if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
        if (state.items.length > 1 && Math.abs(dx) > Math.abs(dy)) {
          media.style.transition = "none";
          media.style.transform = "translateX(" + dx + "px)";
          media.style.opacity = String(1 - Math.min(.5, Math.abs(dx) / 600));
        } else if (dy > 0) {
          media.style.transition = "none";
          media.style.transform = "translateY(" + dy + "px)";
          el.style.backgroundColor = "rgba(24,23,17," + (0.94 - Math.min(.5, dy / 600)).toFixed(2) + ")";
        }
      }
    });
    function end(e) {
      if (!pts[e.pointerId]) return;
      delete pts[e.pointerId];
      if (Object.keys(pts).length) return;
      pinchDist = 0;
      el.style.backgroundColor = "";
      if (!media) return;
      if (state.scale > 1) { if (state.scale < 1.05) resetZoom(); return; }
      media.style.opacity = "";
      if (state.items.length > 1 && Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)) { go(dx > 0 ? 1 : -1); return; }
      if (dy > 110 && Math.abs(dy) > Math.abs(dx)) { close(); return; }
      media.style.transition = ""; media.style.transform = "";
      if (!moved) {
        var now = Date.now();
        if (now - lastTap < 300 && state.items[state.i].type !== "youtube") {
          var r = media.getBoundingClientRect();
          state.scale = 2.2;
          state.tx = (r.left + r.width / 2 - e.clientX) * 1.2;
          state.ty = (r.top + r.height / 2 - e.clientY) * 1.2;
          apply(true); lastTap = 0;
        } else lastTap = now;
      }
    }
    stage.addEventListener("pointerup", end);
    stage.addEventListener("pointercancel", end);
    // منع تكبير الصفحة بالكامل على آيفون داخل العارض
    el.addEventListener("gesturestart", function (e) { e.preventDefault(); });
    el.addEventListener("touchmove", function (e) { e.preventDefault(); }, { passive: false });
    stage.addEventListener("dblclick", function (e) { e.preventDefault(); });

    return { open: open, close: close };
  }
  window.HAWAMY.lightbox = function (items, i) {
    if (!LB) LB = buildLightbox();
    LB.open(items, i);
  };

  // صور قابلة للتكبير مباشرة عبر data-zoom
  document.addEventListener("click", function (e) {
    var z = e.target.closest("[data-zoom]");
    if (!z) return;
    e.preventDefault();
    var group = z.getAttribute("data-zoom-group");
    var nodes = group ? $$('[data-zoom-group="' + group + '"]') : [z];
    var items = nodes.map(function (n) { return { type: "image", src: n.getAttribute("data-zoom"), caption: n.getAttribute("data-caption") || "" }; });
    window.HAWAMY.lightbox(items, Math.max(0, nodes.indexOf(z)));
  });
})();
