import { updateDebugDimensions } from './uiHelpers';

export function setupVideoHandlers() {
  const videoLinks = document.getElementById('videoLinks');
  const exerciseVideo = document.getElementById('exerciseVideo');
  const videoSource = exerciseVideo.querySelector('source');
  const videoArea = document.getElementById('videoArea');
  const modelContainer = document.getElementById('modelContainer');
  const closeVideoBtn = document.getElementById('closeVideoBtn');

  function adjustLayoutForVideo() {
    const isBottomView = window.innerWidth <= 980;

    if (isBottomView) {
      videoArea.style.display = 'flex';
      videoArea.style.position = 'absolute';
      videoArea.style.bottom = '0';
      videoArea.style.width = '100vw';
      videoArea.style.height = '33.33vh';

      modelContainer.style.width = '100%';
      modelContainer.style.height = '66.66vh';
    } else {
      videoArea.style.display = 'flex';
      videoArea.style.position = 'relative';
      videoArea.style.width = '33.33%';
      videoArea.style.height = '100%';

      modelContainer.style.width = '66.66%';
      modelContainer.style.height = '100%';
    }
  }

  videoLinks.addEventListener('click', (e) => {
    if (e.target.classList.contains('video-box')) {
      e.preventDefault();
      const href = e.target.getAttribute('href');
      if (!href) return;
      videoSource.src = href;
      exerciseVideo.load();
      exerciseVideo.muted = true;
      adjustLayoutForVideo();
      window.dispatchEvent(new Event('resize'));
      updateDebugDimensions();
    }
  });

  closeVideoBtn.addEventListener('click', () => {
    exerciseVideo.pause();
    exerciseVideo.currentTime = 0;
    videoSource.src = '';
    videoArea.style.display = 'none';

    modelContainer.style.width = '100%';
    modelContainer.style.height = '100%';

    window.dispatchEvent(new Event('resize'));
    updateDebugDimensions();
  });
}
