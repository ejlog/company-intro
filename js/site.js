/* ADSEN — interactions: scroll reveal, hero scale, sticky business stage, mobile nav. */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* mobile nav */
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* scroll reveal */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (!reduce && "IntersectionObserver" in window) {
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.remove("is-hidden");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 60 + "ms";
      if (el.getBoundingClientRect().top > vh * 0.88) {
        el.classList.add("is-hidden");
        io.observe(el);
      }
    });
  }

  /* hero scale + sticky business stage */
  var hero = document.getElementById("heroVisual");
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-biz]"));
  var panes = Array.prototype.slice.call(document.querySelectorAll("[data-pane]"));
  var dots = Array.prototype.slice.call(document.querySelectorAll("[data-dot]"));
  var active = 0;
  var ticking = false;

  function setActive(i) {
    if (i === active) return;
    active = i;
    items.forEach(function (el, n) { el.classList.toggle("is-active", n === i); });
    panes.forEach(function (el, n) { el.classList.toggle("is-active", n === i); });
    dots.forEach(function (el, n) { el.classList.toggle("is-active", n === i); });
  }

  function frame() {
    ticking = false;
    var h = window.innerHeight;

    if (hero && !reduce) {
      var r = hero.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, 1 - r.top / h));
      hero.style.transform = "scale(" + (0.94 + p * 0.06).toFixed(4) + ") translateY(" + ((1 - p) * 20).toFixed(2) + "px)";
    }

    if (items.length) {
      var best = active, bestD = Infinity;
      items.forEach(function (el, i) {
        var b = el.getBoundingClientRect();
        var d = Math.abs(b.top + b.height / 2 - h * 0.5);
        if (d < bestD) { bestD = d; best = i; }
      });
      setActive(best);
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(frame);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
