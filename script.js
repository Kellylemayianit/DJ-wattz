/* ============================================
   DJ WATTS & ULTIMATE STUDIO — script.js
   ============================================ */

'use strict';

// ─── GALLERY DATA ─────────────────────────────────────────────────────────────
// 14 images: 1.jpg through 14.jpg
// Assign categories and aspect ratio hints for masonry layout variety
const GALLERY_IMAGES = [
  { src: 'images/1.jpg',  alt: 'Studio session',         category: 'studio', aspect: 'portrait' },
  { src: 'images/2.jpg',  alt: 'Event coverage',          category: 'event',  aspect: 'landscape' },
  { src: 'images/3.jpg',  alt: 'DJ Watts at the decks',   category: 'dj',     aspect: 'landscape' },
  { src: 'images/4.jpg',  alt: 'Portrait session',        category: 'studio', aspect: 'portrait' },
  { src: 'images/5.jpg',  alt: 'Live event moment',       category: 'event',  aspect: 'portrait' },
  { src: 'images/6.jpg',  alt: 'Studio lighting setup',   category: 'studio', aspect: 'square' },
  { src: 'images/7.jpg',  alt: 'Crowd energy',            category: 'dj',     aspect: 'landscape' },
  { src: 'images/8.jpg',  alt: 'Outdoor shoot',           category: 'event',  aspect: 'portrait' },
  { src: 'images/9.jpg',  alt: 'Close-up portrait',       category: 'studio', aspect: 'portrait' },
  { src: 'images/10.jpg', alt: 'DJ set — night event',    category: 'dj',     aspect: 'landscape' },
  { src: 'images/11.jpg', alt: 'Behind the scenes',       category: 'studio', aspect: 'square' },
  { src: 'images/12.jpg', alt: 'Event candids',           category: 'event',  aspect: 'landscape' },
  { src: 'images/13.jpg', alt: 'Light trails',            category: 'dj',     aspect: 'portrait' },
  { src: 'images/14.jpg', alt: 'Golden hour shoot',       category: 'event',  aspect: 'portrait' },
];

// ─── GALLERY INIT ─────────────────────────────────────────────────────────────
function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  let currentImages = [...GALLERY_IMAGES];
  let currentIndex = 0;

  function renderGrid(images) {
    grid.innerHTML = '';
    images.forEach((img, idx) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.dataset.index = idx;

      // Try real image first; show styled placeholder if it fails
      const image = document.createElement('img');
      image.alt = img.alt;
      image.loading = 'lazy';

      const overlay = document.createElement('div');
      overlay.className = 'gallery-item-overlay';
      overlay.innerHTML = `<span class="gallery-item-num">${String(idx + 1).padStart(2, '0')}</span>`;

      // Try loading real image
      image.src = img.src;
      image.onerror = function () {
        // Replace with elegant placeholder
        item.innerHTML = '';
        const ph = document.createElement('div');
        ph.className = `gallery-placeholder ${img.aspect === 'landscape' ? 'wide' : img.aspect === 'square' ? 'square' : ''}`;
        ph.style.cssText = `
          background: linear-gradient(135deg, #161616 0%, #1a1a1a 100%);
        `;
        ph.innerHTML = `
          <div class="placeholder-inner">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
            <span>${img.alt}</span>
          </div>
        `;
        item.appendChild(ph);
        item.appendChild(overlay.cloneNode(true));
      };

      item.appendChild(image);
      item.appendChild(overlay);

      // Lightbox click
      item.addEventListener('click', () => {
        currentIndex = idx;
        openLightbox(images, idx);
      });

      // Staggered entrance
      item.style.opacity = '0';
      item.style.transform = 'translateY(12px)';
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
      }, idx * 60);

      grid.appendChild(item);
    });
  }

  // Initial render
  renderGrid(currentImages);

  // ─── FILTER BUTTONS ───────────────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      if (filter === 'all') {
        currentImages = [...GALLERY_IMAGES];
      } else {
        currentImages = GALLERY_IMAGES.filter(img => img.category === filter);
      }
      renderGrid(currentImages);
    });
  });

  // ─── LIGHTBOX ─────────────────────────────────────────────────────────────
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lb-img');
  const lbCaption  = document.getElementById('lb-caption');
  const lbClose    = document.getElementById('lb-close');
  const lbPrev     = document.getElementById('lb-prev');
  const lbNext     = document.getElementById('lb-next');

  if (!lightbox) return;

  function openLightbox(images, idx) {
    currentIndex = idx;
    const img = images[idx];
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')} — ${img.alt}`;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { lbImg.src = ''; }, 300);
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + currentImages.length) % currentImages.length;
    openLightbox(currentImages, currentIndex);
  }

  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => navigate(-1));
  lbNext.addEventListener('click', () => navigate(1));

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'Escape')     closeLightbox();
  });
}

// ─── SPLIT HOVER INTERACTIONS (Landing) ────────────────────────────────────
function initSplitHover() {
  const left  = document.getElementById('split-sound');
  const right = document.getElementById('split-sight');
  if (!left || !right) return;

  left.addEventListener('mouseenter', () => {
    left.style.flex  = '1.15';
    right.style.flex = '0.85';
  });
  left.addEventListener('mouseleave', () => {
    left.style.flex  = '';
    right.style.flex = '';
  });
  right.addEventListener('mouseenter', () => {
    right.style.flex = '1.15';
    left.style.flex  = '0.85';
  });
  right.addEventListener('mouseleave', () => {
    right.style.flex  = '';
    left.style.flex   = '';
  });
}

// ─── SCROLL REVEAL ──────────────────────────────────────────────────────────
function initScrollReveal() {
  const cards = document.querySelectorAll('.service-card, .contact-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.animationPlayState = 'paused';
    observer.observe(card);
  });
}

// ─── SMOOTH SCROLL FOR HASH LINKS ───────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      const hash = href.includes('#') ? href.split('#')[1] : null;
      if (!hash) return;

      // Only smooth-scroll if we're on the same page
      const target = document.getElementById(hash);
      if (!target) return;

      e.preventDefault();
      const topOffset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - topOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ─── NAV SCROLL STATE ───────────────────────────────────────────────────────
function initNavScroll() {
  const nav = document.querySelector('.top-nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 20
      ? 'rgba(42,42,42,1)'
      : 'rgba(42,42,42,0.5)';
  }, { passive: true });
}

// ─── BOOT ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initGallery();
  initSplitHover();
  initScrollReveal();
  initSmoothScroll();
  initNavScroll();
});
