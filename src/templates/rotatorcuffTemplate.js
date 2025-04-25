export function getRotatorCuffHTML() {
  return `
      <div id="loadingScreen">
        <div class="ascii-loader">
          <span>Loading <span id="loadingPercent">0%</span></span>
          <pre id="asciiBar">[----------]</pre>
        </div>
      </div>
      <div id="backToHome">← Home</div>
      <div id="selectedLabel">🧠 Selected: None</div>
      <div id="videoPanel"></div>
      <div id="popup" class="popup"></div>
    `;
}
