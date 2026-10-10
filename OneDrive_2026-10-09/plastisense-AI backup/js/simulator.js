/**
 * PlastiSense AI - Drain-to-Sea Leakage Simulator
 * Multi-variable Hydrodynamic Particle Physics Simulation (Street -> Drain -> Creek -> Sea)
 */

const DrainSimulator = {
  canvas: null,
  ctx: null,
  particles: [],
  animId: null,
  rainfall: 25, // mm/hr
  blockage: 40, // %
  tideLevel: 3.5, // meters
  barrierEnabled: false,

  init() {
    this.canvas = document.getElementById("drainSimulatorCanvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");

    this.resizeCanvas();
    window.addEventListener("resize", () => this.resizeCanvas());

    this.bindControls();
    this.spawnInitialParticles();
    this.startSimulation();
  },

  resizeCanvas() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    this.canvas.width = parent.clientWidth || 700;
    this.canvas.height = parent.clientHeight || 460;
  },

  bindControls() {
    const slRain = document.getElementById("simRainfallSlider");
    const slBlock = document.getElementById("simBlockageSlider");
    const slTide = document.getElementById("simTideSlider");
    const chkBarrier = document.getElementById("simBarrierToggle");

    if (slRain) {
      slRain.addEventListener("input", (e) => {
        this.rainfall = parseFloat(e.target.value);
        document.getElementById("valRainfall").textContent = `${this.rainfall} mm/hr`;
        this.updateSimulationMetrics();
      });
    }

    if (slBlock) {
      slBlock.addEventListener("input", (e) => {
        this.blockage = parseFloat(e.target.value);
        document.getElementById("valBlockage").textContent = `${this.blockage}%`;
        this.updateSimulationMetrics();
      });
    }

    if (slTide) {
      slTide.addEventListener("input", (e) => {
        this.tideLevel = parseFloat(e.target.value);
        document.getElementById("valTide").textContent = `${this.tideLevel} m`;
        this.updateSimulationMetrics();
      });
    }

    if (chkBarrier) {
      chkBarrier.addEventListener("change", (e) => {
        this.barrierEnabled = e.target.checked;
        this.updateSimulationMetrics();
      });
    }

    this.updateSimulationMetrics();
  },

  spawnInitialParticles() {
    this.particles = [];
    const count = 65;
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(Math.random() * (this.canvas.width * 0.4)));
    }
  },

  createParticle(startX = 0) {
    const types = [
      { name: "Bottle", color: "#00f2fe", size: 5, shape: "rect" },
      { name: "Polybag", color: "#ef4444", size: 6, shape: "circle" },
      { name: "Thermocol", color: "#f8fafc", size: 7, shape: "square" },
      { name: "Wrapper", color: "#f59e0b", size: 4, shape: "circle" }
    ];
    const t = types[Math.floor(Math.random() * types.length)];
    const h = this.canvas.height;

    return {
      x: startX,
      y: h * 0.45 + (Math.random() - 0.5) * (h * 0.2),
      vx: 1 + Math.random() * 2,
      vy: (Math.random() - 0.5) * 0.5,
      type: t,
      intercepted: false
    };
  },

  updateSimulationMetrics() {
    // Hydrodynamic risk formula
    const velocity = (this.rainfall / 15) * (1 - this.blockage / 120);
    let leakageKgPerHr = Math.round(this.rainfall * 8.5 + (this.tideLevel > 3.8 ? 120 : 40));

    if (this.barrierEnabled) {
      leakageKgPerHr = Math.round(leakageKgPerHr * 0.22); // 78% intercepted
    }

    let riskLevel = "MEDIUM";
    if (leakageKgPerHr > 280) riskLevel = "CRITICAL";
    else if (leakageKgPerHr > 160) riskLevel = "HIGH";
    else if (leakageKgPerHr < 80) riskLevel = "LOW";

    const elRate = document.getElementById("simLeakageRate");
    const elRisk = document.getElementById("simRiskOutput");
    const elBarrierStat = document.getElementById("simBarrierEfficiency");

    if (elRate) elRate.textContent = `${leakageKgPerHr} kg/hr`;
    if (elRisk) {
      elRisk.textContent = riskLevel;
      elRisk.className = `risk-tag ${riskLevel.toLowerCase()}`;
    }
    if (elBarrierStat) {
      elBarrierStat.textContent = this.barrierEnabled ? "78% Intercepted (Active)" : "0% (Disengaged)";
      elBarrierStat.style.color = this.barrierEnabled ? "var(--emerald-glow)" : "var(--risk-critical)";
    }
  },

  startSimulation() {
    const render = () => {
      this.draw();
      this.animId = requestAnimationFrame(render);
    };
    render();
  },

  draw() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw Zones Background:
    // Street (Left 25%) -> Drain / Nullah (25% - 55%) -> Creek Delta (55% - 75%) -> Arabian Sea (75% - 100%)
    
    // Street Zone
    ctx.fillStyle = "#091728";
    ctx.fillRect(0, 0, w * 0.25, h);
    ctx.fillStyle = "#64748b";
    ctx.font = "bold 11px Inter, sans-serif";
    ctx.fillText("URBAN STREET / ROAD", 15, 24);

    // Drain / Nullah Channel
    const drainGrad = ctx.createLinearGradient(w * 0.25, 0, w * 0.55, 0);
    drainGrad.addColorStop(0, "#081b33");
    drainGrad.addColorStop(1, "#072b4d");
    ctx.fillStyle = drainGrad;
    ctx.fillRect(w * 0.25, 0, w * 0.3, h);
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("STORMWATER DRAIN (NULLAH)", w * 0.25 + 15, 24);

    // Creek Basin
    const creekGrad = ctx.createLinearGradient(w * 0.55, 0, w * 0.75, 0);
    creekGrad.addColorStop(0, "#062a50");
    creekGrad.addColorStop(1, "#04396c");
    ctx.fillStyle = creekGrad;
    ctx.fillRect(w * 0.55, 0, w * 0.2, h);
    ctx.fillStyle = "#00f2fe";
    ctx.fillText("MAHIM CREEK ESTUARY", w * 0.55 + 15, 24);

    // Arabian Sea
    const seaGrad = ctx.createLinearGradient(w * 0.75, 0, w, 0);
    seaGrad.addColorStop(0, "#033766");
    seaGrad.addColorStop(1, "#021c38");
    ctx.fillStyle = seaGrad;
    ctx.fillRect(w * 0.75, 0, w * 0.25, h);
    ctx.fillStyle = "#34d399";
    ctx.fillText("ARABIAN SEA (COAST)", w * 0.75 + 15, 24);

    // Water flow channel bands
    const channelTop = h * 0.28;
    const channelBottom = h * 0.72;
    ctx.fillStyle = "rgba(0, 242, 254, 0.05)";
    ctx.fillRect(0, channelTop, w, channelBottom - channelTop);

    // Draw Flow Streamlines
    const flowSpeed = (this.rainfall / 15) * (1 - this.blockage / 150);
    const time = Date.now() * 0.002 * flowSpeed;

    ctx.strokeStyle = "rgba(0, 242, 254, 0.22)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([12, 16]);
    ctx.lineDashOffset = -time * 25;

    for (let y = channelTop + 25; y < channelBottom; y += 35) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(w * 0.3, y - 10, w * 0.6, y + 10, w, y);
      ctx.stroke();
    }
    ctx.setLineDash([]); // Reset dash

    // Draw Interception Net Barrier if enabled (At Creek boundary w * 0.65)
    const barrierX = w * 0.65;
    if (this.barrierEnabled) {
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(barrierX, channelTop);
      ctx.lineTo(barrierX, channelBottom);
      ctx.stroke();

      ctx.fillStyle = "#10b981";
      ctx.font = "bold 11px Inter, sans-serif";
      ctx.fillText("🛡️ TRASH BOOM BARRIER (78% CAPTURE)", barrierX - 90, channelTop - 8);
    }

    // High Tide Backflow Wave Indicator (if tide > 3.8m)
    if (this.tideLevel > 3.8) {
      ctx.fillStyle = "rgba(239, 68, 68, 0.15)";
      ctx.fillRect(w * 0.75, channelTop, w * 0.25, channelBottom - channelTop);
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 10px Inter, sans-serif";
      ctx.fillText("⚠️ HIGH TIDE RESISTANCE WAVE", w * 0.76, channelBottom + 18);
    }

    // Update and Draw Particles
    const speedMultiplier = Math.max(0.4, (this.rainfall / 20) * (1 - this.blockage / 130));

    this.particles.forEach((p, idx) => {
      // Check barrier interception
      if (this.barrierEnabled && !p.intercepted && p.x >= barrierX - 10 && p.x <= barrierX + 10) {
        if (Math.random() < 0.78) {
          p.intercepted = true;
          p.vx = 0;
          p.vy = (Math.random() - 0.5) * 0.2;
        }
      }

      if (!p.intercepted) {
        p.x += p.vx * speedMultiplier;
        p.y += p.vy;

        // Keep within channel
        if (p.y < channelTop + 10) p.y = channelTop + 10;
        if (p.y > channelBottom - 10) p.y = channelBottom - 10;

        // Reset if reached open ocean
        if (p.x > w + 20) {
          this.particles[idx] = this.createParticle(0);
        }
      } else {
        // Intercepted particles bob gently near barrier
        p.y += Math.sin(Date.now() * 0.005 + p.x) * 0.3;
      }

      // Draw particle
      ctx.fillStyle = p.type.color;
      ctx.shadowColor = p.type.color;
      ctx.shadowBlur = 6;

      if (p.type.shape === "circle") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.type.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(p.x - p.type.size / 2, p.y - p.type.size / 2, p.type.size * 1.5, p.type.size);
      }

      ctx.shadowBlur = 0; // reset
    });
  }
};

window.DrainSimulator = DrainSimulator;
