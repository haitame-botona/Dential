// VARIFIT scroll parallax: [data-pin] wrapper (taller than viewport) pins [data-pin-sticky]; children with
// [data-para] move by data-para-y (px), data-para-r (deg), data-para-s (start scale) as scroll progress runs 0..1.
(() => {
  if (window.__vfParallax) return; window.__vfParallax = 1;
  const els = [];
  const scan = () => document.querySelectorAll('[data-pin]:not([data-pin-init])').forEach(w => { w.dataset.pinInit = '1'; els.push(w); });
  const tick = () => {
    for (const w of els) {
      const r = w.getBoundingClientRect();
      const total = r.height - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / (total || 1)));
      w.querySelectorAll('[data-para]').forEach(el => {
        const y = parseFloat(el.dataset.paraY || 0);
        const rot = parseFloat(el.dataset.paraR || 0);
        const s0 = el.dataset.paraS ? parseFloat(el.dataset.paraS) : 1;
        const s = s0 + (1 - s0) * p;
        el.style.transform = 'translateY(' + ((1 - p) * y).toFixed(1) + 'px) rotate(' + ((1 - p) * rot).toFixed(2) + 'deg) scale(' + s.toFixed(3) + ')';
        if (el.dataset.paraO !== undefined) el.style.opacity = Math.min(1, p * 2.2 + 0.05).toFixed(2);
      });
    }
  };
  addEventListener('scroll', tick, { passive: true });
  addEventListener('resize', tick);
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
  scan();
  setTimeout(tick, 400);
})();
