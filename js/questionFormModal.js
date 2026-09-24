// Manages the Question Create & Edit Dialog
import { saveQuestion } from './storage.js';
import { escapeHtml, CHOICE_TYPES, setupDialogClose } from './utils.js';

// DOM Elements
const dialog = document.getElementById('questionFormDialog');
const form = document.getElementById('questionForm');
const dialogTitle = document.getElementById('questionDialogTitle');
const questionIdInput = document.getElementById('questionId');
const questionTextInput = document.getElementById('questionText');
const questionTypeInput = document.getElementById('questionType');
const questionRequiredInput = document.getElementById('questionRequired');

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

let activeSurveyId = null;
let onSaveCallback = null;
let currentTags = [];

// ─── Tag-Pill Choice Manager ───────────────────────────────────────────────────
function renderTags() {
  if (!optionTagsList) return;
  optionTagsList.innerHTML = '';
  currentTags.forEach((tag, i) => {
    const pill = document.createElement('span');
    pill.className = 'option-tag-pill';
    pill.innerHTML = `${escapeHtml(tag)}<button type="button" class="option-tag-remove" aria-label="Remove ${escapeHtml(tag)}" data-index="${i}">&times;</button>`;
    optionTagsList.appendChild(pill);
  });
  if (optionsHidden) {
    optionsHidden.value = currentTags.join(',');
  }
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

// ─── Range Slider Sync ─────────────────────────────────────────────────────────
function syncRangePreview() {
  if (!rangePreview) return;
  const min = parseFloat(rangeMinInput?.value) || 0;
  const max = parseFloat(rangeMaxInput?.value) || 100;
  const step = parseFloat(rangeStepInput?.value) || 1;

  rangePreview.min = min;
  rangePreview.max = max;
  rangePreview.step = step;

  let val = parseFloat(rangePreview.value);
  if (isNaN(val) || val < min) val = min;
  if (val > max) val = max;
  rangePreview.value = val;
  if (rangePreviewVal) rangePreviewVal.textContent = val;

  if (rangePreviewMin) rangePreviewMin.textContent = min;
  if (rangePreviewMax) rangePreviewMax.textContent = max;
}

// ─── Options Visibility Toggling ──────────────────────────────────────────────
function updateOptionsVisibility() {
  const type = questionTypeInput.value;

  if (CHOICE_TYPES.includes(type)) {
    optionsGroup?.removeAttribute('hidden');
    rangeGroup?.setAttribute('hidden', '');
  } else if (type === 'range') {
    rangeGroup?.removeAttribute('hidden');
    optionsGroup?.setAttribute('hidden', '');
    clearTags();
    syncRangePreview();
  } else {
    optionsGroup?.setAttribute('hidden', '');
    rangeGroup?.setAttribute('hidden', '');
    clearTags();
  }
}

// ─── Event Setup ──────────────────────────────────────────────────────────────
if (dialog) {
  setupDialogClose(dialog);
}

if (questionTypeInput) {
  questionTypeInput.addEventListener('change', updateOptionsVisibility);
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
    optionTagInput?.focus();
  });
}

if (rangePreview) {
  rangePreview.addEventListener('input', () => {
    if (rangePreviewVal) rangePreviewVal.textContent = rangePreview.value;
  });
}

[rangeMinInput, rangeMaxInput, rangeStepInput].forEach((el) => {
  if (el) el.addEventListener('input', syncRangePreview);
});

// Form submission handler
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedType = questionTypeInput.value;
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
      optionTagInput?.focus();
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

    saveQuestion(activeSurveyId, {
      id: questionIdInput.value || null,
      text: questionText,
      type: selectedType,
      options,
      required: questionRequiredInput.checked,
      ...rangeConfig,
    });

    dialog.close();
    if (onSaveCallback) onSaveCallback();
  });
}

/**
 * Opens the question form modal in create or edit mode.
 * @param {object} params
 * @param {string} params.surveyId
 * @param {object|null} params.question
 * @param {Function} params.onSave
 */
export function openQuestionFormModal({ surveyId, question = null, onSave }) {
  activeSurveyId = surveyId;
  onSaveCallback = onSave;

  if (question) {
    // Edit mode
    dialogTitle.textContent = 'Edit Question';
    questionIdInput.value = question.id;
    questionTextInput.value = question.text;
    questionTypeInput.value = question.type;
    questionRequiredInput.checked = Boolean(question.required);

    clearTags();
    if (question.options && question.options.length > 0) {
      question.options.forEach(addTag);
    }

    if (rangeMinInput) rangeMinInput.value = question.rangeMin ?? 0;
    if (rangeMaxInput) rangeMaxInput.value = question.rangeMax ?? 100;
    if (rangeStepInput) rangeStepInput.value = question.rangeStep ?? 1;

    updateOptionsVisibility();
    syncRangePreview();
  } else {
    // Create mode
    form.reset();
    questionIdInput.value = '';
    dialogTitle.textContent = 'Add Question';
    clearTags();
    if (rangeMinInput) rangeMinInput.value = 0;
    if (rangeMaxInput) rangeMaxInput.value = 100;
    if (rangeStepInput) rangeStepInput.value = 1;
    updateOptionsVisibility();
  }

  dialog.showModal();
}
