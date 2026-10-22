// Manages resetting, populating, opening and submitting the survey form modal independently.
import { saveOrUpdateSurvey } from './storage.js';
import { setFieldValidation, clearFieldValidation, clearAllValidationErrors, getCsrfToken, containsXss, XSS_ERROR_MESSAGE } from './utils.js';

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
const statusGroup = document.getElementById('surveyStatusGroup') || statusInput?.closest('.form-group');
const previewColumnsGroup = document.getElementById('surveyPreviewColumnsGroup') || previewColumnsInput?.closest('.form-group');

const titleErrorContainer = titleGroup?.querySelector('.error-container');
const descErrorContainer = descGroup?.querySelector('.error-container');
const statusErrorContainer = statusGroup?.querySelector('.error-container');
const previewColumnsErrorContainer = previewColumnsGroup?.querySelector('.error-container');

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

// Real-time error clearance and unsafe payload detection on input and change
titleInput?.addEventListener('input', () => {
  if (containsXss(titleInput.value)) {
    setFieldValidation({
      formGroup: titleGroup,
      control: titleInput,
      errorContainer: titleErrorContainer,
      errorMessage: XSS_ERROR_MESSAGE
    });
  } else if (titleInput.value.trim()) {
    clearFieldValidation({ formGroup: titleGroup, control: titleInput, errorContainer: titleErrorContainer });
  }
});

descInput?.addEventListener('input', () => {
  if (containsXss(descInput.value)) {
    setFieldValidation({
      formGroup: descGroup,
      control: descInput,
      errorContainer: descErrorContainer,
      errorMessage: XSS_ERROR_MESSAGE
    });
  } else if (descInput.value.trim()) {
    clearFieldValidation({ formGroup: descGroup, control: descInput, errorContainer: descErrorContainer });
  }
});

statusInput?.addEventListener('change', () => {
  if (statusInput.value) {
    clearFieldValidation({ formGroup: statusGroup, control: statusInput, errorContainer: statusErrorContainer });
  }
});

previewColumnsInput?.addEventListener('change', () => {
  if (previewColumnsInput.value) {
    clearFieldValidation({ formGroup: previewColumnsGroup, control: previewColumnsInput, errorContainer: previewColumnsErrorContainer });
  }
});

export function openFormModal(survey = null) {
  form.reset();
  clearAllValidationErrors(form);

  // Ensure active CSRF token is present on form
  let csrfInput = form.querySelector('input[name="csrf_token"]');
  if (!csrfInput) {
    csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = 'csrf_token';
    form.prepend(csrfInput);
  }
  csrfInput.value = getCsrfToken();

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
    const status = statusInput.value;
    const previewColumnsVal = previewColumnsInput?.value;
    const parsedCols = parseInt(previewColumnsVal, 10);

    let isValid = true;
    let firstInvalidControl = null;

    // Validate Title
    if (!title) {
      setFieldValidation({
        formGroup: titleGroup,
        control: titleInput,
        errorContainer: titleErrorContainer,
        errorMessage: 'The title field is required.'
      });
      isValid = false;
      if (!firstInvalidControl) firstInvalidControl = titleInput;
    } else if (title.length > 150) {
      setFieldValidation({
        formGroup: titleGroup,
        control: titleInput,
        errorContainer: titleErrorContainer,
        errorMessage: 'Title must not exceed 150 characters.'
      });
      isValid = false;
      if (!firstInvalidControl) firstInvalidControl = titleInput;
    } else if (containsXss(title)) {
      setFieldValidation({
        formGroup: titleGroup,
        control: titleInput,
        errorContainer: titleErrorContainer,
        errorMessage: XSS_ERROR_MESSAGE
      });
      isValid = false;
      if (!firstInvalidControl) firstInvalidControl = titleInput;
    } else {
      clearFieldValidation({ formGroup: titleGroup, control: titleInput, errorContainer: titleErrorContainer });
    }

    // Validate Description
    if (!description) {
      setFieldValidation({
        formGroup: descGroup,
        control: descInput,
        errorContainer: descErrorContainer,
        errorMessage: 'The description field is required.'
      });
      isValid = false;
      if (!firstInvalidControl) firstInvalidControl = descInput;
    } else if (description.length > 1000) {
      setFieldValidation({
        formGroup: descGroup,
        control: descInput,
        errorContainer: descErrorContainer,
        errorMessage: 'Description must not exceed 1000 characters.'
      });
      isValid = false;
      if (!firstInvalidControl) firstInvalidControl = descInput;
    } else if (containsXss(description)) {
      setFieldValidation({
        formGroup: descGroup,
        control: descInput,
        errorContainer: descErrorContainer,
        errorMessage: XSS_ERROR_MESSAGE
      });
      isValid = false;
      if (!firstInvalidControl) firstInvalidControl = descInput;
    } else {
      clearFieldValidation({ formGroup: descGroup, control: descInput, errorContainer: descErrorContainer });
    }

    // Validate Status
    const validStatuses = ['Active', 'Pending', 'Inactive'];
    if (!status || !validStatuses.includes(status)) {
      setFieldValidation({
        formGroup: statusGroup,
        control: statusInput,
        errorContainer: statusErrorContainer,
        errorMessage: 'Please select a valid status.'
      });
      isValid = false;
      if (!firstInvalidControl) firstInvalidControl = statusInput;
    } else {
      clearFieldValidation({ formGroup: statusGroup, control: statusInput, errorContainer: statusErrorContainer });
    }

    // Validate Preview Columns
    if (isNaN(parsedCols) || parsedCols < 1 || parsedCols > 3) {
      setFieldValidation({
        formGroup: previewColumnsGroup,
        control: previewColumnsInput,
        errorContainer: previewColumnsErrorContainer,
        errorMessage: 'Please select a valid preview column layout (1, 2, or 3).'
      });
      isValid = false;
      if (!firstInvalidControl) firstInvalidControl = previewColumnsInput;
    } else {
      clearFieldValidation({ formGroup: previewColumnsGroup, control: previewColumnsInput, errorContainer: previewColumnsErrorContainer });
    }

    if (!isValid) {
      firstInvalidControl?.focus();
      return;
    }

    saveOrUpdateSurvey({
      id: idInput.value || null,
      title,
      description,
      status,
      previewColumns: parsedCols || 2,
      csrfToken: form.querySelector('input[name="csrf_token"]')?.value || getCsrfToken()
    });

    clearAllValidationErrors(form);
    dialog.close();
    onSuccess();
  });
}