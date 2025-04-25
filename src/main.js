import { loadHomepage } from './homepage.js';
import { loadRotatorCuff } from './routes/rotatorcuff.js';
import { loadAnkle } from './routes/ankle.js';

const app = document.getElementById('app');

function route() {
  const path = window.location.pathname;

  if (path === '/' || path === '/index.html') {
    loadHomepage(app);
  } else if (path === '/rotatorcuff') {
    loadRotatorCuff(app);
  } else if (path === '/knee') {
    loadKnee(app);
  } else if (path === '/ankle') {
    loadAnkle(app);
  } else {
    app.innerHTML = '<h1>404 Not Found</h1>';
  }
}

window.addEventListener('DOMContentLoaded', route);
window.addEventListener('popstate', route);
