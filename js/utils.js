// Utility helpers and constants for the survey application

/**
 * Escapes HTML characters to prevent Cross-Site Scripting (XSS).
 * @param {string|number|null|undefined} str 
 * @returns {string}
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Human-readable labels mapped to question type identifiers.
 */
export const TYPE_LABELS = {
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

/**
 * Question types that require multiple choice option tags.
 */
export const CHOICE_TYPES = ['radio', 'checkbox', 'select'];

/**
 * Generates metadata badges HTML (Status badge, Question count, Response count)
 * @param {object} survey 
 * @returns {string} HTML string
 */
export function getMetaHtml(survey) {
  const statusClass = {
    Active:   'status-active',
    Inactive: 'status-inactive',
    Pending:  'status-pending',
  }[survey.status] || '';

  const qCount = (survey.questions || []).length;
  const rCount = Number(survey.responses || 0);

  return `
    <span class="status-badge ${statusClass}">${escapeHtml(survey.status || 'Active')}</span>
    <span class="survey-meta-pill">📋 ${qCount} Question${qCount === 1 ? '' : 's'}</span>
    <span class="survey-meta-pill">👥 ${rCount} Response${rCount === 1 ? '' : 's'}</span>
  `;
}

/**
 * Attaches standard close listeners to dialogs (for [data-close-dialog] and backdrop click)
 * @param {HTMLDialogElement} dialog 
 */
export function setupDialogClose(dialog) {
  if (!dialog) return;

  dialog.querySelectorAll('[data-close-dialog]').forEach((btn) => {
    btn.addEventListener('click', () => dialog.close());
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
}
