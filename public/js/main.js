const CONTACT_EMAIL = 'southsidecustomsaccessorieshop@gmail.com';
const CURRENCY = 'USD';

const CONDITION_INFO = {
  'NOS': 'New Old Stock: original part, never installed.',
  'Excellent': 'Used, but in excellent shape with minimal signs of age.',
  'Very Good': 'Used, clean and complete with light wear.',
  'Good': 'Used, with normal age-related wear. Ask us for close-up photos.',
  'Service': 'Work done by Southside Customs. A quote is confirmed by email.'
};

function money(p) {
  const amount = Number(p.price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const prefix = p.priceNote ? 'From ' : '';
  return `${prefix}$${amount} ${p.currency || CURRENCY}`;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('products-grid');
  const modal = document.getElementById('product-modal');
  const closeBtn = document.getElementById('modal-close');
  const FALLBACK_IMG = 'data:image/svg+xml;utf8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect width="100%" height="100%" fill="#141414"/><text x="50%" y="50%" fill="#d4af37" font-family="sans-serif" font-size="20" text-anchor="middle" dominant-baseline="middle">Photo coming soon</text></svg>'
  );

  let lastFocused = null;

  try {
    const res = await fetch('/products.json');
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    grid.textContent = 'Unable to load products. Please try again later.';
    console.error(err);
  }

  function renderProducts(items) {
    grid.replaceChildren();
    items.forEach(p => {
      const card = el('div', 'product-card');
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View details for ${p.name}`);

      const img = el('img');
      img.src = p.image;
      img.alt = p.name;
      img.loading = 'lazy';
      img.onerror = () => { img.onerror = null; img.src = FALLBACK_IMG; };

      const info = el('div', 'product-info');
      info.append(
        el('h3', '', p.name),
        el('div', 'product-price', money(p)),
        el('div', 'product-category', [p.category, p.condition].filter(Boolean).join(' • ')),
        el('div', 'product-qty', p.includes || '')
      );
      card.append(img, info);
      card.addEventListener('click', () => openModal(p));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(p); }
      });
      grid.appendChild(card);
    });
  }

  function setText(id, text) { document.getElementById(id).textContent = text || ''; }

  function openModal(p) {
    lastFocused = document.activeElement;
    const img = document.getElementById('modal-img');
    img.onerror = () => { img.onerror = null; img.src = FALLBACK_IMG; };
    img.src = p.image;
    img.alt = p.name;

    setText('modal-name', p.name);
    setText('modal-price', money(p));
    setText('modal-price-note', p.priceNote
      ? 'Starting price. The final quote is confirmed by email after we see your wheels or car.'
      : `Price in US dollars (${p.currency || CURRENCY}). Shipping is quoted separately.`);
    setText('modal-category', p.category);
    setText('modal-desc', p.description);

    const specs = document.getElementById('modal-specs');
    specs.replaceChildren();
    [
      ['Condition', p.condition],
      ['Fits', p.fits],
      [p.type === 'service' ? 'Service' : 'Quantity', p.includes]
    ].filter(([, v]) => v).forEach(([k, v]) => {
      const row = el('div', 'spec-row');
      row.append(el('span', 'spec-key', k), el('span', 'spec-val', v));
      specs.appendChild(row);
    });

    const conditionKey = Object.keys(CONDITION_INFO).find(k => (p.condition || '').startsWith(k));
    setText('modal-condition', conditionKey ? CONDITION_INFO[conditionKey] : '');

    const list = document.getElementById('modal-details');
    list.replaceChildren();
    (p.details || []).forEach(d => list.appendChild(el('li', '', d)));

    const subject = `Inquiry: ${p.name}`;
    const body = `Hi Southside Customs,\n\nI am interested in: ${p.name} (${money(p)}).\n\nMy car (year / model): \nMy country / shipping address: \n\nPlease confirm availability, the total with shipping, and how to pay.\n\nThank you.`;
    document.getElementById('modal-email').href =
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.getElementById('modal-pay-link').addEventListener('click', e => {
    e.preventDefault();
    lastFocused = null;
    closeModal();
    document.getElementById('payment').scrollIntoView({ behavior: 'smooth' });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  document.querySelectorAll('.nav a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});
