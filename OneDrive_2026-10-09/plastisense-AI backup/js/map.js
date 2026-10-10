/**
 * PlastiSense AI - Interactive Mumbai Pollution Map
 * Geolocation, Hotspots, Drainage Flow Vectors, Recycling Centers & Risk Markers
 */

const MapModule = {
  map: null,
  markersLayer: null,
  drainageLayer: null,
  recyclingLayer: null,
  heatmapLayer: null,
  routeLayer: null,
  activeFilter: "ALL",
  activeWasteFilter: "ALL",
  selectedHotspot: null,

  init() {
    this.initLeafletMap();
    this.renderHotspotSidebar();
    this.bindControls();
  },

  initLeafletMap() {
    const mapContainer = document.getElementById("mumbaiLeafletMap");
    if (!mapContainer || typeof L === "undefined") return;

    // Centered on Mumbai coastline (Mahim Bay / Bandra / Mithi confluence)
    this.map = L.map("mumbaiLeafletMap", {
      center: [19.0436, 72.8406],
      zoom: 12,
      zoomControl: false
    });

    L.control.zoom({ position: "bottomright" }).addTo(this.map);

    // CartoDB Dark Matter tile layer for premium environmental tech aesthetic
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> | PlastiSense AI',
      maxZoom: 19,
      subdomains: "abcd"
    }).addTo(this.map);

    this.markersLayer = L.layerGroup().addTo(this.map);
    this.drainageLayer = L.layerGroup().addTo(this.map);
    this.recyclingLayer = L.layerGroup().addTo(this.map);
    this.heatmapLayer = L.layerGroup().addTo(this.map);
    this.routeLayer = L.layerGroup().addTo(this.map);

    // Render layers
    this.renderHotspotMarkers();
    this.renderDrainageVectors();
    this.renderRecyclingCenters();
    this.renderHeatmapDensity();
  },

  renderHotspotMarkers() {
    if (!this.markersLayer) return;
    this.markersLayer.clearLayers();

    const hotspots = PLASTISENSE_DATA.hotspots;
    hotspots.forEach((h) => {
      // Apply filters
      if (this.activeFilter !== "ALL" && h.riskLevel !== this.activeFilter) return;

      const markerColor =
        h.riskLevel === "CRITICAL"
          ? "#ef4444"
          : h.riskLevel === "HIGH"
          ? "#f97316"
          : h.riskLevel === "MEDIUM"
          ? "#f59e0b"
          : "#10b981";

      const iconHtml = `
        <div class="custom-map-pin" style="
          width: 30px; 
          height: 30px; 
          border-radius: 50%; 
          background: ${markerColor}; 
          border: 3px solid #030a16; 
          box-shadow: 0 0 16px ${markerColor}; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          color: #fff;
          font-weight: 800;
          font-size: 11px;
          cursor: pointer;
        ">
          ${h.priorityRank}
        </div>
      `;

      const customIcon = L.divIcon({
        className: "hotspot-div-icon",
        html: iconHtml,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker(h.coordinates, { icon: customIcon });

      const popupContent = `
        <div style="font-family:'Inter',sans-serif; color:#fff; min-width:240px; padding:4px;">
          <div style="font-size:11px; font-weight:700; color:${markerColor}; letter-spacing:0.05em; text-transform:uppercase;">
            ● ${h.riskLevel} (${h.riskScore}/100)
          </div>
          <h4 style="font-size:14px; margin:4px 0 6px; font-family:'Outfit',sans-serif; color:#f8fafc;">${h.name}</h4>
          <div style="font-size:12px; color:#94a3b8; margin-bottom:8px;">
            <strong>Ward:</strong> ${h.ward}<br>
            <strong>Waste:</strong> ${h.primaryWaste}<br>
            <strong>Estimated Volume:</strong> ${h.estimatedWasteKg.toLocaleString()} kg<br>
            <strong>Leakage Probability:</strong> <span style="color:#f87171;font-weight:600;">${h.leakageProbability}</span>
          </div>
          <button onclick="MapModule.openHotspotDetail('${h.id}')" style="
            width:100%;
            background: linear-gradient(135deg, #00f2fe, #0ea5e9);
            color:#030a16;
            font-weight:700;
            font-size:11px;
            border:none;
            border-radius:6px;
            padding:6px;
            cursor:pointer;
          ">
            View Plastic Fingerprint & Actions →
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: "glass-popup",
        maxWidth: 280
      });

      marker.on("click", () => {
        this.selectHotspot(h.id);
      });

      this.markersLayer.addLayer(marker);
    });
  },

  renderDrainageVectors() {
    if (!this.drainageLayer) return;
    this.drainageLayer.clearLayers();

    PLASTISENSE_DATA.drainageNetworks.forEach((drain) => {
      const line = L.polyline([drain.startCoord, drain.midCoord, drain.outfallCoord], {
        color: "#38bdf8",
        weight: 3.5,
        opacity: 0.8,
        dashArray: "6, 6"
      });

      line.bindTooltip(`🌊 ${drain.name} (Flow into Sea)`, {
        sticky: true,
        className: "glass-tooltip"
      });

      this.drainageLayer.addLayer(line);

      // Add outfall glow circle
      const outfallCircle = L.circleMarker(drain.outfallCoord, {
        radius: 8,
        color: "#00f2fe",
        fillColor: "#0ea5e9",
        fillOpacity: 0.7
      });
      outfallCircle.bindTooltip(`⚡ Drainage Outfall: ${drain.name}`, { sticky: true });
      this.drainageLayer.addLayer(outfallCircle);
    });
  },

  renderRecyclingCenters() {
    if (!this.recyclingLayer) return;
    this.recyclingLayer.clearLayers();

    PLASTISENSE_DATA.recyclingCenters.forEach((rc) => {
      const iconHtml = `
        <div style="
          width: 26px; 
          height: 26px; 
          border-radius: 6px; 
          background: #10b981; 
          border: 2px solid #fff; 
          box-shadow: 0 0 12px #10b981; 
          display: flex; 
          align-items: center; 
          justify-content: center;
          font-size: 13px;
          cursor: pointer;
        ">
          ♻️
        </div>
      `;

      const rcIcon = L.divIcon({
        html: iconHtml,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });

      const marker = L.marker(rc.coordinates, { icon: rcIcon });
      marker.bindPopup(`
        <div style="font-family:'Inter',sans-serif; color:#fff; min-width:220px;">
          <div style="color:#34d399; font-size:11px; font-weight:700;">RECYCLING FACILITY</div>
          <h4 style="font-size:13px; margin:4px 0 6px; color:#fff;">${rc.name}</h4>
          <p style="font-size:11px; color:#cbd5e1; margin-bottom:4px;">${rc.address}</p>
          <div style="font-size:11px; color:#94a3b8;">
            <strong>Cap:</strong> ${rc.capacityTonPerDay} T/day<br>
            <strong>Polymers:</strong> ${rc.acceptedTypes.join(", ")}
          </div>
        </div>
      `);

      this.recyclingLayer.addLayer(marker);
    });
  },

  renderHeatmapDensity() {
    if (!this.heatmapLayer) return;
    this.heatmapLayer.clearLayers();

    // Render weighted translucent circular density blooms around hotspots
    PLASTISENSE_DATA.hotspots.forEach((h) => {
      const radius = h.riskScore * 18;
      const color =
        h.riskScore >= 85
          ? "#ef4444"
          : h.riskScore >= 70
          ? "#f97316"
          : h.riskScore >= 50
          ? "#f59e0b"
          : "#10b981";

      const circle = L.circle(h.coordinates, {
        radius: radius,
        fillColor: color,
        fillOpacity: 0.18,
        stroke: false
      });

      this.heatmapLayer.addLayer(circle);
    });
  },

  renderHotspotSidebar() {
    const listContainer = document.getElementById("mapHotspotsList");
    if (!listContainer) return;

    listContainer.innerHTML = PLASTISENSE_DATA.hotspots
      .map((h) => {
        const riskClass = h.riskLevel.toLowerCase();
        return `
          <div class="hotspot-list-item" id="sidebar-hotspot-${h.id}" onclick="MapModule.selectHotspot('${h.id}')">
            <div class="hotspot-item-header">
              <span class="hotspot-item-title">#${h.priorityRank} ${h.name}</span>
              <span class="risk-tag ${riskClass}">${h.riskLevel}</span>
            </div>
            <div class="hotspot-item-meta">
              <span>📍 ${h.ward}</span>
              <span>•</span>
              <span>⚠️ ${h.riskScore}/100</span>
              <span>•</span>
              <span>🌊 ${h.leakageProbability}</span>
            </div>
          </div>
        `;
      })
      .join("");
  },

  selectHotspot(id) {
    const h = PLASTISENSE_DATA.hotspots.find((item) => item.id === id);
    if (!h) return;

    this.selectedHotspot = h;

    // Pan map to hotspot
    if (this.map) {
      this.map.flyTo(h.coordinates, 14, { duration: 1.2 });
    }

    // Highlight sidebar item
    document.querySelectorAll(".hotspot-list-item").forEach((el) => el.classList.remove("active"));
    const activeEl = document.getElementById(`sidebar-hotspot-${id}`);
    if (activeEl) {
      activeEl.classList.add("active");
      activeEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  },

  openHotspotDetail(id) {
    const h = PLASTISENSE_DATA.hotspots.find((item) => item.id === id);
    if (!h) return;

    this.selectedHotspot = h;
    const modal = document.getElementById("hotspotDetailModal");
    if (!modal) return;

    document.getElementById("modalHotspotTitle").textContent = h.name;
    document.getElementById("modalHotspotWard").textContent = `Ward: ${h.ward} | Priority Rank: #${h.priorityRank}`;
    document.getElementById("modalRiskScore").textContent = `${h.riskScore}/100 (${h.riskLevel})`;
    document.getElementById("modalWasteVolume").textContent = `${h.estimatedWasteKg.toLocaleString()} kg`;
    document.getElementById("modalLeakageProb").textContent = h.leakageProbability;
    document.getElementById("modalAssignedSquad").textContent = h.assignedTeam;

    // Render Plastic Fingerprint Bar
    const fp = h.plasticFingerprint;
    const fpContainer = document.getElementById("modalPlasticFingerprint");
    if (fpContainer) {
      fpContainer.innerHTML = `
        <div style="margin-bottom:12px;">
          <div style="display:flex;height:14px;border-radius:7px;overflow:hidden;margin-bottom:8px;">
            <div style="width:${fp.bottles}%;background:#00f2fe;" title="Bottles: ${fp.bottles}%"></div>
            <div style="width:${fp.bags}%;background:#ef4444;" title="Bags: ${fp.bags}%"></div>
            <div style="width:${fp.packaging}%;background:#f59e0b;" title="Packaging: ${fp.packaging}%"></div>
            <div style="width:${fp.thermocol}%;background:#ec4899;" title="Thermocol: ${fp.thermocol}%"></div>
            <div style="width:${fp.fishingNets}%;background:#a855f7;" title="Fishing Nets: ${fp.fishingNets}%"></div>
            <div style="width:${fp.microplastics}%;background:#10b981;" title="Microplastics: ${fp.microplastics}%"></div>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;font-size:11px;color:#cbd5e1;">
            <span><span style="color:#00f2fe;">■</span> Bottles ${fp.bottles}%</span>
            <span><span style="color:#ef4444;">■</span> Bags ${fp.bags}%</span>
            <span><span style="color:#f59e0b;">■</span> Packaging ${fp.packaging}%</span>
            <span><span style="color:#ec4899;">■</span> Thermocol ${fp.thermocol}%</span>
            <span><span style="color:#a855f7;">■</span> Nets ${fp.fishingNets}%</span>
          </div>
        </div>
      `;
    }

    // Explainability
    const expList = document.getElementById("modalExplainList");
    if (expList) {
      expList.innerHTML = h.explainability.map((item) => `<li>${item}</li>`).join("");
    }

    modal.classList.add("open");
  },

  closeHotspotDetail() {
    const modal = document.getElementById("hotspotDetailModal");
    if (modal) modal.classList.remove("open");
  },

  drawSmartCleanupRoute() {
    if (!this.routeLayer || !this.map) return;
    this.routeLayer.clearLayers();

    // Priority route connecting top 5 hotspots
    const routeCoords = [
      PLASTISENSE_DATA.hotspots[0].coordinates, // Mithi River Outfall
      PLASTISENSE_DATA.hotspots[1].coordinates, // Mahim Bay
      PLASTISENSE_DATA.hotspots[4].coordinates, // Dharavi Canal
      PLASTISENSE_DATA.hotspots[2].coordinates, // Versova Beach
      PLASTISENSE_DATA.hotspots[3].coordinates  // Juhu Beach
    ];

    const polyline = L.polyline(routeCoords, {
      color: "#10b981",
      weight: 4,
      dashArray: "8, 6",
      opacity: 0.9
    }).addTo(this.routeLayer);

    this.map.fitBounds(polyline.getBounds(), { padding: [40, 40] });

    alert("⚡ Smart Municipal Cleanup Route Generated: Connecting 5 Critical & High-Risk Interception Nodes (Mithi → Mahim → Dharavi → Versova → Juhu).");
  },

  bindControls() {
    // Risk filter buttons
    const filterSelect = document.getElementById("mapRiskFilter");
    if (filterSelect) {
      filterSelect.addEventListener("change", (e) => {
        this.activeFilter = e.target.value;
        this.renderHotspotMarkers();
      });
    }

    // Search bar
    const searchInput = document.getElementById("mapSearchInput");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          this.renderHotspotSidebar();
          return;
        }
        const matches = PLASTISENSE_DATA.hotspots.filter(
          (h) => h.name.toLowerCase().includes(query) || h.ward.toLowerCase().includes(query)
        );
        const listContainer = document.getElementById("mapHotspotsList");
        if (listContainer) {
          listContainer.innerHTML = matches
            .map((h) => `
              <div class="hotspot-list-item" onclick="MapModule.selectHotspot('${h.id}')">
                <div class="hotspot-item-header">
                  <span class="hotspot-item-title">#${h.priorityRank} ${h.name}</span>
                  <span class="risk-tag ${h.riskLevel.toLowerCase()}">${h.riskLevel}</span>
                </div>
                <div class="hotspot-item-meta">
                  <span>📍 ${h.ward}</span>
                  <span>•</span>
                  <span>⚠️ ${h.riskScore}/100</span>
                </div>
              </div>
            `)
            .join("");
        }
      });
    }

    // Layer checkboxes
    const chkHeatmap = document.getElementById("layerToggleHeatmap");
    if (chkHeatmap) {
      chkHeatmap.addEventListener("change", (e) => {
        if (e.target.checked) this.map.addLayer(this.heatmapLayer);
        else this.map.removeLayer(this.heatmapLayer);
      });
    }

    const chkDrainage = document.getElementById("layerToggleDrainage");
    if (chkDrainage) {
      chkDrainage.addEventListener("change", (e) => {
        if (e.target.checked) this.map.addLayer(this.drainageLayer);
        else this.map.removeLayer(this.drainageLayer);
      });
    }

    const chkRecycling = document.getElementById("layerToggleRecycling");
    if (chkRecycling) {
      chkRecycling.addEventListener("change", (e) => {
        if (e.target.checked) this.map.addLayer(this.recyclingLayer);
        else this.map.removeLayer(this.recyclingLayer);
      });
    }

    // Route trigger button
    const btnRoute = document.getElementById("btnGenCleanupRoute");
    if (btnRoute) {
      btnRoute.addEventListener("click", () => this.drawSmartCleanupRoute());
    }
  }
};

window.MapModule = MapModule;
