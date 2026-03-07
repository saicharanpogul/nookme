// ═══════════════════════════════════════════════════════════
// NookMe Landing — Interactions & Animations
// ═══════════════════════════════════════════════════════════

// ─── Scroll-triggered Animations ───────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('[data-animate]').forEach((el) => {
    observer.observe(el);
  });
}

// ─── Navbar Scroll Effect ──────────────────────────────────
function initNavScroll() {
  const nav = document.getElementById('nav');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 100) {
      nav.style.background = 'rgba(15, 15, 19, 0.95)';
      nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
      nav.style.background = 'rgba(15, 15, 19, 0.8)';
      nav.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
  });
}

// ─── Smooth Scroll for Anchor Links ────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const navHeight = 64;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}

// ─── Waitlist Form ─────────────────────────────────────────
function initWaitlistForm() {
  const form = document.getElementById('waitlistForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('waitlistEmail').value;

    if (!email) return;

    // Simulate submission
    const submitBtn = form.querySelector('.waitlist-submit');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>✓ You\'re on the list!</span>';
    submitBtn.style.background = 'linear-gradient(135deg, #2DD4A8, #059669)';
    submitBtn.style.boxShadow = '0 4px 20px rgba(45, 212, 168, 0.3)';

    document.getElementById('waitlistEmail').value = '';
    document.getElementById('waitlistEmail').placeholder = 'Welcome aboard! 🎉';

    setTimeout(() => {
      submitBtn.innerHTML = originalHTML;
      submitBtn.style.background = '';
      submitBtn.style.boxShadow = '';
      document.getElementById('waitlistEmail').placeholder = 'you@email.com';
    }, 3000);
  });
}

// ─── Parallax Glow Effect ──────────────────────────────────
function initGlowParallax() {
  const glow1 = document.querySelector('.hero-glow');
  const glow2 = document.querySelector('.hero-glow-2');

  if (!glow1 || !glow2) return;

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;

    glow1.style.transform = `translate(${x}px, ${y}px)`;
    glow2.style.transform = `translate(${-x}px, ${-y}px)`;
  });
}

// ─── Mockup Card Hover Interactions ────────────────────────
function initMockupInteractions() {
  const cards = document.querySelectorAll('.mockup-card');
  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
      card.style.background = 'var(--surface-elevated)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = 'var(--surface)';
    });
  });
}

// ─── Initialize Everything ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initNavScroll();
  initSmoothScroll();
  initWaitlistForm();
  initGlowParallax();
  initMockupInteractions();
});
