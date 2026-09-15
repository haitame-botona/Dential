// <ds-icon name="IconTypeX" size="16"> — renders Clinical Center icon-data glyphs; colors via CSS `color`.
// Without a size attribute the glyph fills the element box (set width/height via style).
(() => {
  if (customElements.get('ds-icon')) return;
  let dataP;
  let here = './icon-data.js';
  try { here = new URL(here, document.currentScript.src || location.href).href; } catch (e) {}
  const load = () => (dataP ||= import((window.__resources && window.__resources.iconData) || here).then(m => m.default));
  class DsIcon extends HTMLElement {
    static get observedAttributes() { return ['name', 'size']; }
    attributeChangedCallback() { this._render(); }
    connectedCallback() { this._render(); }
    async _render() {
      const icons = await load();
      if (!this.isConnected) return;
      const d = icons[this.getAttribute('name')];
      const size = this.getAttribute('size');
      const dim = size ? `width="${size}" height="${size}"` : 'width="100%" height="100%"';
      if (!this.style.display) this.style.display = 'inline-flex';
      this.style.lineHeight = '0';
      this.innerHTML = d ? `<svg ${dim} viewBox="${d.viewBox}" fill="none">${d.body}</svg>` : '';
    }
  }
  customElements.define('ds-icon', DsIcon);
})();
