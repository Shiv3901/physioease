export function getViewerHTML() {
  return `
    <div id="viewerArea" class="relative w-full h-full">
      <div id="modelContainer" class="w-full h-full relative">
        <canvas class="absolute top-0 left-0 w-full h-full z-[2]"></canvas>

        <div id="UITopPanel" class="absolute top-3 left-3 right-3 z-30 text-black">
          <div class="flex justify-end items-start w-full gap-10">
            <div class="flex flex-col w-[270px] shrink-0 gap-2">
              <div class="flex justify-end">
                <button id="terminalHome"
                  class="min-h-[40px] px-6 rounded-lg font-mono text-base font-semibold border border-dashed border-black bg-white hover:bg-black hover:text-white transition flex items-center justify-center">
                  Home
                </button>
              </div>

              <div class="w-full border border-dashed border-black bg-white px-4 py-3 rounded">
                <div class="flex items-center gap-2 mb-2 font-mono text-sm">
                  <span class="font-semibold">🎞️ Animation:</span>
                  <span id="animationNameText" class="font-small"></span>
                </div>

                <input
                  id="animationSlider"
                  type="range"
                  class="custom-slider w-full h-[4px] mb-4"
                  min="0"
                  max="1"
                  step="0.001"
                  value="0"
                />

                <div class="flex justify-center gap-2">
                  <button id="stepBackBtn"
                    class="flex-1 min-h-[40px] px-3 rounded-lg font-mono text-base font-semibold border border-black bg-white hover:bg-black hover:text-white transition flex items-center justify-center">
                    « 1ms
                  </button>
                  <button id="playAnimationsBtn" title="Toggle Play/Pause"
                    class="flex-1 min-h-[40px] px-3 rounded-lg font-mono text-base font-semibold border border-black bg-white hover:bg-black hover:text-white transition flex items-center justify-center">
                    <svg id="playIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                  <button id="stepForwardBtn"
                    class="flex-1 min-h-[40px] px-3 rounded-lg font-mono text-base font-semibold border border-black bg-white hover:bg-black hover:text-white transition flex items-center justify-center">
                    1ms »
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom-left: Selected label & popup -->
        <div id="bottomLeftInfo" class="fixed bottom-3 left-3 z-40 flex flex-col gap-2 w-[280px]">
          <div id="popup" class="border border-dashed border-black bg-white px-4 py-2 rounded font-mono text-sm leading-snug whitespace-pre-wrap break-words">
            <div id="videoLinks" class="mt-2"></div>
          </div>  
          <div id="selectedLabel"
            class="border border-dashed border-black bg-white px-4 min-h-[40px] rounded font-mono font-semibold text-sm leading-tight flex items-center">
            🧠 Selected: None
          </div>
        </div>

        <!-- Center loading screen -->
        <div id="loadingScreen" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-center z-50">
          <div class="text-base mb-1.5 text-black">Loading <span id="loadingPercent">0%</span></div>
          <pre id="asciiBar" class="text-lg text-amber-700">[----------]</pre>
        </div>

        <!-- Top-left: More Videos -->
        <div id="moreVideosContainer" class="fixed top-3 left-3 z-[9999] flex flex-col items-start gap-1">
          <div
            id="moreVideosPane"
            class="hidden fixed top-[3.2rem] left-3 z-50 bg-white border border-dashed rounded-md px-2 py-2 w-50 max-h-64 overflow-y-auto flex-col gap-2"
          ></div>
          <button
            id="moreVideosBtn"
            class="min-h-[40px] px-6 rounded-lg font-mono text-base font-semibold border border-dashed border-black bg-white hover:bg-black hover:text-white transition flex items-center justify-center"
          >
            🎬 More Animations
          </button>
        </div>

        <!-- Overlay shared content -->
        <div id="sharedContentArea" class="hidden absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4 z-40">
          <button id="closeContentBtn"
            class="px-5 py-3 rounded-lg font-mono text-base font-semibold border border-black bg-black hover:bg-red-500 text-white transition absolute top-4 right-4 text-xl min-h-[36px] flex items-center justify-center">
            ✖️
          </button>

          <div id="videoArea" class="hidden w-full max-w-3xl">
            <video id="exerciseVideo" controls preload="metadata" muted class="w-full rounded">
              <source src="" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div id="contentArea" class="hidden mt-4 w-full max-w-2xl text-white">
            <div id="contentText" class="whitespace-pre-line"></div>
          </div>
        </div>
      </div>

      <!-- Debug panel -->
      <div id="debugDimensions" class="fixed bottom-3 right-3 bg-black/10 text-black text-sm font-mono px-3 py-1 rounded z-[9999] pointer-events-none">
        📏 0 x 0
      </div>
    </div>
  `;
}
