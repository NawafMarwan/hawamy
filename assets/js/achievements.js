/* صفحة الإنجازات: تصفية حسب التصنيف + خط زمني حسب السنة الهجرية */
(function () {
  "use strict";
  var DATA = window.HAWAMY_ACHIEVEMENTS;
  var root = document.getElementById("achievements");
  var filtersEl = document.getElementById("ach-filters");
  if (!DATA || !root) return;

  var CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>';
  var items = DATA.items.slice().sort(function (a, b) { return b.year - a.year; });
  var current = "all";

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function buildFilters() {
    var counts = { all: items.length };
    items.forEach(function (it) { counts[it.category] = (counts[it.category] || 0) + 1; });
    var keys = ["all"].concat(Object.keys(DATA.categories).filter(function (k) { return counts[k]; }));
    filtersEl.textContent = "";
    if (keys.length < 3) { filtersEl.hidden = true; return; } // تصنيف واحد فقط: لا داعي للتصفية
    keys.forEach(function (k) {
      var b = el("button", "chip");
      b.type = "button";
      b.setAttribute("aria-pressed", k === current ? "true" : "false");
      b.appendChild(document.createTextNode(k === "all" ? "الكل" : DATA.categories[k]));
      b.appendChild(el("span", "count", String(counts[k])));
      b.addEventListener("click", function () { current = k; buildFilters(); render(); });
      filtersEl.appendChild(b);
    });
  }

  function card(it) {
    var art = el("article", "ach-card");
    if (it.images && it.images.length) {
      var m = el("div", "ach-media");
      it.images.forEach(function (im, i) {
        var b = el("button");
        b.type = "button";
        b.setAttribute("aria-label", "تكبير الصورة: " + (im.alt || it.title));
        var img = el("img");
        img.src = im.thumb || im.src; img.alt = im.alt || it.title; img.loading = "lazy"; img.decoding = "async"; img.draggable = false;
        b.appendChild(img);
        b.addEventListener("click", function () {
          window.HAWAMY.lightbox(it.images.map(function (x) { return { type: "image", src: x.src, caption: x.alt || it.title }; }), i);
        });
        m.appendChild(b);
      });
      art.appendChild(m);
    }
    var body = el("div", "ach-body");
    var meta = el("div", "ach-meta");
    meta.appendChild(el("span", "tag", DATA.categories[it.category] || ""));
    var d = el("span", "ach-date");
    d.innerHTML = CAL;
    d.appendChild(document.createTextNode(it.date || it.year + "هـ"));
    meta.appendChild(d);
    body.appendChild(meta);
    body.appendChild(el("h3", null, it.title));
    if (it.issuer) body.appendChild(el("div", "ach-issuer", it.issuer));
    if (it.description) body.appendChild(el("p", null, it.description));
    art.appendChild(body);
    return art;
  }

  function render() {
    root.textContent = "";
    var list = items.filter(function (it) { return current === "all" || it.category === current; });
    var tl = el("div", "timeline");
    var lastYear = null, n = 0;
    list.forEach(function (it) {
      if (it.year !== lastYear) {
        var y = el("div", "tl-year");
        y.setAttribute("data-reveal", "zoom");
        y.appendChild(el("span", null, it.year + "هـ"));
        tl.appendChild(y);
        lastYear = it.year; n = 0;
      }
      var wrap = el("div", "tl-item");
      // تبديل الجهة داخل كل سنة
      if (n % 2) wrap.classList.add("alt");
      wrap.setAttribute("data-reveal", n % 2 ? "left" : "right");
      wrap.appendChild(card(it));
      tl.appendChild(wrap);
      n++;
    });
    root.appendChild(tl);
    window.HAWAMY.reveal(root);
  }

  buildFilters();
  render();
})();
