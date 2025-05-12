export function getViewerHTML() {
  return `
    <div id="viewerArea">
      <div id="modelContainer">
        <div id="terminalHome" class="terminal-link fixed-top-right">Home</div>

        <div id="animationControlPanel" class="popup" style="top: 60px; right: 16px; left: auto; max-width: 220px;">
  
          <select id="animationSelect" class="terminal-link" style="width: 100%; margin-bottom: 8px;">
            <option>Loading...</option>
          </select>

          <div id="playAnimationsBtn" class="terminal-link" style="text-align: center; margin-bottom: 8px;">▶️ Play</div>

          <input
            id="animationSlider"
            type="range"
            min="0"
            max="1"
            step="0.001"
            value="0"
            style="width: 100%; margin-bottom: 8px;"
          />

          <div style="display: flex; justify-content: space-between; gap: 6px;">
            <button id="stepBackBtn" class="terminal-link" style="flex: 1; padding: 4px 0;">⏪</button>
            <button id="stepForwardBtn" class="terminal-link" style="flex: 1; padding: 4px 0;">⏩</button>
          </div>
        </div>

        <div id="selectedLabel" class="terminal-output fixed-top-left">🧠 Selected: None</div>

        <div id="loadingScreen">
          <div class="loading-text">Loading <span id="loadingPercent">0%</span></div>
          <pre id="asciiBar">[----------]</pre>
        </div>

        <div id="popup" class="popup"></div>
        <div id="videoLinks" class="video-links" style="display: none;"></div>
        <div id="moreVideosContainer">
          <div id="moreVideosPane" style="display: none;"></div>
          <div id="moreVideosBtn" class="terminal-link fixed-bottom-left">🎬 More Videos</div>
        </div>
      </div>

      <div id="sharedContentArea" style="display: none;">
        <button id="closeContentBtn" class="close-video-btn">✖️</button>

        <div id="videoArea" style="display: none;">
          <video id="exerciseVideo" controls preload="metadata" muted>
            <source src="" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div id="contentArea" style="display: none;">
          <div id="contentText" class="content-text"></div>
        </div>
      </div>
    </div>

    <div id="debugDimensions" style="
      position: fixed;
      bottom: 8px;
      right: 12px;
      background: rgba(0,0,0,0.7);
      color: white;
      font-family: monospace;
      font-size: 0.85rem;
      padding: 6px 10px;
      border-radius: 6px;
      z-index: 9999;
      pointer-events: none;
    ">
      📏 0 x 0
    </div>
  `;
}
