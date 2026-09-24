// Manages the Survey Preview Modal, Question Card Rendering, and Live Validation
import { getSurveys, getSurveyById } from './storage.js';
import { escapeHtml, TYPE_LABELS, getMetaHtml, setupDialogClose } from './utils.js';

// DOM Elements
const surveyPreviewDialog = document.getElementById('surveyPreviewDialog');
const previewSurveyTitle = document.getElementById('previewSurveyTitle');
const previewSurveyDesc = document.getElementById('previewSurveyDesc');
const previewQuestionsList = document.getElementById('previewQuestionsList');
const previewMetaPills = document.getElementById('previewMetaPills');
const previewValidationBanner = document.getElementById('previewValidationBanner');

const previewPortraitBtn = document.getElementById('previewPortraitBtn');
const previewLandscapeBtn = document.getElementById('previewLandscapeBtn');
const previewValidateBtn = document.getElementById('previewValidateBtn');
const previewResetBtn = document.getElementById('previewResetBtn');

let activeSurveyId = null;

if (surveyPreviewDialog) {
  setupDialogClose(surveyPreviewDialog);
}

// ─── Orientation Toggle (Portrait / Landscape) ─────────────────────────────────
export function setPreviewOrientation(mode) {
  if (!surveyPreviewDialog) return;
  if (mode === 'landscape') {
    surveyPreviewDialog.classList.remove('preview-mode-portrait');
    surveyPreviewDialog.classList.add('preview-mode-landscape');
    previewLandscapeBtn?.classList.add('active');
    previewPortraitBtn?.classList.remove('active');
  } else {
    surveyPreviewDialog.classList.remove('preview-mode-landscape');
    surveyPreviewDialog.classList.add('preview-mode-portrait');
    previewPortraitBtn?.classList.add('active');
    previewLandscapeBtn?.classList.remove('active');
  }
}

if (previewPortraitBtn) previewPortraitBtn.addEventListener('click', () => setPreviewOrientation('portrait'));
if (previewLandscapeBtn) previewLandscapeBtn.addEventListener('click', () => setPreviewOrientation('landscape'));

// ─── Question Item HTML Builder ───────────────────────────────────────────────
export function buildInteractiveQuestionItem(q, idx) {
  let inputHtml = '';
  const inputName = `preview_q_${q.id}`;
  const isRequired = Boolean(q.required);

  switch (q.type) {
    case 'textarea': {
      inputHtml = `
        <textarea
          class="preview-input"
          name="${inputName}"
          rows="3"
          placeholder="Type your response here..."
          data-qtype="textarea"
          ${isRequired ? 'data-required="true"' : ''}
        ></textarea>
      `;
      break;
    }

    case 'email': {
      inputHtml = `
        <input
          type="email"
          class="preview-input"
          name="${inputName}"
          placeholder="e.g. name@example.com"
          data-qtype="email"
          ${isRequired ? 'data-required="true"' : ''}
        />
      `;
      break;
    }

    case 'number': {
      inputHtml = `
        <input
          type="number"
          class="preview-input"
          name="${inputName}"
          placeholder="e.g. 42"
          data-qtype="number"
          ${isRequired ? 'data-required="true"' : ''}
        />
      `;
      break;
    }

    case 'date': {
      inputHtml = `
        <input
          type="date"
          class="preview-input"
          name="${inputName}"
          data-qtype="date"
          ${isRequired ? 'data-required="true"' : ''}
        />
      `;
      break;
    }

    case 'select': {
      const opts = q.options && q.options.length ? q.options : ['Option 1', 'Option 2'];
      inputHtml = `
        <select
          class="preview-input"
          name="${inputName}"
          data-qtype="select"
          ${isRequired ? 'data-required="true"' : ''}
        >
          <option value="">-- Select an option --</option>
          ${opts.map((opt) => `<option value="${escapeHtml(opt)}">${escapeHtml(opt)}</option>`).join('')}
        </select>
      `;
      break;
    }

    case 'radio': {
      const opts = q.options && q.options.length ? q.options : ['Option 1', 'Option 2'];
      inputHtml = `
        <div class="preview-choice-list" data-qtype="radio" ${isRequired ? 'data-required="true"' : ''}>
          ${opts.map((opt) => `
            <label class="preview-choice-label">
              <input type="radio" name="${inputName}" value="${escapeHtml(opt)}" />
              <span>${escapeHtml(opt)}</span>
            </label>
          `).join('')}
        </div>
      `;
      break;
    }

    case 'checkbox': {
      const opts = q.options && q.options.length ? q.options : ['Option 1', 'Option 2'];
      inputHtml = `
        <div class="preview-choice-list" data-qtype="checkbox" ${isRequired ? 'data-required="true"' : ''}>
          ${opts.map((opt) => `
            <label class="preview-choice-label">
              <input type="checkbox" name="${inputName}" value="${escapeHtml(opt)}" />
              <span>${escapeHtml(opt)}</span>
            </label>
          `).join('')}
        </div>
      `;
      break;
    }

    case 'rating': {
      inputHtml = `
        <div class="preview-interactive-scale" data-qtype="rating" ${isRequired ? 'data-required="true"' : ''}>
          <input type="hidden" name="${inputName}" value="" />
          ${[1, 2, 3, 4, 5].map((n) => `
            <button type="button" class="preview-scale-btn" data-val="${n}">★ ${n}</button>
          `).join('')}
        </div>
        <div class="preview-readonly-minmax" style="margin-top: 5px;">
          <span>1 - Lowest</span>
          <span>5 - Highest</span>
        </div>
      `;
      break;
    }

    case 'scale': {
      inputHtml = `
        <div class="preview-interactive-scale" data-qtype="scale" ${isRequired ? 'data-required="true"' : ''}>
          <input type="hidden" name="${inputName}" value="" />
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `
            <button type="button" class="preview-scale-btn" data-val="${n}">${n}</button>
          `).join('')}
        </div>
        <div class="preview-readonly-minmax" style="margin-top: 5px;">
          <span>1 - Not at all likely</span>
          <span>10 - Extremely likely</span>
        </div>
      `;
      break;
    }

    case 'range': {
      const min = q.rangeMin ?? 0;
      const max = q.rangeMax ?? 100;
      const step = q.rangeStep ?? 1;
      const mid = Math.round((min + max) / 2);
      inputHtml = `
        <div class="preview-range-wrap">
          <div class="preview-range-display">
            <span style="font-size: 12px; color: var(--text-muted);">Adjust value:</span>
            <span class="preview-range-badge-val" id="val_${inputName}">${mid}</span>
          </div>
          <input
            type="range"
            class="preview-range-slider"
            name="${inputName}"
            min="${min}"
            max="${max}"
            step="${step}"
            value="${mid}"
            data-qtype="range"
            oninput="document.getElementById('val_${inputName}').textContent = this.value"
          />
          <div class="preview-range-minmax">
            <span>Min: ${min}</span>
            <span>Step: ${step}</span>
            <span>Max: ${max}</span>
          </div>
        </div>
      `;
      break;
    }

    case 'boolean': {
      inputHtml = `
        <div class="preview-boolean-group" data-qtype="boolean" ${isRequired ? 'data-required="true"' : ''}>
          <input type="hidden" name="${inputName}" value="" />
          <button type="button" class="preview-boolean-btn" data-val="yes">👍 Yes</button>
          <button type="button" class="preview-boolean-btn" data-val="no">👎 No</button>
        </div>
      `;
      break;
    }

    case 'file': {
      inputHtml = `
        <input
          type="file"
          class="preview-input"
          name="${inputName}"
          data-qtype="file"
          ${isRequired ? 'data-required="true"' : ''}
        />
        <span style="display: block; font-size: 11px; color: var(--text-light); margin-top: 4px;">
          Accepts documents, spreadsheets, images, PDFs.
        </span>
      `;
      break;
    }

    default: {
      inputHtml = `
        <input
          type="text"
          class="preview-input"
          name="${inputName}"
          placeholder="Type your answer here..."
          data-qtype="text"
          ${isRequired ? 'data-required="true"' : ''}
        />
      `;
      break;
    }
  }

  return `
    <div class="preview-readonly-card" data-card-qid="${q.id}" data-type="${q.type}" data-required="${isRequired ? 'true' : 'false'}">
      <div class="preview-readonly-qheader">
        <span class="preview-readonly-num">Q${idx + 1}</span>
        <div class="preview-readonly-qtitle">
          ${escapeHtml(q.text)}
          ${isRequired ? '<span class="preview-required-star" title="Required field">*</span>' : ''}
        </div>
        <span class="type-badge" style="margin: 0; align-self: flex-start;">${TYPE_LABELS[q.type] || escapeHtml(q.type)}</span>
      </div>
      <div class="preview-readonly-body">
        ${inputHtml}
        <div class="error-container"></div>
      </div>
    </div>
  `;
}

// ─── Single Question Validation ────────────────────────────────────────────────
export function validateQuestionCard(card) {
  const qType = card.dataset.type;
  const isRequired = card.dataset.required === 'true';
  const errorContainer = card.querySelector('.error-container');
  let errorMessage = '';
  let controlToHighlight = null;

  if (qType === 'text' || qType === 'textarea' || qType === 'email' || qType === 'number' || qType === 'date' || qType === 'select') {
    const input = card.querySelector('.preview-input');
    controlToHighlight = input;
    const val = input ? input.value.trim() : '';

    if (isRequired && !val) {
      errorMessage = 'This field is required.';
    } else if (val && qType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        errorMessage = 'Please enter a valid email address (e.g. name@example.com).';
      }
    } else if (val && qType === 'number') {
      if (isNaN(Number(val))) {
        errorMessage = 'Please enter a valid number.';
      }
    }
  } else if (qType === 'radio') {
    const choiceList = card.querySelector('.preview-choice-list');
    controlToHighlight = choiceList;
    const checked = card.querySelector('input[type="radio"]:checked');
    if (isRequired && !checked) {
      errorMessage = 'Please select an option.';
    }
  } else if (qType === 'checkbox') {
    const choiceList = card.querySelector('.preview-choice-list');
    controlToHighlight = choiceList;
    const checked = card.querySelectorAll('input[type="checkbox"]:checked');
    if (isRequired && checked.length === 0) {
      errorMessage = 'Please select at least one option.';
    }
  } else if (qType === 'rating' || qType === 'scale') {
    const scaleGroup = card.querySelector('.preview-interactive-scale');
    controlToHighlight = scaleGroup;
    const hidden = card.querySelector('input[type="hidden"]');
    if (isRequired && (!hidden || !hidden.value)) {
      errorMessage = qType === 'rating' ? 'Please select a rating (1-5).' : 'Please select a score on the scale (1-10).';
    }
  } else if (qType === 'boolean') {
    const boolGroup = card.querySelector('.preview-boolean-group');
    controlToHighlight = boolGroup;
    const hidden = card.querySelector('input[type="hidden"]');
    if (isRequired && (!hidden || !hidden.value)) {
      errorMessage = 'Please select Yes or No.';
    }
  } else if (qType === 'file') {
    const fileInput = card.querySelector('input[type="file"]');
    controlToHighlight = fileInput;
    if (isRequired && (!fileInput || fileInput.files.length === 0)) {
      errorMessage = 'Please choose a file to upload.';
    }
  }

  // Visual error presentation
  if (errorMessage) {
    card.classList.add('has-error');
    if (controlToHighlight) {
      controlToHighlight.classList.add('is-invalid');
    }
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="preview-validation-error" role="alert">
          <span class="alert-icon">⚠️</span>
          <span>${escapeHtml(errorMessage)}</span>
        </div>
      `;
    }
    return false;
  } else {
    card.classList.remove('has-error');
    if (controlToHighlight) {
      controlToHighlight.classList.remove('is-invalid');
    }
    if (errorContainer) {
      errorContainer.innerHTML = '';
    }
    return true;
  }
}

// ─── Render Preview Modal Content ─────────────────────────────────────────────
export function renderPreviewContent(surveyId) {
  activeSurveyId = surveyId;
  const survey = getSurveyById(surveyId);
  if (!survey) return;

  if (previewSurveyTitle) previewSurveyTitle.textContent = survey.title;
  if (previewSurveyDesc) previewSurveyDesc.textContent = survey.description || 'Survey structure preview (interactive test view).';

  if (previewMetaPills) {
    previewMetaPills.innerHTML = getMetaHtml(survey);
  }

  // Clear any existing validation banner on render
  if (previewValidationBanner) {
    previewValidationBanner.style.display = 'none';
  }

  const questions = survey.questions || [];
  if (previewQuestionsList) {
    previewQuestionsList.innerHTML = '';

    if (questions.length === 0) {
      previewQuestionsList.innerHTML = `
        <div class="preview-empty-state">
          <span class="empty-icon">📝</span>
          <h3 style="font-size: 15px; margin-bottom: 4px; color: var(--text-main);">No questions in this survey</h3>
          <p>Click <strong>+ Add Question</strong> to define questions, then preview them here.</p>
        </div>
      `;
    } else {
      questions.forEach((q, idx) => {
        previewQuestionsList.insertAdjacentHTML('beforeend', buildInteractiveQuestionItem(q, idx));
      });
    }
  }
}

export function isSurveyPreviewOpen() {
  return Boolean(surveyPreviewDialog && surveyPreviewDialog.open);
}

export function openSurveyPreviewModal(surveyId) {
  renderPreviewContent(surveyId);
  surveyPreviewDialog?.showModal();
}

// ─── Live Validation & Interactive Controls Delegation ─────────────────────────
if (previewQuestionsList) {
  previewQuestionsList.addEventListener('input', (e) => {
    const card = e.target.closest('.preview-readonly-card');
    if (card) validateQuestionCard(card);
  });

  previewQuestionsList.addEventListener('change', (e) => {
    const card = e.target.closest('.preview-readonly-card');
    if (card) validateQuestionCard(card);
  });

  previewQuestionsList.addEventListener('blur', (e) => {
    const card = e.target.closest('.preview-readonly-card');
    if (card) validateQuestionCard(card);
  }, true);

  previewQuestionsList.addEventListener('click', (e) => {
    const scaleBtn = e.target.closest('.preview-scale-btn');
    if (scaleBtn) {
      const group = scaleBtn.closest('.preview-interactive-scale');
      const card = scaleBtn.closest('.preview-readonly-card');
      if (group && card) {
        const hidden = group.querySelector('input[type="hidden"]');
        const val = scaleBtn.dataset.val;

        if (scaleBtn.classList.contains('selected')) {
          scaleBtn.classList.remove('selected');
          if (hidden) hidden.value = '';
        } else {
          group.querySelectorAll('.preview-scale-btn').forEach((b) => b.classList.remove('selected'));
          scaleBtn.classList.add('selected');
          if (hidden) hidden.value = val;
        }
        validateQuestionCard(card);
      }
      return;
    }

    const boolBtn = e.target.closest('.preview-boolean-btn');
    if (boolBtn) {
      const group = boolBtn.closest('.preview-boolean-group');
      const card = boolBtn.closest('.preview-readonly-card');
      if (group && card) {
        const hidden = group.querySelector('input[type="hidden"]');
        const val = boolBtn.dataset.val;

        if (boolBtn.classList.contains('selected')) {
          boolBtn.classList.remove('selected');
          if (hidden) hidden.value = '';
        } else {
          group.querySelectorAll('.preview-boolean-btn').forEach((b) => b.classList.remove('selected'));
          boolBtn.classList.add('selected');
          if (hidden) hidden.value = val;
        }
        validateQuestionCard(card);
      }
      return;
    }
  });
}

// ─── Test Validate & Reset Buttons ─────────────────────────────────────────────
if (previewValidateBtn) {
  previewValidateBtn.addEventListener('click', () => {
    const cards = previewQuestionsList?.querySelectorAll('.preview-readonly-card') || [];
    let hasError = false;
    let firstErrorCard = null;

    cards.forEach((card) => {
      const isValid = validateQuestionCard(card);
      if (!isValid && !hasError) {
        hasError = true;
        firstErrorCard = card;
      }
    });

    if (previewValidationBanner) {
      previewValidationBanner.style.display = 'flex';
      if (hasError) {
        previewValidationBanner.className = 'preview-validation-banner banner-error';
        previewValidationBanner.innerHTML = '<span class="alert-icon">⚠️</span> <span>Validation failed! Please complete required fields or correct invalid entries with red borders.</span>';
        if (firstErrorCard) {
          firstErrorCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        previewValidationBanner.className = 'preview-validation-banner banner-success';
        previewValidationBanner.innerHTML = '<span>✓</span> <span>All fields are valid! The survey data passes all validation rules.</span>';
      }
    }
  });
}

if (previewResetBtn) {
  previewResetBtn.addEventListener('click', () => {
    if (activeSurveyId) {
      renderPreviewContent(activeSurveyId);
    }
    if (previewValidationBanner) {
      previewValidationBanner.style.display = 'none';
    }
  });
}
