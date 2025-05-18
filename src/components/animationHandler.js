import * as THREE from 'three';
import { log } from './utils.js';

const FILE_LOG_LEVEL = 'ANIMATION_HANDLER';

export class AnimationHandler {
  constructor({
    clips,
    model,
    sliderId = 'animationSlider',
    playButtonId = 'playAnimationsBtn',
    enable = true,
  }) {
    if (!enable || !clips?.length || !model) {
      log('INFO', FILE_LOG_LEVEL, '⚠️ Animations disabled or missing. Skipping setup.');
      this._hideControls();
      return;
    }

    this.model = model;
    this.clips = clips;
    this.mixer = new THREE.AnimationMixer(model);
    this.duration = Math.max(...clips.map((c) => c.duration || 0.1), 0.1);
    this.slider = document.getElementById(sliderId);
    this.playButton = document.getElementById(playButtonId);
    this.isPlaying = false;
    this.currentAction = null;
    this.currentTime = 0; // Track manually

    this._setupControls();
    this._logClipInfo();
    this._loadDefaultClip();

    log(
      'INFO',
      FILE_LOG_LEVEL,
      `✅ AnimationHandler ready. Duration: ${this.duration.toFixed(2)}s`
    );
  }

  _setupControls() {
    if (this.slider) {
      this.slider.max = this.duration.toString();
      this.slider.step = '0.01';
      this.slider.value = '0';
      this.slider.addEventListener('input', (e) => {
        if (!this.isPlaying) this.setTime(parseFloat(e.target.value));
      });
    }

    if (this.playButton) {
      this.playButton.addEventListener('click', () => this.togglePlay());
    }

    const stepAmount = 0.1;
    document.getElementById('stepBackBtn')?.addEventListener('click', () => this.step(-stepAmount));
    document
      .getElementById('stepForwardBtn')
      ?.addEventListener('click', () => this.step(stepAmount));

    document.addEventListener('keydown', (e) => {
      const target = e.target;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName) || target.isContentEditable) return;
      if (e.key === 'j') this.step(-stepAmount);
      if (e.key === 'k') this.step(stepAmount);
      if (e.code === 'Space') {
        e.preventDefault();
        this.togglePlay();
      }
    });
  }

  _logClipInfo() {
    log('INFO', FILE_LOG_LEVEL, `🎞️ ${this.clips.length} animation(s) loaded.`);
    this.clips.forEach((clip, i) => {
      log('DEBUG', FILE_LOG_LEVEL, `   [${i}] "${clip.name}" - ${clip.duration.toFixed(2)}s`);
    });
  }

  _loadDefaultClip() {
    if (this.clips.length > 0) {
      this.play(this.clips[0].name);
      this.setTime(0);
      this._showControls();
    } else {
      this._hideControls();
    }
  }

  play(name) {
    const clip = this.clips.find((c) => c.name === name);
    if (!clip) {
      log('WARN', FILE_LOG_LEVEL, `❌ Animation "${name}" not found.`);
      this._updateName('None');
      this._hideControls();
      return;
    }

    if (this.currentAction) {
      this.currentAction.stop();
    }

    this.currentAction = this.mixer.clipAction(clip);
    this.currentAction.enabled = true;
    this.currentAction.setLoop(THREE.LoopRepeat, Infinity);
    this.currentAction.reset();
    this.currentAction.setEffectiveWeight(1);
    this.currentAction.setEffectiveTimeScale(0.5);
    this.currentAction.play();
    this.currentAction.paused = !this.isPlaying;

    this._updateName(clip.name);
    log('INFO', FILE_LOG_LEVEL, `🎬 Animation started: ${name}`);
  }

  playByName(name) {
    const clip = this.clips.find((c) => c.name === name);
    if (!clip) {
      log('WARN', FILE_LOG_LEVEL, `❌ Animation "${name}" not found.`);
      this._updateName('None');
      this._hideControls();
      return;
    }

    if (this.currentAction) this.currentAction.stop();

    this.currentAction = this.mixer.clipAction(clip);
    this.currentAction.enabled = true;
    this.currentAction.setLoop(THREE.LoopRepeat, Infinity);
    this.currentAction.reset();
    this.currentAction.setEffectiveWeight(1);
    this.currentAction.setEffectiveTimeScale(0.5);
    this.currentAction.play();
    this.currentAction.paused = !this.isPlaying;

    this._updateName(clip.name);
    this._showControls();

    log('INFO', FILE_LOG_LEVEL, `🎬 Animation started: ${name}`);
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;

    if (this.currentAction) {
      this.currentAction.paused = !this.isPlaying;
    }

    if (this.slider) {
      this.slider.disabled = this.isPlaying;
    }

    const playIcon = document.getElementById('playIcon');
    if (playIcon?.tagName.toLowerCase() === 'svg') {
      playIcon.innerHTML = this.isPlaying
        ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />'
        : '<path d="M8 5v14l11-7z" />';
    }

    log('DEBUG', FILE_LOG_LEVEL, this.isPlaying ? '▶️ Playing' : '⏸️ Paused');
  }

  update(delta) {
    if (!this.isPlaying || !this.mixer || !this.currentAction) return;

    this.mixer.update(delta);
    this.currentTime = Math.min(
      this.currentTime + delta * this.currentAction.getEffectiveTimeScale(),
      this.duration
    );

    if (this.slider) {
      this.slider.value = this.currentTime.toFixed(3);
    }
  }

  setTime(time) {
    if (this.isPlaying || !this.mixer || !this.currentAction) {
      log(
        'DEBUG',
        FILE_LOG_LEVEL,
        '⏭ Ignoring setTime — either playing, missing mixer, or no action.'
      );
      return;
    }

    try {
      this.currentTime = time;
      this.currentAction.enabled = true;
      this.currentAction.paused = true;
      this.currentAction.time = time;
      this.currentAction.play(); // Ensures pose is active and bindings correct

      this.mixer.update(0.001); // Small tick to force pose evaluation

      this.model?.traverse((obj) => obj.isMesh && obj.updateMatrixWorld(true));

      if (this.slider) {
        this.slider.value = time.toFixed(3);
      }

      log('DEBUG', FILE_LOG_LEVEL, `🔧 Time set to ${time.toFixed(3)}s`);
    } catch (e) {
      log('ERROR', FILE_LOG_LEVEL, `❌ setTime failed: ${e.message}`, e);
    }
  }

  step(offset) {
    if (!this.currentAction || this.isPlaying || !this.mixer) {
      log('DEBUG', FILE_LOG_LEVEL, '⏮ Step ignored — no current action or is playing.');
      return;
    }

    const newTime = Math.max(0, Math.min(this.currentTime + offset, this.duration));
    this.setTime(newTime);
  }

  dispose() {
    if (this.currentAction) this.currentAction.stop();
    if (this.mixer) {
      this.mixer.stopAllAction();
      try {
        this.mixer.uncacheRoot(this.model);
      } catch (e) {
        log('WARN', FILE_LOG_LEVEL, '⚠️ Mixer root not found or already disposed.');
      }
    }
    this._updateName('None');
    this._hideControls();
    log('INFO', FILE_LOG_LEVEL, '🧹 AnimationHandler disposed.');
  }

  _updateName(name) {
    const el = document.getElementById('animationNameText');
    if (el) {
      el.textContent = name;
      el.title = name;
    }
  }

  _showControls() {
    const wrapper = document.getElementById('animationControlsWrapper');
    if (wrapper) wrapper.style.display = 'flex';
  }

  _hideControls() {
    const wrapper = document.getElementById('animationControlsWrapper');
    if (wrapper) wrapper.style.display = 'none';
  }
}
