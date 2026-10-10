/**
 * PlastiSense AI - Analytics & Reporting Engine
 * Charts (Chart.js), Hotspot Rankings, Trend Analysis, CSV & PDF Export
 */

const AnalyticsModule = {
  trendChart: null,
  riskChart: null,
  wasteTypeChart: null,
  drainageVsCoastChart: null,
  activeTimeframe: "monthly",

  init() {
    this.renderCharts();
    this.renderHotspotRankingTable();
    this.bindEvents();
    window.addEventListener("plastisense:langchange", () => this.applyChartTranslations());
  },

  bindEvents() {
    // Timeframe selector pills
    document.querySelectorAll(".trend-timeframe-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".trend-timeframe-btn").forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.activeTimeframe = e.target.getAttribute("data-timeframe");
        this.updateTrendChart();
      });
    });

    // CSV Export button
    const btnCsv = document.getElementById("btnExportCsv");
    if (btnCsv) {
      btnCsv.addEventListener("click", () => this.exportCsv());
    }

    // PDF Print Export button
    const btnPdf = document.getElementById("btnExportPdf");
    if (btnPdf) {
      btnPdf.addEventListener("click", () => window.print());
    }
  },

  renderCharts() {
    if (typeof Chart === "undefined") return;

    // Chart.js dark theme styling defaults
    Chart.defaults.color = "#94a3b8";
    Chart.defaults.font.family = "Inter, sans-serif";
    Chart.defaults.borderColor = "rgba(255, 255, 255, 0.08)";

    this.renderTrendChart();
    this.renderRiskChart();
    this.renderWasteTypeChart();
    this.renderDrainageVsCoastChart();
    this.applyChartTranslations();
  },

  applyChartTranslations() {
    if (!window.I18N) return;
    const labelKeys = {
      May: "chart_may", Jun: "chart_june", Jul: "chart_july", Aug: "chart_august",
      Sep: "chart_september", Oct: "chart_october",
      Mon: "chart_monday", Tue: "chart_tuesday", Wed: "chart_wednesday",
      Thu: "chart_thursday", Fri: "chart_friday", Sat: "chart_saturday",
      Sun: "chart_sunday", Bottles: "chart_bottles", "Poly Bags": "chart_poly_bags",
      Packaging: "chart_packaging", Thermocol: "chart_thermocol", Nets: "chart_nets",
      "Cups/Straws": "chart_cups_straws", Microplastics: "chart_microplastics",
      "Critical Risk": "chart_critical_risk", "High Risk": "chart_high_risk",
      "Medium Risk": "chart_medium_risk", "Low Risk": "chart_low_risk",
      "Mumbai Ward Network": "chart_risk_distribution"
    };
    const datasetKeys = {
      "Plastic Influx (Tonnes)": "chart_plastic_influx",
      "Municipal Intercepted (Tonnes)": "chart_municipal_intercepted",
      "Estimated Volume (kg)": "chart_est_volume",
      "Drainage Conduit Load": "chart_drainage_load",
      "Tidal Coastal Wash": "chart_tidal_wash"
    };
    const charts = [this.trendChart, this.riskChart, this.wasteTypeChart, this.drainageVsCoastChart];
    charts.forEach((chart) => {
      if (!chart) return;
      chart.__i18nOriginalLabels ||= [...chart.data.labels];
      chart.data.labels = chart.__i18nOriginalLabels.map((label) => {
        const value = String(label);
        if (labelKeys[value]) return window.I18N.t(labelKeys[value]);
        const week = value.match(/^Week (\d+)$/);
        if (week) return `${window.I18N.t("chart_week")} ${week[1]}`;
        return value;
      });
      chart.data.datasets.forEach((dataset) => {
        dataset.__i18nOriginalLabel ||= dataset.label;
        const key = datasetKeys[dataset.__i18nOriginalLabel];
        if (key) dataset.label = window.I18N.t(key);
      });
      chart.update("none");
    });
  },

  renderTrendChart() {
    const ctx = document.getElementById("analyticsTrendChart");
    if (!ctx) return;

    this.trendChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct"],
        datasets: [
          {
            label: "Plastic Influx (Tonnes)",
            data: [32, 68, 142, 185, 110, 74],
            borderColor: "#00f2fe",
            backgroundColor: "rgba(0, 242, 254, 0.12)",
            fill: true,
            tension: 0.35,
            borderWidth: 3
          },
          {
            label: "Municipal Intercepted (Tonnes)",
            data: [24, 45, 98, 134, 88, 59],
            borderColor: "#10b981",
            backgroundColor: "transparent",
            borderDash: [5, 5],
            tension: 0.35,
            borderWidth: 2.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "top", labels: { color: "#f8fafc" } }
        },
        scales: {
          y: { grid: { color: "rgba(255, 255, 255, 0.05)" } },
          x: { grid: { display: false } }
        }
      }
    });
  },

  updateTrendChart() {
    if (!this.trendChart) return;
    if (this.activeTimeframe === "daily") {
      this.trendChart.data.labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      this.trendChart.data.datasets[0].data = [2.4, 3.1, 4.8, 5.2, 3.9, 6.4, 4.7];
      this.trendChart.data.datasets[1].data = [1.8, 2.4, 3.9, 4.1, 3.0, 5.2, 3.8];
    } else if (this.activeTimeframe === "weekly") {
      this.trendChart.data.labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
      this.trendChart.data.datasets[0].data = [18.4, 24.1, 31.6, 19.8];
      this.trendChart.data.datasets[1].data = [14.2, 19.0, 24.5, 16.1];
    } else {
      this.trendChart.data.labels = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
      this.trendChart.data.datasets[0].data = [32, 68, 142, 185, 110, 74];
      this.trendChart.data.datasets[1].data = [24, 45, 98, 134, 88, 59];
    }
    this.trendChart.__i18nOriginalLabels = [...this.trendChart.data.labels];
    this.applyChartTranslations();
  },

  renderRiskChart() {
    const ctx = document.getElementById("analyticsRiskChart");
    if (!ctx) return;

    this.riskChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Critical Risk", "High Risk", "Medium Risk", "Low Risk"],
        datasets: [
          {
            data: [3, 5, 3, 1],
            backgroundColor: ["#ef4444", "#f97316", "#f59e0b", "#10b981"],
            borderWidth: 2,
            borderColor: "#071527"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: "right", labels: { color: "#f8fafc" } }
        },
        cutout: "68%"
      }
    });
  },

  renderWasteTypeChart() {
    const ctx = document.getElementById("analyticsWasteTypeChart");
    if (!ctx) return;

    this.wasteTypeChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Bottles", "Poly Bags", "Packaging", "Thermocol", "Nets", "Cups/Straws", "Microplastics"],
        datasets: [
          {
            label: "Estimated Volume (kg)",
            data: [5420, 6840, 3950, 2180, 1420, 1260, 980],
            backgroundColor: [
              "#00f2fe",
              "#ef4444",
              "#f59e0b",
              "#ec4899",
              "#a855f7",
              "#38bdf8",
              "#10b981"
            ],
            borderRadius: 6
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: "rgba(255, 255, 255, 0.05)" } },
          x: { grid: { display: false } }
        }
      }
    });
  },

  renderDrainageVsCoastChart() {
    const ctx = document.getElementById("analyticsDrainageChart");
    if (!ctx) return;

    this.drainageVsCoastChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Mithi River", "Mahim Bay", "Versova Beach", "Dharavi Nullah", "Juhu Beach", "Sassoon Docks"],
        datasets: [
          {
            label: "Drainage Conduit Load",
            data: [3400, 1800, 900, 3200, 1100, 450],
            backgroundColor: "#38bdf8",
            borderRadius: 5
          },
          {
            label: "Tidal Coastal Wash",
            data: [800, 1050, 1080, 400, 540, 970],
            backgroundColor: "#10b981",
            borderRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "top", labels: { color: "#f8fafc" } } },
        scales: {
          y: { stacked: true, grid: { color: "rgba(255, 255, 255, 0.05)" } },
          x: { stacked: true, grid: { display: false } }
        }
      }
    });
  },

  renderHotspotRankingTable() {
    const tbody = document.getElementById("hotspotRankingTableBody");
    if (!tbody) return;

    tbody.innerHTML = PLASTISENSE_DATA.hotspots
      .map((h) => {
        return `
          <tr>
            <td><strong style="color:var(--teal-glow);">#${h.priorityRank}</strong></td>
            <td><strong>${h.name}</strong></td>
            <td>${h.ward}</td>
            <td><span class="risk-tag ${h.riskLevel.toLowerCase()}">${h.riskLevel} (${h.riskScore})</span></td>
            <td>${h.estimatedWasteKg.toLocaleString()} kg</td>
            <td><strong style="color:#f87171;">${h.leakageProbability}</strong></td>
            <td><span class="pill-btn">${h.status}</span></td>
            <td>
              <button onclick="MapModule.selectHotspot('${h.id}'); App.navigate('map');" class="pill-btn" style="border-color:var(--teal-glow);color:var(--teal-glow);">
                Locate →
              </button>
            </td>
          </tr>
        `;
      })
      .join("");
  },

  exportCsv() {
    const headers = ["PriorityRank", "LocationName", "Ward", "RiskScore", "RiskLevel", "EstimatedWasteKg", "LeakageProb", "Status", "AssignedTeam"];
    const rows = PLASTISENSE_DATA.hotspots.map((h) => [
      h.priorityRank,
      `"${h.name}"`,
      `"${h.ward}"`,
      h.riskScore,
      h.riskLevel,
      h.estimatedWasteKg,
      `"${h.leakageProbability}"`,
      `"${h.status}"`,
      `"${h.assignedTeam}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `plastisense_mumbai_hotspots_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
};

window.AnalyticsModule = AnalyticsModule;
