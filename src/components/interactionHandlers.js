import * as THREE from 'three';

export function setupInteractions(scene, camera, canvasElement) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hoveredMesh = null;
  let selectedMesh = null;

  const labelEl = document.getElementById('selectedLabel');
  const popup = document.getElementById('popup');
  const videoLinks = document.getElementById('videoLinks');

  const muscleInfo = {
    Supraspinatus: 'The supraspinatus helps shoulder abduction.',
    Infraspinatus: 'The infraspinatus externally rotates the shoulder.',
    Subscapularis: 'The subscapularis internally rotates the arm.',
    TeresMinor: 'The teres minor assists with external rotation.',
    Humerus: 'The humerus connects the shoulder to elbow.',
    Clavicle: 'The clavicle connects arm to body and stabilizes shoulder.',
    Scapula: 'The scapula stabilizes and moves the shoulder.',
  };

  const videoData = {
    Supraspinatus: { normal: '/videos/demo.mp4', rehab: '/videos/demo.mp4' },
    Infraspinatus: { normal: '/videos/demo.mp4', rehab: '/videos/demo.mp4' },
    Subscapularis: { normal: '/videos/demo.mp4', rehab: '/videos/demo.mp4' },
    TeresMinor: { normal: '/videos/demo.mp4', rehab: '/videos/demo.mp4' },
    Humerus: { normal: '/videos/demo.mp4', rehab: '/videos/demo.mp4' },
  };
  function moveHandler(event) {
    const rect = canvasElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const hovered = intersects[0].object;

      // ✨ Ignore hover color change if it's the selected mesh
      if (hovered !== hoveredMesh && hovered !== selectedMesh) {
        if (
          hoveredMesh &&
          hoveredMesh.originalColor &&
          hoveredMesh.material &&
          hoveredMesh !== selectedMesh
        ) {
          hoveredMesh.material.color.set(hoveredMesh.originalColor);
        }

        hoveredMesh = hovered;

        if (!hovered.originalColor && hovered.material && hovered.material.color) {
          hovered.originalColor = hovered.material.color.clone();
        }

        if (hovered.material && hovered !== selectedMesh) {
          hovered.material.color.set(0xffff00); // Yellow for hover
        }
      }
    } else {
      // ✨ Only reset color if the previous hoveredMesh is not selectedMesh
      if (
        hoveredMesh &&
        hoveredMesh !== selectedMesh &&
        hoveredMesh.originalColor &&
        hoveredMesh.material
      ) {
        hoveredMesh.material.color.set(hoveredMesh.originalColor);
      }
      hoveredMesh = null;
    }
  }

  function downHandler(event) {
    const rect = canvasElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
      const clicked = intersects[0].object;
      const name = clicked.name || 'Unnamed';

      if (clicked === selectedMesh) {
        if (selectedMesh.originalColor) selectedMesh.material.color.set(selectedMesh.originalColor);
        selectedMesh = null;
        labelEl.textContent = `🧠 Selected: None`;
        popup.style.display = 'none';
        videoLinks.style.display = 'none';
        return;
      }

      if (selectedMesh && selectedMesh.originalColor) {
        selectedMesh.material.color.set(selectedMesh.originalColor);
      }

      selectedMesh = clicked;
      if (!clicked.originalColor) clicked.originalColor = clicked.material.color.clone();
      clicked.material.color.set(0x00ff00);

      labelEl.textContent = `🧠 Selected: ${name}`;
      popup.innerHTML = muscleInfo[name] || 'No info available.';
      popup.appendChild(videoLinks);
      popup.style.display = 'block';

      if (videoData[name]) {
        videoLinks.innerHTML = `
          <a href="${videoData[name].normal}" class="video-box" target="_blank">🎥 Normal Movement</a>
          <a href="${videoData[name].rehab}" class="video-box" target="_blank">🛠️ Rehab Exercises</a>
        `;
        videoLinks.style.display = 'flex';
      } else {
        videoLinks.style.display = 'none';
      }
    } else {
      if (selectedMesh && selectedMesh.originalColor) {
        selectedMesh.material.color.set(selectedMesh.originalColor);
      }
      selectedMesh = null;
      labelEl.textContent = `🧠 Selected: None`;
      popup.style.display = 'none';
      videoLinks.style.display = 'none';
    }
  }

  canvasElement.addEventListener('pointermove', moveHandler);
  canvasElement.addEventListener('pointerdown', downHandler);
}
