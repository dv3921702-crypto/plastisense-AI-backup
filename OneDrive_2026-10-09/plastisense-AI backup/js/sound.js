/**
 * PlastiSense AI - Sound & Audio Effects Engine
 * Subtle click sounds synthesized via Web Audio API (Zero external latency / dependencies)
 * Global Sound ON/OFF with persistence
 */

const SoundEngine = {
  audioCtx: null,
  soundEnabled: true,

  init() {
    const saved = localStorage.getItem("plastisense_sound_enabled");
    if (saved !== null) {
      this.soundEnabled = saved === "true";
    }

    this.updateSoundUI();
    this.bindGlobalClickSound();
  },

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  },

  playClick() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      // Crisp subtle pop / tactile feedback frequency
      osc.frequency.setValueAtTime(620, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(340, ctx.currentTime + 0.045);

      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.048);
    } catch (e) {
      // AudioContext muted or blocked
    }
  },

  playSuccess() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.13);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.14);
    } catch (e) {}
  },

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem("plastisense_sound_enabled", this.soundEnabled.toString());
    if (!this.soundEnabled && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.updateSoundUI();
    return this.soundEnabled;
  },

  updateSoundUI() {
    const soundBtns = document.querySelectorAll(".btn-sound-toggle");
    soundBtns.forEach((btn) => {
      if (this.soundEnabled) {
        btn.innerHTML = `<span class="sound-icon">🔊</span> <span class="sound-label" data-i18n="sound_on">Sound ON</span>`;
        btn.setAttribute("title", "Sound Effects Active (Click to mute)");
        btn.classList.add("active");
      } else {
        btn.innerHTML = `<span class="sound-icon">🔇</span> <span class="sound-label" data-i18n="sound_off">Sound OFF</span>`;
        btn.setAttribute("title", "Sound Effects Muted (Click to enable)");
        btn.classList.remove("active");
      }
    });
  },

  bindGlobalClickSound() {
    document.addEventListener("click", (e) => {
      // Trigger click sound on interactive elements
      const target = e.target instanceof Element
        ? e.target.closest("button, a, [role='button'], [data-click-sound], [data-nav], .brand-container, .user-role-card, .mobile-nav-item, select, input[type='checkbox'], input[type='radio'], [role='switch'], .hotspot-list-item, .nav-item")
        : null;
      if (target) {
        this.playClick();
      }
    });
  }
};

window.SoundEngine = SoundEngine;
