/* ═══════════════════════════════════════════════
   CutFusion Studio — Premium Interactive JS
   ═══════════════════════════════════════════════ */

/* ── Preloader ── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const video = document.getElementById('preloader-video');
  
  const hidePreloader = () => {
    if (preloader && !preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      document.querySelectorAll('.hero-animate').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 180);
      });
    }
  };

  if (video) {
    video.addEventListener('ended', hidePreloader);
    // Fallback: hide preloader after 5 seconds in case video fails or loops infinitely
    setTimeout(hidePreloader, 5000);
  } else {
    setTimeout(hidePreloader, 2200);
  }
});

/* ── Custom Cursor ── */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing) {
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mousedown', () => {
    cursorDot.classList.add('clicking');
    cursorRing.classList.add('clicking');
  });

  document.addEventListener('mouseup', () => {
    cursorDot.classList.remove('clicking');
    cursorRing.classList.remove('clicking');
  });

  // Hover states
  document.querySelectorAll('a, button, [data-hover], .bento-tile, .service-card, .process-step, .market-card, .metric-card, .testimonial-card, .social-link, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('hovering');
      cursorRing.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('hovering');
      cursorRing.classList.remove('hovering');
    });
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;

    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';

    requestAnimationFrame(renderCursor);
  }
  renderCursor();
}

/* ── Magnetic Buttons ── */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translate(0, 0)';
  });
});

/* ── Navbar Scroll Effect ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

/* ── Scroll Reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
  revealObserver.observe(el);
});

/* ── Smooth Scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Mobile Hamburger ── */
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    if (navLinks) navLinks.classList.toggle('open');
  });
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }
}

/* ── Contact Form ── */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span style="color:#000;">Message Sent! ✓</span>';
      btn.style.pointerEvents = 'none';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.pointerEvents = '';
        contactForm.reset();
      }, 3000);
    }
  });
}

/* ── Project Modal ── */
document.addEventListener('DOMContentLoaded', () => {
  const modalOverlay = document.getElementById('projectModal');
  if (!modalOverlay) return;

  const closeBtn = modalOverlay.querySelector('.project-modal-close');
  const iframe = modalOverlay.querySelector('iframe');
  const tagEl = modalOverlay.querySelector('.project-modal-tag');
  const titleEl = modalOverlay.querySelector('.project-modal-title');
  const descEl = modalOverlay.querySelector('.project-modal-desc');
  const clientEl = modalOverlay.querySelector('.pm-client');
  const toolsEl = modalOverlay.querySelector('.pm-tools');
  const durationEl = modalOverlay.querySelector('.pm-duration');

  const openModal = (data) => {
    if (tagEl) tagEl.textContent = data.tag || 'Category';
    if (titleEl) titleEl.textContent = data.title || 'Project Title';
    if (descEl) descEl.textContent = data.desc || '';
    if (clientEl) clientEl.textContent = data.client || 'Client';
    if (toolsEl) toolsEl.textContent = data.tools || 'After Effects, Premiere';
    if (durationEl) durationEl.textContent = data.duration || '2 Weeks';
    if (iframe && data.video) iframe.src = data.video;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (iframe) iframe.src = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  document.querySelectorAll('.bento-tile, .portfolio-card-link').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const tile = el.closest('.bento-tile') || el.closest('.portfolio-card');
      openModal({
        tag: tile?.dataset.tag || tile?.querySelector('.bento-tag, .portfolio-card-tag')?.textContent || 'Category',
        title: tile?.dataset.title || tile?.querySelector('.bento-title, .portfolio-card-title')?.textContent || 'Project',
        desc: tile?.dataset.desc || tile?.querySelector('.bento-desc, .portfolio-card-desc')?.textContent || '',
        client: tile?.dataset.kpi || '+40% Inscriptions Gratuites / Trial Signups',
        tools: tile?.dataset.tools || 'After Effects, Cinema 4D, DaVinci Resolve',
        duration: tile?.dataset.duration || '5-10 Jours',
        video: 'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0'
      });
    });
  });
});

/* ── Hero Parallax on Mouse Move ── */
const heroSection = document.querySelector('.hero');
const auroraGlow = document.getElementById('aurora-glow');
const auroraStreaks = document.getElementById('aurora-streaks');

if (heroSection && (auroraGlow || auroraStreaks)) {
  heroSection.addEventListener('mousemove', e => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.05;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.05;
    
    if (auroraGlow) auroraGlow.style.transform = `translate(${x}px, ${y}px)`;
    if (auroraStreaks) auroraStreaks.style.transform = `translate(${x * 1.8}px, ${y * 1.8}px)`;
  });
  
  heroSection.addEventListener('mouseleave', () => {
    if (auroraGlow) auroraGlow.style.transform = 'translate(0px, 0px)';
    if (auroraStreaks) auroraStreaks.style.transform = 'translate(0px, 0px)';
  });
}

/* ── Animated Grid Canvas ── */
;(function() {
  const canvas = document.getElementById('gridCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let w, h, cols, rows;
  const spacing = 60;
  let mouseX = -1000, mouseY = -1000;
  let raf;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cols = Math.ceil(w / spacing) + 1;
    rows = Math.ceil(h / spacing) + 1;
  }

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * spacing;
        const y = j * spacing;
        const dx = mouseX - x;
        const dy = mouseY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 250;

        let alpha = 0.04;
        let radius = 1;
        let r = 255, g = 255, b = 255;

        if (dist < maxDist) {
          const factor = 1 - dist / maxDist;
          alpha = 0.04 + factor * 0.2;
          radius = 1 + factor * 2.5;
          // Orange tint near mouse
          r = 255;
          g = Math.floor(255 - factor * 174); // towards 81
          b = Math.floor(255 - factor * 255); // towards 0
        }

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.fill();
      }
    }

    // Draw subtle grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.025)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < cols; i++) {
      ctx.beginPath();
      ctx.moveTo(i * spacing, 0);
      ctx.lineTo(i * spacing, h);
      ctx.stroke();
    }
    for (let j = 0; j < rows; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * spacing);
      ctx.lineTo(w, j * spacing);
      ctx.stroke();
    }

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else draw();
  });

  resize();
  draw();
})();

/* ── FAQ Accordion Toggle ── */
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      faqItems.forEach(i => i.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
});

/* ── Typewriter Effect & Lightweight I18n Engine ── */
let currentLang = 'fr';
let typewriterInterval = null;

const I18N_DICT = {
  fr: {
    nav_cta: "DEVIS RAPIDE",
    hero_pill: "Studio Vidéo &amp; Motion Design IA 🎉",
    hero_h1_1: "Des vidéos qui",
    hero_h1_2: "convertissent<span style=\"color: var(--accent-primary); filter: drop-shadow(0 0 30px rgba(255,81,0,0.8));\">.</span>",
    hero_desc: "Nous combinons artisanat 100% humain (tournage studio à Tunis, motion 2D/3D) et production hybride IA pour faire rayonner votre marque et dominer vos marchés.",
    hero_cta_start: "Lancer votre Projet",
    hero_cta_services: "Découvrir les Services",
    badge_cinema: "Cinéma Réel",
    badge_motion: "Motion 2D / 3D",
    badge_ai: "IA Générative",
    badge_hybrid: "Hybride Hollywood",
    badge_vsl: "VSL &amp; Avatars",
    badge_yt: "YouTube Growth",
    services_h2_1: "MOTION, TOURNAGE, ",
    services_h2_2: "PRODUCTION IA",
    services_h2_3: "— NOUS AVONS TOUT ",
    services_h2_4: "PRÉVU.",
    s1_title: "MOTION<br>EXPLAINER<br>2D / 3D SAAS",
    s1_desc: "Vidéos explicatives 100% artisanat humain. Animation cinématique d'interfaces Figma et modélisation 3D pour transformer des flux complexes en conversions immédiates.",
    s2_title: "TOURNAGE<br>STUDIO &amp; EXT.<br>À TUNIS",
    s2_desc: "100% Caméra réelle &amp; 0% IA. Tournage cinéma in-house dans notre studio à Tunis et extérieur pour marques de luxe, cosmétiques, hôtellerie et corporate.",
    s3_title: "PRODUCTION<br>HYBRIDE<br>\"HOLLYWOOD\"",
    s3_desc: "60% environnements IA photoréalistes + 40% finition studio senior &amp; étalonnage DaVinci Resolve Rec.709. Rendu cinéma international à coût optimisé.",
    s4_title: "VSL &amp; AVATARS<br>HAUTE<br>CONVERSION",
    s4_desc: "Publicités vidéo de vente et avatars génératifs multilingues (Français, Anglais, Derja Tunisienne) avec ingénierie de hooks pour maximiser le ROAS.",
    s5_title: "YOUTUBE &amp;<br>SHORT-FORM<br>GROWTH",
    s5_desc: "Montage rétention pour créateurs et marques, sound design immersif, miniatures cliquables et gestion complète pour dominer les algorithmes.",
    process_title: "DU BRIEF À LA <span class=\"italic\">LIVRAISON</span>",
    process_sub: "Un workflow transparent et structuré — En Studio à Tunis &amp; 100% Remote à l'International, délais respectés.",
    call_pill: "Discutons sur WhatsApp",
    call_h2: "Un appel de<br>30 minutes ?",
    contact_h3_wrap: "PARLONS DE VOTRE <span class=\"italic\">PROCHAINE CAMPAGNE</span>",
    contact_p: "Découvrez comment CutFusion produit vos contenus avec une qualité cinéma — En Studio à Tunis ou 100% Remote. Devis gratuit, réponse sous 24h.",
    typewriter: "Votre marque est la prochaine."
  },
  en: {
    nav_cta: "GET A QUOTE",
    hero_pill: "Introducing AI-Powered Video Studio 🎉",
    hero_h1_1: "We make video",
    hero_h1_2: "that converts<span style=\"color: var(--accent-primary); filter: drop-shadow(0 0 30px rgba(255,81,0,0.8));\">.</span>",
    hero_desc: "We manage your social media, blending premium design and high-end motion graphics to elevate your brand and dominate your online presence.",
    hero_cta_start: "Start Your Project",
    hero_cta_services: "Explore Services",
    badge_cinema: "Real Cinema",
    badge_motion: "Motion 2D / 3D",
    badge_ai: "AI Generative",
    badge_hybrid: "Hybrid Hollywood",
    badge_vsl: "VSL &amp; Avatars",
    badge_yt: "YouTube Growth",
    services_h2_1: "MOTION, EDITING, ",
    services_h2_2: "AI PRODUCTION",
    services_h2_3: "— WE'VE GOT YOU ",
    services_h2_4: "COVERED.",
    s1_title: "MOTION<br>EXPLAINER<br>FOR SAAS",
    s1_desc: "Cinematic animated explainers that turn complex SaaS products into instant \"I need this\" moments for your audience.",
    s2_title: "IN-HOUSE &amp;<br>OUTDOOR<br>SHOOTS",
    s2_desc: "100% Real cinema cameras &amp; 0% AI. Studio and on-location filming in Tunis for luxury brands, cosmetics, hospitality, and corporate.",
    s3_title: "HYBRID<br>\"HOLLYWOOD\"<br>PRODUCTION",
    s3_desc: "60% photorealistic AI environments + 40% senior studio craft &amp; DaVinci Resolve Rec.709 color grading.",
    s4_title: "HIGH-CONVERTING<br>VSL &amp; AI<br>AVATARS",
    s4_desc: "Multilingual conversion video sales letters (French, English, Tunisian Derja) with hook engineering to multiply ROAS.",
    s5_title: "YOUTUBE &amp;<br>SHORT-FORM<br>GROWTH",
    s5_desc: "Retention editing, hooks, sound design, custom thumbnails, and full-stack channel management to conquer algorithms.",
    process_title: "FROM BRIEF TO <span class=\"italic\">DELIVERY</span>",
    process_sub: "A transparent, structured workflow — In-Studio in Tunis &amp; 100% Remote Worldwide, deadlines respected, feedback in real-time.",
    call_pill: "Better call us",
    call_h2: "Let's have a<br>30-min call",
    contact_h3_wrap: "LET'S TALK ABOUT YOUR <span class=\"italic\">NEXT CAMPAIGN</span>",
    contact_p: "Discover how CutFusion can produce your video assets with unmatched premium quality — remotely or in-studio. Free quote, response within 24h.",
    typewriter: "Your brand is next."
  }
};

function runTypewriter() {
  const typewriterEl = document.getElementById('typewriter');
  if (!typewriterEl) return;
  if (typewriterInterval) clearInterval(typewriterInterval);

  const textToType = I18N_DICT[currentLang]?.typewriter || "Votre marque est la prochaine.";
  typewriterEl.textContent = "";
  let i = 0;

  typewriterInterval = setInterval(() => {
    typewriterEl.textContent += textToType.charAt(i);
    i++;
    if (i >= textToType.length) {
      clearInterval(typewriterInterval);
    }
  }, 70);
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('cutfusion_lang', lang);

  const dict = I18N_DICT[lang];
  if (!dict) return;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      el.innerHTML = dict[key];
    }
  });

  const btnFr = document.getElementById('lang-btn-fr');
  const btnEn = document.getElementById('lang-btn-en');
  if (btnFr && btnEn) {
    if (lang === 'fr') {
      btnFr.style.color = '#fff';
      btnFr.style.opacity = '1';
      btnEn.style.color = 'rgba(255,255,255,0.4)';
    } else {
      btnEn.style.color = '#fff';
      btnEn.style.opacity = '1';
      btnFr.style.color = 'rgba(255,255,255,0.4)';
    }
  }

  runTypewriter();
}

document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('cutfusion_lang') || 'fr';
  setLanguage(savedLang);

  const btnFr = document.getElementById('lang-btn-fr');
  const btnEn = document.getElementById('lang-btn-en');
  if (btnFr) btnFr.addEventListener('click', () => setLanguage('fr'));
  if (btnEn) btnEn.addEventListener('click', () => setLanguage('en'));

  setTimeout(runTypewriter, 2600);
});

// Drag to scroll for horizontal scroll containers
const sliders = document.querySelectorAll('.services-cards');
let isDown = false;
let startX;
let scrollLeft;

sliders.forEach(slider => {
  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.style.cursor = 'grabbing';
    slider.style.scrollSnapType = 'none'; // Disable snapping while dragging
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.style.cursor = 'grab';
    slider.style.scrollSnapType = 'x mandatory';
  });
  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.style.cursor = 'grab';
    slider.style.scrollSnapType = 'x mandatory';
  });
  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast multiplier
    slider.scrollLeft = scrollLeft - walk;
  });
  slider.style.cursor = 'grab';
});

// Chart Interactive Toggles
const chartToggles = document.querySelectorAll('.chart-toggles button');
const chartValue = document.querySelector('.chart-value');
const chartChange = document.querySelector('.chart-change');
const chartActiveLine = document.querySelector('.chart-line-active');

const chartData = {
  '1H': { value: '$2.1K', change: '+0.4%' },
  '1D': { value: '$14.5K', change: '+2.1%' },
  '1W': { value: '$86.2K', change: '+5.4%' },
  '1M': { value: '$210K', change: '-1.2%' },
  'ALL': { value: '$1.2M / 6months', change: '+34.5%' }
};

chartToggles.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    chartToggles.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    
    // Get text like "1H", "ALL"
    const period = btn.textContent.trim();
    if(chartData[period]) {
      chartValue.textContent = chartData[period].value;
      chartChange.textContent = chartData[period].change;
      
      // Update color based on positive/negative
      if(chartData[period].change.startsWith('-')) {
        chartChange.style.color = '#ff3333';
      } else {
        chartChange.style.color = '#ff5100';
      }
    }
    
    // Retrigger animation
    if(chartActiveLine) {
      chartActiveLine.style.animation = 'none';
      chartActiveLine.offsetHeight; // trigger reflow
      // removed animation re-trigger in favor of scroll event
    }
  });
});

// Scroll-linked chart animation
const scrollChartPath = document.getElementById('scrollChartPath');
if (scrollChartPath) {
  const pathLength = scrollChartPath.getTotalLength();
  scrollChartPath.style.strokeDasharray = pathLength;
  scrollChartPath.style.strokeDashoffset = pathLength;

  window.addEventListener('scroll', () => {
    // Get the chart container's position
    const container = document.getElementById('performanceDashboard');
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate how much of the chart is visible
    // 0 = just starting to enter from bottom, 1 = fully scrolled past top
    let scrollPercentage = (windowHeight - rect.top) / (windowHeight + rect.height);
    
    // Clamp between 0 and 1
    scrollPercentage = Math.max(0, Math.min(1, scrollPercentage));
    
    // Add a curve to the animation so it draws quickly at first then slows
    const easeOut = 1 - Math.pow(1 - scrollPercentage, 3);
    
    // Calculate draw amount
    const drawLength = pathLength * easeOut;
    
    // Reverse offset: pathLength - drawLength
    scrollChartPath.style.strokeDashoffset = pathLength - drawLength;
  });
}

