document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById('products-grid');
  const modal = document.getElementById('product-modal');
  const closeBtn = document.getElementById('modal-close');

  let products = [];

  try {
    const res = await fetch('/products.json');
    products = await res.json();
    renderProducts(products);
  } catch (err) {
    grid.innerHTML = '<p style="text-align:center;color:#a0a0a0;">Unable to load products. Please try again later.</p>';
    console.error(err);
  }

  function renderProducts(items) {
    grid.innerHTML = '';
    items.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400x200/141414/d4af37?text=Part'" />
        <div class="product-info">
          <h3>${p.name}</h3>
          <div class="product-price">$${p.price} ${p.currency || 'USD'}</div>
          <div class="product-category">${p.category || ''}</div>
        </div>
      `;
      card.addEventListener('click', () => openModal(p));
      grid.appendChild(card);
    });
  }

  function openModal(p) {
    document.getElementById('modal-img').src = p.image;
    document.getElementById('modal-name').textContent = p.name;
    document.getElementById('modal-price').textContent = `$${p.price} ${p.currency || 'USD'}`;
    document.getElementById('modal-category').textContent = p.category || '';
    document.getElementById('modal-desc').textContent = p.description || '';
    document.getElementById('modal-condition').textContent = p.condition ? `Condition: ${p.condition}` : '';
    const emailLink = document.getElementById('modal-email');
    emailLink.href = `mailto:southsidecustomsaccessorieshop@gmail.com?subject=Inquiry: ${encodeURIComponent(p.name)}&body=Hi, I'm interested in the ${encodeURIComponent(p.name)} ($${p.price}). Please let me know about availability and shipping.`;
    modal.classList.add('active');
  }

  closeBtn.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Smooth scroll for nav
  document.querySelectorAll('.nav a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
});
