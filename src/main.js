import { loadHomepage } from './homepage.js';
import { loadRotatorCuff } from './routes/rotatorcuff.js';
import { loadAnkle } from './routes/ankle.js';
import { loadLibrary } from './routes/library.js';

function route() {
  const app = document.getElementById('app');
  const path = window.location.pathname;

  if (!app) return;

  if (path === '/' || path === '/index.html') {
    loadHomepage(app);
  } else if (path === '/rotatorcuff') {
    loadRotatorCuff(app);
  } else if (path === '/ankle') {
    loadAnkle(app);
  } else if (path === '/library') {
    loadLibrary(app);
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
