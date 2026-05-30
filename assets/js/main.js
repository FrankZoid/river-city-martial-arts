/* 
  =========================================
  RIVER CITY MARTIAL ARTS ACADEMY
  Interactive Scripting
  Vanilla JavaScript
  =========================================
*/

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initActiveNavLink();
  initLightbox();
  highlightCurrentDay();
});

/**
 * 1. Sticky Header
 * Adds background shadow and scaling when the user scrolls down the page.
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once at load
}

/**
 * 2. Mobile Navigation Hamburger Menu
 * Toggles responsive menu and restricts scrolling.
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Lock background scroll when open
    if (navMenu.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking a link
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/**
 * 3. Navigation Link Activator
 * Detects the current page path and automatically flags the matching link as active.
 */
function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  if (navLinks.length === 0) return;

  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';

  let matched = false;
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === 'index.html' && href === './') || (page === '' && href === 'index.html')) {
      link.classList.add('active');
      matched = true;
    } else {
      link.classList.remove('active');
    }
  });

  // Fallback to Home if nothing matches
  if (!matched && navLinks.length > 0) {
    const homeLink = Array.from(navLinks).find(link => link.getAttribute('href') === 'index.html');
    if (homeLink) homeLink.classList.add('active');
  }
}

/**
 * 4. Custom Gallery Lightbox Modal
 * Allows immersive viewing of gallery photos with Next, Prev, and keyboard controls.
 */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  // Find all items that should trigger the lightbox
  // Supports the gallery page (.gallery-card) and home page (.gallery-preview-item)
  const items = Array.from(document.querySelectorAll('[data-lightbox-src]'));
  if (items.length === 0 || !lightbox || !lightboxImg || !lightboxCaption) return;

  let currentIndex = 0;

  // Open Lightbox
  const openLightbox = (index) => {
    currentIndex = index;
    const item = items[currentIndex];
    const src = item.getAttribute('data-lightbox-src');
    const caption = item.getAttribute('data-lightbox-caption') || '';

    lightboxImg.setAttribute('src', src);
    lightboxCaption.textContent = caption;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scrolling
  };

  // Close Lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  };

  // Navigations
  const showPrev = () => {
    let index = currentIndex - 1;
    if (index < 0) index = items.length - 1;
    openLightbox(index);
  };

  const showNext = () => {
    let index = currentIndex + 1;
    if (index >= items.length) index = 0;
    openLightbox(index);
  };

  // Attach click events
  items.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  // Setup navigation/close listeners
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  // Close when clicking background outside the content wrapper
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    } else if (e.key === 'ArrowRight') {
      showNext();
    }
  });
}

/**
 * 5. Highlight Current Day in Hours List
 * Detects system day of week and highlights the current day on the schedule table.
 */
function highlightCurrentDay() {
  const hoursRows = document.querySelectorAll('.hours-row');
  if (hoursRows.length === 0) return;

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayIndex = new Date().getDay();
  const todayName = days[todayIndex];

  hoursRows.forEach(row => {
    const dayElement = row.querySelector('.hours-day');
    if (dayElement) {
      const rowDay = dayElement.textContent.trim().toLowerCase();
      if (rowDay === todayName) {
        row.classList.add('active');
        // Add a visual indicator
        const timeElement = row.querySelector('.hours-time');
        if (timeElement) {
          timeElement.innerHTML += ' <span style="font-size: 0.7rem; background-color: var(--primary); color: white; padding: 2px 6px; border-radius: 10px; margin-left: 5px; text-transform: uppercase;">Today</span>';
        }
      }
    }
  });
}
