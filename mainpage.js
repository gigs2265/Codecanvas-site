// Hamburger menu functionality
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('show');
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  navLinks.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
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
