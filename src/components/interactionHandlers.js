import * as THREE from 'three';
import _ from 'lodash';
import { log } from './utils.js';

export class InteractionHandler {
  constructor(scene, camera, canvasElement, metadata, onClickCallback) {
    this.scene = scene;
    this.camera = camera;
    this.canvas = canvasElement;
    this.metadata = metadata; // <-- NEW

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.currentHovered = null;
    this.currentClicked = null;
    this.selectedLabel = document.getElementById('selectedLabel');
    this.selectedPopup = document.getElementById('popup');
    this.selectedVideoLinks = document.getElementById('videoLinks');

    this.onClickCallback = onClickCallback;

    this.holdTimeout = null;
    this.isLongPress = false;

    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
    window.addEventListener('pointercancel', this.clearHold.bind(this));
    window.addEventListener('pointerleave', this.clearHold.bind(this));
  }

  onPointerMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  onPointerDown(event) {
    this.isLongPress = false;
    this.holdTimeout = setTimeout(() => {
      this.isLongPress = true;
      log('DEBUG', 'Long press detected');
    }, 500);
  }

  onPointerUp(event) {
    clearTimeout(this.holdTimeout);

    if (!this.isLongPress && this.currentHovered) {
      log('DEBUG', 'Click detected on', this.currentHovered.name || this.currentHovered.id);

      if (this.currentClicked === this.currentHovered) {
        this.setHighlight(this.currentClicked, 'restore');
        this.currentClicked = null;
        log('DEBUG2', 'Unselected:', this.currentHovered.name || this.currentHovered.id);
        this.updateSelectedInfo(null);
      } else {
        if (this.currentClicked) {
          this.setHighlight(this.currentClicked, 'restore');
        }

        this.currentClicked = this.currentHovered;
        this.setHighlight(this.currentClicked, 'click');
        log('DEBUG2', 'Selected:', this.currentClicked.name || this.currentClicked.id);
      }

      if (this.onClickCallback) {
        this.onClickCallback(this.currentClicked);
      }
    }
  }

  clearHold() {
    clearTimeout(this.holdTimeout);
  }

  setHighlight(object, type) {
    if (!object || !object.material) return;

    if (!object.material.emissive) {
      console.warn(`Object ${object.name || object.id} has no emissive material.`);
      return;
    }

    if (type === 'hover') {
      object.material.emissive.setHex(0x999900);
      log('DEBUG2', `Highlight hover on ${object.name || object.id}`);
    } else if (type === 'click') {
      object.material.emissive.setHex(0x009900);
      log('DEBUG2', `Highlight click on ${object.name || object.id}`);
      this.updateSelectedInfo(object);
    } else if (type === 'restore') {
      object.material.emissive.setHex(0x000000);
      log('DEBUG2', `Restore original color on ${object.name || object.id}`);
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
    if (object) {
      const selectedName = object.name || object.id || 'Unnamed';
      const formattedName = _.startCase(selectedName);

      const infoText = this.metadata?.muscle_info[selectedName] || 'No info available.';
      this.selectedPopup.innerHTML = `<p>${infoText}</p>`;
      log('DEBUG2', `Displayed info text: ${infoText}`);

      const videoData = this.metadata?.specific_videos;
      if (videoData && videoData[selectedName]) {
        this.selectedVideoLinks.innerHTML = `
          <a href="${videoData[selectedName].normal}" class="video-box" target="_blank">🎥 Normal Movement</a>
          <a href="${videoData[selectedName].rehab}" class="video-box" target="_blank">🛠️ Rehab Exercises</a>
        `;
        this.selectedVideoLinks.style.display = 'flex';
        log('DEBUG2', `Added specific video links for: ${selectedName}`);
      } else {
        this.selectedVideoLinks.style.display = 'none';
        log('DEBUG2', `No specific videos available for: ${selectedName}`);
      }

      this.selectedPopup.appendChild(this.selectedVideoLinks);
      this.selectedPopup.style.display = 'block';
      this.selectedLabel.textContent = `🧠 Selected: ${formattedName}`;
    } else {
      log('DEBUG', 'Clearing selected info (no object or unselected).');
      this.selectedLabel.textContent = '🧠 Selected: None';
      this.selectedVideoLinks.style.display = 'none';
      this.selectedPopup.style.display = 'none';
    }
  }
}
