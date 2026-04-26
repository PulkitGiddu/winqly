/* ========================================
   Yellow Peach — Featured Work Scroll Effect
   + Cursor-following "View All Work" on hero image
   ======================================== */

export function initFeaturedWork() {
  // ── Featured Work heading fade ──
  const header = document.getElementById('featured-work-header');
  const heading = document.getElementById('featured-work-heading');
  const section = document.getElementById('featured-work');

  if (header && heading && section) {
    function updateHeading() {
      const firstCard = section.querySelector('.project-card');
      if (!firstCard) return;

      const headerRect = header.getBoundingClientRect();
      const cardRect = firstCard.getBoundingClientRect();
      const headingBottom = headerRect.top + headerRect.height;
      const fadeStart = headingBottom + 100;
      const fadeEnd = headerRect.top;

      if (cardRect.top >= fadeStart) {
        heading.style.opacity = 1;
        heading.style.transform = 'scale(1)';
      } else if (cardRect.top <= fadeEnd) {
        heading.style.opacity = 0;
        heading.style.transform = 'scale(0.95)';
      } else {
        const progress = (fadeStart - cardRect.top) / (fadeStart - fadeEnd);
        const clamped = Math.max(0, Math.min(1, progress));
        heading.style.opacity = 1 - clamped;
        heading.style.transform = `scale(${1 - clamped * 0.05})`;
      }
    }

    window.addEventListener('scroll', updateHeading, { passive: true });
    updateHeading();
  }

  // ── Cursor-following "View All Work" on hero image ──
  const heroCard = document.querySelector('.hero-image-card');
  const heroCta = document.querySelector('.hero-card-cta');

  if (heroCard && heroCta) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroCta.style.left = x + 'px';
      heroCta.style.top = y + 'px';
    });

    // Click on the card navigates to work page
    heroCard.addEventListener('click', (e) => {
      if (e.target.tagName !== 'A') {
        window.location.href = '/work.html';
      }
    });
  }
}
