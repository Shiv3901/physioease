export function loadNotFoundPage(app) {
  app.innerHTML = `
    <div class="fixed inset-0 overflow-y-auto bg-white text-black font-mono">
      <button id="terminalHome"
        class="absolute top-5 right-4 z-50 px-4 py-1 border border-dashed border-gray-400 rounded font-mono text-sm bg-white cursor-pointer hover:bg-black hover:text-white transition">
        Home
      </button>

      <div class="max-w-3xl mx-auto my-12 px-6 sm:px-8 py-8 text-center">
        <div class="bg-white rounded-lg shadow border border-gray-200 px-6 py-10 sm:px-10 sm:py-12">
          <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">404</h1>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
          <p class="text-sm sm:text-base text-gray-600 font-sans mb-6">
            Sorry, the page you're looking for doesn’t exist or has been moved.
          </p>
          <button id="notFoundBack"
            class="mt-4 inline-block px-6 py-2 border border-dashed border-gray-400 text-sm font-mono rounded bg-white text-gray-800 hover:bg-black hover:text-white transition">
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  `;

  document.getElementById('terminalHome')?.addEventListener('click', (e) => {
    e.preventDefault();
    history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
  });

  document.getElementById('notFoundBack')?.addEventListener('click', (e) => {
    e.preventDefault();
    history.pushState({}, '', '/');
    window.dispatchEvent(new Event('popstate'));
  });
}
