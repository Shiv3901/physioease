export function getViewerHTML() {
  return `
    <div id="viewerArea">
      <div id="modelContainer">
        <div id="terminalHome" class="terminal-link fixed-top-right">Home</div>
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

      <div id="videoArea" style="display: none;">
        <button id="closeVideoBtn" class="close-video-btn">✖️</button>
        <video id="exerciseVideo" controls preload="metadata" muted>
          <source src="" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
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
