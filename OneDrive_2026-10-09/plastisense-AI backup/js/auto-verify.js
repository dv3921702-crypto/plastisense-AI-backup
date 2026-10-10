/**
 * PlastiSense AI - Auto Verification Module
 * Multi-step AI verification for environmental reports/images
 */

const AutoVerifyModule = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    const verifyBtn = document.getElementById('btnRunAutoVerify');
    if (verifyBtn) {
      verifyBtn.addEventListener('click', () => this.runVerification());
    }

    // File input for verification
    const fileInput = document.getElementById('verifyFileInput');
    const dropzone = document.getElementById('verifyDropzone');
    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());
      dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
          fileInput.files = e.dataTransfer.files;
          this.showPreview(e.dataTransfer.files[0]);
        }
      });
      fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) this.showPreview(e.target.files[0]);
      });
    }
  },

  showPreview(file) {
    const preview = document.getElementById('verifyPreview');
    if (!preview) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = document.createElement('img');
      image.alt = 'Report Image';
      image.src = e.target.result;
      image.style.cssText = 'width:100%;max-height:240px;object-fit:cover;border-radius:var(--radius-sm);';
      preview.replaceChildren(image);
    };
    reader.onerror = () => { preview.textContent = 'Unable to preview the selected image.'; };
    reader.readAsDataURL(file);
  },

  async runVerification() {
    const container = document.getElementById('verifyResults');
    if (!container) return;
    const file = document.getElementById('verifyFileInput')?.files?.[0];
    if (!file) {
      container.textContent = 'Select a report image before verification.';
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size === 0 || file.size > 10 * 1024 * 1024) {
      container.textContent = 'Choose a JPEG, PNG, or WebP image up to 10 MB.';
      return;
    }
    container.textContent = 'Submitting this image to the configured verification service…';
    try {
      const image = await this.readAsDataUrl(file);
      const imageProperties = await this.getImageProperties(image);
      const resp = await fetch('/api/auto-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image,
          perceptualHash: imageProperties.perceptualHash,
          dimensions: { width: imageProperties.width, height: imageProperties.height },
          location: document.getElementById('verifyLocationInput')?.value.trim() || ''
        })
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Verification failed.');
      this.renderResults(data, container);
    } catch (error) {
      container.textContent = error.message || 'Verification is temporarily unavailable. Please try again.';
    }
  },

  readAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Unable to read the selected image.'));
      reader.readAsDataURL(file);
    });
  },

  getImageProperties(dataUrl) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        if (!image.naturalWidth || !image.naturalHeight) {
          reject(new Error('The selected file is not a decodable image.'));
          return;
        }
        const canvas = document.createElement('canvas');
        canvas.width = 9;
        canvas.height = 8;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        if (!context) {
          reject(new Error('Unable to inspect image similarity in this browser.'));
          return;
        }
        context.drawImage(image, 0, 0, 9, 8);
        const pixels = context.getImageData(0, 0, 9, 8).data;
        let hash = 0n;
        for (let y = 0; y < 8; y++) {
          for (let x = 0; x < 8; x++) {
            const leftOffset = (y * 9 + x) * 4;
            const rightOffset = leftOffset + 4;
            const left = pixels[leftOffset] * 0.299 + pixels[leftOffset + 1] * 0.587 + pixels[leftOffset + 2] * 0.114;
            const right = pixels[rightOffset] * 0.299 + pixels[rightOffset + 1] * 0.587 + pixels[rightOffset + 2] * 0.114;
            hash = (hash << 1n) | BigInt(left > right ? 1 : 0);
          }
        }
        resolve({
          width: image.naturalWidth,
          height: image.naturalHeight,
          perceptualHash: hash.toString(16).padStart(16, '0')
        });
      };
      image.onerror = () => reject(new Error('The selected file is not a decodable image.'));
      image.src = dataUrl;
    });
  },

  renderResults(data, container) {
    container.innerHTML = '';
    (Array.isArray(data.steps) ? data.steps : []).forEach((step, i) => {
      const statusClass = step.status === 'PASS' ? 'pass' : ['WARN', 'NOT CHECKED', 'DUPLICATE'].includes(step.status) ? 'warn' : 'fail';
      const stepEl = document.createElement('div');
      stepEl.className = `verify-step ${statusClass}`;
      const name = document.createElement('div');
      name.className = 'verify-step-name';
      name.textContent = `Step ${i + 1}: ${step.name}`;
      const detail = document.createElement('div');
      detail.className = 'verify-step-status';
      detail.textContent = step.detail;
      const score = document.createElement('span');
      score.className = `verify-score-badge ${statusClass}`;
      score.textContent = Number.isFinite(step.score) ? `${step.score}%` : 'Not scored';
      stepEl.append(name, detail, score);
      container.appendChild(stepEl);
    });

    // Add overall result card
    const statusColorMap = {
      'AI VERIFIED': 'var(--emerald-glow)',
      'NEEDS HUMAN REVIEW': 'var(--risk-medium)',
      'DUPLICATE': 'var(--risk-high)',
      'INSUFFICIENT EVIDENCE': 'var(--risk-high)',
      'REJECTED': 'var(--risk-critical)'
    };

    const resultCard = document.createElement('div');
    resultCard.className = 'glass-card verify-result-card';
    const overallScore = Number.isFinite(data.overallScore) ? `${data.overallScore}%` : 'Not generated';
    const reviewReasons = Array.isArray(data.reviewReasons) && data.reviewReasons.length
      ? `<div class="forecast-disclaimer" style="margin-top:.75rem;"><strong>Review reasons</strong><ul>${data.reviewReasons.map(reason => `<li>${this.escapeHtml(reason)}</li>`).join('')}</ul></div>`
      : '';
    resultCard.innerHTML = `
      <div class="verify-overall-score">
        <div class="verify-score-circle" style="border-color:${statusColorMap[data.aiStatus] || 'var(--text-muted)'};">
          <span class="verify-score-num">${overallScore}</span>
        </div>
        <div>
          <h4 style="color:var(--text-main);margin-bottom:0.25rem;">${data.overallScore === null ? 'Verification Score' : 'Model-assisted Verification Score'}</h4>
          <span class="risk-tag" style="background:${statusColorMap[data.aiStatus] || 'var(--text-muted)'};color:#000;font-weight:700;">${this.escapeHtml(data.aiStatus || 'NEEDS HUMAN REVIEW')}</span>
        </div>
      </div>

      <div class="verify-status-grid">
        <div class="verify-status-item">
          <span class="verify-status-label">AI Verification</span>
          <span class="verify-status-value" style="color:${statusColorMap[data.aiStatus] || 'var(--text-muted)'};">${this.escapeHtml(data.aiStatus || 'NEEDS HUMAN REVIEW')}</span>
        </div>
        <div class="verify-status-item">
          <span class="verify-status-label">Human Verification</span>
          <span class="verify-status-value" style="color:var(--risk-medium);">${this.escapeHtml(data.humanStatus || 'PENDING')}</span>
        </div>
        <div class="verify-status-item">
          <span class="verify-status-label">Final Status</span>
          <span class="verify-status-value" style="color:var(--text-accent);">${this.escapeHtml(data.finalStatus || 'PENDING HUMAN REVIEW')}</span>
        </div>
      </div>

      ${data.scoreMethod ? `<p class="section-subheading" style="margin-top:.75rem;">${this.escapeHtml(data.scoreMethod)}</p>` : ''}
      ${reviewReasons}
      <div class="forecast-disclaimer" style="margin-top:0.75rem;">
        ⚠️ ${this.escapeHtml(data.disclaimer || 'AI verification is not legal or official approval. Human verification remains separate.')}
      </div>
    `;
    container.appendChild(resultCard);

    if (window.HistoryModule) {
      HistoryModule.addItem('ANALYSIS', 'Auto Verification', `${data.overallScore === null ? 'No score' : `Score: ${data.overallScore}%`} — Status: ${data.aiStatus}`);
    }
  },

  escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
  },
};

window.AutoVerifyModule = AutoVerifyModule;
