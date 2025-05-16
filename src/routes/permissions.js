export function isNotesAllowedPath(pathname = window.location.pathname) {
  const modelRoutes = ['/ankle', '/lowerback', '/rotatorcuff'];
  const disallowed = ['/', '/index.html', '/library', '/aboutus'];
  return modelRoutes.includes(pathname) || !disallowed.includes(pathname);
}
