import { updateDebugDimensions } from './uiHelpers.js';
import { playAnimationByName } from './animationHandler.js';
import { log } from './utils.js';

function showContentPanel({ type, html = '' }) {
  const sharedContentArea = document.getElementById('sharedContentArea');
  const contentArea = document.getElementById('contentArea');
  const modelContainer = document.getElementById('modelContainer');
  const moreVideosContainer = document.getElementById('moreVideosContainer');

  sharedContentArea.classList.remove('hidden');
  sharedContentArea.classList.add('flex');

  const isBottomView = window.innerWidth <= 980;

  if (isBottomView) {
    sharedContentArea.classList.remove('relative');
    sharedContentArea.classList.add('absolute', 'bottom-0', 'w-screen');
    sharedContentArea.style.height = '33.33vh';
    modelContainer.style.height = '66.66vh';
    modelContainer.style.width = '100%';
    moreVideosContainer.classList.add('hidden');
  } else {
    sharedContentArea.classList.remove('absolute', 'bottom-0', 'w-screen');
    sharedContentArea.classList.add('relative');
    sharedContentArea.style.height = '100%';
    sharedContentArea.style.width = '33.33vw';
    modelContainer.style.width = '66.66vw';
    modelContainer.style.height = '100%';
    moreVideosContainer.classList.remove('hidden');
  }

  if (type === 'text') {
    sharedContentArea.classList.remove('bg-black', 'bg-opacity-90');
    sharedContentArea.classList.add('bg-white');
    contentArea.classList.remove('hidden');
    contentArea.classList.add('flex');
    contentArea.innerHTML = `<div class="content-wrapper">${html}</div>`;
  }

  window.dispatchEvent(new Event('resize'));
  updateDebugDimensions();
}

export function playAnimationPanel(name) {
  playAnimationByName(name);
}

export function showContent(html) {
  showContentPanel({ type: 'text', html });
}

export function setupContentHandlers(metadata) {
  const moreVideosBtn = document.getElementById('moreVideosBtn');
  const moreVideosPane = document.getElementById('moreVideosPane');

  const videoData = metadata?.base_videos || {};
  let videoCount = 0;

  Object.entries(videoData).forEach(([key, entry]) => {
    if (entry.src) {
      const btn = document.createElement('div');
      btn.className =
        'py-1 rounded border border-dashed border-gray-400 font-mono text-sm cursor-pointer hover:bg-black hover:text-white transition w-full text-left';

      const label = document.createElement('span');
      label.className = 'px-3';
      label.textContent = entry.title || key;

      btn.appendChild(label);

      btn.addEventListener('click', () => {
        log('INFO', `[▶️] Playing animation "${key}"`);
        playAnimationPanel(key);
      });

      moreVideosPane.appendChild(btn);
      videoCount++;
    }
  });

  log('INFO', `[🎬] Loaded ${videoCount} video animation options.`);
  log('DEBUG', '[🧾] moreVideosPane innerHTML:\n' + moreVideosPane.innerHTML);

  moreVideosPane.classList.add('hidden');
  moreVideosPane.classList.remove('flex');

  moreVideosBtn?.addEventListener('click', () => {
    const isHidden = moreVideosPane.classList.contains('hidden');

    if (isHidden) {
      moreVideosPane.classList.remove('hidden');
      moreVideosPane.classList.add('flex');
      log('INFO', '[📁] More Videos pane opened.');
    } else {
      moreVideosPane.classList.remove('flex');
      moreVideosPane.classList.add('hidden');
      log('INFO', '[📁] More Videos pane closed.');
    }
  });
}
