// Manages the Question Create & Edit Dialog
import { saveQuestion } from './storage.js';
import { escapeHtml, CHOICE_TYPES, setupDialogClose, setFieldValidation, clearFieldValidation, clearAllValidationErrors } from './utils.js';

// DOM Elements
const dialog = document.getElementById('questionFormDialog');
const form = document.getElementById('questionForm');
const dialogTitle = document.getElementById('questionDialogTitle');
const questionIdInput = document.getElementById('questionId');
const questionTextInput = document.getElementById('questionText');
const questionTypeInput = document.getElementById('questionType');
const questionRequiredInput = document.getElementById('questionRequired');

const questionTextGroup = document.getElementById('questionTextGroup') || questionTextInput?.closest('.form-group');
const questionTextErrorContainer = questionTextGroup?.querySelector('.error-container');

const optionsGroup = document.getElementById('optionsGroup');
const optionsHidden = document.getElementById('questionOptions');
const optionTagInput = document.getElementById('optionTagInput');
const optionTagsList = document.getElementById('optionTagsList');
const optionTagsContainer = document.getElementById('optionTagsContainer');
const optionsErrorContainer = optionsGroup?.querySelector('.error-container');

const rangeGroup = document.getElementById('rangeGroup');
const rangeMinInput = document.getElementById('rangeMin');
const rangeMaxInput = document.getElementById('rangeMax');
const rangeStepInput = document.getElementById('rangeStep');
const rangePreview = document.getElementById('rangePreview');
const rangePreviewVal = document.getElementById('rangePreviewValue');
const rangePreviewMin = document.getElementById('rangePreviewMin');
const rangePreviewMax = document.getElementById('rangePreviewMax');
const rangeErrorContainer = document.getElementById('rangeErrorContainer');

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

  if (currentTags.length > 0) {
    clearFieldValidation({ formGroup: optionsGroup, control: optionTagsContainer, errorContainer: optionsErrorContainer });
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

  // Clear previous validation state on type toggle
  clearFieldValidation({ formGroup: optionsGroup, control: optionTagsContainer, errorContainer: optionsErrorContainer });
  if (rangeErrorContainer) rangeErrorContainer.innerHTML = '';
  rangeGroup?.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
  rangeGroup?.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));

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
  dialog.querySelectorAll('[data-close-dialog]').forEach((btn) => {
    btn.addEventListener('click', () => {
      clearAllValidationErrors(form);
    });
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      clearAllValidationErrors(form);
    }
  });
}

if (questionTypeInput) {
  questionTypeInput.addEventListener('change', updateOptionsVisibility);
}

// Real-time clearance for question text input
questionTextInput?.addEventListener('input', () => {
  if (questionTextInput.value.trim()) {
    clearFieldValidation({
      formGroup: questionTextGroup,
      control: questionTextInput,
      errorContainer: questionTextErrorContainer
    });
  }
});

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
    if (currentTags.length > 0) {
      clearFieldValidation({ formGroup: optionsGroup, control: optionTagsContainer, errorContainer: optionsErrorContainer });
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
  if (el) {
    el.addEventListener('input', () => {
      syncRangePreview();
      if (rangeErrorContainer) rangeErrorContainer.innerHTML = '';
      rangeGroup?.querySelectorAll('.is-invalid').forEach((inp) => inp.classList.remove('is-invalid'));
    });
  }
});

// Form submission handler with standard field validation
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedType = questionTypeInput.value;
    const questionText = questionTextInput.value.trim();

    let isValid = true;
    let firstInvalidControl = null;

    // Validate Question Text
    if (!questionText) {
      setFieldValidation({
        formGroup: questionTextGroup,
        control: questionTextInput,
        errorContainer: questionTextErrorContainer,
        errorMessage: 'The question text field is required.'
      });
      isValid = false;
      if (!firstInvalidControl) firstInvalidControl = questionTextInput;
    } else {
      clearFieldValidation({
        formGroup: questionTextGroup,
        control: questionTextInput,
        errorContainer: questionTextErrorContainer
      });
    }

    const options = CHOICE_TYPES.includes(selectedType)
      ? [...currentTags]
      : [];

    // Validate Choice Options if question type requires choices
    if (CHOICE_TYPES.includes(selectedType)) {
      if (options.length === 0) {
        setFieldValidation({
          formGroup: optionsGroup,
          control: optionTagsContainer,
          errorContainer: optionsErrorContainer,
          errorMessage: 'The choices field is required.'
        });
        isValid = false;
        if (!firstInvalidControl) firstInvalidControl = optionTagInput;
      } else {
        clearFieldValidation({
          formGroup: optionsGroup,
          control: optionTagsContainer,
          errorContainer: optionsErrorContainer
        });
      }
    }

    // Validate Range Configuration
    let rangeConfig = {};
    if (selectedType === 'range') {
      const minVal = parseFloat(rangeMinInput.value);
      const maxVal = parseFloat(rangeMaxInput.value);
      const stepVal = parseFloat(rangeStepInput.value);

      let rangeError = '';
      if (rangeMinInput.value.trim() === '' || isNaN(minVal)) {
        rangeError = 'The min field is required.';
        rangeMinInput.classList.add('is-invalid');
        if (!firstInvalidControl) firstInvalidControl = rangeMinInput;
      } else if (rangeMaxInput.value.trim() === '' || isNaN(maxVal)) {
        rangeError = 'The max field is required.';
        rangeMaxInput.classList.add('is-invalid');
        if (!firstInvalidControl) firstInvalidControl = rangeMaxInput;
      } else if (minVal >= maxVal) {
        rangeError = 'Min value must be less than max value.';
        rangeMinInput.classList.add('is-invalid');
        rangeMaxInput.classList.add('is-invalid');
        if (!firstInvalidControl) firstInvalidControl = rangeMinInput;
      } else if (isNaN(stepVal) || stepVal <= 0) {
        rangeError = 'The step field must be greater than 0.';
        rangeStepInput.classList.add('is-invalid');
        if (!firstInvalidControl) firstInvalidControl = rangeStepInput;
      }

      if (rangeError) {
        isValid = false;
        if (rangeErrorContainer) {
          rangeErrorContainer.innerHTML = `
            <div class="preview-validation-error dialog-validation-error" role="alert">
              <img src="./assets/exclamation.png" alt="Validation error" class="alert-icon-img" />
              <span>${escapeHtml(rangeError)}</span>
            </div>
          `;
        }
      } else {
        if (rangeErrorContainer) rangeErrorContainer.innerHTML = '';
        rangeMinInput.classList.remove('is-invalid');
        rangeMaxInput.classList.remove('is-invalid');
        rangeStepInput.classList.remove('is-invalid');
      }

      rangeConfig = {
        rangeMin: minVal || 0,
        rangeMax: maxVal || 100,
        rangeStep: stepVal || 1,
      };
    } else if (selectedType === 'rating') {
      rangeConfig = { rangeMin: 1, rangeMax: 5, rangeStep: 1 };
    } else if (selectedType === 'scale') {
      rangeConfig = { rangeMin: 1, rangeMax: 10, rangeStep: 1 };
    }

    if (!isValid) {
      firstInvalidControl?.focus();
      return;
    }

    saveQuestion(activeSurveyId, {
      id: questionIdInput.value || null,
      text: questionText,
      type: selectedType,
      options,
      required: questionRequiredInput.checked,
      ...rangeConfig,
    });

    clearAllValidationErrors(form);
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
  clearAllValidationErrors(form);

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

