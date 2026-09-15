// VARIFIT scroll-reveal: bold entrance animations. Auto-targets [data-screen-label] and [data-reveal].
// Variants via attribute value: "" (up), "pop" (scale+up), "left", "right".
(() => {
  if (window.__vfReveal) return; window.__vfReveal = 1;
  const css = document.createElement('style');
  css.textContent = `
html,body{overflow-x:clip}
[data-reveal]{opacity:0;transform:translateY(44px);transition:opacity .95s cubic-bezier(.16,1,.3,1),transform .95s cubic-bezier(.16,1,.3,1)}
[data-reveal="pop"]{transform:translateY(70px) scale(.93)}
[data-reveal="left"]{transform:translateX(-80px)}
[data-reveal="right"]{transform:translateX(80px)}
[data-reveal].vf-in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){[data-reveal]{opacity:1;transform:none;transition:none}}`;
  document.head.appendChild(css);
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('vf-in'); io.unobserve(e.target); }
  }), { threshold: 0, rootMargin: '0px 0px -8% 0px' });
  const scan = () => {
    document.querySelectorAll('[data-screen-label]:not([data-vf-obs]),[data-reveal]:not([data-vf-obs])').forEach(el => {
      if (el.hasAttribute('data-hscroll') || el.hasAttribute('data-pin')) { el.dataset.vfObs = '1'; el.removeAttribute('data-reveal'); el.classList.add('vf-in'); return; }
      el.setAttribute('data-vf-obs', '1');
      if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', '');
      requestAnimationFrame(() => io.observe(el));
    });
  };
  scan();
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
})();
