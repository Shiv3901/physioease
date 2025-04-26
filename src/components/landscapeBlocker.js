export function mountLandscapeBlocker() {
  let warning = document.getElementById('landscapeWarning');

  if (!warning) {
    warning = document.createElement('div');
    warning.id = 'landscapeWarning';
    warning.style.position = 'fixed';
    warning.style.top = 0;
    warning.style.left = 0;
    warning.style.right = 0;
    warning.style.bottom = 0;
    warning.style.background = 'white';
    warning.style.color = 'black';
    warning.style.display = 'none';
    warning.style.justifyContent = 'center';
    warning.style.alignItems = 'center';
    warning.style.textAlign = 'center';
    warning.style.fontFamily = 'monospace';
    warning.style.fontSize = '1.2rem';
    warning.style.zIndex = '9999';
    warning.style.padding = '2rem';
    warning.innerHTML = `⚠️ Please rotate your device back to portrait mode.`;
    document.body.appendChild(warning);
  }

  let wasLandscape = false;

  function checkOrientation() {
    const isLandscape = window.matchMedia('(orientation: landscape)').matches;
    const isMobileWidth = window.innerWidth <= 980;

    if (isLandscape && isMobileWidth) {
      warning.style.display = 'flex';
      wasLandscape = true;
    } else {
      warning.style.display = 'none';
      if (wasLandscape) {
        window.location.reload(); // Reload when returning to portrait
      }
    }
  }

  checkOrientation();
  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);
}
