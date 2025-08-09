// ========== CONFIGURATION PROFILS ADAPTATIFS AVANCÉS ==========
const profileConfigs = {
  CM1: {
    tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    colors: { primary: '#FF6B35', secondary: '#FFD23F', accent: '#06D6A0' },
    fontSize: '18px',
    animations: true,
    sounds: true,
    animationStyle: 'bounce',
    soundProfile: 'cheerful'
  },
  CM2: {
    tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    colors: { primary: '#4ECDC4', secondary: '#45B7D1', accent: '#FECA57' },
    fontSize: '16px',
    animations: true,
    sounds: true,
    animationStyle: 'scale',
    soundProfile: 'encouraging'
  },
  "6EME": {
    tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    colors: { primary: '#6C5CE7', secondary: '#74B9FF', accent: '#00B894' },
    fontSize: '15px',
    animations: true,
    sounds: true,
    animationStyle: 'glow',
    soundProfile: 'modern'
  },
  "5EME": {
    tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    colors: { primary: '#2D3436', secondary: '#636E72', accent: '#00CEC9' },
    fontSize: '14px',
    animations: true,
    sounds: false,
    animationStyle: 'subtle',
    soundProfile: 'minimal'
  },
  ADULTE: {
    tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    colors: { primary: '#2F3640', secondary: '#57606F', accent: '#3742FA' },
    fontSize: '13px',
    animations: false,
    sounds: false,
    animationStyle: 'none',
    soundProfile: 'none',
    advancedStats: true,
    exportFeatures: true,
    classMode: true
  }
};

// ========== SYSTÈME SONORE ADAPTATIF ==========
let audioContext = null;
let soundBank = {};

function initAudioSystem() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log('🧠 Système audio initialisé');
  } catch (error) {
    console.warn('⚠️ Audio non supporté:', error);
  }
}

function createBeepSound(frequency, duration, type = 'sine') {
  if (!audioContext) return;
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.type = type;
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
}

function playSuccessSound(profile) {
  if (!window.tmaSoundsEnabled) return;
  
  const config = profileConfigs[profile] || profileConfigs.CM2;
  
  switch (config.soundProfile) {
    case 'cheerful':
      // Série joyeuse pour CM1
      createBeepSound(523, 0.2, 'square'); // Do
      setTimeout(() => createBeepSound(659, 0.2, 'square'), 100); // Mi
      setTimeout(() => createBeepSound(784, 0.3, 'square'), 200); // Sol
      break;
      
    case 'encouraging':
      // Accord encourageant pour CM2
      createBeepSound(440, 0.3, 'sine'); // La
      setTimeout(() => createBeepSound(554, 0.3, 'sine'), 150); // Do#
      break;
      
    case 'modern':
      // Son moderne pour 6ème
      createBeepSound(330, 0.2, 'triangle');
      setTimeout(() => createBeepSound(440, 0.25, 'sawtooth'), 100);
      break;
      
    case 'minimal':
      // Son discret pour 5ème
      createBeepSound(440, 0.15, 'sine');
      break;
      
    default:
      // Pas de son pour Adulte
      break;
  }
}

function playErrorSound(profile) {
  if (!window.tmaSoundsEnabled) return;
  
  const config = profileConfigs[profile] || profileConfigs.CM2;
  
  if (config.soundProfile !== 'none' && config.soundProfile !== 'minimal') {
    createBeepSound(200, 0.3, 'sawtooth'); // Son d'erreur grave
  }
}

function playValidationSound(profile) {
  if (!window.tmaSoundsEnabled) return;
  
  const config = profileConfigs[profile] || profileConfigs.CM2;
  
  switch (config.soundProfile) {
    case 'cheerful':
    case 'encouraging':
      createBeepSound(800, 0.1, 'sine');
      break;
      
    case 'modern':
      createBeepSound(600, 0.1, 'triangle');
      break;
      
    default:
      break;
  }
}

// ========== STATISTIQUES AVANCÉES MODE ADULTE ==========
let performanceChart = null;
let evolutionChart = null;
let statsData = {
  sessions: [],
  tablePerformance: {},
  timeAnalysis: {},
  errorPatterns: []
};

function initAdvancedStats() {
  if (document.body.getAttribute('data-profile') === 'ADULTE') {
    initPerformanceChart();
    initEvolutionChart();
    loadStatsData();
  }
}

function initPerformanceChart() {
  const ctx = document.getElementById('performanceChart');
  if (!ctx) return;
  
  performanceChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6', 'Table 7', 'Table 8', 'Table 9', 'Table 10', 'Table 11', 'Table 12'],
      datasets: [{
        label: 'Taux de réussite (%)',
        data: [95, 88, 82, 79, 92, 75, 68, 71, 77, 98, 73, 69],
        backgroundColor: 'rgba(47, 54, 64, 0.1)',
        borderColor: '#2F3640',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

function initEvolutionChart() {
  const ctx = document.getElementById('evolutionChart');
  if (!ctx) return;
  
  evolutionChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Session 1', 'Session 2', 'Session 3', 'Session 4', 'Session 5', 'Session 6', 'Session 7'],
      datasets: [{
        label: 'Score moyen (%)',
        data: [65, 71, 78, 82, 88, 85, 91],
        borderColor: '#3742FA',
        backgroundColor: 'rgba(55, 66, 250, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

function updateStatsCharts(gameResults) {
  if (!performanceChart || !evolutionChart) return;
  
  // Mettre à jour les données des graphiques
  const tableStats = calculateTablePerformance(gameResults);
  performanceChart.data.datasets[0].data = tableStats;
  performanceChart.update();
  
  // Ajouter nouvelle session à l'évolution
  const sessionScore = Math.round(gameResults.score / gameResults.total * 100);
  evolutionChart.data.datasets[0].data.push(sessionScore);
  evolutionChart.data.labels.push(`Session ${evolutionChart.data.labels.length + 1}`);
  
  // Garder seulement les 10 dernières sessions
  if (evolutionChart.data.labels.length > 10) {
    evolutionChart.data.labels.shift();
    evolutionChart.data.datasets[0].data.shift();
  }
  
  evolutionChart.update();
}

function calculateTablePerformance(results) {
  const tableStats = new Array(12).fill(0);
  const tableCounts = new Array(12).fill(0);
  
  results.questions.forEach((q, index) => {
    const tableIndex = q.a - 1;
    tableCounts[tableIndex]++;
    
    if (results.answers[index] === q.result) {
      tableStats[tableIndex]++;
    }
  });
  
  return tableStats.map((correct, i) => 
    tableCounts[i] > 0 ? Math.round((correct / tableCounts[i]) * 100) : 0
  );
}

function saveStatsData() {
  localStorage.setItem('tma_advanced_stats', JSON.stringify(statsData));
}

function loadStatsData() {
  const saved = localStorage.getItem('tma_advanced_stats');
  if (saved) {
    statsData = JSON.parse(saved);
  }
}

// ========== EXPORT FONCTIONNALITÉS ==========
function exportToCSV() {
  if (!statsData.sessions.length) {
    alert('Aucune donnée à exporter');
    return;
  }
  
  let csv = 'Session,Date,Score,Bonnes Reponses,Mauvaises Reponses,Temps Total\n';
  
  statsData.sessions.forEach((session, index) => {
    csv += `${index + 1},${session.date},${session.score}%,${session.correct},${session.incorrect},${session.duration}s\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tablesmathassist_stats.csv';
  a.click();
  window.URL.revokeObjectURL(url);
  
  showNotification('📝 Statistiques exportées en CSV !');
}

function exportToPDF() {
  // Simulation d'export PDF
  showNotification('📄 Export PDF en cours de développement...');
}

function activateClassMode() {
  showNotification('🏫 Mode Classe activé ! Fonctionnalité en développement...');
}

// ========== GESTION MODAL PARAMÈTRES ==========
const settingsModal = document.getElementById('settingsModal');
const settingsButtonMobile = document.getElementById('settingsButtonMobile');
const settingsButtonDesktop = document.getElementById('settingsButtonDesktop');
const closeSettingsModal = document.getElementById('closeSettingsModal');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
const soundsEnabledInput = document.getElementById('soundsEnabled');
const animationsEnabledInput = document.getElementById('animationsEnabled');

// Event listeners pour boutons export
document.getElementById('exportCSV')?.addEventListener('click', exportToCSV);
document.getElementById('exportPDF')?.addEventListener('click', exportToPDF);
document.getElementById('modeClasse')?.addEventListener('click', activateClassMode);

// Clés localStorage pour le système de paramètres
const LS_PROFILE = 'tma_profile';
const LS_SOUNDS = 'tma_sounds';
const LS_ANIMATIONS = 'tma_animations';

function openSettings() {
  loadCurrentSettings();
  settingsModal.classList.add('active');
  document.body.style.overflow = 'hidden';
  
  // Son d'ouverture selon le profil
  const profile = document.body.getAttribute('data-profile') || 'CM2';
  playValidationSound(profile);
}

function closeSettings() {
  settingsModal.classList.remove('active');
  document.body.style.overflow = '';
}

function loadCurrentSettings() {
  const profile = localStorage.getItem(LS_PROFILE) || 'CM2';
  const profileRadio = document.querySelector(`input[name="userProfile"][value="${profile}"]`);
  if (profileRadio) {
    profileRadio.checked = true;
  }
  
  soundsEnabledInput.checked = (localStorage.getItem(LS_SOUNDS) !== 'false');
  animationsEnabledInput.checked = (localStorage.getItem(LS_ANIMATIONS) !== 'false');
}

function saveSettings() {
  const selectedProfileElement = document.querySelector('input[name="userProfile"]:checked');
  if (!selectedProfileElement) {
    alert('Veuillez sélectionner un profil utilisateur');
    return;
  }
  
  const selectedProfile = selectedProfileElement.value;
  const soundsEnabled = soundsEnabledInput.checked;
  const animationsEnabled = animationsEnabledInput.checked;
  
  // Sauvegarder dans localStorage
  localStorage.setItem(LS_PROFILE, selectedProfile);
  localStorage.setItem(LS_SOUNDS, soundsEnabled);
  localStorage.setItem(LS_ANIMATIONS, animationsEnabled);
  localStorage.setItem('tma_settings_timestamp', Date.now());
  
  // Appliquer les changements
  applyProfileSettings(selectedProfile);
  
  // Son de succès selon le profil
  playSuccessSound(selectedProfile);
  
  // Notification de succès avec animation
  showNotification('🎉 Paramètres sauvegardés avec succès !');
  
  // Fermer le modal avec délai pour voir l'animation
  setTimeout(closeSettings, 300);
}

function applyProfileSettings(profile) {
  const config = profileConfigs[profile] || profileConfigs.CM2;
  
  // Appliquer l'attribut data-profile au body
  document.body.setAttribute('data-profile', profile);
  
  // Définir les variables globales
  window.tmaAnimationsEnabled = (localStorage.getItem(LS_ANIMATIONS) !== 'false') && config.animations;
  window.tmaSoundsEnabled = (localStorage.getItem(LS_SOUNDS) !== 'false') && config.sounds;
  
  // Mettre à jour la visibilité des tables
  updateVisibleTables(config.tables);
  
  // Forcer la mise à jour des checkboxes selon le profil
  updateTablesCheckboxesByProfile(profile);
  
  // Initialiser les statistiques avancées si profil Adulte
  if (profile === 'ADULTE') {
    setTimeout(initAdvancedStats, 100);
  }
  
  console.log('✓ Profil appliqué:', profile, 'Sons:', window.tmaSoundsEnabled, 'Animations:', window.tmaAnimationsEnabled);
}

function updateVisibleTables(allowedTables) {
  const tableCards = document.querySelectorAll('.table-card');
  tableCards.forEach(card => {
    const tableNum = parseInt(card.dataset.num);
    if (allowedTables.includes(tableNum)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
}

function updateTablesCheckboxesByProfile(profile) {
  const config = profileConfigs[profile] || profileConfigs.CM2;
  const checkboxes = document.querySelectorAll('.tables-selector input[type="checkbox"]');
  
  checkboxes.forEach(checkbox => {
    const tableNum = parseInt(checkbox.value);
    if (profile === 'CM1') {
      // CM1 : Tables 2,3,4,5 prioritaires + autres jusqu'à 10
      if ([2,3,4,5].includes(tableNum)) {
        checkbox.checked = true;
      } else if (tableNum <= 10) {
        checkbox.checked = false; // Disponibles mais non cochées par défaut
      } else {
        checkbox.checked = false;
        checkbox.disabled = true; // Tables 11-12 désactivées
      }
    } else {
      // Autres profils : toutes les tables disponibles
      checkbox.disabled = false;
      if (config.tables.includes(tableNum)) {
        checkbox.checked = (tableNum <= 10); // Tables 1-10 cochées par défaut
      } else {
        checkbox.checked = false;
      }
    }
  });
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4CAF50, #45a049);
    color: white;
    padding: 15px 20px;
    border-radius: 12px;
    z-index: 3000;
    font-size: 1rem;
    font-weight: bold;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    animation: notificationSlideIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    max-width: 300px;
  `;
  notification.textContent = message;
  
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      @keyframes notificationSlideIn {
        from { transform: translateX(400px) rotate(10deg); opacity: 0; }
        to { transform: translateX(0) rotate(0); opacity: 1; }
      }
      @keyframes notificationSlideOut {
        from { transform: translateX(0) scale(1); opacity: 1; }
        to { transform: translateX(400px) scale(0.8); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'notificationSlideOut 0.4s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 400);
  }, 3500);
}

// Event listeners pour le modal paramètres
settingsButtonMobile.onclick = openSettings;
settingsButtonDesktop.onclick = openSettings;
closeSettingsModal.onclick = closeSettings;
cancelSettingsBtn.onclick = closeSettings;
saveSettingsBtn.onclick = saveSettings;

// Fermer le modal en cliquant à l'extérieur
settingsModal.onclick = (e) => {
  if (e.target === settingsModal) {
    closeSettings();
  }
};

// ========== PHRASES ALÉATOIRES POUR MÉDAILLES ==========
const MEDAL_MESSAGES = {
  gold: [
    "Tu as gagné la coupe OR, félicitations tu as réussi une vraie prouesse !",
    "Incroyable ! Tu maîtrises parfaitement tes tables, c'est de l'OR pur !",
    "Champion(ne) ! Ton résultat est exceptionnel, tu mérites cette médaille d'OR !",
    "Bravo ! Tu es un(e) véritable expert(e) des tables de multiplication !",
    "Extraordinaire ! Tu as atteint l'excellence, cette médaille d'OR est bien méritée !",
    "Fantastique ! Ton niveau est remarquable, tu peux être fier(e) de toi !",
    "Exceptionnel ! Tu as démontré une maîtrise parfaite, félicitations !",
    "Impressionnant ! Tes efforts ont payé, tu es au sommet !",
    "Magnifique ! Tu as brillé comme de l'or, continue comme ça !",
    "Parfait ! Tu es un(e) champion(ne) des mathématiques !"
  ],
  silver: [
    "Très bien ! Tu as décroché la médaille d'ARGENT, c'est un excellent résultat !",
    "Bravo ! Ton travail sérieux t'a mené à cette belle médaille d'ARGENT !",
    "Super ! Tu es sur la bonne voie, cette médaille d'ARGENT le prouve !",
    "Félicitations ! Ton niveau est très bon, tu peux être fier(e) !",
    "Bien joué ! Cette médaille d'ARGENT récompense tes efforts !",
    "Excellent travail ! Tu maîtrises bien tes tables, continue !",
    "Très bon résultat ! Cette médaille d'ARGENT est méritée !",
    "Bravo ! Tu progresses bien, cette médaille le confirme !",
    "Super performance ! Tu es en bonne voie vers l'excellence !",
    "Très bien ! Tes révisions portent leurs fruits !"
  ],
  bronze: [
    "Bien ! Tu as obtenu la médaille de BRONZE, c'est un bon début !",
    "Pas mal ! Cette médaille de BRONZE montre que tu progresses !",
    "Bravo ! Tu as travaillé et cette médaille de BRONZE le récompense !",
    "C'est un bon résultat ! Continue tes efforts pour progresser !",
    "Bien joué ! Cette médaille de BRONZE est encourageante !",
    "Tu y arrives ! Tes efforts commencent à payer !",
    "Correct ! Tu es sur le bon chemin, persévère !",
    "Pas mal du tout ! Continue à t'entraîner !",
    "C'est bien ! Tu peux encore mieux faire, courage !",
    "Bon travail ! Cette médaille te motive pour la suite !"
  ],
  paper: [
    "Ne te décourage pas ! Avec plus d'entraînement, tu vas y arriver !",
    "Courage ! Les tables demandent de la pratique, continue !",
    "Pas grave ! Chaque erreur est une leçon, recommence !",
    "Allez ! Avec de la persévérance, tu vas progresser !",
    "C'est en forgeant qu'on devient forgeron, continue !",
    "Ne baisse pas les bras ! La réussite demande du temps !",
    "Courage ! Retravaille tes tables et tu vas y arriver !",
    "Pas de panique ! Avec plus d'entraînement, ça viendra !",
    "Continue ! Chaque tentative te rapproche du succès !",
    "Persévère ! Les mathématiques s'apprennent avec la pratique !"
  ]
};

// ========== FONCTION MESSAGE ALÉATOIRE ==========
function getRandomMedalMessage(medalType) {
  const messages = MEDAL_MESSAGES[medalType];
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

// ========== ANIMATION DU LIÈVRE ==========
function updateRabbitPosition() {
  if (!GAME.noTimerMode && GAME.timeLimit > 0) {
    const timeElapsed = (GAME.timeLimit - GAME.timeLeft) / GAME.timeLimit;
    const trackWidth = document.querySelector('.track-container').offsetWidth - 40;
    const rabbitPosition = Math.min(timeElapsed * trackWidth, trackWidth);
    
    const rabbit = document.getElementById('rabbit');
    if (rabbit) {
      rabbit.style.left = `${rabbitPosition + 5}px`;
    }
    
    const timeRemaining = document.getElementById('timeRemaining');
    if (timeRemaining) {
      const minutes = Math.floor(GAME.timeLeft / 60);
      const seconds = GAME.timeLeft % 60;
      timeRemaining.textContent = `Temps restant: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }
}

// ========== THÈME + BOUTONS DOUBLES ==========
const themeToggle = document.getElementById('themeToggle');
const themeToggleDesktop = document.getElementById('themeToggleDesktop');
const themeIcons = document.querySelectorAll('.theme-icon');

function setTheme(mode) {
  document.body.classList.toggle('day-mode', mode === 'day');
  themeIcons.forEach(icon => {
    icon.textContent = (mode === 'day') ? '🌞' : '🌙';
  });
  localStorage.setItem('tma_theme', mode);
}

let currentTheme = localStorage.getItem('tma_theme') || 'night';
setTheme(currentTheme);

function toggleTheme() {
  currentTheme = (currentTheme === 'day') ? 'night' : 'day';
  setTheme(currentTheme);
  
  // Son de changement de thème
  const profile = document.body.getAttribute('data-profile') || 'CM2';
  playValidationSound(profile);
}

themeToggle.onclick = toggleTheme;
themeToggleDesktop.onclick = toggleTheme;

// ========== AFFICHAGE CONDITIONNEL DESKTOP/MOBILE ==========
function updateHeaderLayout() {
  const isMobile = window.innerWidth <= 768;
  const desktopLogo = document.querySelector('.header-logo:not(.header-top .header-logo)');
  const desktopButtons = document.querySelector('.header > div:last-child');
  
  if (isMobile) {
    if (desktopLogo) desktopLogo.style.display = 'none';
    if (desktopButtons) desktopButtons.style.display = 'none';
  } else {
    if (desktopLogo) desktopLogo.style.display = 'block';
    if (desktopButtons) desktopButtons.style.display = 'flex';
  }
}

updateHeaderLayout();
window.addEventListener('resize', updateHeaderLayout);

// ========== NOUVELLES ASTUCES COMPLÈTES ==========
const ASTUCES = {
  1: [
    "🧭 C'est très facile ! Quand tu multiplies par 1, le nombre ne change jamais !",
    "• Tu vois, 1 × 5 = 5, comme si tu avais 1 paquet de 5 bonbons = 5 bonbons",
    "• C'est pareil avec tous les nombres : 1 × 8 = 8, 1 × 12 = 12",
    "• Astuce : Le nombre 1 est comme un miroir, il ne change rien au nombre !",
    "• Pour t'entraîner : dis tout haut '1 fois 7 égale 7' plusieurs fois"
  ],
  2: [
    "🧭 La table de 2, c'est très simple : tu doubles le nombre !",
    "• Doubler, ça veut dire prendre deux fois la même chose",
    "• Par exemple : 2 × 4, c'est comme avoir 4 + 4 = 8",
    "• Tu peux compter de 2 en 2 : 2, 4, 6, 8, 10, 12, 14, 16, 18, 20...",
    "• Astuce magique : tous les résultats finissent par 0, 2, 4, 6 ou 8 !",
    "• Imagine 2 paquets identiques de biscuits, combien as-tu en tout ?"
  ],
  3: [
    "👀 Pour la table de 3, compte de 3 en 3 comme en sautant à la marelle !",
    "• Récite cette suite magique : 3, 6, 9, 12, 15, 18, 21, 24, 27, 30...",
    "• Pour calculer 3 × 4, imagine 4 paquets de 3 bonbons chacun",
    "• Tu peux aussi faire 3 + 3 + 3 + 3 = 12",
    "• Astuce amusante : dessine 3 ronds, puis encore 3, puis encore 3...",
    "• C'est comme faire 3 pas, puis 3 pas, puis 3 pas !"
  ],
  4: [
    "👀 La table de 4, c'est comme doubler deux fois !",
    "• D'abord tu doubles le nombre, puis tu doubles encore le résultat",
    "• Exemple : 4 × 3 → d'abord 3 + 3 = 6, puis 6 + 6 = 12",
    "• Tu peux réciter : 4, 8, 12, 16, 20, 24, 28, 32, 36, 40...",
    "• Astuce : 4, c'est 2 + 2, alors fais deux fois la table de 2 !",
    "• Pense à 4 roues sur une voiture, combien de roues sur plusieurs voitures ?"
  ],
  5: [
    "🧭 Super facile ! Tous les résultats de la table de 5 finissent par 0 ou 5 !",
    "• Récite : 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60...",
    "• Règle magique : nombre pair × 5 = résultat qui finit par 0",
    "• Règle magique : nombre impair × 5 = résultat qui finit par 5",
    "• Compte sur tes doigts : une main complète = 5 !",
    "• Pense aux pièces de 5 centimes dans ta tirelire !"
  ],
  6: [
    "👀 Pour la table de 6, apprends cette suite comme une chanson !",
    "• Chante : 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72...",
    "• Utilise tes doigts : sur chaque doigt, dis 6, 12, 18, 24, 30, 36...",
    "• Astuce : 6 × nombre pair donne un résultat qui finit par 2, 4, 6, 8 ou 0",
    "• Pense aux œufs : une boîte de 6 œufs, combien d'œufs dans plusieurs boîtes ?",
    "• Pour retenir : invente une petite chanson avec ces nombres !"
  ],
  7: [
    "🔔 Pense aux jours de la semaine pour retenir la table de 7 !",
    "• Il y a 7 jours dans une semaine, 14 jours dans 2 semaines...",
    "• Souviens-toi : 7 × 4 = 28 (c'est 4 semaines, presque 1 mois !)",
    "• Truc pour retenir : 7 × 8 = 56 (sept-huit font cinquante-six)",
    "• Récite : 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84...",
    "• Compte les jours sur un calendrier pour t'aider !"
  ],
  8: [
    "🔔 La table de 8, c'est comme doubler 3 fois de suite !",
    "• Pour 8 × 2 : prends 2, double-le (2+2=4), double encore (4+4=8), double encore (8+8=16)",
    "• Astuce : 8 c'est 2×2×2, alors triple le doublement !",
    "• Récite : 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96...",
    "• Pense aux pattes d'une araignée : 8 pattes sur une araignée !",
    "• Pour t'aider : écris la table et colorie-la pour mieux la retenir"
  ],
  9: [
    "👀 La table de 9 a un secret magique incroyable !",
    "• Secret : additionne les chiffres du résultat, tu obtiens toujours 9 !",
    "• Exemple : 9 × 4 = 36, et 3 + 6 = 9 !",
    "• Autre exemple : 9 × 7 = 63, et 6 + 3 = 9 !",
    "• Astuce avec les doigts : pour 9×3, baisse ton 3ème doigt, lis 27 !",
    "• Récite : 9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99, 108..."
  ],
  10: [
    "🔔 La plus facile de toutes ! Tu ajoutes juste un 0 !",
    "• 10 × 7 = 70 (écris 7 puis ajoute 0)",
    "• 10 × 12 = 120 (écris 12 puis ajoute 0)",
    "• Astuce magique : le 10 transforme tous les nombres !",
    "• Récite : 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120...",
    "• Pense aux pièces de 10 centimes ou aux billets de 10 euros !"
  ],
  11: [
    "👀 Pour les nombres de 1 à 9, écris le chiffre deux fois !",
    "• 11 × 4 = 44 (écris 4, puis encore 4)",
    "• 11 × 7 = 77 (écris 7, puis encore 7)",
    "• Attention : pour 10, 11, 12 c'est différent mais facile à retenir !",
    "• Récite : 11, 22, 33, 44, 55, 66, 77, 88, 99, 110, 121, 132...",
    "• Astuce visuelle : tous les résultats jusqu'à 9 ont des chiffres jumeaux !"
  ],
  12: [
    "🔔 La table de 12, c'est la table des douzaines !",
    "• Une douzaine = 12, comme une boîte de 12 œufs !",
    "• Récite : 12, 24, 36, 48, 60, 72, 84, 96, 108, 120, 132, 144...",
    "• 12 × 5 = 60 (5 douzaines d'œufs font 60 œufs)",
    "• Astuce : 12 = 10 + 2, alors 12×4 = (10×4) + (2×4) = 40+8 = 48",
    "• Pense aux heures sur une horloge : 12 heures !"
  ]
};

// ========== NAVIGATION APPRENTISSAGE ==========
const learnBtn = document.getElementById('learnBtn');
const learnPage = document.getElementById('learnPage');
const homePage = document.getElementById('homePage');
const backHome = document.getElementById('backHome');
const tableDetailPage = document.getElementById('tableDetailPage');
const backToLearnBtn = document.getElementById('backToLearnBtn');
let currentTableNum = 1;

learnBtn.onclick = () => {
  homePage.style.display = 'none';
  learnPage.style.display = 'block';
  tableDetailPage.style.display = 'none';
  document.getElementById('gameArea').style.display = 'none';
  document.getElementById('resultsArea').style.display = 'none';
  window.scrollTo(0, 0);
  
  // Son de navigation
  const profile = document.body.getAttribute('data-profile') || 'CM2';
  playValidationSound(profile);
};

backHome.onclick = () => {
  homePage.style.display = 'block';
  learnPage.style.display = 'none';
  tableDetailPage.style.display = 'none';
  document.getElementById('gameArea').style.display = 'none';
  document.getElementById('resultsArea').style.display = 'none';
  window.scrollTo(0, 0);
};

backToLearnBtn.onclick = () => {
  learnPage.style.display = 'block';
  tableDetailPage.style.display = 'none';
  window.scrollTo(0, 0);
};

const tableCards = document.querySelectorAll('.table-card');
tableCards.forEach(card => {
  card.onclick = () => {
    const num = parseInt(card.dataset.num);
    showTableDetail(num);
  };
});

function showTableDetail(num) {
  currentTableNum = num;
  document.getElementById('tableDetailTitle').textContent = `Table de ${num}`;
  learnPage.style.display = 'none';
  tableDetailPage.style.display = 'block';
  document.getElementById('multiplicationGrid').innerHTML = '';
  
  for (let i = 1; i <= 12; i++) {
    const cell = document.createElement('div');
    cell.textContent = `${num} × ${i} = ${num * i}`;
    document.getElementById('multiplicationGrid').appendChild(cell);
  }
  
  window.scrollTo(0, 0);
}

backToLearnBtn.onclick = () => {
  learnPage.style.display = 'block';
  tableDetailPage.style.display = 'none';
  window.scrollTo(0, 0);
};

// ========== JEU ==========

const gameArea = document.getElementById('gameArea');
const resultsArea = document.getElementById('resultsArea');
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answerInput');
const validateBtn = document.getElementById('validateBtn');
const timeRemaining = document.getElementById('timeRemaining');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const finalScore = document.getElementById('finalScore');
const correctCount = document.getElementById('correctCount');
const incorrectCount = document.getElementById('incorrectCount');
const missedCount = document.getElementById('missedCount');
const successPercentage = document.getElementById('successPercentage');
const resultsGrid = document.getElementById('resultsGrid');
const errorsList = document.getElementById('errorsList');

const newGameBtn = document.getElementById('newGameBtn');
const backToSettingsBtn = document.getElementById('backToSettingsBtn');

const difficultyRadios = document.getElementsByName('difficulty');
const soundCheckbox = document.getElementById('soundsEnabled');
const animationCheckbox = document.getElementById('animationsEnabled');
const tablesCheckboxes = document.querySelectorAll('.tables-selector input[type="checkbox"]');
const questionsInput = document.getElementById('numQuestions');
const timerRadios = document.getElementsByName('timer');

let GAME = {
  questions: [],
  answers: [],
  score: 0,
  total: 0,
  correct: 0,
  incorrect: 0,
  missed: 0,
  timeLimit: 0,
  timeLeft: 0,
  currentIndex: 0,
  intervalId: null
};

function startGame() {
  const selectedTables = Array.from(document.querySelectorAll('.tables-selector input[type="checkbox"]:checked'))
    .map(cb => parseInt(cb.value));
  if (!selectedTables.length) {
    alert("Veuillez sélectionner au moins une table.");
    return;
  }
  
  const numQuestions = parseInt(questionsInput.value);
  if (isNaN(numQuestions) || numQuestions < 1) {
    alert("Veuillez entrer un nombre de questions valide.");
    return;
  }
  
  const timerOption = Array.from(timerRadios).find(r => r.checked).value;
  GAME.timeLimit = parseInt(timerOption) * 60; // seconds
  GAME.timeLeft = GAME.timeLimit;
  
  gameArea.style.display = 'block';
  homePage.style.display = 'none';
  resultsArea.style.display = 'none';
  
  GAME.questions = [];
  GAME.answers = [];
  GAME.score = 0;
  GAME.total = numQuestions;
  GAME.correct = 0;
  GAME.incorrect = 0;
  GAME.missed = 0;
  GAME.currentIndex = 0;
  
  for (let i = 0; i < numQuestions; i++) {
    const a = selectedTables[Math.floor(Math.random() * selectedTables.length)];
    const b = Math.floor(Math.random() * 12) + 1;
    GAME.questions.push({ a: a, b: b, result: a * b });
  }
  
  showNextQuestion();
  startTimer();
}

function showNextQuestion() {
  if (GAME.currentIndex >= GAME.total) {
    endGame();
    return;
  }
  const q = GAME.questions[GAME.currentIndex];
  questionElement.textContent = `${q.a} × ${q.b} = ?`;
  progressText.textContent = `Question ${GAME.currentIndex + 1} / ${GAME.total}`;
  progressFill.style.width = `${((GAME.currentIndex) / GAME.total) * 100}%`;
  answerInput.value = '';
  answerInput.focus();
}

function validateAnswer() {
  clearInterval(GAME.intervalId); // stop timer for this question
  const q = GAME.questions[GAME.currentIndex];
  const userAnswer = parseInt(answerInput.value);
  
  GAME.answers.push(userAnswer);
  if (userAnswer === q.result) {
    GAME.score++;
    GAME.correct++;
    playSuccessSound(document.body.getAttribute('data-profile') || 'CM2');
  } else {
    if (answerInput.value === '') {
      GAME.missed++;
    } else {
      GAME.incorrect++;
    }
    playErrorSound(document.body.getAttribute('data-profile') || 'CM2');
  }
  
  GAME.currentIndex++;
  
  if (GAME.currentIndex < GAME.total) {
    showNextQuestion();
    startTimer();
  } else {
    endGame();
  }
}

function startTimer() {
  if (GAME.timeLimit > 0) {
    GAME.intervalId = setInterval(() => {
      GAME.timeLeft--;
      updateRabbitPosition();
      const minutes = Math.floor(GAME.timeLeft / 60);
      const seconds = GAME.timeLeft % 60;
      timeRemaining.textContent = `Temps restant: ${minutes}:${seconds.toString().padStart(2, '0')}`;
      if (GAME.timeLeft <= 0) {
        clearInterval(GAME.intervalId);
        GAME.timeLeft = 0;
        validateAnswer();
      }
    }, 1000);
  }
}

function endGame() {
  clearInterval(GAME.intervalId);
  gameArea.style.display = 'none';
  resultsArea.style.display = 'block';
  finalScore.textContent = `${GAME.score}/${GAME.total}`;
  correctCount.textContent = GAME.correct;
  incorrectCount.textContent = GAME.incorrect;
  missedCount.textContent = GAME.missed;
  const successRate = Math.round((GAME.score / GAME.total) * 100);
  successPercentage.textContent = successRate + '%';

  // Déterminer médaille
  let medalType = '';
  if (successRate >= 98) {
    medalType = 'gold';
    medalText.textContent = 'OR';
    medal.textContent = '🏅';
  } else if (successRate >= 95) {
    medalType = 'silver';
    medalText.textContent = 'ARGENT';
    medal.textContent = '🥈';
  } else if (successRate >= 90) {
    medalType = 'bronze';
    medalText.textContent = 'BRONZE';
    medal.textContent = '🥉';
  } else {
    medalType = 'paper';
    medalText.textContent = 'À REVOIR';
    medal.textContent = '📄';
  }

  // Message aléatoire
  medalMessage.textContent = getRandomMedalMessage(medalType);

  // Remplir grille des résultats
  resultsGrid.innerHTML = '';
  for (let row = 1; row <= 12; row++) {
    const tr = document.createElement('tr');
    for (let col = 1; col <= 12; col++) {
      const td = document.createElement('td');
      const found = GAME.questions.find((q, i) => q.a === row && q.b === col);
      if (found) {
        if (GAME.answers[GAME.questions.indexOf(found)] === found.result) {
          td.classList.add('correct');
        } else if (GAME.answers[GAME.questions.indexOf(found)] === undefined) {
          td.classList.add('missed');
        } else {
          td.classList.add('incorrect');
        }
      }
      tr.appendChild(td);
    }
    resultsGrid.appendChild(tr);
  }

  // Liste détaillée des erreurs
  errorsList.innerHTML = '';
  GAME.questions.forEach((q, idx) => {
    if (GAME.answers[idx] !== q.result) {
      const div = document.createElement('div');
      if (GAME.answers[idx] === undefined || GAME.answers[idx] === '') {
        div.innerHTML = `${q.a} × ${q.b} = <span class="correct-answer">${q.result}</span> (Non répondu)`;
      } else {
        div.innerHTML = `${q.a} × ${q.b} = <span class="correct-answer">${q.result}</span> (Votre réponse : <span class="wrong-answer">${GAME.answers[idx]}</span>)`;
      }
      errorsList.appendChild(div);
    }
  });

  // Mettre à jour statistiques
  statsData.sessions.push({
    date: new Date().toLocaleDateString(),
    score: successRate,
    correct: GAME.correct,
    incorrect: GAME.incorrect,
    duration: GAME.timeLimit - GAME.timeLeft
  });
  saveStatsData();

  updateStatsCharts({ questions: GAME.questions, answers: GAME.answers, score: GAME.score, total: GAME.total });
}

newGameBtn.onclick = startGame;
backToSettingsBtn.onclick = () => {
  resultsArea.style.display = 'none';
  homePage.style.display = 'block';
  document.getElementById('gameArea').style.display = 'none';
  document.getElementById('tableDetailPage').style.display = 'none';
  window.scrollTo(0, 0);
};

