export function getViewerHTML() {
  return `
    <div id="viewerArea">
      <div id="modelContainer">

        <div id="UITopPanel" class="ui-panel">
          <div id="selectedLabel" class="terminal-output fixed-top-left">🧠 Selected: None</div>
          <div id="popup" class="popup"></div>
          <div id="videoLinks" class="video-links" style="display: none;"></div>

          <div id="terminalHome" class="terminal-link fixed-top-right">Home</div>

          <div id="animationControlPanel" class="popup animation-control-panel">
            <div class="animation-label">
              <span class="label-heading">🎞️ Animation:</span>
              <span id="animationNameText" class="animation-name">None</span>
            </div>

            <div id="animationControlsWrapper">
              <input
                id="animationSlider"
                type="range"
                min="0"
                max="1"
                step="0.001"
                value="0"
                class="animation-slider"
              />

              <div class="animation-controls">
                <button id="stepBackBtn" class="terminal-link step-button">« 1s</button>
                <button id="playAnimationsBtn" class="icon-button" title="Play">
                  <svg id="playIcon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <button id="stepForwardBtn" class="terminal-link step-button">1s »</button>
              </div>
            </div>
          </div>
        </div>
        
        <div id="loadingScreen">
          <div class="loading-text">Loading <span id="loadingPercent">0%</span></div>
          <pre id="asciiBar">[----------]</pre>
        </div>

        <div id="moreVideosContainer">
          <div id="moreVideosPane" style="display: none;"></div>
          <div id="moreVideosBtn" class="terminal-link fixed-bottom-left">🎬 More Animations</div>
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
