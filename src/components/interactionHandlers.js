import * as THREE from 'three';
import _ from 'lodash';
import { log } from './utils.js';
import { IMAGE_BASE_URL } from './config.js';

export async function loadHTMLContent(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) {
      log('WARN', `[loadHTMLContent] Failed to load: ${path}`);
      return '';
    }
    return await res.text();
  } catch (err) {
    log('ERROR', `[loadHTMLContent] Error fetching ${path}: ${err.message}`);
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

    this.onClickCallback = onClickCallback;
    this.playAnimationPanel = playAnimationPanel;
    this.showContentCallback = showContentCallback;

    this.holdTimeout = null;
    this.isLongPress = false;

    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerdown', this.onPointerDown.bind(this));
    // Pass the event object to onPointerUp:
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));
    window.addEventListener('pointercancel', this.clearHold.bind(this));
    window.addEventListener('pointerleave', this.clearHold.bind(this));
  }

  onPointerMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onPointerDown() {
    this.isLongPress = false;
    this.holdTimeout = setTimeout(() => {
      this.isLongPress = true;
      log('DEBUG', 'Long press detected');
    }, 500);
  }

  onPointerUp(event) {
    clearTimeout(this.holdTimeout);

    // Ignore clicks inside animation panel
    if (this.animationControlPanel && event && this.animationControlPanel.contains(event.target)) {
      return;
    }

    if (!this.isLongPress && this.currentHovered && this.isModelObject(this.currentHovered)) {
      log('DEBUG', 'Click detected on', this.currentHovered.name || this.currentHovered.id);

      if (this.currentClicked === this.currentHovered) {
        this.setHighlight(this.currentClicked, 'restore');
        this.currentClicked = null;
        this.updateSelectedInfo(null);
        log('DEBUG2', 'Unselected:', this.currentHovered.name || this.currentHovered.id);
      } else {
        if (this.currentClicked) {
          this.setHighlight(this.currentClicked, 'restore');
        }

        this.currentClicked = this.currentHovered;
        this.setHighlight(this.currentClicked, 'click');
        log('DEBUG2', 'Selected:', this.currentClicked.name || this.currentClicked.id);
      }

      if (typeof this.onClickCallback === 'function') {
        this.onClickCallback(this.currentClicked);
      }
    }
  }

  clearHold() {
    clearTimeout(this.holdTimeout);
  }

  setHighlight(object, type) {
    if (!object || !object.material || !object.material.emissive) return;

    if (type === 'hover') {
      object.material.emissive.setHex(0x999900);
    } else if (type === 'click') {
      object.material.emissive.setHex(0x009900);
      this.updateSelectedInfo(object);
    } else if (type === 'restore') {
      object.material.emissive.setHex(0x000000);
    }
  }

  update() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      const firstIntersect = intersects[0].object;

      if (this.currentHovered !== firstIntersect) {
        if (this.currentHovered && this.currentHovered !== this.currentClicked) {
          this.setHighlight(this.currentHovered, 'restore');
        }

        this.currentHovered = firstIntersect;

        if (this.currentHovered !== this.currentClicked) {
          this.setHighlight(this.currentHovered, 'hover');
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
            if (typeof this.playAnimationPanel === 'function') {
              this.playAnimationPanel(src);
            } else {
              window.open(src, '_blank');
            }
          });
          this.selectedVideoLinks.appendChild(btn);
        }

        if (type === 'content' && path) {
          log('DEBUG', 'Content path:', path);
          btn.addEventListener('click', () => {
            if (typeof this.showContentCallback === 'function') {
              loadHTMLContent(path).then((html) => {
                html = html.replace(/%IMAGE_BASE%/g, IMAGE_BASE_URL);
                this.showContentCallback(html);
              });
            }
          });
          this.selectedVideoLinks.appendChild(btn);
        }
      });
    }

    if (this.selectedVideoLinks.children.length > 0) {
      this.selectedVideoLinks.style.display = 'flex';
      this.selectedPopup.appendChild(this.selectedVideoLinks);
    } else {
      this.selectedVideoLinks.style.display = 'none';
    }

    this.selectedPopup.style.display = 'block';
  }

  isModelObject(object) {
    if (!object) return false;
    const name = object.name || object.id;
    return !!this.metadata?.specific_videos?.[name];
  }
}
