export function getRotatorCuffHTML() {
  return `
        <div id="terminalHome" class="terminal-link fixed-top-right">[ ← Back to Home ]</div>
        <div id="selectedLabel" class="terminal-output fixed-top-left">🧠 Selected: None</div>
        <div id="loadingScreen">
        <div class="loading-text">
            Loading <span id="loadingPercent">0%</span>
        </div>
        <pre id="asciiBar">[----------]</pre>
        </div>
        <div id="videoPanel"></div>
        <div id="popup" class="popup"></div>
    `;
}
