document.addEventListener('DOMContentLoaded', async () => {
  const { CONFIG, el, money, badge, card, loadProducts } = window.SS;
  const root = document.getElementById('pd-root');
  const id = new URLSearchParams(location.search).get('id');

  const CONDITION_INFO = {
    NOS: 'New old stock: an original part that was never installed.',
    Excellent: 'Used, in excellent shape with minimal signs of age.',
    'Very Good': 'Used, clean and complete with light wear.',
    Good: 'Used, with normal age-related wear. Ask us for close-up photos.',
    Service: 'Work done by Southside Customs. We confirm a quote by email.'
  };

  let products;
  try {
    products = await loadProducts();
  } catch (e) {
    root.textContent = 'The part details did not load. Refresh the page, or email us and we will help.';
    return;
  }

  const p = products.find(x => x.id === id);
  if (!p) {
    root.replaceChildren();
    const box = el('div', 'empty');
    box.append(el('p', '', 'We could not find that part. It may have sold, or the link may be old.'));
    const a = el('a', 'btn btn-dark', 'See all parts');
    a.href = '/#shop';
    box.append(a);
    root.append(box);
    return;
  }

  document.title = `${p.name} | Southside Customs`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.content = `${p.name}: ${money(p)}. ${p.description.slice(0, 110)}`;

  function buildGallery(product) {
    const images = (product.images && product.images.length) ? product.images : (product.image ? [product.image] : []);
    if (!images.length) return el('div', 'media');

    const wrap = el('div', 'gallery');
    const main = el('div', 'gallery-main');
    const mainImg = el('img');
    mainImg.src = images[0];
    mainImg.alt = product.name;
    main.append(mainImg);
    wrap.append(main);

    if (images.length > 1) {
      const thumbs = el('div', 'gallery-thumbs');
      images.forEach((src, i) => {
        const thumb = el('img', 'thumb' + (i === 0 ? ' active' : ''));
        thumb.src = src;
        thumb.alt = `${product.name} ${i + 1}`;
        thumb.addEventListener('click', () => {
          mainImg.src = src;
          thumbs.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
        thumbs.append(thumb);
      });
      wrap.append(thumbs);
    }
    return wrap;
  }

  const grid = el('div', 'pd-grid');
  grid.append(buildGallery(p));

  const info = el('div');
  info.append(el('p', 'cat', p.category), el('h1', '', p.name), el('div', 'price', money(p)));
  info.append(el('p', 'price-note', p.priceNote
    ? 'Starting price in US dollars. We confirm the final quote by email after we see your wheels or car.'
    : 'Price in US dollars (USD). Shipping is quoted separately.'));
  info.append(el('p', 'desc', p.description));

  const specs = el('dl', 'specs');
  [['Condition', p.condition], ['Fits', p.fits], [p.type === 'service' ? 'Service' : 'Quantity', p.includes]]
    .filter(([, v]) => v)
    .forEach(([k, v]) => {
      const row = el('div', 'spec');
      row.append(el('dt', '', k), el('dd', '', v));
      specs.append(row);
    });
  info.append(specs);

  const key = Object.keys(CONDITION_INFO).find(k => (p.condition || '').startsWith(k));
  if (key) info.append(el('p', 'cond-note', CONDITION_INFO[key]));

  if ((p.details || []).length) {
    const ul = el('ul', 'ticks');
    p.details.forEach(d => ul.append(el('li', '', d)));
    info.append(ul);
  }

  const subject = `Inquiry: ${p.name}`;
  const body = `Hi Southside Customs,\n\nI am interested in: \( {p.name} ( \){money(p)}).\n\nMy car (year / model): \nMy country / shipping address: \n\nPlease confirm availability, the total with shipping, and how to pay.\n\nThank you.`;
  const actions = el('div', 'pd-actions');
  const form = el('a', 'btn btn-gold', 'Inquire via email');
  form.href = `/contact.html?part=${encodeURIComponent(p.id)}`;
  const direct = el('a', 'btn btn-dark', 'Open in my email app');
  direct.href = `mailto:\( {CONFIG.email}?subject= \){encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  actions.append(form, direct);
  info.append(actions);

  const pay = el('div', 'pay-mini');
  const strong = el('strong', '', 'Payment: ');
  const a = el('a', '', 'How payment works');
  a.href = '/#payment';
  pay.append(strong, document.createTextNode('prices are in USD. We confirm availability and your total with shipping by email before you pay. '), a);
  info.append(pay);

  grid.append(info);
  root.replaceChildren(grid);

  const related = products.filter(x => x.category === p.category && x.id !== p.id).slice(0, 4);
  if (related.length) {
    const grid2 = document.getElementById('related-grid');
    related.forEach(r => grid2.append(card({ ...r, layout: 'card' })));
    document.getElementById('related').hidden = false;
  }
});
