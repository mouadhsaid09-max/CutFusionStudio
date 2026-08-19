/* ═══════════════════════════════════════════════════════
   INTERACTIVE ENGINE — Portfolio Animations & Effects
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ── Preloader ──────────────────────────────────────────
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2200);
  });
  // Failsafe: hide preloader after 4s even if load doesn't fire
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 4000);

  // ── Custom Cursor ──────────────────────────────────────
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let dotX = 0, dotY = 0;
  const ringSpeed = 0.15;
  const dotSpeed = 0.35;

  // Check if it's a touch device
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  if (!isTouchDevice()) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Update CSS custom properties for glow effects
      document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
    });

    document.addEventListener('mousedown', () => {
      cursorDot.classList.add('clicking');
      cursorRing.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
      cursorDot.classList.remove('clicking');
      cursorRing.classList.remove('clicking');
    });

    // Hover effects for interactive elements
    const hoverElements = document.querySelectorAll('[data-hover]');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
      });
    });

    // Animate cursor with lerp
    function animateCursor() {
      dotX += (mouseX - dotX) * dotSpeed;
      dotY += (mouseY - dotY) * dotSpeed;
      ringX += (mouseX - ringX) * ringSpeed;
      ringY += (mouseY - ringY) * ringSpeed;

      cursorDot.style.left = `${dotX}px`;
      cursorDot.style.top = `${dotY}px`;
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  } else {
    // Hide cursors on touch
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
  }

  // ── Magnetic Button Effect ─────────────────────────────
  const magneticElements = document.querySelectorAll('.magnetic');
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.3;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });

  // ── Navbar Scroll Effect ───────────────────────────────
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }, { passive: true });

  // ── Mobile Navigation ──────────────────────────────────
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close mobile nav when link clicked
    navLinks.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // ── Smooth Scroll for anchor links ─────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      }
    });
  });

  // ── Scroll Reveal Animations ───────────────────────────
  const revealObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, revealObserverOptions);

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    revealObserver.observe(el);
  });

  // ── Skill Bars Animation ───────────────────────────────
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.getAttribute('data-width');
        fill.style.width = `${width}%`;
        fill.classList.add('animated');
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });

  skillFills.forEach(fill => skillObserver.observe(fill));

  // ── Counter Animation ──────────────────────────────────
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  function animateCounter(el, target) {
    const duration = 2000;
    const startTime = performance.now();
    const startVal = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quint
      const eased = 1 - Math.pow(1 - progress, 5);
      const current = Math.floor(startVal + (target - startVal) * eased);
      el.textContent = current + (target > 100 ? '+' : '+');
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target + '+';
      }
    }
    requestAnimationFrame(update);
  }

  counters.forEach(counter => counterObserver.observe(counter));

  // ── Parallax on Mouse Move (Hero) ──────────────────────
  const hero = document.getElementById('hero');
  if (hero && !isTouchDevice()) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      
      const heroContent = hero.querySelector('.hero-content');
      if (heroContent) {
        heroContent.style.transform = `translate(${x * -12}px, ${y * -8}px)`;
      }
    });
  }

  // ── Work Cards Tilt Effect ─────────────────────────────
  const workItems = document.querySelectorAll('.work-item');
  workItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      item.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      item.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

  // ── Service Cards Glow Follow ──────────────────────────
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });

  // ── Contact Form ───────────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Button animation
      const originalContent = submitBtn.innerHTML;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
          <path d="M21 12a9 9 0 11-6.219-8.56"></path>
        </svg>
        Sending...
      `;
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Simulate send
      setTimeout(() => {
        submitBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Message Sent!
        `;
        submitBtn.style.opacity = '1';
        submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        
        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalContent;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
        }, 2500);
      }, 1500);
    });
  }

  // ── Smooth Scrollbar Percentage Indicator ──────────────
  // (Optional: page progress bar at top)
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #ffffff, #888888);
    z-index: 10001;
    transition: width 0.1s linear;
    border-radius: 0 2px 2px 0;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (window.scrollY / scrollHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  }, { passive: true });

  // ── Marquee Pause on Hover ─────────────────────────────
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', () => {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', () => {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  // ── Add spin keyframe for form button ──────────────────
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // ── Testimonials Drag Scroll ───────────────────────────
  const testimonialsTrack = document.querySelector('.testimonials-track');
  if (testimonialsTrack) {
    let isDown = false;
    let startX;
    let scrollLeft;

    testimonialsTrack.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - testimonialsTrack.offsetLeft;
      scrollLeft = testimonialsTrack.scrollLeft;
      testimonialsTrack.style.cursor = 'grabbing';
    });

    testimonialsTrack.addEventListener('mouseleave', () => {
      isDown = false;
      testimonialsTrack.style.cursor = '';
    });

    testimonialsTrack.addEventListener('mouseup', () => {
      isDown = false;
      testimonialsTrack.style.cursor = '';
    });

    testimonialsTrack.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - testimonialsTrack.offsetLeft;
      const walk = (x - startX) * 1.5;
      testimonialsTrack.scrollLeft = scrollLeft - walk;
    });
  }

  // ── Floating Particles (Hero background) ───────────────
  function createParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;

    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 1;
      overflow: hidden;
      pointer-events: none;
    `;
    heroSection.appendChild(particleContainer);

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 3 + 1;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = Math.random() * 10 + 10;
      const opacity = Math.random() * 0.3 + 0.1;

      particle.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${y}%;
        width: ${size}px;
        height: ${size}px;
        background: ${Math.random() > 0.5 ? 'var(--accent-primary)' : 'var(--accent-secondary)'};
        border-radius: 50%;
        opacity: ${opacity};
        animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
      `;
      particleContainer.appendChild(particle);
    }

    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
      @keyframes particleFloat {
        0%, 100% { 
          transform: translate(0, 0) scale(1);
          opacity: var(--particle-opacity, 0.2);
        }
        25% { 
          transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) scale(1.2);
        }
        50% { 
          transform: translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px) scale(0.8);
          opacity: calc(var(--particle-opacity, 0.2) * 0.5);
        }
        75% { 
          transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) scale(1.1);
        }
      }
    `;
    document.head.appendChild(particleStyle);
  }
  createParticles();

  // ── Text Scramble Effect on Hover (Work Titles) ────────
  class TextScramble {
    constructor(el) {
      this.el = el;
      this.chars = '!<>-_\\/[]{}—=+*^?#________';
      this.originalText = el.textContent;
    }

    scramble() {
      const text = this.originalText;
      const length = text.length;
      let iteration = 0;
      const maxIterations = length;

      const interval = setInterval(() => {
        this.el.textContent = text
          .split('')
          .map((char, index) => {
            if (index < iteration) return text[index];
            return this.chars[Math.floor(Math.random() * this.chars.length)];
          })
          .join('');

        if (iteration >= maxIterations) {
          clearInterval(interval);
          this.el.textContent = this.originalText;
        }
        iteration += 1 / 2;
      }, 30);
    }
  }

  document.querySelectorAll('.work-title').forEach(title => {
    const scrambler = new TextScramble(title);
    title.closest('.work-item')?.addEventListener('mouseenter', () => {
      scrambler.scramble();
    });
  });

  // ── Image Reveal on Scroll ─────────────────────────────
  const workImages = document.querySelectorAll('.work-image');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.clipPath = 'inset(0 0 0 0)';
        entry.target.style.transition = 'clip-path 1s cubic-bezier(0.16, 1, 0.3, 1)';
        imageObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  workImages.forEach(img => {
    img.style.clipPath = 'inset(0 100% 0 0)';
    imageObserver.observe(img);
  });

  console.log('%c■ CUTFUSION STUDIO', 'color: #ffffff; font-size: 16px; font-weight: 900; font-family: sans-serif; letter-spacing: 0.2em;');
  console.log('%cDesigned with precision. Built with passion.', 'color: #666; font-size: 11px; letter-spacing: 0.1em;');
});

/* ═══════════════════════════════════════════════════════
   ANIMATED GRID BACKGROUND ENGINE — v2
   Grid lines + 7 glowing orange dots that travel along them
   ═══════════════════════════════════════════════════════ */
(function initGridCanvas() {
  const canvas = document.getElementById('gridCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  /* ── Config ─────────────────────────────────────── */
  const CELL        = 80;    // px between grid lines
  const N_PARTICLES = 4;     // number of glowing dots (reduced)
  const MOVE_SPEED  = 0.4;   // px per frame (even slower)
  const TRAIL_MAX   = 28;    // trail length in frames

  /* Orange shades */
  const PALETTE = [
    [255,  81,   0],
    [255, 120,   0],
    [255, 160,   0],
    [255,  50,   0],
  ];

  let W, H, COLS, ROWS;
  let particles = [];
  let raf;

  /* ── Fit canvas to viewport ──────────────────────── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    COLS = Math.floor(W / CELL);
    ROWS = Math.floor(H / CELL);
  }

  /* ── Spawn a single particle on a random intersection ── */
  function spawnParticle(index) {
    const col = 1 + Math.floor(Math.random() * (COLS - 2));
    const row = 1 + Math.floor(Math.random() * (ROWS - 2));

    // pick H or V direction
    const horiz = Math.random() < 0.5;
    const dx = horiz ? (Math.random() < 0.5 ? 1 : -1) : 0;
    const dy = horiz ? 0 : (Math.random() < 0.5 ? 1 : -1);

    const col3 = PALETTE[index % PALETTE.length];
    const size  = 3 + Math.random() * 3;

    return {
      /* grid position (integer col/row) */
      col, row,
      /* target grid position */
      tCol: col + dx, tRow: row + dy,
      /* sub-pixel render position */
      px: col * CELL, py: row * CELL,
      /* current direction */
      dx, dy,
      /* appearance */
      color: col3,
      size,
      /* trail: array of {x, y} render positions */
      trail: [],
      /* cells to travel before re-rolling direction */
      budget: 2 + Math.floor(Math.random() * 5),
      traveled: 0,
    };
  }

  /* ── Choose next direction at an intersection ─────── */
  function pickDir(p) {
    // Prefer to continue straight (60%) or turn 90° (40%)
    const straight = Math.random() < 0.6;
    if (straight) return { dx: p.dx, dy: p.dy };

    // Turn perpendicular
    if (p.dx !== 0) {
      return { dx: 0, dy: Math.random() < 0.5 ? 1 : -1 };
    } else {
      return { dx: Math.random() < 0.5 ? 1 : -1, dy: 0 };
    }
  }

  /* ── Update a particle for one frame ─────────────── */
  function updateParticle(p) {
    // record current render position into trail
    p.trail.push({ x: p.px, y: p.py });
    if (p.trail.length > TRAIL_MAX) p.trail.shift();

    // target pixel position
    const tx = p.tCol * CELL;
    const ty = p.tRow * CELL;

    // move towards target
    if (p.dx !== 0) {
      p.px += p.dx * MOVE_SPEED;
    } else {
      p.py += p.dy * MOVE_SPEED;
    }

    // check if we reached (or passed) the target intersection
    const arrivedX = p.dx > 0 ? p.px >= tx : p.dx < 0 ? p.px <= tx : true;
    const arrivedY = p.dy > 0 ? p.py >= ty : p.dy < 0 ? p.py <= ty : true;

    if (arrivedX && arrivedY) {
      // snap exactly to intersection
      p.px = tx;
      p.py = ty;
      p.col = p.tCol;
      p.row = p.tRow;
      p.traveled++;

      // wrap at edges (with 1-cell padding)
      if (p.col <= 0) p.col = COLS - 1;
      if (p.col >= COLS) p.col = 1;
      if (p.row <= 0) p.row = ROWS - 1;
      if (p.row >= ROWS) p.row = 1;
      p.px = p.col * CELL;
      p.py = p.row * CELL;

      // re-roll direction?
      if (p.traveled >= p.budget) {
        p.traveled = 0;
        p.budget = 2 + Math.floor(Math.random() * 5);
        const d = pickDir(p);
        p.dx = d.dx;
        p.dy = d.dy;
      }

      // advance target
      p.tCol = p.col + p.dx;
      p.tRow = p.row + p.dy;
    }
  }

  /* ── Draw grid lines + intersection dots ─────────── */
  function drawGrid() {
    // Lines
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255,255,255,0.07)';
    ctx.lineWidth = 1;

    for (let c = 0; c <= COLS; c++) {
      ctx.moveTo(c * CELL, 0);
      ctx.lineTo(c * CELL, H);
    }
    for (let r = 0; r <= ROWS; r++) {
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(W, r * CELL);
    }
    ctx.stroke();

    // Intersection dots
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    for (let c = 0; c <= COLS; c++) {
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        ctx.arc(c * CELL, r * CELL, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /* ── Draw one particle with trail and glow ────────── */
  function drawParticle(p) {
    const [r, g, b] = p.color;
    const trail = p.trail;
    const len   = trail.length;

    // ── Trail ──
    for (let i = 1; i < len; i++) {
      const t = i / len;          // 0=oldest → 1=newest
      const a = t * t * 0.65;
      ctx.beginPath();
      ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
      ctx.lineTo(trail[i].x,     trail[i].y);
      ctx.strokeStyle = `rgba(${r},${g},${b},${a})`;
      ctx.lineWidth   = p.size * 0.5 * t;
      ctx.lineCap     = 'round';
      ctx.stroke();
    }

    // ── Outer halo ──
    const hx = p.px, hy = p.py;
    const haloR = p.size * 10;
    const halo = ctx.createRadialGradient(hx, hy, 0, hx, hy, haloR);
    halo.addColorStop(0,   `rgba(${r},${g},${b},0.35)`);
    halo.addColorStop(0.35, `rgba(${r},${g},${b},0.10)`);
    halo.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(hx, hy, haloR, 0, Math.PI * 2);
    ctx.fillStyle = halo;
    ctx.fill();

    // ── Inner bloom ──
    const bloomR = p.size * 4;
    const bloom = ctx.createRadialGradient(hx, hy, 0, hx, hy, bloomR);
    bloom.addColorStop(0,   `rgba(255,235,200,0.95)`);
    bloom.addColorStop(0.4, `rgba(${r},${g},${b},0.70)`);
    bloom.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(hx, hy, bloomR, 0, Math.PI * 2);
    ctx.fillStyle = bloom;
    ctx.fill();

    // ── Sharp core ──
    ctx.beginPath();
    ctx.arc(hx, hy, p.size * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,250,245,1)`;
    ctx.fill();
  }

  /* ── Main loop ───────────────────────────────────── */
  function tick() {
    ctx.clearRect(0, 0, W, H);
    drawGrid();
    particles.forEach(p => {
      updateParticle(p);
      drawParticle(p);
    });
    raf = requestAnimationFrame(tick);
  }

  /* ── Init ────────────────────────────────────────── */
  function init() {
    resize();
    particles = Array.from({ length: N_PARTICLES }, (_, i) => spawnParticle(i));
    cancelAnimationFrame(raf);
    tick();
  }

  window.addEventListener('resize', () => { resize(); });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else { raf = requestAnimationFrame(tick); }
  });

  init();
})();

/* ── Project Modal Logic ── */
document.addEventListener('DOMContentLoaded', () => {
  const modalOverlay = document.getElementById('projectModal');
  if (!modalOverlay) return;

  const closeBtn = modalOverlay.querySelector('.project-modal-close');
  const iframe = modalOverlay.querySelector('iframe');
  
  // Elements to update
  const tagEl = modalOverlay.querySelector('.project-modal-tag');
  const titleEl = modalOverlay.querySelector('.project-modal-title');
  const descEl = modalOverlay.querySelector('.project-modal-desc');
  const clientEl = modalOverlay.querySelector('.pm-client');
  const toolsEl = modalOverlay.querySelector('.pm-tools');
  const durationEl = modalOverlay.querySelector('.pm-duration');

  const openModal = (data) => {
    // Update content
    if (data.tag) tagEl.textContent = data.tag;
    if (data.title) titleEl.textContent = data.title;
    if (data.desc) descEl.textContent = data.desc;
    if (data.client) clientEl.textContent = data.client;
    if (data.tools) toolsEl.textContent = data.tools;
    if (data.duration) durationEl.textContent = data.duration;
    
    // Set video src
    if (data.video) {
      iframe.src = data.video;
    }

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    // Stop video
    iframe.src = iframe.src;
  };

  closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Attach to portfolio cards
  // Note: bento-link and portfolio-card-link
  const links = document.querySelectorAll('.bento-link, .portfolio-card-link, .bento-tile');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Get parent container for data extraction if needed, 
      // or we can just open the template with placeholder data
      const container = link.closest('.bento-tile') || link.closest('.portfolio-card');
      let title = "Project Title";
      let tag = "Category";
      let desc = "Description goes here.";
      
      if (container) {
        const titleNode = container.querySelector('.bento-title, .portfolio-card-title');
        const tagNode = container.querySelector('.bento-tag, .portfolio-card-tag');
        const descNode = container.querySelector('.bento-desc, .portfolio-card-desc');
        
        if (titleNode) title = titleNode.textContent;
        if (tagNode) tag = tagNode.textContent;
        if (descNode) desc = descNode.textContent;
      }

      openModal({
        tag: tag,
        title: title,
        desc: desc,
        client: "Client Name",
        tools: "After Effects, Premiere Pro",
        duration: "3 Weeks",
        video: "https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE?rel=0"
      });
    });
  });
});


