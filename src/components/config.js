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
    { title: '📖 Introduction', src: video('rotatorcuff-introduction.mp4') },
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
  },
  base_videos: [
    { title: '📖 Introduction', src: video('ankle-introduction.mp4') },
    { title: '🧠 Extended Version', src: video('ankle-extended.mp4') },
    { title: '🛠️ Rehab', src: video('ankle-rehab.mp4') },
  ],
  base_model: model('ankle-compressed.glb'),
  muscle_info: {
    TibialisAnterior: 'The tibialis anterior dorsiflexes the foot.',
    Gastrocnemius: 'The gastrocnemius plantarflexes the foot.',
    Soleus: 'The soleus assists with plantarflexion.',
    PeroneusLongus: 'The peroneus longus everts the foot.',
  },
};
