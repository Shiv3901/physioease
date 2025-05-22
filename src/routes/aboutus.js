import { log, injectViewerHeadAssets } from '../components/utils.js';
import { ABOUTUS_METADATA } from '../components/config.js';

const FILE_LOG_LEVEL = 'ABOUTUS';

export function loadAboutUs(app) {
  const animations = ABOUTUS_METADATA.animations;
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
          <h1 class="text-xl sm:text-2xl font-bold mb-3 text-gray-900 font-mono">About Us</h1>

          <!-- How to Use Section -->
          <div class="mb-6 mt-6 p-4 sm:p-6 border border-dashed border-gray-400 rounded-lg bg-gray-50">
            <h2 class="text-xl sm:text-2xl font-bold mb-8 text-center font-mono text-gray-900">How to Use PhysioEase</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">

              <!-- Step 1 -->
              <div class="flex flex-col items-center">
                <h3 class="text-base sm:text-lg font-bold mb-3 font-mono">Explain Instantly</h3>
                <div class="w-56 h-56 rounded-xl overflow-hidden border border-gray-300 shadow mb-4 bg-white">
                  <img src="../../public/images/first.png" alt="Share Fast" class="w-full h-full object-cover" />
                </div>
                <p class="text-sm sm:text-base text-gray-700 font-sans">Use 3D animations to convey complex concepts in seconds.</p>
              </div>

              <!-- Step 2 -->
              <div class="flex flex-col items-center">
                <h3 class="text-base sm:text-lg font-bold mb-3 font-mono">Deep Understanding</h3>
                <div class="w-56 h-56 rounded-xl overflow-hidden border border-gray-300 shadow mb-4 bg-white">
                  <img src="../../public/images/second.png" alt="Patient Understanding" class="w-full h-full object-cover" />
                </div>
                <p class="text-sm sm:text-base text-gray-700 font-sans">Help patients truly grasp their injury and treatment.</p>
              </div>

              <!-- Step 3 -->
              <div class="flex flex-col items-center">
                <h3 class="text-base sm:text-lg font-bold mb-3 font-mono">Confidently Share</h3>
                <div class="w-56 h-56 rounded-xl overflow-hidden border border-gray-300 shadow mb-4 bg-white">
                  <img src="../../public/images/third.png" alt="Share with Family" class="w-full h-full object-cover" />
                </div>
                <p class="text-sm sm:text-base text-gray-700 font-sans">Patients explain their recovery clearly to family and friends.</p>
              </div>

            </div>
          </div>


          <div class="mb-4 border border-dashed border-gray-400 rounded-lg p-4 sm:p-5 bg-gray-50">
            <h2 class="text-base sm:text-lg font-bold mb-4 font-mono">Our Product</h2>
            <p class="text-sm sm:text-base text-gray-700 font-sans">
              <span class="font-bold text-gray-900 font-mono">PhysioEase</span> helps physiotherapists explain injuries and movements with interactive 3D animations and assignable videos—so patients and their families actually “get it” and recover with confidence.
            </p>
          </div>

        <div class="mb-4 border border-dashed border-gray-400 rounded-lg p-4 sm:p-5 bg-gray-50">
            <h2 class="text-base sm:text-lg font-bold mb-4 font-mono">Why We Built It</h2>
            <p class="text-sm sm:text-base text-gray-700 font-sans mb-4">
                PhysioEase reduces repetitive explanations and helps structure consults. It makes it easier to explain conditions, exercises, and recovery plans.
            </p>
            <p class="text-sm sm:text-base text-gray-700 font-sans">
                Visual tools help patients understand key points faster—saving time and improving communication during sessions, especially when there's a language barrier.
            </p>
        </div>

        <div class="mb-4 border border-dashed border-gray-400 rounded-lg p-4 sm:p-5 bg-gray-50">
          <h2 class="text-base sm:text-lg font-bold mb-4 font-mono">Animations</h2>
          <div class="grid grid-cols-1 gap-8">

            <!-- Animation 1 -->
            <div class="flex flex-col items-center">
              <video
                src="${animations.video1.src}"
                autoplay
                muted
                loop
                playsinline
                class="w-full max-w-xl sm:max-w-2xl md:max-w-3xl rounded border border-gray-300 bg-gray-200 shadow-sm"
              ></video>
              <span class="text-base text-gray-600 mt-2 font-sans text-center">${animations.video1.caption}</span>
            </div>

            <!-- Animation 2 -->
            <div class="flex flex-col items-center">
              <video
                src="${animations.video2.src}"
                autoplay
                muted
                loop
                playsinline
                class="w-full max-w-xl sm:max-w-2xl md:max-w-3xl rounded border border-gray-300 bg-gray-200 shadow-sm"
              ></video>
              <span class="text-base text-gray-600 mt-2 font-sans text-center">${animations.video2.caption}</span>
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

          <!-- Contact Us -->
          <div class="mt-8 border border-dashed border-gray-400 rounded-lg p-4 sm:p-5 bg-gray-50">
            <h2 class="text-base sm:text-lg font-bold mb-4 font-mono">Contact Us</h2>
            <p class="text-sm sm:text-base text-gray-700 font-sans">
              Want a different model? Want any other feature? Or just want to talk? Reach out here: <br />
              <a href="mailto:physioeaseau@gmail.com" class="text-blue-600 hover:underline">physioeaseau@gmail.com</a><br />
              <a href="tel:0411297539" class="text-blue-600 hover:underline">0411 297 539</a>
            </p>
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

  log('INFO', FILE_LOG_LEVEL, '[ℹ️] About Us page loaded.');
}
