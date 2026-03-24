/**
 * FaithBeautyGlam Hairstylist — script.js
 * Handles: sticky header, mobile nav, Intersection Observer animations,
 * back-to-top button, smooth scroll, gallery hover, and stats counter.
 */

'use strict';

/* ===================================================
   1. STICKY HEADER — add shadow on scroll
=================================================== */
(function initStickyHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run on load in case of page refresh mid-scroll
})();


/* ===================================================
   2. MOBILE NAV — hamburger toggle
=================================================== */
(function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('nav-mobile');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!hamburger || !navMobile) return;

  const openMenu = () => {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    navMobile.classList.add('open');
    navMobile.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = '';
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    navMobile.classList.remove('open');
    navMobile.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navMobile.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close nav when any link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMobile.contains(e.target)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();


/* ===================================================
   3. SMOOTH SCROLL — for anchor links
=================================================== */
(function initSmoothScroll() {
  const headerHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '76',
    10
  );

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();

      const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });
})();


/* ===================================================
   4. INTERSECTION OBSERVER — fade-in / fade-up animations
=================================================== */
(function initAnimations() {
  // Respect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-in, .fade-up').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const options = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, options);

  // Observe all animation targets
  document.querySelectorAll('.fade-in, .fade-up').forEach(el => {
    observer.observe(el);
  });
})();


/* ===================================================
   5. BACK TO TOP BUTTON
=================================================== */
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  toggleVisibility();
})();


/* ===================================================
   6. STATS COUNTER ANIMATION
   Counts up to the target number when the stats bar enters view
=================================================== */
(function initStatsCounter() {
  const statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;

  // Only animate numeric values
  const statNumbers = statsBar.querySelectorAll('.stat-number');

  const targets = [];
  statNumbers.forEach(el => {
    const raw = el.textContent.trim();
    const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const suffix = raw.replace(/[0-9.]/g, '').trim();
    if (!isNaN(num) && num > 0) {
      targets.push({ el, target: num, suffix, isFloat: raw.includes('.') });
    }
  });

  if (targets.length === 0) return;

  let animated = false;

  const animateCounters = () => {
    if (animated) return;
    animated = true;

    const duration = 1400;
    const startTime = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      targets.forEach(({ el, target, suffix, isFloat }) => {
        const current = target * ease;
        el.textContent = isFloat
          ? current.toFixed(1) + suffix
          : Math.floor(current) + suffix;
      });

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        // Ensure final exact values
        targets.forEach(({ el, target, suffix, isFloat }) => {
          el.textContent = isFloat
            ? target.toFixed(1) + suffix
            : target + suffix;
        });
      }
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsBar);
})();


/* ===================================================
   7. GALLERY — keyboard accessibility & lightbox hint
=================================================== */
(function initGallery() {
  const items = document.querySelectorAll('.gallery-item');

  items.forEach(item => {
    // Make gallery items focusable for keyboard users
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'img');

    // Trigger hover state on focus (keyboard)
    item.addEventListener('focus', () => {
      item.querySelector('figcaption') &&
        (item.querySelector('figcaption').style.opacity = '1');
    });

    item.addEventListener('blur', () => {
      item.querySelector('figcaption') &&
        (item.querySelector('figcaption').style.opacity = '');
    });
  });
})();


/* ===================================================
   8. HEADER ACTIVE NAV — highlight current section
=================================================== */
(function initActiveNav() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const headerH = 80;

  const setActive = () => {
    let currentId = '';

    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= headerH + 40) {
        currentId = sec.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + currentId) {
        link.style.color = 'var(--brown-dark)';
      } else {
        link.style.color = '';
      }
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();


/* ===================================================
   9. SERVICE CARDS — staggered appearance
=================================================== */
(function initServiceCards() {
  const cards = document.querySelectorAll('.service-card');

  cards.forEach((card, i) => {
    // Clear any existing delay class conflicts and set stagger
    if (!card.classList.contains('delay-1') &&
        !card.classList.contains('delay-2') &&
        !card.classList.contains('delay-3')) {
      const delayMs = (i % 3) * 120;
      card.style.transitionDelay = `${delayMs}ms`;
    }
  });
})();


/* ===================================================
   10. PHONE LINK — track click intent (no analytics needed,
   just ensures the tel: link logs to console for debugging)
=================================================== */
(function initPhoneTracking() {
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
      // Placeholder for future analytics integration
      console.log('[FaithBeautyGlam] Phone call initiated:', link.href);
    });
  });
})();


/* ===================================================
   11. TESTIMONIAL CARDS — subtle parallax tilt on desktop hover
=================================================== */
(function initTestimonialTilt() {
  // Only on pointer devices, skip touch
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.testimonial-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
      card.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
