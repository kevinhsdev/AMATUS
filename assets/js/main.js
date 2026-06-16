document.addEventListener('DOMContentLoaded', () => {

  // ── SPLASH SCREEN AUTO-HIDE ──
  const splash = document.getElementById('amatus-splash');
  if (splash) {
    setTimeout(() => {
      splash.classList.add('amatus-splash-hide');
      document.documentElement.classList.remove('amatus-splash-lock');
      document.body.classList.remove('amatus-splash-lock');
      setTimeout(() => splash.remove(), 700);
    }, 2400);
  }

  // ── LANGUAGE TOGGLE (PT/EN) ──
  let lang = 'pt';
  const langBtn = document.getElementById('langToggle');
  langBtn.addEventListener('click', () => {
    lang = lang === 'pt' ? 'en' : 'pt';
    langBtn.textContent = lang === 'pt' ? 'EN' : 'PT';
    document.querySelectorAll('[data-pt]').forEach(el => {
      const val = el.getAttribute('data-' + lang);
      if (val) el.innerHTML = val;
    });
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  });

  // ── THEME TOGGLE (DARK/LIGHT) ──
  const themeBtn = document.getElementById('themeToggle');
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    themeBtn.textContent = document.body.classList.contains('light') ? '🌙' : '☀️';
  });

  // ── HAMBURGER MENU (MOBILE) ──
  const ham = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  ham.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );

  // ── SCROLL REVEAL ──
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('visible');
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // ── EMBER PARTICLES (HERO) ──
  (function () {
    const canvas = document.getElementById('emberCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');
    let W = 0, H = 0, embers = [];
    const COUNT = 45;
    const rand = (a, b) => a + Math.random() * (b - a);

    function resize() {
      W = canvas.width = hero.clientWidth;
      H = canvas.height = hero.clientHeight;
    }

    function spawn(initial) {
      return {
        x: rand(0, W),
        y: initial ? rand(0, H) : H + rand(0, 60),
        r: rand(0.6, 2.4),
        vy: rand(0.3, 1.2),
        vx: rand(-0.25, 0.25),
        drift: rand(0, Math.PI * 2),
        driftSpeed: rand(0.008, 0.03),
        hue: rand(16, 44),
        alpha: rand(0.22, 0.6)
      };
    }

    function init() {
      resize();
      embers = Array.from({ length: COUNT }, () => spawn(true));
    }

    function step() {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (const e of embers) {
        e.drift += e.driftSpeed;
        e.y -= e.vy;
        e.x += e.vx + Math.sin(e.drift) * 0.4;
        const flick = 0.6 + Math.sin(e.drift * 3) * 0.4;
        const a = e.alpha * flick;
        const R = e.r * 4;
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, R);
        g.addColorStop(0, `hsla(${e.hue},100%,68%,${a})`);
        g.addColorStop(0.4, `hsla(${e.hue},100%,52%,${a * 0.5})`);
        g.addColorStop(1, `hsla(${e.hue},100%,42%,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(e.x, e.y, R, 0, Math.PI * 2);
        ctx.fill();
        if (e.y < -12 || e.x < -24 || e.x > W + 24) Object.assign(e, spawn(false));
      }
      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(step);
    }

    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(resize, 150); });
    init();
    step();
  })();

});
