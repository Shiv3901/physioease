export function getRotatorCuffHTML() {
  return `
    <div id="mainLayout">
        <div id="viewerArea">
            <div id="terminalHome" class="terminal-link fixed-top-right">[ ← Back to Home ]</div>
            <div id="selectedLabel" class="terminal-output fixed-top-left">🧠 Selected: None</div>
            <div id="loadingScreen">
            <div class="loading-text">
                Loading <span id="loadingPercent">0%</span>
            </div>
            <pre id="asciiBar">[----------]</pre>
            </div>
            <div id="popup" class="popup"></div>
            <div id="videoLinks" class="video-links" style="display: none;"></div>
        </div>

        <div id="videoArea" class="video-area" style="display: none;">
            <button id="closeVideoBtn" class="close-video-btn">✖️</button>
            <video id="exerciseVideo" controls preload="metadata">
            <source src="" type="video/mp4" />
            Your browser does not support the video tag.
            </video>
        </div>
    </div>
    `;
}
