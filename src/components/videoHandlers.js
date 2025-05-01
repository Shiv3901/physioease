import { updateDebugDimensions } from './uiHelpers.js';

export function playVideo(src) {
  const exerciseVideo = document.getElementById('exerciseVideo');
  const videoSource = exerciseVideo.querySelector('source');
  const videoArea = document.getElementById('videoArea');
  const modelContainer = document.getElementById('modelContainer');
  const moreVideosContainer = document.getElementById('moreVideosContainer');

  if (!exerciseVideo || !videoSource) {
    console.warn('Video elements not found.');
    return;
  }

  videoSource.src = src;
  exerciseVideo.load();
  exerciseVideo.muted = true;

  videoArea.style.display = 'flex';
  videoArea.style.backgroundColor = 'black';

  const isBottomView = window.innerWidth <= 980;

  if (isBottomView) {
    videoArea.style.position = 'absolute';
    videoArea.style.bottom = '0';
    videoArea.style.width = '100vw';
    videoArea.style.height = '33.33vh';

    modelContainer.style.width = '100%';
    modelContainer.style.height = '66.66vh';

    // Only hide More Videos in bottom view
    moreVideosContainer.style.display = 'none';
  } else {
    videoArea.style.position = 'relative';
    videoArea.style.width = '33.33%';
    videoArea.style.height = '100%';

    modelContainer.style.width = '66.66%';
    modelContainer.style.height = '100%';

    // Keep More Videos visible in side-by-side view
    moreVideosContainer.style.display = 'block';
  }
  window.dispatchEvent(new Event('resize'));
  updateDebugDimensions();
}

export function setupVideoHandlers(metadata) {
  const exerciseVideo = document.getElementById('exerciseVideo');
  const videoSource = exerciseVideo.querySelector('source');
  const videoArea = document.getElementById('videoArea');
  const modelContainer = document.getElementById('modelContainer');
  const closeVideoBtn = document.getElementById('closeVideoBtn');

  const moreVideosContainer = document.getElementById('moreVideosContainer');
  const moreVideosBtn = document.getElementById('moreVideosBtn');
  const moreVideosPane = document.getElementById('moreVideosPane');

  closeVideoBtn.addEventListener('click', () => {
    exerciseVideo.pause();
    exerciseVideo.currentTime = 0;
    videoSource.src = '';
    videoArea.style.display = 'none';

    modelContainer.style.width = '100%';
    modelContainer.style.height = '100%';

    moreVideosContainer.style.display = 'block';

    window.dispatchEvent(new Event('resize'));
    updateDebugDimensions();
  });

  const videoData = metadata?.base_videos || {};

  moreVideosBtn?.addEventListener('click', () => {
    const isVisible = moreVideosPane.style.display === 'flex';
    moreVideosPane.innerHTML = '';

    if (isVisible) {
      moreVideosPane.style.display = 'none';
      return;
    }

    Object.entries(videoData).forEach(([key, entry]) => {
      // Single video entry
      if (entry.src) {
        const btn = document.createElement('div');
        btn.className = 'terminal-link';
        btn.innerText = entry.title || key;
        btn.style.marginBottom = '2px';

        btn.addEventListener('click', () => {
          playVideo(entry.src);
        });

        moreVideosPane.appendChild(btn);
      }

      // Group with sub-videos
      else if (entry.videos && typeof entry.videos === 'object') {
        const categoryTitle = entry.title || key;

        const categoryBtn = document.createElement('div');
        categoryBtn.className = 'terminal-link';
        categoryBtn.innerText = categoryTitle;
        categoryBtn.style.marginBottom = '2px';

        const subMenu = document.createElement('div');
        subMenu.className = 'sub-menu';
        subMenu.style.display = 'none';
        subMenu.style.flexDirection = 'column';

        Object.entries(entry.videos).forEach(([subKey, video]) => {
          const subBtn = document.createElement('div');
          subBtn.className = 'terminal-link';
          subBtn.innerText = video.title || subKey;
          subBtn.style.marginLeft = '12px';
          subBtn.style.marginBottom = '2px';

          subBtn.addEventListener('click', () => {
            playVideo(video.src);
          });

          subMenu.appendChild(subBtn);
        });

        categoryBtn.addEventListener('click', () => {
          const isOpen = subMenu.style.display === 'flex';
          moreVideosPane.querySelectorAll('.sub-menu').forEach((s) => (s.style.display = 'none'));
          subMenu.style.display = isOpen ? 'none' : 'flex';
        });

        moreVideosPane.appendChild(categoryBtn);
        moreVideosPane.appendChild(subMenu);
      }
    });

    moreVideosPane.style.display = 'flex';
    moreVideosPane.style.flexDirection = 'column';
    moreVideosPane.style.gap = '2px';
  });
}
