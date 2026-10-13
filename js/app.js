import { getSurveys } from './storage.js';
import { openFormModal, setupFormSubmit } from './formModal.js';
import { openDeleteModal } from './confirmModal.js';
import { escapeHtml } from './utils.js';
import { initSurveyDataTable, destroySurveyDataTable } from './Datatable.js';

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
      tr.dataset.id = survey.id;

      const statusClass = {
        Active:   'status-active',
        Inactive: 'status-inactive',
        Pending:  'status-pending',
      }[survey.status] || '';

      tr.innerHTML = `
        <th scope="row">
          <a href="questions.html?id=${encodeURIComponent(survey.id)}" class="survey-link" aria-label="${escapeHtml(survey.title)} - View questions">
            ${escapeHtml(survey.title)}
          </a>
        </th>
        <td>${escapeHtml(survey.description)}</td>
        <td>${Number(survey.responses || 0)}</td>
        <td><span class="status-badge ${statusClass}">${escapeHtml(survey.status)}</span></td>
        <td>${escapeHtml(survey.createdAt)}</td>
        <td>${escapeHtml(survey.updatedAt)}</td>
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

tableBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  if (!row || !row.dataset.id) return;

  const surveyId = row.dataset.id;
  const survey = getSurveys().find((s) => String(s.id) === String(surveyId));
  if (!survey) return;

  if (e.target.closest('.btn-edit')) {
    openFormModal(survey);
  } else if (e.target.closest('.btn-delete')) {
    openDeleteModal(survey, renderTable);
  } else if (!e.target.closest('a')) {
    window.location.href = `questions.html?id=${encodeURIComponent(survey.id)}`;
  }
});

// Auto-open modal if requested via URL param (e.g. ?action=create)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('action') === 'create') {
  openFormModal(null);
}

// Initial boot
renderTable();