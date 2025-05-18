import * as THREE from 'three';
import _ from 'lodash';
import { log } from './utils.js';

const FILE_LOG_LEVEL = 'INTERACTION_HANDLER';

export async function loadHTMLContent(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      log('WARN', FILE_LOG_LEVEL, `[loadHTMLContent] Failed to load: ${path}`);
      return '';
    }
    log('INFO', FILE_LOG_LEVEL, `[loadHTMLContent] Loaded: ${path}`);
    return await res.text();
  } catch (err) {
    log('ERROR', FILE_LOG_LEVEL, `[loadHTMLContent] Error fetching ${path}: ${err.message}`);
    return '';
  }
}

export class InteractionHandler {
  constructor(
    scene,
    camera,
    canvasElement,
    metadata,
    onClickCallback,
    playAnimationPanel,
    showContentCallback
  ) {
    this.scene = scene;
    this.camera = camera;
    this.canvas = canvasElement;
    this.metadata = metadata;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.currentHovered = null;
    this.currentClicked = null;

    this.selectedLabel = document.getElementById('selectedLabel');
    this.selectedPopup = document.getElementById('popup');
    this.selectedVideoLinks = document.getElementById('videoLinks');

    this.animationControlPanel = document.getElementById('animationControlPanel');
    this.animationsPane = document.getElementById('animationsPane');
    this.animationsBtn = document.getElementById('animationsBtn');

    this.onClickCallback = onClickCallback;
    this.playAnimationPanel = playAnimationPanel;
    this.showContentCallback = showContentCallback;

    this.holdTimeout = null;
    this.isLongPress = false;

    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.isPointerDown = false;

    log('INFO', FILE_LOG_LEVEL, 'InteractionHandler initialized');

    this.canvas.addEventListener('pointermove', this.onPointerMove.bind(this));
    this.canvas.addEventListener('pointerdown', this.onPointerDown.bind(this));
    this.canvas.addEventListener('pointerup', this.onPointerUp.bind(this));
    this.canvas.addEventListener('pointercancel', this.clearHold.bind(this));
    this.canvas.addEventListener('pointerleave', this.clearHold.bind(this));
  }

  onPointerMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onPointerDown(event) {
    this.isPointerDown = true;
    this.holdTimeout = setTimeout(() => {
      this.isLongPress = true;
      log('DEBUG', FILE_LOG_LEVEL, 'Long press detected');
    }, 600);
    this.isLongPress = false;
    this.lastPointerDownTarget = event.target;
    log('DEBUG2', FILE_LOG_LEVEL, '[pointerdown] Pointer down on', event.target.tagName);
  }

  onPointerUp(event) {
    this.isPointerDown = false;
    clearTimeout(this.holdTimeout);
    log('DEBUG2', FILE_LOG_LEVEL, '[pointerup] Pointer up on', event.target.tagName);

    if (
      this.animationControlPanel?.contains(event.target) ||
      this.animationsPane?.contains(event.target) ||
      this.animationsBtn?.contains(event.target)
    ) {
      log('DEBUG2', FILE_LOG_LEVEL, '[pointerup] Click ignored due to UI panel');
      return;
    }

    if (!this.isLongPress && this.currentHovered && this.isModelObject(this.currentHovered)) {
      const name = this.currentHovered.name || this.currentHovered.id;
      log('DEBUG', FILE_LOG_LEVEL, 'Click detected on', name);

      if (this.currentClicked === this.currentHovered) {
        this.setHighlight(this.currentClicked, 'restore');
        this.currentClicked = null;
        this.updateSelectedInfo(null);
        log('DEBUG2', FILE_LOG_LEVEL, 'Unselected:', name);
      } else {
        if (this.currentClicked) {
          this.setHighlight(this.currentClicked, 'restore');
        }
        this.currentClicked = this.currentHovered;
        this.setHighlight(this.currentClicked, 'click');
        log('DEBUG2', FILE_LOG_LEVEL, 'Selected:', name);
      }

      if (typeof this.onClickCallback === 'function') {
        this.onClickCallback(this.currentClicked);
      }
    }
  }

  clearHold() {
    clearTimeout(this.holdTimeout);
    this.isPointerDown = false;
    log('DEBUG2', FILE_LOG_LEVEL, '[clearHold] Pointer cleared');
  }

  setHighlight(object, type) {
    if (!object?.material?.emissive) {
      log('DEBUG2', FILE_LOG_LEVEL, '[setHighlight] Skipping: no material/emissive');
      return;
    }

    const name = object.name || object.id || '(unnamed)';

    if (type === 'hover') {
      log('DEBUG2', FILE_LOG_LEVEL, `[hover] Attempting highlight on: ${name}`);
      log(
        'DEBUG2',
        FILE_LOG_LEVEL,
        `[hover] isTouch=${this.isTouch}, isPointerDown=${this.isPointerDown}, isClicked=${this.currentClicked?.name === name}`
      );
      log('DEBUG2', FILE_LOG_LEVEL, `[hover] Highlighting ${name} with yellow`);
      object.material.emissive.setHex(0x999900);
    } else if (type === 'click') {
      log('DEBUG2', FILE_LOG_LEVEL, `[click] Highlighting ${name} with green`);
      object.material.emissive.setHex(0x009900);
      this.updateSelectedInfo(object);
    } else if (type === 'restore') {
      log('DEBUG2', FILE_LOG_LEVEL, `[restore] Clearing highlight on ${name}`);
      object.material.emissive.setHex(0x000000);
    }
  }

  update() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const firstIntersect = intersects[0].object;
      const name = firstIntersect.name || firstIntersect.id;

      if (this.currentHovered !== firstIntersect) {
        if (this.currentHovered && this.currentHovered !== this.currentClicked) {
          this.setHighlight(this.currentHovered, 'restore');
        }

        this.currentHovered = firstIntersect;

        if (this.currentHovered !== this.currentClicked) {
          this.setHighlight(this.currentHovered, 'hover');
        } else {
          log('DEBUG2', FILE_LOG_LEVEL, `[update] Skipped hover due to conditions`);
        }
      }
    } else {
      if (this.currentHovered && this.currentHovered !== this.currentClicked) {
        this.setHighlight(this.currentHovered, 'restore');
      }
      this.currentHovered = null;
    }
  }

  updateSelectedInfo(object) {
    if (!object) {
      this.selectedLabel.textContent = '🧠 Selected: None';
      this.selectedPopup.style.display = 'none';
      this.selectedVideoLinks.style.display = 'none';
      return;
    }

    const selectedName = object.name || object.id || 'Unnamed';
    const formattedName = _.startCase(selectedName);
    const entry = this.metadata?.specific_videos?.[selectedName];

    log('INFO', FILE_LOG_LEVEL, `Selected object info updated for: ${selectedName}`);

    this.selectedLabel.textContent = `🧠 Selected: ${formattedName}`;
    this.selectedPopup.innerHTML = '';

    const infoText = document.createElement('p');
    infoText.textContent = entry?.info || 'No description available.';
    this.selectedPopup.appendChild(infoText);

    this.selectedVideoLinks.innerHTML = '';

    if (entry) {
      Object.entries(entry).forEach(([key, item]) => {
        if (key === 'info' || typeof item !== 'object') return;

        const { title, type, src, path } = item;

        const btn = document.createElement('div');
        btn.className = 'terminal-link';
        btn.innerText = title || _.startCase(key);
        btn.style.marginTop = '2px';

        if (type === 'video' && src) {
          btn.addEventListener('click', () => {
            this.playAnimationPanel?.(src) ?? window.open(src, '_blank');
          });
          this.selectedVideoLinks.appendChild(btn);
        }
      });
    }

    const hasLinks = this.selectedVideoLinks.children.length > 0;
    this.selectedVideoLinks.style.display = hasLinks ? 'flex' : 'none';
    this.selectedPopup.style.display = 'block';
  }

  isModelObject(object) {
    if (!object) return false;
    const name = object.name || object.id;
    return !!this.metadata?.specific_videos?.[name];
  }
}
