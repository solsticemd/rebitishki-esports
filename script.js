// --- PAGE LOADER LOGIC ---
const loader = document.getElementById('page-loader');

function hideLoader() {
  if (loader && !loader.classList.contains('hidden')) {
    loader.classList.add('hidden');
  }
}

// Скрытие при полной загрузке ресурсов
if (document.readyState === 'complete') {
  hideLoader();
} else {
  window.addEventListener('load', hideLoader);
}

// Жесткий таймаут: прелоадер гарантированно исчезнет через 1.5 секунды
setTimeout(hideLoader, 1500);

// --- ИНИЦИАЛИЗАЦИЯ ПОСЛЕ ЗАГРУЗКИ DOM ---
document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  menuBtn?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });

  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu?.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  // Reveal-on-scroll animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Mouse-following red glow on desktop
  const glow = document.querySelector('.cursor-glow');
  if (glow) {
    window.addEventListener('pointermove', e => {
      if (window.innerWidth > 700) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    });
  }

  // 3D player-card tilt
  document.querySelectorAll('.tilt, .player-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      if (window.innerWidth <= 700) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(800px) rotateY(${x * 7}deg) rotateX(${y * -7}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });

  // Highlight navigation item
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav a, .desktop-nav a')];
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle(
        'active', link.getAttribute('href') === `#${entry.target.id}`
      ));
    });
  }, { rootMargin: '-40% 0px -50% 0px' });
  sections.forEach(section => navObserver.observe(section));

  // Parallax effect on hero
  const heroLogo = document.querySelector('.hero-logo-bg, .hero-logo-float');
  window.addEventListener('pointermove', e => {
    if (!heroLogo || window.innerWidth <= 700) return;
    const x = (e.clientX / window.innerWidth - .5) * 14;
    const y = (e.clientY / window.innerHeight - .5) * 10;
    heroLogo.style.transform = `translate(${x}px, ${y}px) rotate(${x / 2}deg)`;
  });

  // Toggle Substitutes Popover
  const subsBtn = document.querySelector('.subs-btn');
  const subsWrapper = document.querySelector('.subs-wrapper');

  subsBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    subsWrapper?.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!subsWrapper?.contains(e.target)) {
      subsWrapper?.classList.remove('active');
    }
  });

  // Archive Controls
  const openArchiveBtn = document.getElementById('open-archive-btn');
  openArchiveBtn?.addEventListener('click', () => {
    const archiveModal = document.getElementById('archive-modal');
    if (archiveModal) {
      archiveModal.classList.add('active');
      archiveModal.setAttribute('aria-hidden', 'false');
    }
  });
});

// --- NEWS MODAL SYSTEM ---
const newsDatabase = {
  'merch-concepts': {
    date: 'Sep 09, 2026',
    title: 'Merch Concepts Revealed & Pre-Orders Open',
    body: `<p>We are excited to share the first look at the official Rebitishki Squad merchandise collection!</p>
           <p>Our line-up features the <strong>Pro Jersey 2026</strong> and the heavyweight <strong>Team Bomber</strong>.</p>
           <p>Visit our new <a href="merch.html" style="color:var(--red,#ff2438); font-weight: 600;">Merch Page</a> to check out concepts and place your pre-order!</p>`
  },
  'roster-announcement': {
    date: 'Sep 03, 2026',
    title: 'New Roster Announcement',
    body: `<p>After weeks of tryouts and intense practice sessions, we are ready to reveal our official Dota 2 lineup.</p>
           <p>Carry: <strong>Solstice</strong><br>Mid: <strong>MrSprutel</strong><br>Offlane: <strong>Егор Крит</strong><br>Support: <strong>MrSpiderbait</strong><br>Support: <strong>Артемий</strong></p>`
  },
  'first-tournament': {
    date: 'Aug 25, 2026',
    title: 'First Official Tournament on Faceit',
    body: `<p>It is official — Rebitishki Squad is stepping into the competitive arena on Faceit.</p>`
  },
  'team-foundation': {
    date: 'Aug 10, 2026',
    title: 'Rebitishki Squad Founded',
    body: `<p>Rebitishki Squad was created with a clear vision: bring dedicated players together under one banner.</p>`
  }
};

function openNewsModal(newsId) {
  const news = newsDatabase[newsId];
  if (!news) return;

  const dateEl = document.getElementById('modal-date');
  const titleEl = document.getElementById('modal-title');
  const bodyEl = document.getElementById('modal-body');

  if (dateEl) dateEl.innerText = news.date;
  if (titleEl) titleEl.innerText = news.title;
  if (bodyEl) bodyEl.innerHTML = news.body;

  const archiveModal = document.getElementById('archive-modal');
  if (archiveModal && archiveModal.classList.contains('active')) {
    archiveModal.classList.add('pushed-back');
  }

  const modal = document.getElementById('news-modal');
  if (modal) {
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('active');
  }
}

function closeNewsModal() {
  const modal = document.getElementById('news-modal');
  if (modal) {
    modal.setAttribute('aria-hidden', 'true');
    modal.classList.remove('active');
  }

  const archiveModal = document.getElementById('archive-modal');
  if (archiveModal) {
    archiveModal.classList.remove('pushed-back');
  }
}

function closeArchiveModal() {
  const archiveModal = document.getElementById('archive-modal');
  if (archiveModal) {
    archiveModal.classList.remove('active');
    archiveModal.classList.remove('pushed-back');
    archiveModal.setAttribute('aria-hidden', 'true');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (document.getElementById('news-modal')?.classList.contains('active')) {
      closeNewsModal();
    } else {
      closeArchiveModal();
    }
  }
});

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.scrollBehavior = 'auto';
}