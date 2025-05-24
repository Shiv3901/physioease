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
            <span class="absolute bottom-2 right-4 text-xs text-gray-400">work in progress</span>
          </div>
          <div class="relative">
            <button id="launch-knee" class="pe-btn flex items-center gap-2 text-sm sm:text-base" disabled>
              <span class="text-lg sm:text-xl">🦵</span> Knee Viewer
            </button>
            <span class="absolute bottom-2 right-4 text-xs text-gray-400">paid</span>
          </div>
          <div class="relative">
            <button id="launch-elbow" class="pe-btn flex items-center gap-2 text-sm sm:text-base" disabled>
              <span class="text-lg sm:text-xl">💪</span> Elbow Viewer
            </button>
            <span class="absolute bottom-2 right-4 text-xs text-gray-400">paid</span>
          </div>
          <div class="relative">
            <button class="pe-btn flex items-center gap-2 text-sm sm:text-base" disabled>
              <span class="text-lg sm:text-xl">🧍‍♀️</span> Neck Viewer
            </button>
            <span class="absolute bottom-2 right-4 text-xs text-gray-400">paid</span>
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

    <!-- Mobile warning -->
<div id="device-warning" class="fixed top-4 left-4 right-4 sm:hidden bg-white text-gray-800 text-sm font-medium p-3 rounded-xl shadow-md border border-neutral-200 z-50 transition-opacity duration-500">
  ⚠️ This website is computationally heavy. Please open it on an iPad, laptop, or PC for the best experience.
</div>


  `;

  // Fade out and remove the warning after 5 seconds
  setTimeout(() => {
    const warning = document.getElementById('device-warning');
    if (warning) {
      warning.style.opacity = '0';
      setTimeout(() => warning.remove(), 500); // Allow transition to finish
    }
  }, 5000);

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

  log('INFO', FILE_LOG_LEVEL, '[🏠] Homepage loaded.');
}
