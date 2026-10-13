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
import {
  initQuestionsDataTable,
  destroyQuestionsDataTable
} from './Datatable.js';

// Read ?id= from URL
const params = new URLSearchParams(window.location.search);
let surveyId = params.get('id');

// Validate and initialize surveyId
const initialSurveys = getSurveys();
if (initialSurveys.length === 0) {
  window.location.href = 'index.html';
} else {
  const matched = initialSurveys.find((s) => String(s.id) === String(surveyId));
  if (matched) {
    surveyId = matched.id;
  } else {
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
  let surveyIndex = allSurveys.findIndex((s) => String(s.id) === String(surveyId));
  if (surveyIndex === -1 && allSurveys.length > 0) {
    surveyIndex = 0;
    surveyId = allSurveys[0].id;
  }
  const survey = allSurveys[surveyIndex];

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

  // Tear down existing DataTable before re-populating table rows
  destroyQuestionsDataTable();

  const allQuestions = survey.questions || [];
  tableBody.innerHTML = '';

  if (allQuestions.length > 0) {
    allQuestions.forEach((q, index) => {
      const tr = document.createElement('tr');
      tr.dataset.id = q.id;

      let optionsCell = '—';
      if (CHOICE_TYPES.includes(q.type)) {
        optionsCell = buildOptionPills(q.options);
      } else if (q.type === 'range' || q.type === 'rating' || q.type === 'scale') {
        optionsCell = buildRangeSummary(q);
      }

      tr.innerHTML = `
        <td class="text-left">${index + 1}</td>
        <th scope="row" class="text-left">${escapeHtml(q.text)}</th>
        <td class="text-left">
          <span class="type-badge">${TYPE_LABELS[q.type] || escapeHtml(q.type)}</span>
          <div class="table-options-wrap">${optionsCell}</div>
        </td>
        <td class="text-left">${q.required ? 'Yes' : 'No'}</td>
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

  // Initialize DataTables for Questions with search, filter, sort, and persistence
  initQuestionsDataTable(surveyId, '#questionsTable');
}

function onQuestionsUpdated() {
  renderQuestions();
  if (isSurveyPreviewOpen()) {
    renderPreviewContent(surveyId);
  }
}

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
    renderQuestions();
    if (isSurveyPreviewOpen()) {
      renderPreviewContent(surveyId);
    }
  },
});

// ─── Initial Load ──────────────────────────────────────────────────────────────
renderQuestions();