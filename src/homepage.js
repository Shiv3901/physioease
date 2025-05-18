import pkg from '../package.json';
const { version } = pkg;
import './style.css';
import { log } from './components/utils';

const FILE_LOG_LEVEL = 'HOMEPAGE';

export function loadHomepage(app) {
  if (!document.querySelector('meta[name="viewport"]')) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1';
    document.head.appendChild(meta);
  }

  app.innerHTML = `
    <div class="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-100 via-white to-neutral-200 p-2 sm:p-8">
      <div class="
        w-full
        max-w-sm sm:max-w-xl lg:max-w-2xl xl:max-w-3xl
        p-2 sm:p-8 lg:p-10
        mx-auto
        border border-neutral-200 shadow-xl bg-white
        font-mono
        max-h-[92vh]
        overflow-auto
        transition-all duration-300
      ">
        <div class="flex flex-col gap-2.5 mb-0.5 px-2 sm:px-0">
          <h1 class="font-bold text-xl sm:text-2xl lg:text-3xl tracking-tight text-gray-800 mb-0 text-left">
            PhysioEase
          </h1>
          <p class="text-xs sm:text-base lg:text-lg text-gray-700 font-medium text-left">
            A tool to support clearer, faster physio consults.
          </p>
          <button id="launch-ankle" class="pe-btn flex items-center gap-2 text-sm sm:text-base">
            <span class="text-lg sm:text-xl">🦶</span> Ankle Viewer
          </button>
          <button id="launch-lowerback" class="pe-btn flex items-center gap-2 text-sm sm:text-base">
            <span class="text-lg sm:text-xl">🦴</span> Lower Back Viewer
          </button>
          <div class="relative">
            <button id="launch-rotator" class="pe-btn flex items-center gap-2 text-sm sm:text-base">
              <span class="text-lg sm:text-xl">💪🏼</span> Rotator Cuff Viewer
            </button>
            <span class="absolute bottom-2 right-4 text-xs text-gray-400">wip</span>
          </div>
          <div class="relative">
            <button id="launch-knee" class="pe-btn flex items-center gap-2 text-sm sm:text-base" disabled>
              <span class="text-lg sm:text-xl">🦵</span> Knee Viewer
            </button>
            <span class="absolute bottom-2 right-4 text-xs text-gray-400">coming soon</span>
          </div>
          <div class="relative">
            <button id="launch-elbow" class="pe-btn flex items-center gap-2 text-sm sm:text-base" disabled>
              <span class="text-lg sm:text-xl">💪</span> Elbow Viewer
            </button>
            <span class="absolute bottom-2 right-4 text-xs text-gray-400">coming soon</span>
          </div>
          <div class="relative">
            <button class="pe-btn flex items-center gap-2 text-sm sm:text-base" disabled>
              <span class="text-lg sm:text-xl">🧍‍♀️</span> Neck Viewer
            </button>
            <span class="absolute bottom-2 right-4 text-xs text-gray-400">coming soon</span>
          </div>
          <button id="launch-library" class="pe-btn flex items-center gap-2 text-sm sm:text-base">
            <span class="text-lg sm:text-xl">🎥</span> Video Library
          </button>
          <button id="launch-aboutus" class="pe-btn flex items-center gap-2 text-sm sm:text-base">
            <span class="text-lg sm:text-xl">🛈</span> About Us
          </button>
          <div class="flex items-center justify-between">
            <div>
              <span class="text-base text-gray-500">&gt; <span class="inline-block w-2 animate-blink">_</span></span>
            </div>
            <div>
              <span class="text-xs sm:text-sm text-gray-400 font-semibold">v${version}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('launch-rotator')?.addEventListener('click', () => {
    history.pushState({}, '', '/rotatorcuff');
    window.dispatchEvent(new Event('popstate'));
  });

  document.getElementById('launch-ankle')?.addEventListener('click', () => {
    history.pushState({}, '', '/ankle');
    window.dispatchEvent(new Event('popstate'));
  });

  document.getElementById('launch-library')?.addEventListener('click', () => {
    history.pushState({}, '', '/library');
    window.dispatchEvent(new Event('popstate'));
  });

  document.getElementById('launch-lowerback')?.addEventListener('click', () => {
    history.pushState({}, '', '/lowerback');
    window.dispatchEvent(new Event('popstate'));
  });

  document.getElementById('launch-aboutus')?.addEventListener('click', () => {
    history.pushState({}, '', '/aboutus');
    window.dispatchEvent(new Event('popstate'));
  });

  // Show help modal only if not seen before
  if (!localStorage.getItem('pe_help_seen')) {
    const helpModal = document.createElement('div');
    helpModal.innerHTML = `
    <div id="help-modal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-md font-mono text-sm text-gray-800 relative">
        <h2 class="text-lg font-bold mb-2">🧭 How to Use PhysioEase</h2>
        <ul class="list-disc pl-5 space-y-1">
          <li><b>Rotate:</b> Left-click + drag</li>
          <li><b>Change axis:</b> Shift + Left-click + drag</li>
          <li><b>Play/Pause:</b> Top-right controls</li>
          <li><b>Step frames:</b> Use &lt;&lt;1ms, &gt;&gt;1ms or <kbd>J</kbd>/<kbd>K</kbd></li>
          <li><b>Change animation:</b> Top-left dropdown</li>
          <li><b>Notes:</b> Saved in browser; cleared on close</li>
        </ul>
        <button id="close-help-modal" class="mt-4 px-4 py-1 border border-gray-400 rounded hover:bg-gray-100">Got it</button>
      </div>
    </div>
  `;
    document.body.appendChild(helpModal);

    // Close modal logic
    document.getElementById('close-help-modal')?.addEventListener('click', () => {
      document.getElementById('help-modal')?.remove();
      localStorage.setItem('pe_help_seen', 'true');
    });
  }

  log('INFO', FILE_LOG_LEVEL, '[🏠] Homepage loaded.');
}
