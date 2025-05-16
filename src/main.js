import { loadHomepage } from './homepage.js';
import { loadLibrary } from './routes/library.js';
import { loadModelByKey } from './templates/codeTemplate.js';
import { METADATA_MAP } from './components/config.js';
import { loadAboutUs } from './routes/aboutus.js';
import { createNotesToggleButton, toggleNotesBox } from './routes/chatbox.js'; // <-- also import toggleNotesBox

function route() {
  const app = document.getElementById('app');
  const path = window.location.pathname;

  if (!app) return;

  const modelRoutes = {
    '/ankle': 'ankle',
    '/lowerback': 'lowerback',
    '/rotatorcuff': 'rotatorcuff',
  };

  const isNotesAllowed =
    modelRoutes[path] !== undefined ||
    !(path === '/' || path === '/index.html' || path === '/library' || path === '/aboutus');

  if (path === '/' || path === '/index.html') {
    loadHomepage(app);
  } else if (path === '/library') {
    loadLibrary(app);
  } else if (path === '/aboutus') {
    loadAboutUs(app);
  } else if (modelRoutes[path]) {
    loadModelByKey(app, modelRoutes[path], METADATA_MAP);
  } else {
    app.innerHTML = '<h1>404 Not Found</h1>';
  }

  createNotesToggleButton(); // ensures it's created once
  toggleNotesBox(false); // always starts hidden
  const button = document.getElementById('notes-toggle-btn');
  if (button) {
    const isMobile = window.innerWidth < 640;
    button.disabled = !isNotesAllowed || isMobile;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'pageview',
    page_path: path,
  });
}

window.addEventListener('DOMContentLoaded', route);
window.addEventListener('popstate', route);
