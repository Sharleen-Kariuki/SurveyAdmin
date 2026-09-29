// Manages resetting, populating, opening and submitting the survey form modal independently.
import { saveOrUpdateSurvey } from './storage.js';
import { setFieldValidation, clearFieldValidation, clearAllValidationErrors } from './utils.js';

const dialog = document.getElementById('surveyFormDialog');
const form = document.getElementById('surveyForm');
const modalTitle = document.getElementById('formDialogTitle');

const idInput = document.getElementById('surveyId');
const titleInput = document.getElementById('surveyTitle');
const descInput = document.getElementById('surveyDesc');
const statusInput = document.getElementById('surveyStatus');
const previewColumnsInput = document.getElementById('surveyPreviewColumns');

const titleGroup = document.getElementById('surveyTitleGroup') || titleInput?.closest('.form-group');
const descGroup = document.getElementById('surveyDescGroup') || descInput?.closest('.form-group');

const titleErrorContainer = titleGroup?.querySelector('.error-container');
const descErrorContainer = descGroup?.querySelector('.error-container');

// Close listeners for buttons marked with data-close-dialog
dialog?.querySelectorAll('[data-close-dialog]').forEach(btn => {
  btn.addEventListener('click', () => {
    clearAllValidationErrors(form);
    dialog.close();
  });
});

// Click outside to dismiss
dialog?.addEventListener('click', (e) => {
  if (e.target === dialog) {
    clearAllValidationErrors(form);
    dialog.close();
  }
});

// Real-time error clearance on input
titleInput?.addEventListener('input', () => {
  if (titleInput.value.trim()) {
    clearFieldValidation({ formGroup: titleGroup, control: titleInput, errorContainer: titleErrorContainer });
  }
});

descInput?.addEventListener('input', () => {
  if (descInput.value.trim()) {
    clearFieldValidation({ formGroup: descGroup, control: descInput, errorContainer: descErrorContainer });
  }
});

export function openFormModal(survey = null) {
  form.reset();
  clearAllValidationErrors(form);

  if (survey) {
    // Edit mode
    modalTitle.textContent = 'Edit Survey';
    idInput.value = survey.id;
    titleInput.value = survey.title;
    descInput.value = survey.description;
    statusInput.value = survey.status;
    if (previewColumnsInput) {
      previewColumnsInput.value = survey.previewColumns || 2;
    }
  } else {
    // Create mode
    modalTitle.textContent = 'Create Survey';
    idInput.value = '';
    statusInput.value = 'Active';
    if (previewColumnsInput) {
      previewColumnsInput.value = 2;
    }
  }

  dialog.showModal();
}

// Handles form submission, validates input with standard error presentation, saves or updates the survey, and closes the modal.
export function setupFormSubmit(onSuccess) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const description = descInput.value.trim();

    let isValid = true;
    let firstInvalidControl = null;

    if (!title) {
      setFieldValidation({
        formGroup: titleGroup,
        control: titleInput,
        errorContainer: titleErrorContainer,
        errorMessage: 'The title field is required.'
      });
      isValid = false;
      if (!firstInvalidControl) firstInvalidControl = titleInput;
    } else {
      clearFieldValidation({ formGroup: titleGroup, control: titleInput, errorContainer: titleErrorContainer });
    }

    if (!description) {
      setFieldValidation({
        formGroup: descGroup,
        control: descInput,
        errorContainer: descErrorContainer,
        errorMessage: 'The description field is required.'
      });
      isValid = false;
      if (!firstInvalidControl) firstInvalidControl = descInput;
    } else {
      clearFieldValidation({ formGroup: descGroup, control: descInput, errorContainer: descErrorContainer });
    }

    if (!isValid) {
      firstInvalidControl?.focus();
      return;
    }

    saveOrUpdateSurvey({
      id: idInput.value || null,
      title,
      description,
      status: statusInput.value || 'Active',
      previewColumns: parseInt(previewColumnsInput?.value, 10) || 2
    });

    clearAllValidationErrors(form);
    dialog.close();
    onSuccess();
  });
}