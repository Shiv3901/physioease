import './../styles/viewer.css';

let notesVisible = false;

export function createNotesToggleButton() {
  let toggleBtn = document.getElementById('notes-toggle-btn');
  if (toggleBtn) return;

  toggleBtn = document.createElement('button');
  toggleBtn.id = 'notes-toggle-btn';
  toggleBtn.innerText = '📝 Notes';
  toggleBtn.className =
    'fixed bottom-5 right-5 min-h-[40px] px-4 h-10 rounded-lg font-mono text-base font-semibold border border-dashed border-black bg-white hover:bg-black hover:text-white transition flex items-center justify-center z-50 disabled:opacity-50 disabled:cursor-not-allowed';
  document.body.appendChild(toggleBtn);

  toggleBtn.addEventListener('click', () => {
    if (toggleBtn.disabled) return;
    notesVisible = !notesVisible;
    toggleNotesBox(notesVisible);
  });
}

export function toggleNotesBox(show) {
  const notesBox = document.getElementById('chat-box');
  const toggleBtn = document.getElementById('notes-toggle-btn');
  if (!notesBox) return;

  const isMobile = window.innerWidth < 640;
  const path = window.location.pathname;
  const disallowedRoutes = ['/', '/index.html', '/library'];
  const isAllowedRoute = !disallowedRoutes.includes(path);

  if (toggleBtn) {
    toggleBtn.disabled = !isAllowedRoute || isMobile;
    toggleBtn.classList.remove('hidden');
  }

  if (isMobile || !show || !isAllowedRoute) {
    notesBox.className = 'hidden';
    notesBox.innerHTML = '';
    notesVisible = false;
    return;
  }

  notesBox.className =
    'fixed bottom-20 right-5 w-80 h-96 bg-white border-2 border-dashed border-black rounded-lg shadow-lg flex flex-col z-50';

  notesBox.innerHTML = `
    <div class="p-2 text-sm font-semibold border-b border-gray-300">Notes</div>
    <textarea
      id="notes-textarea"
      class="flex-1 p-2 text-sm font-mono border-none resize-none focus:outline-none"
      placeholder="Write your notes here..."
    ></textarea>
  `;

  setupNotesPersistence();
}

function setupNotesPersistence() {
  const textarea = document.getElementById('notes-textarea');
  const storageKey = 'persistentNotes';

  textarea.value = localStorage.getItem(storageKey) || '';

  textarea.addEventListener('input', () => {
    localStorage.setItem(storageKey, textarea.value);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  createNotesToggleButton();
  notesVisible = false;
  toggleNotesBox(false);
});

window.addEventListener('resize', () => {
  toggleNotesBox(notesVisible);
});
