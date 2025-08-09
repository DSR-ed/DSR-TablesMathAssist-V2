// js/config.js
// Configuration des profils et constantes globales (export ES module)

export const profileConfigs = {
  CM1: {
    tables: [1,2,3,4,5,6,7,8,9,10],
    colors: { primary: '#FF6B35', secondary: '#FFD23F', accent: '#06D6A0' },
    fontSize: '18px',
    animations: true,
    sounds: true,
    animationStyle: 'bounce',
    soundProfile: 'cheerful',
    confetti: true,
    advancedStats: false,
    exportFeatures: false,
    classMode: false
  },
  CM2: {
    tables: [1,2,3,4,5,6,7,8,9,10,11,12],
    colors: { primary: '#4ECDC4', secondary: '#45B7D1', accent: '#FECA57' },
    fontSize: '16px',
    animations: true,
    sounds: true,
    animationStyle: 'scale',
    soundProfile: 'encouraging',
    confetti: true,
    advancedStats: false,
    exportFeatures: false,
    classMode: false
  },
  "6EME": {
    tables: [1,2,3,4,5,6,7,8,9,10,11,12],
    colors: { primary: '#6C5CE7', secondary: '#74B9FF', accent: '#00B894' },
    fontSize: '15px',
    animations: true,
    sounds: true,
    animationStyle: 'glow',
    soundProfile: 'modern',
    confetti: true,
    advancedStats: false,
    exportFeatures: false,
    classMode: false
  },
  "5EME": {
    tables: [1,2,3,4,5,6,7,8,9,10,11,12],
    colors: { primary: '#2D3436', secondary: '#636E72', accent: '#00CEC9' },
    fontSize: '14px',
    animations: true,
    sounds: false,
    animationStyle: 'subtle',
    soundProfile: 'minimal',
    confetti: false,
    advancedStats: false,
    exportFeatures: false,
    classMode: false
  },
  ADULTE: {
    tables: [1,2,3,4,5,6,7,8,9,10,11,12],
    colors: { primary: '#2F3640', secondary: '#57606F', accent: '#3742FA' },
    fontSize: '13px',
    animations: false,
    sounds: false,
    animationStyle: 'none',
    soundProfile: 'none',
    confetti: false,
    advancedStats: true,
    exportFeatures: true,
    classMode: true
  }
};

export const STORAGE_KEYS = {
  PROFILE: 'tma_profile',
  SOUNDS: 'tma_sounds',
  ANIMATIONS: 'tma_animations',
  THEME: 'tma_theme',
  PREFS: 'tma_prefs_v2',
  ADV_STATS: 'tma_advanced_stats',
  CLASS_CODE: 'tma_class_code'
};

export const APP_CONFIG = {
  defaultProfile: 'CM2',
  defaultTimeLimit: 1,      // minutes
  defaultQuestionCount: 10
};
