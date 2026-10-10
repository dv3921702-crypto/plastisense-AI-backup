/**
 * PlastiSense AI - Brand Audit Module
 * Reports only results returned by the configured vision provider.
 */

const BrandAuditModule = {
  allBrands: [],
  filters: { ward: "", location: "", wasteType: "", date: "" },
  providerAvailable: false,
  serviceError: "",
  isAnalyzing: false,
  disclaimers: [
    "Visible branded plastic detected",
    "Estimated based on observed samples",
    "Requires verification for regulatory use"
  ],

  init() {
    this.bindEvents();
    this.loadBrandData();
  },

  bindEvents() {
    const filterInputs = [
      ["brandFilterWard", "ward"],
      ["brandFilterLocation", "location"],
      ["brandFilterType", "wasteType"],
      ["brandFilterDate", "date"]
    ];
    filterInputs.forEach(([id, filter]) => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener("input", event => {
          this.filters[filter] = event.target.value.trim();
          this.renderBrands();
        });
        input.addEventListener("change", event => {
          this.filters[filter] = event.target.value.trim();
          this.renderBrands();
        });
      }
    });
    const runButton = document.getElementById("btnRunBrandAudit");
    if (runButton) runButton.addEventListener("click", () => this.analyzeImage());
  },

  async loadBrandData() {
    try {
      const response = await fetch("/api/brand-audit");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Brand audit unavailable.");
      this.allBrands = Array.isArray(data.brands) ? data.brands : [];
      this.providerAvailable = Boolean(data.providerAvailable);
      this.serviceError = "";
      this.renderBrands();
    } catch (error) {
      this.serviceError = error.message || "Brand audit records are unavailable.";
      this.renderBrands();
    }
  },

  async analyzeImage() {
    const file = document.getElementById("brandAuditFileInput")?.files?.[0];
    const location = document.getElementById("brandAuditLocation")?.value.trim() || "";
    const ward = document.getElementById("brandAuditWard")?.value.trim() || "";
    const date = document.getElementById("brandAuditDate")?.value || "";
    if (!file) return this.showError("Select an image before starting a brand audit.");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) {
      return this.showError("Choose a JPEG, PNG, or WebP image up to 10 MB.");
    }
    this.serviceError = "";
    this.isAnalyzing = true;
    this.renderBrands();
    try {
      const image = await this.readAsDataUrl(file);
      const response = await fetch("/api/brand-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, location, ward, date })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Brand audit unavailable.");
      this.allBrands = Array.isArray(data.brands) ? data.brands : [];
      this.providerAvailable = Boolean(data.providerAvailable);
      this.isAnalyzing = false;
      this.renderBrands();
      if (window.HistoryModule && Array.isArray(data.analyzedBrands) && data.analyzedBrands.length) {
        const itemCount = data.analyzedBrands.reduce((sum, item) => sum + (Number.isInteger(item.detectedItems) ? item.detectedItems : 0), 0);
        HistoryModule.addItem("ANALYSIS", "Brand Audit", `Vision model returned ${data.analyzedBrands.length} visible brand record(s) and ${itemCount} explicitly counted item(s).`);
      }
    } catch (error) {
      this.isAnalyzing = false;
      this.showError(error.message || "Brand audit is temporarily unavailable. Please try again.");
    }
  },

  readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Unable to read the selected image."));
      reader.readAsDataURL(file);
    });
  },

  showError(message) {
    this.serviceError = message;
    this.renderBrands();
  },

  renderBrands() {
    const container = document.getElementById("brandAuditResults");
    if (!container) return;

    let filtered = [...this.allBrands];
    for (const field of ["ward", "location", "wasteType", "date"]) {
      const query = this.filters[field].toLocaleLowerCase();
      if (query) {
        filtered = filtered.filter(record => String(record[field] || "").toLocaleLowerCase().includes(query));
      }
    }

    const grouped = new Map();
    filtered.forEach(record => {
      const brand = String(record.brand || "").trim();
      if (!brand) return;
      const wasteType = String(record.wasteType || "Waste type unavailable");
      const key = `${brand.toLocaleLowerCase()}|${wasteType.toLocaleLowerCase()}`;
      const existing = grouped.get(key) || {
        brand,
        wasteType,
        itemTotal: 0,
        countComplete: true,
        records: 0,
        confidenceTotal: 0,
        confidenceCount: 0
      };
      existing.records += 1;
      if (Number.isInteger(record.detectedItems) && record.detectedItems > 0) {
        existing.itemTotal += record.detectedItems;
      } else {
        existing.countComplete = false;
      }
      if (Number.isFinite(record.confidence) && record.confidence >= 0 && record.confidence <= 100) {
        existing.confidenceTotal += record.confidence;
        existing.confidenceCount += 1;
      }
      grouped.set(key, existing);
    });
    const sources = [...grouped.values()]
      .filter(source => source.countComplete)
      .sort((left, right) => right.itemTotal - left.itemTotal);
    const podium = sources.slice(0, 3).map((source, index) => `
      <div class="brand-podium-card ${index === 0 ? "gold" : index === 1 ? "silver" : "bronze"}">
        <div class="brand-rank">#${index + 1}</div>
        <h4 class="brand-name">${this.escapeHtml(source.brand)}</h4>
        <div class="brand-count">${source.itemTotal.toLocaleString()} observed item(s)</div>
        <div class="brand-type">${this.escapeHtml(source.wasteType)}</div>
        <div class="brand-confidence">${source.records} analyzed record(s)</div>
      </div>
    `).join("");

    const rows = filtered.map((record, index) => `
      <tr>
        <td><strong>#${index + 1}</strong></td>
        <td><strong>${this.escapeHtml(record.brand || "Brand unavailable")}</strong></td>
        <td>${Number.isInteger(record.detectedItems) && record.detectedItems > 0 ? record.detectedItems.toLocaleString() : "Not reported"}</td>
        <td>${this.escapeHtml(record.wasteType || "Not reported")}</td>
        <td>${Number.isFinite(record.confidence) ? `${this.escapeHtml(record.confidence)}%` : "Not reported"}</td>
        <td>${this.escapeHtml(record.ward || "Not provided")}</td>
        <td>${this.escapeHtml(record.location || "Not provided")}</td>
        <td>${this.escapeHtml(record.date || "Not reported")}</td>
      </tr>
    `).join("");

    const unavailable = !this.providerAvailable
      ? `<div class="forecast-disclaimer" role="status"><strong>Vision analysis unavailable.</strong> ${this.escapeHtml(this.serviceError || "No vision provider is configured. Set GEMINI_API_KEY on the server to enable image analysis.")} Previously analyzed records, if present, remain actual saved results.</div>`
      : "";
    const error = this.serviceError && this.providerAvailable
      ? `<div class="forecast-disclaimer" role="alert">${this.escapeHtml(this.serviceError)}</div>`
      : "";
    const progress = this.isAnalyzing
      ? `<div class="forecast-disclaimer" role="status">Submitting the image to the configured vision service…</div>`
      : "";
    const labels = `<div class="forecast-disclaimer" style="margin-top:.75rem;">
      Interpretation labels (apply only to returned image detections): ${this.disclaimers.map(item => `<span class="demo-data-badge">${this.escapeHtml(item)}</span>`).join(" ")}
      <p>Image-based identification is not proof of legal responsibility.</p>
    </div>`;

    container.innerHTML = `
      ${unavailable}
      ${error}
      ${progress}
      ${this.providerAvailable ? `<div class="forecast-disclaimer">Showing only records returned by the configured vision model. No detections or counts are generated when unsupported.</div>` : ""}
      <h4 style="font-size:1.15rem;color:var(--text-main);margin:1.25rem 0 0.75rem;">Top Plastic Sources — analyzed records only</h4>
      <div class="brand-podium-grid">${podium || '<p class="section-subheading">No records with model-reported item counts are available for the selected filters.</p>'}</div>
      <p class="section-subheading">${filtered.length} analyzed record(s) shown; records without model-reported counts are excluded from the ranked summary.</p>
      <div class="detection-table-wrapper" style="margin-top:1.5rem;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Record</th>
              <th>Detected Brand</th>
              <th>Detected Item Count</th>
              <th>Waste Type</th>
              <th>Confidence</th>
              <th>Ward</th>
              <th>Location</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>${rows || '<tr><td colspan="8">No analyzed records match these filters.</td></tr>'}</tbody>
        </table>
      </div>
      ${labels}
    `;
  },

  escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  }
};

window.BrandAuditModule = BrandAuditModule;
