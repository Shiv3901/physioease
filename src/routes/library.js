import { ANKLE_METADATA, ROTATORCUFF_METADATA } from '../components/config.js';
import { createNotesToggleButton } from './chatbox.js';

export function loadLibrary(app) {
  createNotesToggleButton(false);
  const allVideos = {
    ...ANKLE_METADATA.animations,
    ...ROTATORCUFF_METADATA.animations,
  };

  const videoCards = Object.entries(allVideos)
    .map(([key, entry]) => renderVideoCard(entry.title, entry.src))
    .join('');

  app.innerHTML = `
    <div class="fixed inset-0 overflow-y-auto bg-white text-black px-6 py-4 font-mono">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">🎥 Video Library</h1>
        <button id="terminalHome" class="px-4 py-1 border border-dashed border-black rounded font-mono text-sm cursor-pointer hover:bg-black hover:text-white transition">
          Home
        </button>
      </div>

      <p class="text-sm text-gray-500 mb-6">A collection of demonstration and educational animations.</p>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        ${videoCards}
      </div>
    </div>
  `;

  document.getElementById('terminalHome')?.addEventListener('click', (e) => {
    e.preventDefault();
    history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
  });
}

function renderVideoCard(title, videoUrl) {
  return `
    <div class="border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-white hover:shadow-md transition">
      <div class="aspect-video bg-black">
        <video class="w-full h-full" controls preload="metadata">
          <source src="${videoUrl}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
      <div class="p-3 text-sm font-semibold text-center text-gray-800">${title}</div>
    </div>
  `;
}
