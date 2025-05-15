import pkg from '../package.json';
const { version } = pkg;
import './style.css';

export function loadHomepage(app) {
  // Inject viewport meta tag if not present
  if (!document.querySelector('meta[name="viewport"]')) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1';
    document.head.appendChild(meta);
  }

  app.innerHTML = `
    <div class="fixed inset-0 flex items-center justify-center bg-white text-black p-4 sm:p-8">
      <div class="
        w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg
        mx-auto
        border-2 border-black
        p-3 sm:p-6 md:p-8
        font-mono
        shadow
        bg-white text-black
        max-h-[92vh]
        overflow-auto
        transition-all
        duration-300
      ">
        <h1 class="font-bold mb-1 text-base md:text-lg lg:text-2xl">PhysioEase v${version}</h1>
        <p class="text-sm md:text-base lg:text-lg text-gray-500 mb-2">A tool to animate injuries, concepts, and exercises.</p>
        <div class="flex flex-col gap-2 mb-3">
          <button id="launch-rotator" class="pe-btn text-sm md:text-base lg:text-lg px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4">
            💪🏼 Rotator Cuff Viewer
          </button>
          <button id="launch-ankle" class="pe-btn text-sm md:text-base lg:text-lg px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4">
            🦶 Ankle Viewer
          </button>
          <div class="relative">
            <button id="launch-knee" class="pe-btn text-sm md:text-base lg:text-lg px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 opacity-50 cursor-not-allowed" disabled>
              🦵 Knee Viewer
            </button>
            <span class="absolute bottom-1 right-3 text-[10px] md:text-xs lg:text-sm text-gray-500">coming soon</span>
          </div>
          <div class="relative">
            <button id="launch-elbow" class="pe-btn text-sm md:text-base lg:text-lg px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 opacity-50 cursor-not-allowed" disabled>
              💪 Elbow Viewer
            </button>
            <span class="absolute bottom-1 right-3 text-[10px] md:text-xs lg:text-sm text-gray-500">coming soon</span>
          </div>
          <div class="relative">
            <button class="pe-btn text-sm md:text-base lg:text-lg px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 opacity-50 cursor-not-allowed" disabled>
              🦴 Lower Back Viewer
            </button>
            <span class="absolute bottom-1 right-3 text-[10px] md:text-xs lg:text-sm text-gray-500">coming soon</span>
          </div>
          <button id="launch-library" class="pe-btn text-sm md:text-base lg:text-lg px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4">
            🎥 Video Library
          </button>
          <div class="relative">
            <button class="pe-btn text-sm md:text-base lg:text-lg px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 opacity-50 cursor-not-allowed" disabled>
              🧍‍♀️ Neck Viewer
            </button>
            <span class="absolute bottom-1 right-3 text-[10px] md:text-xs lg:text-sm text-gray-500">coming soon</span>
          </div>
        </div>
        <div class="mt-2 text-sm md:text-base lg:text-lg">
          &gt; <span class="inline-block w-2 animate-blink">_</span>
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
}
