(function () {
  const CONFIG = {
    email: 'southsidecustomsaccessorieshop@gmail.com',
    currency: 'USD'
  };
  const TONES = { 'Door Guards': 'a', 'Gas Guards': 'e', 'Lighting': 'b', 'Interior': 'c', 'Accessories': 'd', 'Services': 'a' };

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  }

  function money(p) {
    const amount = Number(p.price).toLocaleString('en-US', { maximumFractionDigits: 2 });
    return `${p.priceNote ? 'From ' : ''}$${amount} ${p.currency || CONFIG.currency}`;
  }

  function plateText(p) {
    if (p.plate) return p.plate;
    const m = p.name.match(/19\d\d(?:[\/-]\d{2,4})?/);
    return m ? m[0] : p.category;
  }

  function hasPhoto(p) {
    return p.image && !/res\.cloudinary\.com\/demo\//.test(p.image);
  }

  // Part-label plate, with the real photo on top when one is set.
  function media(p, cls) {
    const wrap = el('div', 'media' + (cls ? ' ' + cls : ''));
    const plate = el('div', 'plate tone-' + (TONES[p.category] || 'a'));
    plate.append(el('span', 'plate-main', plateText(p)), el('span', 'plate-sub', p.type === 'service' ? 'Service' : p.category));
    wrap.append(plate);
    if (hasPhoto(p)) {
      const img = el('img', 'photo');
      img.src = p.image;
      img.alt = p.name;
      img.loading = 'lazy';
      img.onerror = () => img.remove();
      wrap.append(img);
    }
    return wrap;
  }

  function badge(p) {
    const isNos = /^NOS/.test(p.condition || '');
    return el('span', 'badge' + (isNos ? ' badge-nos' : ''), p.condition || '');
  }

  function snippet(p) {
    return (p.description || '').split('. ')[0].replace(/\.$/, '') + '.';
  }

  function card(p) {
    const layout = p.layout || 'card';
    const a = el('a', 'card ' + layout);
    a.href = `/product.html?id=${encodeURIComponent(p.id)}`;
    a.append(media(p));
    const body = el('div', 'card-body');
    body.append(el('h3', '', p.name));
    if (layout !== 'card') body.append(el('p', 'card-text', snippet(p)));
    if (p.includes && layout !== 'card') body.append(el('p', 'card-meta', p.includes));
    const foot = el('div', 'card-foot');
    foot.append(el('span', 'price', money(p)), badge(p));
    body.append(foot);
    a.append(body);
    return a;
  }

  async function loadProducts() {
    const res = await fetch('/products.json');
    if (!res.ok) throw new Error('products.json ' + res.status);
    return res.json();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('menu-btn');
    const nav = document.getElementById('nav');
    if (btn && nav) {
      btn.addEventListener('click', () => {
        const open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });
      nav.addEventListener('click', e => {
        if (e.target.tagName === 'A') { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
      });
    }
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  });

  window.SS = { CONFIG, el, money, media, badge, card, loadProducts };
})();
