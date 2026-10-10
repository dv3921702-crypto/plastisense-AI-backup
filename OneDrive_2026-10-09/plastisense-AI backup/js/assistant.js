/**
 * PlastiSense AI - Multi-Lingual Conversational AI Assistant & Voice Engine
 * Connects to backend AI API for context-aware responses
 * Supports text input + microphone voice speech-to-text (Web Speech API)
 * Voice response output (SpeechSynthesis)
 * Languages: English, Tamil, Telugu, Kannada, Malayalam, and Hindi
 */

const MapAssistant = {
  chatContainer: null,
  chatInput: null,
  recognition: null,
  isListening: false,
  voiceResponseEnabled: false,
  pendingTargets: new Set(),

  init() {
    this.chatContainer = document.getElementById("chatMessagesContainer");
    this.chatInput = document.getElementById("chatTextInput");
    this.voiceResponseEnabled = localStorage.getItem("plastisense_voice_response") === "true";
    this.bindEvents();
    this.initSpeechRecognition();
    this.updateVoiceToggle();
    window.addEventListener("plastisense:langchange", () => this.updateVoiceToggle());
  },

  bindEvents() {
    // Map chat send button
    const sendBtn = document.getElementById("btnChatSend");
    if (sendBtn) {
      sendBtn.addEventListener("click", () => this.handleUserMessage("map"));
    }

    if (this.chatInput) {
      this.chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.handleUserMessage("map");
      });
    }

    // Voice button for map
    const micBtnMap = document.getElementById("btnMapVoiceInput");
    if (micBtnMap) {
      micBtnMap.addEventListener("click", () => this.toggleVoiceInput("map"));
    }

    // Global AI Assistant Modal triggers & elements
    const floatingBtn = document.getElementById("btnGlobalAssistantFloating");
    const assistantModal = document.getElementById("globalAssistantModal");
    const closeAssistantModal = document.getElementById("btnCloseGlobalAssistant");

    if (floatingBtn && assistantModal) {
      floatingBtn.addEventListener("click", () => {
        assistantModal.classList.add("open");
        const inp = document.getElementById("globalAssistantInput");
        if (inp) inp.focus();
      });
    }

    if (closeAssistantModal && assistantModal) {
      closeAssistantModal.addEventListener("click", () => {
        assistantModal.classList.remove("open");
      });
    }

    const globalSendBtn = document.getElementById("btnGlobalAssistantSend");
    const globalInput = document.getElementById("globalAssistantInput");
    if (globalSendBtn) {
      globalSendBtn.addEventListener("click", () => this.handleUserMessage("global"));
    }
    if (globalInput) {
      globalInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") this.handleUserMessage("global");
      });
    }

    const micBtnGlobal = document.getElementById("btnGlobalVoiceInput");
    if (micBtnGlobal) {
      micBtnGlobal.addEventListener("click", () => this.toggleVoiceInput("global"));
    }

    // Voice response toggle
    const voiceToggle = document.getElementById("btnVoiceResponseToggle");
    if (voiceToggle) {
      voiceToggle.addEventListener("click", () => {
        this.voiceResponseEnabled = !this.voiceResponseEnabled;
        localStorage.setItem("plastisense_voice_response", String(this.voiceResponseEnabled));
        if (!this.voiceResponseEnabled && "speechSynthesis" in window) window.speechSynthesis.cancel();
        this.updateVoiceToggle();
      });
    }

    // Quick Prompt Chips in Map
    document.querySelectorAll(".chat-chip").forEach((chip) => {
      chip.addEventListener("click", (e) => {
        const text = e.target.closest('.chat-chip').getAttribute("data-query") || e.target.textContent;
        this.ask(text, "map");
      });
    });

    // Quick Prompt Chips in Global Modal
    document.querySelectorAll(".global-assistant-chip").forEach((chip) => {
      chip.addEventListener("click", (e) => {
        const text = e.target.closest('.global-assistant-chip').getAttribute("data-query") || e.target.textContent;
        this.ask(text, "global");
      });
    });
  },

  updateVoiceToggle() {
    const button = document.getElementById("btnVoiceResponseToggle");
    if (!button) return;
    button.textContent = `${this.voiceResponseEnabled ? "🔊 " : "🔇 "}${I18N.t(this.voiceResponseEnabled ? "assistant_voice_on" : "assistant_voice_off")}`;
    button.setAttribute("aria-label", I18N.t(this.voiceResponseEnabled ? "ui_voice_response_on" : "ui_voice_response_off"));
    button.classList.toggle("active", this.voiceResponseEnabled);
  },

  initSpeechRecognition() {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) {
      console.info("Web Speech API not supported in this browser engine.");
      return;
    }

    try {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateListeningUI(true);
      };

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (this.currentVoiceTarget === "global") {
          const inp = document.getElementById("globalAssistantInput");
          if (inp) {
            inp.value = transcript;
            this.handleUserMessage("global");
          }
        } else {
          if (this.chatInput) {
            this.chatInput.value = transcript;
            this.handleUserMessage("map");
          }
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        this.updateListeningUI(false);
        const errType = event.error;
        if (errType === "not-allowed") {
          this.appendMessage("bot", I18N.t("ui_mic_denied"), this.currentVoiceTarget || "map");
        } else if (errType === "no-speech") {
          this.appendMessage("bot", I18N.t("ui_voice_no_speech"), this.currentVoiceTarget || "map");
        } else if (errType === "network") {
          this.appendMessage("bot", I18N.t("ui_voice_network"), this.currentVoiceTarget || "map");
        } else if (errType === "audio-capture") {
          this.appendMessage("bot", I18N.t("ui_voice_no_mic"), this.currentVoiceTarget || "map");
        } else {
          this.appendMessage("bot", I18N.t("ui_voice_start_error"), this.currentVoiceTarget || "map");
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.updateListeningUI(false);
      };
    } catch (e) {
      console.warn("Speech recognition initialization error", e);
    }
  },

  toggleVoiceInput(target = "map") {
    this.currentVoiceTarget = target;
    if (!this.recognition) {
      this.appendMessage("bot", I18N.t("ui_speech_not_supported"), target);
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.updateListeningUI(false);
    } else {
      const langMap = {
        en: "en-IN",
        ta: "ta-IN",
        te: "te-IN",
        kn: "kn-IN",
        ml: "ml-IN",
        hi: "hi-IN"
      };
      const cur = window.I18N ? window.I18N.currentLang : "en";
      this.recognition.lang = langMap[cur] || "en-IN";

      // Show listening indicator
      this.appendMessage("bot", I18N.t("voice_listening"), target);

      try {
        this.recognition.start();
      } catch (err) {
        this.isListening = false;
        this.updateListeningUI(false);
        this.appendMessage("bot", I18N.t("ui_voice_start_retry"), target);
      }
    }
  },

  getLangName(code) {
    const names = { en: "English", ta: "Tamil (தமிழ்)", te: "Telugu (తెలుగు)", kn: "Kannada (ಕನ್ನಡ)", ml: "Malayalam (മലയാളം)", hi: "Hindi (हिन्दी)" };
    return names[code] || "English";
  },

  updateListeningUI(active) {
    const micBtns = [document.getElementById("btnMapVoiceInput"), document.getElementById("btnGlobalVoiceInput")];
    micBtns.forEach((btn) => {
      if (!btn) return;
      if (active) {
        btn.classList.add("recording-pulse");
        btn.innerHTML = "🎙️";
        btn.setAttribute("title", I18N.t("ui_voice_stop"));
      } else {
        btn.classList.remove("recording-pulse");
        btn.innerHTML = "🎤";
        btn.setAttribute("title", I18N.t("voice_input_btn"));
      }
    });
  },

  ask(text, target = "map") {
    if (target === "global") {
      const inp = document.getElementById("globalAssistantInput");
      if (inp) inp.value = text;
    } else {
      if (this.chatInput) this.chatInput.value = text;
    }
    this.handleUserMessage(target);
  },

  handleUserMessage(target = "map") {
    let inputEl = this.chatInput;
    if (target === "global") {
      inputEl = document.getElementById("globalAssistantInput");
    }
    if (!inputEl) return;

    const text = inputEl.value.trim();
    if (!text || this.pendingTargets.has(target)) return;

    inputEl.value = "";
    this.appendMessage("user", text, target);
    this.pendingTargets.add(target);
    this.updatePendingState(target, true);

    // Send to AI backend
    this.processQueryViaAPI(text, target);
  },

  async processQueryViaAPI(rawQuery, target = "map") {
    // Gather application context
    const context = this.gatherAppContext();
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 20000);

    try {
      const resp = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          question: rawQuery,
          context: context,
          language: window.I18N ? window.I18N.currentLang : 'en'
        })
      });

      const data = await resp.json();
      if (!resp.ok || data.error) throw new Error("AI request failed.");

      const reply = data.answer;
      if (typeof reply !== "string" || !reply.trim()) {
        throw new Error("The AI service returned an empty response.");
      }
      this.appendMessage("bot", reply, target);
      this.appendListenButton(target, reply);

      // Auto-speak if voice responses enabled
      if (this.voiceResponseEnabled) {
        this.speakAnswer(reply);
      }

      // Log to history
      if (window.HistoryModule) {
        HistoryModule.addItem("CHAT", "AI Assistant Conversation", `User asked: "${rawQuery}" → response source: ${data.source || "AI"}.`);
      }
    } catch (e) {
      this.appendMessage("bot", I18N.t("ui_assistant_unavailable"), target);
    } finally {
      window.clearTimeout(timeoutId);
      this.pendingTargets.delete(target);
      this.updatePendingState(target, false);
    }
  },

  updatePendingState(target, pending) {
    const container = target === "global"
      ? document.getElementById("globalAssistantMessages")
      : this.chatContainer;
    const sendButton = document.getElementById(target === "global" ? "btnGlobalAssistantSend" : "btnChatSend");
    if (sendButton) sendButton.disabled = pending;
    if (!container) return;

    const status = container.querySelector(".assistant-pending");
    if (pending && !status) {
      const message = document.createElement("div");
      message.className = "chat-msg bot assistant-pending";
      message.setAttribute("role", "status");
      message.setAttribute("aria-live", "polite");
      message.textContent = window.I18N ? I18N.t("assistant_waiting") : "Waiting for an AI response...";
      container.appendChild(message);
      container.scrollTop = container.scrollHeight;
    } else if (!pending && status) {
      status.remove();
    }
  },

  gatherAppContext() {
    const context = {
      currentView: window.App ? App.currentView : 'home',
      selectedHotspot: null,
      forecastData: window.ForecastModule ? ForecastModule.lastData || null : null,
      analysisData: window.ScannerModule ? ScannerModule.riskAssessment || null : null,
      whatIfData: window.WhatIfModule && WhatIfModule.scenarios.length
        ? WhatIfModule.scenarios[WhatIfModule.scenarios.length - 1]
        : null,
      analyzedImage: Boolean(window.ScannerModule && ScannerModule.currentImage),
    };

    // Get selected hotspot from map
    if (window.MapModule && MapModule.selectedHotspot) {
      const hs = MapModule.selectedHotspot;
      context.selectedHotspot = {
        name: hs.name,
        ward: hs.ward,
        riskScore: hs.riskScore,
        riskLevel: hs.riskLevel,
        wasteKg: hs.estimatedWasteKg,
        leakageProbability: hs.leakageProbability
      };
    }

    // Get current forecast data
    if (window.ForecastModule) {
      context.forecastHours = ForecastModule.currentHours;
    }

    return context;
  },

  appendMessage(sender, content, target = "map") {
    let container = this.chatContainer;
    if (target === "global") {
      container = document.getElementById("globalAssistantMessages");
    }
    if (!container) return;

    const msgDiv = document.createElement("div");
    if (sender === "user") {
      msgDiv.className = "chat-msg user";
      msgDiv.textContent = content;
    } else {
      msgDiv.className = "chat-msg bot";
      const contentDiv = document.createElement("div");
      contentDiv.className = "bot-msg-content";
      contentDiv.textContent = content;
      msgDiv.appendChild(contentDiv);
    }
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
  },

  appendListenButton(target, answer) {
    const container = target === "global" ? document.getElementById("globalAssistantMessages") : this.chatContainer;
    const lastMessage = container && container.lastElementChild;
    const content = lastMessage && lastMessage.querySelector(".bot-msg-content");
    if (!content) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn-voice-listen pill-btn";
    button.textContent = "🔊 Listen";
    button.addEventListener("click", () => this.speakAnswer(answer));
    content.appendChild(button);
  },

  speakAnswer(textToSpeak) {
    if (window.SoundEngine && !SoundEngine.soundEnabled) return;
    if (!("speechSynthesis" in window)) return;

    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(textToSpeak.substring(0, 1500));

      const scriptRanges = [
        { lang: "ta-IN", test: /[\u0B80-\u0BFF]/ },
        { lang: "te-IN", test: /[\u0C00-\u0C7F]/ },
        { lang: "kn-IN", test: /[\u0C80-\u0CFF]/ },
        { lang: "ml-IN", test: /[\u0D00-\u0D7F]/ },
        { lang: "hi-IN", test: /[\u0900-\u097F]/ }
      ];
      const detected = scriptRanges.find((entry) => entry.test.test(textToSpeak));
      const localeFallback = { en: "en-IN", ta: "ta-IN", te: "te-IN", kn: "kn-IN", ml: "ml-IN", hi: "hi-IN" };
      const selectedLanguage = window.I18N ? window.I18N.currentLang : "en";
      utter.lang = detected ? detected.lang : (localeFallback[selectedLanguage] || "en-IN");
      utter.rate = 1.0;
      utter.pitch = 1.0;
      utter.volume = 0.8;
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }
};

window.MapAssistant = MapAssistant;
