// Manages survey switcher dropdowns and survey-level pagination buttons
import { getSurveys } from './storage.js';
import { escapeHtml } from './utils.js';

// Hero Section Elements
const pageSurveySelect = document.getElementById('surveySelectDropdown');
const pageFirstSurveyBtn = document.getElementById('pageFirstSurveyBtn');
const pagePrevSurveyBtn = document.getElementById('pagePrevSurveyBtn');
const pageSurveyBadge = document.getElementById('pageSurveyBadge');
const pageNextSurveyBtn = document.getElementById('pageNextSurveyBtn');
const pageLastSurveyBtn = document.getElementById('pageLastSurveyBtn');

// Preview Modal Elements (Header & Footer)
const previewSurveySelect = document.getElementById('previewSurveySelect');
const previewFirstSurveyBtn = document.getElementById('previewFirstSurveyBtn');
const previewPrevSurveyBtn = document.getElementById('previewPrevSurveyBtn');
const previewSurveyBadge = document.getElementById('previewSurveyBadge');
const previewNextSurveyBtn = document.getElementById('previewNextSurveyBtn');
const previewLastSurveyBtn = document.getElementById('previewLastSurveyBtn');

const previewFooterFirstBtn = document.getElementById('previewFooterFirstBtn');
const previewFooterPrevBtn = document.getElementById('previewFooterPrevBtn');
const previewFooterBadge = document.getElementById('previewFooterBadge');
const previewFooterNextBtn = document.getElementById('previewFooterNextBtn');
const previewFooterLastBtn = document.getElementById('previewFooterLastBtn');

let onSurveyChangeCallback = null;
let getCurrentSurveyIdFn = null;

function syncSurveyDropdowns(allSurveys, currentId) {
  const optionsHtml = allSurveys
    .map((s, idx) => `<option value="${escapeHtml(s.id)}" ${s.id === currentId ? 'selected' : ''}>${idx + 1}. ${escapeHtml(s.title)}</option>`)
    .join('');

  if (pageSurveySelect) pageSurveySelect.innerHTML = optionsHtml;
  if (previewSurveySelect) previewSurveySelect.innerHTML = optionsHtml;
}

export function updateSurveyPaginationUI(allSurveys, currentIndex) {
  const total = allSurveys.length;
  const badgeText = `${currentIndex + 1} / ${total}`;
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= total - 1;

  [pageSurveyBadge, previewSurveyBadge, previewFooterBadge].forEach((badge) => {
    if (badge) badge.textContent = badgeText;
  });

  [pageFirstSurveyBtn, previewFirstSurveyBtn, previewFooterFirstBtn].forEach((btn) => {
    if (btn) btn.disabled = isFirst;
  });

  [pagePrevSurveyBtn, previewPrevSurveyBtn, previewFooterPrevBtn].forEach((btn) => {
    if (btn) btn.disabled = isFirst;
  });

  [pageNextSurveyBtn, previewNextSurveyBtn, previewFooterNextBtn].forEach((btn) => {
    if (btn) btn.disabled = isLast;
  });

  [pageLastSurveyBtn, previewLastSurveyBtn, previewFooterLastBtn].forEach((btn) => {
    if (btn) btn.disabled = isLast;
  });

  syncSurveyDropdowns(allSurveys, allSurveys[currentIndex]?.id);
}

export function switchSurveyByIndex(targetIndex) {
  const allSurveys = getSurveys();
  if (targetIndex < 0 || targetIndex >= allSurveys.length) return;

  const targetSurveyId = allSurveys[targetIndex].id;

  // Update browser URL query parameter without full reload
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set('id', targetSurveyId);
  window.history.replaceState({ surveyId: targetSurveyId }, '', newUrl.toString());

  if (onSurveyChangeCallback) {
    onSurveyChangeCallback(targetSurveyId);
  }
}

export function goToSurvey(direction) {
  const allSurveys = getSurveys();
  const currentId = getCurrentSurveyIdFn ? getCurrentSurveyIdFn() : null;
  const currentIndex = allSurveys.findIndex((s) => s.id === currentId);
  if (currentIndex === -1) return;

  let targetIndex = currentIndex;
  if (direction === 'first') targetIndex = 0;
  else if (direction === 'prev') targetIndex = Math.max(0, currentIndex - 1);
  else if (direction === 'next') targetIndex = Math.min(allSurveys.length - 1, currentIndex + 1);
  else if (direction === 'last') targetIndex = allSurveys.length - 1;

  if (targetIndex !== currentIndex) {
    switchSurveyByIndex(targetIndex);
  }
}

export function initSurveyNavigation({ onSurveyChange, getCurrentSurveyId }) {
  onSurveyChangeCallback = onSurveyChange;
  getCurrentSurveyIdFn = getCurrentSurveyId;

  // Page Hero listeners
  if (pageFirstSurveyBtn) pageFirstSurveyBtn.addEventListener('click', () => goToSurvey('first'));
  if (pagePrevSurveyBtn) pagePrevSurveyBtn.addEventListener('click', () => goToSurvey('prev'));
  if (pageNextSurveyBtn) pageNextSurveyBtn.addEventListener('click', () => goToSurvey('next'));
  if (pageLastSurveyBtn) pageLastSurveyBtn.addEventListener('click', () => goToSurvey('last'));

  if (pageSurveySelect) {
    pageSurveySelect.addEventListener('change', (e) => {
      const allSurveys = getSurveys();
      const idx = allSurveys.findIndex((s) => s.id === e.target.value);
      if (idx !== -1) switchSurveyByIndex(idx);
    });
  }

  // Preview Header listeners
  if (previewFirstSurveyBtn) previewFirstSurveyBtn.addEventListener('click', () => goToSurvey('first'));
  if (previewPrevSurveyBtn) previewPrevSurveyBtn.addEventListener('click', () => goToSurvey('prev'));
  if (previewNextSurveyBtn) previewNextSurveyBtn.addEventListener('click', () => goToSurvey('next'));
  if (previewLastSurveyBtn) previewLastSurveyBtn.addEventListener('click', () => goToSurvey('last'));

  if (previewSurveySelect) {
    previewSurveySelect.addEventListener('change', (e) => {
      const allSurveys = getSurveys();
      const idx = allSurveys.findIndex((s) => s.id === e.target.value);
      if (idx !== -1) switchSurveyByIndex(idx);
    });
  }

  // Preview Footer listeners
  if (previewFooterFirstBtn) previewFooterFirstBtn.addEventListener('click', () => goToSurvey('first'));
  if (previewFooterPrevBtn) previewFooterPrevBtn.addEventListener('click', () => goToSurvey('prev'));
  if (previewFooterNextBtn) previewFooterNextBtn.addEventListener('click', () => goToSurvey('next'));
  if (previewFooterLastBtn) previewFooterLastBtn.addEventListener('click', () => goToSurvey('last'));
}
