
// <!-- YK OFFICIAL — ULTRA SMOOTH SCROLL -->


(() => {
  "use strict";

  // Mobile / touch devices ko normal scrolling do
  if (window.matchMedia("(pointer: coarse)").matches) return;

  // Accessibility: reduced motion enabled ho to disable
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let current = window.scrollY;
  let target = window.scrollY;
  let rafId = null;

  // 1.35 = one wheel movement travels further
  // 1.50 = more aggressive
  const SCROLL_MULTIPLIER = 1.40;

  // Lower = smoother/slower
  // Higher = faster response
  const EASE = 0.085;

  const getMaxScroll = () =>
    Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight
    );

  const clamp = (value, min, max) =>
    Math.min(Math.max(value, min), max);

  function smoothScroll() {
    current += (target - current) * EASE;

    if (Math.abs(target - current) < 0.35) {
      current = target;
    }

    window.scrollTo(0, current);

    if (Math.abs(target - current) > 0.35) {
      rafId = requestAnimationFrame(smoothScroll);
    } else {
      rafId = null;
    }
  }

  function startAnimation() {
    if (!rafId) {
      rafId = requestAnimationFrame(smoothScroll);
    }
  }

  // Mouse wheel
  window.addEventListener(
    "wheel",
    (e) => {
      // Elements where native scrolling should remain untouched
      const protectedElement = e.target.closest(
        "input, textarea, select, iframe, video, [data-no-smooth-scroll]"
      );

      if (protectedElement) return;

      // Ignore horizontal wheel movement
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();

      target += e.deltaY * SCROLL_MULTIPLIER;

      target = clamp(
        target,
        0,
        getMaxScroll()
      );

      startAnimation();
    },
    { passive: false }
  );

  // If user/programmatic scroll changes position,
  // keep our engine synchronized.
  window.addEventListener(
    "scroll",
    () => {
      if (!rafId) {
        current = window.scrollY;
        target = window.scrollY;
      }
    },
    { passive: true }
  );

  // Window resize safety
  window.addEventListener("resize", () => {
    target = clamp(target, 0, getMaxScroll());
    current = clamp(current, 0, getMaxScroll());
  });

  // Smooth navbar / anchor links
  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');

    if (!link) return;

    const id = link.getAttribute("href");

    if (!id || id === "#") return;

    const element = document.querySelector(id);

    if (!element) return;

    e.preventDefault();

    // Your website has fixed navigation,
    // so keep the section slightly below it.
    const NAV_OFFSET = 120;

    target =
      element.getBoundingClientRect().top +
      window.scrollY -
      NAV_OFFSET;

    target = clamp(
      target,
      0,
      getMaxScroll()
    );

    startAnimation();

    // Update URL without jumping
    history.pushState(null, "", id);
  });

})();