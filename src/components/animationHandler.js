import * as THREE from 'three';
import { log } from './utils.js';

let mixer;
let animations = [];
let isPlaying = false;
let sliderElement = null;
let playButtonElement = null;
let animationSelectElement = null;
let currentAction = null;
let duration = 0;

export function setupAnimationHandler(
  mixerInstance,
  clips,
  {
    sliderId = 'animationSlider',
    playButtonId = 'playAnimationsBtn',
    selectId = 'animationSelect'
  } = {}
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
  animationSelectElement = document.getElementById(selectId);

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

  if (animationSelectElement) {
    animationSelectElement.innerHTML = animations.map((clip, index) => `
      <option value="${index}">${clip.name}</option>
    `).join('');
  
    animationSelectElement.addEventListener('change', (e) => {
      const selectedIndex = parseInt(e.target.value);
      if (!isNaN(selectedIndex)) {
        stopCurrentAction();
        playAnimation(animations[selectedIndex]);
        log('INFO', `🎬 Selected animation: ${animations[selectedIndex].name}`);
      }
    });
  
    if (animations.length > 0) {
      stopCurrentAction();
      playAnimation(animations[0]);
      setAnimationTime(0);
      animationSelectElement.value = "0";
      log('INFO', `🎬 Default animation loaded: ${animations[0].name}`);
    }
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
  });

  function stepAnimation(offset) {
    if (!mixer || isPlaying || !currentAction) return;

    const newTime = Math.max(0, Math.min(currentAction.time + offset, duration));
    setAnimationTime(newTime);
    if (sliderElement) sliderElement.value = newTime.toFixed(3);

    log('DEBUG', `⏯️ Stepped to ${newTime.toFixed(2)}s`);
  }

  log('INFO', `✅ Animation handler initialized. Duration: ${duration.toFixed(2)}s`);
}

function playAnimation(clip) {
  currentAction = mixer.clipAction(clip);
  currentAction.enabled = true;
  currentAction.setLoop(THREE.LoopRepeat, Infinity);
  currentAction.reset();
  currentAction.setEffectiveWeight(1);
  currentAction.play();
  currentAction.paused = !isPlaying;
}

function stopCurrentAction() {
  if (currentAction) {
    currentAction.stop();
    currentAction = null;
  }
}

export function togglePlay() {
  isPlaying = !isPlaying;

  if (playButtonElement) {
    playButtonElement.textContent = isPlaying ? '⏸️ Pause' : '▶️ Play ';
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
    log('DEBUG2', ` → Current Clip "${currentAction._clip.name}": time=${currentAction.time.toFixed(3)}`);
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
