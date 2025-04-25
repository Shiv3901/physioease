export function loadAnkle(app) {
  app.innerHTML = `
      <div class="coming-soon">
        <h1>🦶 Ankle Viewer</h1>
        <p>This module is coming soon. Stay tuned!</p>
        <a href="/">← Back to Home</a>
      </div>
    `;

  const style = document.createElement('style');
  style.innerHTML = `
      .coming-soon {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        height: 100vh;
        font-family: sans-serif;
      }
  
      .coming-soon h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
  
      .coming-soon a {
        margin-top: 1rem;
        text-decoration: none;
        color: #0070f3;
        font-weight: bold;
      }
  
      .coming-soon a:hover {
        text-decoration: underline;
      }
    `;
  document.head.appendChild(style);
}
