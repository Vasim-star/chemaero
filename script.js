const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const particles = document.getElementById('particles');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (particles) {
  const count = 56;
  const createParticle = (index) => {
    const el = document.createElement('span');
    el.className = 'particle';
    el.style.position = 'absolute';
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 100}%`;
    el.style.width = `${Math.random() * 3 + 1}px`;
    el.style.height = el.style.width;
    el.style.background = index % 2 === 0 ? 'rgba(77,225,194,.8)' : 'rgba(109,124,255,.7)';
    el.style.borderRadius = '999px';
    el.style.opacity = `${Math.random() * 0.7 + 0.2}`;
    el.style.animation = `float ${Math.random() * 8 + 6}s ease-in-out infinite`;
    el.style.animationDelay = `${Math.random() * 3}s`;
    particles.appendChild(el);
  };

  for (let i = 0; i < count; i += 1) {
    createParticle(i);
  }
}

const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes float {
  0%, 100% { transform: translate3d(0,0,0); }
  50% { transform: translate3d(0,-20px,0); }
}
`;
document.head.appendChild(styleSheet);
