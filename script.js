document.addEventListener('DOMContentLoaded', () => {
  // Optional sound control for the Skincare promotional video only.
  const promoVideo = document.querySelector('.skincare-promo-video');
  const soundToggle = document.querySelector('.skincare-sound-toggle');
  if (promoVideo && soundToggle) {
    const updateSoundLabel = () => {
      const silent = promoVideo.muted || promoVideo.volume === 0;
      soundToggle.textContent = silent ? 'Sound on' : 'Sound off';
      soundToggle.setAttribute('aria-label', silent ? 'Turn video sound on' : 'Mute video');
    };
    soundToggle.hidden = false;
    updateSoundLabel();
    promoVideo.addEventListener('volumechange', updateSoundLabel);
    soundToggle.addEventListener('click', async () => {
      const enableSound = promoVideo.muted || promoVideo.volume === 0;
      promoVideo.muted = !enableSound;
      if (enableSound) {
        if (promoVideo.volume === 0) promoVideo.volume = 1;
        try {
          await promoVideo.play();
        } catch {
          promoVideo.muted = true;
        }
      }
      updateSoundLabel();
    });
  }

  // Filter only the existing Skincare collection; keep DOM order and links intact.
  const collection = document.querySelector('.skincare-page #products');
  if (collection) {
    const filterButtons = [...collection.querySelectorAll('[data-filter]')];
    const productCards = [...collection.querySelectorAll('[data-category]')];
    const productGrid = collection.querySelector('.skincare-product-grid');
    const filterStatus = collection.querySelector('.skincare-filter-status');
    const filterMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let filterTimer;
    filterButtons.forEach((button) => button.addEventListener('click', () => {
      clearTimeout(filterTimer);
      const category = button.dataset.filter;
      filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      productGrid.classList.add('is-filtering');
      const applyFilter = () => {
        let count = 0;
        productCards.forEach((card) => {
          card.hidden = category !== 'all' && card.dataset.category !== category;
          if (!card.hidden) {
            count++;
            card.classList.add('visible');
          }
        });
        filterStatus.textContent = `${count} ${count === 1 ? 'product' : 'products'}`;
        productGrid.classList.remove('is-filtering');
      };
      if (filterMotion.matches) applyFilter();
      else filterTimer = setTimeout(applyFilter, 150);
    }));
  }

  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const revealItems = document.querySelectorAll('.reveal');
  const yearTarget = document.getElementById('year');
  const detailSections = document.querySelectorAll('.business-detail');
  const businessesSection = document.getElementById('businesses');

  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navMenu?.classList.contains('open')) {
      navMenu.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
      navToggle.focus();
    }
  });

  // The portfolio header becomes opaque after leaving the top of the page.
  const editorialHeader = document.querySelector('.editorial-header');
  if (editorialHeader) {
    const updateHeader = () => {
      editorialHeader.classList.toggle('is-scrolled', window.scrollY > 16);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
  }

  const sections = document.querySelectorAll('main section[id]');
  const setActiveLink = () => {
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-menu a[href="#${id}"]`);

      if (link && scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach((item) => item.classList.remove('active'));
        link.classList.add('active');
      }
    });
  };

  if (!document.querySelector('.page-section')) {
    setActiveLink();
    window.addEventListener('scroll', setActiveLink);
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Homepage panel navigation; dedicated brand pages retain anchor scrolling.
  const pages = [...document.querySelectorAll('main > .page-section')];
  if (pages.length) {
    const resolvePage = (hash) => {
      const id = hash.replace(/^#/, '');
      return pages.find((page) => page.id === id) ||
        pages[0];
    };
    const activatePage = (page, { push = false, focus = false } = {}) => {
      pages.forEach((item) => {
        const active = item === page;
        item.classList.toggle('active', active);
        item.hidden = !active;
      });
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${page.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
      if (push && location.hash !== `#${page.id}`) {
        history.pushState(null, '', `#${page.id}`);
      }
      navMenu?.classList.remove('open');
      navToggle?.setAttribute('aria-expanded', 'false');
      navToggle?.setAttribute('aria-label', 'Open menu');
      if (focus) page.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: reducedMotion.matches || !focus ? 'instant' : 'smooth' });
    };
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      const hash = link.getAttribute('href');
      if (!pages.some((page) => hash === `#${page.id}`) && !['#projects', '#testimonials', '#what-people-say', '#home-businesses'].includes(hash)) return;
      event.preventDefault();
      activatePage(resolvePage(hash), { push: true, focus: true });
    });
    window.addEventListener('hashchange', () => activatePage(resolvePage(location.hash)));
    window.addEventListener('popstate', () => activatePage(resolvePage(location.hash)));
    activatePage(resolvePage(location.hash));
  }

  const showAllReveals = () => {
    revealItems.forEach((item) => item.classList.add('visible'));
  };

  // One observer powers the existing fade-up sections on every page.
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    document.body.classList.add('motion-ready');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealItems.forEach((item) => revealObserver.observe(item));
    reducedMotion.addEventListener('change', (event) => {
      if (event.matches) {
        revealObserver.disconnect();
        showAllReveals();
      }
    });
  } else {
    showAllReveals();
  }

  const toggleBusinessDetail = (id) => {
    const target = document.getElementById(id);
    if (!target) return;

    detailSections.forEach((section) => {
      if (section !== target) {
        section.classList.remove('is-visible');
      }
    });

    const shouldOpen = !target.classList.contains('is-visible');
    target.classList.toggle('is-visible', shouldOpen);

    if (shouldOpen) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
      });
    } else if (businessesSection) {
      businessesSection.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
    }
  };

  document.querySelectorAll('.business-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;
      if (targetId) {
        toggleBusinessDetail(targetId);
      }
    });
  });

  document.querySelectorAll('.business-close').forEach((button) => {
    button.addEventListener('click', () => {
      const closeTarget = button.dataset.close;
      if (closeTarget) {
        const target = document.getElementById(closeTarget);
        if (target) {
          target.classList.remove('is-visible');
          if (businessesSection) {
            businessesSection.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth', block: 'start' });
          }
        }
      }
    });
  });

  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (pages.length) {
        contactForm.querySelector('.form-status').textContent = 'Your message has not been sent. Please contact me using the email or WhatsApp link.';
        return;
      }
      const button = contactForm.querySelector('button');
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Message Sent';
        button.disabled = true;
        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
          contactForm.reset();
        }, 2000);
      }
    });
  }
});
