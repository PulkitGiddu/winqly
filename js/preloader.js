/* ========================================
   Wynklo — Preloader Module
   ======================================== */

export function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  // Wait for fonts to load, then exit
  const exitPreloader = () => {
    preloader.classList.add('exit');
    document.body.classList.remove('loading');

    // Remove from DOM after transition
    preloader.addEventListener('transitionend', () => {
      preloader.remove();
    }, { once: true });
  };

  // Use Font Loading API if available, fallback to timeout
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      // Small extra delay for visual impact
      setTimeout(exitPreloader, 400);
    });
  } else {
    // Fallback: exit after 800ms
    setTimeout(exitPreloader, 800);
  }

  // Safety: always exit after 2s max
  setTimeout(exitPreloader, 2000);
}
