import * as THREE from 'three';
import { log } from './utils.js';

let mixer;
let animations = [];
let isPlaying = false;
let sliderElement = null;
let playButtonElement = null;
let duration = 0;

export function setupAnimationHandler(
  mixerInstance,
  clips,
  {
    sliderId = 'animationSlider',
    playButtonId = 'playAnimationsBtn',
  } = {}
) {
  mixer = mixerInstance;
  animations = clips;
  duration = Math.max(...clips.map((clip) => clip.duration || 0), 0.1);

  sliderElement = document.getElementById(sliderId);
  playButtonElement = document.getElementById(playButtonId);

  if (sliderElement) {
    sliderElement.max = duration.toString();
    sliderElement.step = '0.1';
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

  log('INFO', `✅ Animation handler initialized. Duration: ${duration.toFixed(2)}s`);
}

export function togglePlay() {
  isPlaying = !isPlaying;

  if (playButtonElement) {
    playButtonElement.textContent = isPlaying ? '⏸️ Pause' : '▶️ Play Animation';
  }  

  if (isPlaying) {
    log('INFO', '▶️ Playing animations...');
    animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.enabled = true;
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.reset();
      action.setEffectiveWeight(1);
      action.play();
      action.paused = false;
    });

    if (sliderElement) sliderElement.disabled = true;
  } else {
    log('INFO', '⏸️ Paused. Manual slider active.');
    animations.forEach((clip) => {
      const action = mixer.clipAction(clip);
      action.enabled = true;
      action.setEffectiveWeight(1);
      action.paused = true;
      action.play();
    });

    mixer.update(0);
    if (sliderElement) sliderElement.disabled = false;
  }
}

export function updateAnimationHandler(delta) {
  if (!mixer) return;

  if (isPlaying) {
    mixer.update(delta);

    if (sliderElement && animations[0]) {
      sliderElement.value = Math.min(mixer.time, duration).toFixed(3);
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

  animations.forEach((clip, index) => {
    const action = mixer.clipAction(clip);
    action.enabled = true;
    action.setEffectiveWeight(1);
    action.paused = true;
    action.play(); // required to bind tracks
    action.time = seconds;

    log('DEBUG2', ` → Clip[${index}] "${clip.name}": time=${action.time.toFixed(3)}`);
  });

  mixer.update(0);

  mixer.getRoot().traverse((obj) => {
    if (obj.isMesh) obj.updateMatrixWorld(true);
  });

  log('DEBUG', `✅ Pose applied at ${seconds.toFixed(3)}s`);
}

export function isAnimationPlaying() {
  return isPlaying;
}
