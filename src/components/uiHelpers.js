export function updateDebugDimensions() {
    const debugDimensions = document.getElementById('debugDimensions');
    if (!debugDimensions) return;
  
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
  
    const modelContainer = document.getElementById('modelContainer');
    const videoArea = document.getElementById('videoArea');
  
    const modelW = modelContainer ? modelContainer.clientWidth : 0;
    const modelH = modelContainer ? modelContainer.clientHeight : 0;
  
    const videoW = videoArea ? videoArea.clientWidth : 0;
    const videoH = videoArea ? videoArea.clientHeight : 0;
  
    const isBottomView = window.innerWidth <= 980;
    const layoutType = isBottomView ? 'Column (Mobile)' : 'Row (Desktop)';
  
    debugDimensions.innerHTML = `
      📱 Screen: ${screenW} × ${screenH}<br>
      🎨 Model: ${modelW} × ${modelH}<br>
      🎬 Video: ${videoW} × ${videoH}<br>
      🧱 Layout: ${layoutType}
    `;
  }
  