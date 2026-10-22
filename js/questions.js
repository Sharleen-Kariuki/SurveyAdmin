// Main Page Orchestrator for Survey Questions Management
import { getSurveys, getSurveyById } from './storage.js';
import { escapeHtml, TYPE_LABELS, CHOICE_TYPES, getMetaHtml, initCsrfProtection } from './utils.js';
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
import { renderToolbarTabs, QUESTION_TOOLBAR_CONFIG } from './toolbarTabs.js';

// ─── Extract Survey ID (URL Search, Hash, Regex, or Session Storage Fallback) ───
function extractSurveyId() {
  // 1. Primary: Standard query string (?id=...)
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const idFromSearch = searchParams.get('id');
    if (idFromSearch && idFromSearch.trim() !== '') {
      return idFromSearch.trim();
    }
  } catch (err) {
    console.warn('[questions.js] Error parsing location.search:', err);
  }

  // 2. Secondary: Hash query parameters (#id=... or #?id=... or #/questions?id=...)
  try {
    if (window.location.hash) {
      const hash = window.location.hash.replace(/^[#/?]+/, '');
      const hashQuery = hash.includes('?') ? hash.split('?')[1] : hash;
      const hashParams = new URLSearchParams(hashQuery);
      const idFromHash = hashParams.get('id');
      if (idFromHash && idFromHash.trim() !== '') {
        return idFromHash.trim();
      }
      if (/^\d+$/.test(hash)) {
        return hash.trim();
      }
    }
  } catch (err) {
    console.warn('[questions.js] Error parsing location.hash:', err);
  }

  // 3. Tertiary: Regex on full URL (handles clean URLs, redirects, encoded queries)
  try {
    const hrefMatch = window.location.href.match(/[?&#]id=([^&#]+)/i);
    if (hrefMatch && hrefMatch[1]) {
      return decodeURIComponent(hrefMatch[1]).trim();
    }
  } catch (err) {
    console.warn('[questions.js] Error parsing href regex:', err);
  }

  // 4. Quaternary: sessionStorage backup (persisted on dashboard click or switcher)
  try {
    const storedId = sessionStorage.getItem('current_survey_id');
    if (storedId && storedId.trim() !== '') {
      return storedId.trim();
    }
  } catch (err) {
    console.warn('[questions.js] Error reading sessionStorage:', err);
  }

  return null;
}

const initialSurveys = getSurveys();
if (!initialSurveys || initialSurveys.length === 0) {
  window.location.href = 'index.html';
}

const params = new URLSearchParams(window.location.search);
const extractedId = extractSurveyId();
console.log('🚀 ~ params:', params);
console.log('🚀 ~ urlId:', params.get('id'));
console.log('🚀 ~ extractedId:', extractedId);

// Validate extracted ID exists in surveys; fallback to first survey if not found
let surveyId = null;
if (extractedId) {
  const matched = initialSurveys.find((s) => String(s.id) === String(extractedId));
  if (matched) {
    surveyId = String(matched.id);
  } else {
    console.warn(`[questions.js] Survey id="${extractedId}" not found in storage. Defaulting to first survey.`);
  }
}

if (!surveyId && initialSurveys.length > 0) {
  surveyId = String(initialSurveys[0].id);
}

// Ensure sessionStorage & browser address bar ?id= are in sync
try {
  sessionStorage.setItem('current_survey_id', surveyId);
  const currentUrl = new URL(window.location.href);
  if (currentUrl.searchParams.get('id') !== surveyId) {
    currentUrl.searchParams.set('id', surveyId);
    window.history.replaceState({ surveyId }, '', currentUrl.toString());
  }
} catch (err) {
  console.warn('[questions.js] Failed syncing URL state:', err);
}

console.log('🚀 ~ active surveyId:', surveyId);


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
renderToolbarTabs('#toolbarTabs', QUESTION_TOOLBAR_CONFIG);
initCsrfProtection();
renderQuestions();