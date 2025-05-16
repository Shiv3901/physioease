import { log, injectViewerHeadAssets } from '../components/utils.js';

export function loadAboutUs(app) {
  injectViewerHeadAssets();
  app.innerHTML = `
    <div class="fixed inset-0 overflow-y-auto bg-white text-black font-mono">
      <!-- Home Button (floating) -->
      <button id="terminalHome"
        class="absolute top-5 right-4 z-50 px-4 py-1 border border-dashed border-gray-400 rounded font-mono text-sm bg-white cursor-pointer hover:bg-black hover:text-white transition">
        Home
      </button>

      <div class="max-w-2xl mx-auto my-6 px-6 sm:px-8 py-8">
        <div class="bg-white rounded-lg shadow border border-gray-200 px-3 py-6 sm:px-12 sm:py-12">
          <h1 class="text-xl sm:text-2xl font-bold mb-3 text-gray-900 font-mono">About Us</h1>
          <p class="text-sm sm:text-base mb-6 text-gray-700 font-sans">A tool to support clearer, faster physio consults.</p>

          <div class="mb-4 border border-dashed border-gray-400 rounded-lg p-4 sm:p-5 bg-gray-50">
            <h2 class="text-base sm:text-lg font-bold mb-2 font-mono">Our Product</h2>
            <p class="text-sm sm:text-base text-gray-700 font-sans">
              <span class="font-bold text-gray-900 font-mono">PhysioEase</span> helps physiotherapists explain injuries with interactive 3D movement animations and assignable videos—so patients and their families actually “get it” and recover with confidence.
            </p>
          </div>

          <div class="mb-4 border border-dashed border-gray-400 rounded-lg p-4 sm:p-5 bg-gray-50">
            <h2 class="text-base sm:text-lg font-bold mb-2 font-mono">Why We Built It</h2>
            <p class="text-sm sm:text-base text-gray-700 font-sans">
              Most people leave physio sessions <span class="italic">confused</span> about their diagnosis or recovery. We made PhysioEase to make consults more visual, more clear—and save everyone time (and headaches).
            </p>
          </div>

          <div class="mb-4 border border-dashed border-gray-400 rounded-lg p-4 sm:p-5 bg-gray-50">
            <h2 class="text-base sm:text-lg font-bold mb-4 font-mono">Photos</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="aspect-video bg-gray-200 flex items-center justify-center rounded text-gray-400 border border-gray-300 text-base font-mono">Photo 1</div>
              <div class="aspect-video bg-gray-200 flex items-center justify-center rounded text-gray-400 border border-gray-300 text-base font-mono">Photo 2</div>
            </div>
          </div>

          <div class="mb-4 border border-dashed border-gray-400 rounded-lg p-4 sm:p-5 bg-gray-50">
            <h2 class="text-base sm:text-lg font-bold mb-4 font-mono">Demo Videos</h2>
            <div class="space-y-4">
              <div class="aspect-video bg-black rounded flex items-center justify-center border border-gray-300 overflow-hidden">
                <video class="w-full h-full" controls preload="metadata">
                  <source src="your-demo-video-1.mp4" type="video/mp4">
                  Demo Video 1
                </video>
              </div>
              <div class="aspect-video bg-black rounded flex items-center justify-center border border-gray-300 overflow-hidden">
                <video class="w-full h-full" controls preload="metadata">
                  <source src="your-demo-video-2.mp4" type="video/mp4">
                  Demo Video 2
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('terminalHome')?.addEventListener('click', (e) => {
    e.preventDefault();
    history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
  });
}
