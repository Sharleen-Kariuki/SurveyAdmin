// Main Page Orchestrator for Survey Questions Management
import { getSurveys, getSurveyById } from './storage.js';
import { escapeHtml, TYPE_LABELS, CHOICE_TYPES, getMetaHtml } from './utils.js';
import { openQuestionFormModal } from './questionFormModal.js';
import { openQuestionDeleteModal } from './questionDeleteModal.js';
import {
  initSurveyNavigation,
  updateSurveyPaginationUI,
} from './surveyNavigation.js';
import {
  openSurveyPreviewModal,
  renderPreviewContent,
  isSurveyPreviewOpen,
} from './surveyPreviewModal.js';

// Read ?id= from URL
const params = new URLSearchParams(window.location.search);
let surveyId = params.get('id');

// Validate and initialize surveyId
const initialSurveys = getSurveys();
if (initialSurveys.length === 0) {
  window.location.href = 'index.html';
} else {
  const exists = initialSurveys.some((s) => s.id === surveyId);
  if (!exists) {
    surveyId = initialSurveys[0].id;
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('id', surveyId);
    window.history.replaceState({ surveyId }, '', newUrl.toString());
  }
}

// ─── DOM Elements ─────────────────────────────────────────────────────────────
const surveyHeading = document.getElementById('surveyTitleHeading');
const surveyDesc = document.getElementById('surveyDescriptionText');
const surveyMetaPills = document.getElementById('surveyMetaPills');
const tableBody = document.getElementById('questionsTableBody');

const openCreateBtn = document.getElementById('createQuestionBtn');
const previewSurveyBtn = document.getElementById('previewSurveyBtn');

// Questions Table Pagination State & Elements
const ROWS_PER_PAGE = 5;
let currentPage = 1;

const firstBtn = document.getElementById('firstPageBtn');
const prevBtn = document.getElementById('prevPageBtn');
const nextBtn = document.getElementById('nextPageBtn');
const lastBtn = document.getElementById('lastPageBtn');
const paginationInfo = document.getElementById('paginationInfo');
const currentPageBadge = document.getElementById('currentPageBadge');

// ─── Table Cell Formatters ────────────────────────────────────────────────────
function buildOptionPills(options) {
  if (!options || options.length === 0) return '—';
  return options
    .map((opt) => `<span class="table-option-pill">${escapeHtml(opt)}</span>`)
    .join('');
}

function buildRangeSummary(q) {
  if (q.type === 'rating') {
    return `<span class="table-range-badge">1 – 5 <small>(Stars / Rating)</small></span>`;
  }
  if (q.type === 'scale') {
    return `<span class="table-range-badge">1 – 10 <small>(Linear Scale)</small></span>`;
  }
  const min = q.rangeMin ?? 0;
  const max = q.rangeMax ?? 100;
  const step = q.rangeStep ?? 1;
  return `<span class="table-range-badge">${min} – ${max} <small>(step ${step})</small></span>`;
}

// ─── Render Questions Table ───────────────────────────────────────────────────
function renderQuestions() {
  const allSurveys = getSurveys();
  const surveyIndex = allSurveys.findIndex((s) => s.id === surveyId);
  const survey = surveyIndex !== -1 ? allSurveys[surveyIndex] : null;

  if (!survey) {
    window.location.href = 'index.html';
    return;
  }

  if (surveyHeading) surveyHeading.textContent = `${survey.title}: Questions`;
  if (surveyDesc) surveyDesc.textContent = survey.description || 'Manage and configure questions for this survey.';

  if (surveyMetaPills) {
    surveyMetaPills.innerHTML = getMetaHtml(survey);
  }

  updateSurveyPaginationUI(allSurveys, surveyIndex);

  const allQuestions = survey.questions || [];
  const totalRows = allQuestions.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / ROWS_PER_PAGE));

  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
  const endIndex = Math.min(startIndex + ROWS_PER_PAGE, totalRows);
  const currentSlice = allQuestions.slice(startIndex, endIndex);

  tableBody.innerHTML = '';

  if (currentSlice.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 32px 16px;">
          No questions yet. Click <strong>+ Add Question</strong> to get started.
        </td>
      </tr>
    `;
  } else {
    currentSlice.forEach((q, index) => {
      const tr = document.createElement('tr');
      tr.dataset.id = q.id;

      let optionsCell = '—';
      if (CHOICE_TYPES.includes(q.type)) {
        optionsCell = buildOptionPills(q.options);
      } else if (q.type === 'range' || q.type === 'rating' || q.type === 'scale') {
        optionsCell = buildRangeSummary(q);
      }

      tr.innerHTML = `
        <td>${startIndex + index + 1}</td>
        <th scope="row">${escapeHtml(q.text)}</th>
        <td>
          <span class="type-badge">${TYPE_LABELS[q.type] || escapeHtml(q.type)}</span>
          <div class="table-options-wrap">${optionsCell}</div>
        </td>
        <td>${q.required ? 'Yes' : 'No'}</td>
        <td class="text-right">
          <div class="row-actions">
            <button type="button" class="btn-action btn-edit" aria-label="Edit question">Edit</button>
            <button type="button" class="btn-action btn-delete" aria-label="Delete question">Delete</button>
          </div>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  }

  // Update table pagination UI
  paginationInfo.textContent = totalRows > 0
    ? `Showing ${startIndex + 1}-${endIndex} of ${totalRows}`
    : `Showing 0 of 0`;
  currentPageBadge.textContent = `${currentPage} / ${totalPages}`;

  firstBtn.disabled = currentPage === 1;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  lastBtn.disabled = currentPage === totalPages;
}

function onQuestionsUpdated() {
  renderQuestions();
  if (isSurveyPreviewOpen()) {
    renderPreviewContent(surveyId);
  }
}

// ─── Table Pagination Listeners ────────────────────────────────────────────────
firstBtn?.addEventListener('click', () => {
  currentPage = 1;
  renderQuestions();
});

prevBtn?.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderQuestions();
  }
});

nextBtn?.addEventListener('click', () => {
  const survey = getSurveyById(surveyId);
  const totalPages = Math.max(1, Math.ceil((survey?.questions?.length || 0) / ROWS_PER_PAGE));
  if (currentPage < totalPages) {
    currentPage++;
    renderQuestions();
  }
});

lastBtn?.addEventListener('click', () => {
  const survey = getSurveyById(surveyId);
  currentPage = Math.max(1, Math.ceil((survey?.questions?.length || 0) / ROWS_PER_PAGE));
  renderQuestions();
});

// ─── Modal Actions ─────────────────────────────────────────────────────────────
openCreateBtn?.addEventListener('click', () => {
  openQuestionFormModal({
    surveyId,
    question: null,
    onSave: onQuestionsUpdated,
  });
});

previewSurveyBtn?.addEventListener('click', () => {
  openSurveyPreviewModal(surveyId);
});

// Table row action delegation (Edit & Delete)
tableBody?.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  if (!row || !row.dataset.id) return;

  const qId = row.dataset.id;
  const survey = getSurveyById(surveyId);
  const question = (survey?.questions || []).find((q) => q.id === qId);
  if (!question) return;

  if (e.target.matches('.btn-edit')) {
    openQuestionFormModal({
      surveyId,
      question,
      onSave: onQuestionsUpdated,
    });
  } else if (e.target.matches('.btn-delete')) {
    openQuestionDeleteModal({
      surveyId,
      questionId: question.id,
      onDelete: onQuestionsUpdated,
    });
  }
});

// ─── Initialize Survey Navigation ──────────────────────────────────────────────
initSurveyNavigation({
  getCurrentSurveyId: () => surveyId,
  onSurveyChange: (newSurveyId) => {
    surveyId = newSurveyId;
    currentPage = 1;
    renderQuestions();
    if (isSurveyPreviewOpen()) {
      renderPreviewContent(surveyId);
    }
  },
});

// ─── Initial Load ──────────────────────────────────────────────────────────────
renderQuestions();