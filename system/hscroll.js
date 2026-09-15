// VARIFIT horizontal scroll-jack: [data-hscroll] wrapper pins [data-hsticky] and drives [data-htrack] horizontally.
(() => {
  if (window.__vfHscroll) return; window.__vfHscroll = 1;
  const items = [];
  const size = (w) => {
    const track = w.querySelector('[data-htrack]');
    const sticky = w.querySelector('[data-hsticky]');
    if (!track || !sticky) return;
    w.__over = Math.max(0, track.scrollWidth - sticky.clientWidth + 80);
    w.style.height = (window.innerHeight + w.__over) + 'px';
  };
  const tick = () => {
    const rtl = document.body.dataset.lang === 'ar';
    for (const w of items) {
      const track = w.querySelector('[data-htrack]');
      if (!track || !w.__over) continue;
      const r = w.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / (total || 1)));
      track.style.transform = 'translateX(' + ((rtl ? 1 : -1) * p * w.__over).toFixed(1) + 'px)';
    }
  };
  const scan = () => {
    document.querySelectorAll('[data-hscroll]:not([data-h-init])').forEach(w => {
      w.dataset.hInit = '1'; items.push(w); size(w);
    });
  };
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', () => { items.forEach(size); tick(); });
  new MutationObserver(() => { scan(); }).observe(document.body, { childList: true, subtree: true });
  scan();
  setTimeout(() => { items.forEach(size); tick(); }, 500);
  setTimeout(() => { items.forEach(size); tick(); }, 1500);
})();
