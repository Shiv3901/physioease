import * as THREE from 'three';
import { log } from './utils.js';

let mixer;
let animations = [];
let isPlaying = false;
let sliderElement = null;
let playButtonElement = null;
let currentAction = null;
let duration = 0;

export function setupAnimationHandler(
  mixerInstance,
  clips,
  { sliderId = 'animationSlider', playButtonId = 'playAnimationsBtn' } = {}
) {
  mixer = mixerInstance;
  animations = clips;

  log('INFO', `🎞️ ${animations.length} animation(s) loaded.`);
  animations.forEach((clip, index) => {
    log('INFO', `   [${index}] Name: "${clip.name}" Duration: ${clip.duration.toFixed(3)}s`);
  });

  duration = Math.max(...clips.map((clip) => clip.duration || 0), 0.1);

  sliderElement = document.getElementById(sliderId);
  playButtonElement = document.getElementById(playButtonId);
  const controlsWrapper = document.getElementById('animationControlsWrapper');

  if (sliderElement) {
    sliderElement.max = duration.toString();
    sliderElement.step = '0.01';
    sliderElement.value = '0';

    sliderElement.addEventListener('input', (e) => {
      if (!isPlaying) {
        const time = parseFloat(e.target.value);
        setAnimationTime(time);
        log('DEBUG2', `Slider moved to ${time.toFixed(2)}s`);
      }
    });
  }

  if (playButtonElement) {
    playButtonElement.addEventListener('click', () => {
      togglePlay();
    });
  }

  const stepAmount = 0.1;
  const stepBackBtn = document.getElementById('stepBackBtn');
  const stepForwardBtn = document.getElementById('stepForwardBtn');

  if (stepBackBtn) {
    stepBackBtn.addEventListener('click', () => stepAnimation(-stepAmount));
  }
  if (stepForwardBtn) {
    stepForwardBtn.addEventListener('click', () => stepAnimation(stepAmount));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'j') stepAnimation(-stepAmount);
    if (e.key === 'k') stepAnimation(stepAmount);
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    }
  });

  function stepAnimation(offset) {
    if (!mixer || isPlaying || !currentAction) return;

    const newTime = Math.max(0, Math.min(currentAction.time + offset, duration));
    setAnimationTime(newTime);
    if (sliderElement) sliderElement.value = newTime.toFixed(3);

    log('DEBUG', `⏯️ Stepped to ${newTime.toFixed(2)}s`);
  }

  if (animations.length > 0) {
    stopCurrentAction();
    playAnimation(animations[0]);
    setAnimationTime(0);
    updateAnimationName(animations[0].name);
    if (controlsWrapper) controlsWrapper.style.display = 'flex';
    log('INFO', `🎬 Default animation loaded: ${animations[0].name}`);
  } else {
    updateAnimationName('None');
    if (controlsWrapper) controlsWrapper.style.display = 'none';
  }

  log('INFO', `✅ Animation handler initialized. Duration: ${duration.toFixed(2)}s`);
}

function playAnimation(clip) {
  currentAction = mixer.clipAction(clip);
  currentAction.enabled = true;
  currentAction.setLoop(THREE.LoopRepeat, Infinity);
  currentAction.reset();
  currentAction.setEffectiveWeight(1);
  currentAction.setEffectiveTimeScale(0.5);
  currentAction.play();
  currentAction.paused = !isPlaying;

  updateAnimationName(clip.name);
}

function stopCurrentAction() {
  if (currentAction) {
    currentAction.stop();
    currentAction = null;
  }
}

function updateAnimationName(name) {
  const nameTextEl = document.getElementById('animationNameText');
  if (nameTextEl) {
    nameTextEl.textContent = name || 'None';
    nameTextEl.title = name || 'None';
  }
}

export function playAnimationByName(name) {
  const clip = animations.find((clip) => clip.name === name);
  const controlsWrapper = document.getElementById('animationControlsWrapper');

  if (!clip) {
    log('WARN', `❌ Animation "${name}" not found.`);
    updateAnimationName('None');
    if (controlsWrapper) controlsWrapper.style.display = 'none';
    return;
  }

  stopCurrentAction();
  playAnimation(clip);
  setAnimationTime(0);
  updateAnimationName(clip.name);
  if (controlsWrapper) controlsWrapper.style.display = 'flex';

  log('INFO', `🎬 Animation started: ${name}`);
}

export function togglePlay() {
  isPlaying = !isPlaying;

  const playIcon = document.getElementById('playIcon');
  if (playIcon?.tagName.toLowerCase() === 'svg') {
    playIcon.innerHTML = isPlaying
      ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />' // Pause icon
      : '<path d="M8 5v14l11-7z" />'; // Play icon
  }

  if (isPlaying) {
    log('INFO', '▶️ Playing current animation...');
    if (currentAction) currentAction.paused = false;
    if (sliderElement) sliderElement.disabled = true;
  } else {
    log('INFO', '⏸️ Paused. Manual slider active.');
    if (currentAction) currentAction.paused = true;
    mixer.update(0);
    if (sliderElement) sliderElement.disabled = false;
  }
}

export function updateAnimationHandler(delta) {
  if (!mixer) return;

  if (isPlaying) {
    mixer.update(delta);

    if (sliderElement && currentAction) {
      sliderElement.value = Math.min(currentAction.time, duration).toFixed(3);
    }
  }
}

export function setAnimationTime(seconds) {
  if (!mixer || isPlaying) {
    log('DEBUG', '⏭ Ignoring setAnimationTime — either mixer is missing or currently playing.');
    return;
  }

  log('DEBUG', `🔧 Setting animation time to ${seconds.toFixed(3)}s`);
  mixer.setTime(seconds);

  if (currentAction) {
    currentAction.time = seconds;
    currentAction.paused = true;
    currentAction.play();
    log(
      'DEBUG2',
      ` → Current Clip "${currentAction._clip.name}": time=${currentAction.time.toFixed(3)}`
    );
  }

  mixer.update(0);

  mixer.getRoot().traverse((obj) => {
    if (obj.isMesh) obj.updateMatrixWorld(true);
  });

  log('DEBUG', `✅ Pose applied at ${seconds.toFixed(3)}s`);
}

export function isAnimationPlaying() {
  return isPlaying;
}
