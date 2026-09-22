import { getSurveys } from './storage.js';
import { openFormModal, setupFormSubmit } from './formModal.js';
import { openDeleteModal } from './confirmModal.js';

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const tableBody = document.getElementById('surveyTableBody');
const createBtn = document.getElementById('createSurveyBtn');

// Pagination State & DOM Elements
const ROWS_PER_PAGE = 5;
let currentPage = 1;

const firstBtn = document.getElementById('firstPageBtn');
const prevBtn = document.getElementById('prevPageBtn');
const nextBtn = document.getElementById('nextPageBtn');
const lastBtn = document.getElementById('lastPageBtn');
const paginationInfo = document.getElementById('paginationInfo');
const currentPageBadge = document.getElementById('currentPageBadge');

function renderTable() {
  const allSurveys = getSurveys();
  const totalRows = allSurveys.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / ROWS_PER_PAGE));

  // Constrain active page
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  // Calculate slice
  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = Math.min(startIndex + ROWS_PER_PAGE, totalRows);
  const currentSlice = allSurveys.slice(startIndex, endIndex);

  // Render rows
  tableBody.innerHTML = '';
  if (currentSlice.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 32px 16px;">
          No surveys available. Click <strong>+ Create Survey</strong> to add one.
        </td>
      </tr>
    `;
  } else {
    currentSlice.forEach((survey) => {
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

  // Update labels & disabled states
  paginationInfo.textContent = totalRows > 0 
    ? `Showing ${startIndex + 1}-${endIndex} of ${totalRows}` 
    : `Showing 0 of 0`;
  currentPageBadge.textContent = `${currentPage} / ${totalPages}`;

  firstBtn.disabled = currentPage === 1;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  lastBtn.disabled = currentPage === totalPages;
}

// Pagination Controls Listeners
firstBtn.addEventListener('click', () => {
  currentPage = 1;
  renderTable();
});

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderTable();
  }
});

nextBtn.addEventListener('click', () => {
  const totalPages = Math.max(1, Math.ceil(getSurveys().length / ROWS_PER_PAGE));
  if (currentPage < totalPages) {
    currentPage++;
    renderTable();
  }
});

lastBtn.addEventListener('click', () => {
  currentPage = Math.max(1, Math.ceil(getSurveys().length / ROWS_PER_PAGE));
  renderTable();
});

// Setup modals & table actions
createBtn.addEventListener('click', () => openFormModal(null));
setupFormSubmit(renderTable);

tableBody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  if (!row || !row.dataset.id) return;

  const surveyId = row.dataset.id;
  const survey = getSurveys().find((s) => s.id === surveyId);
  if (!survey) return;

  if (e.target.matches('.btn-edit')) {
    openFormModal(survey);
  } else if (e.target.matches('.btn-delete')) {
    openDeleteModal(survey, renderTable);
  }
});

// Auto-open modal if requested via URL param (e.g. ?action=create)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('action') === 'create') {
  openFormModal(null);
}

// Initial boot
renderTable();