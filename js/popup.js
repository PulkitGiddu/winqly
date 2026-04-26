/* ========================================
   Yellow Peach — Sticky CTA Popup
   ======================================== */

export function initPopup() {
  const popup = document.getElementById('cta-popup');
  const closeBtn = document.getElementById('cta-popup-close');

  if (!popup || !closeBtn) return;

  // Show popup after scrolling 40% of the page
  let hasShown = false;
  let isDismissed = false;

  function checkScroll() {
    if (isDismissed || hasShown) return;

    const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (scrollPercent > 0.25) {
      popup.classList.add('visible');
      hasShown = true;
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });

  // Close popup
  closeBtn.addEventListener('click', () => {
    popup.classList.remove('visible');
    popup.classList.add('hidden');
    isDismissed = true;
  });
}
