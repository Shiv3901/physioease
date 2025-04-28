// TODO: refactor this file a bit, it's a bit messy
export const MOBILE_BREAKPOINT = 980;
export const DEBUG_MODE = true;

export const ROTATORCUFF_METADATA = {
  specific_videos: {
    Supraspinatus: { normal: '/videos/demo.mp4', rehab: '/videos/demo.mp4' },
    Infraspinatus: { normal: '/videos/demo.mp4', rehab: '/videos/demo.mp4' },
    Subscapularis: { normal: '/videos/demo.mp4', rehab: '/videos/demo.mp4' },
    TeresMinor: { normal: '/videos/demo.mp4', rehab: '/videos/demo.mp4' },
    Humerus: { normal: '/videos/demo.mp4', rehab: '/videos/demo.mp4' },
  },
  base_videos: [
    { title: '📖 Introduction', src: '/videos/rotatorcuff-introduction.mp4' },
    { title: '🧠 Extended Version', src: '/videos/rotatorcuff-extended.mp4' },
    { title: '🛠️ Rehab', src: '/videos/rotatorcuff-rehab.mp4' },
  ],
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
    TibialisAnterior: { normal: '/videos/demo.mp4', rehab: '/videos/demo.mp4' },
    Gastrocnemius: { normal: '/videos/demo.mp4', rehab: '/videos/demo.mp4' },
    Soleus: { normal: '/videos/demo.mp4', rehab: '/videos/demo.mp4' },
    PeroneusLongus: { normal: '/videos/demo.mp4', rehab: '/videos/demo.mp4' },
  },
  base_videos: [
    { title: '📖 Introduction', src: '/videos/ankle-introduction.mp4' },
    { title: '🧠 Extended Version', src: '/videos/ankle-extended.mp4' },
    { title: '🛠️ Rehab', src: '/videos/ankle-rehab.mp4' },
  ],
  muscle_info: {
    TibialisAnterior: 'The tibialis anterior dorsiflexes the foot.',
    Gastrocnemius: 'The gastrocnemius plantarflexes the foot.',
    Soleus: 'The soleus assists with plantarflexion.',
    PeroneusLongus: 'The peroneus longus everts the foot.',
  },
};

export const LOG_LEVEL = 'DEBUG2'; // Choose between: 'INFO', 'DEBUG', 'DEBUG2'
