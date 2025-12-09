// Hamburger menu functionality
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

if (hamburger && navLinks) {
  let isAnimating = false;

  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent double-clicking during animation
    if (isAnimating) return;

    isAnimating = true;
    const open = navLinks.classList.toggle('show');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');

    // Reset animation lock after animation completes
    setTimeout(() => {
      isAnimating = false;
    }, 500);
  });

  navLinks.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      navLinks.classList.remove('show');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('show') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navLinks.classList.remove('show');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
}

// Gallery functionality for homepage
const galleryTrack = document.getElementById('galleryTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('galleryDots');

if (galleryTrack && prevBtn && nextBtn && dotsContainer) {
  const items = galleryTrack.querySelectorAll('.gallery-item');
  let currentIndex = 0;

  // Create dots
  items.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'dot';
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.dot');

  function updateGallery() {
    galleryTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateGallery();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    updateGallery();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateGallery();
  }

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Optional: Auto-advance every 5 seconds
  let autoSlide = setInterval(nextSlide, 5000);

  // Pause auto-slide on hover
  const galleryContainer = galleryTrack.closest('.gallery-container');
  if (galleryContainer) {
    galleryContainer.addEventListener('mouseenter', () => clearInterval(autoSlide));
    galleryContainer.addEventListener('mouseleave', () => {
      autoSlide = setInterval(nextSlide, 5000);
    });
  }

  // Add touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  galleryTrack.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  galleryTrack.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    if (touchStartX - touchEndX > 50) {
      nextSlide();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
    }
  }
}

// ============================================
// MOBILE EXPERIENCE ENHANCEMENTS
// ============================================

// Ripple Effect on Touch
function createRipple(event) {
  const button = event.currentTarget;

  // Check if we're on mobile
  if (window.innerWidth > 768) return;

  const ripple = document.createElement('span');
  ripple.classList.add('ripple-effect');

  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';

  button.appendChild(ripple);

  // Remove ripple after animation
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Add ripple class and event listeners to interactive elements
document.addEventListener('DOMContentLoaded', () => {
  const rippleElements = document.querySelectorAll(`
    .cta-button,
    .filter-btn,
    .screenshot-btn,
    .cntform .btn,
    .gallery-nav,
    .project-card,
    .dot,
    .view-all-link,
    .project-link,
    .modal-close,
    .nav-links a
  `);

  rippleElements.forEach(element => {
    element.classList.add('ripple');
    element.addEventListener('click', createRipple);
  });
});

// Pull-to-Refresh Indicator
let pullToRefresh = {
  startY: 0,
  currentY: 0,
  isDragging: false,
  indicator: null
};

function initPullToRefresh() {
  // Only on mobile
  if (window.innerWidth > 768) return;

  // Create indicator if it doesn't exist
  if (!pullToRefresh.indicator) {
    const indicator = document.createElement('div');
    indicator.className = 'ptr-indicator';
    indicator.innerHTML = '<span class="ptr-spinner"></span>Pull to refresh';
    document.body.appendChild(indicator);
    pullToRefresh.indicator = indicator;
  }

  // Touch start
  document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
      pullToRefresh.startY = e.touches[0].clientY;
      pullToRefresh.isDragging = true;
    }
  }, { passive: true });

  // Touch move
  document.addEventListener('touchmove', (e) => {
    if (!pullToRefresh.isDragging) return;

    pullToRefresh.currentY = e.touches[0].clientY;
    const diff = pullToRefresh.currentY - pullToRefresh.startY;

    // Show indicator if pulled down more than 80px
    if (diff > 80 && window.scrollY === 0) {
      pullToRefresh.indicator.classList.add('visible');
      pullToRefresh.indicator.innerHTML = '<span class="ptr-spinner"></span>Release to refresh';
    } else if (diff > 30 && window.scrollY === 0) {
      pullToRefresh.indicator.classList.add('visible');
      pullToRefresh.indicator.innerHTML = '<span class="ptr-spinner"></span>Pull to refresh';
    } else {
      pullToRefresh.indicator.classList.remove('visible');
    }
  }, { passive: true });

  // Touch end
  document.addEventListener('touchend', () => {
    if (!pullToRefresh.isDragging) return;

    const diff = pullToRefresh.currentY - pullToRefresh.startY;

    if (diff > 80 && window.scrollY === 0) {
      // Show refreshing state
      pullToRefresh.indicator.innerHTML = '<span class="ptr-spinner"></span>Refreshing...';

      // Reload page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } else {
      pullToRefresh.indicator.classList.remove('visible');
    }

    pullToRefresh.isDragging = false;
  }, { passive: true });
}

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPullToRefresh);
} else {
  initPullToRefresh();
}

// Reinitialize on window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    initPullToRefresh();
  }, 250);
});

// ============================================
// CERTIFICATE MODAL FUNCTIONALITY
// ============================================

const certModal = document.getElementById('cert-modal');
const certModalImage = document.getElementById('cert-modal-image');
const certModalTitle = document.getElementById('cert-modal-title');
const certModalClose = document.getElementById('cert-modal-close');

if (certModal && certModalImage && certModalTitle && certModalClose) {
  const certBadges = document.querySelectorAll('.cert-badge');

  // Open modal when clicking on a certificate badge
  certBadges.forEach(badge => {
    badge.addEventListener('click', () => {
      const certName = badge.querySelector('.cert-name').textContent;
      const certImg = badge.querySelector('.cert-img');
      const certSrc = certImg.src;
      const certAlt = certImg.alt;

      certModalTitle.textContent = certName;
      certModalImage.src = certSrc;
      certModalImage.alt = certAlt;

      certModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal when clicking the close button
  certModalClose.addEventListener('click', closeCertModal);

  // Close modal when clicking outside the content
  certModal.addEventListener('click', (e) => {
    if (e.target === certModal) {
      closeCertModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains('active')) {
      closeCertModal();
    }
  });

  function closeCertModal() {
    certModal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
