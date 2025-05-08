import { updateDebugDimensions } from './uiHelpers.js';

function showContentPanel({ type, videoSrc = '', html = '' }) {
  const sharedContentArea = document.getElementById('sharedContentArea');
  const videoArea = document.getElementById('videoArea');
  const contentArea = document.getElementById('contentArea');
  const modelContainer = document.getElementById('modelContainer');
  const moreVideosContainer = document.getElementById('moreVideosContainer');

  sharedContentArea.style.display = 'flex';

  const isBottomView = window.innerWidth <= 980;

  if (isBottomView) {
    sharedContentArea.style.position = 'absolute';
    sharedContentArea.style.bottom = '0';
    sharedContentArea.style.width = '100vw';
    sharedContentArea.style.height = '33.33vh';

    modelContainer.style.width = '100%';
    modelContainer.style.height = '66.66vh';

    moreVideosContainer.style.display = 'none';
  } else {
    sharedContentArea.style.position = 'relative';
    sharedContentArea.style.width = '33.33vw';
    sharedContentArea.style.height = '100%';

    modelContainer.style.width = '66.66vw';
    modelContainer.style.height = '100%';

    moreVideosContainer.style.display = 'block';
  }

  if (type === 'video') {
    const exerciseVideo = document.getElementById('exerciseVideo');
    if (!exerciseVideo) {
      console.warn('Video elements not found.');
      return;
    }
    const videoSource = exerciseVideo.querySelector('source');
    if (!videoSource) {
      console.warn('Video elements not found.');
      return;
    }

    videoSource.src = videoSrc;
    exerciseVideo.load();
    exerciseVideo.muted = true;

    sharedContentArea.style.backgroundColor = 'black';
    videoArea.style.display = 'flex';
    contentArea.style.display = 'none';
  }

  if (type === 'text') {
    sharedContentArea.style.backgroundColor = 'white';
    videoArea.style.display = 'none';
    contentArea.style.display = 'flex';
    contentArea.innerHTML = `<div class="content-wrapper">${html}</div>`;
  }

  window.dispatchEvent(new Event('resize'));
  updateDebugDimensions();
}

export function playVideo(src) {
  showContentPanel({ type: 'video', videoSrc: src });
}

export function showContent(html) {
  showContentPanel({ type: 'text', html: html });
}

export function setupContentHandlers(metadata) {
  const exerciseVideo = document.getElementById('exerciseVideo');
  const videoSource = exerciseVideo.querySelector('source');
  const sharedContentArea = document.getElementById('sharedContentArea');
  const videoArea = document.getElementById('videoArea');
  const contentArea = document.getElementById('contentArea');
  const modelContainer = document.getElementById('modelContainer');
  const closeBtn = document.getElementById('closeContentBtn');

  const moreVideosContainer = document.getElementById('moreVideosContainer');
  const moreVideosBtn = document.getElementById('moreVideosBtn');
  const moreVideosPane = document.getElementById('moreVideosPane');

  closeBtn.addEventListener('click', () => {
    if (exerciseVideo) {
      exerciseVideo.pause();
      exerciseVideo.currentTime = 0;
    }
    if (videoSource) videoSource.src = '';

    sharedContentArea.style.display = 'none';
    videoArea.style.display = 'none';
    contentArea.style.display = 'none';

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
      if (entry.src) {
        const btn = document.createElement('div');
        btn.className = 'terminal-link';
        btn.innerText = entry.title || key;
        btn.style.marginBottom = '2px';

        btn.addEventListener('click', () => {
          playVideo(entry.src);
        });

        moreVideosPane.appendChild(btn);
      } else if (entry.videos && typeof entry.videos === 'object') {
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
