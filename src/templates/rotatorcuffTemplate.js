export function getRotatorCuffHTML() {
  return `
      <div id="loadingScreen">
        <div class="loading-text">Loading rotator cuff model...</div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" id="progressFill"></div>
        </div>
      </div>
      <div id="backToHome">← Home</div>
      <div id="selectedLabel">🧠 Selected: None</div>
      <div id="videoPanel"></div>
      <div id="popup" class="popup"></div>
    `;
}
