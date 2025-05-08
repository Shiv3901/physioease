import * as THREE from 'three';
import { log } from './utils.js';

let mixer;
let animations = [];
let sliderElement = null;
let duration = 0;

export function setupAnimationHandler(
  mixerInstance,
  clips,
  {
    sliderId = 'animationSlider',
  } = {}
) {
  mixer = mixerInstance;
  animations = clips;

  // Set slider duration based on the longest animation
  duration = Math.max(...clips.map((clip) => clip.duration || 0), 0.1);

  sliderElement = document.getElementById(sliderId);

  if (sliderElement) {
    sliderElement.max = duration.toString();
    sliderElement.step = '0.01';
    sliderElement.value = '0';

    sliderElement.addEventListener('input', (e) => {
      const time = parseFloat(e.target.value);
      setAnimationTime(time);
      log('DEBUG2', `Slider moved to ${time.toFixed(2)}s`);
    });
  }

  log('INFO', `✅ Manual animation scrubbing initialized (slider-only mode). Duration: ${duration.toFixed(2)}s`);
}

export function setAnimationTime(seconds) {
  if (!mixer) {
    log('WARN', 'Mixer not initialized.');
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
    action.time = seconds; // explicitly align action time

    log('DEBUG2', ` → Clip[${index}] "${clip.name}": weight=${action.getEffectiveWeight()}, time=${action.time.toFixed(3)}`);
  });

  mixer.update(0); // force apply pose

  mixer.getRoot().traverse((obj) => {
    if (obj.isMesh) obj.updateMatrixWorld(true);
  });

  log('DEBUG', `✅ Pose applied at ${seconds.toFixed(3)}s`);
}
