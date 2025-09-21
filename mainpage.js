const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

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
