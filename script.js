(function () {
  // Configuracoes salvas: nomes usados no localStorage para manter preferencias do visitante.
  const STORAGE_KEYS = {
    mode: "agrinho-mode",
    mural: "agrinho-mural",
    fontScale: "agrinho-font-scale",
    readingMode: "agrinho-reading-mode",
    achievements: "agrinho-achievements",
    journey: "agrinho-living-journey",
    defaultsVersion: "agrinho-defaults-version",
  };

  const DEFAULT_SETTINGS = {
    mode: "night",
    fontScale: "small",
    volume: 15,
    version: "2026-06-audio-defaults",
  };

  const fontScaleOrder = ["small", "normal", "large", "extra"];
  const mobileDialogQuery = window.matchMedia("(max-width: 820px)");

  // Dados do simulador: cada pratica altera indicadores de agua, biodiversidade, economia e cidade.
  const strategyValues = {
    irrigacao: {
      water: 16,
      biodiversity: 8,
      economy: 10,
      city: 6,
      highlight: "A irrigação inteligente reduz desperdício e protege nascentes.",
    },
    energia: {
      water: 4,
      biodiversity: 7,
      economy: 15,
      city: 7,
      highlight: "Energia limpa diminui custos e torna a produção mais resiliente.",
    },
    compostagem: {
      water: 7,
      biodiversity: 15,
      economy: 8,
      city: 5,
      highlight: "Compostagem devolve vida ao solo e reduz resíduos do processo produtivo.",
    },
    logistica: {
      water: 2,
      biodiversity: 5,
      economy: 11,
      city: 17,
      highlight: "Rotas mais conscientes encurtam distâncias e diminuem perdas até a cidade.",
    },
  };

  const focusBoost = {
    solo: { biodiversity: 10, water: 4, economy: 2, city: 1 },
    agua: { water: 12, biodiversity: 5, economy: 2, city: 1 },
    energia: { economy: 7, city: 4, biodiversity: 2, water: 1 },
    cidade: { city: 12, economy: 5, water: 2, biodiversity: 1 },
  };

  const messageByPeriod = {
    madrugada: {
      title: "Madrugada de monitoramento",
      text: "Mesmo no silêncio da noite, a tecnologia pode cuidar do campo com precisão e economia.",
    },
    manha: {
      title: "Manhã de cuidado",
      text: "Toda boa colheita começa em escolhas pequenas, repetidas com responsabilidade.",
    },
    tarde: {
      title: "Tarde de produtividade consciente",
      text: "Produzir mais faz sentido quando a natureza continua forte para o próximo ciclo.",
    },
    noite: {
      title: "Noite de reflexão",
      text: "A cidade também participa do equilíbrio quando consome com mais consciência.",
    },
  };

  const quotePool = [
    "Sustentabilidade é quando a produção de hoje não compromete a colheita de amanhã.",
    "Tecnologia faz mais sentido quando ajuda a cuidar da terra, da água e das pessoas.",
    "Cada alimento carrega uma historia. Quanto mais consciente o manejo, mais forte o futuro.",
    "Campo e cidade não competem: se completam quando existe responsabilidade dos dois lados.",
  ];

  const musicPlaylist = [
    {
      title: "Musica 1",
      src: "musica/musica1.mp3",
    },
    {
      title: "Musica 2",
      src: "musica/musica2.mp3",
    },
    {
      title: "Musica 3",
      src: "musica/musica3.mp3",
    },
  ];

  const ambientModes = [
    {
      title: "Bosque",
      description: "pássaros, folhas e clima de mata.",
      src: "musica/bosque.mp3",
    },
    {
      title: "Chuva",
      description: "chuva leve para uma sensação de cuidado com a água.",
      src: "musica/chuva.mp3",
    },
    {
      title: "Vento",
      description: "brisa constante para leitura tranquila.",
      src: "musica/vento.mp3",
    },
  ];

  const priorityText = {
    agua: "defender o uso inteligente da água",
    solo: "valorizar a saúde do solo",
    energia: "ampliar a energia limpa no agro",
    consumo: "estimular um consumo mais consciente na cidade",
  };

  const roleText = {
    estudante: "Como estudante, eu quero aprender, compartilhar e agir com responsabilidade.",
    campo: "Falando a partir do campo, eu reconheço que produzir bem também é preservar.",
    cidade: "Falando a partir da cidade, eu escolho consumir com mais consciência e respeito pela origem.",
  };

  const focusLabel = {
    solo: "proteção do solo",
    agua: "cuidado com a água",
    energia: "energia limpa",
    cidade: "aproximação entre campo e cidade",
  };

  const timelineData = {
    antes: {
      title: "Antes: perdas e desgaste",
      text: "Manejo sem planejamento, desperdício de água e perda de solo reduziam a produtividade e aumentavam a pressão sobre a natureza.",
      items: [
        "Desmatamento e erosão diminuem a vida do solo.",
        "Desperdício de alimento enfraquece a segurança alimentar.",
        "Consumo distante da origem dificulta escolhas conscientes.",
      ],
    },
    hoje: {
      title: "Hoje: tecnologia no campo",
      text: "Sensores, irrigação inteligente, plantio direto, cooperação e dados ajudam o produtor a decidir com mais precisão.",
      items: [
        "Agricultura de precisão usa dados para reduzir perdas.",
        "Irrigação planejada protege a água e melhora a eficiência.",
        "Rotação de culturas e cobertura vegetal fortalecem o solo.",
      ],
    },
    futuro: {
      title: "Futuro: equilíbrio permanente",
      text: "O objetivo e produzir alimentos com energia limpa, biodiversidade protegida, renda no campo e consumidores mais conscientes.",
      items: [
        "Energia limpa e automação tornam a produção mais resiliente.",
        "Áreas de preservação protegem nascentes, fauna e flora.",
        "Campo e cidade compartilham responsabilidade pelo alimento.",
      ],
    },
  };

  const quizQuestions = [
    {
      question: "Qual prática ajuda a preservar o solo?",
      options: ["Queimada", "Rotação de culturas", "Desmatamento"],
      answer: 1,
      explanation: "A rotação de culturas ajuda a manter nutrientes, reduzir pragas e proteger a estrutura do solo.",
    },
    {
      question: "O que a irrigação inteligente busca reduzir?",
      options: ["Desperdício de água", "Biodiversidade", "Cobertura vegetal"],
      answer: 0,
      explanation: "Sensores e planejamento levam água na medida certa, diminuindo perdas e aumentando eficiência.",
    },
    {
      question: "Por que reduzir perda e desperdício de alimentos é importante?",
      options: ["Aumenta a pressão sobre o campo", "Melhora disponibilidade e evita uso desnecessário de recursos", "Impede a produção local"],
      answer: 1,
      explanation: "Quando menos alimento se perde, água, energia, solo e trabalho são melhor aproveitados.",
    },
    {
      question: "Qual fonte de energia combina com uma fazenda mais sustentável?",
      options: ["Energia solar", "Queima de residuos sem controle", "Motor ligado sem necessidade"],
      answer: 0,
      explanation: "A energia solar reduz custos e diminui a dependência de fontes mais poluentes.",
    },
    {
      question: "O que uma mata ciliar ajuda a proteger?",
      options: ["Apenas estradas", "Rios, nascentes e biodiversidade", "Somente maquinas agricolas"],
      answer: 1,
      explanation: "A vegetação nas margens protege a água, reduz erosão e cria abrigo para espécies.",
    },
    {
      question: "Como a cidade participa do agro sustentável?",
      options: ["Desperdiçando mais", "Valorizando origem, reduzindo perdas e consumindo com consciência", "Ignorando o produtor"],
      answer: 1,
      explanation: "O consumo consciente reconhece boas práticas e fortalece a ponte entre campo e cidade.",
    },
  ];

  // Conquistas: lista de trofeus liberados conforme o usuario interage com o site.
  const achievementDefinitions = [
    { id: "agua", title: "Guardião da Água", description: "Explorou o rio ou ativou práticas de cuidado com a água." },
    { id: "solo", title: "Defensor do Solo", description: "Investigou plantio, rotação de culturas e saúde do solo." },
    { id: "energia", title: "Energia Limpa", description: "Conheceu a área solar e escolhas de baixo impacto." },
    { id: "pesquisa", title: "Pesquisador do Agro", description: "Visitou os dados reais e conectou o site a fontes oficiais." },
    { id: "quiz", title: "Aprendiz Sustentavel", description: "Concluiu o quiz educativo do projeto." },
    { id: "compromisso", title: "Voz do Futuro", description: "Gerou e guardou um manifesto no mural." },
  ];

  const journeyMilestones = ["simulator", "data", "quiz", "pledge", "planting"];
  const seedStageNames = [
    "Semente adormecida",
    "Primeira raiz",
    "Broto consciente",
    "Planta em crescimento",
    "Flor do equilíbrio",
    "Árvore do futuro",
  ];

  const tourSteps = [
    {
      target: "#inicio",
      title: "Bem-vindo ao Raiz Up!",
      text: "Eu sou o Raizinho. Vou conduzir você pelos pontos principais e mostrar como campo, cidade e natureza se conectam.",
      audio: "musica/parte 1 de 8.m4a",
    },
    {
      target: "#visao",
      title: "Tudo começa pelo equilíbrio",
      text: "Produzir bem não significa escolher entre desenvolvimento e natureza. O objetivo é fortalecer o solo, a água, as pessoas e a economia ao mesmo tempo.",
      audio: "musica/parte 2 de 8.m4a",
    },
    {
      target: "#simulador",
      title: "Você decide o cenário",
      text: "No simulador, combine práticas sustentáveis e observe como cada escolha muda os indicadores de água, biodiversidade, economia e cidade.",
      audio: "musica/parte 3 de 8.m4a",
    },
    {
      target: "#dados",
      title: "Informação também cultiva futuro",
      text: "Esta parte reúne dados e fontes para ligar a experiência interativa a pesquisas reais sobre produção, desperdício e preservação.",
      audio: "musica/parte 4 de 8.m4a",
    },
    {
      target: "#rota",
      title: "Do campo até a cidade",
      text: "A rota mostra que plantio, transporte, comércio e consumo fazem parte da mesma cadeia. Melhorar uma etapa ajuda todas as outras.",
      audio: "musica/parte 5 de 8.m4a",
    },
    {
      target: "#painel",
      title: "Uma fazenda para explorar",
      text: "No painel interativo, você pode investigar áreas da fazenda modelo e descobrir práticas que protegem recursos sem enfraquecer a produção.",
      audio: "musica/parte 6 de 8.m4a",
    },
    {
      target: "#quiz",
      title: "Agora vale testar o aprendizado",
      text: "O quiz transforma o conteúdo em desafio. Cada resposta vem com uma explicação para ajudar você a revisar o tema.",
      audio: "musica/parte 7 de 8.m4a",
    },
    {
      target: "#compromisso",
      title: "Sua ação fecha a história",
      text: "No final, crie um manifesto e registre uma atitude possível. Sustentabilidade ganha força quando o conhecimento vira compromisso.",
      audio: "musica/parte 8 de 8.m4a",
    },
  ];

  const TOUR_STEP_DURATION = 9000;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Elementos da pagina: referencias do DOM usadas pelas interacoes em JavaScript.
  const html = document.documentElement;
  const body = document.body;
  const faviconLink = document.getElementById("faviconLink");
  const brandMarkImage = document.getElementById("brandMarkImage");
  const settingsToggleButton = document.getElementById("settingsToggleButton");
  const settingsCloseButton = document.getElementById("settingsCloseButton");
  const settingsOverlay = document.getElementById("settingsOverlay");
  const settingsPanel = document.getElementById("settingsPanel");
  const themeChoiceButtons = Array.from(document.querySelectorAll("[data-theme-choice]"));
  const quoteButton = document.getElementById("quoteButton");
  const tourStartButton = document.getElementById("tourStartButton");
  const siteTour = document.getElementById("siteTour");
  const tourAudio = document.getElementById("tourAudio");
  const tourCloseButton = document.getElementById("tourCloseButton");
  const tourCharacter = document.getElementById("tourCharacter");
  const tourCounter = document.getElementById("tourCounter");
  const tourTitle = document.getElementById("tourTitle");
  const tourText = document.getElementById("tourText");
  const tourProgressFill = document.getElementById("tourProgressFill");
  const tourPreviousButton = document.getElementById("tourPreviousButton");
  const tourAutoButton = document.getElementById("tourAutoButton");
  const tourVoiceButton = document.getElementById("tourVoiceButton");
  const tourNextButton = document.getElementById("tourNextButton");
  const dayMessageTitle = document.getElementById("dayMessageTitle");
  const dayMessageText = document.getElementById("dayMessageText");
  const themeAudio = document.getElementById("themeAudio");
  const audioPrevButton = document.getElementById("audioPrevButton");
  const audioToggleButton = document.getElementById("audioToggleButton");
  const audioNextButton = document.getElementById("audioNextButton");
  const audioVolumeRange = document.getElementById("audioVolumeRange");
  const audioStatus = document.getElementById("audioStatus");
  const ambientAudio = document.getElementById("ambientAudio");
  const ambientPrevButton = document.getElementById("ambientPrevButton");
  const ambientToggleButton = document.getElementById("ambientToggleButton");
  const ambientNextButton = document.getElementById("ambientNextButton");
  const ambientVolumeRange = document.getElementById("ambientVolumeRange");
  const ambientStatus = document.getElementById("ambientStatus");
  const fontDecreaseButton = document.getElementById("fontDecreaseButton");
  const fontResetButton = document.getElementById("fontResetButton");
  const fontIncreaseButton = document.getElementById("fontIncreaseButton");
  const readerButton = document.getElementById("readerButton");
  const readerStopButton = document.getElementById("readerStopButton");
  const summaryAudio = document.getElementById("summaryAudio");
  const readingModeButton = document.getElementById("readingModeButton");
  const readerStatus = document.getElementById("readerStatus");
  const achievementList = document.getElementById("achievementList");
  const achievementToastArea = document.getElementById("achievementToastArea");
  const quickDock = document.getElementById("quickDock");
  const quickDockPanel = document.getElementById("quickDockPanel");
  const quickDockToggleButton = document.getElementById("quickDockToggleButton");
  const quickMusicStatus = document.getElementById("quickMusicStatus");
  const quickMusicPrevButton = document.getElementById("quickMusicPrevButton");
  const quickMusicToggleButton = document.getElementById("quickMusicToggleButton");
  const quickMusicNextButton = document.getElementById("quickMusicNextButton");
  const quickAmbientStatus = document.getElementById("quickAmbientStatus");
  const quickAmbientPrevButton = document.getElementById("quickAmbientPrevButton");
  const quickAmbientToggleButton = document.getElementById("quickAmbientToggleButton");
  const quickAmbientNextButton = document.getElementById("quickAmbientNextButton");
  const quickReaderStatus = document.getElementById("quickReaderStatus");
  const quickReaderButton = document.getElementById("quickReaderButton");
  const quickReaderStopButton = document.getElementById("quickReaderStopButton");
  const quickTopButton = document.getElementById("quickTopButton");
  const quickAchievementCount = document.getElementById("quickAchievementCount");

  const careRange = document.getElementById("careRange");
  const careRangeValue = document.getElementById("careRangeValue");
  const focusSelect = document.getElementById("focusSelect");
  const strategyInputs = Array.from(document.querySelectorAll('input[name="strategy"]'));
  const resetScenarioButton = document.getElementById("resetScenarioButton");

  const balanceGauge = document.getElementById("balanceGauge");
  const balanceScore = document.getElementById("balanceScore");
  const balanceLevel = document.getElementById("balanceLevel");
  const waterMetric = document.getElementById("waterMetric");
  const biodiversityMetric = document.getElementById("biodiversityMetric");
  const economyMetric = document.getElementById("economyMetric");
  const cityMetric = document.getElementById("cityMetric");
  const impactNarrative = document.getElementById("impactNarrative");
  const impactHighlights = document.getElementById("impactHighlights");
  const timelineButtons = Array.from(document.querySelectorAll("[data-timeline]"));
  const dataSourceLinks = Array.from(document.querySelectorAll(".data-card a"));
  const timelineTitle = document.getElementById("timelineTitle");
  const timelineText = document.getElementById("timelineText");
  const timelineList = document.getElementById("timelineList");

  const pledgeForm = document.getElementById("pledgeForm");
  const pledgePreview = document.getElementById("pledgePreview");
  const pledgeStatus = document.getElementById("pledgeStatus");
  const savePledgeButton = document.getElementById("savePledgeButton");
  const clearPledgesButton = document.getElementById("clearPledgesButton");
  const pledgeWall = document.getElementById("pledgeWall");
  const zoneButtons = Array.from(document.querySelectorAll("[data-zone]"));
  const zoneTitle = document.getElementById("zoneTitle");
  const zoneText = document.getElementById("zoneText");
  const zoneFieldValue = document.getElementById("zoneFieldValue");
  const zoneNatureValue = document.getElementById("zoneNatureValue");
  const zoneCityValue = document.getElementById("zoneCityValue");
  const zoneSignalValue = document.getElementById("zoneSignalValue");
  const zoneSignalText = document.getElementById("zoneSignalText");
  const zonePracticeList = document.getElementById("zonePracticeList");
  const observatoryMobileOpenButton = document.getElementById("observatoryMobileOpenButton");
  const observatoryMobileCloseButton = document.getElementById("observatoryMobileCloseButton");
  const observatoryDetailCloseButton = document.getElementById("observatoryDetailCloseButton");
  const quizStartButton = document.getElementById("quizStartButton");
  const quizSectionResult = document.getElementById("quizSectionResult");
  const quizModalOverlay = document.getElementById("quizModalOverlay");
  const quizModal = document.getElementById("quizModal");
  const quizCloseButton = document.getElementById("quizCloseButton");
  const quizProgressFill = document.getElementById("quizProgressFill");
  const quizCounter = document.getElementById("quizCounter");
  const quizQuestion = document.getElementById("quizQuestion");
  const quizOptions = document.getElementById("quizOptions");
  const quizFeedback = document.getElementById("quizFeedback");
  const quizNextButton = document.getElementById("quizNextButton");
  const quizRestartButton = document.getElementById("quizRestartButton");
  const quizScoreValue = document.getElementById("quizScoreValue");
  const quizResultText = document.getElementById("quizResultText");
  const livingRoots = document.getElementById("livingRoots");
  const rootPaths = Array.from(document.querySelectorAll(".root-path"));
  const seedCompanion = document.getElementById("seedCompanion");
  const seedCompanionButton = document.getElementById("seedCompanionButton");
  const seedCompanionDetails = document.getElementById("seedCompanionDetails");
  const seedStageLabel = document.getElementById("seedStageLabel");
  const seedProgressFill = document.getElementById("seedProgressFill");
  const seedProgressText = document.getElementById("seedProgressText");
  const seedField = document.getElementById("seedField");
  const blowMeterFill = document.getElementById("blowMeterFill");
  const blowStartButton = document.getElementById("blowStartButton");
  const plantFallbackButton = document.getElementById("plantFallbackButton");
  const blowStatus = document.getElementById("blowStatus");
  const futureCompare = document.getElementById("futureCompare");
  const futureRange = document.getElementById("futureRange");
  const futureScenarioTitle = document.getElementById("futureScenarioTitle");
  const futureScenarioText = document.getElementById("futureScenarioText");
  const futureTreeLayer = document.getElementById("futureTreeLayer");
  const futureFishLayer = document.getElementById("futureFishLayer");
  const futureEnergyLayer = document.getElementById("futureEnergyLayer");
  const futureFoodLayer = document.getElementById("futureFoodLayer");
  const futureTreeCount = document.getElementById("futureTreeCount");
  const futureFishCount = document.getElementById("futureFishCount");
  const futureEnergyCount = document.getElementById("futureEnergyCount");
  const futureFoodCount = document.getElementById("futureFoodCount");
  const futureNewspaper = document.getElementById("futureNewspaper");
  const newspaperKicker = document.getElementById("newspaperKicker");
  const newspaperHeadline = document.getElementById("newspaperHeadline");
  const newspaperSubheadline = document.getElementById("newspaperSubheadline");
  const newspaperLeadTitle = document.getElementById("newspaperLeadTitle");
  const newspaperLeadText = document.getElementById("newspaperLeadText");
  const newspaperWater = document.getElementById("newspaperWater");
  const newspaperBiodiversity = document.getElementById("newspaperBiodiversity");
  const newspaperScore = document.getElementById("newspaperScore");
  const newspaperSignature = document.getElementById("newspaperSignature");
  const newspaperSeedStage = document.getElementById("newspaperSeedStage");
  const refreshNewspaperButton = document.getElementById("refreshNewspaperButton");
  const downloadNewspaperButton = document.getElementById("downloadNewspaperButton");
  const newspaperStatus = document.getElementById("newspaperStatus");
  const newspaperCanvas = document.getElementById("newspaperCanvas");
  const newspaperTreeLayer = document.getElementById("newspaperTreeLayer");
  const newspaperFishLayer = document.getElementById("newspaperFishLayer");
  const newspaperEnergyLayer = document.getElementById("newspaperEnergyLayer");
  const newspaperCropLayer = document.getElementById("newspaperCropLayer");

  // Estado interno: guarda a situacao atual de audio, quiz, mural, painel e simulador.
  let currentManifesto = "";
  let settingsHideTimer = null;
  let activeZone = "plantio";
  let currentMusicIndex = 0;
  let currentAmbientIndex = 0;
  let ambientPlaying = false;
  let achievementAudioContext = null;
  let readingSummary = false;
  let currentFontScale = "normal";
  let activeTimeline = "antes";
  let quizIndex = 0;
  let quizScore = 0;
  let quizAnswered = false;
  let quizCompleted = false;
  let quizHideTimer = null;
  let activeQuizQuestions = [];
  let currentTourIndex = 0;
  let tourTimer = null;
  let tourRevealTimer = null;
  let tourVoiceEnabled = true;
  let tourAutoPlaying = !reducedMotionQuery.matches;
  let tourAudioNeedsGesture = false;
  let highlightedTourTarget = null;
  let microphoneStream = null;
  let microphoneAudioContext = null;
  let microphoneAnimationFrame = 0;
  let lastBlowPlantTime = 0;
  let lastQuizPercentage = 0;
  let scenarioInteractionStarted = false;
  const unlockedAchievements = new Set(getStoredAchievements());
  const livingJourney = getStoredJourney();
  const currentScenarioReadings = {
    water: 0,
    biodiversity: 0,
    economy: 0,
    city: 0,
    score: 0,
    focus: "solo",
    strategies: [],
    intensity: 1,
    ecosystem: {
      trees: 0,
      dryTrees: 0,
      fish: 0,
      energy: 0,
      food: 0,
    },
  };

  // Preferencias e mensagens: aplica tema, fonte, modo leitura e frase do periodo do dia.
  function getPeriodMessage() {
    const hour = new Date().getHours();

    if (hour < 6) {
      return messageByPeriod.madrugada;
    }

    if (hour < 12) {
      return messageByPeriod.manha;
    }

    if (hour < 18) {
      return messageByPeriod.tarde;
    }

    return messageByPeriod.noite;
  }

  function syncThemeButtons(mode) {
    themeChoiceButtons.forEach((button) => {
      const isActive = button.dataset.themeChoice === mode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function setTheme(mode) {
    const nextMode = mode === "night" ? "night" : "day";
    html.dataset.mode = nextMode;
    localStorage.setItem(STORAGE_KEYS.mode, nextMode);
    syncThemeButtons(nextMode);
  }

  function applyDefaultPreferences() {
    if (localStorage.getItem(STORAGE_KEYS.defaultsVersion) === DEFAULT_SETTINGS.version) {
      return;
    }

    localStorage.setItem(STORAGE_KEYS.mode, DEFAULT_SETTINGS.mode);
    localStorage.setItem(STORAGE_KEYS.fontScale, DEFAULT_SETTINGS.fontScale);
    localStorage.setItem(STORAGE_KEYS.defaultsVersion, DEFAULT_SETTINGS.version);
  }

  function applyStoredMode() {
    const storedMode = localStorage.getItem(STORAGE_KEYS.mode);
    setTheme(storedMode === "day" ? "day" : "night");
  }

  function applyFontScale(scale) {
    currentFontScale = fontScaleOrder.includes(scale) ? scale : "normal";
    if (currentFontScale === "normal") {
      delete html.dataset.fontScale;
    } else {
      html.dataset.fontScale = currentFontScale;
    }
    localStorage.setItem(STORAGE_KEYS.fontScale, currentFontScale);
    readerStatus.textContent = `Tamanho da fonte ajustado para ${currentFontScale}.`;
  }

  function changeFontScale(direction) {
    const currentIndex = fontScaleOrder.indexOf(currentFontScale);
    const nextIndex = Math.max(0, Math.min(fontScaleOrder.length - 1, currentIndex + direction));
    applyFontScale(fontScaleOrder[nextIndex]);
  }

  function applyReadingMode(enabled) {
    body.classList.toggle("reading-mode", enabled);
    readingModeButton.setAttribute("aria-pressed", enabled ? "true" : "false");
    readingModeButton.textContent = enabled ? "Sair do modo leitura" : "Modo leitura";
    faviconLink.href = enabled ? "./img/favicon2.png" : "./img/favicon.png";
    brandMarkImage.src = enabled ? "./img/favicon2.png" : "./img/favicon.png";
    localStorage.setItem(STORAGE_KEYS.readingMode, enabled ? "true" : "false");
  }

  function wrapIndex(index, total) {
    return ((index % total) + total) % total;
  }

  function getCurrentMusicTrack() {
    return musicPlaylist[currentMusicIndex] || musicPlaylist[0];
  }

  function getCurrentAmbientMode() {
    return ambientModes[currentAmbientIndex] || ambientModes[0];
  }

  function setQuickDockOpen(open) {
    body.classList.toggle("quick-dock-open", open);
    quickDockPanel.setAttribute("aria-hidden", open ? "false" : "true");
    quickDockPanel.inert = !open;
    quickDockToggleButton.setAttribute("aria-expanded", open ? "true" : "false");
    quickDockToggleButton.setAttribute("aria-label", open ? "Fechar atalhos rapidos" : "Abrir atalhos rapidos");
  }

  function updateQuickDockState() {
    const track = getCurrentMusicTrack();
    const ambientMode = getCurrentAmbientMode();
    const musicPlaying = !themeAudio.paused && !themeAudio.ended;
    ambientPlaying = !ambientAudio.paused && !ambientAudio.ended;

    quickDock.classList.toggle("is-music-active", musicPlaying);
    quickDock.classList.toggle("is-nature-active", ambientPlaying);
    quickDock.classList.toggle("is-reading-active", readingSummary);

    audioToggleButton.textContent = musicPlaying ? "Pause" : "Play";
    audioToggleButton.setAttribute("aria-label", musicPlaying ? "Pausar música do site" : "Tocar música do site");
    quickMusicToggleButton.textContent = musicPlaying ? "Pause" : "Play";
    quickMusicToggleButton.setAttribute("aria-label", musicPlaying ? "Pausar música" : "Tocar música");
    quickMusicStatus.textContent = `${musicPlaying ? "Tocando" : "Pausada"} | ${currentMusicIndex + 1}/${musicPlaylist.length} - ${track.title}`;

    ambientToggleButton.textContent = ambientPlaying ? "Pause" : "Play";
    ambientToggleButton.setAttribute("aria-label", ambientPlaying ? "Pausar sons ambientais" : "Ativar sons ambientais");
    quickAmbientToggleButton.textContent = ambientPlaying ? "Pause" : "Play";
    quickAmbientToggleButton.setAttribute("aria-label", ambientPlaying ? "Pausar sons da natureza" : "Ativar sons da natureza");
    quickAmbientStatus.textContent = `${ambientPlaying ? "Ativo" : "Pausado"} | ${currentAmbientIndex + 1}/${ambientModes.length} - ${ambientMode.title}`;

    quickReaderButton.textContent = readingSummary ? "Lendo" : "Ler";
    quickReaderStopButton.disabled = !readingSummary;
    readerStopButton.disabled = !readingSummary;
    quickReaderStatus.textContent = readingSummary ? "Resumo em leitura" : "Leitura pronta";

    quickAchievementCount.textContent = `${unlockedAchievements.size}/${achievementDefinitions.length}`;
  }

  // Leitura em voz alta: reproduz a narração gravada do resumo do projeto.
  async function readPageSummary() {
    summaryAudio.currentTime = 0;
    try {
      await summaryAudio.play();
    } catch (error) {
      readingSummary = false;
      readerStatus.textContent = "Não foi possível iniciar o áudio do resumo.";
      updateQuickDockState();
    }
  }

  function stopPageSummary() {
    summaryAudio.pause();
    summaryAudio.currentTime = 0;
    readingSummary = false;
    readerStatus.textContent = "Leitura parada.";
    updateQuickDockState();
  }

  // Menu de configuracoes: abre e fecha o painel lateral sem recarregar a pagina.
  function openSettings() {
    clearTimeout(settingsHideTimer);
    settingsOverlay.hidden = false;
    settingsPanel.hidden = false;
    window.requestAnimationFrame(function () {
      body.classList.add("settings-open");
    });
    settingsPanel.setAttribute("aria-hidden", "false");
    settingsToggleButton.setAttribute("aria-expanded", "true");
    settingsToggleButton.setAttribute("aria-label", "Fechar menu de configuração");
  }

  function closeSettings() {
    body.classList.remove("settings-open");
    settingsPanel.setAttribute("aria-hidden", "true");
    settingsToggleButton.setAttribute("aria-expanded", "false");
    settingsToggleButton.setAttribute("aria-label", "Abrir menu de configuração");
    settingsHideTimer = window.setTimeout(function () {
      settingsOverlay.hidden = true;
      settingsPanel.hidden = true;
    }, 220);
  }

  function setDayMessage(message) {
    dayMessageTitle.textContent = message.title;
    dayMessageText.textContent = message.text;
  }

  // Jornada integrada: conecta simulador, pesquisa, quiz, plantio e compromisso.
  function getStoredJourney() {
    const defaults = {
      simulator: false,
      data: false,
      quiz: false,
      pledge: false,
      planting: false,
      plantCount: 0,
      quizPercentage: 0,
    };

    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.journey) || "{}");
      return { ...defaults, ...stored };
    } catch (error) {
      return defaults;
    }
  }

  function saveLivingJourney() {
    localStorage.setItem(STORAGE_KEYS.journey, JSON.stringify(livingJourney));
  }

  function getCompletedJourneyCount() {
    return journeyMilestones.filter((key) => Boolean(livingJourney[key])).length;
  }

  function getSeedStage() {
    const stageByCount = [0, 1, 2, 3, 4, 5];
    return stageByCount[getCompletedJourneyCount()] || 0;
  }

  function getSeedVariant() {
    return ["solo", "agua", "energia", "cidade"].includes(currentScenarioReadings.focus)
      ? currentScenarioReadings.focus
      : "solo";
  }

  function renderSeedCompanion() {
    const completed = getCompletedJourneyCount();
    const stage = getSeedStage();
    const variant = getSeedVariant();
    seedCompanion.dataset.stage = String(stage);
    seedCompanion.dataset.variant = variant;
    body.dataset.seedStage = String(stage);
    seedStageLabel.textContent = seedStageNames[stage];
    seedProgressFill.style.width = `${(completed / journeyMilestones.length) * 100}%`;
    seedProgressText.textContent = `${completed} de ${journeyMilestones.length} experiências`;
    renderFutureNewspaper();
  }

  function setSeedCompanionExpanded(expanded) {
    seedCompanion.classList.toggle("is-expanded", expanded);
    seedCompanionButton.setAttribute("aria-expanded", String(expanded));
    seedCompanionDetails.setAttribute("aria-hidden", String(!expanded));
  }

  function completeJourneyMilestone(key, extraData) {
    if (!journeyMilestones.includes(key)) {
      return;
    }

    const wasComplete = Boolean(livingJourney[key]);
    livingJourney[key] = true;
    if (extraData && typeof extraData === "object") {
      Object.assign(livingJourney, extraData);
    }
    saveLivingJourney();
    renderSeedCompanion();

    if (!wasComplete) {
      seedCompanion.animate(
        [
          { transform: "scale(1) translateY(0)" },
          { transform: "scale(1.08) translateY(-6px)" },
          { transform: "scale(1) translateY(0)" },
        ],
        { duration: 700, easing: "ease-out" }
      );
    }
  }

  function updateLivingRoots() {
    if (!livingRoots || rootPaths.length === 0) {
      return;
    }

    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    rootPaths.forEach((path, index) => {
      const delayedProgress = Math.max(0, Math.min(1, progress * 1.24 - index * 0.12));
      path.style.strokeDashoffset = String(1 - delayedProgress);
    });
  }

  function clampNumber(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function calculateEcosystem() {
    const strategies = currentScenarioReadings.strategies;
    const coverage = strategies.length / 4;
    const intensityRatio = (currentScenarioReadings.intensity - 1) / 4;
    const hasIrrigation = strategies.includes("irrigacao");
    const hasEnergy = strategies.includes("energia");
    const hasCompost = strategies.includes("compostagem");
    const hasLogistics = strategies.includes("logistica");
    const isAbandoned = strategies.length === 0 && currentScenarioReadings.intensity === 1;

    let trees = Math.round(
      coverage * 5 +
      intensityRatio * 2 +
      (currentScenarioReadings.biodiversity / 100) * 2 +
      (currentScenarioReadings.focus === "solo" ? coverage : 0)
    );
    let fish = Math.round(
      coverage * 4 +
      intensityRatio * 2 +
      (currentScenarioReadings.water / 100) * 2.5 +
      (currentScenarioReadings.focus === "agua" ? 1 : 0) +
      (hasIrrigation ? 0.5 : 0)
    );
    let energy = Math.round(
      (hasEnergy ? 2 : 0) +
      coverage +
      intensityRatio * 1.5 +
      (currentScenarioReadings.economy / 100) +
      (currentScenarioReadings.focus === "energia" ? 1.5 : 0)
    );
    let food = Math.round(
      coverage * 3 +
      intensityRatio * 2 +
      ((currentScenarioReadings.biodiversity + currentScenarioReadings.economy) / 200) * 2 +
      (hasCompost ? 0.75 : 0) +
      (hasLogistics ? 0.5 : 0)
    );

    if (currentScenarioReadings.water < 30 && !hasIrrigation) fish = 0;
    if (isAbandoned) {
      trees = 0;
      fish = 0;
      energy = 0;
      food = 0;
    }

    trees = clampNumber(trees, 0, 10);
    fish = clampNumber(fish, 0, 10);
    energy = clampNumber(energy, 0, 6);
    food = clampNumber(food, 0, 8);

    return {
      trees,
      dryTrees: trees >= 8 ? 0 : clampNumber(Math.ceil((10 - trees) / 2), 1, 5),
      fish,
      energy,
      food,
      isAbandoned,
      quality: currentScenarioReadings.score >= 80 ? "flourishing" : currentScenarioReadings.score >= 60 ? "recovering" : currentScenarioReadings.score >= 40 ? "fragile" : "critical",
      river: currentScenarioReadings.water >= 65 ? "living" : currentScenarioReadings.water >= 40 ? "recovering" : "dry",
    };
  }

  function renderVisualItems(layer, count, className, offset) {
    if (!layer) return;
    layer.replaceChildren();
    for (let index = 0; index < count; index += 1) {
      const item = document.createElement("i");
      item.className = className;
      item.style.setProperty("--item-x", `${7 + ((index * 17 + offset) % 78)}%`);
      item.style.setProperty("--item-scale", String(0.72 + ((index * 13) % 30) / 100));
      item.style.setProperty("--item-delay", `${index * 70}ms`);
      item.style.setProperty("--item-row", String(index % 3));
      item.style.setProperty("--fish-column", `${(index % 4) * 18}px`);
      item.style.setProperty("--fish-band", `${Math.floor(index / 4) * 24}px`);
      item.style.setProperty("--panel-column", `${(index % 3) * 58}px`);
      item.style.setProperty("--panel-band", `${Math.floor(index / 3) * 48}px`);
      item.style.setProperty("--crop-column", `${(index % 4) * 48}px`);
      item.style.setProperty("--crop-band", `${Math.floor(index / 4) * 18}px`);
      item.style.setProperty("--paper-fish-column", `${(index % 4) * 13}px`);
      item.style.setProperty("--paper-fish-band", `${Math.floor(index / 4) * 18}px`);
      item.style.setProperty("--paper-panel-column", `${(index % 3) * 44}px`);
      item.style.setProperty("--paper-panel-band", `${Math.floor(index / 3) * 37}px`);
      item.style.setProperty("--paper-crop-column", `${(index % 4) * 34}px`);
      item.style.setProperty("--paper-crop-band", `${Math.floor(index / 4) * 14}px`);
      item.style.setProperty("--item-rotate", `${-8 + (index % 4) * 4}deg`);
      if (className.startsWith("ecosystem-tree")) {
        item.style.setProperty("--item-x", `${55 + (index % 5) * 8}%`);
        item.style.setProperty("--tree-bottom", `${21 + Math.floor(index / 5) * 19}%`);
      }
      layer.appendChild(item);
    }
  }

  function renderTwoFutures() {
    const score = currentScenarioReadings.score || 0;
    const ecosystem = calculateEcosystem();
    currentScenarioReadings.ecosystem = ecosystem;
    const scenarioHealth = Math.max(0.08, score / 100);
    futureCompare.style.setProperty("--scenario-health", String(scenarioHealth));
    futureCompare.style.setProperty("--future-saturation", String(0.55 + scenarioHealth * 0.65));
    futureCompare.style.setProperty("--future-brightness", String(0.72 + scenarioHealth * 0.35));
    futureCompare.dataset.focus = currentScenarioReadings.focus;
    futureCompare.dataset.quality = ecosystem.quality;
    futureCompare.dataset.river = ecosystem.river;

    renderVisualItems(futureTreeLayer, ecosystem.trees, "ecosystem-tree is-living", 2);
    for (let index = 0; index < ecosystem.dryTrees; index += 1) {
      const dryTree = document.createElement("i");
      dryTree.className = "ecosystem-tree is-dry";
      dryTree.style.setProperty("--item-x", `${57 + index * 8}%`);
      dryTree.style.setProperty("--tree-bottom", `${21 + (index % 2) * 17}%`);
      dryTree.style.setProperty("--item-scale", String(0.72 + index * 0.06));
      dryTree.style.setProperty("--item-delay", `${index * 80}ms`);
      futureTreeLayer.appendChild(dryTree);
    }
    renderVisualItems(futureFishLayer, ecosystem.fish, "ecosystem-fish", 5);
    renderVisualItems(futureEnergyLayer, ecosystem.energy, "ecosystem-panel", 12);
    renderVisualItems(futureFoodLayer, ecosystem.food, "ecosystem-crop", 4);

    futureTreeCount.textContent = String(ecosystem.trees);
    futureFishCount.textContent = String(ecosystem.fish);
    futureEnergyCount.textContent = String(ecosystem.energy);
    futureFoodCount.textContent = String(ecosystem.food);

    if (ecosystem.isAbandoned && currentScenarioReadings.focus === "solo") {
      futureScenarioTitle.textContent = "Solo seco e produção interrompida";
      futureScenarioText.textContent = "Com intensidade básica e nenhuma prática ativa, as 10 árvores desaparecem, a terra racha e a colheita chega a zero.";
    } else if (currentScenarioReadings.focus === "agua") {
      futureScenarioTitle.textContent = ecosystem.fish >= 8 ? "Rios vivos novamente" : ecosystem.fish > 0 ? "O rio começa a reagir" : "Rio sem vida suficiente";
      futureScenarioText.textContent = `A água sustenta ${ecosystem.fish} de 10 peixes e ${ecosystem.trees} árvores. Irrigação inteligente e maior intensidade recuperam o curso do rio.`;
    } else if (currentScenarioReadings.focus === "energia") {
      futureScenarioTitle.textContent = ecosystem.energy >= 5 ? "Energia limpa impulsiona a região" : "Transição energética incompleta";
      futureScenarioText.textContent = `${ecosystem.energy} de 6 estruturas de energia limpa aparecem no cenário e influenciam produção, renda e qualidade urbana.`;
    } else if (currentScenarioReadings.focus === "cidade") {
      futureScenarioTitle.textContent = ecosystem.food >= 6 ? "Campo e cidade bem conectados" : "Alimentos se perdem no caminho";
      futureScenarioText.textContent = `${ecosystem.food} de 8 áreas de colheita chegam saudáveis ao futuro. Logística e cuidado ambiental determinam o restante.`;
    } else if (ecosystem.trees === 10) {
      futureScenarioTitle.textContent = "Solo protegido, dez árvores de pé";
      futureScenarioText.textContent = "Todas as práticas e o cuidado máximo criaram a paisagem mais forte: 10 árvores vivas, colheita fértil e biodiversidade elevada.";
    } else {
      futureScenarioTitle.textContent = ecosystem.trees >= 6 ? "Solo em recuperação" : "Cobertura vegetal insuficiente";
      futureScenarioText.textContent = `${ecosystem.trees} de 10 árvores permanecem vivas. Cada prática desmarcada ou redução de intensidade deixa a paisagem mais seca.`;
    }
  }

  function getNewspaperStory() {
    const score = currentScenarioReadings.score || 0;
    const focus = currentScenarioReadings.focus;
    const ecosystem = currentScenarioReadings.ecosystem;

    if (ecosystem.isAbandoned) {
      const criticalStories = {
        solo: ["COLAPSO DO SOLO", "Paraná vê paisagem secar e colheitas desaparecerem", "Sem proteção e sem práticas ativas, o solo perde vida, água e capacidade produtiva."],
        agua: ["RIOS EM ALERTA", "Rios paranaenses perdem peixes e volume de água", "Ausência de cuidado deixa cursos d'água rasos e reduz a biodiversidade aquática."],
        energia: ["ENERGIA ESTAGNADA", "Campo enfrenta custos altos sem transição energética", "Nenhuma estrutura limpa foi implantada e a produção sente os efeitos da escolha."],
        cidade: ["DESPERDÍCIO EM ALTA", "Alimentos deixam de chegar às cidades do Paraná", "Logística frágil e falta de práticas sustentáveis ampliam perdas entre campo e mesa."],
      };
      const story = criticalStories[focus];
      return {
        kicker: story[0],
        headline: story[1],
        subheadline: story[2],
        leadTitle: "O cenário mais crítico da simulação",
        leadText: "Todas as práticas foram desmarcadas e a intensidade ficou no nível básico. A paisagem mostra diretamente essa decisão.",
      };
    }

    if (score >= 75) {
      const positiveStories = {
        solo: ["SOLO VIVO", "Paraná recupera matas e fortalece suas colheitas", `${ecosystem.trees} árvores simbolizam a nova cobertura vegetal criada pelas escolhas sustentáveis.`],
        agua: ["RIOS VIVOS", "Peixes voltam aos rios recuperados do Paraná", `${ecosystem.fish} indicadores de vida aquática aparecem após o avanço no cuidado com a água.`],
        energia: ["ENERGIA DO FUTURO", "Energia limpa transforma a produção paranaense", `${ecosystem.energy} estruturas renováveis reduzem custos e fortalecem comunidades rurais.`],
        cidade: ["CAMPO E CIDADE", "Logística consciente reduz desperdício de alimentos", `${ecosystem.food} áreas produtivas chegam fortalecidas à mesa das famílias paranaenses.`],
      };
      const story = positiveStories[focus];
      return {
        kicker: story[0],
        headline: story[1],
        subheadline: story[2],
        leadTitle: "As escolhas de hoje viraram notícia",
        leadText: "Tecnologia, preservação e consumo consciente avançaram juntos e mudaram a paisagem de 2040.",
      };
    }
    if (score >= 50) {
      return {
        kicker: "FUTURO EM DISPUTA",
        headline: "Paraná avança, mas recuperação ainda é desigual",
        subheadline: `${ecosystem.trees} árvores, ${ecosystem.fish} peixes e ${ecosystem.food} áreas de colheita revelam ganhos e pontos frágeis.`,
        leadTitle: "Cada decisão deixa uma marca",
        leadText: "A paisagem melhorou em alguns pontos, mas práticas desativadas ainda limitam água, biodiversidade e produção.",
      };
    }
    return {
      kicker: "ALERTA 2040",
      headline: focus === "agua" ? "Poucos peixes resistem à queda dos rios" : "Solo e produção pedem decisões urgentes no Paraná",
      subheadline: "A baixa intensidade das ações deixa sinais visíveis de seca, perda de vida e desperdício.",
      leadTitle: "Ainda existe tempo para mudar",
      leadText: "Marcar novas práticas e aumentar o cuidado reconstrói a paisagem, elemento por elemento.",
    };
  }

  function renderFutureNewspaper() {
    if (!futureNewspaper) {
      return;
    }

    const story = getNewspaperStory();
    const stage = getSeedStage();
    const name = String(document.getElementById("personName")?.value || "").trim();
    newspaperKicker.textContent = story.kicker;
    newspaperHeadline.textContent = story.headline;
    newspaperSubheadline.textContent = story.subheadline;
    newspaperLeadTitle.textContent = story.leadTitle;
    newspaperLeadText.textContent = livingJourney.quiz
      ? `${story.leadText} A jornada educativa terminou com ${Number(livingJourney.quizPercentage || lastQuizPercentage)}% de acertos.`
      : story.leadText;
    newspaperWater.textContent = `${currentScenarioReadings.water || 0}%`;
    newspaperBiodiversity.textContent = `${currentScenarioReadings.biodiversity || 0}%`;
    newspaperScore.textContent = `${currentScenarioReadings.score || 0}%`;
    newspaperSignature.textContent = name ? `Edição cultivada por ${name}` : "Capa criada pela comunidade Raiz Up";
    newspaperSeedStage.textContent = `Semente Viva: ${seedStageNames[stage]}`;
    futureNewspaper.dataset.outlook = currentScenarioReadings.ecosystem.quality;
    futureNewspaper.dataset.focus = currentScenarioReadings.focus;
    futureNewspaper.dataset.river = currentScenarioReadings.ecosystem.river;
    renderVisualItems(newspaperTreeLayer, currentScenarioReadings.ecosystem.trees, "paper-tree is-living", 3);
    for (let index = 0; index < currentScenarioReadings.ecosystem.dryTrees; index += 1) {
      const dryTree = document.createElement("i");
      dryTree.className = "paper-tree is-dry";
      dryTree.style.setProperty("--item-x", `${8 + ((index * 21 + 5) % 76)}%`);
      dryTree.style.setProperty("--item-scale", String(0.7 + index * 0.06));
      newspaperTreeLayer.appendChild(dryTree);
    }
    renderVisualItems(newspaperFishLayer, currentScenarioReadings.ecosystem.fish, "paper-fish", 6);
    renderVisualItems(newspaperEnergyLayer, currentScenarioReadings.ecosystem.energy, "paper-panel", 10);
    renderVisualItems(newspaperCropLayer, currentScenarioReadings.ecosystem.food, "paper-crop", 2);
  }

  function wrapCanvasText(context, text, x, y, maxWidth, lineHeight, maxLines) {
    const words = text.split(/\s+/);
    const lines = [];
    let currentLine = "";
    words.forEach((word) => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      if (context.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);
    lines.slice(0, maxLines).forEach((line, index) => context.fillText(line, x, y + index * lineHeight));
    return y + Math.min(lines.length, maxLines) * lineHeight;
  }

  function drawNewspaperCanvas() {
    const context = newspaperCanvas.getContext("2d");
    const story = getNewspaperStory();
    const width = newspaperCanvas.width;
    const height = newspaperCanvas.height;
    context.fillStyle = "#f4edda";
    context.fillRect(0, 0, width, height);
    context.fillStyle = "#202018";
    context.textAlign = "center";
    context.font = "700 22px Arial";
    context.fillText("EDIÇÃO ESPECIAL | PARANÁ, 2040", width / 2, 58);
    context.font = "900 92px Georgia";
    context.fillText("RAIZ DO AMANHÃ", width / 2, 155);
    context.font = "italic 24px Georgia";
    context.fillText("Notícias cultivadas pelas escolhas de hoje", width / 2, 198);
    context.fillRect(70, 225, width - 140, 5);
    context.textAlign = "left";
    context.fillStyle = "#8e4c1c";
    context.font = "800 24px Arial";
    context.fillText(story.kicker, 80, 280);
    context.fillStyle = "#202018";
    context.font = "900 72px Georgia";
    const headlineEnd = wrapCanvasText(context, story.headline, 80, 370, width - 160, 78, 4);
    context.font = "34px Georgia";
    const subtitleEnd = wrapCanvasText(context, story.subheadline, 80, headlineEnd + 28, width - 160, 44, 3);

    const landscapeTop = subtitleEnd + 32;
    const landscapeHeight = 380;
    const ecosystem = currentScenarioReadings.ecosystem;
    const scoreRatio = Math.max(0.15, (currentScenarioReadings.score || 0) / 100);
    const sky = context.createLinearGradient(0, landscapeTop, 0, landscapeTop + landscapeHeight);
    sky.addColorStop(0, ecosystem.quality === "critical" ? "#9d735e" : scoreRatio >= 0.65 ? "#9bd4e3" : "#b68a70");
    sky.addColorStop(1, ecosystem.quality === "critical" ? "#c48d55" : scoreRatio >= 0.65 ? "#dfecc5" : "#c49a67");
    context.fillStyle = sky;
    context.fillRect(80, landscapeTop, width - 160, landscapeHeight);

    // Mantém toda a ilustração presa à moldura da paisagem na imagem exportada.
    context.save();
    context.beginPath();
    context.rect(80, landscapeTop, width - 160, landscapeHeight);
    context.clip();

    context.fillStyle = ecosystem.quality === "critical" ? "#71513a" : scoreRatio >= 0.65 ? "#4f824a" : "#766044";
    context.beginPath();
    context.ellipse(width / 2, landscapeTop + landscapeHeight + 90, width * 0.58, 260, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = ecosystem.river === "living" ? "#68b7c1" : ecosystem.river === "recovering" ? "#789ca0" : "#77766b";
    context.beginPath();
    context.moveTo(width * 0.58, landscapeTop + 110);
    context.bezierCurveTo(width * 0.7, landscapeTop + 180, width * 0.51, landscapeTop + 260, width * 0.66, landscapeTop + landscapeHeight);
    context.lineTo(width * 0.5, landscapeTop + landscapeHeight);
    context.bezierCurveTo(width * 0.48, landscapeTop + 270, width * 0.56, landscapeTop + 190, width * 0.58, landscapeTop + 110);
    context.fill();

    if (ecosystem.quality === "critical") {
      context.strokeStyle = "#4f392b";
      context.lineWidth = 5;
      for (let index = 0; index < 7; index += 1) {
        const crackX = 130 + index * 125;
        const crackY = landscapeTop + 300 + (index % 2) * 28;
        context.beginPath();
        context.moveTo(crackX, crackY);
        context.lineTo(crackX + 28, crackY + 20);
        context.lineTo(crackX + 10, crackY + 45);
        context.stroke();
      }
    }

    for (let index = 0; index < ecosystem.trees; index += 1) {
      const treeX = 130 + (index % 5) * 92 + (index >= 5 ? 28 : 0);
      const treeY = landscapeTop + 310 - (index % 2) * 18;
      context.fillStyle = "#684329";
      context.fillRect(treeX - 7, treeY - 66, 14, 70);
      context.fillStyle = index % 2 ? "#3f7f48" : "#4f914f";
      context.beginPath();
      context.arc(treeX, treeY - 78, 35, 0, Math.PI * 2);
      context.fill();
    }

    context.strokeStyle = "#5a3e2b";
    context.lineWidth = 8;
    for (let index = 0; index < ecosystem.dryTrees; index += 1) {
      const treeX = 145 + index * 112;
      const treeY = landscapeTop + 330;
      context.beginPath();
      context.moveTo(treeX, treeY);
      context.lineTo(treeX, treeY - 76);
      context.lineTo(treeX - 24, treeY - 103);
      context.moveTo(treeX, treeY - 72);
      context.lineTo(treeX + 27, treeY - 96);
      context.stroke();
    }

    context.fillStyle = "#275f73";
    for (let index = 0; index < ecosystem.fish; index += 1) {
      const fishX = width * 0.56 + (index % 3) * 30;
      const fishY = landscapeTop + 205 + Math.floor(index / 3) * 35;
      context.beginPath();
      context.ellipse(fishX, fishY, 13, 6, -0.2, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.moveTo(fishX - 12, fishY);
      context.lineTo(fishX - 24, fishY - 9);
      context.lineTo(fishX - 24, fishY + 9);
      context.closePath();
      context.fill();
    }

    for (let index = 0; index < ecosystem.energy; index += 1) {
      const panelX = 820 + (index % 3) * 82;
      const panelY = landscapeTop + 260 + Math.floor(index / 3) * 58;
      context.fillStyle = "#31576f";
      context.fillRect(panelX, panelY, 58, 34);
      context.strokeStyle = "#b8d5db";
      context.lineWidth = 2;
      context.strokeRect(panelX, panelY, 58, 34);
    }

    context.strokeStyle = ecosystem.food > 0 ? "#d7b456" : "#74523b";
    context.lineWidth = 5;
    for (let index = 0; index < ecosystem.food; index += 1) {
      const cropX = 760 + index * 42;
      context.beginPath();
      context.moveTo(cropX, landscapeTop + 360);
      context.lineTo(cropX, landscapeTop + 320 - (index % 2) * 12);
      context.stroke();
    }

    context.fillStyle = "rgba(31, 36, 28, 0.78)";
    context.fillRect(96, landscapeTop + 18, 280, 46);
    context.fillStyle = "#ffffff";
    context.font = "700 19px Arial";
    context.fillText(`CENÁRIO: ${currentScenarioReadings.focus.toUpperCase()}`, 114, landscapeTop + 48);
    context.restore();

    const contentTop = landscapeTop + landscapeHeight + 55;
    context.fillStyle = "#202018";
    context.font = "700 32px Georgia";
    context.fillText(story.leadTitle, 80, contentTop);
    context.font = "26px Georgia";
    wrapCanvasText(context, story.leadText, 80, contentTop + 44, 650, 36, 5);
    context.strokeStyle = "#9e9479";
    context.strokeRect(780, contentTop - 32, 340, 190);
    const metrics = [
      ["ÁGUA", currentScenarioReadings.water || 0],
      ["BIODIVERSIDADE", currentScenarioReadings.biodiversity || 0],
      ["EQUILÍBRIO", currentScenarioReadings.score || 0],
    ];
    metrics.forEach((metric, index) => {
      const metricY = contentTop + index * 56;
      context.font = "700 18px Arial";
      context.fillText(metric[0], 805, metricY);
      context.font = "900 30px Georgia";
      context.fillText(`${metric[1]}%`, 1035, metricY);
    });
    context.fillStyle = "#8e4c1c";
    context.fillRect(80, height - 125, width - 160, 3);
    context.fillStyle = "#202018";
    context.font = "italic 22px Georgia";
    context.fillText(newspaperSignature.textContent, 80, height - 78);
    context.textAlign = "right";
    context.fillText(`Semente Viva: ${seedStageNames[getSeedStage()]}`, width - 80, height - 78);
    context.textAlign = "left";
  }

  function downloadNewspaper() {
    drawNewspaperCanvas();
    const link = document.createElement("a");
    link.download = "raiz-up-jornal-2040.png";
    link.href = newspaperCanvas.toDataURL("image/png");
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    newspaperStatus.textContent = "Capa de 2040 gerada e preparada para download.";
  }

  function scatterSeeds(source) {
    const seedCount = 9;
    const existingSprouts = Array.from(seedField.querySelectorAll(".field-sprout"));
    existingSprouts.slice(0, Math.max(0, existingSprouts.length - 15)).forEach((sprout) => sprout.remove());
    for (let index = 0; index < seedCount; index += 1) {
      const seed = document.createElement("span");
      seed.className = "field-seed";
      seed.style.setProperty("--fly-x", `${-125 + Math.random() * 250}px`);
      seed.style.setProperty("--fly-y", `${20 + Math.random() * 90}px`);
      seed.style.animationDelay = `${index * 45}ms`;
      seedField.appendChild(seed);
      window.setTimeout(() => seed.remove(), 1500);
    }

    for (let index = 0; index < 5; index += 1) {
      const sprout = document.createElement("span");
      sprout.className = "field-sprout";
      sprout.style.setProperty("--sprout-x", `${12 + Math.random() * 75}%`);
      sprout.style.setProperty("--sprout-h", `${34 + Math.random() * 44}px`);
      sprout.style.animationDelay = `${650 + index * 90}ms`;
      seedField.appendChild(sprout);
    }

    livingJourney.plantCount = Number(livingJourney.plantCount || 0) + 1;
    completeJourneyMilestone("planting", { plantCount: livingJourney.plantCount });
    blowStatus.textContent = source === "blow" ? "Sopro reconhecido: novas sementes criaram raízes." : "Plantio acessível concluído: novas sementes criaram raízes.";
  }

  function stopBlowDetection() {
    window.cancelAnimationFrame(microphoneAnimationFrame);
    microphoneAnimationFrame = 0;
    if (microphoneStream) {
      microphoneStream.getTracks().forEach((track) => track.stop());
      microphoneStream = null;
    }
    if (microphoneAudioContext) {
      microphoneAudioContext.close();
      microphoneAudioContext = null;
    }
    blowMeterFill.style.width = "0%";
    blowStartButton.textContent = "Ativar sopro";
    blowStartButton.setAttribute("aria-pressed", "false");
  }

  async function toggleBlowDetection() {
    if (microphoneStream) {
      stopBlowDetection();
      blowStatus.textContent = "Microfone desativado. O botão alternativo continua disponível.";
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      blowStatus.textContent = "Este navegador não liberou o microfone. Use Plantar sem microfone.";
      return;
    }

    try {
      microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      microphoneAudioContext = new AudioContextConstructor();
      const sourceNode = microphoneAudioContext.createMediaStreamSource(microphoneStream);
      const analyser = microphoneAudioContext.createAnalyser();
      analyser.fftSize = 512;
      sourceNode.connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      blowStartButton.textContent = "Parar microfone";
      blowStartButton.setAttribute("aria-pressed", "true");
      blowStatus.textContent = "Microfone ativo. Assopre de forma contínua por um instante.";

      const listen = function () {
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        samples.forEach((sample) => {
          const normalized = (sample - 128) / 128;
          sum += normalized * normalized;
        });
        const level = Math.sqrt(sum / samples.length);
        const visualLevel = Math.min(100, level * 520);
        blowMeterFill.style.width = `${visualLevel}%`;
        if (level > 0.16 && Date.now() - lastBlowPlantTime > 1800) {
          lastBlowPlantTime = Date.now();
          scatterSeeds("blow");
        }
        microphoneAnimationFrame = window.requestAnimationFrame(listen);
      };
      listen();
      window.setTimeout(function () {
        if (microphoneStream) {
          stopBlowDetection();
          blowStatus.textContent = "Escuta encerrada automaticamente. Ative novamente para plantar mais.";
        }
      }, 15000);
    } catch (error) {
      stopBlowDetection();
      blowStatus.textContent = "Permissão de microfone não concedida. Use Plantar sem microfone.";
    }
  }

  function clearTourTimer() {
    window.clearTimeout(tourTimer);
    tourTimer = null;
  }

  function stopTourAudio(resetPosition) {
    tourAudio.pause();
    if (resetPosition) {
      tourAudio.currentTime = 0;
    }
    tourCharacter.classList.remove("is-speaking");
  }

  async function playCurrentTourAudio() {
    if (!tourVoiceEnabled || !body.classList.contains("tour-active")) {
      return;
    }

    const step = tourSteps[currentTourIndex];
    stopTourAudio(true);
    tourAudio.src = step.audio;
    tourAudio.load();

    try {
      await tourAudio.play();
    } catch (error) {
      tourCharacter.classList.remove("is-speaking");
      tourAudioNeedsGesture = true;
      tourVoiceButton.textContent = "Tocar áudio";
      tourVoiceButton.setAttribute("aria-pressed", "true");
      tourVoiceButton.setAttribute("aria-label", "Tocar áudio gravado da apresentação");
    }
  }

  function setTourAutoPlaying(enabled) {
    tourAutoPlaying = Boolean(enabled);
    tourAutoButton.textContent = tourAutoPlaying ? "Pausar" : "Continuar";
    tourAutoButton.setAttribute("aria-pressed", tourAutoPlaying ? "true" : "false");
    tourAutoButton.setAttribute(
      "aria-label",
      tourAutoPlaying ? "Pausar apresentação automática" : "Continuar apresentação automática"
    );

    clearTourTimer();
    if (!tourAutoPlaying) {
      if (tourVoiceEnabled) {
        tourAudio.pause();
      }
      return;
    }

    if (tourAutoPlaying && body.classList.contains("tour-active")) {
      if (tourVoiceEnabled) {
        if (tourAudio.ended) {
          if (currentTourIndex === tourSteps.length - 1) {
            closeTour(true);
          } else {
            renderTourStep(currentTourIndex + 1);
          }
        } else if (!tourAudio.getAttribute("src")) {
          playCurrentTourAudio();
        } else {
          tourAudio.play().catch(function () {
            scheduleTourAdvance();
          });
        }
        return;
      }

      tourTimer = window.setTimeout(function () {
        if (currentTourIndex === tourSteps.length - 1) {
          closeTour(true);
          return;
        }
        renderTourStep(currentTourIndex + 1);
      }, currentTourIndex === tourSteps.length - 1 ? TOUR_STEP_DURATION + 1800 : TOUR_STEP_DURATION);
    }
  }

  function setTourVoiceEnabled(enabled) {
    tourVoiceEnabled = Boolean(enabled);
    tourAudioNeedsGesture = false;
    tourVoiceButton.textContent = tourVoiceEnabled ? "Silenciar" : "Ouvir";
    tourVoiceButton.setAttribute("aria-pressed", tourVoiceEnabled ? "true" : "false");
    tourVoiceButton.setAttribute(
      "aria-label",
      tourVoiceEnabled ? "Silenciar áudio gravado da apresentação" : "Tocar áudio gravado da apresentação"
    );

    if (tourVoiceEnabled && body.classList.contains("tour-active")) {
      clearTourTimer();
      playCurrentTourAudio();
    } else {
      stopTourAudio(true);
      scheduleTourAdvance();
    }
  }

  function scheduleTourAdvance() {
    clearTourTimer();
    if (!tourAutoPlaying || !body.classList.contains("tour-active") || tourVoiceEnabled) {
      return;
    }

    tourTimer = window.setTimeout(function () {
      if (currentTourIndex === tourSteps.length - 1) {
        closeTour(true);
        return;
      }
      renderTourStep(currentTourIndex + 1);
    }, currentTourIndex === tourSteps.length - 1 ? TOUR_STEP_DURATION + 1800 : TOUR_STEP_DURATION);
  }

  function renderTourStep(index, preserveCurrentAudio) {
    const nextIndex = Math.max(0, Math.min(tourSteps.length - 1, index));
    const step = tourSteps[nextIndex];
    const target = document.querySelector(step.target);
    const keepPlayingAudio =
      Boolean(preserveCurrentAudio) &&
      tourVoiceEnabled &&
      tourAudio.getAttribute("src") === step.audio &&
      !tourAudio.ended;

    clearTourTimer();
    if (!keepPlayingAudio) {
      stopTourAudio(true);
    }
    if (highlightedTourTarget) {
      highlightedTourTarget.classList.remove("tour-highlight");
    }

    currentTourIndex = nextIndex;
    tourCounter.textContent = `Raizinho apresenta | ${currentTourIndex + 1} de ${tourSteps.length}`;
    tourTitle.textContent = step.title;
    tourText.textContent = step.text;
    tourProgressFill.style.width = `${((currentTourIndex + 1) / tourSteps.length) * 100}%`;
    tourPreviousButton.disabled = currentTourIndex === 0;
    tourNextButton.textContent = currentTourIndex === tourSteps.length - 1 ? "Concluir" : "Próximo";
    tourNextButton.setAttribute(
      "aria-label",
      currentTourIndex === tourSteps.length - 1 ? "Concluir apresentação" : "Avançar etapa da apresentação"
    );

    highlightedTourTarget = target;
    if (target) {
      target.classList.add("tour-highlight");
      target.scrollIntoView({
        behavior: reducedMotionQuery.matches ? "auto" : "smooth",
        block: currentTourIndex === 0 ? "start" : "center",
      });
    }

    if (!keepPlayingAudio) {
      playCurrentTourAudio();
    }
    scheduleTourAdvance();
  }

  function startTour() {
    window.clearTimeout(tourRevealTimer);
    stopPageSummary();
    closeSettings();
    setQuickDockOpen(false);
    currentTourIndex = 0;
    tourAutoPlaying = !reducedMotionQuery.matches;
    tourVoiceEnabled = true;
    tourAudioNeedsGesture = false;
    tourStartButton.disabled = true;
    body.classList.add("tour-active", "tour-transitioning");
    setTourVoiceEnabled(true);

    const revealDelay = reducedMotionQuery.matches ? 0 : 520;
    tourRevealTimer = window.setTimeout(function () {
      siteTour.hidden = false;
      siteTour.inert = false;
      siteTour.setAttribute("aria-hidden", "false");
      tourStartButton.setAttribute("aria-expanded", "true");
      tourStartButton.disabled = false;
      renderTourStep(0, true);
      tourCloseButton.focus({ preventScroll: true });
    }, revealDelay);

    window.setTimeout(function () {
      body.classList.remove("tour-transitioning");
    }, reducedMotionQuery.matches ? 0 : 1950);
  }

  function closeTour(restoreFocus) {
    window.clearTimeout(tourRevealTimer);
    clearTourTimer();
    stopTourAudio(true);
    body.classList.remove("tour-active", "tour-transitioning");
    tourStartButton.disabled = false;
    tourStartButton.setAttribute("aria-expanded", "false");
    siteTour.setAttribute("aria-hidden", "true");
    siteTour.inert = true;
    siteTour.hidden = true;

    if (highlightedTourTarget) {
      highlightedTourTarget.classList.remove("tour-highlight");
      highlightedTourTarget = null;
    }

    if (restoreFocus) {
      tourStartButton.focus({ preventScroll: true });
    }
  }

  function animateValue(element, target) {
    const startValue = Number(element.dataset.value || "0");
    const startTime = performance.now();
    const duration = 420;

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.round(startValue + (target - startValue) * progress);
      element.textContent = String(value);
      element.dataset.value = String(value);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step);
  }

  function getSelectedStrategies() {
    return strategyInputs.filter((input) => input.checked).map((input) => input.value);
  }

  function buildNarrative(score, focus, selectedStrategies) {
    if (selectedStrategies.length === 0) {
      return "Sem práticas ativas, o sistema perde eficiência, o ambiente fica vulnerável e o futuro da produção enfraquece.";
    }

    if (score >= 85) {
      return `O cenário está muito forte. O foco em ${focusLabel[focus]} se soma a boas práticas e mostra que produzir com inteligência pode proteger o ambiente e fortalecer a cidade ao mesmo tempo.`;
    }

    if (score >= 65) {
      return "O caminho está consistente. Já existe equilíbrio, mas novas escolhas podem ampliar o impacto positivo e deixar a cadeia produtiva ainda mais sustentável.";
    }

    if (score >= 45) {
      return "O cenário tem potencial, mas ainda depende de ajustes para evitar perdas ambientais e garantir mais estabilidade econômica.";
    }

    return "O equilíbrio ainda está frágil. Falta integrar melhor tecnologia, preservação ambiental e conexão com quem consome.";
  }

  // Simulador: calcula os indicadores e atualiza grafico, textos e destaques.
  function renderHighlights(selectedStrategies, focus) {
    impactHighlights.innerHTML = "";
    const highlights = selectedStrategies.map((strategy) => strategyValues[strategy].highlight);

    if (focus === "solo") {
      highlights.push("Quando o solo e bem cuidado, a produtividade deixa de ser imediatista e ganha continuidade.");
    } else if (focus === "agua") {
      highlights.push("Água preservada no campo representa segurança produtiva e proteção ambiental.");
    } else if (focus === "energia") {
      highlights.push("Energia limpa reduz custos e ajuda o agro a crescer com menos pressao ambiental.");
    } else {
      highlights.push("Campo e cidade se aproximam quando a origem do alimento é valorizada com mais clareza.");
    }

    highlights.slice(0, 4).forEach((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      impactHighlights.appendChild(item);
    });
  }

  function updateScenario() {
    // Soma as escolhas do usuário e converte isso em indicadores visuais do cenário.
    const selectedStrategies = getSelectedStrategies();
    const intensity = Number(careRange.value);
    const focus = focusSelect.value;
    const totals = {
      water: 18,
      biodiversity: 18,
      economy: 18,
      city: 18,
    };

    selectedStrategies.forEach((strategy) => {
      const data = strategyValues[strategy];
      totals.water += data.water;
      totals.biodiversity += data.biodiversity;
      totals.economy += data.economy;
      totals.city += data.city;
    });

    const focusData = focusBoost[focus];
    totals.water += focusData.water;
    totals.biodiversity += focusData.biodiversity;
    totals.economy += focusData.economy;
    totals.city += focusData.city;

    const multiplier = 1 + intensity * 0.09;
    const finalWater = Math.min(100, Math.round(totals.water * multiplier));
    const finalBiodiversity = Math.min(100, Math.round(totals.biodiversity * multiplier));
    const finalEconomy = Math.min(100, Math.round(totals.economy * multiplier));
    const finalCity = Math.min(100, Math.round(totals.city * multiplier));
    const finalScore = Math.round(
      (finalWater + finalBiodiversity + finalEconomy + finalCity) / 4
    );

    careRangeValue.textContent = String(intensity);
    balanceGauge.style.setProperty("--score-angle", `${finalScore * 3.6}deg`);
    animateValue(balanceScore, finalScore);

    if (finalScore >= 85) {
      balanceLevel.textContent = "Equilíbrio exemplar";
    } else if (finalScore >= 65) {
      balanceLevel.textContent = "Cenário promissor";
    } else if (finalScore >= 45) {
      balanceLevel.textContent = "Precisa evoluir";
    } else {
      balanceLevel.textContent = "Equilíbrio frágil";
    }

    waterMetric.textContent = `${finalWater}%`;
    biodiversityMetric.textContent = `${finalBiodiversity}%`;
    economyMetric.textContent = `${finalEconomy}%`;
    cityMetric.textContent = `${finalCity}%`;
    impactNarrative.textContent = buildNarrative(finalScore, focus, selectedStrategies);
    renderHighlights(selectedStrategies, focus);
    currentScenarioReadings.water = finalWater;
    currentScenarioReadings.biodiversity = finalBiodiversity;
    currentScenarioReadings.economy = finalEconomy;
    currentScenarioReadings.city = finalCity;
    currentScenarioReadings.score = finalScore;
    currentScenarioReadings.focus = focus;
    currentScenarioReadings.strategies = [...selectedStrategies];
    currentScenarioReadings.intensity = intensity;
    renderZoneProfile(activeZone, false);
    renderTwoFutures();
    renderSeedCompanion();

    if (scenarioInteractionStarted) {
      completeJourneyMilestone("simulator");
    }
  }

  function buildManifesto() {
    const formData = new FormData(pledgeForm);
    const name = String(formData.get("personName") || "").trim();
    const role = String(formData.get("personRole") || "estudante");
    const priority = String(formData.get("personPriority") || "agua");
    const action = String(formData.get("personAction") || "").trim();
    const prefix = name ? `${name} afirma:` : "Eu afirmo:";

    return `${prefix} ${roleText[role]} Por isso, escolho ${priorityText[priority]} e transformar em prática a seguinte atitude: ${action || "agir todos os dias com mais consciência para aproximar produção, natureza e sociedade."}`;
  }

  function getStoredPledges() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.mural);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  // Mural e conquistas: salva mensagens locais e mostra notificacoes de progresso.
  function saveStoredPledges(pledges) {
    localStorage.setItem(STORAGE_KEYS.mural, JSON.stringify(pledges));
  }

  function getStoredAchievements() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.achievements);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  function saveAchievements() {
    localStorage.setItem(STORAGE_KEYS.achievements, JSON.stringify(Array.from(unlockedAchievements)));
  }

  function renderAchievements() {
    achievementList.innerHTML = "";

    achievementDefinitions.forEach((achievement) => {
      const unlocked = unlockedAchievements.has(achievement.id);
      const item = document.createElement("article");
      item.className = `achievement-item${unlocked ? " is-unlocked" : ""}`;

      const title = document.createElement("strong");
      title.textContent = `${unlocked ? "Liberada" : "Bloqueada"}: ${achievement.title}`;

      const description = document.createElement("span");
      description.textContent = achievement.description;

      item.append(title, description);
      achievementList.appendChild(item);
    });

    updateQuickDockState();
  }

  async function playAchievementSound() {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;

    if (!AudioContextConstructor) {
      return;
    }

    try {
      if (!achievementAudioContext) {
        achievementAudioContext = new AudioContextConstructor();
      }

      if (achievementAudioContext.state === "suspended") {
        await achievementAudioContext.resume();
      }

      const now = achievementAudioContext.currentTime;
      const masterGain = achievementAudioContext.createGain();
      const notes = [523.25, 659.25, 783.99, 1046.5];
      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.15, now + 0.02);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
      masterGain.connect(achievementAudioContext.destination);

      notes.forEach((frequency, index) => {
        const oscillator = achievementAudioContext.createOscillator();
        const noteGain = achievementAudioContext.createGain();
        const startAt = now + index * 0.055;
        const stopAt = startAt + 0.16;
        oscillator.type = index === notes.length - 1 ? "triangle" : "square";
        oscillator.frequency.setValueAtTime(frequency, startAt);
        noteGain.gain.setValueAtTime(0.0001, startAt);
        noteGain.gain.exponentialRampToValueAtTime(0.15, startAt + 0.015);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, stopAt);
        oscillator.connect(noteGain);
        noteGain.connect(masterGain);
        oscillator.start(startAt);
        oscillator.stop(stopAt + 0.02);
      });

      window.setTimeout(function () {
        masterGain.disconnect();
      }, 620);
    } catch (error) {
      // Alguns navegadores bloqueiam áudio fora de uma ação direta do usuário.
    }
  }

  function showAchievementToast(achievement) {
    if (!achievementToastArea || !achievement) {
      return;
    }

    while (achievementToastArea.children.length >= 3) {
      achievementToastArea.firstElementChild.remove();
    }

    const toast = document.createElement("article");
    toast.className = "achievement-toast";
    toast.setAttribute("role", "status");

    const badge = document.createElement("span");
    badge.className = "achievement-toast-badge";
    badge.setAttribute("aria-hidden", "true");
    badge.textContent = "XP";

    const copy = document.createElement("div");
    copy.className = "achievement-toast-copy";

    const label = document.createElement("span");
    label.textContent = "Conquista desbloqueada";

    const title = document.createElement("strong");
    title.textContent = achievement.title;

    const description = document.createElement("p");
    description.textContent = achievement.description;

    copy.append(label, title, description);
    toast.append(badge, copy);
    achievementToastArea.appendChild(toast);

    window.setTimeout(function () {
      toast.remove();
    }, 4200);
  }

  function unlockAchievement(id) {
    if (unlockedAchievements.has(id)) {
      return;
    }

    const achievement = achievementDefinitions.find((entry) => entry.id === id);
    unlockedAchievements.add(id);
    saveAchievements();
    renderAchievements();
    showAchievementToast(achievement);
    playAchievementSound();
  }

  function renderPledgeWall() {
    // O mural usa localStorage para manter as mensagens nesta maquina.
    const pledges = getStoredPledges();
    pledgeWall.innerHTML = "";

    if (pledges.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.textContent = "Ainda não há compromissos salvos. Gere um manifesto e guarde sua mensagem.";
      pledgeWall.appendChild(emptyState);
      return;
    }

    pledges.forEach((pledge) => {
      const card = document.createElement("article");
      card.className = "mural-card";

      const title = document.createElement("strong");
      title.textContent = pledge.name;

      const text = document.createElement("p");
      text.textContent = pledge.message;

      const label = document.createElement("small");
      label.textContent = `${pledge.role} | ${pledge.priority}`;

      card.append(title, text, label);
      pledgeWall.appendChild(card);
    });
  }

  // Revelacao visual: anima as secoes quando elas entram na tela.
  function observeReveals() {
    // Revela os blocos aos poucos para reforcar a leitura da narrativa.
    const revealTargets = document.querySelectorAll("[data-reveal]");

    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealTargets.forEach((target) => observer.observe(target));
  }

  // Audio do site: controla musicas, sons ambientais e mensagens de status.
  function updateAudioMessage(message) {
    audioStatus.textContent = message;
    updateQuickDockState();
  }

  async function playThemeAudio() {
    const track = getCurrentMusicTrack();

    try {
      if (!themeAudio.getAttribute("src")) {
        themeAudio.src = track.src;
      }
      await themeAudio.play();
      updateAudioMessage(`Tocando agora: ${track.title}.`);
    } catch (error) {
      updateAudioMessage(`Não foi possível tocar agora. Confira se o navegador permite áudio e se ${track.src} está na pasta musica.`);
    }
  }

  function pauseThemeAudio() {
    themeAudio.pause();
    updateAudioMessage("Trilha pausada.");
  }

  function changeMusicTrack(direction) {
    const shouldKeepPlaying = !themeAudio.paused;
    currentMusicIndex = wrapIndex(currentMusicIndex + direction, musicPlaylist.length);
    themeAudio.src = getCurrentMusicTrack().src;
    themeAudio.load();

    if (shouldKeepPlaying) {
      playThemeAudio();
      return;
    }

    updateAudioMessage(`Faixa selecionada: ${getCurrentMusicTrack().title}.`);
  }

  function toggleThemeAudio() {
    if (themeAudio.paused) {
      playThemeAudio();
      return;
    }

    pauseThemeAudio();
  }

  async function startAmbientSound() {
    const ambientMode = getCurrentAmbientMode();

    try {
      if (ambientAudio.getAttribute("src") !== ambientMode.src) {
        ambientAudio.src = ambientMode.src;
        ambientAudio.load();
      }

      ambientAudio.volume = Number(ambientVolumeRange.value) / 100;
      await ambientAudio.play();
      ambientPlaying = true;
      ambientStatus.textContent = `Ambiente ativo: ${ambientMode.title}, com ${ambientMode.description}`;
      unlockAchievement("agua");
      updateQuickDockState();
    } catch (error) {
      ambientPlaying = false;
      ambientStatus.textContent = `Não foi possível tocar ${ambientMode.title}. Confira se o navegador permite áudio e se ${ambientMode.src} está na pasta musica.`;
      updateQuickDockState();
    }
  }

  function stopAmbientSound(options = {}) {
    ambientAudio.pause();
    ambientPlaying = false;
    if (!options.keepStatus) {
      ambientStatus.textContent = "Sons ambientais pausados.";
    }
    updateQuickDockState();
  }

  function toggleAmbientSound() {
    if (ambientPlaying) {
      stopAmbientSound();
      return;
    }

    startAmbientSound();
  }

  function changeAmbientMode(direction) {
    const shouldKeepPlaying = ambientPlaying;

    if (ambientPlaying) {
      stopAmbientSound({ keepStatus: true });
    }

    currentAmbientIndex = wrapIndex(currentAmbientIndex + direction, ambientModes.length);
    ambientAudio.src = getCurrentAmbientMode().src;
    ambientAudio.load();

    if (shouldKeepPlaying) {
      startAmbientSound();
      return;
    }

    const ambientMode = getCurrentAmbientMode();
    ambientStatus.textContent = `Modo selecionado: ${ambientMode.title}, com ${ambientMode.description}`;
    updateQuickDockState();
  }

  // Painel interativo: textos e indicadores exibidos para cada ponto do mapa.
  const zoneProfiles = {
    plantio: {
      title: "Área de plantio",
      text: "O plantio sustentável combina rotação de culturas, cobertura vegetal e adubação orgânica para produzir sem esgotar o solo.",
      field: 96,
      nature: 94,
      city: 88,
      practices: [
        "Cobertura vegetal para evitar erosão e manter umidade.",
        "Rotação de culturas para reduzir desgaste e pragas.",
        "Compostagem para devolver vida orgânica ao solo.",
      ],
    },
    rio: {
      title: "Rio e nascente",
      text: "Irrigação planejada, proteção das nascentes e monitoramento reduzem desperdício e garantem segurança hídrica para a propriedade.",
      field: 93,
      nature: 97,
      city: 82,
      practices: [
        "Irrigação precisa para levar água apenas onde a planta precisa.",
        "Proteção das nascentes e margens para preservar o ciclo natural.",
        "Leitura constante do clima para evitar excessos e faltas.",
      ],
    },
    solar: {
      title: "Energia solar",
      text: "Painéis solares, automação e equipamentos eficientes ajudam a reduzir custos e deixam a produção mais moderna e resiliente.",
      field: 90,
      nature: 84,
      city: 80,
      practices: [
        "Painéis solares para ampliar autonomia da propriedade.",
        "Sensores e automação para evitar gasto desnecessário.",
        "Planejamento energético para produzir com mais estabilidade.",
      ],
    },
    preservacao: {
      title: "Área de preservação",
      text: "A biodiversidade fortalece o equilíbrio natural, melhora o solo, protege os polinizadores e reduz a pressão sobre o ambiente.",
      field: 89,
      nature: 98,
      city: 78,
      practices: [
        "Corredores verdes para manter especies e polinizadores.",
        "Menor pressao ambiental com manejo mais equilibrado.",
        "Diversidade de plantas para reforçar a saúde do ecossistema.",
      ],
    },
    cidade: {
      title: "Cidade mais conectada com a origem",
      text: "Quando o transporte e o consumo valorizam boas práticas, o alimento chega com mais qualidade e o produtor encontra reconhecimento pelo cuidado que teve no campo.",
      field: 87,
      nature: 79,
      city: 96,
      practices: [
        "Rotas mais conscientes para reduzir perdas e desperdício.",
        "Mercados e famílias mais atentos à origem do alimento.",
        "Consumo informado que valoriza responsabilidade ambiental.",
      ],
    },
  };

  function getZoneSignalValue(zoneKey) {
    if (zoneKey === "plantio") {
      return Math.round((currentScenarioReadings.biodiversity + currentScenarioReadings.economy) / 2);
    }

    if (zoneKey === "rio") {
      return currentScenarioReadings.water;
    }

    if (zoneKey === "solar") {
      return currentScenarioReadings.economy;
    }

    if (zoneKey === "preservacao") {
      return Math.round((currentScenarioReadings.biodiversity + currentScenarioReadings.water) / 2);
    }

    return currentScenarioReadings.city;
  }

  function getZoneSignalText(zoneKey, value) {
    const isFocusMatch =
      currentScenarioReadings.focus === zoneKey ||
      (zoneKey === "plantio" && currentScenarioReadings.focus === "solo") ||
      (zoneKey === "rio" && currentScenarioReadings.focus === "agua") ||
      (zoneKey === "solar" && currentScenarioReadings.focus === "energia") ||
      (zoneKey === "preservacao" && currentScenarioReadings.focus === "solo");

    if (value >= 85) {
      return `${isFocusMatch ? "O foco escolhido no simulador reforça muito este ponto." : "O cenário atual já sustenta muito bem esta área da propriedade."}`;
    }

    if (value >= 65) {
      return `${isFocusMatch ? "O caminho está promissor e pode crescer ainda mais com novas práticas." : "Esta área está bem encaminhada, mas ainda pode evoluir com mais cuidado."}`;
    }

    if (value >= 45) {
      return `${isFocusMatch ? "Mesmo sendo foco da simulação, ainda faltam ajustes para ganhar força." : "A área ainda precisa de mais apoio para responder melhor ao equilíbrio."}`;
    }

    return "Este ponto ainda está frágil no cenário atual. Vale testar novas combinações no simulador para fortalecer a leitura.";
  }

  // Mapa da propriedade: troca a zona ativa e atualiza a explicacao complementar.
  function renderZoneProfile(zoneKey, shouldUnlock) {
    const profile = zoneProfiles[zoneKey] || zoneProfiles.plantio;
    const signalValue = getZoneSignalValue(zoneKey);

    activeZone = zoneKey;
    zoneTitle.textContent = profile.title;
    zoneText.textContent = profile.text;
    zoneFieldValue.textContent = `${profile.field}%`;
    zoneNatureValue.textContent = `${profile.nature}%`;
    zoneCityValue.textContent = `${profile.city}%`;
    zoneSignalValue.textContent = `${signalValue}%`;
    zoneSignalText.textContent = getZoneSignalText(zoneKey, signalValue);
    zonePracticeList.innerHTML = "";

    profile.practices.forEach((practice) => {
      const item = document.createElement("li");
      item.textContent = practice;
      zonePracticeList.appendChild(item);
    });

    zoneButtons.forEach((button) => {
      const isActive = button.dataset.zone === zoneKey;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    if (!shouldUnlock) {
      return;
    }

    if (zoneKey === "rio") {
      unlockAchievement("agua");
    } else if (zoneKey === "plantio" || zoneKey === "preservacao") {
      unlockAchievement("solo");
    } else if (zoneKey === "solar") {
      unlockAchievement("energia");
    }
  }

  // Linha do tempo: muda a etapa selecionada e lista os aprendizados principais.
  function renderTimeline(key) {
    const data = timelineData[key] || timelineData.antes;
    activeTimeline = key;
    timelineTitle.textContent = data.title;
    timelineText.textContent = data.text;
    timelineList.innerHTML = "";

    data.items.forEach((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      timelineList.appendChild(item);
    });

    timelineButtons.forEach((button) => {
      const isActive = button.dataset.timeline === key;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    if (key === "hoje" || key === "futuro") {
      unlockAchievement("pesquisa");
    }
  }

  function shuffleQuizQuestions() {
    const shuffled = quizQuestions.slice();

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      const current = shuffled[index];
      shuffled[index] = shuffled[randomIndex];
      shuffled[randomIndex] = current;
    }

    return shuffled;
  }

  function getQuizTotal() {
    return activeQuizQuestions.length || quizQuestions.length;
  }

  // Quiz: abre a janela, sorteia perguntas, verifica respostas e exibe a pontuacao.
  function openQuizModal() {
    clearTimeout(quizHideTimer);
    quizModalOverlay.hidden = false;
    quizModal.hidden = false;
    quizModal.inert = false;
    window.requestAnimationFrame(function () {
      body.classList.add("quiz-modal-open");
    });
    quizModal.setAttribute("aria-hidden", "false");
    startQuizSession();
    quizCloseButton.focus();
  }

  function closeQuizModal() {
    body.classList.remove("quiz-modal-open");
    quizModal.setAttribute("aria-hidden", "true");
    quizModal.inert = true;

    if (!quizCompleted && activeQuizQuestions.length > 0) {
      quizSectionResult.hidden = false;
      quizSectionResult.textContent = "Quiz fechado antes do fim. Clique em Comecar quiz para iniciar uma nova tentativa.";
    }

    quizHideTimer = window.setTimeout(function () {
      quizModalOverlay.hidden = true;
      quizModal.hidden = true;
      quizStartButton.focus();
    }, 220);
  }

  function closeObservatoryMobileDetails(restoreFocus) {
    body.classList.remove("observatory-mobile-detail-open");

    if (restoreFocus) {
      const activeButton = zoneButtons.find((button) => button.classList.contains("is-active"));
      if (activeButton) {
        activeButton.focus();
      }
    }
  }

  function openObservatoryMobileDetails() {
    if (!mobileDialogQuery.matches || !body.classList.contains("observatory-mobile-open")) {
      return;
    }

    body.classList.add("observatory-mobile-detail-open");
    observatoryDetailCloseButton.focus();
  }

  function closeObservatoryMobileDialog(restoreFocus) {
    body.classList.remove("observatory-mobile-open");
    closeObservatoryMobileDetails(false);
    observatoryMobileOpenButton.setAttribute("aria-expanded", "false");

    if (restoreFocus) {
      observatoryMobileOpenButton.focus();
    }
  }

  function openObservatoryMobileDialog() {
    if (!mobileDialogQuery.matches) {
      return;
    }

    closeObservatoryMobileDetails(false);
    body.classList.add("observatory-mobile-open");
    observatoryMobileOpenButton.setAttribute("aria-expanded", "true");
    observatoryMobileCloseButton.focus();
  }

  function syncMobileDialogsForViewport() {
    if (mobileDialogQuery.matches) {
      return;
    }

    closeObservatoryMobileDialog(false);
  }

  function renderQuiz() {
    if (activeQuizQuestions.length === 0) {
      activeQuizQuestions = shuffleQuizQuestions();
    }

    const total = getQuizTotal();
    const current = activeQuizQuestions[quizIndex];
    quizAnswered = false;
    quizCounter.textContent = `Pergunta ${quizIndex + 1} de ${total}`;
    quizQuestion.textContent = current.question;
    quizFeedback.textContent = "";
    quizNextButton.disabled = true;
    quizNextButton.textContent = quizIndex === total - 1 ? "Ver resultado" : "Proxima pergunta";
    quizProgressFill.style.width = `${(quizIndex / total) * 100}%`;
    quizOptions.innerHTML = "";

    current.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.className = "quiz-option";
      button.type = "button";
      button.textContent = option;
      button.setAttribute("aria-label", `Resposta: ${option}`);
      button.addEventListener("click", function () {
        answerQuiz(index);
      });
      quizOptions.appendChild(button);
    });
  }

  function answerQuiz(selectedIndex) {
    if (quizAnswered) {
      return;
    }

    const current = activeQuizQuestions[quizIndex];
    const optionButtons = Array.from(quizOptions.querySelectorAll(".quiz-option"));
    const isCorrect = selectedIndex === current.answer;
    const total = getQuizTotal();
    quizAnswered = true;

    if (isCorrect) {
      quizScore += 1;
    }

    optionButtons.forEach((button, index) => {
      button.disabled = true;
      if (index === current.answer) {
        button.classList.add("is-correct");
      } else if (index === selectedIndex) {
        button.classList.add("is-wrong");
      }
    });

    quizFeedback.textContent = `${isCorrect ? "Resposta correta." : "Resposta incorreta."} ${current.explanation}`;
    quizScoreValue.textContent = `${quizScore}/${total}`;
    quizNextButton.disabled = false;
    quizProgressFill.style.width = `${((quizIndex + 1) / total) * 100}%`;
  }

  function finishQuiz() {
    const total = getQuizTotal();
    const percentage = Math.round((quizScore / total) * 100);
    quizCompleted = true;
    quizQuestion.textContent = "Resultado final";
    quizCounter.textContent = "Quiz concluido";
    quizOptions.innerHTML = "";
    quizFeedback.textContent = `Você acertou ${quizScore} de ${total} perguntas.`;
    quizSectionResult.hidden = false;
    quizSectionResult.textContent = `Último resultado: você acertou ${quizScore} de ${total} perguntas (${percentage}%).`;
    quizStartButton.textContent = "Refazer quiz";
    quizResultText.textContent =
      percentage >= 80
        ? "Excelente leitura do tema. Você demonstrou domínio sobre produção sustentável."
        : "Bom caminho. Reveja as explicações e tente novamente para fortalecer sua pontuação.";
    quizNextButton.disabled = true;
    quizProgressFill.style.width = "100%";
    lastQuizPercentage = percentage;
    completeJourneyMilestone("quiz", { quizPercentage: percentage });
    unlockAchievement("quiz");
  }

  function startQuizSession() {
    activeQuizQuestions = shuffleQuizQuestions();
    quizIndex = 0;
    quizScore = 0;
    quizAnswered = false;
    quizCompleted = false;
    quizScoreValue.textContent = `0/${getQuizTotal()}`;
    quizResultText.textContent = "Responda as perguntas para ver seu desempenho.";
    quizSectionResult.hidden = true;
    quizSectionResult.textContent = "";
    renderQuiz();
  }

  // Cursor personalizado: adiciona resposta visual ao clique ou toque.
  function bindCursorFeedback() {
    const activate = function () {
      body.classList.add("is-pressing");
    };

    const release = function () {
      body.classList.remove("is-pressing");
    };

    document.addEventListener("mousedown", activate);
    document.addEventListener("mouseup", release);
    document.addEventListener("touchstart", activate, { passive: true });
    document.addEventListener("touchend", release);
    window.addEventListener("blur", release);
  }

  // Eventos: conecta botoes, formularios, seletores e atalhos de teclado as funcoes.
  settingsToggleButton.addEventListener("click", function () {
    if (body.classList.contains("settings-open")) {
      closeSettings();
      return;
    }

    openSettings();
  });
  settingsCloseButton.addEventListener("click", closeSettings);
  settingsOverlay.addEventListener("click", closeSettings);

  themeChoiceButtons.forEach((button) => {
    button.addEventListener("click", function () {
      setTheme(button.dataset.themeChoice);
    });
  });

  quoteButton.addEventListener("click", function () {
    const randomIndex = Math.floor(Math.random() * quotePool.length);
    setDayMessage({
      title: "Mensagem inspiradora",
      text: quotePool[randomIndex],
    });
  });

  tourStartButton.addEventListener("click", startTour);
  tourCloseButton.addEventListener("click", function () {
    closeTour(true);
  });
  tourPreviousButton.addEventListener("click", function () {
    renderTourStep(currentTourIndex - 1);
  });
  tourNextButton.addEventListener("click", function () {
    if (currentTourIndex === tourSteps.length - 1) {
      closeTour(true);
      return;
    }
    renderTourStep(currentTourIndex + 1);
  });
  tourAutoButton.addEventListener("click", function () {
    setTourAutoPlaying(!tourAutoPlaying);
  });
  tourVoiceButton.addEventListener("click", function () {
    if (tourVoiceEnabled && tourAudioNeedsGesture) {
      playCurrentTourAudio();
      return;
    }
    setTourVoiceEnabled(!tourVoiceEnabled);
  });
  tourAudio.addEventListener("play", function () {
    tourAudioNeedsGesture = false;
    tourVoiceButton.textContent = "Silenciar";
    tourVoiceButton.setAttribute("aria-pressed", "true");
    tourVoiceButton.setAttribute("aria-label", "Silenciar áudio gravado da apresentação");
    tourCharacter.classList.add("is-speaking");
  });
  tourAudio.addEventListener("pause", function () {
    tourCharacter.classList.remove("is-speaking");
  });
  tourAudio.addEventListener("ended", function () {
    tourCharacter.classList.remove("is-speaking");
    if (!tourVoiceEnabled || !tourAutoPlaying || !body.classList.contains("tour-active")) {
      return;
    }

    clearTourTimer();
    tourTimer = window.setTimeout(function () {
      if (currentTourIndex === tourSteps.length - 1) {
        closeTour(true);
        return;
      }
      renderTourStep(currentTourIndex + 1);
    }, 700);
  });
  tourAudio.addEventListener("error", function () {
    tourCharacter.classList.remove("is-speaking");
    tourAudioNeedsGesture = true;
    tourVoiceButton.textContent = "Tocar áudio";
    tourVoiceButton.setAttribute("aria-pressed", "true");
    tourVoiceButton.setAttribute("aria-label", "Tocar áudio gravado da apresentação");
  });

  careRange.addEventListener("input", function () {
    scenarioInteractionStarted = true;
    updateScenario();
  });
  focusSelect.addEventListener("change", function () {
    scenarioInteractionStarted = true;
    updateScenario();
  });
  strategyInputs.forEach((input) => {
    input.addEventListener("change", function () {
      scenarioInteractionStarted = true;
      updateScenario();
      if (input.checked && input.value === "irrigacao") {
        unlockAchievement("agua");
      } else if (input.checked && input.value === "energia") {
        unlockAchievement("energia");
      } else if (input.checked && input.value === "compostagem") {
        unlockAchievement("solo");
      }
    });
  });

  resetScenarioButton.addEventListener("click", function () {
    scenarioInteractionStarted = true;
    strategyInputs.forEach((input) => {
      input.checked = input.value !== "compostagem";
    });
    careRange.value = "4";
    focusSelect.value = "solo";
    updateScenario();
  });

  audioToggleButton.addEventListener("click", toggleThemeAudio);
  audioPrevButton.addEventListener("click", function () {
    changeMusicTrack(-1);
  });
  audioNextButton.addEventListener("click", function () {
    changeMusicTrack(1);
  });
  quickMusicToggleButton.addEventListener("click", toggleThemeAudio);
  quickMusicPrevButton.addEventListener("click", function () {
    changeMusicTrack(-1);
  });
  quickMusicNextButton.addEventListener("click", function () {
    changeMusicTrack(1);
  });
  audioVolumeRange.addEventListener("input", function () {
    themeAudio.volume = Number(audioVolumeRange.value) / 100;
    if (!themeAudio.paused) {
      updateAudioMessage(`Volume ajustado para ${audioVolumeRange.value}%.`);
      return;
    }
    updateQuickDockState();
  });

  themeAudio.addEventListener("error", function () {
    updateAudioMessage("Arquivo de áudio não encontrado. Verifique se musica1.mp3, musica2.mp3 e musica3.mp3 estão na pasta musica.");
  });
  themeAudio.addEventListener("play", updateQuickDockState);
  themeAudio.addEventListener("pause", updateQuickDockState);

  ambientToggleButton.addEventListener("click", toggleAmbientSound);
  ambientPrevButton.addEventListener("click", function () {
    changeAmbientMode(-1);
  });
  ambientNextButton.addEventListener("click", function () {
    changeAmbientMode(1);
  });
  quickAmbientToggleButton.addEventListener("click", toggleAmbientSound);
  quickAmbientPrevButton.addEventListener("click", function () {
    changeAmbientMode(-1);
  });
  quickAmbientNextButton.addEventListener("click", function () {
    changeAmbientMode(1);
  });
  ambientVolumeRange.addEventListener("input", function () {
    ambientAudio.volume = Number(ambientVolumeRange.value) / 100;
    if (ambientPlaying) {
      ambientStatus.textContent = `Volume do ambiente ajustado para ${ambientVolumeRange.value}%.`;
    }
    updateQuickDockState();
  });
  ambientAudio.addEventListener("error", function () {
    const ambientMode = getCurrentAmbientMode();
    ambientStatus.textContent = `Arquivo de ambiente não encontrado. Verifique se ${ambientMode.src} está na pasta musica.`;
    updateQuickDockState();
  });
  ambientAudio.addEventListener("play", updateQuickDockState);
  ambientAudio.addEventListener("pause", updateQuickDockState);

  fontDecreaseButton.addEventListener("click", function () {
    changeFontScale(-1);
  });
  fontResetButton.addEventListener("click", function () {
    applyFontScale("normal");
  });
  fontIncreaseButton.addEventListener("click", function () {
    changeFontScale(1);
  });
  readerButton.addEventListener("click", readPageSummary);
  quickReaderButton.addEventListener("click", readPageSummary);
  readerStopButton.addEventListener("click", stopPageSummary);
  quickReaderStopButton.addEventListener("click", stopPageSummary);
  summaryAudio.addEventListener("play", function () {
    readingSummary = true;
    readerStatus.textContent = "Resumo em leitura. Você pode continuar navegando pelo site.";
    updateQuickDockState();
  });
  summaryAudio.addEventListener("ended", function () {
    readingSummary = false;
    readerStatus.textContent = "Leitura finalizada.";
    updateQuickDockState();
  });
  summaryAudio.addEventListener("error", function () {
    readingSummary = false;
    readerStatus.textContent = "Arquivo do resumo não encontrado.";
    updateQuickDockState();
  });
  readingModeButton.addEventListener("click", function () {
    applyReadingMode(!body.classList.contains("reading-mode"));
  });

  quickDockToggleButton.addEventListener("click", function () {
    setQuickDockOpen(!body.classList.contains("quick-dock-open"));
  });
  quickTopButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQuickDockOpen(false);
  });

  pledgeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    currentManifesto = buildManifesto();
    pledgePreview.textContent = currentManifesto;
    pledgeStatus.textContent = "Manifesto criado. Se quiser, agora você pode guardar no mural.";
  });

  savePledgeButton.addEventListener("click", function () {
    currentManifesto = buildManifesto();
    pledgePreview.textContent = currentManifesto;

    const formData = new FormData(pledgeForm);
    const name = String(formData.get("personName") || "").trim() || "Participante";
    const role = String(formData.get("personRole") || "estudante");
    const priority = String(formData.get("personPriority") || "agua");

    const pledges = getStoredPledges();
    pledges.unshift({
      name,
      role,
      priority,
      message: currentManifesto,
    });

    saveStoredPledges(pledges.slice(0, 6));
    renderPledgeWall();
    pledgeStatus.textContent = "Manifesto salvo no mural local deste navegador.";
    completeJourneyMilestone("pledge");
    unlockAchievement("compromisso");
  });

  clearPledgesButton.addEventListener("click", function () {
    localStorage.removeItem(STORAGE_KEYS.mural);
    renderPledgeWall();
    pledgeStatus.textContent = "Mural limpo com sucesso.";
  });

  zoneButtons.forEach((button) => {
    button.addEventListener("click", function () {
      renderZoneProfile(button.dataset.zone, true);
      openObservatoryMobileDetails();
    });
  });

  observatoryMobileOpenButton.addEventListener("click", openObservatoryMobileDialog);
  observatoryMobileCloseButton.addEventListener("click", function () {
    closeObservatoryMobileDialog(true);
  });
  observatoryDetailCloseButton.addEventListener("click", function () {
    closeObservatoryMobileDetails(true);
  });

  timelineButtons.forEach((button) => {
    button.addEventListener("click", function () {
      renderTimeline(button.dataset.timeline);
    });
  });

  dataSourceLinks.forEach((link) => {
    link.addEventListener("click", function () {
      completeJourneyMilestone("data");
      unlockAchievement("pesquisa");
    });
  });

  futureRange.addEventListener("input", function () {
    futureCompare.style.setProperty("--future-position", `${futureRange.value}%`);
  });

  blowStartButton.addEventListener("click", toggleBlowDetection);
  plantFallbackButton.addEventListener("click", function () {
    scatterSeeds("button");
  });
  seedCompanionButton.addEventListener("click", function () {
    setSeedCompanionExpanded(!seedCompanion.classList.contains("is-expanded"));
  });
  seedCompanionDetails.querySelector("a").addEventListener("click", function () {
    setSeedCompanionExpanded(false);
  });
  refreshNewspaperButton.addEventListener("click", function () {
    renderFutureNewspaper();
    newspaperStatus.textContent = "Manchete atualizada com as escolhas mais recentes.";
  });
  downloadNewspaperButton.addEventListener("click", downloadNewspaper);
  document.getElementById("personName").addEventListener("input", renderFutureNewspaper);

  window.addEventListener("scroll", updateLivingRoots, { passive: true });
  window.addEventListener("resize", updateLivingRoots);
  document.addEventListener("pointerdown", function (event) {
    if (!seedCompanion.contains(event.target)) setSeedCompanionExpanded(false);
  });

  if ("IntersectionObserver" in window) {
    const dataJourneyObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            completeJourneyMilestone("data");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.55 }
    );
    dataJourneyObserver.observe(document.getElementById("dados"));
  }

  quizStartButton.addEventListener("click", openQuizModal);
  quizCloseButton.addEventListener("click", closeQuizModal);
  quizModalOverlay.addEventListener("click", closeQuizModal);

  quizNextButton.addEventListener("click", function () {
    if (!quizAnswered) {
      return;
    }

    if (quizIndex >= getQuizTotal() - 1) {
      finishQuiz();
      return;
    }

    quizIndex += 1;
    renderQuiz();
  });

  quizRestartButton.addEventListener("click", startQuizSession);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && seedCompanion.classList.contains("is-expanded")) {
      setSeedCompanionExpanded(false);
      seedCompanionButton.focus();
    }

    if (body.classList.contains("tour-active")) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeTour(true);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (currentTourIndex === tourSteps.length - 1) {
          closeTour(true);
        } else {
          renderTourStep(currentTourIndex + 1);
        }
        return;
      }
      if (event.key === "ArrowLeft" && currentTourIndex > 0) {
        event.preventDefault();
        renderTourStep(currentTourIndex - 1);
        return;
      }
    }

    if (event.key === "Escape" && body.classList.contains("settings-open")) {
      closeSettings();
    }
    if (event.key === "Escape" && body.classList.contains("quick-dock-open")) {
      setQuickDockOpen(false);
    }
    if (event.key === "Escape" && body.classList.contains("observatory-mobile-detail-open")) {
      closeObservatoryMobileDetails(true);
      return;
    }
    if (event.key === "Escape" && body.classList.contains("observatory-mobile-open")) {
      closeObservatoryMobileDialog(true);
    }
    if (event.key === "Escape" && body.classList.contains("quiz-modal-open")) {
      closeQuizModal();
    }
  });

  if (mobileDialogQuery.addEventListener) {
    mobileDialogQuery.addEventListener("change", syncMobileDialogsForViewport);
  } else {
    mobileDialogQuery.addListener(syncMobileDialogsForViewport);
  }

  // Inicializacao: aplica preferencias, renderiza conteudos dinamicos e ativa interacoes.
  applyDefaultPreferences();
  applyStoredMode();
  applyFontScale(localStorage.getItem(STORAGE_KEYS.fontScale) || DEFAULT_SETTINGS.fontScale);
  applyReadingMode(localStorage.getItem(STORAGE_KEYS.readingMode) === "true");
  setDayMessage(getPeriodMessage());
  lastQuizPercentage = Number(livingJourney.quizPercentage || 0);
  setTourVoiceEnabled(true);
  setTourAutoPlaying(tourAutoPlaying);
  themeAudio.src = getCurrentMusicTrack().src;
  themeAudio.volume = Number(audioVolumeRange.value) / 100;
  ambientAudio.src = getCurrentAmbientMode().src;
  ambientAudio.volume = Number(ambientVolumeRange.value) / 100;
  renderAchievements();
  updateQuickDockState();
  renderTimeline(activeTimeline);
  renderZoneProfile(activeZone, false);
  updateScenario();
  futureCompare.style.setProperty("--future-position", `${futureRange.value}%`);
  updateLivingRoots();
  renderPledgeWall();
  observeReveals();
  bindCursorFeedback();
})();
