document.addEventListener('DOMContentLoaded', async () => {
  const { el, money, media, card, loadProducts } = window.SS;
  const grid = document.getElementById('grid');
  const chipsBox = document.getElementById('chips');
  const search = document.getElementById('search');
  const count = document.getElementById('count');
  const servicesList = document.getElementById('services-list');

  let products = [];
  let category = 'All';
  let query = '';

  // Catalog lightbox
  const lightbox = document.getElementById('lightbox');
  const open = document.getElementById('catalog-open');
  if (lightbox && open) {
    open.addEventListener('click', () => (lightbox.showModal ? lightbox.showModal() : window.open(lightbox.querySelector('img').src, '_blank')));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
  }

  try {
    products = await loadProducts();
  } catch (err) {
    console.error(err);
    grid.replaceChildren(el('p', 'empty', 'The parts list did not load. Refresh the page, or email us and we will send you what we have.'));
    return;
  }

  buildChips();
  renderGrid();
  renderServices();

  search.addEventListener('input', () => { query = search.value.trim().toLowerCase(); renderGrid(); });

  function buildChips() {
    const cats = ['All', ...new Set(products.map(p => p.category))];
    chipsBox.replaceChildren();
    cats.forEach(c => {
      const b = el('button', 'chip', c);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(c === category));
      b.addEventListener('click', () => {
        category = c;
        chipsBox.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
        renderGrid();
      });
      chipsBox.appendChild(b);
    });
  }

  function matches(p) {
    if (category !== 'All' && p.category !== category) return false;
    if (!query) return true;
    return [p.name, p.category, p.fits, p.condition, p.description].join(' ').toLowerCase().includes(query);
  }

  function renderGrid() {
    const list = products.filter(matches);
    grid.replaceChildren();
    count.textContent = `${list.length} ${list.length === 1 ? 'item' : 'items'}`;
    if (!list.length) {
      const box = el('div', 'empty');
      box.append(el('p', '', 'No parts match that search. We also source hard-to-find parts, so email us what you need.'));
      const a = el('a', 'btn btn-dark', 'Ask us for a part');
      a.href = '/contact.html';
      box.append(a);
      grid.append(box);
      return;
    }
    list.forEach(p => grid.appendChild(card(p)));
  }

  function renderServices() {
    servicesList.replaceChildren();
    const services = products.filter(p => p.type === 'service');
    services.forEach(p => {
      const row = el('article', 'service-row');
      row.append(media(p));
      const text = el('div');
      text.append(el('h3', '', p.name.replace(/ Setup$/, '')), el('p', '', p.description));
      const side = el('div', 'service-side');
      const a = el('a', 'btn btn-dark btn-small', 'View details');
      a.href = `/product.html?id=${encodeURIComponent(p.id)}`;
      side.append(el('span', 'price', money(p)), a);
      row.append(text, side);
      servicesList.appendChild(row);
    });
    // Parts sourcing has no fixed price, so it links to the contact form.
    const row = el('article', 'service-row');
    const plate = el('div', 'media');
    const inner = el('div', 'plate tone-c');
    inner.append(el('span', 'plate-main', 'Sourcing'), el('span', 'plate-sub', 'Service'));
    plate.append(inner);
    const text = el('div');
    text.append(el('h3', '', 'Parts sourcing'), el('p', '', 'Looking for a hard-to-find OG or NOS Chevrolet part? Tell us the year, model and part. We search for it and send you a price by email.'));
    const side = el('div', 'service-side');
    const a = el('a', 'btn btn-dark btn-small', 'Request a part');
    a.href = '/contact.html';
    side.append(el('span', 'price', 'Quote by email'), a);
    row.append(plate, text, side);
    servicesList.appendChild(row);
  }
});
