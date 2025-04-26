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

```
git clone git@github.com:your-username/physioease.git
cd physioease
npm install
npm run dev
```

## Deploy Instructions

To format, build, commit, and push your changes:

```
node deploy.js "your commit message"
```

This will:

- Run `npm run format`
- Run `npm run build`
- Add all changes
- Commit with message prefixed by `change log:`
- Push to your current Git branch

## Project Structure

```
public/
  models/
  videos/
src/
  components/
    interactionHandler.js
    modelLoader.js
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
  main.js
  homepage.js
deploy.js
index.html
README.md
```

## License

MIT License
