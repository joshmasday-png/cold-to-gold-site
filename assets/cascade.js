// Falling-line cascade, fixed behind the whole page.
(function () {
  const hosts = [document.body];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  hosts.forEach(host => {
    const canvas = document.createElement('canvas');
    canvas.className = 'cascade';
    canvas.setAttribute('aria-hidden', 'true');
    host.prepend(canvas);
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, streaks = [];

    function spawn(atTop) {
      const depth = Math.random();
      const len = 60 + depth * 160;
      return {
        x: Math.round(Math.random() * w) + 0.5,
        y: atTop ? -len - Math.random() * h * 0.5 : Math.random() * (h + len),
        len,
        speed: 0.4 + depth * 1.2,
        width: depth > 0.6 ? 1.6 : 1,
        alpha: 0.2 + depth * 0.35,
        gold: Math.random() < 0.3,
      };
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(110, Math.max(36, w / 12)));
      while (streaks.length < count) streaks.push(spawn(false));
      streaks.length = count;
      draw();
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const s of streaks) {
        const rgb = s.gold ? '201,168,76' : '24,54,91';
        const g = ctx.createLinearGradient(0, s.y - s.len, 0, s.y);
        g.addColorStop(0, `rgba(${rgb},0)`);
        g.addColorStop(1, `rgba(${rgb},${s.alpha})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = s.width;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y - s.len);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
        ctx.fillStyle = `rgba(${rgb},${Math.min(s.alpha * 1.8, 0.85)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.width + 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function tick() {
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i];
        s.y += s.speed;
        if (s.y - s.len > h) streaks[i] = spawn(true);
      }
      draw();
      requestAnimationFrame(tick);
    }

    window.addEventListener('resize', resize);
    resize();
    if (!reduceMotion) requestAnimationFrame(tick);
  });
})();
