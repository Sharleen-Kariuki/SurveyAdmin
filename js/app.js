import { getSurveys, resetToMockData } from './storage.js';
import { openFormModal, setupFormSubmit } from './formModal.js';
import { openDeleteModal } from './confirmModal.js';
import { escapeHtml, initCsrfProtection } from './utils.js';
import { initSurveyDataTable, destroySurveyDataTable } from './Datatable.js';
import { renderToolbarTabs, SURVEY_TOOLBAR_CONFIG } from './toolbarTabs.js';

// DOM Elements
const tableBody = document.getElementById('surveyTableBody');
const createBtn = document.getElementById('createSurveyBtn');

function renderTable() {
  const allSurveys = getSurveys();

  // Tear down existing DataTable before replacing rows
  destroySurveyDataTable();

  // Populate table rows
  tableBody.innerHTML = '';
  if (allSurveys.length > 0) {
    allSurveys.forEach((survey) => {
      const tr = document.createElement('tr');
      const safeId = String(survey.id);
      tr.dataset.id = safeId;

      const statusClass = {
        Active: 'status-active',
        Inactive: 'status-inactive',
        Pending: 'status-pending',
      }[survey.status] || '';

      tr.innerHTML = `
        <th scope="row">
          <a href="questions.html?id=${encodeURIComponent(safeId)}" class="survey-link" data-id="${escapeHtml(safeId)}" aria-label="${escapeHtml(survey.title)} - View questions">
            ${escapeHtml(survey.title)}
          </a>
        </th>
        <td>${escapeHtml(survey.description)}</td>
        <td>${Number(survey.responses || 0)}</td>
        <td><span class="status-badge ${statusClass}">${escapeHtml(survey.status)}</span></td>
        <td data-type="date">${escapeHtml(survey.createdAt)}</td>
        <td data-type="date">${escapeHtml(survey.updatedAt)}</td>
        <td class="text-right">
          <div class="row-actions">
            <button type="button" class="btn-action btn-edit" aria-label="Edit ${escapeHtml(survey.title)}">Edit</button>
            <button type="button" class="btn-action btn-delete" aria-label="Delete ${escapeHtml(survey.title)}">Delete</button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Initialize DataTables
  initSurveyDataTable('#surveyTable');
}

// Setup modals & table actions
createBtn.addEventListener('click', () => openFormModal(null));
setupFormSubmit(renderTable);

// Handle row clicks & navigation accurately
tableBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  if (!row) return;

  const titleLink = e.target.closest('a.survey-link');
  const rowLink = row.querySelector('a.survey-link');
  const surveyId = titleLink?.dataset.id || row.dataset.id || rowLink?.dataset.id;
  if (!surveyId) return;

  const survey = getSurveys().find((s) => String(s.id) === String(surveyId));

  if (e.target.closest('.btn-edit')) {
    e.preventDefault();
    if (survey) openFormModal(survey);
    return;
  }

  if (e.target.closest('.btn-delete')) {
    e.preventDefault();
    if (survey) openDeleteModal(survey, renderTable);
    return;
  }

  // Store in sessionStorage so questions.html can always read the selected survey reliably
  try {
    sessionStorage.setItem('current_survey_id', String(surveyId));
  } catch (err) {
    console.warn('[app.js] Failed storing current_survey_id:', err);
  }

  // If clicked on title link directly
  if (titleLink) {
    e.preventDefault();
    window.location.href = `questions.html?id=${encodeURIComponent(surveyId)}`;
    return;
  }

  // If clicked anywhere else on the row (except action buttons)
  if (!e.target.closest('button')) {
    window.location.href = `questions.html?id=${encodeURIComponent(surveyId)}`;
  }
});

// Auto-open modal if requested via URL param (e.g. ?action=create)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('action') === 'create') {
  openFormModal(null);
}

// Initial boot
renderToolbarTabs('#toolbarTabs', SURVEY_TOOLBAR_CONFIG);
initCsrfProtection();
renderTable();