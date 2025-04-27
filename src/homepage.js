import pkg from '../package.json';
const { version } = pkg;

export function loadHomepage(app) {
  app.innerHTML = `
    <div class="terminal-wrapper">
      <div class="terminal-box">
        <div class="title">PhysioEase v${version}</div>

        <div class="subtitle">A tool to animate injuries, concepts, and exercises.</div>

        <div class="viewer-links">
          <div class="terminal-link" id="launch-rotator">🎯 Rotator Cuff Viewer</div>
          <div class="terminal-link" id="launch-ankle">🦶 Ankle Viewer</div>
        </div>

        <div class="prompt-line">&gt; <span class="cursor">_</span></div>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.innerHTML = `
      .terminal-wrapper {
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
      }
  
      .terminal-box {
        font-family: 'Courier New', Courier, monospace;
        font-size: 1rem;
        background: #fff;
        color: #333;
        padding: 24px;
        border: 2px solid #333;
        width: 100%;
        max-width: 600px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }

      .viewer-links {
        display: flex;
        gap: 10px; /* Space between the links */
        align-items: flex-start; /* Optional: align them to the left inside the box */
        margin: 10px 0;
      }

      .title {
        font-weight: bold;
        font-size: 1.1rem;
        margin-bottom: 1rem;
      }
  
      .terminal-link {
        margin: 10px 0;
        padding: 6px 10px;
        border: 1px dashed #333;
        display: inline-block;
        cursor: pointer;
        transition: background 0.2s, color 0.2s;
      }
  
      .terminal-link:hover {
        background: #333;
        color: #fff;
      }
  
      .terminal-link.disabled {
        opacity: 0.4;
        border-color: #999;
        cursor: default;
      }
  
      .prompt-line {
        margin-top: 20px;
      }
  
      .cursor {
        display: inline-block;
        width: 10px;
        animation: blink 1s infinite;
      }

      .subtitle {
        font-size: 0.9rem;
        color: #999;
        margin-top: 3px;
        text-align: left;
      }
  
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
    `;

  document.head.appendChild(style);

  document.getElementById('launch-rotator')?.addEventListener('click', () => {
    history.pushState({}, '', '/rotatorcuff');
    window.dispatchEvent(new Event('popstate'));
  });

  document.getElementById('launch-ankle')?.addEventListener('click', () => {
    history.pushState({}, '', '/ankle');
    window.dispatchEvent(new Event('popstate'));
  });
}
