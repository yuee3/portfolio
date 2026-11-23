/* ==========================================================================
   site.js — 交互：导航 / 首屏轮播 / 滚动显现 / 作品渲染 / 灯箱 / 视频播放
   ========================================================================== */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.prototype.slice.call(r.querySelectorAll(s));
  const CAT_LABEL = { portrait: "人像摄影", still: "物品摄影", landscape: "风景建筑", food: "食物摄影" };

  const PHOTOS = window.PHOTOS || [];
  const BY_SLUG = {};
  PHOTOS.forEach(p => { BY_SLUG[p.slug] = p; });

  const imgPath = (slug, thumb) =>
    "assets/img/photos/" + slug + (thumb ? "-t.jpg" : ".jpg");

  /* ---------------------------------------------------------------- nav */
  function initNav() {
    const nav = $(".nav");
    if (!nav) return;

    const solidAt = () => (document.body.dataset.nav === "solid" ? 0 : 40);
    const onScroll = () => {
      const force = document.body.dataset.nav === "solid";
      nav.classList.toggle("is-solid", force || window.scrollY > solidAt());
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const burger = $(".nav__burger");
    const closeMenu = () => {
      nav.classList.remove("is-open");
      document.body.classList.remove("is-menu");
    };
    if (burger) {
      burger.addEventListener("click", () => {
        const open = nav.classList.toggle("is-open");
        document.body.classList.toggle("is-menu", open);
        burger.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }
    $$(".nav__link, .nav__cta").forEach(a => a.addEventListener("click", closeMenu));
    window.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

    // active link
    const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    $$(".nav__link").forEach(a => {
      const href = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
      if (href && href === here) a.classList.add("is-active");
    });
  }

  /* --------------------------------------------------------------- hero */
  function initHero() {
    const slides = $$(".hero__slide");
    const dots = $$(".hero__dot");
    if (slides.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let i = 0;
    const show = n => {
      slides[i].classList.remove("is-active");
      if (dots[i]) dots[i].classList.remove("is-active");
      i = (n + slides.length) % slides.length;
      slides[i].classList.add("is-active");
      if (dots[i]) dots[i].classList.add("is-active");
    };
    let timer = setInterval(() => show(i + 1), 6800);
    dots.forEach((d, n) => d.addEventListener("click", () => {
      clearInterval(timer);
      show(n);
      timer = setInterval(() => show(i + 1), 6800);
    }));
  }

  /* ------------------------------------------------------------- reveal */
  function initReveal() {
    const items = $$(".reveal");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach(el => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    items.forEach(el => io.observe(el));

    // 兜底：万一观察器没有触发，保证内容不会一直隐藏
    const sweep = () => {
      items.forEach(el => {
        if (el.classList.contains("is-in")) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95 && r.bottom > 0) el.classList.add("is-in");
      });
    };
    window.setTimeout(sweep, 1200);
    window.addEventListener("scroll", sweep, { passive: true });
    window.addEventListener("load", sweep);
  }

  /* ------------------------------------------------- selected (home page) */
  function renderSelected() {
    const box = $("#selected-grid");
    const list = window.SELECTED || [];
    if (!box || !list.length) return;
    const frag = document.createDocumentFragment();
    list.forEach(({ slug, span }) => {
      const p = BY_SLUG[slug];
      if (!p) return;
      const a = document.createElement("a");
      a.className = "tile tile--" + span + " js-lightbox reveal";
      a.href = imgPath(slug);
      a.dataset.slug = slug;
      a.setAttribute("aria-label", "查看作品：" + p.title);
      a.innerHTML =
        '<img src="' + imgPath(slug, true) + '" width="' + p.w + '" height="' + p.h +
        '" alt="' + p.title + '" loading="lazy" decoding="async">' +
        '<span class="tile__cap"><b>' + p.title + '</b><span>' + (CAT_LABEL[p.cat] || "") + "</span></span>";
      frag.appendChild(a);
    });
    box.appendChild(frag);
  }

  /* ------------------------------------------------------------- gallery */
  function renderGallery() {
    const box = $("#masonry");
    if (!box) return;

    const frag = document.createDocumentFragment();
    PHOTOS.forEach((p, i) => {
      const a = document.createElement("a");
      a.className = "ph js-lightbox";
      a.href = imgPath(p.slug);
      a.dataset.slug = p.slug;
      a.dataset.cat = p.cat;
      a.setAttribute("aria-label", "查看作品：" + p.title);
      a.innerHTML =
        '<img src="' + imgPath(p.slug, true) + '" width="' + p.w + '" height="' + p.h +
        '" alt="' + p.title + '" loading="' + (i < 6 ? "eager" : "lazy") + '" decoding="async">' +
        '<span class="ph__zoom" aria-hidden="true">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M11 8v6M8 11h6"/></svg>' +
        "</span>" +
        '<span class="ph__cap"><b>' + p.title + '</b><span>' + (CAT_LABEL[p.cat] || "") + "</span></span>";
      frag.appendChild(a);
    });
    box.appendChild(frag);

    // filters
    const bar = $(".filters");
    const counter = $(".filters__count");
    const cards = $$(".ph", box);
    const update = (cat) => {
      let shown = 0;
      cards.forEach(c => {
        const ok = cat === "all" || c.dataset.cat === cat;
        c.style.display = ok ? "" : "none";
        if (ok) shown++;
      });
      if (counter) counter.textContent = shown + " / " + cards.length + " 张";
    };
    if (bar) {
      $$(".filters__btn", bar).forEach(btn => {
        btn.addEventListener("click", () => {
          $$(".filters__btn", bar).forEach(b => b.classList.remove("is-on"));
          btn.classList.add("is-on");
          update(btn.dataset.cat || "all");
        });
      });
    }
    update("all");
  }

  /* ------------------------------------------------------------- lightbox */
  function initLightbox() {
    const lb = $("#lightbox");
    if (!lb) return;
    const imgEl = $(".lb__img", lb);
    const capEl = $(".lb__cap", lb);
    const cntEl = $(".lb__count", lb);
    let list = [], index = 0, lastFocus = null;

    const paint = () => {
      const el = list[index];
      if (!el) return;
      const slug = el.dataset.slug;
      const p = BY_SLUG[slug] || { title: "作品", cat: "" };
      imgEl.src = imgPath(slug);
      imgEl.alt = p.title;
      capEl.innerHTML = "<b>" + p.title + "</b><span>" + (CAT_LABEL[p.cat] || "") + "</span>";
      if (cntEl) cntEl.textContent = (index + 1) + " / " + list.length;
      // preload neighbours
      [list[index + 1], list[index - 1]].forEach(n => {
        if (n) { const im = new Image(); im.src = imgPath(n.dataset.slug); }
      });
    };

    const open = (el) => {
      const scope = el.closest("[data-gallery]") || document;
      list = $$(".js-lightbox", scope).filter(n => n.style.display !== "none");
      index = Math.max(0, list.indexOf(el));
      lastFocus = document.activeElement;
      paint();
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      $(".lb__close", lb).focus();
    };
    const close = () => {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      imgEl.removeAttribute("src");
      if (lastFocus) lastFocus.focus();
    };
    const step = (d) => {
      if (!list.length) return;
      index = (index + d + list.length) % list.length;
      paint();
    };

    document.addEventListener("click", e => {
      const el = e.target.closest(".js-lightbox");
      if (el) {
        if (el.tagName === "A") e.preventDefault();
        open(el);
      }
    });
    $(".lb__close", lb).addEventListener("click", close);
    $(".lb__nav--prev", lb).addEventListener("click", () => step(-1));
    $(".lb__nav--next", lb).addEventListener("click", () => step(1));
    lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lb__stage")) close(); });
    window.addEventListener("keydown", e => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    });

    // swipe
    let tx = null;
    lb.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", e => {
      if (tx === null) return;
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) step(dx > 0 ? -1 : 1);
      tx = null;
    }, { passive: true });
  }

  /* --------------------------------------------------------------- video */
  function framePreview(video, t) {
    // 用视频自身的一帧作为封面，避免额外的图片资源
    video.addEventListener("loadedmetadata", function once() {
      video.removeEventListener("loadedmetadata", once);
      try {
        const at = Math.min(t, Math.max(0.1, (video.duration || 2) - 0.2));
        video.currentTime = at;
      } catch (e) { /* ignore */ }
    });
  }

  function vcardHTML(v) {
    const poster = v.poster ? ' poster="' + v.poster + '"' : "";
    return (
      '<div class="vcard__frame">' +
        '<video preload="metadata" muted playsinline src="' + v.src + "#t=1\"" + poster + '"></video>' +
        '<span class="vcard__tag">' + v.tag + "</span>" +
        '<span class="vcard__dur">' + v.dur + "</span>" +
        '<span class="vcard__play" aria-hidden="true">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>' +
        "</span>" +
      "</div>" +
      "<div>" +
        '<h3 class="vcard__title">' + v.title + "</h3>" +
        '<p class="vcard__meta"><span>' + v.role + "</span><span>" + v.year +
          (v.stat ? " · " + v.stat : "") + "</span></p>" +
        '<p class="vcard__note">' + (v.note || "") + "</p>" +
      "</div>"
    );
  }

  function initVideoModal() {
    const vm = $("#videomodal");
    if (!vm) return;
    const stage = $(".vm__stage", vm);
    const titleEl = $(".vm__title", vm);
    const metaEl = $(".vm__meta", vm);
    const noteEl = $(".vm__note", vm);
    let player = null, lastFocus = null;

    const close = () => {
      if (player) {
        player.pause();
        player.removeAttribute("src");
        player.load();
        player.remove();
        player = null;
      }
      vm.classList.remove("is-open");
      vm.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };

    const open = (v, trigger) => {
      lastFocus = trigger || document.activeElement;
      titleEl.textContent = v.title;
      metaEl.textContent = [v.tag, v.year, v.dur, v.role, v.team].filter(Boolean).join("  ·  ");
      noteEl.textContent = v.note || "";
      player = document.createElement("video");
      player.controls = true;
      player.autoplay = true;
      player.playsInline = true;
      player.preload = "metadata";
      if (v.poster) player.poster = v.poster;
      player.src = v.src;
      stage.appendChild(player);
      vm.classList.add("is-open");
      vm.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      $(".vm__close", vm).focus();
      const p = player.play();
      if (p && p.catch) p.catch(() => {});
    };

    document.addEventListener("click", e => {
      const trigger = e.target.closest("[data-video-id]");
      if (!trigger) return;
      const id = trigger.dataset.videoId;
      const v = (window.VIDEOS || []).find(x => x.id === id);
      if (v) { e.preventDefault(); open(v, trigger); }
    });

    $(".vm__close", vm).addEventListener("click", close);
    vm.addEventListener("click", e => { if (e.target === vm || e.target.classList.contains("vm__stage")) close(); });
    window.addEventListener("keydown", e => {
      if (vm.classList.contains("is-open") && e.key === "Escape") close();
    });
  }

  function renderVideoCards() {
    const boxes = $$("[data-vids]");
    if (!boxes.length || !window.VIDEOS) return;
    boxes.forEach(box => {
      const ids = (box.dataset.vids || "").split(",").map(s => s.trim()).filter(Boolean);
      const list = ids.length
        ? window.VIDEOS.filter(v => ids.indexOf(v.id) > -1)
        : window.VIDEOS;
      const frag = document.createDocumentFragment();
      list.forEach(v => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "vcard reveal";
        b.dataset.videoId = v.id;
        b.setAttribute("aria-label", "播放视频：" + v.title);
        b.innerHTML = vcardHTML(v);
        frag.appendChild(b);
      });
      box.appendChild(frag);
      $$("video", box).forEach((el, i) => {
        const v = list[i];
        framePreview(el, (v && v.thumbAt) || 1.2 + (i % 3) * 0.6);
      });
    });
  }

  /* ---------------------------------------------------------------- misc */
  function initCopy() {
    $$("[data-copy]").forEach(b => {
      b.addEventListener("click", () => {
        const text = b.dataset.copy;
        const done = () => {
          const old = b.dataset.label || b.textContent;
          b.dataset.label = old;
          b.textContent = "已复制 ✓";
          setTimeout(() => { b.textContent = old; }, 1600);
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(done).catch(() => {});
        } else {
          const ta = document.createElement("textarea");
          ta.value = text;
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); done(); } catch (e) { /* ignore */ }
          document.body.removeChild(ta);
        }
      });
    });
  }

  function initYear() {
    $$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderSelected();
    renderGallery();
    renderVideoCards();
    initNav();
    initHero();
    initLightbox();
    initVideoModal();
    initCopy();
    initYear();
    initReveal();
  });
})();
