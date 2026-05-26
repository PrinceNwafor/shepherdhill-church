/* ==========================================================================
   SHEPHERDHILL BAPTIST CHURCH — Main JS
   ========================================================================== */
(function () {
  'use strict';

  const nav = document.querySelector('.nav');
  const menuBtn = document.querySelector('.nav__menu-btn');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavClose = document.querySelector('.mobile-nav__close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');

  if (nav) {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add('nav--scrolled');
        nav.classList.remove('nav--transparent');
      } else {
        nav.classList.remove('nav--scrolled');
        if (nav.dataset.transparent === 'true') nav.classList.add('nav--transparent');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  function openMobileNav() {
    if (mobileNav) { mobileNav.classList.add('mobile-nav--open'); document.body.style.overflow = 'hidden'; }
  }
  function closeMobileNav() {
    if (mobileNav) { mobileNav.classList.remove('mobile-nav--open'); document.body.style.overflow = ''; }
  }
  if (menuBtn) menuBtn.addEventListener('click', openMobileNav);
  if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
  mobileNavLinks.forEach(l => l.addEventListener('click', closeMobileNav));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobileNav(); });

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('reveal--visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('reveal--visible'));
  }

  /* Giving amount selector */
  const givingAmounts = document.querySelectorAll('.giving-amount');
  const customAmount = document.querySelector('#custom-amount');
  givingAmounts.forEach(btn => {
    btn.addEventListener('click', () => {
      givingAmounts.forEach(b => b.classList.remove('giving-amount--active'));
      btn.classList.add('giving-amount--active');
      const value = btn.dataset.amount;
      if (customAmount && value !== 'custom') customAmount.value = value;
      if (value === 'custom' && customAmount) customAmount.focus();
    });
  });

  /* Form submission toast */
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✓' : '!'}</span><span>${message}</span>`;
    Object.assign(toast.style, {
      position: 'fixed', bottom: '20px', left: '50%',
      transform: 'translateX(-50%) translateY(8px)',
      background: type === 'success' ? '#1E3F7A' : '#C9913D',
      color: 'white', padding: '12px 20px', borderRadius: '40px',
      fontFamily: 'Inter, sans-serif', fontSize: '14px', fontWeight: '500',
      display: 'flex', alignItems: 'center', gap: '8px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)', zIndex: '9999',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
      opacity: '0', maxWidth: 'calc(100vw - 40px)', textAlign: 'center'
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  function handleForm(id, msg) {
    const form = document.getElementById(id);
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const original = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
      setTimeout(() => {
        showToast(msg || 'Submitted successfully!');
        form.reset();
        if (btn) { btn.textContent = original; btn.disabled = false; }
      }, 900);
    });
  }
  handleForm('contact-form', 'Your message has been sent. We\'ll be in touch soon!');
  handleForm('prayer-form', 'Your prayer request has been received. We\'re praying for you.');
  handleForm('visit-form', 'Thank you! Someone will reach out to welcome you.');
  handleForm('newsletter-form', 'You\'re subscribed! Welcome to the family.');

  /* Stats counter */
  function animateCounter(el, target, duration = 1600) {
    const start = performance.now();
    function update(time) {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * eased);
      el.textContent = current.toLocaleString() + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
  const statNumbers = document.querySelectorAll('.stat-card__number[data-count]');
  if (statNumbers.length && 'IntersectionObserver' in window) {
    const statObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target, parseInt(e.target.dataset.count, 10));
          statObs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => statObs.observe(el));
  }

  /* Smooth scroll anchors */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href.length <= 1) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* Active nav link */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link, .mobile-nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('nav__link--active');
    }
  });

  /* Events filter */
  const filterBtns = document.querySelectorAll('[data-filter]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('filter-active'));
      btn.classList.add('filter-active');
      document.querySelectorAll('[data-category]').forEach(card => {
        card.style.display = (f === 'all' || card.dataset.category === f) ? '' : 'none';
      });
    });
  });

  /* Try to autoplay hero video on iOS (muted+playsinline required) */
  const heroVid = document.querySelector('.hero__video');
  if (heroVid) {
    const tryPlay = () => { heroVid.play().catch(() => {}); };
    tryPlay();
    document.addEventListener('touchstart', tryPlay, { once: true, passive: true });
  }
})();
