//  Serves as the clean public entry point. 
// It configures initSurveyDataTable() and initQuestionsDataTable().


import {
  SURVEY_COLUMN_NAMES,
  QUESTION_COLUMN_NAMES,
  RELATION_LABELS,
  SURVEY_COLUMN_TYPES,
  QUESTION_COLUMN_TYPES
} from './datatable/constants.js';
import { createTableController } from './datatable/controller.js';
import { applyHighlights, removeHighlights } from './datatable/highlight.js';
import { escapeHtml } from './utils.js';
import { renderToolbarTabs, SURVEY_TOOLBAR_CONFIG, QUESTION_TOOLBAR_CONFIG } from './toolbarTabs.js';

// Re-export constants & utilities for backward compatibility
export {
  SURVEY_COLUMN_NAMES,
  QUESTION_COLUMN_NAMES,
  RELATION_LABELS,
  SURVEY_COLUMN_TYPES,
  QUESTION_COLUMN_TYPES,
  applyHighlights,
  removeHighlights,
  escapeHtml,
  renderToolbarTabs,
  SURVEY_TOOLBAR_CONFIG,
  QUESTION_TOOLBAR_CONFIG
};

// ─── Survey Table Controller (index.html) ────────────────────────────────────
let surveyController = null;

export function initSurveyDataTable(selector = '#surveyTable') {
  renderToolbarTabs('#toolbarTabs', SURVEY_TOOLBAR_CONFIG);
  if (!surveyController) {
    surveyController = createTableController({
      tableId: 'surveyTable',
      selector,
      storageKey: 'surveys',
      columnNames: SURVEY_COLUMN_NAMES,
      columnTypes: SURVEY_COLUMN_TYPES,
      allFilterCols: [0, 1, 2, 3, 4, 5],
      defaultSort: [[4, 'desc']],
      nonSortableCols: [6],
      language: {
        info: 'Showing _START_ to _END_ of _TOTAL_ surveys',
        infoEmpty: 'Showing 0 surveys',
        infoFiltered: '(filtered from _MAX_ total)',
        zeroRecords: 'No matching surveys found',
        emptyTable: 'No surveys available. Click <strong>+ Create Survey</strong> to add one.'
      }
    });
  }

  return surveyController.init();
}

export function destroySurveyDataTable() {
  if (surveyController) {
    surveyController.destroy();
  }
}

export function getSurveyDataTable() {
  return surveyController ? surveyController.getInstance() : null;
}

// ─── Questions Table Controller (questions.html) ─────────────────────────────
let questionsController = null;
let currentQuestionsSurveyId = null;

export function initQuestionsDataTable(surveyId, selector = '#questionsTable') {
  renderToolbarTabs('#toolbarTabs', QUESTION_TOOLBAR_CONFIG);
  const safeSurveyId = surveyId || 'default';

  if (!questionsController || currentQuestionsSurveyId !== safeSurveyId) {
    currentQuestionsSurveyId = safeSurveyId;
    questionsController = createTableController({
      tableId: 'questionsTable',
      selector,
      storageKey: `questions_${safeSurveyId}`,
      columnNames: QUESTION_COLUMN_NAMES,
      columnTypes: QUESTION_COLUMN_TYPES,
      allFilterCols: [1, 2, 3], // Filterable text columns (Text, Type, Required)
      defaultSort: [[0, 'asc']], // Default: order by # ascending
      nonSortableCols: [4], // Actions column non-sortable
      language: {
        info: 'Showing _START_ to _END_ of _TOTAL_ questions',
        infoEmpty: 'Showing 0 questions',
        infoFiltered: '(filtered from _MAX_ total)',
        zeroRecords: 'No matching questions found',
        emptyTable: 'No questions yet. Click <strong>+ Add Question</strong> to get started.'
      }
    });
  }

  return questionsController.init();
}

export function destroyQuestionsDataTable() {
  if (questionsController) {
    questionsController.destroy();
  }
}

export function getQuestionsDataTable() {
  return questionsController ? questionsController.getInstance() : null;
}