/* ==========================================================================
   Portfolio behaviour. You normally don't need to edit this file —
   all content lives in data.js, the 3D scene lives in scene.js.
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Link helpers (YouTube / Google Drive) ---------- */
  function parseLink(url) {
    if (!url || !url.trim()) return null;
    url = url.trim();
    const yt = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/))([\w-]{11})/);
    if (yt) return { kind: "youtube", id: yt[1], url };
    const gd = url.match(/drive\.google\.com\/(?:file\/d\/|open\?(?:.*&)?id=|uc\?(?:.*&)?id=)([\w-]{10,})/);
    if (gd) return { kind: "drive", id: gd[1], url };
    return { kind: "other", url };
  }
  const embedUrl = (i) =>
    i.kind === "youtube" ? `https://www.youtube-nocookie.com/embed/${i.id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`
    : i.kind === "drive" ? `https://drive.google.com/file/d/${i.id}/preview` : null;
  const autoThumb = (i) =>
    !i ? "" : i.kind === "youtube" ? `https://i.ytimg.com/vi/${i.id}/hqdefault.jpg`
    : i.kind === "drive" ? `https://drive.google.com/thumbnail?id=${i.id}&sz=w1000` : "";
  function titleCard(title, label) {
    const c = el("div", "thumb title-card");
    c.append(el("b", "", title), el("small", "", label || ""));
    return c;
  }
  // Image for a gallery slide: a Drive file link/ID becomes a Drive image URL; anything else is used as-is.
  function slideSrc(x, size = 1600) {
    const m = String(x).match(/\/d\/([\w-]{20,})/) || String(x).match(/[?&]id=([\w-]{20,})/) || String(x).match(/^([\w-]{25,})$/);
    return m ? `https://drive.google.com/thumbnail?id=${m[1]}&sz=w${size}` : x;
  }
  const isGallery = (p) => Array.isArray(p.images) && p.images.length > 0;

  function thumbEl(p, label) {
    const src = p.thumbnail || (isGallery(p) ? slideSrc(p.images[0], 1000) : autoThumb(parseLink(p.link)));
    if (!src) return titleCard(p.title, label);
    const img = el("img", "thumb");
    img.alt = p.title;
    img.loading = "lazy";
    img.referrerPolicy = "no-referrer";
    img.src = src;
    img.onerror = () => img.replaceWith(titleCard(p.title, label));
    return img;
  }

  /* ---------- Content ---------- */
  const [first, ...rest] = PROFILE.name.split(" ");
  document.title = `${PROFILE.name} — Video Editor`;
  $("#brand-name").textContent = PROFILE.name;
  $("#brand-title").textContent = PROFILE.title;
  $("#ld-name").textContent = PROFILE.name;
  $("#hero-first").textContent = first;
  $("#hero-last").textContent = rest.join(" ");
  $("#hero-bio").textContent = PROFILE.bio;
  $("#hero-loc").innerHTML = "";
  [`Based in ${PROFILE.location}`, "Available worldwide"].forEach((t) => { $("#hero-loc").append(el("span", "", t), el("br")); });
  $("#avatar").src = PROFILE.avatar || PROFILE.photo;
  $("#avatar").alt = PROFILE.name;
  $("#foot-name").textContent = `© ${new Date().getFullYear()} ${PROFILE.name}`;

  if (SETTINGS.showreel) {
    const b = $("#showreel-btn");
    b.hidden = false;
    b.addEventListener("click", () => openVideo({ title: "Showreel", link: SETTINGS.showreel, vertical: SETTINGS.showreelVertical }));
  }
  if (PROFILE.resumeLink) { const r = $("#resume-link"); r.href = PROFILE.resumeLink; r.hidden = false; }

  // statement — lights up word by word while scrolling
  const accent = /stories|people|numbers/i;
  (PROFILE.statement || "").split(/\s+/).forEach((w) => {
    $("#statement").append(el("span", "sw" + (accent.test(w) ? " acc" : ""), w), " ");
  });
  const words = $$("#statement .sw");

  // stats
  PROFILE.stats.forEach((s, i) => {
    const d = el("div", "stat");
    d.style.setProperty("--i", i);
    const b = el("b");
    const num = el("span", "", "0");
    num.dataset.value = s.value;
    b.append(num, el("sup", "", s.suffix));
    d.append(b, el("span", "st-l", s.label));
    $("#stats").append(d);
  });

  // marquee (doubled for a seamless loop)
  const mq = PROFILE.marquee || [];
  [...mq, ...mq].forEach((t) => $("#marquee").append(el("span", "", t)));

  // résumé — work experience, then education, as matching timelines
  function timeline(list, target, opts = {}) {
    list.forEach((r, i, arr) => {
      const li = el("li", "tl-item reveal" + (/now|current/i.test(r.years) ? " now" : "") + (opts.cls ? " " + opts.cls : ""));
      li.style.setProperty("--d", i * 70 + "ms");
      const org = el("div");
      if (r.tag) org.append(el("span", "tl-tag mono", r.tag));
      org.append(el("div", "tl-org", r.org), el("span", "tl-role", r.role));
      const ul = el("ul", "tl-details");
      (r.details || []).forEach((d) => ul.append(el("li", "", d)));
      li.append(el("div", "tl-years", r.years), org, ul, el("div", "tl-idx", String(opts.reverse ? arr.length - i : i + 1).padStart(2, "0")));
      $(target).append(li);
    });
  }
  timeline(RESUME.slice().reverse(), "#timeline", { reverse: true });
  if (typeof EDUCATION !== "undefined") timeline(EDUCATION, "#edu-timeline", { cls: "edu" });

  SKILLS.forEach((g, gi) => {
    const box = el("div", "skill-box reveal");
    box.style.setProperty("--d", gi * 120 + "ms");
    const h = el("h3", "", g.group);
    h.append(el("small", "", String(g.items.length).padStart(2, "0") + " tools"));
    box.append(h);
    const chips = el("div", "chips");
    g.items.forEach((it) => {
      const c = el("div", "chip");
      c.append(el("i", "", it.short), document.createTextNode(it.name));
      chips.append(c);
    });
    box.append(chips);
    $("#skills").append(box);
  });

  // works
  const hover = $("#hover-thumb");
  let total = 0;
  WORKS.forEach((cat) => {
    const sec = el("article", "cat reveal");
    const head = el("div", "cat-head");
    head.append(el("span", "cat-num", cat.number), el("h3", "", cat.title), el("p", "cat-sub", cat.subtitle));
    if (cat.role) head.append(el("p", "cat-role", cat.role));
    sec.append(head);
    const rows = el("div", "rows");
    cat.projects.forEach((p, i) => {
      total++;
      const has = isGallery(p) || !!parseLink(p.link);
      const row = el(has ? "button" : "div", "row " + (has ? "has-link" : "no-link"));
      const th = el("span", "r-thumb");
      th.append(thumbEl(p, cat.title));
      row.append(
        th,
        el("span", "r-n", String(i + 1).padStart(2, "0")),
        el("span", "r-title", p.title),
        el("span", "r-type", p.type || ""),
        el("span", "r-year", p.year || ""),
        el("span", "r-go", has ? "↗" : "Coming soon")
      );
      if (has) {
        row.dataset.cursor = isGallery(p) ? "View" : "Play";
        row.addEventListener("click", () => (isGallery(p) ? openGallery(p) : openVideo(p)));
      }
      row.addEventListener("mouseenter", () => {
        hover.innerHTML = "";
        hover.append(thumbEl(p, cat.title));
        hover.classList.toggle("vertical", !!p.vertical && !p.thumbnail); // custom thumbnails are wide (16:9)
        hover.classList.add("on");
      });
      row.addEventListener("mouseleave", () => hover.classList.remove("on"));
      rows.append(row);
    });
    sec.append(rows);
    if (cat.comingSoon) {
      sec.classList.add("cat-soon");
      const soon = el("div", "soon-panel");
      const dot = el("span", "soon-dot");
      soon.append(dot, el("span", "soon-label mono", "Coming soon"), el("p", "soon-text", cat.comingSoonText || ""));
      sec.append(soon);
    }
    if (Array.isArray(cat.award) && cat.award.length) {
      const box = el("div", "cat-awards");
      box.append(el("p", "ca-label mono", `Recognition at ${cat.title} · ${String(cat.award.length).padStart(2, "0")}`));
      const grid = el("div", "ca-grid");
      cat.award.forEach((a, i) => {
        const card = el("div", "ca-card");
        card.style.setProperty("--d", i * 120 + "ms");
        const top = el("div", "ca-top");
        top.append(el("span", "ca-medal", i === 0 ? "★" : "✦"), el("span", "ca-when mono", a.when || ""));
        card.append(top, el("h4", "ca-title", a.title || ""));
        if (a.text) card.append(el("p", "ca-text", a.text));
        grid.append(card);
      });
      box.append(grid);
      sec.append(box);
    } else if (cat.award) sec.append(el("p", "award", cat.award));
    $("#works-list").append(sec);
  });
  if (typeof WORK_NOTE === "string" && WORK_NOTE.trim()) {
    const note = el("p", "work-note reveal");
    note.append(el("span", "wn-tag", "NDA"), document.createTextNode(WORK_NOTE));
    $("#works-list").append(note);
  }
  $("#works-count").textContent = `${String(total).padStart(2, "0")} projects`;

  // recognitions
  const glyphs = ["★", "✦", "♛"];
  RECOGNITIONS.forEach((r, i) => {
    const c = el("div", "rec-card reveal");
    c.style.setProperty("--d", i * 110 + "ms");
    c.append(el("span", "glyph", glyphs[i % glyphs.length]), el("span", "no", String(i + 1).padStart(2, "0")),
      el("span", "by", r.by), el("h3", "", r.title), el("p", "", r.text));
    $("#rec-grid").append(c);
  });
  VOLUNTEER.forEach((v) => $("#volunteer").append(el("li", "", v)));

  // contact
  const mail = $("#contact-mail");
  mail.href = `mailto:${PROFILE.email}`;
  mail.textContent = PROFILE.email;
  const meta = $("#contact-meta");
  const addMeta = (label, href) => {
    const n = el(href ? "a" : "span", "", label);
    if (href) { n.href = href; if (/^https?:/.test(href)) { n.target = "_blank"; n.rel = "noopener"; } }
    meta.append(n);
  };
  if (PROFILE.phone) addMeta(PROFILE.phone, "tel:" + PROFILE.phone.replace(/\s+/g, ""));
  addMeta(PROFILE.location);
  if (PROFILE.instagram) addMeta("Instagram ↗", PROFILE.instagram);
  if (PROFILE.linkedin) addMeta("LinkedIn ↗", PROFILE.linkedin);
  if (PROFILE.youtube) addMeta("YouTube ↗", PROFILE.youtube);

  /* ---------- Split headings into words for the reveal ---------- */
  $$(".split").forEach((h) => {
    let i = 0;
    const nodes = [...h.childNodes];
    h.innerHTML = "";
    nodes.forEach((n) => {
      const isEl = n.nodeType === 1;
      n.textContent.split(/\s+/).filter(Boolean).forEach((word) => {
        const w = el("span", "w");
        const inner = isEl ? n.cloneNode(false) : el("span");
        inner.textContent = word;
        const wrap = el("span");
        wrap.style.setProperty("--i", i++);
        wrap.append(inner);
        w.append(wrap);
        h.append(w, " ");
      });
    });
  });

  /* ---------- Smooth scroll ---------- */
  const lenis = window.Lenis && !reduce ? new window.Lenis({ lerp: 0.085, smoothWheel: true }) : null;
  if (lenis) {
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    const target = id === "#top" ? 0 : $(id);
    if (target == null) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { duration: 1.6 });
    else (target === 0 ? scrollTo({ top: 0, behavior: "smooth" }) : target.scrollIntoView({ behavior: "smooth" }));
  }));

  /* ---------- Loader ---------- */
  document.body.classList.add("loading");
  if (lenis) lenis.stop();
  const t0 = performance.now();
  let sceneOk = !!window.__sceneReady;
  addEventListener("scene-ready", () => (sceneOk = true));
  const ldCount = $("#ld-count"), ldBar = $("#ld-bar");
  let shown = 0;
  (function tick() {
    const elapsed = performance.now() - t0;
    const goal = sceneOk || elapsed > 6000 ? 100 : Math.min(90, elapsed / 18);
    shown += (goal - shown) * 0.12 + 0.3;
    shown = Math.min(shown, goal);
    ldCount.textContent = String(Math.floor(shown)).padStart(3, "0");
    ldBar.style.width = shown + "%";
    if (shown >= 99.9 && elapsed > 1300) return finishLoading();
    requestAnimationFrame(tick);
  })();
  let finished = false;
  setTimeout(() => finishLoading(), 7000); // safety net
  function finishLoading() {
    if (finished) return;
    finished = true;
    $("#loader").classList.add("done");
    document.body.classList.remove("loading");
    if (lenis) lenis.start();
    setTimeout(() => $(".hero-name").classList.add("in"), 250);
    setTimeout(() => $(".hero-name").classList.add("settled"), 2000);
    setTimeout(() => { $("#loader").remove(); window.__scene && window.__scene.rebuild(); }, 1300);
  }

  /* ---------- Custom cursor + hover preview ---------- */
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my, hx = mx, hy = my;
  if (fine) {
    document.body.classList.add("has-cursor");
    const cur = $("#cursor"), dot = $("#cursor-dot"), lab = $("#cursor-label");
    addEventListener("pointermove", (e) => { document.body.classList.add("cursor-on"); mx = e.clientX; my = e.clientY; dot.style.transform = `translate3d(${mx}px,${my}px,0)`; }, { passive: true });
    // hide the custom cursor when the mouse leaves the window (or goes into a video frame)
    document.addEventListener("mouseout", (e) => { if (!e.relatedTarget) document.body.classList.remove("cursor-on"); });
    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("[data-cursor]");
      cur.classList.toggle("big", !!t);
      lab.textContent = t ? t.dataset.cursor : "";
    });
    (function loop() {
      cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18;
      cur.style.transform = `translate3d(${cx}px,${cy}px,0)`;
      hx += (mx - hx) * 0.1; hy += (my - hy) * 0.1;
      const w = hover.offsetWidth, h = hover.offsetHeight;
      hover.style.transform = `translate3d(${Math.min(hx + 40, innerWidth - w - 20)}px,${clamp(hy - h / 2, 20, innerHeight - h - 20)}px,0)`;
      requestAnimationFrame(loop);
    })();
    // glow follows mouse on résumé cards
    $$(".tl-item").forEach((c) => c.addEventListener("pointermove", (e) => {
      const r = c.getBoundingClientRect();
      c.style.setProperty("--mx", e.clientX - r.left + "px");
      c.style.setProperty("--my", e.clientY - r.top + "px");
    }));
    // magnetic email button
    const mb = $("#contact-mail");
    mb.addEventListener("pointermove", (e) => {
      const r = mb.getBoundingClientRect();
      mb.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    mb.addEventListener("pointerleave", () => (mb.style.transform = ""));
  }

  /* ---------- Video popup ---------- */
  const modal = $("#modal"), frame = $("#modal-frame"), inner = $("#modal-inner");
  let lastFocus = null;
  function openVideo(p) {
    const info = parseLink(p.link);
    if (!info) return;
    const src = embedUrl(info);
    // YouTube refuses embeds on pages opened straight from disk (file://) → new tab there.
    const fileMode = location.protocol === "file:" && info.kind === "youtube";
    if (!src || SETTINGS.openVideosIn === "newtab" || fileMode) { window.open(info.url, "_blank", "noopener"); return; }
    lastFocus = document.activeElement;
    frame.innerHTML = "";
    const f = document.createElement("iframe");
    f.src = src;
    f.title = p.title;
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    f.referrerPolicy = "strict-origin-when-cross-origin";
    frame.append(f);
    inner.classList.toggle("vertical", !!p.vertical);
    $("#modal-title").textContent = p.title;
    $("#modal-open").href = info.url;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    hover.classList.remove("on");
    if (lenis) lenis.stop();
    document.body.style.overflow = "hidden";
    $("#modal-close").focus();
  }
  // Image carousel popup (for design work like social carousels)
  let gal = null;
  function openGallery(p) {
    lastFocus = document.activeElement;
    frame.innerHTML = "";
    const track = el("div", "g-track");
    p.images.forEach((x, i) => {
      const fig = el("figure", "g-slide");
      if (p.ratio) {
        fig.style.aspectRatio = p.ratio;
        const [w, h] = String(p.ratio).split("/").map(Number);
        if (w > h) { fig.classList.add("wide"); } // landscape renders: size by width, not height
      }
      const img = el("img");
      img.src = slideSrc(x);
      img.alt = `${p.title} — slide ${i + 1}`;
      img.referrerPolicy = "no-referrer";
      img.loading = i < 2 ? "eager" : "lazy";
      fig.append(img);
      track.append(fig);
    });
    const prev = el("button", "g-nav g-prev", "←"), next = el("button", "g-nav g-next", "→");
    prev.setAttribute("aria-label", "Previous slide"); next.setAttribute("aria-label", "Next slide");
    const dots = el("div", "g-dots");
    p.images.forEach((_, i) => { const d = el("button", "g-dot"); d.setAttribute("aria-label", `Slide ${i + 1}`); d.onclick = () => go(i); dots.append(d); });
    const count = el("span", "g-count mono");
    frame.append(track, prev, next, dots, count);
    const n = p.images.length;
    let cur = 0;
    let anim = 0;
    const go = (i) => {
      cur = Math.max(0, Math.min(n - 1, i));
      const from = track.scrollLeft, to = Math.min(track.children[cur].offsetLeft, track.scrollWidth - track.clientWidth), t0 = performance.now();
      cancelAnimationFrame(anim);
      track.style.scrollSnapType = "none";
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 520), e = 1 - Math.pow(1 - k, 3);
        track.scrollLeft = from + (to - from) * e;
        if (k < 1) anim = requestAnimationFrame(step); else { track.style.scrollSnapType = ""; sync(); }
      };
      anim = requestAnimationFrame(step);
    };
    const sync = () => {
      const w = track.children[0].offsetWidth + 16;
      cur = Math.round(track.scrollLeft / w);
      [...dots.children].forEach((d, i) => d.classList.toggle("on", i === cur));
      count.textContent = `${String(cur + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;
      prev.disabled = cur === 0; next.disabled = cur >= n - 1;
    };
    track.addEventListener("scroll", () => requestAnimationFrame(sync), { passive: true });
    prev.onclick = () => go(cur - 1); next.onclick = () => go(cur + 1);
    gal = { go: (d) => go(cur + d) };
    frame.classList.add("gallery");
    inner.classList.remove("vertical");
    inner.classList.add("is-gallery");
    $("#modal-title").textContent = p.title;
    const info = parseLink(p.link);
    $("#modal-open").href = info ? info.url : slideSrc(p.images[0]);
    modal.hidden = false;
    document.body.classList.add("modal-open");
    hover.classList.remove("on");
    if (lenis) lenis.stop();
    document.body.style.overflow = "hidden";
    requestAnimationFrame(sync);
    $("#modal-close").focus();
  }
  addEventListener("keydown", (e) => {
    if (!gal || modal.hidden) return;
    if (e.key === "ArrowRight") gal.go(1);
    if (e.key === "ArrowLeft") gal.go(-1);
  });

  function closeVideo() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    const c = $("#cursor"); if (c) c.classList.remove("big");
    frame.innerHTML = "";
    frame.classList.remove("gallery");
    inner.classList.remove("is-gallery");
    gal = null;
    document.body.style.overflow = "";
    if (lenis) lenis.start();
    if (lastFocus) lastFocus.focus();
  }
  $("#modal-close").addEventListener("click", closeVideo);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeVideo(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeVideo(); });

  /* ---------- Scroll-driven UI ---------- */
  const intro = $(".intro"), stats = $("#stats");
  const tc = $("#tc"), bar = $("#scrub-bar"), hudScene = $("#hud-scene");
  const sections = $$("main > section");
  const navLinks = $$(".nav a");
  const FPS = 25;
  const fmt = (sec) => {
    const s = Math.floor(sec);
    return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60, Math.floor((sec % 1) * FPS)]
      .map((n) => String(n).padStart(2, "0")).join(":");
  };
  let counted = false;
  function countUp() {
    counted = true;
    $$(".stat b > span").forEach((n) => {
      const target = +n.dataset.value, s0 = performance.now();
      const step = (t) => {
        const k = ease(clamp((t - s0) / 1600));
        n.textContent = Math.round(target * k);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }
  function onScroll() {
    const vh = innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    const g = clamp(scrollY / (max || 1));
    bar.style.width = g * 100 + "%";
    tc.textContent = fmt(g * 180);

    const r = intro.getBoundingClientRect();
    const p = clamp((vh * 0.35 - r.top) / (r.height - vh * 0.6));
    const lit = Math.floor(p * 1.35 * words.length);
    words.forEach((w, i) => w.classList.toggle("lit", i < lit));
    if (p > 0.6) { stats.classList.add("in"); if (!counted) countUp(); }

    let idx = 0;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top < vh * 0.5) idx = i; });
    const name = sections[idx].dataset.scene || "";
    hudScene.textContent = `SC ${String(idx + 1).padStart(2, "0")} — ${name}`;
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + sections[idx].id));
  }
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: "0px 0px -5% 0px" });
  $$(".reveal, .split").forEach((n) => io.observe(n));

  if (document.fonts) document.fonts.ready.then(() => window.__scene && window.__scene.rebuild());
})();
