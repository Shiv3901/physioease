import pkg from '../package.json';
const { version } = pkg;

export function loadHomepage(app) {
  app.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-white text-black px-4">
      <div class="terminal-box w-full max-w-xl border-2 border-black p-6 font-mono shadow-md">
        <h1 class="text-lg font-bold mb-3">PhysioEase v${version}</h1>
        <p class="text-sm text-gray-500 mb-5">A tool to animate injuries, concepts, and exercises.</p>

        <div class="flex flex-col sm:flex-row sm:items-start gap-3 mb-6">
          <button id="launch-rotator" class="terminal-link">
            💪🏼 Rotator Cuff Viewer
          </button>
          <button id="launch-ankle" class="terminal-link">
            🦶 Ankle Viewer
          </button>
          <button id="launch-library" class="terminal-link">
            🎥 Video Library
          </button>
        </div>

        <div class="mt-4 text-sm">
          &gt; <span class="inline-block w-2 animate-blink">_</span>
        </div>
      </div>
    </div>
  `;

  const style = document.createElement('style');
  style.innerHTML = `
    .terminal-box {
      font-family: 'Courier New', Courier, monospace;
      background: #fff;
      color: #333;
    }

    .terminal-link {
      padding: 6px 12px;
      border: 1px dashed #000;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
      text-align: left;
    }

    .terminal-link:hover {
      background-color: black;
      color: white;
    }

    .animate-blink {
      animation: blink 1s steps(2, start) infinite;
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // Navigation handlers
  document.getElementById('launch-rotator')?.addEventListener('click', () => {
    history.pushState({}, '', '/rotatorcuff');
    window.dispatchEvent(new Event('popstate'));
  });

  document.getElementById('launch-ankle')?.addEventListener('click', () => {
    history.pushState({}, '', '/ankle');
    window.dispatchEvent(new Event('popstate'));
  });

  document.getElementById('launch-library')?.addEventListener('click', () => {
    history.pushState({}, '', '/library');
    window.dispatchEvent(new Event('popstate'));
  });
}
