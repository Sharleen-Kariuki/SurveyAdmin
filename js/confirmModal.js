// Manages the delete confirmation dialog independently.
import { deleteSurveyById } from './storage.js';

const dialog = document.getElementById('confirmDeleteDialog');
const label = document.getElementById('deleteSurveyName');
const confirmBtn = document.getElementById('confirmDeleteBtn');

let currentDeleteId = null;
let currentSuccessCallback = null;

dialog.querySelectorAll('[data-close-dialog]').forEach(btn => {
  btn.addEventListener('click', () => dialog.close());
});

dialog.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close();
});

export function openDeleteModal(survey, onSuccess) {
  currentDeleteId = survey.id;
  currentSuccessCallback = onSuccess;
  label.textContent = survey.title;
  dialog.showModal();
}

confirmBtn.addEventListener('click', () => {
  if (currentDeleteId) {
    deleteSurveyById(currentDeleteId);
    dialog.close();
    if (currentSuccessCallback) currentSuccessCallback();
  }
});