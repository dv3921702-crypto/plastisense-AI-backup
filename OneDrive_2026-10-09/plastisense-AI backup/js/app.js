/**
 * PlastiSense AI - Main Application Controller
 * Handles Navigation, Light/Dark Theming, Sound, User Auth & Profile,
 * Gender-based Avatars, History Integration, and Mobile Responsiveness.
 */

const App = {
  currentView: "home",
  theme: "dark",
  currentUser: {
    name: "Guest",
    role: "Not signed in",
    email: "",
    collegeOrg: "",
    gender: "female",
    avatarId: "f_avatar_1",
    avatarCustom: null
  },
  demoMode: true,

  init() {
    this.initTheme();
    this.initSound();
    this.initUserSession();
    this.bindNavigation();
    this.bindMobileNav();
    this.bindAuth();
    this.bindNotifications();
    this.bindDemoToggle();
    this.renderAuditLogs();
    this.renderNotificationsList();

    // Initialize sub-modules once DOM is ready
    if (window.SoundEngine) SoundEngine.init();
    if (window.HistoryModule) HistoryModule.init();
    if (window.ScannerModule) ScannerModule.init();
    if (window.MapModule) MapModule.init();
    if (window.MapAssistant) MapAssistant.init();
    if (window.SatelliteModule) SatelliteModule.init();
    if (window.DrainSimulator) DrainSimulator.init();
    if (window.AnalyticsModule) AnalyticsModule.init();
    if (window.MunicipalModule) MunicipalModule.init();
    if (window.ForecastModule) ForecastModule.init();
    if (window.WhatIfModule) WhatIfModule.init();
    if (window.BrandAuditModule) BrandAuditModule.init();
    if (window.AutoVerifyModule) AutoVerifyModule.init();

    window.addEventListener("plastisense:langchange", () => {
      this.renderNotificationsList();
      this.renderAuditLogs();
    });

    // Check language
    if (window.I18N) I18N.applyTranslations();

    // Setup before/after cleanup toggle in Analytics/Landing
    this.initBeforeAfterComparison();
  },

  initTheme() {
    const savedTheme = localStorage.getItem("plastisense_theme") || "dark";
    this.setTheme(savedTheme);

    const themeToggleBtn = document.getElementById("btnThemeToggle");
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener("click", () => {
        const newTheme = this.theme === "dark" ? "light" : "dark";
        this.setTheme(newTheme);
      });
    }
  },

  setTheme(theme) {
    this.theme = theme;
    localStorage.setItem("plastisense_theme", theme);
    document.documentElement.setAttribute("data-theme", theme);

    const themeToggleBtn = document.getElementById("btnThemeToggle");
    if (themeToggleBtn) {
      const labelKey = theme === "light" ? "theme_light" : "theme_dark";
      const titleKey = theme === "light" ? "ui_theme_light_active" : "ui_theme_dark_active";
      if (theme === "light") {
        themeToggleBtn.innerHTML = `<span class="theme-icon">☀️</span> <span class="theme-label" data-i18n="${labelKey}">${I18N.t(labelKey)}</span>`;
      } else {
        themeToggleBtn.innerHTML = `<span class="theme-icon">🌙</span> <span class="theme-label" data-i18n="${labelKey}">${I18N.t(labelKey)}</span>`;
      }
      themeToggleBtn.dataset.i18nTitle = titleKey;
      themeToggleBtn.title = I18N.t(titleKey);
    }
  },

  initSound() {
    const btnSound = document.getElementById("btnSoundToggle");
    if (btnSound) {
      btnSound.addEventListener("click", () => {
        if (window.SoundEngine) {
          SoundEngine.toggleSound();
        }
      });
    }
  },

  initUserSession() {
    localStorage.removeItem("plastisense_session_token");
    fetch("/api/session")
      .then((response) => response.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          this.currentUser = Object.assign({}, this.currentUser, data.user);
          this.saveUserSession();
        } else {
          this.currentUser = { name: "Guest", role: "Not signed in", email: "", gender: "female", avatarId: "f_avatar_1", avatarCustom: null };
          localStorage.removeItem("plastisense_user_profile");
        }
        this.updateUserBadge();
      })
      .catch(() => {
        this.currentUser = { name: "Guest", role: "Not signed in", email: "", gender: "female", avatarId: "f_avatar_1", avatarCustom: null };
        localStorage.removeItem("plastisense_user_profile");
        this.updateUserBadge();
        this.authMessage("Unable to contact the authentication service. Check your connection and try again.");
      });
  },

  saveUserSession() {
    try {
      localStorage.setItem("plastisense_user_profile", JSON.stringify(this.currentUser));
    } catch (e) {}
  },

  bindNavigation() {
    document.querySelectorAll("[data-nav]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const targetView = btn.getAttribute("data-nav");
        this.navigate(targetView);
      });
    });

    // Language selector (Desktop & Mobile)
    const langSelect = document.getElementById("langSelector");
    if (langSelect) {
      langSelect.addEventListener("change", (e) => {
        if (window.I18N) I18N.setLanguage(e.target.value);
      });
    }

    const mobileLang = document.getElementById("mobileLangSelector");
    if (mobileLang) {
      mobileLang.addEventListener("change", (e) => {
        if (window.I18N) I18N.setLanguage(e.target.value);
      });
    }
  },

  bindMobileNav() {
    const btnHamburger = document.getElementById("btnMobileNavToggle");
    const drawer = document.getElementById("mobileNavDrawer");
    const backdrop = document.getElementById("mobileDrawerBackdrop");
    const btnClose = document.getElementById("btnCloseMobileDrawer");

    const closeDrawer = () => {
      if (drawer) drawer.classList.remove("open");
      if (backdrop) backdrop.classList.remove("open");
      if (drawer) {
        drawer.setAttribute("aria-hidden", "true");
        drawer.inert = true;
      }
      if (btnHamburger) btnHamburger.setAttribute("aria-expanded", "false");
    };

    if (btnHamburger) {
      btnHamburger.addEventListener("click", () => {
        if (drawer) drawer.classList.add("open");
        if (backdrop) backdrop.classList.add("open");
        if (drawer) {
          drawer.inert = false;
          drawer.setAttribute("aria-hidden", "false");
        }
        btnHamburger.setAttribute("aria-expanded", "true");
        btnClose?.focus();
      });
    }
    if (backdrop) backdrop.addEventListener("click", closeDrawer);
    if (btnClose) {
      btnClose.addEventListener("click", () => {
        closeDrawer();
        btnHamburger?.focus();
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && drawer?.classList.contains("open")) {
        closeDrawer();
        btnHamburger?.focus();
      }
    });

    // Close on navigation click
    document.querySelectorAll(".mobile-nav-item").forEach((item) => {
      item.tabIndex = 0;
      item.setAttribute("role", "button");
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          item.click();
        }
      });
      item.addEventListener("click", () => {
        closeDrawer();
      });
    });
  },

  navigate(viewId) {
    this.currentView = viewId;

    // Toggle active classes on nav links
    document.querySelectorAll(".nav-item, .mobile-nav-item").forEach((item) => {
      if (item.getAttribute("data-nav") === viewId) {
        item.classList.add("active");
        item.setAttribute("aria-current", "page");
      } else {
        item.classList.remove("active");
        item.removeAttribute("aria-current");
      }
    });

    // Hide all view sections, show target
    document.querySelectorAll(".view-section").forEach((sec) => {
      sec.classList.remove("active");
    });

    const targetSection = document.getElementById(`view-${viewId}`);
    if (targetSection) {
      targetSection.classList.add("active");
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Refresh leaflet map if navigated to map
    if (viewId === "map" && window.MapModule && MapModule.map) {
      setTimeout(() => {
        MapModule.map.invalidateSize();
      }, 250);
    }

    // Resize simulator canvas if navigated to simulator
    if (viewId === "simulator" && window.DrainSimulator) {
      setTimeout(() => {
        DrainSimulator.resizeCanvas();
      }, 250);
    }

    // Log navigation to History if relevant
    if (viewId === "map" && window.HistoryModule) {
      HistoryModule.addItem("HOTSPOT", "Viewed Mumbai Pollution Map", "Inspected active coastal risk zones across Greater Mumbai.");
    }
  },

  bindAuth() {
    // Open Auth / Role modal
    const roleMenu = document.getElementById("userRoleCard");
    const authModal = document.getElementById("authRoleModal");
    const profileModal = document.getElementById("userProfileModal");

    if (roleMenu && authModal) {
      roleMenu.addEventListener("click", () => {
        authModal.classList.add("open");
        const logoutButton = document.getElementById("btnAuthLogout");
        if (logoutButton) logoutButton.hidden = !this.currentUser.email;
        if (this.currentUser.email) {
          document.getElementById("authLoginSection").hidden = true;
          document.getElementById("authSignupSection").hidden = true;
          document.getElementById("authProfileSection").hidden = false;
          this.openAccountProfile();
        } else {
          document.getElementById("authLoginSection").hidden = false;
          document.getElementById("authSignupSection").hidden = true;
          document.getElementById("authProfileSection").hidden = true;
          this.renderAvatarOptions();
        }
      });
    }

    const logoutButton = document.getElementById("btnAuthLogout");
    if (logoutButton) {
      logoutButton.addEventListener("click", async () => {
        try {
          const response = await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "{}"
          });
          if (!response.ok) throw new Error("Sign out failed.");
        } catch (error) {
          this.authMessage("Could not contact the server to sign out. Please retry.");
          return;
        }
        localStorage.removeItem("plastisense_user_profile");
        this.currentUser = { name: "Guest", role: "Not signed in", email: "", gender: "female", avatarId: "f_avatar_1", avatarCustom: null };
        this.updateUserBadge();
        authModal?.classList.remove("open");
      });
    }

    // View Profile link
    const btnViewProfile = document.getElementById("btnViewProfileModal");
    if (btnViewProfile && profileModal) {
      btnViewProfile.addEventListener("click", () => {
        if (authModal) authModal.classList.remove("open");
        this.openProfileModal();
      });
    }

    // Switch between Login and Create Account views inside Auth Modal (Requirement 9)
    const btnShowSignup = document.getElementById("btnShowSignupSection");
    const btnShowLogin = document.getElementById("btnShowLoginSection");
    const secLogin = document.getElementById("authLoginSection");
    const secSignup = document.getElementById("authSignupSection");

    if (btnShowSignup && secLogin && secSignup) {
      btnShowSignup.addEventListener("click", (e) => {
        e.preventDefault();
        secLogin.hidden = true;
        secSignup.hidden = false;
        document.getElementById("authProfileSection").hidden = true;
        this.renderAvatarOptions();
      });
    }

    if (btnShowLogin && secLogin && secSignup) {
      btnShowLogin.addEventListener("click", (e) => {
        e.preventDefault();
        secSignup.hidden = true;
        secLogin.hidden = false;
        document.getElementById("authProfileSection").hidden = true;
      });
    }

    const forgotPassword = document.getElementById("btnForgotPassword");
    if (forgotPassword) {
      forgotPassword.addEventListener("click", () => {
        this.authMessage("Password reset is unavailable: this server has no configured reset-token service or email delivery. Contact the system administrator.");
      });
    }

    // Login Form Submission
    const loginForm = document.getElementById("authLoginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    // Create Account Form Submission (Requirement 9 & 10)
    const signupForm = document.getElementById("authSignupForm");
    if (signupForm) {
      signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleCreateAccount();
      });
    }

    // Gender selection changes avatar options dynamically (Requirement 10)
    const genderRadios = document.querySelectorAll("input[name='signupGender']");
    genderRadios.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        this.currentUser.gender = e.target.value;
        const avatarGender = e.target.value === "male" ? "male" : "female";
        const avatars = PLASTISENSE_DATA.defaultAvatars[avatarGender];
        const avatarInput = document.getElementById("signupAvatarId");
        if (avatarInput && avatars.length) avatarInput.value = avatars[0].id;
        this.renderAvatarOptions();
      });
    });

    const profileAvatarInput = document.getElementById("profileAvatarUpload");
    if (profileAvatarInput) {
      profileAvatarInput.addEventListener("change", (event) => {
        const file = event.target.files && event.target.files[0];
        this.pendingProfileAvatarData = null;
        if (!file) return;
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
          this.authMessage("Choose a PNG, JPEG, or WebP image.");
          profileAvatarInput.value = "";
          return;
        }
        if (file.size > 2 * 1024 * 1024) {
          this.authMessage("Avatar image must be no larger than 2 MB.");
          profileAvatarInput.value = "";
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          this.pendingProfileAvatarData = reader.result;
          document.getElementById("profileAvatarId").value = "";
          document.getElementById("profileAvatarPreview").innerHTML =
            `<img src="${reader.result}" alt="Selected profile image preview" style="width:84px;height:84px;border-radius:50%;object-fit:cover;">`;
          this.authMessage("");
          this.renderProfileAvatarOptions();
        };
        reader.onerror = () => this.authMessage("Could not read this image. Choose another file.");
        reader.readAsDataURL(file);
      });
    }

    const profileAvatarForm = document.getElementById("profileAvatarForm");
    if (profileAvatarForm) {
      profileAvatarForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.handleProfileAvatarSave();
      });
    }

    // Password strength indicator in signup
    const passInput = document.getElementById("signupPasswordInput");
    const passBar = document.getElementById("passStrengthBar");
    if (passInput && passBar) {
      passInput.addEventListener("input", (e) => {
        const val = e.target.value;
        const score = this.passwordCharacterClassCount(val);

        const percent = (score / 4) * 100;
        passBar.style.width = `${percent}%`;
        passBar.style.backgroundColor = val.length >= 12 && score >= 3
          ? "var(--emerald-glow)"
          : score <= 1 ? "var(--risk-critical)" : "var(--risk-medium)";
      });
    }

    // Save profile changes from Profile Modal
    const btnSaveProfile = document.getElementById("btnSaveProfileInfo");
    if (btnSaveProfile) {
      btnSaveProfile.addEventListener("click", () => {
        const nameVal = document.getElementById("profileModalNameInput").value;
        const orgVal = document.getElementById("profileModalOrgInput").value;
        if (nameVal) this.currentUser.name = nameVal;
        if (orgVal) this.currentUser.collegeOrg = orgVal;
        this.saveUserSession();
        this.updateUserBadge();
        if (profileModal) profileModal.classList.remove("open");
        alert("Profile details updated successfully!");
      });
    }
  },

  authMessage(message, isError = true) {
    const element = document.getElementById("authMessage");
    if (!element) return;
    element.textContent = message;
    element.style.color = isError ? "var(--risk-critical)" : "var(--emerald-glow)";
    element.hidden = !message;
  },

  passwordCharacterClassCount(password) {
    return [
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password)
    ].filter(Boolean).length;
  },

  async handleLogin() {
    const email = document.getElementById("loginEmailInput")?.value.trim() || "";
    const password = document.getElementById("loginPasswordInput")?.value || "";
    this.authMessage("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("The authentication server returned an invalid response. Please try again.");
      }
      if (!response.ok) throw new Error(data.error || "Sign in failed.");
      this.currentUser = Object.assign({}, this.currentUser, data.user, { avatarCustom: null });
      this.saveUserSession();
      this.updateUserBadge();
      document.getElementById("authRoleModal")?.classList.remove("open");
      this.authMessage(data.message || "Signed in.", false);
    } catch (error) {
      this.authMessage(error instanceof TypeError
        ? "Cannot reach the authentication service. Check your connection and try again."
        : error.message || "Sign in failed. Please try again.");
    } finally {
      const passwordInput = document.getElementById("loginPasswordInput");
      if (passwordInput) passwordInput.value = "";
    }
  },

  async handleCreateAccount() {
    const name = document.getElementById("signupNameInput")?.value.trim() || "";
    const email = document.getElementById("signupEmailInput")?.value.trim() || "";
    const password = document.getElementById("signupPasswordInput")?.value || "";
    const confirmPassword = document.getElementById("signupConfirmPasswordInput")?.value || "";
    const country = document.getElementById("signupCountryInput")?.value.trim() || "";
    const gender = document.querySelector("input[name='signupGender']:checked")?.value || "";
    const occupation = document.getElementById("signupOccupationInput")?.value || "";
    const avatarId = document.getElementById("signupAvatarId")?.value || "";
    this.authMessage("");
    if (!name || !email || !password || !confirmPassword || !country || !occupation) {
      this.authMessage("Complete all required account fields.");
      return;
    }
    if (!gender || !avatarId) {
      this.authMessage("Choose a gender or preferred avatar style.");
      return;
    }
    if (password.length < 12 || this.passwordCharacterClassCount(password) < 3) {
      this.authMessage("Use at least 12 characters and at least three of these: lowercase letters, uppercase letters, numbers, and symbols.");
      return;
    }
    if (password !== confirmPassword) {
      this.authMessage("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword, country, gender, occupation, avatarId })
      });
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("The authentication server returned an invalid response. Please try again.");
      }
      if (!response.ok) throw new Error(data.error || "Account creation failed.");
      this.currentUser = Object.assign({}, this.currentUser, data.user, { avatarCustom: null });
      this.saveUserSession();
      this.updateUserBadge();
      const profile = data.user;
      this.authMessage(
        `Account created. ${profile.name} (${profile.email})`,
        false
      );
      document.getElementById("authSignupSection").hidden = true;
      document.getElementById("authProfileSection").hidden = false;
      document.getElementById("btnAuthLogout").hidden = false;
      this.openAccountProfile();
      if (window.HistoryModule) HistoryModule.addItem("MUNICIPAL", "Account Registered", `Welcome ${profile.name}.`);
    } catch (error) {
      this.authMessage(error instanceof TypeError
        ? "Cannot reach the authentication service. Check your connection and try again."
        : error.message || "Account creation failed. Please try again.");
    } finally {
      const passwordInput = document.getElementById("signupPasswordInput");
      const confirmInput = document.getElementById("signupConfirmPasswordInput");
      if (passwordInput) passwordInput.value = "";
      if (confirmInput) confirmInput.value = "";
    }
  },

  renderAvatarOptions() {
    const container = document.getElementById("avatarOptionsGrid");
    if (!container || !PLASTISENSE_DATA.defaultAvatars) return;

    const selectedGender = document.querySelector("input[name='signupGender']:checked")?.value;
    const avatars = [...(selectedGender === "male"
      ? PLASTISENSE_DATA.defaultAvatars.male
      : selectedGender === "female"
        ? PLASTISENSE_DATA.defaultAvatars.female
        : [...PLASTISENSE_DATA.defaultAvatars.male, ...PLASTISENSE_DATA.defaultAvatars.female]),
    PLASTISENSE_DATA.defaultAvatars.provided];
    const selectedAvatarId = document.getElementById("signupAvatarId")?.value;

    container.innerHTML = avatars
      .map((av) => {
        const isSelected = selectedAvatarId === av.id;
        const label = av.label || `illustrated avatar ${av.id}`;
        return `
          <button type="button" class="avatar-card ${isSelected ? "selected" : ""}" aria-label="Select ${label}" aria-pressed="${isSelected}" onclick="App.pickDefaultAvatar('${av.id}')">
            ${av.svg}
          </button>
        `;
      })
      .join("");
  },

  pickDefaultAvatar(avatarId) {
    this.currentUser.avatarId = avatarId;
    this.currentUser.avatarCustom = null;
    const signupAvatarId = document.getElementById("signupAvatarId");
    if (signupAvatarId) signupAvatarId.value = avatarId;
    this.saveUserSession();
    this.renderAvatarOptions();
    this.updateUserBadge();
  },

  openAccountProfile() {
    document.getElementById("profileName").textContent = this.currentUser.name;
    document.getElementById("profileEmail").textContent = this.currentUser.email;
    document.getElementById("profileCountry").textContent = this.currentUser.country || "Not provided";
    document.getElementById("profileGender").textContent = this.currentUser.gender || "Not provided";
    document.getElementById("profileOccupation").textContent = this.currentUser.occupation || "Not provided";
    document.getElementById("profileAvatarPreview").innerHTML = this.getAvatarHtml(84);
    document.getElementById("profileAvatarId").value = this.currentUser.avatarId || "";
    this.pendingProfileAvatarData = null;
    const upload = document.getElementById("profileAvatarUpload");
    if (upload) upload.value = "";
    this.renderProfileAvatarOptions();
  },

  renderProfileAvatarOptions() {
    const container = document.getElementById("profileAvatarOptionsGrid");
    if (!container || !PLASTISENSE_DATA.defaultAvatars) return;
    const avatars = [...(this.currentUser.gender === "male"
      ? PLASTISENSE_DATA.defaultAvatars.male
      : this.currentUser.gender === "female"
        ? PLASTISENSE_DATA.defaultAvatars.female
        : [...PLASTISENSE_DATA.defaultAvatars.male, ...PLASTISENSE_DATA.defaultAvatars.female]),
    PLASTISENSE_DATA.defaultAvatars.provided];
    const selectedAvatarId = document.getElementById("profileAvatarId").value;
    container.innerHTML = avatars.map((avatar) => {
      const label = avatar.label || `illustrated avatar ${avatar.id}`;
      return `
      <button type="button" class="avatar-card ${selectedAvatarId === avatar.id && !this.pendingProfileAvatarData ? "selected" : ""}"
        aria-label="Select ${label}" aria-pressed="${selectedAvatarId === avatar.id && !this.pendingProfileAvatarData}"
        onclick="App.pickProfileAvatar('${avatar.id}')">${avatar.svg}</button>
    `;
    }).join("");
  },

  pickProfileAvatar(avatarId) {
    this.pendingProfileAvatarData = null;
    document.getElementById("profileAvatarId").value = avatarId;
    document.getElementById("profileAvatarUpload").value = "";
    const avatars = [
      ...PLASTISENSE_DATA.defaultAvatars.male,
      ...PLASTISENSE_DATA.defaultAvatars.female,
      PLASTISENSE_DATA.defaultAvatars.provided
    ];
    const selected = avatars.find((avatar) => avatar.id === avatarId);
    if (selected) {
      document.getElementById("profileAvatarPreview").innerHTML =
        `<div style="width:84px;height:84px;border-radius:50%;overflow:hidden;">${selected.svg}</div>`;
    }
    this.renderProfileAvatarOptions();
  },

  async handleProfileAvatarSave() {
    const avatarId = document.getElementById("profileAvatarId").value;
    if (!this.pendingProfileAvatarData && !avatarId) {
      this.authMessage("Choose an illustrated avatar or upload a profile image.");
      return;
    }
    this.authMessage("");
    try {
      const body = this.pendingProfileAvatarData
        ? { imageData: this.pendingProfileAvatarData }
        : { avatarId };
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("The profile service returned an invalid response. Please try again.");
      }
      if (!response.ok) throw new Error(data.error || "Could not save the profile avatar.");
      this.currentUser = Object.assign({}, this.currentUser, data.user, { avatarCustom: null });
      this.pendingProfileAvatarData = null;
      this.saveUserSession();
      this.updateUserBadge();
      this.openAccountProfile();
      this.authMessage("Profile avatar saved.", false);
    } catch (error) {
      this.authMessage(error instanceof TypeError
        ? "Cannot reach the profile service. Check your connection and try again."
        : error.message || "Could not save the profile avatar.");
    }
  },

  openProfileModal() {
    const modal = document.getElementById("userProfileModal");
    if (!modal) return;

    document.getElementById("profileModalName").textContent = this.currentUser.name;
    document.getElementById("profileModalEmail").textContent = this.currentUser.email;
    document.getElementById("profileModalOrg").textContent = this.currentUser.collegeOrg;
    document.getElementById("profileModalRole").textContent = this.currentUser.role;
    document.getElementById("profileModalGender").textContent = this.currentUser.gender.toUpperCase();

    const nameInput = document.getElementById("profileModalNameInput");
    const orgInput = document.getElementById("profileModalOrgInput");
    if (nameInput) nameInput.value = this.currentUser.name;
    if (orgInput) orgInput.value = this.currentUser.collegeOrg;

    // Display avatar in profile modal
    const avatarContainer = document.getElementById("profileModalAvatarBig");
    if (avatarContainer) {
      avatarContainer.innerHTML = this.getAvatarHtml(84);
    }

    modal.classList.add("open");
  },

  getAvatarHtml(size = 32) {
    if (this.currentUser.avatarImage) {
      return `<img src="/api/profile/avatar" alt="Profile avatar" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;">`;
    }
    if (this.currentUser.avatarCustom) {
      return `<img src="${this.currentUser.avatarCustom}" alt="Avatar" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;">`;
    }
    if (this.currentUser.avatarId === "provided_profile_avatar") {
      return `<img src="/assets/images/provided-profile-avatar.png" alt="Selected profile avatar" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;">`;
    }

    if (PLASTISENSE_DATA.defaultAvatars) {
      const avs = [...PLASTISENSE_DATA.defaultAvatars.male, ...PLASTISENSE_DATA.defaultAvatars.female];
      const match = avs.find((a) => a.id === this.currentUser.avatarId);
      if (match) {
      return `<div style="width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;">${match.svg}</div>`;
      }
    }

    return `<div class="user-avatar-sm" style="width:${size}px;height:${size}px;">${this.currentUser.name.charAt(0)}</div>`;
  },

  updateUserBadge() {
    const elName = document.getElementById("currentUserName");
    const elRole = document.getElementById("currentUserRole");
    const elAvatar = document.getElementById("currentUserAvatar");
    const drawerAvatar = document.getElementById("drawerUserAvatar");
    const drawerName = document.getElementById("drawerUserName");
    const drawerRole = document.getElementById("drawerUserRole");

    if (elName) elName.textContent = this.currentUser.name;
    if (elRole) elRole.textContent = this.currentUser.role;
    if (drawerName) drawerName.textContent = this.currentUser.name;
    if (drawerRole) drawerRole.textContent = this.currentUser.role;

    const avatarHtml = this.getAvatarHtml(30);
    if (elAvatar) elAvatar.innerHTML = avatarHtml;
    if (drawerAvatar) drawerAvatar.innerHTML = this.getAvatarHtml(42);
  },

  bindNotifications() {
    const btnBell = document.getElementById("btnNotifications");
    const modalNotifs = document.getElementById("notificationsModal");
    const btnMarkAll = document.getElementById("btnMarkAllNotifs");

    if (btnBell && modalNotifs) {
      btnBell.addEventListener("click", () => {
        modalNotifs.classList.add("open");
      });
    }

    if (btnMarkAll) {
      btnMarkAll.addEventListener("click", () => {
        PLASTISENSE_DATA.notifications.forEach((n) => (n.read = true));
        this.renderNotificationsList();
      });
    }
  },

  renderNotificationsList() {
    const container = document.getElementById("notificationsModalList");
    const countBadge = document.getElementById("notifBadgeCount");
    if (!container) return;

    const unread = PLASTISENSE_DATA.notifications.filter((n) => !n.read).length;
    if (countBadge) {
      countBadge.textContent = unread;
      countBadge.style.display = unread > 0 ? "flex" : "none";
    }

    container.innerHTML = PLASTISENSE_DATA.notifications
      .map((n) => {
        const translations = {
          "NOTIF-101": ["notif_critical_title", "notif_critical_message", "notif_critical_action", "notif_time_10m"],
          "NOTIF-102": ["notif_warning_title", "notif_warning_message", "notif_warning_action", "notif_time_1h"],
          "NOTIF-103": ["notif_success_title", "notif_success_message", "notif_success_action", "notif_time_3h"],
          "NOTIF-104": ["notif_info_title", "notif_info_message", "notif_info_action", "notif_time_5h"]
        }[n.id];
        const title = translations && window.I18N ? I18N.t(translations[0]) : n.title;
        const message = translations && window.I18N ? I18N.t(translations[1]) : n.message;
        const action = translations && window.I18N ? I18N.t(translations[2]) : n.recommendedAction;
        const timestamp = translations && window.I18N ? I18N.t(translations[3]) : n.timestamp;
        return `
          <div style="padding:12px;margin-bottom:10px;border-radius:10px;background:rgba(12,32,54,0.85);border:1px solid rgba(0,242,254,0.18);">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <strong style="font-size:13px;color:#fff;">${title}</strong>
              <span style="font-size:11px;color:#94a3b8;">${timestamp}</span>
            </div>
            <p style="font-size:12px;color:#cbd5e1;margin-bottom:6px;">${message}</p>
            <div style="font-size:11px;color:var(--teal-glow);font-weight:600;"><span data-i18n="ui_action_label">${I18N.t("ui_action_label")}</span>: <span>${action}</span></div>
          </div>
        `;
      })
      .join("");
  },

  pushNotification(notif) {
    PLASTISENSE_DATA.notifications.unshift(notif);
    this.renderNotificationsList();
  },

  bindDemoToggle() {
    const pill = document.getElementById("demoModeBadge");
    if (pill) {
      pill.classList.remove("clickable");
      pill.setAttribute("aria-label", "Demo data; no live environmental feeds are configured");
      pill.setAttribute("title", "Demo estimates only — no live environmental feeds are configured");
    }
  },

  addAuditLog(actionText) {
    const newLog = {
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      user: `${this.currentUser.name} (${this.currentUser.role})`,
      action: actionText,
      ip: "103.21.124.89 (Local Session)",
      status: "Authorized"
    };
    PLASTISENSE_DATA.auditLogs.unshift(newLog);
    this.renderAuditLogs();
  },

  renderAuditLogs() {
    const tbody = document.getElementById("auditLogTableBody");
    if (!tbody) return;

    tbody.innerHTML = PLASTISENSE_DATA.auditLogs
      .map((log) => {
        return `
          <tr>
            <td class="font-mono" style="font-size:11px;color:#94a3b8;">${log.timestamp}</td>
            <td><strong>${log.user}</strong></td>
            <td>${log.action}</td>
            <td class="font-mono" style="font-size:11px;">${log.ip}</td>
            <td><span class="risk-tag low">${log.status}</span></td>
          </tr>
        `;
      })
      .join("");
  },

  initBeforeAfterComparison() {
    const btnToggle = document.getElementById("btnToggleBeforeAfter");
    const imgBefore = document.getElementById("cleanupBeforeImg");
    const imgAfter = document.getElementById("cleanupAfterImg");

    if (btnToggle && imgBefore && imgAfter) {
      let isShowingAfter = false;
      btnToggle.addEventListener("click", () => {
        isShowingAfter = !isShowingAfter;
        if (isShowingAfter) {
          imgBefore.style.display = "none";
          imgAfter.style.display = "block";
          btnToggle.textContent = "View Before Cleanup State";
          const badge = document.getElementById("reductionMetricBadge");
          if (badge) badge.textContent = "96.4% Plastic Removed (Restored)";
        } else {
          imgBefore.style.display = "block";
          imgAfter.style.display = "none";
          btnToggle.textContent = "View After Cleanup (AI Verified)";
          const badge = document.getElementById("reductionMetricBadge");
          if (badge) badge.textContent = "Baseline Pollution (High Influx)";
        }
      });
    }
  }
};

window.App = App;

// Bootstrap on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
