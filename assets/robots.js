// Falling robots background — fixed canvas behind page content.
(function () {
  const canvas = document.createElement('canvas');
  canvas.className = 'robot-rain';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  const robotSvg = (body, accent) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80">
  <line x1="32" y1="4" x2="32" y2="14" stroke="${body}" stroke-width="3" stroke-linecap="round"/>
  <circle cx="32" cy="5" r="4" fill="${accent}"/>
  <rect x="12" y="14" width="40" height="28" rx="8" fill="${body}"/>
  <rect x="7" y="23" width="5" height="10" rx="2" fill="${accent}"/>
  <rect x="52" y="23" width="5" height="10" rx="2" fill="${accent}"/>
  <circle cx="24" cy="27" r="5" fill="${accent}"/>
  <circle cx="40" cy="27" r="5" fill="${accent}"/>
  <rect x="24" y="35" width="16" height="3" rx="1.5" fill="${accent}"/>
  <rect x="16" y="45" width="32" height="22" rx="6" fill="${body}"/>
  <circle cx="32" cy="56" r="4" fill="${accent}"/>
  <rect x="4" y="46" width="9" height="16" rx="4.5" fill="${body}"/>
  <rect x="51" y="46" width="9" height="16" rx="4.5" fill="${body}"/>
  <rect x="20" y="68" width="9" height="11" rx="3" fill="${body}"/>
  <rect x="35" y="68" width="9" height="11" rx="3" fill="${body}"/>
</svg>`;

  const sprites = [
    robotSvg('#18365B', '#C9A84C'),
    robotSvg('#C9A84C', '#18365B'),
    robotSvg('#87681C', '#FBFAF6'),
  ].map(svg => {
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    return img;
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, dpr = 1, robots = [];

  function spawn(atTop) {
    const depth = Math.random();                 // 0 = far, 1 = near
    const size = 18 + depth * 34;
    return {
      x: Math.random() * w,
      y: atTop ? -size * 1.4 - Math.random() * h * 0.3 : Math.random() * h,
      size,
      speed: 0.35 + depth * 1.1,
      sway: Math.random() * Math.PI * 2,
      swayAmp: 0.2 + Math.random() * 0.5,
      rot: (Math.random() - 0.5) * 0.6,
      spin: (Math.random() - 0.5) * 0.012,
      alpha: 0.10 + depth * 0.16,
      sprite: sprites[Math.floor(Math.random() * sprites.length)],
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(46, Math.max(16, (w * h) / 26000)));
    while (robots.length < count) robots.push(spawn(false));
    robots.length = count;
    if (reduceMotion) draw();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (const r of robots) {
      ctx.save();
      ctx.globalAlpha = r.alpha;
      ctx.translate(r.x, r.y);
      ctx.rotate(r.rot);
      ctx.drawImage(r.sprite, -r.size / 2, -r.size * 0.625, r.size, r.size * 1.25);
      ctx.restore();
    }
  }

  function tick() {
    for (let i = 0; i < robots.length; i++) {
      const r = robots[i];
      r.y += r.speed;
      r.sway += 0.015;
      r.x += Math.sin(r.sway) * r.swayAmp;
      r.rot += r.spin;
      if (r.y - r.size > h) robots[i] = spawn(true);
    }
    draw();
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  resize();
  Promise.all(sprites.map(s => s.decode ? s.decode().catch(() => {}) : null)).then(() => {
    if (reduceMotion) draw(); else requestAnimationFrame(tick);
  });
})();
