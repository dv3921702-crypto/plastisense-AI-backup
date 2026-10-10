/**
 * PlastiSense AI - Plastic Leakage Forecast Module
 * Displays only forecast data with explicit source provenance.
 */

const ForecastModule = {
  currentHours: 24,
  lastData: null,
  supportedHours: [24, 48, 72],
  sourceTypes: ["Live Data", "Historical Data", "Demo Data", "Modelled Estimates"],

  init() {
    this.bindEvents();
    window.addEventListener("plastisense:langchange", () => {
      const container = document.getElementById("forecastResults");
      if (!container) return;
      if (this.lastData) {
        this.renderForecast(this.lastData, container);
      } else if (container.querySelector(".loading-spinner")) {
        container.innerHTML = `<div style="text-align:center;padding:2rem;color:var(--text-muted);">
          <div class="loading-spinner"></div>
          <p style="margin-top:0.75rem;"><span data-i18n="ui_forecast_checking">Checking verified data for the</span> ${this.currentHours}-hour <span data-i18n="ui_forecast_unit">forecast...</span></p>
        </div>`;
      }
    });
    this.loadForecast(24);
  },

  bindEvents() {
    document.querySelectorAll(".forecast-horizon-btn").forEach(btn => {
      btn.addEventListener("click", (event) => {
        const hours = Number(event.currentTarget.dataset.hours);
        if (!this.supportedHours.includes(hours)) return;

        document.querySelectorAll(".forecast-horizon-btn").forEach(button => button.classList.remove("active"));
        event.currentTarget.classList.add("active");
        this.loadForecast(hours);
      });
    });
  },

  async loadForecast(hours) {
    const container = document.getElementById("forecastResults");
    if (!container) return;
    if (!this.supportedHours.includes(hours)) {
      this.lastData = null;
      container.innerHTML = `<div class="forecast-disclaimer" role="alert">
        <span data-i18n="ui_forecast_invalid">Unsupported forecast period. Choose 24, 48, or 72 hours.</span>
      </div>`;
      return;
    }

    this.currentHours = hours;
    container.innerHTML = `
      <div style="text-align:center;padding:2rem;color:var(--text-muted);">
        <div class="loading-spinner"></div>
        <p style="margin-top:0.75rem;"><span data-i18n="ui_forecast_checking">Checking verified data for the</span> ${hours}-hour <span data-i18n="ui_forecast_unit">forecast...</span></p>
      </div>
    `;

    try {
      const response = await fetch(`/api/forecast?hours=${hours}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || this.t("ui_forecast_service_unavailable"));
      this.lastData = data;
      this.renderForecast(data, container);
    } catch (error) {
      this.lastData = null;
      container.innerHTML = `<div class="forecast-disclaimer" role="alert">
        <span data-i18n="ui_forecast_failed">Unable to load forecast:</span>
        <span>${this.escapeHtml(error.message)}</span>
      </div>`;
    }
  },

  renderForecast(data, container) {
    const provenance = (Array.isArray(data.dataSources) ? data.dataSources : []).map(source => `
      <span class="demo-data-badge">${this.escapeHtml(source.type)}: ${this.escapeHtml(source.status)}</span>
    `).join(" ");
    const disclaimer = `<div class="forecast-disclaimer" role="status">
      <strong>${this.escapeHtml(data.disclaimer || this.t("ui_forecast_source_unavailable"))}</strong>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.5rem;">${provenance}</div>
      ${data.checkedAt ? `<div style="margin-top:.5rem;font-size:0.72rem;color:var(--text-faint);"><span data-i18n="ui_forecast_checked">Checked:</span> ${this.escapeHtml(data.checkedAt)}</div>` : ""}
    </div>`;
    const wards = Array.isArray(data.wards) ? data.wards : [];
    if (!wards.length) {
      container.innerHTML = disclaimer + `<div class="forecast-disclaimer" role="status" style="margin-top:1rem;">
        <span data-i18n="ui_forecast_no_wards">No wards have verified inputs available for this forecast period. Demo measurements are not substituted.</span>
      </div>`;
      return;
    }

    const cards = wards.map(ward => this.renderWard(ward)).join("");
    container.innerHTML = disclaimer + `<div class="forecast-grid">${cards}</div>`;
  },

  renderWard(ward) {
    const sources = ward.sources || {};
    const metric = (label, value, unit, source, formatter) => {
      const sourceType = this.sourceTypes.includes(source?.type) ? source.type : null;
      const usable = sourceType && value !== null && value !== undefined && value !== "";
      const displayValue = usable ? formatter(value, unit) : this.t("ui_unavailable");
      const sourceLabel = sourceType ? this.sourceLabel(sourceType) : this.t("ui_source_unavailable");
      return `<div class="forecast-metric">
        <span class="forecast-metric-label">${label}</span>
        <span class="forecast-metric-value">${this.escapeHtml(displayValue)}</span>
        <span class="demo-data-badge">${this.escapeHtml(sourceLabel)}</span>
      </div>`;
    };
    const locale = window.I18N ? window.I18N.currentLang : "en";
    const number = (value, unit) => Number.isFinite(Number(value)) ? `${Number(value).toLocaleString(locale)} ${unit}` : this.t("ui_unavailable");
    const decimal = (value, unit) => Number.isFinite(Number(value)) ? `${Number(value).toLocaleString(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${unit}` : this.t("ui_unavailable");
    const riskValue = String(ward.riskLevel || "").toUpperCase();
    const riskClass = ["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(riskValue) ? riskValue.toLowerCase() : "low";
    const probability = Number(ward.leakageProbability);
    const probabilitySource = sources.leakageProbability;
    const probabilityAvailable = this.sourceTypes.includes(probabilitySource?.type)
      && Number.isFinite(probability) && probability >= 0 && probability <= 100;
    const windowSource = sources.timeWindow;
    const riskSource = sources.riskLevel;
    const predictedSource = sources.predictedLeakage;

    return `
      <div class="glass-card forecast-ward-card">
        <div class="forecast-ward-header">
          <h4>${this.escapeHtml(ward.ward || this.t("ui_ward_unavailable"))}</h4>
          ${this.sourceTypes.includes(riskSource?.type) && ["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(riskValue)
            ? `<span class="risk-tag ${riskClass}">${this.escapeHtml(this.t(`risk_${riskValue.toLowerCase()}`))}</span>`
            : ""}
        </div>
        <div class="forecast-metrics-grid">
          ${metric(this.t("ui_forecast_rainfall"), ward.rainfall_mm, "mm", sources.rainfall, number)}
          ${metric(this.t("ui_forecast_tide"), ward.tide_m, "m", sources.tide, decimal)}
          ${metric(this.t("ui_forecast_current_load"), ward.currentPlasticKg, "kg", sources.currentPlasticLoad, number)}
          ${metric(this.t("ui_forecast_predicted"), ward.predictedLeakageKg, "kg", predictedSource, number)}
          ${metric(this.t("ui_risk_level"), riskValue ? this.t(`risk_${riskValue.toLowerCase()}`) : "", "", riskSource, value => value)}
          ${metric(this.t("ui_forecast_time"), ward.timeWindow, "", windowSource, value => String(value))}
        </div>
        <div class="forecast-probability-bar">
          <div class="forecast-probability-label">
            <span data-i18n="header_leakage_prob">Leakage Probability</span>
            <strong>${probabilityAvailable ? `${probability}%` : this.t("ui_unavailable")}</strong>
            <span class="demo-data-badge">${this.escapeHtml(probabilitySource?.type ? this.sourceLabel(probabilitySource.type) : this.t("ui_source_unavailable"))}</span>
          </div>
          <div class="forecast-bar-track">
            <div class="forecast-bar-fill risk-bg-${riskClass}" style="width:${probabilityAvailable ? probability : 0}%;"></div>
          </div>
        </div>
      </div>
    `;
  },

  escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  },

  t(key) {
    return window.I18N ? window.I18N.t(key) : key;
  },

  sourceLabel(type) {
    const keys = {
      "Live Data": "ui_source_live",
      "Historical Data": "ui_source_historical",
      "Demo Data": "ui_source_demo",
      "Modelled Estimates": "ui_source_modelled"
    };
    return this.t(keys[type] || "ui_source_unavailable");
  }
};

window.ForecastModule = ForecastModule;
