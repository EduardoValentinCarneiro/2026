(function () {
  const STORAGE_KEYS = {
    mode: "agrinho-mode",
    mural: "agrinho-mural",
  };

  const strategyValues = {
    irrigacao: {
      water: 16,
      biodiversity: 8,
      economy: 10,
      city: 6,
      highlight: "A irrigacao inteligente reduz desperdicio e protege nascentes.",
    },
    energia: {
      water: 4,
      biodiversity: 7,
      economy: 15,
      city: 7,
      highlight: "Energia limpa diminui custos e torna a producao mais resiliente.",
    },
    compostagem: {
      water: 7,
      biodiversity: 15,
      economy: 8,
      city: 5,
      highlight: "Compostagem devolve vida ao solo e reduz residuos do processo produtivo.",
    },
    logistica: {
      water: 2,
      biodiversity: 5,
      economy: 11,
      city: 17,
      highlight: "Rotas mais conscientes encurtam distancias e diminuem perdas ate a cidade.",
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
      text: "Mesmo no silencio da noite, a tecnologia pode cuidar do campo com precisao e economia.",
    },
    manha: {
      title: "Manha de cuidado",
      text: "Toda boa colheita comeca em escolhas pequenas, repetidas com responsabilidade.",
    },
    tarde: {
      title: "Tarde de produtividade consciente",
      text: "Produzir mais faz sentido quando a natureza continua forte para o proximo ciclo.",
    },
    noite: {
      title: "Noite de reflexao",
      text: "A cidade tambem participa do equilibrio quando consome com mais consciencia.",
    },
  };

  const quotePool = [
    "Sustentabilidade e quando a producao de hoje nao compromete a colheita de amanha.",
    "Tecnologia faz mais sentido quando ajuda a cuidar da terra, da agua e das pessoas.",
    "Cada alimento carrega uma historia. Quanto mais consciente o manejo, mais forte o futuro.",
    "Campo e cidade nao competem: se completam quando existe responsabilidade dos dois lados.",
  ];

  const priorityText = {
    agua: "defender o uso inteligente da agua",
    solo: "valorizar a saude do solo",
    energia: "ampliar a energia limpa no agro",
    consumo: "estimular um consumo mais consciente na cidade",
  };

  const roleText = {
    estudante: "Como estudante, eu quero aprender, compartilhar e agir com responsabilidade.",
    campo: "Falando a partir do campo, eu reconheco que produzir bem tambem e preservar.",
    cidade: "Falando a partir da cidade, eu escolho consumir com mais consciencia e respeito pela origem.",
  };

  const focusLabel = {
    solo: "protecao do solo",
    agua: "cuidado com a agua",
    energia: "energia limpa",
    cidade: "aproximacao entre campo e cidade",
  };

  const html = document.documentElement;
  const skyModeButton = document.getElementById("skyModeButton");
  const quoteButton = document.getElementById("quoteButton");
  const dayMessageTitle = document.getElementById("dayMessageTitle");
  const dayMessageText = document.getElementById("dayMessageText");

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

  const pledgeForm = document.getElementById("pledgeForm");
  const pledgePreview = document.getElementById("pledgePreview");
  const pledgeStatus = document.getElementById("pledgeStatus");
  const savePledgeButton = document.getElementById("savePledgeButton");
  const clearPledgesButton = document.getElementById("clearPledgesButton");
  const pledgeWall = document.getElementById("pledgeWall");

  let currentManifesto = "";

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

  function applyStoredMode() {
    const storedMode = localStorage.getItem(STORAGE_KEYS.mode);
    html.dataset.mode = storedMode === "night" ? "night" : "day";
    skyModeButton.textContent = html.dataset.mode === "night" ? "Ver amanhecer" : "Ver paisagem noturna";
  }

  function toggleMode() {
    const nextMode = html.dataset.mode === "night" ? "day" : "night";
    html.dataset.mode = nextMode;
    localStorage.setItem(STORAGE_KEYS.mode, nextMode);
    skyModeButton.textContent = nextMode === "night" ? "Ver amanhecer" : "Ver paisagem noturna";
  }

  function setDayMessage(message) {
    dayMessageTitle.textContent = message.title;
    dayMessageText.textContent = message.text;
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
      return "Sem praticas ativas, o sistema perde eficiencia, o ambiente fica vulneravel e o futuro da producao enfraquece.";
    }

    if (score >= 85) {
      return `O cenario esta muito forte. O foco em ${focusLabel[focus]} se soma a boas praticas e mostra que produzir com inteligencia pode proteger o ambiente e fortalecer a cidade ao mesmo tempo.`;
    }

    if (score >= 65) {
      return "O caminho esta consistente. Ja existe equilibrio, mas novas escolhas podem ampliar o impacto positivo e deixar a cadeia produtiva ainda mais sustentavel.";
    }

    if (score >= 45) {
      return "O cenario tem potencial, mas ainda depende de ajustes para evitar perdas ambientais e garantir mais estabilidade economica.";
    }

    return "O equilibrio ainda esta fragil. Falta integrar melhor tecnologia, preservacao ambiental e conexao com quem consome.";
  }

  function renderHighlights(selectedStrategies, focus) {
    impactHighlights.innerHTML = "";
    const highlights = selectedStrategies.map((strategy) => strategyValues[strategy].highlight);

    if (focus === "solo") {
      highlights.push("Quando o solo e bem cuidado, a produtividade deixa de ser imediatista e ganha continuidade.");
    } else if (focus === "agua") {
      highlights.push("Agua preservada no campo representa seguranca produtiva e protecao ambiental.");
    } else if (focus === "energia") {
      highlights.push("Energia limpa reduz custos e ajuda o agro a crescer com menos pressao ambiental.");
    } else {
      highlights.push("Campo e cidade se aproximam quando a origem do alimento e valorizada com mais clareza.");
    }

    highlights.slice(0, 4).forEach((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      impactHighlights.appendChild(item);
    });
  }

  function updateScenario() {
    // Soma as escolhas do usuario e converte isso em indicadores visuais do cenario.
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
      balanceLevel.textContent = "Equilibrio exemplar";
    } else if (finalScore >= 65) {
      balanceLevel.textContent = "Cenario promissor";
    } else if (finalScore >= 45) {
      balanceLevel.textContent = "Precisa evoluir";
    } else {
      balanceLevel.textContent = "Equilibrio fragil";
    }

    waterMetric.textContent = `${finalWater}%`;
    biodiversityMetric.textContent = `${finalBiodiversity}%`;
    economyMetric.textContent = `${finalEconomy}%`;
    cityMetric.textContent = `${finalCity}%`;
    impactNarrative.textContent = buildNarrative(finalScore, focus, selectedStrategies);
    renderHighlights(selectedStrategies, focus);
  }

  function buildManifesto() {
    const formData = new FormData(pledgeForm);
    const name = String(formData.get("personName") || "").trim();
    const role = String(formData.get("personRole") || "estudante");
    const priority = String(formData.get("personPriority") || "agua");
    const action = String(formData.get("personAction") || "").trim();
    const prefix = name ? `${name} afirma:` : "Eu afirmo:";

    return `${prefix} ${roleText[role]} Por isso, escolho ${priorityText[priority]} e transformar em pratica a seguinte atitude: ${action || "agir todos os dias com mais consciencia para aproximar producao, natureza e sociedade."}`;
  }

  function getStoredPledges() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.mural);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  }

  function saveStoredPledges(pledges) {
    localStorage.setItem(STORAGE_KEYS.mural, JSON.stringify(pledges));
  }

  function renderPledgeWall() {
    // O mural usa localStorage para manter as mensagens nesta maquina.
    const pledges = getStoredPledges();
    pledgeWall.innerHTML = "";

    if (pledges.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.textContent = "Ainda nao ha compromissos salvos. Gere um manifesto e guarde sua mensagem.";
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

  function registerServiceWorker() {
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    }
  }

  skyModeButton.addEventListener("click", toggleMode);

  quoteButton.addEventListener("click", function () {
    const randomIndex = Math.floor(Math.random() * quotePool.length);
    setDayMessage({
      title: "Mensagem inspiradora",
      text: quotePool[randomIndex],
    });
  });

  careRange.addEventListener("input", updateScenario);
  focusSelect.addEventListener("change", updateScenario);
  strategyInputs.forEach((input) => input.addEventListener("change", updateScenario));

  resetScenarioButton.addEventListener("click", function () {
    strategyInputs.forEach((input) => {
      input.checked = input.value !== "compostagem";
    });
    careRange.value = "4";
    focusSelect.value = "solo";
    updateScenario();
  });

  pledgeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    currentManifesto = buildManifesto();
    pledgePreview.textContent = currentManifesto;
    pledgeStatus.textContent = "Manifesto criado. Se quiser, agora voce pode guardar no mural.";
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
  });

  clearPledgesButton.addEventListener("click", function () {
    localStorage.removeItem(STORAGE_KEYS.mural);
    renderPledgeWall();
    pledgeStatus.textContent = "Mural limpo com sucesso.";
  });

  applyStoredMode();
  setDayMessage(getPeriodMessage());
  updateScenario();
  renderPledgeWall();
  observeReveals();
  registerServiceWorker();
})();
