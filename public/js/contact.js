document.addEventListener('DOMContentLoaded', async () => {
  const { CONFIG, el, money, loadProducts } = window.SS;
  const form = document.getElementById('contact-form');
  const status = document.getElementById('status');
  const send = document.getElementById('send');
  const select = document.getElementById('part');

  try {
    const products = await loadProducts();
    products.forEach(p => {
      const o = el('option', '', `${p.name} (${money(p)})`);
      o.value = p.id;
      select.append(o);
    });
    const other = el('option', '', 'Another part or something not listed');
    other.value = 'other';
    select.append(other);
    const pre = new URLSearchParams(location.search).get('part');
    if (pre) select.value = pre;
  } catch (e) { /* the form still works without the list */ }

  function show(kind, nodes) {
    status.className = 'form-status ' + kind;
    status.replaceChildren(...nodes);
  }

  function mailtoFallback(data) {
    const body = `Name: ${data.name}\nEmail: ${data.email}\nPart: ${data.part}\nCar: ${data.car}\nCountry: ${data.country}\n\n${data.message}`;
    return `mailto:${CONFIG.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const f = new FormData(form);
    if (f.get('_honey')) return; // spam trap
    const name = (f.get('name') || '').trim();
    const email = (f.get('email') || '').trim();
    const message = (f.get('message') || '').trim();
    if (!name || !email || !message) {
      show('err', [document.createTextNode('Please add your name, email and a message.')]);
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      show('err', [document.createTextNode('That email address looks incomplete. Check it and try again.')]);
      return;
    }
    const partLabel = select.options[select.selectedIndex].text;
    const data = {
      name, email, message,
      part: select.value ? partLabel : 'Not specified',
      car: (f.get('car') || '').trim() || 'Not given',
      country: (f.get('country') || '').trim() || 'Not given',
      subject: select.value ? `Website inquiry: ${partLabel}` : 'Website inquiry'
    };

    send.disabled = true;
    send.textContent = 'Sending...';
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${CONFIG.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: data.subject, _template: 'table', _captcha: 'false', _replyto: email,
          name: data.name, email: data.email, part: data.part, car: data.car, country: data.country, message: data.message
        })
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success === 'false' || json.success === false) throw new Error('send failed');
      form.reset();
      show('ok', [document.createTextNode('Message sent. We reply by email with availability, your total in USD and how to pay.')]);
    } catch (err) {
      const a = el('a', '', 'send it from your email app');
      a.href = mailtoFallback(data);
      show('err', [document.createTextNode('Your message did not send. Try again, or '), a, document.createTextNode('.')]);
    } finally {
      send.disabled = false;
      send.textContent = 'Send message';
    }
  });
});
