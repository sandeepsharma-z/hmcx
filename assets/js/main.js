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

    const serviceDescriptions = [
      { key: 's=web', text: 'Fast, modern, conversion-focused websites' },
      { key: 'maintenance', text: 'Ongoing support, fixes, and speed optimization' },
      { key: 's=seo', text: 'Rank higher with technical and content SEO' },
      { key: 's=marketing', text: 'Campaigns that drive leads and revenue' },
      { key: 's=ads', text: 'Performance ads across Google and Meta' },
      { key: 's=ai', text: 'AI tools, automations, and smart workflows' },
      { key: 's=logo', text: 'Memorable visual identity and logo systems' },
      { key: 's=graphic', text: 'Creative assets for print and digital branding' },
    ];

    navbar.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
      if (menu.classList.contains('mega-ready')) return;
      const links = Array.from(menu.querySelectorAll('a'));
      if (!links.length) return;

      const servicesWrap = document.createElement('div');
      servicesWrap.className = 'nav-mega-services';

      links.forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        const iconEl = link.querySelector('i');
        const iconHTML = iconEl ? iconEl.outerHTML : '';
        const title = (link.textContent || '').replace(/\s+/g, ' ').trim();
        const meta = serviceDescriptions.find(item => href.includes(item.key));
        const desc = meta ? meta.text : 'Custom service tailored to your business goals';

        link.classList.add('nav-mega-item');
        link.innerHTML = '<span class="nav-link-top">' + iconHTML + '<span class="nav-link-main">' + title + '</span></span><span class="nav-link-sub">' + desc + '</span>';
        servicesWrap.appendChild(link);
      });

      const side = document.createElement('div');
      side.className = 'nav-mega-side';
      side.innerHTML = '<div><h4>Need a Custom Plan?</h4><p>Tell us your goals and get a tailored roadmap with timeline and pricing.</p><div class="mega-badges"><span class="mega-badge">Free Audit</span><span class="mega-badge">24h Reply</span><span class="mega-badge">Global Team</span></div></div><a class="mega-cta" href="contact.html"><i class="fas fa-paper-plane"></i> Get Custom Proposal</a>';

      menu.innerHTML = '';
      menu.appendChild(servicesWrap);
      menu.appendChild(side);
      menu.classList.add('mega-ready');
    });
  }

  /* ---- Mobile Menu ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    const mobileServicesLink = mobileNav.querySelector('a[href="services.html"], a[href$="/services"], a[href*="services"]');
    if (mobileServicesLink && !mobileNav.querySelector('.mobile-submenu-wrap')) {
      const servicesFromDesktop = Array.from(document.querySelectorAll('#navbar .nav-dropdown-menu a'))
        .map(a => ({
          href: a.getAttribute('href') || '#',
          text: (a.textContent || '').trim(),
          icon: (a.querySelector('i') && a.querySelector('i').className) ? a.querySelector('i').className : 'fas fa-angle-right',
        }))
        .filter(item => item.href && item.text);

      const fallbackServices = [
        { href: 'service-detail.html?s=web', text: 'Website Development', icon: 'fas fa-laptop-code' },
        { href: 'service-detail.html?s=maintenance', text: 'Website Maintenance', icon: 'fas fa-tools' },
        { href: 'service-detail.html?s=seo', text: 'SEO Optimization', icon: 'fas fa-search' },
        { href: 'service-detail.html?s=marketing', text: 'Digital Marketing', icon: 'fas fa-bullhorn' },
        { href: 'service-detail.html?s=ads', text: 'Ads Management', icon: 'fas fa-ad' },
        { href: 'service-detail.html?s=ai', text: 'AI Development', icon: 'fas fa-robot' },
        { href: 'service-detail.html?s=logo', text: 'Logo Designing', icon: 'fas fa-pen-nib' },
      ];

      const serviceItems = servicesFromDesktop.length ? servicesFromDesktop : fallbackServices;
      const wrapper = document.createElement('div');
      wrapper.className = 'mobile-submenu-wrap';
      wrapper.innerHTML = '<button type="button" class="mobile-sub-trigger" aria-expanded="false"><span class="mst-left"><i class="fas fa-cogs"></i> Services</span><i class="fas fa-chevron-down mst-arrow"></i></button><div class="mobile-submenu"></div>';

      const submenu = wrapper.querySelector('.mobile-submenu');
      const allLink = document.createElement('a');
      allLink.href = 'services.html';
      allLink.innerHTML = '<i class="fas fa-layer-group"></i> All Services';
      submenu.appendChild(allLink);

      serviceItems.forEach(item => {
        const subA = document.createElement('a');
        subA.href = item.href;
        subA.innerHTML = '<i class="' + item.icon + '"></i> ' + item.text;
        submenu.appendChild(subA);
      });

      const trigger = wrapper.querySelector('.mobile-sub-trigger');
      trigger.addEventListener('click', () => {
        const isOpen = wrapper.classList.toggle('open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      mobileServicesLink.replaceWith(wrapper);
    }

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
        startAutoPlay();
      }
    }

    function startAutoPlay() {
      clearInterval(sliderTimer);
      sliderTimer = setInterval(() => goToSlide(currentSlide + 1), slideDuration);
      restartProgress();
    }

    function stopAutoPlay() {
      clearInterval(sliderTimer);
      sliderTimer = null;
    }

    const nextBtn = document.getElementById('nextSlide');
    const prevBtn = document.getElementById('prevSlide');
    if (nextBtn) nextBtn.onclick = () => goToSlide(currentSlide + 1, true);
    if (prevBtn) prevBtn.onclick = () => goToSlide(currentSlide - 1, true);

    startAutoPlay();

    if (heroSection) {
      heroSection.addEventListener('pointerdown', e => { startX = e.clientX; deltaX = 0; });
      heroSection.addEventListener('pointermove', e => { if (startX) deltaX = e.clientX - startX; });
      heroSection.addEventListener('pointerup', () => {
        if (Math.abs(deltaX) > 60) { deltaX < 0 ? goToSlide(currentSlide + 1, true) : goToSlide(currentSlide - 1, true); }
        startX = 0; deltaX = 0;
      });
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoPlay();
      else startAutoPlay();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') goToSlide(currentSlide + 1, true);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') goToSlide(currentSlide - 1, true);
    });
  }

  /* ---- Testimonials Slider ---- */
  const testiSlider = document.querySelector('.testi-slider');
  const testiTrack = testiSlider ? testiSlider.querySelector('.testi-track') : null;
  if (testiSlider && testiTrack) {
    const originals = Array.from(testiTrack.querySelectorAll('.testi-card'));
    const prevBtn = testiSlider.querySelector('.testi-btn.prev');
    const nextBtn = testiSlider.querySelector('.testi-btn.next');
    let autoplayTimer = null;
    let index = 0;
    let step = 0;
    let visibleCards = 3;
    let startX = 0;
    let deltaX = 0;
    const slideDelay = 3400;
    const slideTransitionMs = 620;

    function getVisibleCards() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1100) return 2;
      return 3;
    }

    function setTrackPosition(withTransition = true) {
      testiTrack.style.transition = withTransition ? `transform ${slideTransitionMs}ms cubic-bezier(.4,0,.2,1)` : 'none';
      testiTrack.style.transform = `translateX(-${index * step}px)`;
    }

    function measureStep() {
      const first = testiTrack.querySelector('.testi-card');
      const gap = parseFloat(getComputedStyle(testiTrack).gap || '24');
      step = first ? (first.getBoundingClientRect().width + gap) : 0;
    }

    function setupTrack() {
      testiTrack.querySelectorAll('.is-clone').forEach(n => n.remove());
      visibleCards = Math.min(getVisibleCards(), Math.max(1, originals.length));

      for (let i = 0; i < visibleCards; i += 1) {
        const card = originals[i];
        if (!card) break;
        const clone = card.cloneNode(true);
        clone.classList.add('is-clone');
        clone.classList.remove('reveal', 'visible');
        testiTrack.appendChild(clone);
      }

      index = 0;
      measureStep();
      setTrackPosition(false);
      testiTrack.offsetHeight;
      setTrackPosition(true);
    }

    function nextSlide(restart = false) {
      if (originals.length < 2 || step === 0) return;
      index += 1;
      setTrackPosition(true);

      if (index >= originals.length) {
        setTimeout(() => {
          index = 0;
          setTrackPosition(false);
          testiTrack.offsetHeight;
          setTrackPosition(true);
        }, slideTransitionMs + 20);
      }

      if (restart) startAutoplay();
    }

    function prevSlide(restart = false) {
      if (originals.length < 2 || step === 0) return;

      if (index === 0) {
        index = originals.length;
        setTrackPosition(false);
        testiTrack.offsetHeight;
      }
      index -= 1;
      setTrackPosition(true);

      if (restart) startAutoplay();
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => nextSlide(), slideDelay);
    }

    function stopAutoplay() {
      if (autoplayTimer) clearInterval(autoplayTimer);
      autoplayTimer = null;
    }

    testiSlider.addEventListener('mouseenter', stopAutoplay);
    testiSlider.addEventListener('mouseleave', startAutoplay);
    if (prevBtn) prevBtn.addEventListener('click', () => prevSlide(true));
    if (nextBtn) nextBtn.addEventListener('click', () => nextSlide(true));
    testiSlider.addEventListener('pointerdown', e => { startX = e.clientX; deltaX = 0; });
    testiSlider.addEventListener('pointermove', e => { if (startX) deltaX = e.clientX - startX; });
    testiSlider.addEventListener('pointerup', () => {
      if (Math.abs(deltaX) > 50) {
        if (deltaX < 0) nextSlide(true);
        else prevSlide(true);
      }
      startX = 0;
      deltaX = 0;
    });
    window.addEventListener('resize', () => {
      setupTrack();
      if (originals.length > 1) startAutoplay();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    setupTrack();
    if (originals.length > 1) startAutoplay();
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

  /* ---- Dynamic foundation years ---- */
  function getYearsSince(dateStr) {
    const dt = new Date((dateStr || '2024-01-01') + 'T00:00:00');
    if (Number.isNaN(dt.getTime())) return 1;
    const now = new Date();
    let months = (now.getFullYear() - dt.getFullYear()) * 12 + (now.getMonth() - dt.getMonth());
    if (now.getDate() < dt.getDate()) months -= 1;
    const years = Math.floor(months / 12);
    return Math.max(1, years);
  }

  document.querySelectorAll('.js-years-since').forEach(el => {
    const years = getYearsSince(el.getAttribute('data-foundation-date'));
    const suffix = el.getAttribute('data-suffix') || '';
    el.textContent = years + suffix;
  });

  document.querySelectorAll('.js-years-target').forEach(el => {
    const years = getYearsSince(el.getAttribute('data-foundation-date'));
    el.setAttribute('data-target', String(years));
  });
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
  });  /* ---- Chatbot ---- */
  const realPortfolioItems = [
    {
      slug: 'aabha-jain',
      title: 'Aabha Jain',
      cat: 'Personal Brand Website',
      filter: 'design branding',
      image: 'assets/img/project-thumbs/aabha-jain-home.jpg'
    },
    {
      slug: 'amore-pizza-palmdale',
      title: 'Amore Pizza Palmdale',
      cat: 'Restaurant Website',
      filter: 'web marketing',
      image: 'assets/img/project-thumbs/amore-pizza-palmdale-home.jpg'
    },
    {
      slug: 'arth-cookware',
      title: 'Arth Cookware',
      cat: 'E-Commerce Website',
      filter: 'web e-commerce',
      image: 'assets/img/project-thumbs/arth-cookware-home.jpg'
    },
    {
      slug: 'nu-wellness',
      title: 'nu wellness',
      cat: 'Wellness Commerce',
      filter: 'design marketing',
      image: 'assets/img/project-thumbs/nu-wellness-home.jpg'
    },
    {
      slug: 'pelletiersmiles',
      title: 'Pelletier Smiles',
      cat: 'Healthcare Website',
      filter: 'web',
      image: 'assets/img/project-thumbs/pelletiersmiles-home.jpg'
    }
  ];

  function bindPortfolioImageScroll() {
    const shots = document.querySelectorAll('.pi-thumb .pi-shot');
    if (!shots.length) return;

    const setShift = (img) => {
      const frame = img.closest('.pi-thumb');
      if (!frame) return;
      const shift = Math.max(0, img.offsetHeight - frame.offsetHeight);
      img.style.setProperty('--pi-shift', shift + 'px');
    };

    shots.forEach((img) => {
      if (img.complete) setShift(img);
      img.addEventListener('load', () => setShift(img), { once: true });
    });
  }

  let isEnhancingPortfolio = false;

  function enhancePortfolioCards() {
    const isAiServicePage =
      window.location.pathname.toLowerCase().includes('service-detail.html') &&
      new URLSearchParams(window.location.search).get('s') === 'ai';
    if (isAiServicePage) return;

    if (isEnhancingPortfolio) return;
    isEnhancingPortfolio = true;
    const cards = document.querySelectorAll('.portfolio-item');
    if (!cards.length) {
      isEnhancingPortfolio = false;
      return;
    }

    cards.forEach((card, i) => {
      const data = realPortfolioItems[i % realPortfolioItems.length];
      card.setAttribute('data-cat', data.filter);

      const catEl = card.querySelector('.pi-cat');
      if (catEl) catEl.textContent = data.cat;

      const titleEl = card.querySelector('.pi-title');
      if (titleEl) titleEl.textContent = data.title;

      const thumb = card.querySelector('.pi-thumb');
      if (thumb) {
        thumb.classList.add('pi-thumb-scroll');
        const existingShot = thumb.querySelector('.pi-shot');
        if (!existingShot || existingShot.getAttribute('src') !== data.image) {
          thumb.innerHTML = '<img class="pi-shot" src="' + data.image + '" alt="' + data.title + ' screenshot" loading="lazy" decoding="async" fetchpriority="low">';
        }
      }

      const target = 'project-detail.html?p=' + data.slug;
      card.style.cursor = 'pointer';
      card.setAttribute('role', 'link');
      card.setAttribute('tabindex', '0');
      card.onclick = () => { window.location.href = target; };
      card.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.location.href = target;
        }
      };
      card.setAttribute('data-real-portfolio', '1');
    });

    bindPortfolioImageScroll();
    isEnhancingPortfolio = false;
  }

  enhancePortfolioCards();
  setTimeout(enhancePortfolioCards, 300);
  window.addEventListener('load', enhancePortfolioCards, { once: true });

  window.addEventListener('resize', bindPortfolioImageScroll);

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

  function scrollChatToBottom() {
    if (!chatbotMessages) return;
    requestAnimationFrame(() => {
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    });
  }

  function addBotMsg(text) {
    if (!chatbotMessages) return;
    const msg = document.createElement('div');
    msg.className = 'cb-msg bot';
    msg.textContent = text;
    chatbotMessages.appendChild(msg);
    scrollChatToBottom();
  }

  function addUserMsg(text) {
    if (!chatbotMessages) return;
    const userMsg = document.createElement('div');
    userMsg.className = 'cb-msg user';
    userMsg.textContent = text;
    chatbotMessages.appendChild(userMsg);
    scrollChatToBottom();
  }

  function getBotReply(input) {
    const t = (input || '').toLowerCase().trim();
    const has = (arr) => arr.some(k => t.includes(k));

    if (has(['hi', 'hello', 'hey', 'namaste'])) {
      return 'Hello. Tell me what you need: website, SEO, ads, AI, branding, pricing, or timeline.';
    }
    if (has(['price', 'pricing', 'cost', 'budget', 'quote', 'proposal'])) {
      return 'We offer flexible pricing based on scope. Share your requirements and we will provide a custom proposal with timeline and milestones.';
    }
    if (has(['website', 'web development', 'web', 'landing page', 'ecommerce'])) {
      return 'We build business websites, landing pages, e-commerce stores, and custom web apps. Share your business type and target outcome.';
    }
    if (has(['seo', 'ranking', 'organic', 'google rank'])) {
      return 'Our SEO covers technical audit, on-page optimization, content, and authority building. Typical measurable movement starts in 8-12 weeks.';
    }
    if (has(['digital marketing', 'marketing', 'social media', 'campaign'])) {
      return 'We run full-funnel marketing: content, social, paid campaigns, and analytics with monthly reporting.';
    }
    if (has(['ads', 'google ads', 'meta ads', 'ppc'])) {
      return 'We manage Google and Meta ads end-to-end: targeting, creatives, optimization, and ROI tracking.';
    }
    if (has(['ai', 'automation', 'chatbot', 'agent'])) {
      return 'We develop AI chatbots and automation workflows for support, lead qualification, and internal operations.';
    }
    if (has(['logo', 'branding', 'graphic', 'design'])) {
      return 'We design logos, brand identity systems, and high-quality marketing creatives.';
    }
    if (has(['maintenance', 'support', 'amc', 'bug'])) {
      return 'Yes, we provide maintenance: updates, backups, security, bug fixes, and performance improvements.';
    }
    if (has(['timeline', 'how long', 'delivery', 'deadline'])) {
      return 'Timeline depends on scope. Typical website delivery is 2-6 weeks; larger custom projects follow milestone-based timelines.';
    }
    if (has(['process', 'workflow', 'how you work'])) {
      return 'Our process: discovery, planning, design, development, testing, launch, and post-launch support.';
    }
    if (has(['payment', 'milestone', 'invoice', 'contract'])) {
      return 'We work with milestone-based payments and clear written deliverables.';
    }
    if (has(['revision', 'changes', 'edit'])) {
      return 'Revisions are included based on selected scope, with approvals at each milestone.';
    }
    if (has(['portfolio', 'projects', 'case study', 'work samples'])) {
      return 'You can explore portfolio examples on the Projects page. Share your industry and I can suggest relevant case styles.';
    }
    if (has(['location', 'address', 'office', 'where are you'])) {
      return 'Our listed location is Rohini, Delhi, India. We work with clients globally.';
    }
    if (has(['country', 'international', 'global', 'outside india'])) {
      return 'Yes, we work with international clients and support cross-timezone communication.';
    }
    if (has(['call', 'phone', 'whatsapp', 'contact', 'email'])) {
      return 'Contact us at hello@hmcxstudio.com or WhatsApp +91 80058 49281. We are available 24/7.';
    }
    if (has(['thanks', 'thank you', 'ok'])) {
      return 'You are welcome. Share your requirement and I will help you with the next step.';
    }

    return 'I can help with services, pricing, timeline, portfolio, and support. Share your exact requirement for a precise suggestion.';
  }

  function handleUserMsg(text) {
    if (!chatbotMessages || !text.trim()) return;
    addUserMsg(text);
    setTimeout(() => {
      addBotMsg(getBotReply(text));
    }, 320);
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
  scrollChatToBottom();
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

  /* ---- Navbar CTA Text Rotation ---- */
  const ctaPhrases = ['Get Free Quote', 'Book Free Call', 'Start Your Project', 'Get Proposal'];
  document.querySelectorAll('.nav-cta').forEach((cta, idx) => {
    const initialText = (cta.textContent || '').trim();
    const startPhraseIndex = Math.max(0, ctaPhrases.indexOf(initialText));
    let phraseIndex = startPhraseIndex;

    let textEl = cta.querySelector('.nav-cta-text');
    if (!textEl) {
      textEl = document.createElement('span');
      textEl.className = 'nav-cta-text';
      textEl.textContent = initialText || ctaPhrases[0];
      cta.textContent = '';
      cta.appendChild(textEl);
    }

    setInterval(() => {
      if (document.hidden) return;
      phraseIndex = (phraseIndex + 1) % ctaPhrases.length;
      cta.classList.add('is-swapping');
      setTimeout(() => {
        textEl.textContent = ctaPhrases[phraseIndex];
        cta.setAttribute('aria-label', ctaPhrases[phraseIndex]);
        cta.classList.remove('is-swapping');
      }, 180);
    }, 2600 + (idx * 140));
  });

  /* ---- Page load animation ---- */
  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity .4s ease';
    setTimeout(() => { document.body.style.opacity = '1'; }, 50);
  });

  console.log('%c🚀 HmcxStudio Website Loaded', 'color:#1e56c8;font-size:14px;font-weight:700');
})();


