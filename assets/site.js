// Mobile menu and scroll reveal.
(function () {
  const nav = document.querySelector('nav');
  const toggle = nav && nav.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const els = document.querySelectorAll('.fi');
  if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('vis')); return; }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); } });
  }, { threshold: 0.06, rootMargin: '0px 0px -32px 0px' });
  els.forEach(el => obs.observe(el));
})();
