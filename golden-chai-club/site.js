(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile menu
  const menu = document.querySelector('.menu'), links = document.querySelector('.navlinks');
  if (menu) {
    menu.addEventListener('click', () => menu.setAttribute('aria-expanded', links.classList.toggle('open')));
    links.addEventListener('click', e => { if (e.target.closest('a')) { links.classList.remove('open'); menu.setAttribute('aria-expanded', false); } });
  }

  // Headings: big first letter, the rest typed out
  const typeIt = h => {
    if (h.dataset.done) return; h.dataset.done = 1;
    const chars = [...h.querySelectorAll('.ch')];
    if (reduce) { chars.forEach(c => c.classList.add('on')); return; }
    chars.forEach((c, i) => setTimeout(() => c.classList.add('on'), 140 + i * 45));
  };
  document.querySelectorAll('.type').forEach(h => {
    const t = h.textContent.trim().replace(/\s+/g, ' ');
    h.setAttribute('aria-label', t);
    const rest = [...t.slice(1)].map(c => `<span class="ch">${c === ' ' ? ' ' : c.replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}</span>`).join('');
    h.innerHTML = `<span aria-hidden="true"><span class="cap">${t[0]}</span>${rest}<span class="caret"></span></span>`;
  });

  // Reveal + type on scroll
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    if (e.target.classList.contains('type')) typeIt(e.target);
    io.unobserve(e.target);
  }), { threshold: .15 });
  document.querySelectorAll('.reveal, .type').forEach(el => io.observe(el));

  // Upcoming events: drop past dates, flag the next one
  const list = document.querySelector('.events');
  if (list) {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let shown = 0;
    list.querySelectorAll('.event').forEach(ev => {
      if (new Date(ev.dataset.date + 'T23:59:59') < today) return ev.remove();
      if (!shown++) ev.classList.add('next');
    });
    if (!shown) document.querySelector('.none').style.display = 'block';
  }

  document.querySelectorAll('.yr').forEach(y => y.textContent = new Date().getFullYear());
})();
