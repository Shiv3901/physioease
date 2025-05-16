import { log, injectViewerHeadAssets } from '../components/utils.js';
import { ABOUTUS_METADATA } from '../components/config.js';

export function loadAboutUs(app) {
  const photos = ABOUTUS_METADATA.photos;
  const videos = ABOUTUS_METADATA.videos;
  injectViewerHeadAssets();

  app.innerHTML = `
    <div class="fixed inset-0 overflow-y-auto bg-white text-black font-mono">
      <!-- Home Button (floating) -->
      <button id="terminalHome"
        class="absolute top-5 right-4 z-50 px-4 py-1 border border-dashed border-gray-400 rounded font-mono text-sm bg-white cursor-pointer hover:bg-black hover:text-white transition">
        Home
      </button>

      <div class="max-w-5xl mx-auto my-6 px-6 sm:px-8 py-8">
        <div class="bg-white rounded-lg shadow border border-gray-200 px-3 py-6 sm:px-8 sm:py-8">
          <h1 class="text-xl sm:text-2xl font-bold mb-3 text-gray-900 font-mono">About PhysioEase</h1>
          <p class="text-sm sm:text-base mb-8 text-gray-700 font-sans">A tool to support clearer, faster physio consults.</p>

          <div class="mb-8 border border-dashed border-gray-400 rounded-lg p-4 sm:p-5 bg-gray-50">
            <h2 class="text-base sm:text-lg font-bold mb-4 font-mono">Our Product</h2>
            <p class="text-sm sm:text-base text-gray-700 font-sans">
              <span class="font-bold text-gray-900 font-mono">PhysioEase</span> helps physiotherapists explain injuries with interactive 3D movement animations and assignable videos—so patients and their families actually “get it” and recover with confidence.
            </p>
          </div>

        <div class="mb-8 border border-dashed border-gray-400 rounded-lg p-4 sm:p-5 bg-gray-50">
            <h2 class="text-base sm:text-lg font-bold mb-4 font-mono">Why We Built It</h2>
            <p class="text-sm sm:text-base text-gray-700 font-sans mb-4">
                PhysioEase reduces repetitive explanations and helps structure consults. It makes it easier to explain conditions, exercises, and recovery plans.
            </p>
            <p class="text-sm sm:text-base text-gray-700 font-sans">
                Visual tools help patients understand key points faster—saving time and improving communication during sessions.
            </p>
        </div>


        <div class="mb-8 border border-dashed border-gray-400 rounded-lg p-4 sm:p-5 bg-gray-50">
        <h2 class="text-base sm:text-lg font-bold mb-4 font-mono">Photos</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <!-- Photo 1 -->
            <div class="flex flex-col items-center">
            <img src="${photos.photo1.src}" alt="${photos.photo1.alt}" 
                class="w-full max-w-3xl h-auto rounded border border-gray-300 bg-gray-200 shadow-sm" />
            <span class="text-base text-gray-600 mt-2 font-sans text-center">${photos.photo1.caption}</span>
            </div>

            <!-- Photo 2 -->
            <div class="flex flex-col items-center">
            <img src="${photos.photo2.src}" alt="${photos.photo2.alt}" 
                class="w-full max-w-3xl h-auto rounded border border-gray-300 bg-gray-200 shadow-sm" />
            <span class="text-base text-gray-600 mt-2 font-sans text-center">${photos.photo2.caption}</span>
            </div>
            
        </div>
        </div>


        <div class="mb-4 border border-dashed border-gray-400 rounded-lg p-4 sm:p-5 bg-gray-50">
            <h2 class="text-base sm:text-lg font-bold mb-4 font-mono">Demo Videos</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <!-- Video 1 -->
                <div>
                <div class="aspect-video bg-black rounded flex items-center justify-center border border-gray-300 overflow-hidden">
                    <video class="w-full h-full" controls preload="metadata">
                    <source src="${videos.demo1.src}" type="video/mp4">
                    ${videos.demo1.title}
                    </video>
                </div>
                <div class="text-base text-gray-600 mt-2 font-sans">${videos.demo1.description}</div>
                </div>

                <!-- Video 2 -->
                <div>
                <div class="aspect-video bg-black rounded flex items-center justify-center border border-gray-300 overflow-hidden">
                    <video class="w-full h-full" controls preload="metadata">
                    <source src="${videos.demo2.src}" type="video/mp4">
                    ${videos.demo2.title}
                    </video>
                </div>
                <div class="text-base text-gray-600 mt-2 font-sans">${videos.demo2.description}</div>
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
