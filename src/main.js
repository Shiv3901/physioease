import { loadHomepage } from './homepage.js';
import { loadLibrary } from './routes/library.js';
import { loadModelByKey } from './templates/codeTemplate.js';
import { METADATA_MAP } from './components/config.js';

function route() {
  const app = document.getElementById('app');
  const path = window.location.pathname;

  if (!app) return;

  const modelRoutes = {
    '/ankle': 'ankle',
    '/lowerback': 'lowerback',
    '/rotatorcuff': 'rotatorcuff',
    // Add more routes as needed
  };

  if (path === '/' || path === '/index.html') {
    loadHomepage(app);
  } else if (path === '/library') {
    loadLibrary(app);
  } else if (modelRoutes[path]) {
    loadModelByKey(app, modelRoutes[path], METADATA_MAP);
  } else {
    app.innerHTML = '<h1>404 Not Found</h1>';
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'pageview',
    page_path: path,
  });
}

window.addEventListener('DOMContentLoaded', route);
window.addEventListener('popstate', route);
