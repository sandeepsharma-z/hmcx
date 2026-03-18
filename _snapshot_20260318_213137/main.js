/* ============================================================
   HmcxStudio – Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ---- Navbar Scroll ---- */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  /* ---- Active Nav Link ---- */
  if (navbar) {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navbar.querySelectorAll('.nav-links a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ---- Mobile Menu ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---- Hero Slider ---- */
  const slides = document.querySelectorAll('.slide');
  const progressBar = document.querySelector('.slide-progress span');
  const heroSection = document.querySelector('#hero');
  if (slides.length > 0) {
    let currentSlide = 0;
    const slideDuration = 6000;
    let sliderTimer = null;
    let isPaused = false;
    let startX = 0, deltaX = 0;

    function restartProgress() {
      if (!progressBar) return;
      progressBar.style.animation = 'none';
      progressBar.offsetHeight;
      progressBar.style.animation = `progress ${slideDuration}ms linear forwards`;
    }

    function goToSlide(n, isManual = false) {
      slides[currentSlide].classList.remove('active');
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      restartProgress();
      if (isManual) {
        clearInterval(sliderTimer);
        sliderTimer = setInterval(() => goToSlide(currentSlide + 1), slideDuration);
      }
    }

    const nextBtn = document.getElementById('nextSlide');
    const prevBtn = document.getElementById('prevSlide');
    if (nextBtn) nextBtn.onclick = () => goToSlide(currentSlide + 1, true);
    if (prevBtn) prevBtn.onclick = () => goToSlide(currentSlide - 1, true);

    sliderTimer = setInterval(() => { if (!isPaused) goToSlide(currentSlide + 1); }, slideDuration);
    restartProgress();

    if (heroSection) {
      heroSection.addEventListener('mouseenter', () => { isPaused = true; });
      heroSection.addEventListener('mouseleave', () => { isPaused = false; restartProgress(); });
      heroSection.addEventListener('pointerdown', e => { startX = e.clientX; deltaX = 0; });
      heroSection.addEventListener('pointermove', e => { if (startX) deltaX = e.clientX - startX; });
      heroSection.addEventListener('pointerup', () => {
        if (Math.abs(deltaX) > 60) { deltaX < 0 ? goToSlide(currentSlide + 1, true) : goToSlide(currentSlide - 1, true); }
        startX = 0; deltaX = 0;
      });
    }
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goToSlide(currentSlide + 1, true);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goToSlide(currentSlide - 1, true);
    });
  }

  /* ---- Scroll Reveal Animation ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => revealObserver.observe(el));

  /* ---- Counter Animation ---- */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(el => {
          const target = +el.getAttribute('data-target');
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          let current = 0;
          const step = Math.max(target / 80, 0.5);
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = prefix + Math.round(current).toLocaleString() + suffix;
            if (current >= target) clearInterval(timer);
          }, 20);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('.stats-grid, .milestone-grid').forEach(el => counterObserver.observe(el));

  /* ---- Portfolio / Project Filter ---- */
  document.querySelectorAll('.pf-btn, .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.portfolio-filter, .projects-filter');
      if (parent) parent.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || btn.textContent.trim();
      const items = document.querySelectorAll('.portfolio-item, .project-card');
      items.forEach(item => {
        const cat = item.getAttribute('data-cat') || '';
        const show = filter === '*' || filter === 'All' || cat.toLowerCase().includes(filter.toLowerCase());
        item.style.display = show ? '' : 'none';
        if (show) { item.style.animation = 'fadeIn .4s ease'; }
      });
    });
  });

  /* ---- Chatbot ---- */
  const chatbotFab = document.getElementById('chatbotFab');
  const chatbotPanel = document.getElementById('chatbotPanel');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatbotSend = document.getElementById('chatbotSend');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotMessages = document.getElementById('chatbotMessages');

  if (chatbotFab && chatbotPanel) {
    chatbotFab.addEventListener('click', () => chatbotPanel.classList.toggle('open'));
  }
  if (chatbotClose && chatbotPanel) {
    chatbotClose.addEventListener('click', () => chatbotPanel.classList.remove('open'));
  }

  function addBotMsg(text) {
    if (!chatbotMessages) return;
    const msg = document.createElement('div');
    msg.className = 'cb-msg bot';
    msg.textContent = text;
    chatbotMessages.appendChild(msg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function handleUserMsg(text) {
    if (!chatbotMessages || !text.trim()) return;
    const userMsg = document.createElement('div');
    userMsg.className = 'cb-msg user';
    userMsg.textContent = text;
    chatbotMessages.appendChild(userMsg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    // Simple bot responses
    const t = text.toLowerCase();
    setTimeout(() => {
      if (t.includes('price') || t.includes('cost') || t.includes('budget')) {
        addBotMsg('Our pricing starts from ₹4,999. Please share your requirements for a custom quote!');
      } else if (t.includes('seo') || t.includes('ranking')) {
        addBotMsg('Our SEO packages start at ₹7,999/mo. We guarantee 1st page results in 3-6 months!');
      } else if (t.includes('web') || t.includes('website')) {
        addBotMsg('We build stunning websites starting from ₹9,999. What type of site do you need?');
      } else if (t.includes('logo') || t.includes('design') || t.includes('brand')) {
        addBotMsg('Our logo design starts at ₹2,999. Check our portfolio for design samples!');
      } else if (t.includes('hi') || t.includes('hello') || t.includes('hey')) {
        addBotMsg('Hello! 👋 Welcome to HmcxStudio. How can we help you grow your business today?');
      } else {
        addBotMsg('Thanks for reaching out! Our team will get back to you within 24 hours. You can also call us at +91 99999 99999.');
      }
    }, 700);
  }

  if (chatbotSend) {
    chatbotSend.addEventListener('click', () => {
      if (chatbotInput) { handleUserMsg(chatbotInput.value); chatbotInput.value = ''; }
    });
  }
  if (chatbotInput) {
    chatbotInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') { handleUserMsg(chatbotInput.value); chatbotInput.value = ''; }
    });
  }
  document.querySelectorAll('.cb-btn').forEach(btn => {
    btn.addEventListener('click', () => handleUserMsg(btn.textContent));
  });

  /* ---- Scroll To Top ---- */
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---- FAQ / Accordion ---- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (question && answer) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => {
          i.classList.remove('open');
          i.querySelector('.faq-answer').style.maxHeight = '0';
        });
        if (!isOpen) {
          item.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        }
      });
    }
  });

  /* ---- Tabs ---- */
  document.querySelectorAll('.tabs').forEach(tabsEl => {
    const tabBtns = tabsEl.querySelectorAll('.tab-btn');
    const tabPanels = tabsEl.querySelectorAll('.tab-panel');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const target = tabsEl.querySelector(`#${btn.getAttribute('data-tab')}`);
        if (target) target.classList.add('active');
      });
    });
  });

  /* ---- Form Submit (dummy) ---- */
  document.querySelectorAll('form.contact-form-el').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
        setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; btn.style.background = ''; form.reset(); }, 3000);
      }, 1800);
    });
  });

  /* ---- Newsletter submit ---- */
  document.querySelectorAll('.newsletter-input').forEach(el => {
    const btn = el.querySelector('button');
    const input = el.querySelector('input');
    if (btn && input) {
      btn.addEventListener('click', () => {
        if (!input.value || !input.value.includes('@')) return;
        btn.innerHTML = '<i class="fas fa-check"></i>';
        btn.style.background = '#10b981';
        input.value = '';
        setTimeout(() => { btn.innerHTML = '<i class="fas fa-arrow-right"></i>'; btn.style.background = ''; }, 3000);
      });
    }
  });

  /* ---- Cursor Glow (desktop only) ---- */
  if (window.matchMedia('(min-width:1024px) and (hover:hover)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = 'position:fixed;pointer-events:none;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(30,86,200,.04),transparent 70%);transform:translate(-50%,-50%);transition:left .1s,top .1s;z-index:0;top:50%;left:50%';
    document.body.appendChild(glow);
    document.addEventListener('mousemove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
  }

  /* ---- Smooth section scroll for hash links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ---- Stagger children on reveal ---- */
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, i) => {
      child.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  /* ---- Page load animation ---- */
  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity .4s ease';
    setTimeout(() => { document.body.style.opacity = '1'; }, 50);
  });

  console.log('%c🚀 HmcxStudio Website Loaded', 'color:#1e56c8;font-size:14px;font-weight:700');
})();
