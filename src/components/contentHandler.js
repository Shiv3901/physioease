import { log } from './utils.js';

const FILE_LOG_LEVEL = 'CONTENT_HANDLER';

let _animationHandlerRef = null;

export function registerAnimationHandler(handler) {
  _animationHandlerRef = handler;
  if (_animationHandlerRef) {
    log('DEBUG', FILE_LOG_LEVEL, '[📁] AnimationHandler registered.');
  }
}

export function playAnimationPanel(name) {
  if (_animationHandlerRef) {
    _animationHandlerRef.playByName(name);
  } else {
    console.warn('⚠️ No AnimationHandler registered for playAnimationPanel');
  }
}

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
}

export function showContent(html) {
  showContentPanel({ type: 'text', html });
}

export function setupContentHandlers(metadata) {
  const animationsBtn = document.getElementById('animationsBtn');
  const animationsPane = document.getElementById('animationsPane');
  const animationControlPanel = document.getElementById('animationControlPanel');

  let wasOverlappingWhenOpened = false; // <-- NEW FLAG

  const videoData = metadata?.animations || {};
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

  animationsPane.innerHTML = '';

  if (metadata?.enableAnimation === false) {
    const comingSoonMsg = document.createElement('div');
    comingSoonMsg.className =
      'p-4 text-sm text-gray-500 font-mono border border-dashed border-gray-300 rounded';
    comingSoonMsg.textContent = '🎥 More animations coming soon.';
    animationsPane.appendChild(comingSoonMsg);
    log(
      'INFO',
      FILE_LOG_LEVEL,
      '[ℹ️] Animations are disabled or not available – showing "coming soon" notice.'
    );
  } else {
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
            .querySelectorAll('#animationsPane .selected')
            .forEach((el) => el.classList.remove('bg-gray-200', 'text-black', 'selected'));

          btn.classList.add('bg-gray-200', 'text-black', 'selected');
          log('DEBUG', FILE_LOG_LEVEL, `[▶️] Playing animation "${key}"`);
          playAnimationPanel(key);

          if (wasOverlappingWhenOpened) {
            animationsPane.classList.remove('flex');
            animationsPane.classList.add('hidden');
            if (animationControlPanel) animationControlPanel.classList.remove('hidden');
            log('DEBUG', FILE_LOG_LEVEL, '[📁] More Videos pane closed (after select, overlap).');
          }
        });

        animationsPane.appendChild(btn);
        videoCount++;
      }
    });

    log('INDEBUGFO', FILE_LOG_LEVEL, `[🎬] Loaded ${videoCount} video animation options.`);
  }

  log('DEBUG', FILE_LOG_LEVEL, `[🎬] Loaded ${videoCount} video animation options.`);

  animationsPane.classList.add('hidden');
  animationsPane.classList.remove('flex');

  animationsBtn?.addEventListener('click', () => {
    const isHidden = animationsPane.classList.contains('hidden');

    if (isHidden) {
      animationsPane.classList.remove('hidden');
      animationsPane.classList.add('flex');
      log('DEBUG', FILE_LOG_LEVEL, '[📁] More Videos pane opened.');

      // Check overlap after opening and set flag!
      setTimeout(() => {
        if (
          animationControlPanel &&
          areElementsOverlapping(animationsPane, animationControlPanel)
        ) {
          animationControlPanel.classList.add('hidden');
          wasOverlappingWhenOpened = true;
        } else {
          wasOverlappingWhenOpened = false;
        }
      }, 30);
    } else {
      animationsPane.classList.remove('flex');
      animationsPane.classList.add('hidden');
      if (animationControlPanel) animationControlPanel.classList.remove('hidden');
      wasOverlappingWhenOpened = false;
      log('DEBUG', FILE_LOG_LEVEL, '[📁] More Videos pane closed.');
    }
  });
}
