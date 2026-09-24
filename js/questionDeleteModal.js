// Manages the Question Deletion confirmation dialog
import { deleteQuestion } from './storage.js';
import { setupDialogClose } from './utils.js';

const dialog = document.getElementById('deleteQuestionDialog');
const confirmDeleteBtn = document.getElementById('confirmDeleteQuestionBtn');

let activeSurveyId = null;
let activeQuestionId = null;
let onDeleteCallback = null;

if (dialog) {
  setupDialogClose(dialog);
}

if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener('click', () => {
    if (activeSurveyId && activeQuestionId) {
      deleteQuestion(activeSurveyId, activeQuestionId);
      activeQuestionId = null;
      dialog.close();
      if (onDeleteCallback) onDeleteCallback();
    }
  });
}

/**
 * Opens the question delete confirmation dialog.
 * @param {object} params
 * @param {string} params.surveyId
 * @param {string} params.questionId
 * @param {Function} params.onDelete
 */
export function openQuestionDeleteModal({ surveyId, questionId, onDelete }) {
  activeSurveyId = surveyId;
  activeQuestionId = questionId;
  onDeleteCallback = onDelete;
  dialog.showModal();
}
