/**
 * PlastiSense AI - What-If Plastic Intervention Simulator
 * Compares estimated scenarios from user-provided baseline and efficiency assumptions.
 */

const WhatIfModule = {
  scenarios: [],
  scenarioCounter: 0,
  interventions: [
    "Drain Barrier",
    "Trash Boom",
    "Drain Cleaning",
    "Additional Collection Point",
    "Cleanup Team",
    "Increased Collection Frequency",
    "Combined Intervention"
  ],

  init() {
    this.bindEvents();
  },

  bindEvents() {
    const runBtn = document.getElementById("btnRunWhatIf");
    if (runBtn) runBtn.addEventListener("click", () => this.runSimulation());

    const addScenarioBtn = document.getElementById("btnAddScenario");
    if (addScenarioBtn) addScenarioBtn.addEventListener("click", () => this.runSimulation(true));

    const clearBtn = document.getElementById("btnClearScenarios");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        this.scenarios = [];
        this.scenarioCounter = 0;
        this.renderScenarios();
      });
    }

  },

  readInputs() {
    const location = document.getElementById("whatifLocation")?.value.trim() || "";
    const intervention = document.getElementById("whatifIntervention")?.value || "";
    const costText = document.getElementById("whatifCost")?.value ?? "";
    const efficiencyText = document.getElementById("whatifEfficiency")?.value ?? "";
    const baselineText = document.getElementById("whatifBaseline")?.value ?? "";
    const values = {
      cost: Number(costText),
      efficiency: Number(efficiencyText),
      baselineLeakage: Number(baselineText)
    };

    if (!location || location.length > 120) throw new Error("Enter a location or ward name (up to 120 characters).");
    if (!this.interventions.includes(intervention)) throw new Error("Select a supported intervention type.");
    if (costText.trim() === "" || !Number.isFinite(values.cost) || values.cost < 0) {
      throw new Error("Estimated cost must be a finite number greater than or equal to zero.");
    }
    if (efficiencyText.trim() === "" || !Number.isFinite(values.efficiency) || values.efficiency < 0 || values.efficiency > 100) {
      throw new Error("Estimated efficiency must be a finite percentage from 0 to 100.");
    }
    if (baselineText.trim() === "" || !Number.isFinite(values.baselineLeakage) || values.baselineLeakage < 0) {
      throw new Error("Estimated baseline leakage must be a finite number greater than or equal to zero.");
    }
    return { location, intervention, ...values };
  },

  async runSimulation(addToComparison = false) {
    const resultContainer = document.getElementById("whatifResults");
    if (!resultContainer) return;

    let inputs;
    try {
      inputs = this.readInputs();
    } catch (error) {
      this.showError(error.message);
      return;
    }

    if (!addToComparison) {
      resultContainer.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-muted);">
        <div class="loading-spinner"></div>
        <p style="margin-top:0.75rem;">Calculating estimated scenario...</p>
      </div>`;
    }

    try {
      const response = await fetch("/api/whatif", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Simulation failed. Please try again.");

      this.scenarioCounter++;
      const scenario = { id: this.scenarioCounter, ...data };
      if (addToComparison) this.scenarios.push(scenario);
      else this.scenarios = [scenario];
      this.renderScenarios();

      if (window.HistoryModule) {
        const reduction = data.reductionPercent === null ? "unavailable" : `${data.reductionPercent}%`;
        HistoryModule.addItem("SIMULATION", "What-If Simulation", `Estimated ${inputs.intervention} at ${inputs.location}: ${reduction} leakage reduction`);
      }
    } catch (error) {
      this.showError(error.message || "Simulation failed. Please try again.");
    }
  },

  showError(message) {
    const container = document.getElementById("whatifResults");
    if (!container) return;
    if (this.scenarios.length) this.renderScenarios();
    else container.innerHTML = "";
    const alert = `<div class="forecast-disclaimer" role="alert" style="margin:0.75rem 0;color:var(--risk-critical);">
      ${this.escapeHtml(message)}
    </div>`;
    container.insertAdjacentHTML("afterbegin", alert);
  },

  formatKg(value) {
    return Number.isFinite(value) ? `${value.toLocaleString()} kg` : "Unavailable";
  },

  formatCurrency(value) {
    return Number.isFinite(value) ? `₹${value.toLocaleString()}` : "Unavailable";
  },

  renderScenarios() {
    const container = document.getElementById("whatifResults");
    if (!container) return;

    if (this.scenarios.length === 0) {
      container.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--text-muted);">
        <div style="font-size:2.5rem;margin-bottom:0.5rem;">🔧</div>
        <p>Configure an intervention and click "Run Scenario" to see estimated results.</p>
      </div>`;
      return;
    }

    container.innerHTML = this.scenarios.map(scenario => `
      <div class="glass-card whatif-scenario-card">
        <div class="whatif-scenario-header">
          <div>
            <h4>Scenario #${scenario.id}: ${this.escapeHtml(scenario.intervention)}</h4>
            <span style="font-size:0.78rem;color:var(--text-muted);">📍 ${this.escapeHtml(scenario.location)}</span>
          </div>
          <span class="demo-data-badge">Estimated — simulated, not measured</span>
        </div>

        <div class="whatif-comparison">
          <div class="whatif-side whatif-without">
            <div class="whatif-side-label">WITHOUT INTERVENTION</div>
            <div class="whatif-side-value">${this.formatKg(scenario.without?.leakageKg)}</div>
          </div>
          <div class="whatif-vs">VS</div>
          <div class="whatif-side whatif-with">
            <div class="whatif-side-label">WITH INTERVENTION</div>
            <div class="whatif-side-value">${this.formatKg(scenario.with?.leakageKg)}</div>
          </div>
        </div>

        <div class="whatif-metrics-grid">
          <div class="whatif-metric">
            <span class="whatif-metric-label">Estimated Plastic Prevented</span>
            <span class="whatif-metric-value">${this.formatKg(scenario.plasticPreventedKg)}</span>
          </div>
          <div class="whatif-metric">
            <span class="whatif-metric-label">Estimated Leakage Reduction</span>
            <span class="whatif-metric-value">${Number.isFinite(scenario.reductionPercent) ? `${scenario.reductionPercent}%` : "Unavailable (zero baseline)"}</span>
          </div>
          <div class="whatif-metric">
            <span class="whatif-metric-label">Estimated Cost</span>
            <span class="whatif-metric-value">${this.formatCurrency(scenario.estimatedCost)}</span>
          </div>
          <div class="whatif-metric">
            <span class="whatif-metric-label">Estimated Benefit</span>
            <span class="whatif-metric-value">${this.formatCurrency(scenario.estimatedBenefit)}</span>
          </div>
          <div class="whatif-metric">
            <span class="whatif-metric-label">Estimated Cost per Kilogram Prevented</span>
            <span class="whatif-metric-value">${this.formatCurrency(scenario.costPerKgPrevented)}</span>
          </div>
          <div class="whatif-metric">
            <span class="whatif-metric-label">Benefit/Cost Ratio</span>
            <span class="whatif-metric-value">${Number.isFinite(scenario.benefitCostRatio) ? `${scenario.benefitCostRatio}x` : "Unavailable (no verified benefit valuation)"}</span>
          </div>
        </div>

        <div class="forecast-disclaimer" style="margin-top:0.75rem;">
          <strong>Scenario assumptions</strong>
          <ul>${(scenario.assumptions || []).map(assumption => `<li>${this.escapeHtml(assumption)}</li>`).join("")}</ul>
          <p>${this.escapeHtml(scenario.disclaimer || "Estimated scenario only; outcomes are not measured environmental results.")}</p>
        </div>
      </div>
    `).join("");
  },

  escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }
};

window.WhatIfModule = WhatIfModule;
