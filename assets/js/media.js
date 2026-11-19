/* صفحة المحتوى المرئي: ألبومات حسب السنة/المناسبة + مقاطع يوتيوب + عارض */
(function () {
  "use strict";
  var DATA = window.HAWAMY_MEDIA;
  var root = document.getElementById("media-root");
  if (!DATA || !root) return;

  var I = {
    img: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>',
    vid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="15" height="14" rx="3"/><path d="m17 10 5-3v10l-5-3"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.4-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5z"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    soon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/></svg>'
  };

  var albums = DATA.albums.slice().sort(function (a, b) { return b.year - a.year; });
  var state = { tab: "albums", year: "all", occasion: "all" };

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  function ytThumb(id) { return "https://i.ytimg.com/vi/" + encodeURIComponent(id) + "/hqdefault.jpg"; }
  function thumbOf(it) { return it.type === "youtube" ? ytThumb(it.id) : (it.thumb || it.src); }
  function lazyImg(src, alt) {
    var img = el("img");
    img.alt = alt || ""; img.loading = "lazy"; img.decoding = "async"; img.draggable = false;
    img.addEventListener("load", function () { img.classList.add("loaded"); });
    img.src = src;
    if (img.complete) img.classList.add("loaded");
    return img;
  }
  function filtered() {
    return albums.filter(function (a) {
      return (state.year === "all" || String(a.year) === state.year) && (state.occasion === "all" || a.occasion === state.occasion);
    });
  }

  /* ---------- أزرار التبويب والتصفية ---------- */
  var tabs = document.getElementById("media-tabs");
  var yearF = document.getElementById("year-filters");
  var occF = document.getElementById("occ-filters");
  var filtersWrap = document.getElementById("media-filters");

  function setupTabs() {
    var btns = Array.prototype.slice.call(tabs.querySelectorAll("button"));
    var pill = tabs.querySelector(".seg-pill");
    function move() {
      var active = btns.filter(function (b) { return b.getAttribute("aria-selected") === "true"; })[0];
      if (!active || !pill) return;
      var pr = tabs.getBoundingClientRect(), r = active.getBoundingClientRect();
      pill.style.width = r.width + "px";
      pill.style.right = (pr.right - r.right) + "px";
    }
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        state.tab = b.getAttribute("data-tab");
        btns.forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
        move();
        if (location.hash) history.replaceState(null, "", location.pathname);
        render();
      });
    });
    window.addEventListener("resize", move);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(move);
    move();
  }

  function chips(container, values, labels, key) {
    container.textContent = "";
    var counts = { all: 0 };
    albums.forEach(function (a) { var v = String(a[key]); counts[v] = (counts[v] || 0) + 1; counts.all++; });
    if (values.length < 2) { container.parentNode.hidden = true; return; }
    container.parentNode.hidden = false;
    ["all"].concat(values).forEach(function (v) {
      var b = el("button", "chip");
      b.type = "button";
      b.setAttribute("aria-pressed", state[key] === v ? "true" : "false");
      b.appendChild(document.createTextNode(v === "all" ? "الكل" : labels(v)));
      b.appendChild(el("span", "count", String(counts[v] || 0)));
      b.addEventListener("click", function () {
        state[key] = v;
        chips(container, values, labels, key);
        if (location.hash) history.replaceState(null, "", location.pathname);
        render();
      });
      container.appendChild(b);
    });
  }
  function setupFilters() {
    var years = [], occs = [];
    albums.forEach(function (a) {
      if (years.indexOf(String(a.year)) < 0) years.push(String(a.year));
      if (occs.indexOf(a.occasion) < 0) occs.push(a.occasion);
    });
    chips(yearF, years, function (v) { return v + "هـ"; }, "year");
    chips(occF, occs, function (v) { return DATA.occasions[v] || v; }, "occasion");
    filtersWrap.hidden = yearF.parentNode.hidden && occF.parentNode.hidden;
  }

  /* ---------- العرض ---------- */
  function emptyState(title, text) {
    var e = el("div", "empty");
    e.setAttribute("data-reveal", "");
    var ic = el("div", "ic"); ic.innerHTML = I.soon; e.appendChild(ic);
    e.appendChild(el("h3", null, title));
    e.appendChild(el("p", null, text));
    return e;
  }

  function groupByYear(list, fn) {
    var frag = document.createDocumentFragment();
    var years = [];
    list.forEach(function (x) { if (years.indexOf(x.year) < 0) years.push(x.year); });
    years.forEach(function (y) {
      var block = el("section", "year-block");
      var head = el("div", "year-head");
      head.setAttribute("data-reveal", "fade");
      head.appendChild(el("h2", null, "عام " + y + "هـ"));
      var inYear = list.filter(function (x) { return x.year === y; });
      head.appendChild(el("span", "n", fn.countLabel(inYear)));
      block.appendChild(head);
      block.appendChild(fn.grid(inYear));
      frag.appendChild(block);
    });
    return frag;
  }

  function albumCard(a) {
    var imgs = a.items.filter(function (i) { return i.type !== "youtube"; }).length;
    var vids = a.items.length - imgs;
    var b = el("button", "album");
    b.type = "button";
    b.setAttribute("data-reveal", "");
    b.setAttribute("aria-label", "فتح ألبوم: " + a.title);
    var cover = el("div", "album-cover");
    var cv = a.cover || (a.items[0] ? thumbOf(a.items[0]) : "");
    if (cv) cover.appendChild(lazyImg(cv, a.title));
    var cnt = el("div", "album-count");
    if (imgs) { var s1 = el("span"); s1.innerHTML = I.img; s1.appendChild(document.createTextNode(imgs)); cnt.appendChild(s1); }
    if (vids) { var s2 = el("span"); s2.innerHTML = I.vid; s2.appendChild(document.createTextNode(vids)); cnt.appendChild(s2); }
    cover.appendChild(cnt);
    b.appendChild(cover);
    var body = el("div", "album-body");
    body.appendChild(el("h3", null, a.title));
    body.appendChild(el("p", null, (DATA.occasions[a.occasion] || "") + " · " + (a.date || a.year + "هـ")));
    b.appendChild(body);
    b.addEventListener("click", function () { location.hash = "album=" + encodeURIComponent(a.id); });
    return b;
  }

  function galleryGrid(items, captionFallback) {
    var g = el("div", "gallery");
    g.setAttribute("data-stagger", "0.05");
    items.forEach(function (it, i) {
      var b = el("button", "g-item" + (it.type === "youtube" ? " video wide" : ""));
      b.type = "button";
      b.setAttribute("data-reveal", "zoom");
      b.setAttribute("aria-label", (it.type === "youtube" ? "تشغيل: " : "عرض: ") + (it.caption || captionFallback || ""));
      b.appendChild(lazyImg(thumbOf(it), it.caption || captionFallback));
      if (it.type === "youtube") { var p = el("span", "play"); p.innerHTML = I.play; b.appendChild(p); }
      if (it.caption) b.appendChild(el("span", "cap", it.caption));
      b.addEventListener("click", function () { window.HAWAMY.lightbox(items, i); });
      g.appendChild(b);
    });
    return g;
  }

  function renderAlbums() {
    var list = filtered();
    if (!list.length) { root.appendChild(emptyState("لا توجد ألبومات مطابقة", "جرّب اختيار سنة أو مناسبة أخرى.")); return; }
    root.appendChild(groupByYear(list, {
      countLabel: function (l) { return l.length + (l.length === 1 ? " ألبوم" : l.length === 2 ? " ألبومان" : " ألبومات"); },
      grid: function (l) {
        var g = el("div", "albums"); g.setAttribute("data-stagger", "0.08");
        l.forEach(function (a) { g.appendChild(albumCard(a)); });
        return g;
      }
    }));
  }

  function renderVideos() {
    var vids = [];
    filtered().forEach(function (a) {
      a.items.forEach(function (it) { if (it.type === "youtube") vids.push({ year: a.year, item: it, album: a }); });
    });
    if (!vids.length) {
      root.appendChild(emptyState("المقاطع المرئية قريبًا بإذن الله", "نعمل على إضافة مقاطع من مسيرة المجمع ومناسباته عبر السنوات."));
      return;
    }
    root.appendChild(groupByYear(vids, {
      countLabel: function (l) { return l.length + " مقطع"; },
      grid: function (l) { return galleryGrid(l.map(function (v) { return v.item; })); }
    }));
  }

  function renderAlbum(id) {
    var a = albums.filter(function (x) { return x.id === id; })[0];
    if (!a) { history.replaceState(null, "", location.pathname); render(); return; }
    var head = el("div", "album-view-head");
    head.setAttribute("data-reveal", "fade");
    var t = el("div");
    t.appendChild(el("h2", null, a.title));
    t.appendChild(el("p", null, (DATA.occasions[a.occasion] || "") + " · " + (a.date || a.year + "هـ") + " · " + a.items.length + " عنصر"));
    var back = el("button", "back-btn");
    back.type = "button";
    back.innerHTML = I.back;
    back.appendChild(document.createTextNode("كل الألبومات"));
    back.addEventListener("click", function () { history.length > 1 && /album=/.test(location.hash) ? history.back() : (location.hash = ""); });
    head.appendChild(t);
    head.appendChild(back);
    root.appendChild(head);
    root.appendChild(galleryGrid(a.items, a.title));
  }

  function render() {
    root.textContent = "";
    var m = /album=([^&]+)/.exec(location.hash);
    var inAlbum = !!m;
    filtersWrap.classList.toggle("is-hidden", inAlbum);
    tabs.parentNode.hidden = inAlbum;
    if (filtersWrap.classList.contains("is-hidden")) filtersWrap.hidden = true; else setupFilters();
    if (inAlbum) renderAlbum(decodeURIComponent(m[1]));
    else if (state.tab === "videos") renderVideos();
    else renderAlbums();
    window.HAWAMY.reveal(root);
  }

  window.addEventListener("hashchange", function () {
    render();
    var top = document.getElementById("media").getBoundingClientRect().top + window.scrollY - 90;
    if (window.scrollY > top) window.scrollTo({ top: top, behavior: "smooth" });
  });

  setupTabs();
  render();
})();
