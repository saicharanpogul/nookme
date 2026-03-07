// ═══════════════════════════════════════════════════════════
// NookMe Landing — Interactions & Animations (White Theme)
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

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > 60) {
      nav.style.background = 'rgba(255, 255, 255, 0.95)';
      nav.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.06)';
    } else {
      nav.style.background = 'rgba(255, 255, 255, 0.85)';
      nav.style.boxShadow = 'none';
    }
  });
}

// ─── Smooth Scroll for Anchor Links ────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const navHeight = 56;
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

    const submitBtn = form.querySelector('.waitlist-submit');
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>✓ You\'re on the list!</span>';
    submitBtn.style.background = '#34C759';

    document.getElementById('waitlistEmail').value = '';
    document.getElementById('waitlistEmail').placeholder = 'Welcome aboard!';

    setTimeout(() => {
      submitBtn.innerHTML = originalHTML;
      submitBtn.style.background = '';
      document.getElementById('waitlistEmail').placeholder = 'you@email.com';
    }, 3000);
  });
}

// ─── Initialize Everything ─────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initNavScroll();
  initSmoothScroll();
  initWaitlistForm();
});
