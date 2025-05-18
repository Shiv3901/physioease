# 🩻 PhysioEase 3D Viewer

Interactive 3D rotator cuff anatomy viewer built with **Three.js**.

## Features

- Hover and select muscles
- Display muscle info in popups
- Linked videos for normal movement and rehab exercises
- Responsive layout for mobile and desktop
- Debug panel showing screen, model, and video dimensions

## Tech Stack

- Three.js
- GLTF/GLB model loading
- Vanilla JavaScript, HTML, CSS

## Setup

```bash
git clone git@github.com:your-username/physioease.git
cd physioease
npm install
npm run dev
```

## Deployment

To format, test, build, commit, and push your changes:

```bash
npm run deploy "your commit message"
```

### Commit Message Guidelines

You can optionally prefix your commit message to bump the version automatically (without creating a git tag):

- `patch: Fix bug or minor change`
- `minor: Add feature in a backward-compatible way`
- `major: Introduce breaking changes`

Examples:

```bash
npm run deploy "patch: fix button alignment on mobile"
npm run deploy "minor: add hamstring viewer"
npm run deploy "update styles and refactor homepage"
```

This script performs the following steps:

1. Run unit tests (`npm run test`)
2. Format code (`npm run format`)
3. Optionally bump version based on commit prefix
4. Build project (`npm run build`)
5. Add all changes to git
6. Commit using your message
7. Push to the current Git branch

## Project Structure

```
public/
  models/
  videos/
src/
  components/
    interactionHandler.js
    modelLoader.js
    utils.js
    ...
  routes/
    rotatorcuff.js
    ...
  styles/
    rotatorcuff.css
    ...
  templates/
    rotatorcuffTemplate.js
    ...
  homepage.js
  main.js
deploy.js
index.html
README.md
```

## License

MIT License
