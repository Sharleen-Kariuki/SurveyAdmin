import { getSurveyById, saveQuestion, deleteQuestion } from './storage.js';

// Read ?id= from URL
const params = new URLSearchParams(window.location.search);
const surveyId = params.get('id');

// Redirect back if no ID is present
if (!surveyId) {
  window.location.href = 'index.html';
}

// ─── Utility: HTML Escape ──────────────────────────────────────────────────────
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── DOM Elements ──────────────────────────────────────────────────────────────
const surveyHeading = document.getElementById('surveyTitleHeading');
const surveyDesc = document.getElementById('surveyDescriptionText');
const tableBody = document.getElementById('questionsTableBody');

const openCreateBtn = document.getElementById('createQuestionBtn');
const questionDialog = document.getElementById('questionFormDialog');
const questionForm = document.getElementById('questionForm');
const dialogTitle = document.getElementById('questionDialogTitle');
const questionIdInput = document.getElementById('questionId');
const questionTextInput = document.getElementById('questionText');
const questionTypeInput = document.getElementById('questionType');
const questionRequiredInput = document.getElementById('questionRequired');

const deleteDialog = document.getElementById('deleteQuestionDialog');
const confirmDeleteBtn = document.getElementById('confirmDeleteQuestionBtn');
let activeDeleteQuestionId = null;

const typeSelect = document.getElementById('questionType');
const optionsGroup = document.getElementById('optionsGroup');
const optionsHidden = document.getElementById('questionOptions');
const optionTagInput = document.getElementById('optionTagInput');
const optionTagsList = document.getElementById('optionTagsList');
const optionTagsContainer = document.getElementById('optionTagsContainer');

const rangeGroup = document.getElementById('rangeGroup');
const rangeMinInput = document.getElementById('rangeMin');
const rangeMaxInput = document.getElementById('rangeMax');
const rangeStepInput = document.getElementById('rangeStep');
const rangePreview = document.getElementById('rangePreview');
const rangePreviewVal = document.getElementById('rangePreviewValue');
const rangePreviewMin = document.getElementById('rangePreviewMin');
const rangePreviewMax = document.getElementById('rangePreviewMax');

// Pagination Elements
const ROWS_PER_PAGE = 5;
let currentPage = 1;

const firstBtn = document.getElementById('firstPageBtn');
const prevBtn = document.getElementById('prevPageBtn');
const nextBtn = document.getElementById('nextPageBtn');
const lastBtn = document.getElementById('lastPageBtn');
const paginationInfo = document.getElementById('paginationInfo');
const currentPageBadge = document.getElementById('currentPageBadge');

// Preview Modal Elements (Read-Only)
const previewSurveyBtn = document.getElementById('previewSurveyBtn');
const surveyPreviewDialog = document.getElementById('surveyPreviewDialog');
const previewSurveyTitle = document.getElementById('previewSurveyTitle');
const previewSurveyDesc = document.getElementById('previewSurveyDesc');
const previewQuestionsList = document.getElementById('previewQuestionsList');

// ─── Tag-Pill Choice Manager ───────────────────────────────────────────────────
let currentTags = [];

function renderTags() {
  optionTagsList.innerHTML = '';
  currentTags.forEach((tag, i) => {
    const pill = document.createElement('span');
    pill.className = 'option-tag-pill';
    pill.innerHTML = `${escapeHtml(tag)}<button type="button" class="option-tag-remove" aria-label="Remove ${escapeHtml(tag)}" data-index="${i}">&times;</button>`;
    optionTagsList.appendChild(pill);
  });
  optionsHidden.value = currentTags.join(',');
}

function addTag(value) {
  const trimmed = value.trim();
  if (trimmed && !currentTags.includes(trimmed)) {
    currentTags.push(trimmed);
    renderTags();
  }
}

function clearTags() {
  currentTags = [];
  renderTags();
  if (optionTagInput) optionTagInput.value = '';
}

if (optionTagsList) {
  optionTagsList.addEventListener('click', (e) => {
    if (e.target.matches('.option-tag-remove')) {
      const idx = parseInt(e.target.dataset.index, 10);
      currentTags.splice(idx, 1);
      renderTags();
    }
  });
}

if (optionTagInput) {
  optionTagInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(optionTagInput.value);
      optionTagInput.value = '';
    }
  });

  optionTagInput.addEventListener('input', () => {
    if (optionTagInput.value.endsWith(',')) {
      addTag(optionTagInput.value.slice(0, -1));
      optionTagInput.value = '';
    }
  });
}

if (optionTagsContainer) {
  optionTagsContainer.addEventListener('click', () => {
    if (optionTagInput) optionTagInput.focus();
  });
}

// ─── Range Slider Sync ─────────────────────────────────────────────────────────
function syncRangePreview() {
  const min = parseFloat(rangeMinInput.value) || 0;
  const max = parseFloat(rangeMaxInput.value) || 100;
  const step = parseFloat(rangeStepInput.value) || 1;

  rangePreview.min = min;
  rangePreview.max = max;
  rangePreview.step = step;

  let val = parseFloat(rangePreview.value);
  if (isNaN(val) || val < min) val = min;
  if (val > max) val = max;
  rangePreview.value = val;
  rangePreviewVal.textContent = val;

  rangePreviewMin.textContent = min;
  rangePreviewMax.textContent = max;
}

if (rangePreview) {
  rangePreview.addEventListener('input', () => {
    rangePreviewVal.textContent = rangePreview.value;
  });
}

[rangeMinInput, rangeMaxInput, rangeStepInput].forEach((el) => {
  if (el) el.addEventListener('input', syncRangePreview);
});

// ─── Options Visibility Toggling ──────────────────────────────────────────────
const CHOICE_TYPES = ['radio', 'checkbox', 'select'];

function updateOptionsVisibility() {
  const type = typeSelect.value;

  if (CHOICE_TYPES.includes(type)) {
    optionsGroup.removeAttribute('hidden');
    rangeGroup.setAttribute('hidden', '');
  } else if (type === 'range') {
    rangeGroup.removeAttribute('hidden');
    optionsGroup.setAttribute('hidden', '');
    clearTags();
    syncRangePreview();
  } else {
    optionsGroup.setAttribute('hidden', '');
    rangeGroup.setAttribute('hidden', '');
    clearTags();
  }
}

typeSelect.addEventListener('change', updateOptionsVisibility);

// ─── Dialog Closing Helpers ───────────────────────────────────────────────────
[questionDialog, deleteDialog, surveyPreviewDialog].forEach((dialog) => {
  if (!dialog) return;

  dialog.querySelectorAll('[data-close-dialog]').forEach((btn) => {
    btn.addEventListener('click', () => dialog.close());
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
});

// ─── Render Questions Table ───────────────────────────────────────────────────
const TYPE_LABELS = {
  text: 'Short Text',
  textarea: 'Long Text',
  email: 'Email',
  number: 'Number',
  date: 'Date',
  radio: 'Single Choice',
  checkbox: 'Multiple Choice',
  select: 'Dropdown',
  rating: 'Star Rating',
  scale: 'Linear Scale',
  range: 'Range Slider',
  boolean: 'Yes / No',
  file: 'File Upload',
};

function buildOptionPills(options) {
  if (!options || options.length === 0) return '—';
  return options
    .map((opt) => `<span class="table-option-pill">${escapeHtml(opt)}</span>`)
    .join('');
}

function buildRangeSummary(q) {
  if (q.type === 'rating') {
    return `<span class="table-range-badge">1 – 5 <small>(Stars / Rating)</small></span>`;
  }
  if (q.type === 'scale') {
    return `<span class="table-range-badge">1 – 10 <small>(Linear Scale)</small></span>`;
  }
  const min = q.rangeMin ?? 0;
  const max = q.rangeMax ?? 100;
  const step = q.rangeStep ?? 1;
  return `<span class="table-range-badge">${min} – ${max} <small>(step ${step})</small></span>`;
}

function renderQuestions() {
  const survey = getSurveyById(surveyId);
  if (!survey) {
    window.location.href = 'index.html';
    return;
  }

  surveyHeading.textContent = `${survey.title}: Questions`;
  surveyDesc.textContent = survey.description || 'Manage and configure questions for this survey.';

  const allQuestions = survey.questions || [];
  const totalRows = allQuestions.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / ROWS_PER_PAGE));

  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = Math.min(startIndex + ROWS_PER_PAGE, totalRows);
  const currentSlice = allQuestions.slice(startIndex, endIndex);

  tableBody.innerHTML = '';

  if (currentSlice.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 32px 16px;">
          No questions yet. Click <strong>+ Add Question</strong> to get started.
        </td>
      </tr>
    `;
  } else {
    currentSlice.forEach((q, index) => {
      const tr = document.createElement('tr');
      tr.dataset.id = q.id;

      let optionsCell = '—';
      if (CHOICE_TYPES.includes(q.type)) {
        optionsCell = buildOptionPills(q.options);
      } else if (q.type === 'range' || q.type === 'rating' || q.type === 'scale') {
        optionsCell = buildRangeSummary(q);
      }

      tr.innerHTML = `
        <td>${startIndex + index + 1}</td>
        <th scope="row">${escapeHtml(q.text)}</th>
        <td>
          <span class="type-badge">${TYPE_LABELS[q.type] || escapeHtml(q.type)}</span>
          <div class="table-options-wrap">${optionsCell}</div>
        </td>
        <td>${q.required ? 'Yes' : 'No'}</td>
        <td class="text-right">
          <div class="row-actions">
            <button type="button" class="btn-action btn-edit" aria-label="Edit question">Edit</button>
            <button type="button" class="btn-action btn-delete" aria-label="Delete question">Delete</button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Update pagination UI
  paginationInfo.textContent = totalRows > 0
    ? `Showing ${startIndex + 1}-${endIndex} of ${totalRows}`
    : `Showing 0 of 0`;
  currentPageBadge.textContent = `${currentPage} / ${totalPages}`;

  firstBtn.disabled = currentPage === 1;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  lastBtn.disabled = currentPage === totalPages;
}

// ─── Pagination Controls Listeners ─────────────────────────────────────────────
firstBtn.addEventListener('click', () => {
  currentPage = 1;
  renderQuestions();
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderQuestions();
  }
});

nextBtn.addEventListener('click', () => {
  const survey = getSurveyById(surveyId);
  const totalPages = Math.max(1, Math.ceil((survey?.questions?.length || 0) / ROWS_PER_PAGE));
  if (currentPage < totalPages) {
    currentPage++;
    renderQuestions();
  }
});

lastBtn.addEventListener('click', () => {
  const survey = getSurveyById(surveyId);
  currentPage = Math.max(1, Math.ceil((survey?.questions?.length || 0) / ROWS_PER_PAGE));
  renderQuestions();
});

// ─── Open Modal for Create ─────────────────────────────────────────────────────
openCreateBtn.addEventListener('click', () => {
  questionForm.reset();
  questionIdInput.value = '';
  dialogTitle.textContent = 'Add Question';
  clearTags();
  rangeMinInput.value = 0;
  rangeMaxInput.value = 100;
  rangeStepInput.value = 1;
  updateOptionsVisibility();
  questionDialog.showModal();
});

// ─── Table Row Actions (Edit / Delete) ─────────────────────────────────────────
tableBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  if (!row || !row.dataset.id) return;

  const qId = row.dataset.id;
  const survey = getSurveyById(surveyId);
  const question = (survey.questions || []).find((q) => q.id === qId);
  if (!question) return;

  if (e.target.matches('.btn-edit')) {
    dialogTitle.textContent = 'Edit Question';
    questionIdInput.value = question.id;
    questionTextInput.value = question.text;
    questionTypeInput.value = question.type;
    questionRequiredInput.checked = Boolean(question.required);

    // Restore tags for choice inputs
    clearTags();
    if (question.options && question.options.length > 0) {
      question.options.forEach(addTag);
    }

    // Restore range config
    rangeMinInput.value = question.rangeMin ?? 0;
    rangeMaxInput.value = question.rangeMax ?? 100;
    rangeStepInput.value = question.rangeStep ?? 1;

    updateOptionsVisibility();
    syncRangePreview();
    questionDialog.showModal();
  } else if (e.target.matches('.btn-delete')) {
    activeDeleteQuestionId = question.id;
    deleteDialog.showModal();
  }
});

// ─── Form Submit (Add / Edit Question) ─────────────────────────────────────────
questionForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const selectedType = typeSelect.value;
  const questionText = questionTextInput.value.trim();

  if (!questionText) {
    questionTextInput.focus();
    return;
  }

  const options = CHOICE_TYPES.includes(selectedType)
    ? [...currentTags]
    : [];

  if (CHOICE_TYPES.includes(selectedType) && options.length === 0) {
    alert('Please enter at least one choice option for this question.');
    if (optionTagInput) optionTagInput.focus();
    return;
  }

  let rangeConfig = {};
  if (selectedType === 'range') {
    rangeConfig = {
      rangeMin: parseFloat(rangeMinInput.value) || 0,
      rangeMax: parseFloat(rangeMaxInput.value) || 100,
      rangeStep: parseFloat(rangeStepInput.value) || 1,
    };
  } else if (selectedType === 'rating') {
    rangeConfig = { rangeMin: 1, rangeMax: 5, rangeStep: 1 };
  } else if (selectedType === 'scale') {
    rangeConfig = { rangeMin: 1, rangeMax: 10, rangeStep: 1 };
  }

  saveQuestion(surveyId, {
    id: questionIdInput.value || null,
    text: questionText,
    type: selectedType,
    options,
    required: questionRequiredInput.checked,
    ...rangeConfig,
  });

  questionDialog.close();
  renderQuestions();
});

// ─── Delete Confirm ────────────────────────────────────────────────────────────
confirmDeleteBtn.addEventListener('click', () => {
  if (activeDeleteQuestionId) {
    deleteQuestion(surveyId, activeDeleteQuestionId);
    activeDeleteQuestionId = null;
    deleteDialog.close();
    renderQuestions();
  }
});

// ─── Survey Preview Modal (Read-Only Admin View) ──────────────────────────────
function buildReadOnlyQuestionItem(q, idx) {
  let detailsHtml = '';

  switch (q.type) {
    case 'radio':
    case 'checkbox':
    case 'select': {
      const opts = q.options && q.options.length ? q.options : ['Option A', 'Option B'];
      const bullet = q.type === 'radio' ? '○' : (q.type === 'checkbox' ? '□' : '▾');
      detailsHtml = `
        <div class="preview-readonly-options">
          ${opts.map((opt) => `
            <div class="preview-readonly-opt-item">
              <span class="preview-opt-bullet">${bullet}</span>
              <span>${escapeHtml(opt)}</span>
            </div>
          `).join('')}
        </div>
      `;
      break;
    }

    case 'rating': {
      detailsHtml = `
        <div class="preview-readonly-slider-wrap">
          <div class="preview-readonly-scale-row">
            ${[1, 2, 3, 4, 5].map((n) => `<span class="preview-readonly-tick">★ ${n}</span>`).join('')}
          </div>
          <div class="preview-readonly-minmax">
            <span>1 - Lowest rating</span>
            <span>5 - Highest rating</span>
          </div>
        </div>
      `;
      break;
    }

    case 'scale': {
      detailsHtml = `
        <div class="preview-readonly-slider-wrap">
          <div class="preview-readonly-scale-row">
            ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `<span class="preview-readonly-tick">${n}</span>`).join('')}
          </div>
          <div class="preview-readonly-minmax">
            <span>1 - Not at all likely</span>
            <span>10 - Extremely likely</span>
          </div>
        </div>
      `;
      break;
    }

    case 'range': {
      const min = q.rangeMin ?? 0;
      const max = q.rangeMax ?? 100;
      const step = q.rangeStep ?? 1;
      detailsHtml = `
        <div class="preview-readonly-slider-wrap">
          <div class="preview-readonly-track">
            <span class="preview-readonly-handle" style="left: 50%;"></span>
          </div>
          <div class="preview-readonly-minmax">
            <span>Min: ${min}</span>
            <span style="font-weight: 600; color: var(--text-main);">Step: ${step}</span>
            <span>Max: ${max}</span>
          </div>
        </div>
      `;
      break;
    }

    case 'boolean': {
      detailsHtml = `
        <div class="preview-readonly-boolean">
          <span class="preview-readonly-pill">👍 Yes</span>
          <span class="preview-readonly-pill">👎 No</span>
        </div>
      `;
      break;
    }

    case 'file': {
      detailsHtml = `
        <div class="preview-readonly-placeholder">
          📎 File upload field (PDF, PNG, JPG, DOCX up to 10MB)
        </div>
      `;
      break;
    }

    case 'textarea': {
      detailsHtml = `
        <div class="preview-readonly-placeholder" style="min-height: 48px;">
          Long text response (paragraph)
        </div>
      `;
      break;
    }

    default: {
      const label = TYPE_LABELS[q.type] || 'Short text';
      detailsHtml = `
        <div class="preview-readonly-placeholder">
          ${escapeHtml(label)} field
        </div>
      `;
      break;
    }
  }

  return `
    <div class="preview-readonly-card">
      <div class="preview-readonly-qheader">
        <span class="preview-readonly-num">Q${idx + 1}</span>
        <div class="preview-readonly-qtitle">
          ${escapeHtml(q.text)}
          ${q.required ? '<span class="preview-required-star" title="Required field">*</span>' : ''}
        </div>
        <span class="type-badge" style="margin: 0; align-self: flex-start;">${TYPE_LABELS[q.type] || escapeHtml(q.type)}</span>
      </div>
      <div class="preview-readonly-body">
        ${detailsHtml}
      </div>
    </div>
  `;
}

function openSurveyPreview() {
  const survey = getSurveyById(surveyId);
  if (!survey) return;

  previewSurveyTitle.textContent = survey.title;
  previewSurveyDesc.textContent = survey.description || 'Survey structure preview (read-only view).';

  const questions = survey.questions || [];
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
      previewQuestionsList.insertAdjacentHTML('beforeend', buildReadOnlyQuestionItem(q, idx));
    });
  }

  surveyPreviewDialog.showModal();
}

if (previewSurveyBtn) {
  previewSurveyBtn.addEventListener('click', openSurveyPreview);
}

// ─── Initial Load ──────────────────────────────────────────────────────────────
renderQuestions();