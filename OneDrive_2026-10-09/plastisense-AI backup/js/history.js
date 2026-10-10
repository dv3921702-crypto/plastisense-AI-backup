/**
 * PlastiSense AI - Activity & Analysis History Engine
 * Persistent history tracking with exact Date & Time, filtering, and export
 */

const HistoryModule = {
  historyItems: [],
  activeFilter: "ALL",

  init() {
    this.loadHistory();
    this.renderHistory();
    this.bindEvents();
  },

  loadHistory() {
    const stored = localStorage.getItem("plastisense_history");
    if (stored) {
      try {
        this.historyItems = JSON.parse(stored);
      } catch (e) {
        this.historyItems = [];
      }
    }

    // Seed default baseline history if empty so user immediately sees organized past activities
    if (!this.historyItems || this.historyItems.length === 0) {
      this.historyItems = [
        {
          id: "hist-001",
          type: "ANALYSIS",
          title: "Beach Plastic Waste Scanner",
          details: "Detected 140 microplastics, 34 bottles, 51 polybags. Risk Score: 82/100 (HIGH). Location: Versova Beach Tidal Line.",
          timestamp: "2026-10-07 18:42:10",
          meta: { risk: "HIGH", score: 82, count: 270 }
        },
        {
          id: "hist-002",
          type: "CHAT",
          title: "AI Assistant Query",
          details: "Question: 'Show me high-risk plastic areas in Mumbai' → Identified Mithi River (94/100) and Dharavi Nullah (92/100).",
          timestamp: "2026-10-07 17:15:33",
          meta: { language: "en" }
        },
        {
          id: "hist-003",
          type: "HOTSPOT",
          title: "Hotspot Map Inspection",
          details: "Investigated Mithi River Outfall & Mahim Causeway (Priority #1). Generated optimal cleanup route.",
          timestamp: "2026-10-07 15:30:45",
          meta: { hotspot: "mum-001" }
        },
        {
          id: "hist-004",
          type: "MUNICIPAL",
          title: "Task Dispatch Authorization",
          details: "Dispatched Rapid Marine Taskforce to Mithi River Outfall with trash skimmer boats (TASK-2026-081).",
          timestamp: "2026-10-07 14:02:19",
          meta: { task: "TASK-2026-081" }
        },
        {
          id: "hist-005",
          type: "SIMULATION",
          title: "Drain-to-Sea Leakage Simulation",
          details: "Simulated 25 mm/hr rainfall + 40% drain blockage + 3.5m high tide. Tested Net Boom Barrier (78% interception).",
          timestamp: "2026-10-07 11:20:04",
          meta: { leakageRate: "252 kg/hr" }
        }
      ];
      this.saveHistory();
    }
  },

  saveHistory() {
    try {
      localStorage.setItem("plastisense_history", JSON.stringify(this.historyItems));
    } catch (e) {
      console.warn("Storage quota exceeded", e);
    }
  },

  addItem(type, title, details, meta = {}) {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const formattedTimestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const newItem = {
      id: `hist-${Date.now()}`,
      type: type.toUpperCase(), // 'ANALYSIS', 'CHAT', 'HOTSPOT', 'MUNICIPAL', 'SIMULATION'
      title: title,
      details: details,
      timestamp: formattedTimestamp,
      meta: meta
    };

    this.historyItems.unshift(newItem);
    this.saveHistory();
    this.renderHistory();

    // Trigger sound if active
    if (window.SoundEngine) SoundEngine.playSuccess();
    return newItem;
  },

  renderHistory() {
    const container = document.getElementById("historyListContainer");
    if (!container) return;

    const filtered = this.historyItems.filter((item) => {
      if (this.activeFilter === "ALL") return true;
      return item.type === this.activeFilter;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:3rem 1rem;color:var(--text-muted);">
          <div style="font-size:2.5rem;margin-bottom:0.5rem;">📂</div>
          <p>No activity records found for this category.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered
      .map((item) => {
        let icon = "📝";
        let badgeColor = "var(--teal-glow)";
        let badgeBg = "rgba(0, 242, 254, 0.12)";

        if (item.type === "ANALYSIS") {
          icon = "🔬";
          badgeColor = "#00f2fe";
          badgeBg = "rgba(0, 242, 254, 0.15)";
        } else if (item.type === "CHAT") {
          icon = "🤖";
          badgeColor = "#38bdf8";
          badgeBg = "rgba(56, 189, 248, 0.15)";
        } else if (item.type === "HOTSPOT") {
          icon = "📍";
          badgeColor = "#f59e0b";
          badgeBg = "rgba(245, 158, 11, 0.15)";
        } else if (item.type === "MUNICIPAL") {
          icon = "🛡️";
          badgeColor = "#10b981";
          badgeBg = "rgba(16, 185, 129, 0.15)";
        } else if (item.type === "SIMULATION") {
          icon = "🌊";
          badgeColor = "#a855f7";
          badgeBg = "rgba(168, 85, 247, 0.15)";
        }

        return `
          <div class="glass-card history-card" style="padding:1.25rem;margin-bottom:1rem;border-left:4px solid ${badgeColor};">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:0.4rem;flex-wrap:wrap;gap:0.5rem;">
              <div style="display:flex;align-items:center;gap:0.6rem;">
                <span style="font-size:1.2rem;">${icon}</span>
                <strong style="color:var(--text-main);font-size:1rem;">${item.title}</strong>
                <span style="font-size:0.7rem;font-weight:700;color:${badgeColor};background:${badgeBg};padding:2px 8px;border-radius:12px;">
                  ${item.type}
                </span>
              </div>
              <div class="font-mono" style="font-size:0.78rem;color:var(--text-muted);display:flex;align-items:center;gap:0.35rem;">
                <span>⏱️</span>
                <span>${item.timestamp}</span>
              </div>
            </div>
            <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.5;margin-bottom:0.6rem;">
              ${item.details}
            </p>
            <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.75rem;">
              <span style="color:var(--text-faint);">${item.id}</span>
              <button onclick="HistoryModule.deleteItem('${item.id}')" class="pill-btn" style="padding:2px 8px;font-size:0.7rem;color:var(--risk-critical);border-color:rgba(239,68,68,0.3);">
                Delete
              </button>
            </div>
          </div>
        `;
      })
      .join("");
  },

  deleteItem(id) {
    this.historyItems = this.historyItems.filter((item) => item.id !== id);
    this.saveHistory();
    this.renderHistory();
  },

  clearAll() {
    if (confirm("Are you sure you want to clear your activity history?")) {
      this.historyItems = [];
      this.saveHistory();
      this.renderHistory();
    }
  },

  bindEvents() {
    // Filter pills
    document.querySelectorAll(".history-filter-pill").forEach((pill) => {
      pill.addEventListener("click", (e) => {
        document.querySelectorAll(".history-filter-pill").forEach((p) => p.classList.remove("active"));
        e.target.classList.add("active");
        this.activeFilter = e.target.getAttribute("data-filter");
        this.renderHistory();
      });
    });

    // Search input
    const searchInput = document.getElementById("historySearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          this.renderHistory();
          return;
        }
        const filtered = this.historyItems.filter(
          (item) => item.title.toLowerCase().includes(query) || item.details.toLowerCase().includes(query) || item.timestamp.includes(query)
        );
        const container = document.getElementById("historyListContainer");
        if (container) {
          container.innerHTML = filtered.map((item) => `
            <div class="glass-card history-card" style="padding:1.25rem;margin-bottom:1rem;border-left:4px solid var(--teal-glow);">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
                <strong style="color:var(--text-main);">${item.title}</strong>
                <span class="font-mono" style="font-size:0.78rem;color:var(--text-muted);">${item.timestamp}</span>
              </div>
              <p style="font-size:0.85rem;color:var(--text-muted);">${item.details}</p>
            </div>
          `).join("");
        }
      });
    }

    // Export buttons
    const btnExportJson = document.getElementById("btnExportHistoryJson");
    if (btnExportJson) {
      btnExportJson.addEventListener("click", () => this.exportJson());
    }

    const btnExportCsv = document.getElementById("btnExportHistoryCsv");
    if (btnExportCsv) {
      btnExportCsv.addEventListener("click", () => this.exportCsv());
    }

    const btnClearAll = document.getElementById("btnClearHistory");
    if (btnClearAll) {
      btnClearAll.addEventListener("click", () => this.clearAll());
    }
  },

  exportJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.historyItems, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `plastisense_history_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  exportCsv() {
    const headers = ["ID", "Type", "Title", "Details", "Timestamp"];
    const rows = this.historyItems.map((item) => [
      item.id,
      item.type,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.details.replace(/"/g, '""')}"`,
      item.timestamp
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csvContent);
    a.download = `plastisense_history_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
};

window.HistoryModule = HistoryModule;
