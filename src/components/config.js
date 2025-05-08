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

export const IMAGE_BASE_URL = isDev
  ? './images/'
  : 'https://re-cors-proxy.physioeaseau.workers.dev/images/';

const video = (filename) => VIDEO_BASE_URL + filename;
const model = (filename) => MODEL_BASE_URL + filename;
const content = (filename) => CONTENT_BASE_URL + filename;
const image = (filename) => IMAGE_BASE_URL + filename;

export const MOBILE_BREAKPOINT = 980;
export const DEBUG_MODE = true;
export const LOG_LEVEL = 'DEBUG2'; // Choose: 'INFO', 'DEBUG', 'DEBUG2'

export const ROTATORCUFF_METADATA = {
  base_model: model('rotatorcuff-compressed.glb'),

  // === GENERAL VIDEO CATEGORIES (used for "More Videos" section) ===
  base_videos: {
    intro: {
      title: '📖 Introduction',
      src: video('rotatorcuff_demo.mp4'),
    },
    movements: {
      title: '🏃 Movements',
      videos: {
        abduction: {
          title: '🦴 Ab/Adduction',
          src: video('rotatorcuff_ab_adduction.mp4'),
        },
        flexion: {
          title: '🦾 Flex/Extend',
          src: video('rotatorcuff_flex_extend.mp4'),
        },
        horizontal: {
          title: '↔️ Horiz Ab/Ad',
          src: video('rotatorcuff_horizontal_ab_ad.mp4'),
        },
        hanging: {
          title: '🔁 Hanging Arm',
          src: video('rotatorcuff_rotation_down.mp4'),
        },
        raised: {
          title: '🔄 Raised Arm',
          src: video('rotatorcuff_rotation_up.mp4'),
        },
      },
    },
    extended: {
      title: '🧠 Extended Version',
      src: video('rotatorcuff-extended.mp4'),
    },
    rehab: {
      title: '🛠️ Rehab Exercises',
      src: video('rotatorcuff-rehab.mp4'),
    },
  },

  // === STRUCTURE-SPECIFIC INFO (used for label popup + video buttons) ===
  specific_videos: {
    Supraspinatus: {
      info: 'The supraspinatus helps shoulder abduction.',
      normal: {
        title: '👥 Normal Movement',
        type: 'video',
        src: video('supraspinatus_normal.mp4'),
      },
      rehab: {
        title: '🛠️ Rehab Exercises',
        type: 'video',
        src: video('supraspinatus_rehab.mp4'),
      },
    },
    Infraspinatus: {
      info: 'The infraspinatus externally rotates the shoulder.',
      normal: {
        title: '👥 Normal Movement',
        type: 'video',
        src: video('infraspinatus_normal.mp4'),
      },
    },
    Subscapularis: {
      info: 'The subscapularis internally rotates the arm.',
      normal: {
        title: '👥 Normal Movement',
        type: 'video',
        src: video('subscapularis_normal.mp4'),
      },
      rehab: {
        title: '🛠️ Rehab Exercises',
        type: 'video',
        src: video('subscapularis_rehab.mp4'),
      },
    },
    TeresMinor: {
      info: 'The teres minor assists with external rotation.',
      normal: {
        title: '👥 Normal Movement',
        type: 'video',
        src: video('teresminor_normal.mp4'),
      },
    },
    Humerus: {
      info: 'The humerus connects the shoulder to elbow.',
      normal: {
        title: '🦴 Bone Articulation',
        type: 'video',
        src: video('humerus_articulation.mp4'),
      },
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
  base_model: model('ankle-compressed.glb'),
  base_videos: {
    intro: { title: '📖 Introduction', src: video('ankle_demo.mp4') },
    movements: {
      title: '🏃 Movements',
      videos: {
        dorsiflexion: { title: '⬆️ Dorsiflexion', src: video('ankle_dorsiflexion.mp4') },
        plantarflexion: { title: '⬇️ Plantarflexion', src: video('ankle_plantarflexion.mp4') },
        eversion: { title: '↔️ Eversion', src: video('ankle_eversion.mp4') },
        inversion: { title: '↕️ Inversion', src: video('ankle_inversion.mp4') },
      },
    },
    extended: { title: '🧠 Extended Version', src: video('ankle-extended.mp4') },
    rehab: { title: '🛠️ Rehab', src: video('ankle-rehab.mp4') },
  },
  specific_videos: {
    TibialisAnterior: {
      info: 'The tibialis anterior dorsiflexes the foot.',
      normal: { title: '👥 Normal Movement', type: 'video', src: video('ankle_demo.mp4') },
    },
    Gastrocnemius: {
      info: 'The gastrocnemius plantarflexes the foot.',
      normal: { title: '👥 Normal Movement', type: 'video', src: video('ankle_demo.mp4') },
    },
    Soleus: {
      info: 'The soleus assists with plantarflexion.',
      normal: { title: '👥 Normal Movement', type: 'video', src: video('ankle_demo.mp4') },
    },
    PeroneusLongus: {
      info: 'The peroneus longus everts the foot.',
      normal: { title: '👥 Normal Movement', type: 'video', src: video('ankle_demo.mp4') },
    },
    AnteriorTalofibularLigament: {
      info: 'Connects the fibula to the talus; prevents excessive forward displacement of the foot and is commonly injured in ankle sprains.',
      rehab: { title: '🛠️ Rehab Exercises', type: 'video', src: video('ankle_demo.mp4') },
    },
    AnteriorTibiofibularLigament: {
      info: 'Stabilizes the distal tibiofibular joint, maintaining the integrity of the ankle mortise.',
    },
    CalcaneofibularLigament: {
      info: 'Connects the fibula to the calcaneus; resists excessive inversion of the foot.',
      rehab: { title: '🛠️ Rehab Exercises', type: 'video', src: video('ankle_demo.mp4') },
    },
    Calcaneus: {
      info: 'The heel bone; supports body weight and serves as the attachment point for the Achilles tendon.',
      diagnostic: {
        title: '🔬 Diagnostic View',
        type: 'video',
        src: video('ankle_diagnostic.mp4'),
      },
    },
    DeltoidLigament: {
      info: 'A strong, triangular ligament on the medial side of the ankle that prevents over-eversion.',
      rehab: { title: '🛠️ Rehab Exercises', type: 'video', src: video('ankle_demo.mp4') },
    },
    DeltoidLigament001: {
      info: 'Component of the deltoid ligament complex contributing to ankle joint stability.',
    },
    DeltoidLigament002: {
      info: 'Part of the deltoid ligament complex; provides medial ankle support.',
    },
    DeltoidLigament003: {
      info: 'Medial ligamentous fiber reinforcing the ankle joint capsule.',
    },
    DistalPhalanxOfBigToe: {
      info: 'The tip bone of the big toe; essential for balance and propulsion.',
    },
    DistalPhalanxOfFifthToe: {
      info: 'The terminal bone of the smallest toe; supports lateral balance.',
    },
    DistalPhalanxOfFourthToe: {
      info: 'The furthest bone of the fourth toe, aiding toe function.',
    },
    DistalPhalanxOfSecondToe: {
      info: 'The tip of the second toe, assisting in toe-off during gait.',
    },
    DistalPhalanxOfThirdToe: {
      info: 'The distal bone of the third toe, helping in foot push-off.',
    },
    Fibula: {
      info: 'The slender lateral bone of the lower leg; contributes to ankle stability.',
    },
    FifthMetatarsal: {
      info: 'The long bone of the foot connecting to the fifth toe; stabilizes lateral foot.',
    },
    FirstMetatarsal: {
      info: 'Primary metatarsal connected to the big toe; important for push-off.',
    },
    FourthMetatarsal: {
      info: 'Foot bone that connects to the fourth toe and supports midfoot structure.',
    },
    IntermediateCuneiform: {
      info: 'A wedge-shaped bone in the midfoot that articulates with the second metatarsal.',
    },
    InterosseousMembraneOfLeg: {
      info: 'A fibrous sheet connecting the tibia and fibula; separates muscle compartments.',
    },
    LateralCuneiform: {
      info: 'Midfoot bone that connects to the third metatarsal and helps form the arch.',
    },
    MedialCuneiform: {
      info: 'Articulates with the first metatarsal; supports the medial arch of the foot.',
    },
    MiddlePhalanxOfFourthToe: {
      info: 'Middle segment of the fourth toe, enabling flexibility.',
    },
    MiddlePhalanxOfSecondToe: {
      info: 'Intermediate bone of the second toe for joint mobility.',
    },
    MiddlePhalanxOfThirdToe: {
      info: 'The center bone of the third toe, aiding movement.',
    },
    Navicular: {
      info: 'A boat-shaped bone on the medial foot that links the talus and cuneiforms.',
      diagnostic: {
        title: '🔬 Diagnostic View',
        type: 'video',
        src: video('ankle_diagnostic.mp4'),
      },
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
    ProximalPhalanxOfBigToe: {
      info: 'Base bone of the big toe; critical for push-off during gait.',
    },
    ProximalPhalanxOfFifthToe: {
      info: 'First bone of the smallest toe; aids in foot balance.',
    },
    ProximalPhalanxOfFourthToe: {
      info: 'Initial bone of the fourth toe, contributes to walking mechanics.',
    },
    ProximalPhalanxOfSecondToe: {
      info: 'Beginning segment of the second toe, aids in balance and motion.',
    },
    ProximalPhalanxOfThirdToe: {
      info: 'First bone of the third toe; supports toe movement.',
    },
    RightCuboid: {
      info: 'Lateral midfoot bone that links heel and forefoot; maintains foot arch.',
    },
    SecondMetatarsal: {
      info: 'Central metatarsal that helps support the transverse arch of the foot.',
    },
    Talus: {
      info: 'Ankle bone that transmits weight from the tibia to the foot.',
      normal: { title: '👥 Normal Movement', type: 'video', src: video('ankle_demo.mp4') },
    },
    ThirdMetatarsal: {
      info: 'Midfoot bone connecting to the third toe; assists in load distribution.',
    },
    Tibia: {
      info: 'Main weight-bearing bone of the lower leg; forms the shin.',
      normal: { title: '👥 Normal Movement', type: 'video', src: video('ankle_demo.mp4') },
    },
  },
};
