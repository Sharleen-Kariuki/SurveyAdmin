// Manages resetting, populating, opening and submitting the survey form modal independently.
import { saveOrUpdateSurvey } from './storage.js';

const dialog = document.getElementById('surveyFormDialog');
const form = document.getElementById('surveyForm');
const modalTitle = document.getElementById('formDialogTitle');

const idInput = document.getElementById('surveyId');
const titleInput = document.getElementById('surveyTitle');
const descInput = document.getElementById('surveyDesc');
const statusInput = document.getElementById('surveyStatus');

// Close listeners for buttons marked with data-close-dialog
dialog.querySelectorAll('[data-close-dialog]').forEach(btn => {
  btn.addEventListener('click', () => dialog.close());
});

// Click outside to dismiss
dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});

export function openFormModal(survey = null) {
  form.reset();

  if (survey) {
    // Edit mode
    modalTitle.textContent = 'Edit Survey';
    idInput.value = survey.id;
    titleInput.value = survey.title;
    descInput.value = survey.description;
    statusInput.value = survey.status;
  } else {
    // Create mode
    modalTitle.textContent = 'Create Survey';
    idInput.value = '';
    statusInput.value = 'Active';
  }

  dialog.showModal();
}

export function setupFormSubmit(onSuccess) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const description = descInput.value.trim();

    if (!title) {
      titleInput.focus();
      return;
    }

    saveOrUpdateSurvey({
      id: idInput.value || null,
      title,
      description,
      status: statusInput.value || 'Active'
    });

    dialog.close();
    onSuccess();
  });
}