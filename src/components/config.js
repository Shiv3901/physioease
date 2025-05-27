const isBrowser = typeof window !== 'undefined';
const isDev = isBrowser && window.location.hostname === 'localhost';

const VIDEO_BASE_URL = isDev
  ? './videos/'
  : 'https://re-cors-proxy.physioeaseau.workers.dev/videos/';

const MODEL_BASE_URL = isDev
  ? './models/'
  : 'https://re-cors-proxy.physioeaseau.workers.dev/models/';

const CONTENT_BASE_URL = isDev
  ? './content/'
  : 'https://re-cors-proxy.physioeaseau.workers.dev/content/';

const IMAGE_BASE_URL = isDev
  ? './images/'
  : 'https://re-cors-proxy.physioeaseau.workers.dev/images/';

export const video = (filename) => VIDEO_BASE_URL + filename;
export const model = (filename) => MODEL_BASE_URL + filename;
export const content = (filename) => CONTENT_BASE_URL + filename;
export const image = (filename) => IMAGE_BASE_URL + filename;

export const MOBILE_BREAKPOINT = 980;
export const DEBUG_MODE = true;
export const LOG_LEVEL = 'DEBUG2'; // Choose: 'INFO', 'DEBUG', 'DEBUG2'

export const ABOUTUS_METADATA = {
  animations: {
    video1: {
      src: video('lowerback_model.mp4'),
      alt: 'Lower Back Model',
      caption: 'Our Lower Back Model',
    },
    video2: {
      src: video('ankle_model.mp4'),
      alt: 'Ankle Model',
      caption: 'Our Ankle Model',
    },
  },
  videos: {
    demo1: {
      src: video('ankle_dorsiflexion.mp4'),
      title: 'Ankle Dorsiflexion',
      description:
        "Dorsiflexion is the movement of the foot upwards towards the shin. It's important for walking, running, and climbing stairs.",
    },
    demo2: {
      src: video('ankle_plantarflexion.mp4'),
      title: 'Ankle Plantarflexion',
      description:
        "Plantarflexion is the movement of the foot downwards away from the shin. It's crucial for pushing off during walking and running.",
    },
  },
  howtouse: {
    step1: {
      img: image('first.png'),
      title: 'Explain Instantly',
      description: 'Use 3D animations to convey complex concepts in seconds.',
    },
    step2: {
      img: image('second.png'),
      title: 'Deep Understanding',
      description: 'Help patients truly grasp their injury and treatment.',
    },
    step3: {
      img: image('third.png'),
      title: 'Confidently Share',
      description: 'Patients explain their recovery clearly to family and friends.',
    },
    step4: {
      img: image('fourth.png'),
      title: 'AI Agent',
      description: 'Our upcoming AI agent will assist physios and clients by answering questions, offering injury insights, and guiding rehab planning in real time—so whenever clients face a problem, they’ll know to come straight back to your clinic.',
    },
    step5: {
      img: image('fifth.png'),
      title: 'Multilingual Support',
      description: 'Clients who speak different languages will soon receive videos and rehab instructions in their own language—making it easier to understand and share with family members.',
    },
  },
};

export const ROTATORCUFF_METADATA = {
  base_model: model('rotatorcuff-draco.glb'),
  enableAnimation: false,

  // === GENERAL VIDEO CATEGORIES (used for "More Videos" section) ===
  animations: {
    // Abduction: {
    //   title: '🦴 Ab/Adduction',
    //   src: video('rotatorcuff_ab_adduction.mp4'),
    // },
    Flexion: {
      title: '🦾 Flex',
      src: video('rotatorcuff_flex_extend.mp4'),
    },
    Extension: {
      title: '🦾 Extend',
      src: video('rotatorcuff_flex_extend.mp4'),
    },
    // Horizontal: {
    //   title: '↔️ Horiz Ab/Ad',
    //   src: video('rotatorcuff_horizontal_ab_ad.mp4'),
    // },
    // Hanging: {
    //   title: '🔁 Hanging Arm',
    //   src: video('rotatorcuff_rotation_down.mp4'),
    // },
    // Raised: {
    //   title: '🔄 Raised Arm',
    //   src: video('rotatorcuff_rotation_up.mp4'),
    // },
    // extended: {
    //   title: '🧠 Extended Version',
    //   src: video('rotatorcuff-extended.mp4'),
    // },
    // rehab: {
    //   title: '🛠️ Rehab Exercises',
    //   src: video('rotatorcuff-rehab.mp4'),
    // },
  },

  // === STRUCTURE-SPECIFIC INFO (used for label popup + video buttons) ===
  specific_videos: {
    Supraspinatus: {
      info: 'The supraspinatus helps shoulder abduction.',
    },
    Infraspinatus: {
      info: 'The infraspinatus externally rotates the shoulder.',
    },
    Subscapularis: {
      info: 'The subscapularis internally rotates the arm.',
    },
    TeresMinor: {
      info: 'The teres minor assists with external rotation.',
    },
    Humerus: {
      info: 'The humerus connects the shoulder to elbow.',
    },
    Clavicle: {
      info: 'The clavicle connects arm to body and stabilizes shoulder.',
      more: {
        title: '📘 Learn More',
        type: 'content',
        path: content('clavicle_content.html'),
      },
    },
    Scapula: {
      info: 'The scapula stabilizes and moves the shoulder.',
      more: {
        title: '📘 Learn More',
        type: 'content',
        path: content('scapula_content.html'),
      },
    },
  },
};

export const ANKLE_METADATA = {
  base_model: model('ankle-draco.glb'),
  animations: {
    Dorsiflexion: { title: '⬆️ Dorsiflexion', src: video('ankle_dorsiflexion.mp4') },
    Plantarflexion: { title: '⬇️ Plantarflexion', src: video('ankle_plantarflexion.mp4') },
    Eversion: { title: '↔️ Eversion', src: video('ankle_eversion.mp4') },
    Inversion: { title: '↕️ Inversion', src: video('ankle_inversion.mp4') },
    // extended: { title: '🧠 Extended Version', src: video('ankle-extended.mp4') },
    // rehab: { title: '🛠️ Rehab', src: video('ankle-rehab.mp4') },
  },
  specific_videos: {
    TibialisAnterior: {
      info: 'The tibialis anterior dorsiflexes the foot.',
    },
    Gastrocnemius: {
      info: 'The gastrocnemius plantarflexes the foot.',
    },
    Soleus: {
      info: 'The soleus assists with plantarflexion.',
    },
    PeroneusLongus: {
      info: 'The peroneus longus everts the foot.',
    },
    AnteriorTalofibularLigament: {
      info: 'Connects the fibula to the talus; prevents excessive forward displacement of the foot and is commonly injured in ankle sprains.',
    },
    AnteriorTibiofibularLigament: {
      info: 'Stabilizes the distal tibiofibular joint, maintaining the integrity of the ankle mortise.',
    },
    CalcaneofibularLigament: {
      info: 'Connects the fibula to the calcaneus; resists excessive inversion of the foot.',
    },
    Calcaneus: {
      info: 'The heel bone; supports body weight and serves as the attachment point for the Achilles tendon.',
    },
    Fibula: {
      info: 'The slender lateral bone of the lower leg; contributes to ankle stability.',
    },
    Navicular: {
      info: 'A boat-shaped bone on the medial foot that links the talus and cuneiforms.',
    },
    PosteriorTalofibularLigament: {
      info: 'Connects the fibula to the talus at the rear; prevents backward ankle displacement.',
    },
    PosteriorTibiofibularLigament: {
      info: 'Supports the connection between the tibia and fibula posteriorly.',
    },
    PosteriorTibiofibularLigament_001: {
      info: 'Additional posterior fibers stabilizing the tibiofibular joint.',
    },
    RightCuboid: {
      info: 'Lateral midfoot bone that links heel and forefoot; maintains foot arch.',
    },
    Talus: {
      info: 'Ankle bone that transmits weight from the tibia to the foot.',
    },
    Tibia: {
      info: 'Main weight-bearing bone of the lower leg; forms the shin.',
    },
    TarsalBones: {
      info: 'A group of seven bones in the foot that form the ankle and part of the arch, providing stability and support for walking and weight-bearing.',
    },
    Toes: {
      info: 'The distal part of the foot composed of phalanges, essential for balance, walking, and push-off during movement.',
    },
    InterosseousMembrane: {
      info: 'A fibrous sheet connecting the tibia and fibula, providing stability and support to the lower leg.',
    },
    AnteriorTibiotalar: {
      info: 'A deep component of the deltoid ligament that connects the tibia to the talus anteriorly, helping resist anterior and lateral displacement of the talus.',
    },
    AnteriorTibiotalarLigament: {
      info: 'A band within the deltoid ligament that anchors the tibia to the front of the talus, aiding in medial ankle stability during dorsiflexion.',
    },
    TibionavicularLigament: {
      info: 'A superficial part of the deltoid ligament that connects the tibia to the navicular bone, limiting abduction and external rotation of the foot.',
    },
    TibiocalcanealLigament: {
      info: 'A vertical band of the deltoid ligament extending from the tibia to the calcaneus, preventing excessive eversion of the hindfoot.',
    },
    PosteriorTibiotalarLigament: {
      info: 'A deep posterior segment of the deltoid ligament attaching the tibia to the back of the talus; stabilizes the ankle against backward and outward movement.',
    },
    CalcaneonavicularLigament: {
      info: 'Also known as the spring ligament, it supports the head of the talus and maintains the medial longitudinal arch of the foot.',
    },
  },
};

export const LOWERBACK_METADATA = {
  base_model: model('lowerback-draco.glb'),
  animations: {
    Flexion: { title: '🦾 Flexion', src: video('lowerback_flexion.mp4') },
    Extension: { title: '🦾 Extension', src: video('lowerback_extension.mp4') },
    LeftLateralFlexion: {
      title: '↔️ Left Lateral Flexion',
      src: video('lowerback_left_lateral_flexion.mp4'),
    },
    RightLateralFlexion: {
      title: '↔️ Right Lateral Flexion',
      src: video('lowerback_right_lateral_flexion.mp4'),
    },
  },
  specific_videos: {
    UpperBody: {
      info: 'The upper body includes all structures above the sacrum, encompassing the spine (above sacrum), ribcage, shoulders, arms, hands, neck, and head.',
    },
    LowerBody: {
      info: 'The lower body includes the sacrum and all structures below it, comprising the pelvis, hips, legs, knees, ankles, and feet.',
    },
    LeftQuadratusLumborum: {
      info: 'The left quadratus lumborum stabilizes the spine and assists in lateral flexion.',
    },
    RightQuadratusLumborum: {
      info: 'The right quadratus lumborum stabilizes the spine and assists in lateral flexion.',
    },
  },
};

export const METADATA_MAP = {
  ankle: ANKLE_METADATA,
  lowerback: LOWERBACK_METADATA,
  rotatorcuff: ROTATORCUFF_METADATA,
  // Add other models here...
};
