/* =============================================================
   BURNT CHICKEN — main.js
   Handles: Lenis smooth scroll, GSAP animations,
            header scroll, mobile menu, sticky CTA, year
   ============================================================= */

(function () {
  'use strict';

  /* -----------------------------------------------------------
     REDUCED MOTION CHECK
     ----------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* -----------------------------------------------------------
     YEAR
     ----------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -----------------------------------------------------------
     LENIS SMOOTH SCROLL
     ----------------------------------------------------------- */
  let lenis = null;

  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync with GSAP ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* -----------------------------------------------------------
     HEADER – scroll state
     ----------------------------------------------------------- */
  const header = document.getElementById('header');
  if (header) {
    function onScroll() {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* -----------------------------------------------------------
     MOBILE MENU
     ----------------------------------------------------------- */
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('open');
      mobileMenu.classList.toggle('open', !isOpen);
      menuToggle.classList.toggle('open', !isOpen);
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      mobileMenu.setAttribute('aria-hidden', String(isOpen));
    });

    // Close on any link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* -----------------------------------------------------------
     MOBILE STICKY ORDER CTA
     ----------------------------------------------------------- */
  const stickyOrder = document.getElementById('stickyOrder');
  if (stickyOrder) {
    function updateSticky() {
      if (window.scrollY > 300) {
        stickyOrder.classList.add('visible');
      } else {
        stickyOrder.classList.remove('visible');
      }
    }
    window.addEventListener('scroll', updateSticky, { passive: true });
    updateSticky();
  }

  /* -----------------------------------------------------------
     GSAP ANIMATIONS
     Only run if GSAP + ScrollTrigger are available AND
     the user hasn't requested reduced motion.
     ----------------------------------------------------------- */
  if (prefersReducedMotion || typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* Helper: reveal element(s) when scrolled into view */
  function revealOnScroll(targets, vars, triggerEl) {
    gsap.fromTo(
      targets,
      Object.assign({ opacity: 0, y: 40 }, vars.from || {}),
      Object.assign({
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: triggerEl || (Array.isArray(targets) ? targets[0] : targets),
          start: 'top 82%',
        },
      }, vars.to || {})
    );
  }

  /* ==========================================================
     HOME PAGE ANIMATIONS
     ========================================================== */

  /* Hero entrance */
  const heroIcon     = document.getElementById('heroIcon');
  const heroHeadline = document.getElementById('heroHeadline');
  const heroTagline  = document.getElementById('heroTagline');
  const heroCtas     = document.getElementById('heroCtas');
  const heroSplatter = document.querySelector('.hero__splatter-1');

  if (heroIcon) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(heroIcon,
      { scale: 1.5, rotation: 15, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 0.9, ease: 'back.out(1.6)' }
    );
    if (heroHeadline) {
      tl.fromTo(heroHeadline,
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        '-=0.5'
      );
    }
    if (heroTagline) {
      tl.fromTo(heroTagline,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        '-=0.55'
      );
    }
    if (heroCtas) {
      tl.fromTo(heroCtas,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.45'
      );
    }
    if (heroSplatter) {
      tl.fromTo(heroSplatter,
        { opacity: 0, scale: 0.75 },
        { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' },
        '-=1.2'
      );
    }
  }

  /* Featured section title */
  const featuredLabel = document.getElementById('featuredLabel');
  const featuredTitle = document.getElementById('featuredTitle');
  if (featuredTitle) {
    gsap.fromTo(
      [featuredLabel, featuredTitle].filter(Boolean),
      { clipPath: 'inset(0 0 100% 0)', y: 20 },
      {
        clipPath: 'inset(0 0 0% 0)',
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: featuredTitle, start: 'top 85%' },
      }
    );
  }

  /* Item cards stagger */
  const cards = document.querySelectorAll('.item-card');
  if (cards.length) {
    gsap.fromTo(
      cards,
      { y: 55, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: document.getElementById('cardsGrid'), start: 'top 82%' },
      }
    );
  }

  /* Vibe section */
  const vibeLeft  = document.getElementById('vibeLeft');
  const vibeItems = document.getElementById('vibeItems');
  if (vibeLeft) {
    gsap.fromTo(vibeLeft,
      { x: -50, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: vibeLeft, start: 'top 82%' },
      }
    );
  }
  if (vibeItems) {
    gsap.fromTo(
      vibeItems.querySelectorAll('.vibe__item'),
      { x: 50, opacity: 0 },
      {
        x: 0, opacity: 1, duration: 0.7, stagger: 0.14, ease: 'power3.out',
        scrollTrigger: { trigger: vibeItems, start: 'top 82%' },
      }
    );
  }

  /* Parallax on vibe splatter */
  const vibeSplatter = document.querySelector('.vibe__splatter');
  if (vibeSplatter) {
    gsap.to(vibeSplatter, {
      y: -70,
      ease: 'none',
      scrollTrigger: {
        trigger: '.vibe',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });
  }

  /* Location grid */
  const locationGrid = document.getElementById('locationGrid');
  if (locationGrid) {
    const locationTitle = document.getElementById('locationTitle');
    if (locationTitle) {
      revealOnScroll(locationTitle, { from: { y: 30 } });
    }
    gsap.fromTo(
      locationGrid.children,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.14, ease: 'power3.out',
        scrollTrigger: { trigger: locationGrid, start: 'top 80%' },
      }
    );
  }

  /* ==========================================================
     ABOUT PAGE ANIMATIONS
     ========================================================== */

  /* About hero headline */
  const aboutHeadline = document.getElementById('aboutHeadline');
  if (aboutHeadline) {
    gsap.fromTo(aboutHeadline,
      { y: 70, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.25 }
    );
  }

  /* Story text cascade */
  const storyText = document.getElementById('storyText');
  if (storyText) {
    gsap.fromTo(
      storyText.querySelectorAll('h3, p'),
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: storyText, start: 'top 80%' },
      }
    );
  }

  /* Pledge cards */
  const pledgesGrid = document.getElementById('pledgesGrid');
  if (pledgesGrid) {
    gsap.fromTo(
      pledgesGrid.querySelectorAll('.pledge-card'),
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.7, stagger: 0.13, ease: 'power3.out',
        scrollTrigger: { trigger: pledgesGrid, start: 'top 78%' },
      }
    );
  }

  /* About CTA panel */
  const aboutCta = document.getElementById('aboutCta');
  if (aboutCta) {
    gsap.fromTo(aboutCta,
      { scale: 0.95, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: aboutCta, start: 'top 82%' },
      }
    );
  }

})();
