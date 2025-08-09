// js/app.js
// Script principal de l'application (module ES)
import { profileConfigs, STORAGE_KEYS, APP_CONFIG } from './config.js';

// ----------------------- Utilitaires & état -----------------------
let audioContext = null;
let performanceChart = null;
let evolutionChart = null;

const statsDataTemplate = {
  sessions: [],
  tablePerformance: {},
  timeAnalysis: {},
  errorPatterns: []
};
let statsData = Object.assign({}, statsDataTemplate);

const LS = STORAGE_KEYS;
const DEFAULT_PROFILE = APP_CONFIG.defaultProfile || 'CM2';

// ----------------------- DOM (sélection après DOMContentLoaded) -----------------------
document.addEventListener('DOMContentLoaded', () => {
  // Elements fréquemment utilisés
  const settingsModal = document.getElementById('settingsModal');
  const settingsButtonMobile = document.getElementById('settingsButtonMobile');
  const settingsButtonDesktop = document.getElementById('settingsButtonDesktop');
  const closeSettingsModal = document.getElementById('closeSettingsModal');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  const soundsEnabledInput = document.getElementById('soundsEnabled');
  const animationsEnabledInput = document.getElementById('animationsEnabled');

  const exportCSVBtn = document.getElementById('exportCSV');
  const exportPDFBtn = document.getElementById('exportPDF');
  const modeClasseBtn = document.getElementById('modeClasse');

  const learnBtn = document.getElementById('learnBtn');
  const learnPage = document.getElementById('learnPage');
  const homePage = document.getElementById('homePage');
  const backHome = document.getElementById('backHome');
  const tableDetailPage = document.getElementById('tableDetailPage');
  const backToLearnBtn = document.getElementById('backToLearnBtn');
  const multiplicationGrid = document.getElementById('multiplicationGrid');

  const astuceModal = document.getElementById('astuceModal');
  const closeAstuceModal = document.getElementById('closeAstuceModal');
  const showAstuceBtn = document.getElementById('showAstuceBtn');
  const astuceModalTitle = document.getElementById('astuceModalTitle');
  const astuceModalContent = document.getElementById('astuceModalContent');

  // Game elements
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

  const tableCards = document.querySelectorAll('.table-card');
  const tableCheckboxes = document.querySelectorAll('.tables-selector input[type="checkbox"]');
  const timeLimitSelect = document.getElementById('timeLimit'); // minutes
  const questionCountSelect = document.getElementById('questionCount');
  const noTimerModeCheckbox = document.getElementById('noTimerMode');

  const themeToggle = document.getElementById('themeToggle');
  const themeToggleDesktop = document.getElementById('themeToggleDesktop');
  const themeIcons = document.querySelectorAll('.theme-icon');

  // medal elements
  const medal = document.getElementById('medal');
  const medalText = document.getElementById('medalText');
  const medalMessage = document.getElementById('medalMessage');

  // charts canvas
  const perfCanvas = document.getElementById('performanceChart');
  const evolCanvas = document.getElementById('evolutionChart');

  // defensive guards (si un élément manquant, on évite crash)
  function $(el) { return document.getElementById(el); }

  // ----------------------- Initialisation -----------------------
  initAudioSystem();
  loadStatsData();
  loadCurrentSettings(); // positionne inputs modales
  applyProfileSettings(localStorage.getItem(LS.PROFILE) || DEFAULT_PROFILE);

  // Init charts si profil adulte
  if (document.body.getAttribute('data-profile') === 'ADULTE') {
    initAdvancedStats();
  }

  // ----------------------- AUDIO -----------------------
  function initAudioSystem() {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // console.log('Audio ready');
    } catch (e) {
      audioContext = null;
    }
  }

  function createBeepSound(frequency, duration = 0.15, type = 'sine') {
    if (!audioContext) return;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioContext.currentTime);
    gain.gain.setValueAtTime(0.25, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start();
    osc.stop(audioContext.currentTime + duration);
  }

  function playSuccessSound(profile) {
    if (!window.tmaSoundsEnabled) return;
    const cfg = profileConfigs[profile] || profileConfigs.CM2;
    switch (cfg.soundProfile) {
      case 'cheerful':
        createBeepSound(523, 0.18, 'square');
        setTimeout(()=>createBeepSound(659,0.18,'square'),100);
        setTimeout(()=>createBeepSound(784,0.25,'square'),200);
        break;
      case 'encouraging':
        createBeepSound(440,0.25,'sine');
        setTimeout(()=>createBeepSound(554,0.25,'sine'),140);
        break;
      case 'modern':
        createBeepSound(330,0.18,'triangle');
        setTimeout(()=>createBeepSound(440,0.22,'sawtooth'),110);
        break;
      case 'minimal':
        createBeepSound(440,0.12,'sine');
        break;
      default:
        break;
    }
  }

  function playErrorSound(profile) {
    if (!window.tmaSoundsEnabled) return;
    const cfg = profileConfigs[profile] || profileConfigs.CM2;
    if (cfg.soundProfile !== 'none' && cfg.soundProfile !== 'minimal') {
      createBeepSound(200, 0.28, 'sawtooth');
    }
  }

  function playValidationSound(profile) {
    if (!window.tmaSoundsEnabled) return;
    const cfg = profileConfigs[profile] || profileConfigs.CM2;
    if (cfg.soundProfile === 'cheerful' || cfg.soundProfile === 'encouraging') {
      createBeepSound(800, 0.08, 'sine');
    } else if (cfg.soundProfile === 'modern') {
      createBeepSound(600, 0.1, 'triangle');
    }
  }

  // ----------------------- CHARTS & STATS -----------------------
  function loadStatsData() {
    try {
      const saved = localStorage.getItem(LS.ADV_STATS);
      if (saved) statsData = JSON.parse(saved);
    } catch(e) {
      statsData = Object.assign({}, statsDataTemplate);
    }
  }

  function saveStatsData() {
    try {
      localStorage.setItem(LS.ADV_STATS, JSON.stringify(statsData));
    } catch(e) {}
  }

  function initAdvancedStats() {
    initPerformanceChart();
    initEvolutionChart();
  }

  function initPerformanceChart() {
    if (!perfCanvas || typeof Chart === 'undefined') return;
    performanceChart = new Chart(perfCanvas, {
      type: 'radar',
      data: {
        labels: Array.from({length:12}, (_,i)=>`Table ${i+1}`),
        datasets: [{
          label: 'Taux de réussite (%)',
          data: [95,88,82,79,92,75,68,71,77,98,73,69],
          backgroundColor: 'rgba(47,54,64,0.08)',
          borderColor: '#2F3640',
          borderWidth: 2
        }]
      },
      options: {
        responsive:true,
        maintainAspectRatio:false,
        scales: {
          r: { beginAtZero:true, max:100 }
        }
      }
    });
  }

  function initEvolutionChart() {
    if (!evolCanvas || typeof Chart === 'undefined') return;
    evolutionChart = new Chart(evolCanvas, {
      type: 'line',
      data: {
        labels: ['Session 1','Session 2','Session 3','Session 4','Session 5','Session 6','Session 7'],
        datasets: [{
          label: 'Score moyen (%)',
          data: [65,71,78,82,88,85,91],
          borderColor: '#3742FA',
          backgroundColor: 'rgba(55,66,250,0.08)',
          tension: 0.35,
          fill: true
        }]
      },
      options: {
        responsive:true,
        maintainAspectRatio:false,
        scales: { y: { beginAtZero:true, max:100 } }
      }
    });
  }

  function updateStatsCharts(gameResults) {
    if (!performanceChart || !evolutionChart) return;
    const tableStats = calculateTablePerformance(gameResults);
    performanceChart.data.datasets[0].data = tableStats;
    performanceChart.update();

    const sessionScore = Math.round(gameResults.score / gameResults.total * 100);
    evolutionChart.data.datasets[0].data.push(sessionScore);
    evolutionChart.data.labels.push(`Session ${evolutionChart.data.labels.length + 1}`);
    if (evolutionChart.data.labels.length > 10) {
      evolutionChart.data.labels.shift();
      evolutionChart.data.datasets[0].data.shift();
    }
    evolutionChart.update();
  }

  function calculateTablePerformance(results) {
    const tableStats = new Array(12).fill(0);
    const tableCounts = new Array(12).fill(0);
    results.questions.forEach((q, idx) => {
      const tableIndex = q.a - 1;
      tableCounts[tableIndex]++;
      if (results.answers[idx] === q.result) tableStats[tableIndex]++;
    });
    return tableStats.map((c,i) => tableCounts[i] > 0 ? Math.round((c/tableCounts[i])*100) : 0);
  }

  // ----------------------- EXPORT -----------------------
  function exportToCSV() {
    if (!statsData.sessions || !statsData.sessions.length) {
      alert('Aucune donnée à exporter');
      return;
    }
    let csv = 'Session,Date,Score,BonnesReponses,MauvaisesReponses,TempsTotal(s)\n';
    statsData.sessions.forEach((s,i) => {
      csv += `${i+1},${s.date},${s.score},${s.correct},${s.incorrect},${s.duration}\n`;
    });
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'tablesmathassist_stats.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showNotification('📝 Statistiques exportées en CSV !');
  }

  function exportToPDF() {
    showNotification('📄 Export PDF en cours de développement...');
  }

  function activateClassMode() {
    showNotification('🏫 Mode Classe activé (en développement)...');
  }

  // ----------------------- UI / SETTINGS -----------------------
  function loadCurrentSettings() {
    const profile = localStorage.getItem(LS.PROFILE) || DEFAULT_PROFILE;
    const profileRadio = document.querySelector(`input[name="userProfile"][value="${profile}"]`);
    if (profileRadio) profileRadio.checked = true;
    if (soundsEnabledInput) soundsEnabledInput.checked = (localStorage.getItem(LS.SOUNDS) !== 'false');
    if (animationsEnabledInput) animationsEnabledInput.checked = (localStorage.getItem(LS.ANIMATIONS) !== 'false');
  }

  function openSettings() {
    loadCurrentSettings();
    if (settingsModal) settingsModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    playValidationSound(document.body.getAttribute('data-profile') || DEFAULT_PROFILE);
  }

  function closeSettings() {
    if (settingsModal) settingsModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function saveSettings() {
    const selected = document.querySelector('input[name="userProfile"]:checked');
    if (!selected) { alert('Veuillez choisir un profil'); return; }
    const selectedProfile = selected.value;
    const soundsEnabled = soundsEnabledInput ? soundsEnabledInput.checked : true;
    const animationsEnabled = animationsEnabledInput ? animationsEnabledInput.checked : true;
    localStorage.setItem(LS.PROFILE, selectedProfile);
    localStorage.setItem(LS.SOUNDS, soundsEnabled);
    localStorage.setItem(LS.ANIMATIONS, animationsEnabled);
    localStorage.setItem(LS.PREFS, JSON.stringify({timestamp:Date.now()}));
    applyProfileSettings(selectedProfile);
    playSuccessSound(selectedProfile);
    showNotification('🎉 Paramètres sauvegardés !');
    setTimeout(closeSettings, 300);
  }

  function applyProfileSettings(profile) {
    const cfg = profileConfigs[profile] || profileConfigs.CM2;
    document.body.setAttribute('data-profile', profile);
    window.tmaAnimationsEnabled = (localStorage.getItem(LS.ANIMATIONS) !== 'false') && cfg.animations;
    window.tmaSoundsEnabled = (localStorage.getItem(LS.SOUNDS) !== 'false') && cfg.sounds;
    updateVisibleTables(cfg.tables);
    updateTablesCheckboxesByProfile(profile);
    if (profile === 'ADULTE') setTimeout(initAdvancedStats, 120);
  }

  function updateVisibleTables(allowedTables) {
    document.querySelectorAll('.table-card').forEach(card => {
      const n = parseInt(card.dataset.num,10);
      if (allowedTables.includes(n)) card.classList.remove('hidden');
      else card.classList.add('hidden');
    });
  }

  function updateTablesCheckboxesByProfile(profile) {
    const cfg = profileConfigs[profile] || profileConfigs.CM2;
    tableCheckboxes.forEach(cb => {
      const n = parseInt(cb.value,10);
      cb.disabled = false;
      if (profile === 'CM1') {
        if ([2,3,4,5].includes(n)) { cb.checked = true; cb.disabled = false; }
        else if (n <= 10) { cb.checked = false; cb.disabled = false; }
        else { cb.checked = false; cb.disabled = true; }
      } else {
        cb.disabled = false;
        cb.checked = cfg.tables.includes(n) ? (n <= 12) : false;
      }
    });
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = 'position:fixed;top:20px;right:20px;background:linear-gradient(135deg,#4CAF50,#45a049);color:#fff;padding:12px 18px;border-radius:10px;z-index:4000;box-shadow:0 6px 20px rgba(0,0,0,0.2);font-weight:600;';
    document.body.appendChild(notification);
    setTimeout(()=> {
      notification.style.transition='all .4s ease'; notification.style.opacity='0'; notification.style.transform='translateX(30px)';
      setTimeout(()=> notification.remove(),400);
    }, 2800);
  }

  // ----------------------- NAVIGATION APPRENTISSAGE -----------------------
  if (learnBtn) learnBtn.onclick = () => {
    homePage.style.display = 'none';
    learnPage.style.display = 'block';
    tableDetailPage.style.display = 'none';
    if (gameArea) gameArea.style.display = 'none';
    if (resultsArea) resultsArea.style.display = 'none';
    playValidationSound(document.body.getAttribute('data-profile') || DEFAULT_PROFILE);
    window.scrollTo(0,0);
  };
  if (backHome) backHome.onclick = () => {
    homePage.style.display = 'block';
    learnPage.style.display = 'none';
    tableDetailPage.style.display = 'none';
    if (gameArea) gameArea.style.display = 'none';
    if (resultsArea) resultsArea.style.display = 'none';
    window.scrollTo(0,0);
  };
  if (backToLearnBtn) backToLearnBtn.onclick = () => {
    learnPage.style.display = 'block';
    tableDetailPage.style.display = 'none';
    window.scrollTo(0,0);
  };

  tableCards.forEach(card => {
    card.onclick = () => {
      const num = parseInt(card.dataset.num,10);
      showTableDetail(num);
    };
  });

  function showTableDetail(num) {
    const title = document.getElementById('tableDetailTitle');
    if (title) title.textContent = `Table de ${num}`;
    learnPage.style.display = 'none';
    tableDetailPage.style.display = 'block';
    if (multiplicationGrid) {
      multiplicationGrid.innerHTML = '';
      for (let i=1;i<=12;i++){
        const div = document.createElement('div');
        div.className = 'mult-card';
        div.innerHTML = `<div class="mult-question">${num} × ${i} =</div><div class="mult-answer">${num*i}</div>`;
        multiplicationGrid.appendChild(div);
      }
    }
    window.scrollTo(0,0);
  }

  // ----------------------- ASTUCES MODAL -----------------------
  const ASTUCES = {
    1: ["C'est très facile ! Quand tu multiplies par 1, le nombre ne change jamais !"],
    2: ["La table de 2, c'est très simple : tu doubles le nombre !"],
    3: ["Pour la table de 3, compte de 3 en 3 !"],
    4: ["La table de 4, c'est comme doubler deux fois !"],
    5: ["Tous les résultats de la table de 5 finissent par 0 ou 5 !"],
    6: ["Pour la table de 6, apprends cette suite comme une chanson !"],
    7: ["Pense aux jours de la semaine pour retenir la table de 7 !"],
    8: ["La table de 8, c'est comme doubler 3 fois de suite !"],
    9: ["La table de 9 a un secret : la somme des chiffres donne 9 !"],
    10:["La plus facile : ajoute un 0 !"],
    11:["Pour 1 à 9, écris le chiffre deux fois pour 11×"],
    12:["Ta douzaine : pense aux boîtes de 12 œufs !"]
  };

  if (showAstuceBtn) showAstuceBtn.onclick = () => {
    const title = document.getElementById('tableDetailTitle');
    const current = title ? parseInt(title.textContent.replace(/\D/g,''),10) || 2 : 2;
    astuceModalTitle.textContent = `Astuces Table de ${current}`;
    astuceModalContent.innerHTML = '';
    const list = ASTUCES[current] || ["Pas d'astuce disponible."];
    list.forEach(line => {
      const li = document.createElement('li');
      li.textContent = line;
      astuceModalContent.appendChild(li);
    });
    astuceModal.classList.add('active');
  };
  if (closeAstuceModal) closeAstuceModal.onclick = () => astuceModal.classList.remove('active');
  if (astuceModal) astuceModal.onclick = (e) => { if (e.target === astuceModal) astuceModal.classList.remove('active'); };

  // ----------------------- THEME -----------------------
  let currentTheme = localStorage.getItem(LS.THEME) || 'night';
  function setTheme(mode) {
    document.body.classList.toggle('day-mode', mode === 'day');
    themeIcons.forEach(i => i.textContent = (mode === 'day') ? '🌞' : '🌙');
    localStorage.setItem(LS.THEME, mode);
  }
  setTheme(currentTheme);
  function toggleTheme() {
    currentTheme = currentTheme === 'day' ? 'night' : 'day';
    setTheme(currentTheme);
    playValidationSound(document.body.getAttribute('data-profile') || DEFAULT_PROFILE);
  }
  if (themeToggle) themeToggle.onclick = toggleTheme;
  if (themeToggleDesktop) themeToggleDesktop.onclick = toggleTheme;

  // ----------------------- HEADER LAYOUT -----------------------
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

  // ----------------------- GAME -----------------------
  const GAME = {
    questions: [],
    answers: [],
    score: 0,
    total: 0,
    correct:0,
    incorrect:0,
    missed:0,
    timeLimit:0,
    timeLeft:0,
    currentIndex:0,
    intervalId:null,
    noTimerMode: false
  };

  function startGame() {
    // tables sélectionnées
    const selectedTables = Array.from(document.querySelectorAll('.tables-selector input[type="checkbox"]:checked')).map(i=>parseInt(i.value,10));
    if (!selectedTables.length) { alert('Veuillez sélectionner au moins une table.'); return; }

    const numQuestions = parseInt(questionCountSelect.value,10) || APP_CONFIG.defaultQuestionCount;
    const timeLimitMinutes = parseInt(timeLimitSelect.value,10) || APP_CONFIG.defaultTimeLimit;
    const noTimerMode = noTimerModeCheckbox ? noTimerModeCheckbox.checked : false;

    GAME.timeLimit = noTimerMode ? 0 : timeLimitMinutes * 60;
    GAME.timeLeft = GAME.timeLimit;
    GAME.noTimerMode = noTimerMode;

    GAME.total = numQuestions;
    GAME.questions = [];
    GAME.answers = [];
    GAME.score = 0;
    GAME.correct = 0;
    GAME.incorrect = 0;
    GAME.missed = 0;
    GAME.currentIndex = 0;

    for (let i=0;i<numQuestions;i++){
      const a = selectedTables[Math.floor(Math.random()*selectedTables.length)];
      const b = Math.floor(Math.random()*12)+1;
      GAME.questions.push({ a: a, b: b, result: a*b });
    }

    if (gameArea) gameArea.style.display = 'block';
    if (homePage) homePage.style.display = 'none';
    if (resultsArea) resultsArea.style.display = 'none';

    showNextQuestion();
    if (!GAME.noTimerMode && GAME.timeLimit>0) startTimer();
  }

  function showNextQuestion() {
    if (GAME.currentIndex >= GAME.total) { endGame(); return; }
    const q = GAME.questions[GAME.currentIndex];
    if (questionElement) questionElement.textContent = `${q.a} × ${q.b} = ?`;
    if (progressText) progressText.textContent = `Question ${GAME.currentIndex+1} / ${GAME.total}`;
    if (progressFill) progressFill.style.width = `${((GAME.currentIndex)/GAME.total)*100}%`;
    if (answerInput) { answerInput.value = ''; answerInput.focus(); }
  }

  function validateAnswer() {
    // Stop interval for current question (we restart in showNextQuestion/startTimer)
    if (GAME.intervalId) { clearInterval(GAME.intervalId); GAME.intervalId = null; }
    const q = GAME.questions[GAME.currentIndex];
    const userAnswer = parseInt(answerInput.value,10);
    GAME.answers.push(userAnswer);

    if (userAnswer === q.result) {
      GAME.score++; GAME.correct++;
      playSuccessSound(document.body.getAttribute('data-profile') || DEFAULT_PROFILE);
    } else {
      if (answerInput.value === '' || isNaN(userAnswer)) GAME.missed++;
      else GAME.incorrect++;
      playErrorSound(document.body.getAttribute('data-profile') || DEFAULT_PROFILE);
    }

    GAME.currentIndex++;
    if (GAME.currentIndex < GAME.total) {
      showNextQuestion();
      if (!GAME.noTimerMode && GAME.timeLimit>0) startTimer();
    } else endGame();
  }

  function startTimer() {
    if (GAME.timeLimit <= 0) return;
    // reset timeLeft for fresh question? gameplay uses total time, so we decrease GAME.timeLeft globally
    // Here implementation uses global countdown for entire series
    if (GAME.intervalId) clearInterval(GAME.intervalId);
    GAME.intervalId = setInterval(()=> {
      GAME.timeLeft--;
      updateRabbitPosition();
      if (GAME.timeLeft <= 0) {
        clearInterval(GAME.intervalId);
        GAME.timeLeft = 0;
        // treat as if user didn't answer current question
        validateAnswer();
      } else {
        const m = Math.floor(GAME.timeLeft/60);
        const s = GAME.timeLeft%60;
        if (timeRemaining) timeRemaining.textContent = `Temps restant: ${m}:${String(s).padStart(2,'0')}`;
      }
    }, 1000);
  }

  function endGame() {
    if (GAME.intervalId) { clearInterval(GAME.intervalId); GAME.intervalId = null; }
    if (gameArea) gameArea.style.display = 'none';
    if (resultsArea) resultsArea.style.display = 'block';
    if (finalScore) finalScore.textContent = `${GAME.score}/${GAME.total}`;
    if (correctCount) correctCount.textContent = GAME.correct;
    if (incorrectCount) incorrectCount.textContent = GAME.incorrect;
    if (missedCount) missedCount.textContent = GAME.missed;
    const successRate = Math.round(GAME.score / GAME.total * 100) || 0;
    if (successPercentage) successPercentage.textContent = successRate + '%';

    // medal logic
    let medalType = 'paper';
    if (successRate >= 98) medalType='gold';
    else if (successRate >= 95) medalType='silver';
    else if (successRate >= 90) medalType='bronze';
    if (medalText) {
      if (medalType==='gold') medalText.textContent = 'OR';
      else if (medalType==='silver') medalText.textContent = 'ARGENT';
      else if (medalType==='bronze') medalText.textContent = 'BRONZE';
      else medalText.textContent = 'À REVOIR';
    }
    if (medal) {
      medal.textContent = (medalType==='gold'?'🏅':medalType==='silver'?'🥈':medalType==='bronze'?'🥉':'📄');
    }

    // random message
    if (medalMessage) medalMessage.textContent = getRandomMedalMessage(medalType);

    // results grid 12x12
    if (resultsGrid) {
      resultsGrid.innerHTML = '';
      for (let r=1;r<=12;r++){
        const tr = document.createElement('tr');
        for (let c=1;c<=12;c++){
          const td = document.createElement('td');
          const foundIndex = GAME.questions.findIndex(q => q.a===r && q.b===c);
          if (foundIndex >= 0) {
            const correct = GAME.answers[foundIndex] === GAME.questions[foundIndex].result;
            const answered = typeof GAME.answers[foundIndex] !== 'undefined' && GAME.answers[foundIndex] !== null && GAME.answers[foundIndex] !== '';
            if (correct) td.classList.add('cell-correct');
            else if (!answered) td.classList.add('cell-missed');
            else td.classList.add('cell-incorrect');
          }
          tr.appendChild(td);
        }
        resultsGrid.appendChild(tr);
      }
    }

    // error list
    if (errorsList) {
      errorsList.innerHTML = '';
      GAME.questions.forEach((q, idx) => {
        if (GAME.answers[idx] !== q.result) {
          const div = document.createElement('div');
          if (GAME.answers[idx] === '' || typeof GAME.answers[idx] === 'undefined' || isNaN(GAME.answers[idx])) {
            div.innerHTML = `${q.a} × ${q.b} = <span class="correct-answer">${q.result}</span> (Non répondu)`;
          } else {
            div.innerHTML = `${q.a} × ${q.b} = <span class="correct-answer">${q.result}</span> (Votre réponse : <span class="wrong-answer">${GAME.answers[idx]}</span>)`;
          }
          errorsList.appendChild(div);
        }
      });
    }

    // Stats saving
    statsData.sessions = statsData.sessions || [];
    statsData.sessions.push({
      date: new Date().toLocaleString(),
      score: successRate,
      correct: GAME.correct,
      incorrect: GAME.incorrect,
      duration: GAME.timeLimit - GAME.timeLeft
    });
    saveStatsData();

    updateStatsCharts({ questions: GAME.questions, answers: GAME.answers, score: GAME.score, total: GAME.total });
  }

  // new game / back buttons
  if (newGameBtn) newGameBtn.onclick = startGame;
  if (backToSettingsBtn) backToSettingsBtn.onclick = () => {
    if (resultsArea) resultsArea.style.display = 'none';
    if (homePage) homePage.style.display = 'block';
    if (gameArea) gameArea.style.display = 'none';
    if (tableDetailPage) tableDetailPage.style.display = 'none';
    window.scrollTo(0,0);
  };
  if (validateBtn) validateBtn.onclick = validateAnswer;

  // ----------------------- Rabbit animation -----------------------
  function updateRabbitPosition() {
    if (!GAME.noTimerMode && GAME.timeLimit > 0) {
      const elapsed = (APP_CONFIG.defaultTimeLimit*60 - GAME.timeLeft) / Math.max(1, APP_CONFIG.defaultTimeLimit*60);
      const track = document.querySelector('.track-container');
      if (!track) return;
      const trackWidth = track.offsetWidth - 40;
      const rabbit = document.getElementById('rabbit');
      if (rabbit) rabbit.style.left = `${Math.min(elapsed * trackWidth, trackWidth) + 5}px`;
      if (timeRemaining) {
        const m = Math.floor(GAME.timeLeft/60);
        const s = GAME.timeLeft%60;
        timeRemaining.textContent = `Temps restant: ${m}:${String(s).padStart(2,'0')}`;
      }
    }
  }

  // ----------------------- Events modaux / exports -----------------------
  if (settingsButtonMobile) settingsButtonMobile.onclick = openSettings;
  if (settingsButtonDesktop) settingsButtonDesktop.onclick = openSettings;
  if (closeSettingsModal) closeSettingsModal.onclick = closeSettings;
  if (cancelSettingsBtn) cancelSettingsBtn.onclick = closeSettings;
  if (saveSettingsBtn) saveSettingsBtn.onclick = saveSettings;

  if (exportCSVBtn) exportCSVBtn.addEventListener('click', exportToCSV);
  if (exportPDFBtn) exportPDFBtn.addEventListener('click', exportToPDF);
  if (modeClasseBtn) modeClasseBtn.addEventListener('click', activateClassMode);

  // close settings by clicking overlay
  if (settingsModal) settingsModal.onclick = (e) => { if (e.target === settingsModal) closeSettings(); };

  // keyboard: Enter to validate
  if (answerInput) answerInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      validateAnswer();
    }
  });

}); // end DOMContentLoaded

// ----------------------- MEDAL MESSAGES -----------------------
const MEDAL_MESSAGES = {
  gold: [
    "Tu as gagné la coupe OR, félicitations tu as réussi une vraie prouesse !",
    "Incroyable ! Tu maîtrises parfaitement tes tables, c'est de l'OR pur !",
    "Champion(ne) ! Ton résultat est exceptionnel, tu mérites cette médaille d'OR !"
  ],
  silver: [
    "Très bien ! Tu as décroché la médaille d'ARGENT, c'est un excellent résultat !",
    "Bravo ! Ton travail sérieux t'a mené à cette belle médaille d'ARGENT !"
  ],
  bronze: [
    "Bien ! Tu as obtenu la médaille de BRONZE, c'est un bon début !",
    "Pas mal ! Cette médaille de BRONZE montre que tu progresses !"
  ],
  paper: [
    "Ne te décourage pas ! Avec plus d'entraînement, tu vas y arriver !",
    "Courage ! Les tables demandent de la pratique, continue !"
  ]
};

function getRandomMedalMessage(medalType) {
  const arr = MEDAL_MESSAGES[medalType] || MEDAL_MESSAGES.paper;
  return arr[Math.floor(Math.random()*arr.length)];
}

