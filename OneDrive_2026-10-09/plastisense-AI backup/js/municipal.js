/**
 * PlastiSense AI - Municipal Action Center, Community Verification & Impact Engine
 */

const MunicipalModule = {
  init() {
    this.renderTasks();
    this.renderCommunityReports();
    this.bindEvents();
    this.calculateImpactScore(9450, 4800); // Initial baseline calculation
  },

  bindEvents() {
    // Task modal opening
    const btnNewTask = document.getElementById("btnOpenNewTaskModal");
    if (btnNewTask) {
      btnNewTask.addEventListener("click", () => {
        const modal = document.getElementById("assignTaskModal");
        if (modal) modal.classList.add("open");
      });
    }

    // Task form submission
    const taskForm = document.getElementById("assignTaskForm");
    if (taskForm) {
      taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCreateTask();
      });
    }

    // Citizen report submission
    const repForm = document.getElementById("citizenReportForm");
    if (repForm) {
      repForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCreateCitizenReport();
      });
    }

    // Impact calculator inputs
    const inRemoved = document.getElementById("impactInputRemoved");
    const inArea = document.getElementById("impactInputArea");
    if (inRemoved && inArea) {
      const recompute = () => {
        this.calculateImpactScore(parseFloat(inRemoved.value) || 0, parseFloat(inArea.value) || 0);
      };
      inRemoved.addEventListener("input", recompute);
      inArea.addEventListener("input", recompute);
    }
  },

  renderTasks() {
    const container = document.getElementById("municipalTasksList");
    if (!container) return;

    container.innerHTML = PLASTISENSE_DATA.cleanupTasks
      .map((t) => {
        const isCompleted = t.status === "Completed";
        return `
          <div class="task-card">
            <div class="task-card-header">
              <span class="task-id">${t.taskId}</span>
              <span class="risk-tag ${t.priority.toLowerCase()}">${t.priority}</span>
              <span class="pill-btn ${isCompleted ? "active" : ""}">${t.status}</span>
            </div>
            <h4 style="font-size:0.95rem;color:#fff;margin-bottom:0.35rem;">${t.location}</h4>
            <div style="font-size:0.8rem;color:#94a3b8;margin-bottom:0.6rem;">
              <strong>Team:</strong> ${t.assignedTeam} (${t.crewSize} crew members)<br>
              <strong>Equipment:</strong> ${t.equipment}<br>
              <strong>Notes:</strong> <em>"${t.notes}"</em>
            </div>
            <div style="display:flex;gap:0.5rem;align-items:center;">
              ${
                !isCompleted
                  ? `<button onclick="MunicipalModule.markTaskComplete('${t.taskId}')" class="btn-primary" style="padding:0.35rem 0.85rem;font-size:0.75rem;">Mark Restored & Upload Photo</button>`
                  : `<span style="color:var(--emerald-glow);font-size:0.75rem;font-weight:600;">✓ Verification Signed Off</span>`
              }
            </div>
          </div>
        `;
      })
      .join("");
  },

  handleCreateTask() {
    const locInput = document.getElementById("taskLocationInput").value;
    const teamInput = document.getElementById("taskTeamInput").value;
    const prioInput = document.getElementById("taskPriorityInput").value;
    const notesInput = document.getElementById("taskNotesInput").value;

    const newTask = {
      taskId: `TASK-2026-${Math.floor(100 + Math.random() * 900)}`,
      hotspotId: "mum-002",
      location: locInput,
      assignedTeam: teamInput,
      priority: prioInput,
      scheduledDate: new Date().toISOString().split("T")[0],
      status: "In Progress",
      crewSize: 20,
      equipment: "Trash Skimmer Boat & Manual Gang",
      notes: notesInput
    };

    PLASTISENSE_DATA.cleanupTasks.unshift(newTask);
    this.renderTasks();

    // Close modal
    const modal = document.getElementById("assignTaskModal");
    if (modal) modal.classList.remove("open");

    // Add audit log
    if (window.App) {
      App.addAuditLog(`Municipal Squad Dispatched to ${locInput} (${newTask.taskId})`);
    }

    alert(`✅ Squad successfully dispatched: ${newTask.taskId}`);
  },

  markTaskComplete(taskId) {
    const task = PLASTISENSE_DATA.cleanupTasks.find((t) => t.taskId === taskId);
    if (!task) return;

    task.status = "Completed";
    this.renderTasks();

    // Trigger celebration / notification
    if (window.App) {
      App.addAuditLog(`Task ${taskId} marked as restored and verified.`);
      App.pushNotification({
        id: `NOTIF-${Date.now()}`,
        type: "SUCCESS",
        title: `✅ SITE RESTORATION VERIFIED: ${task.location}`,
        message: `Task ${taskId} has been closed. Estimated 850 kg plastic intercepted before marine leakage.`,
        recommendedAction: "View updated Before vs After comparison.",
        timestamp: "Just now",
        read: false
      });
    }

    alert(`🎉 Location successfully restored and verified!`);
  },

  renderCommunityReports() {
    const container = document.getElementById("communityReportsList");
    if (!container) return;

    container.innerHTML = PLASTISENSE_DATA.communityReports
      .map((rep) => {
        const canVerify = rep.status === "Under Review" || rep.status === "Reported";
        return `
          <div class="task-card" style="border-left: 3px solid var(--teal-glow);">
            <div class="task-card-header">
              <span class="task-id">${rep.id}</span>
              <span class="pill-btn">${rep.status}</span>
              <span style="font-size:0.75rem;color:var(--text-muted);">👍 ${rep.upvotes} Citizens</span>
            </div>
            <h4 style="font-size:0.95rem;color:#fff;margin-bottom:0.25rem;">${rep.locationName}</h4>
            <div style="font-size:0.78rem;color:#cbd5e1;margin-bottom:0.5rem;">
              <strong>Reported by:</strong> ${rep.reportedBy} (${rep.date})<br>
              <strong>Debris Type:</strong> ${rep.wasteType} (~${rep.estimatedVolume})
            </div>
            ${
              rep.verifier
                ? `<div style="font-size:0.72rem;color:var(--emerald-glow);">✓ Verified by ${rep.verifier}</div>`
                : ""
            }
            <div style="margin-top:0.6rem;display:flex;gap:0.5rem;">
              ${
                canVerify
                  ? `<button onclick="MunicipalModule.verifyReport('${rep.id}')" class="pill-btn" style="border-color:var(--emerald-glow);color:var(--emerald-glow);">Verify Hotspot</button>`
                  : ""
              }
              <button onclick="MunicipalModule.upvoteReport('${rep.id}')" class="pill-btn">Upvote (Urgent)</button>
            </div>
          </div>
        `;
      })
      .join("");
  },

  verifyReport(repId) {
    const rep = PLASTISENSE_DATA.communityReports.find((r) => r.id === repId);
    if (!rep) return;

    rep.status = "Verified";
    rep.verifier = "Officer Rajesh Patel (Ward G/North)";
    this.renderCommunityReports();

    if (window.App) {
      App.addAuditLog(`Officer verified citizen hotspot report ${repId} at ${rep.locationName}`);
    }
    alert(`Hotspot ${repId} is now officially verified and added to the municipal queue!`);
  },

  upvoteReport(repId) {
    const rep = PLASTISENSE_DATA.communityReports.find((r) => r.id === repId);
    if (!rep) return;
    rep.upvotes += 1;
    this.renderCommunityReports();
  },

  handleCreateCitizenReport() {
    const locName = document.getElementById("citizenLocName").value;
    const wasteType = document.getElementById("citizenWasteType").value;
    const volume = document.getElementById("citizenVolume").value;

    const newRep = {
      id: `REP-${Math.floor(900 + Math.random() * 99)}`,
      reportedBy: "Community Volunteer (Current User)",
      locationName: locName,
      coordinates: [19.05, 72.83],
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      wasteType: wasteType,
      estimatedVolume: volume,
      image: "assets/images/plastic-beach-before.jpg",
      status: "Reported",
      upvotes: 1,
      verifier: null
    };

    PLASTISENSE_DATA.communityReports.unshift(newRep);
    this.renderCommunityReports();

    // Reset inputs
    document.getElementById("citizenLocName").value = "";
    alert("🙌 Citizen report successfully logged with GPS coordinates!");
  },

  calculateImpactScore(plasticKg, areaSqm) {
    // Environmental formula:
    // 1 kg plastic = ~1.6 kg CO2 eq prevented, ~0.82 marine leakage factor
    const leakagePreventedKg = Math.round(plasticKg * 0.88);
    const co2SavedKg = Math.round(plasticKg * 1.58);
    const marineLifeProtectedEstimate = Math.round(plasticKg * 2.3);

    const elLeakage = document.getElementById("impactResultLeakage");
    const elCo2 = document.getElementById("impactResultCo2");
    const elArea = document.getElementById("impactResultArea");
    const elFauna = document.getElementById("impactResultFauna");

    if (elLeakage) elLeakage.textContent = `${leakagePreventedKg.toLocaleString()} kg`;
    if (elCo2) elCo2.textContent = `${co2SavedKg.toLocaleString()} kg CO2e`;
    if (elArea) elArea.textContent = `${areaSqm.toLocaleString()} m²`;
    if (elFauna) elFauna.textContent = `~${marineLifeProtectedEstimate.toLocaleString()} Organisms`;
  }
};

window.MunicipalModule = MunicipalModule;
