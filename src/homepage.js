export function loadHomepage(app) {
    app.innerHTML = `
      <div class="homepage">
        <h1>🧠 Welcome to PhysioEase</h1>
        <p>Select a body part to explore:</p>
        <div class="nav-buttons">
          <a href="/rotatorcuff" id="nav-rotator">🎯 Rotator Cuff</a>
          <a href="/ankle" id="nav-ankle">🦶 Ankle (Coming Soon)</a>
        </div>
      </div>
    `;
  
    const style = document.createElement('style');
    style.innerHTML = `
      .homepage {
        font-family: sans-serif;
        text-align: center;
        padding-top: 15vh;
      }
  
      .homepage h1 {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }
  
      .homepage p {
        margin-bottom: 2rem;
        color: #555;
      }
  
      .nav-buttons {
        display: flex;
        justify-content: center;
        gap: 1.5rem;
        flex-wrap: wrap;
      }
  
      .nav-buttons a {
        padding: 12px 24px;
        background-color: #0070f3;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        transition: background-color 0.2s ease;
      }
  
      .nav-buttons a:hover {
        background-color: #005ac0;
      }
    `;
    document.head.appendChild(style);
  
    // Button Navigation Handlers
    document.getElementById('nav-rotator').addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState({}, '', '/rotatorcuff');
      window.dispatchEvent(new Event('popstate'));
    });
  
    document.getElementById('nav-ankle').addEventListener('click', (e) => {
      e.preventDefault();
      history.pushState({}, '', '/ankle');
      window.dispatchEvent(new Event('popstate'));
    });
  }
  