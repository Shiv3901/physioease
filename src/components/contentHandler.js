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
  const animationControlPanel = document.getElementById('animationControlPanel');

  let wasOverlappingWhenOpened = false; // <-- NEW FLAG

  const videoData = metadata?.base_videos || {};
  let videoCount = 0;

  // Helper to check if two elements overlap
  function areElementsOverlapping(el1, el2) {
    if (!el1 || !el2) return false;
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  Object.entries(videoData).forEach(([key, entry]) => {
    if (entry.src) {
      const btn = document.createElement('div');
      btn.className =
        'py-1 rounded border border-dashed border-gray-400 font-mono text-sm text-black cursor-pointer w-full text-left transition hover:bg-gray-200 active:bg-gray-200';

      const label = document.createElement('span');
      label.className = 'px-3';
      label.textContent = entry.title || key;

      btn.appendChild(label);

      btn.addEventListener('click', () => {
        document
          .querySelectorAll('#moreVideosPane .selected')
          .forEach((el) => el.classList.remove('bg-gray-200', 'text-black', 'selected'));

        btn.classList.add('bg-gray-200', 'text-black', 'selected');
        log('INFO', `[▶️] Playing animation "${key}"`);
        playAnimationPanel(key);

        // Use the flag set when More Videos pane was opened!
        if (wasOverlappingWhenOpened) {
          moreVideosPane.classList.remove('flex');
          moreVideosPane.classList.add('hidden');
          if (animationControlPanel) animationControlPanel.classList.remove('hidden');
          log('INFO', '[📁] More Videos pane closed (after select, overlap).');
        }
      });

      moreVideosPane.appendChild(btn);
      videoCount++;
    }
  });

  log('INFO', `[🎬] Loaded ${videoCount} video animation options.`);

  moreVideosPane.classList.add('hidden');
  moreVideosPane.classList.remove('flex');

  moreVideosBtn?.addEventListener('click', () => {
    const isHidden = moreVideosPane.classList.contains('hidden');

    if (isHidden) {
      moreVideosPane.classList.remove('hidden');
      moreVideosPane.classList.add('flex');
      log('INFO', '[📁] More Videos pane opened.');

      // Check overlap after opening and set flag!
      setTimeout(() => {
        if (
          animationControlPanel &&
          areElementsOverlapping(moreVideosPane, animationControlPanel)
        ) {
          animationControlPanel.classList.add('hidden');
          wasOverlappingWhenOpened = true;
        } else {
          wasOverlappingWhenOpened = false;
        }
      }, 30);
    } else {
      moreVideosPane.classList.remove('flex');
      moreVideosPane.classList.add('hidden');
      if (animationControlPanel) animationControlPanel.classList.remove('hidden');
      wasOverlappingWhenOpened = false;
      log('INFO', '[📁] More Videos pane closed.');
    }
  });
}
