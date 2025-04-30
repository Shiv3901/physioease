const isBrowser = typeof window !== 'undefined';
const isDev = isBrowser && window.location.hostname === 'localhost';

const VIDEO_BASE_URL = isDev
  ? './videos/'
  : 'https://re-cors-proxy.physioeaseau.workers.dev/videos/';

const MODEL_BASE_URL = isDev
  ? './models/'
  : 'https://re-cors-proxy.physioeaseau.workers.dev/models/';

const video = (filename) => VIDEO_BASE_URL + filename;
const model = (filename) => MODEL_BASE_URL + filename;

export const MOBILE_BREAKPOINT = 980;
export const DEBUG_MODE = true;
export const LOG_LEVEL = 'DEBUG2'; // Choose: 'INFO', 'DEBUG', 'DEBUG2'

export const ROTATORCUFF_METADATA = {
  specific_videos: {
    Supraspinatus: { normal: video('rotatorcuff_demo.mp4'), rehab: video('rotatorcuff_demo.mp4') },
    Infraspinatus: { normal: video('rotatorcuff_demo.mp4'), rehab: video('rotatorcuff_demo.mp4') },
    Subscapularis: { normal: video('rotatorcuff_demo.mp4'), rehab: video('rotatorcuff_demo.mp4') },
    TeresMinor: { normal: video('rotatorcuff_demo.mp4'), rehab: video('rotatorcuff_demo.mp4') },
    Humerus: { normal: video('rotatorcuff_demo.mp4'), rehab: video('rotatorcuff_demo.mp4') },
  },
  base_videos: [
    { title: '📖 Introduction', src: video('rotatorcuff_demo.mp4') },
    { title: '🧠 Extended Version', src: video('rotatorcuff-extended.mp4') },
    { title: '🛠️ Rehab', src: video('rotatorcuff-rehab.mp4') },
  ],
  base_model: model('rotatorcuff-compressed.glb'),
  muscle_info: {
    Supraspinatus: 'The supraspinatus helps shoulder abduction.',
    Infraspinatus: 'The infraspinatus externally rotates the shoulder.',
    Subscapularis: 'The subscapularis internally rotates the arm.',
    TeresMinor: 'The teres minor assists with external rotation.',
    Humerus: 'The humerus connects the shoulder to elbow.',
    Clavicle: 'The clavicle connects arm to body and stabilizes shoulder.',
    Scapula: 'The scapula stabilizes and moves the shoulder.',
  },
};

export const ANKLE_METADATA = {
  specific_videos: {
    TibialisAnterior: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    Gastrocnemius: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    Soleus: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    PeroneusLongus: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    AnteriorTalofibularLigament: {
      normal: video('ankle_demo.mp4'),
      rehab: video('ankle_demo.mp4'),
    },
    AnteriorTibiofibularLigament: {
      normal: video('ankle_demo.mp4'),
      rehab: video('ankle_demo.mp4'),
    },
    CalcaneofibularLigament: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    Calcaneus: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    DeltoidLigament: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    DeltoidLigament001: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    DeltoidLigament002: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    DeltoidLigament003: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    DistalPhalanxOfBigToe: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    DistalPhalanxOfFifthToe: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    DistalPhalanxOfFourthToe: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    DistalPhalanxOfSecondToe: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    DistalPhalanxOfThirdToe: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    Fibula: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    FifthMetatarsal: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    FirstMetatarsal: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    FourthMetatarsal: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    IntermediateCuneiform: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    InterosseousMembraneOfLeg: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    LateralCuneiform: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    MedialCuneiform: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    MiddlePhalanxOfFourthToe: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    MiddlePhalanxOfSecondToe: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    MiddlePhalanxOfThirdToe: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    Navicular: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    PosteriorTalofibularLigament: {
      normal: video('ankle_demo.mp4'),
      rehab: video('ankle_demo.mp4'),
    },
    PosteriorTibiofibularLigament: {
      normal: video('ankle_demo.mp4'),
      rehab: video('ankle_demo.mp4'),
    },
    PosteriorTibiofibularLigament_001: {
      normal: video('ankle_demo.mp4'),
      rehab: video('ankle_demo.mp4'),
    },
    ProximalPhalanxOfBigToe: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    ProximalPhalanxOfFifthToe: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    ProximalPhalanxOfFourthToe: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    ProximalPhalanxOfSecondToe: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    ProximalPhalanxOfThirdToe: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    RightCuboid: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    SecondMetatarsal: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    Talus: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    ThirdMetatarsal: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
    Tibia: { normal: video('ankle_demo.mp4'), rehab: video('ankle_demo.mp4') },
  },
  base_videos: [
    { title: '📖 Introduction', src: video('ankle_demo.mp4') },
    { title: '🧠 Extended Version', src: video('ankle-extended.mp4') },
    { title: '🛠️ Rehab', src: video('ankle-rehab.mp4') },
  ],
  base_model: model('ankle-compressed.glb'),
  muscle_info: {
    TibialisAnterior: 'The tibialis anterior dorsiflexes the foot.',
    Gastrocnemius: 'The gastrocnemius plantarflexes the foot.',
    Soleus: 'The soleus assists with plantarflexion.',
    PeroneusLongus: 'The peroneus longus everts the foot.',
    AnteriorTalofibularLigament:
      'Connects the fibula to the talus; prevents excessive forward displacement of the foot and is commonly injured in ankle sprains.',
    AnteriorTibiofibularLigament:
      'Stabilizes the distal tibiofibular joint, maintaining the integrity of the ankle mortise.',
    CalcaneofibularLigament:
      'Connects the fibula to the calcaneus; resists excessive inversion of the foot.',
    Calcaneus:
      'The heel bone; supports body weight and serves as the attachment point for the Achilles tendon.',
    DeltoidLigament:
      'A strong, triangular ligament on the medial side of the ankle; prevents excessive eversion of the foot.',
    DeltoidLigament001:
      'Part of the deltoid ligament complex; contributes to medial ankle stability.',
    DeltoidLigament002:
      'Part of the deltoid ligament complex; contributes to medial ankle stability.',
    DeltoidLigament003:
      'Part of the deltoid ligament complex; contributes to medial ankle stability.',
    DistalPhalanxOfBigToe:
      'The terminal bone of the big toe; essential for balance and propulsion during walking.',
    DistalPhalanxOfFifthToe:
      'The terminal bone of the little toe; aids in balance and lateral foot stability.',
    DistalPhalanxOfFourthToe: 'The terminal bone of the fourth toe; contributes to foot balance.',
    DistalPhalanxOfSecondToe:
      'The terminal bone of the second toe; assists in foot balance and propulsion.',
    DistalPhalanxOfThirdToe: 'The terminal bone of the third toe; plays a role in foot balance.',
    Fibula:
      'The lateral bone of the lower leg; provides lateral stability to the ankle and serves as an attachment point for muscles.',
    FifthMetatarsal: 'Connects the midfoot to the fifth toe; important for lateral foot stability.',
    FirstMetatarsal:
      'Connects the midfoot to the big toe; crucial for weight-bearing and propulsion.',
    FourthMetatarsal: 'Connects the midfoot to the fourth toe; aids in foot stability.',
    IntermediateCuneiform:
      'A tarsal bone that articulates with the second metatarsal; helps maintain the transverse arch of the foot.',
    InterosseousMembraneOfLeg:
      'A fibrous sheet connecting the tibia and fibula; stabilizes the bones and separates muscle compartments.',
    LateralCuneiform:
      'A tarsal bone that articulates with the third metatarsal; supports the transverse arch of the foot.',
    MedialCuneiform:
      'A tarsal bone that articulates with the first metatarsal; plays a role in maintaining the medial longitudinal arch.',
    MiddlePhalanxOfFourthToe:
      'The intermediate bone of the fourth toe; contributes to toe flexibility.',
    MiddlePhalanxOfSecondToe: 'The intermediate bone of the second toe; aids in toe movement.',
    MiddlePhalanxOfThirdToe: 'The intermediate bone of the third toe; facilitates toe flexibility.',
    Navicular:
      'A tarsal bone located medially in the foot; serves as a keystone for the medial arch and articulates with the talus and cuneiforms.',
    PosteriorTalofibularLigament:
      'Connects the fibula to the talus posteriorly; prevents excessive backward displacement of the foot.',
    PosteriorTibiofibularLigament:
      'Stabilizes the distal tibiofibular joint; maintains the integrity of the ankle mortise.',
    PosteriorTibiofibularLigament_001:
      'Additional fibers of the posterior tibiofibular ligament; contribute to ankle stability.',
    ProximalPhalanxOfBigToe:
      'The first bone of the big toe; crucial for push-off in gait and bearing weight during toe-off phase.',
    ProximalPhalanxOfFifthToe:
      'The first bone of the little toe; supports lateral balance and assists in gait.',
    ProximalPhalanxOfFourthToe:
      'The first bone of the fourth toe; aids in stability and propulsion during walking.',
    ProximalPhalanxOfSecondToe:
      'The first bone of the second toe; helps in balance and forward propulsion.',
    ProximalPhalanxOfThirdToe:
      'The first bone of the third toe; contributes to weight distribution during motion.',
    RightCuboid:
      'A lateral tarsal bone that links the foot and ankle; stabilizes the lateral column of the foot and supports the arch.',
    SecondMetatarsal:
      'Connects the second toe to the midfoot; plays a central role in maintaining the transverse arch.',
    Talus:
      'The bone that sits between the tibia and calcaneus; transmits weight and motion across the ankle joint.',
    ThirdMetatarsal:
      'Connects the third toe to the midfoot; involved in foot flexibility and stability.',
    Tibia:
      'The larger, medial bone of the lower leg; bears most of the body’s weight and forms the primary structure of the shin.',
  },
};
