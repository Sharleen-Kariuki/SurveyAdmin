import { mockSurveys } from './mockData.js';
import { sanitizeText, validateCsrfToken, containsXss } from './utils.js';

const STORAGE_KEY = 'surveys_db';
const SEED_VERSION_KEY = 'surveys_faker_version';
const CURRENT_VERSION = 'faker_v5_strict_dates';

export function formatFullDate(d = new Date()) {
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function toFullDate(val, fallbackYear = '2024', index = 1) {
  if (!val) return `15/06/${fallbackYear}`;
  const str = String(val).trim();
  // If already valid DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
    return str;
  }
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
    const parts = str.split('/');
    return `${parts[0].padStart(2, '0')}/${parts[1].padStart(2, '0')}/${parts[2]}`;
  }
  // If legacy standalone 4-digit year, convert to full DD/MM/YYYY pattern
  if (/^\d{4}$/.test(str)) {
    const day = String(((index * 7) % 28) + 1).padStart(2, '0');
    const month = String(((index * 3) % 12) + 1).padStart(2, '0');
    return `${day}/${month}/${str}`;
  }
  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    return formatFullDate(parsed);
  }
  return `15/06/${fallbackYear}`;
}

export const defaultSurveys = mockSurveys.map((s, idx) => ({
  ...s,
  createdAt: toFullDate(s.createdAt, '2024', idx + 1),
  updatedAt: toFullDate(s.updatedAt, '2026', idx + 3)
}));

// Resets or replaces localStorage surveys with generated mock data
export function resetToMockData(customSurveys = null) {
  const data = customSurveys || defaultSurveys;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  localStorage.setItem(SEED_VERSION_KEY, CURRENT_VERSION);
  return data;
}

// Retrieves surveys from localStorage; dynamically seeds with mockSurveys if empty or outdated
export function getSurveys() {
  const currentSeed = localStorage.getItem(SEED_VERSION_KEY);
  const data = localStorage.getItem(STORAGE_KEY);

  // If never seeded or version outdated, dynamically seed with full-date defaultSurveys
  if (!data || currentSeed !== CURRENT_VERSION) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSurveys));
    localStorage.setItem(SEED_VERSION_KEY, CURRENT_VERSION);
    return defaultSurveys;
  }

  try {
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSurveys));
      localStorage.setItem(SEED_VERSION_KEY, CURRENT_VERSION);
      return defaultSurveys;
    }

    // Ensure all surveys have string IDs, previewColumns, and full dates
    let needsUpdate = false;
    parsed.forEach((s, idx) => {
      if (typeof s.id !== 'string') {
        s.id = String(s.id);
        needsUpdate = true;
      }
      if (!s.previewColumns) {
        s.previewColumns = 2;
        needsUpdate = true;
      }
      if (/^\d{4}$/.test(s.createdAt)) {
        s.createdAt = toFullDate(s.createdAt, '2024', idx + 1);
        needsUpdate = true;
      }
      if (/^\d{4}$/.test(s.updatedAt)) {
        s.updatedAt = toFullDate(s.updatedAt, '2026', idx + 3);
        needsUpdate = true;
      }
    });

    // Auto-enrich any surveys missing from mockSurveys
    defaultSurveys.forEach((defSurvey) => {
      const existing = parsed.find((s) => String(s.id) === String(defSurvey.id));
      if (!existing) {
        parsed.push(defSurvey);
        needsUpdate = true;
      } else if (!existing.questions || existing.questions.length < defSurvey.questions.length) {
        existing.questions = defSurvey.questions;
        needsUpdate = true;
      }
    });

    if (needsUpdate) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    }

    return parsed;
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSurveys));
    localStorage.setItem(SEED_VERSION_KEY, CURRENT_VERSION);
    return defaultSurveys;
  }
}

// Adds a survey to local storage.
export function saveSurveys(surveys) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(surveys));
}

// Deletes a survey from local storage based on the provided survey ID.
export function deleteSurveyById(id, csrfToken = null) {
  if (csrfToken !== null && !validateCsrfToken(csrfToken)) {
    console.error('[Security] Blocked unauthorized deletion: Invalid CSRF token.');
    return;
  }
  const surveys = getSurveys().filter(s => String(s.id) !== String(id));
  saveSurveys(surveys);
}

// Saves or updates a survey in local storage. If the surveyData contains an id, it updates the existing survey; otherwise, it creates a new survey with a unique id.
export function saveOrUpdateSurvey(surveyData) {
  if (surveyData.csrfToken && !validateCsrfToken(surveyData.csrfToken)) {
    console.error('[Security] Blocked unauthorized save: Invalid CSRF token.');
    return null;
  }

  // Reject saves containing unsafe XSS payloads
  if (containsXss(surveyData.title) || containsXss(surveyData.description)) {
    console.error('[Security] Blocked survey save: Title or description contains disallowed script/HTML content.');
    return null;
  }

  const surveys = getSurveys();
  const currentDate = formatFullDate();
  const previewColumns = Math.max(1, Math.min(3, parseInt(surveyData.previewColumns, 10) || 2));

  // Sanitize text fields to neutralize any XSS payloads
  const cleanTitle = sanitizeText(surveyData.title);
  const cleanDescription = sanitizeText(surveyData.description);
  const cleanStatus = ['Active', 'Inactive', 'Pending'].includes(surveyData.status) ? surveyData.status : 'Active';

  if (surveyData.id) {
    // Edit existing
    const index = surveys.findIndex(s => String(s.id) === String(surveyData.id));
    if (index !== -1) {
      surveys[index] = {
        ...surveys[index],
        title: cleanTitle,
        description: cleanDescription,
        status: cleanStatus,
        previewColumns,
        updatedAt: currentDate
      };
      saveSurveys(surveys);
      return surveyData.id;
    }
  }

  // Create new survey
  const newId = Date.now().toString();
  surveys.push({
    id: newId,
    title: cleanTitle,
    description: cleanDescription,
    status: cleanStatus,
    previewColumns,
    responses: 0,
    questions: [],
    createdAt: currentDate,
    updatedAt: currentDate
  });

  saveSurveys(surveys);
  return newId;
}

export function getSurveyById(id) {
  const surveys = getSurveys();
  return surveys.find((s) => String(s.id) === String(id)) || null;
}

export function saveQuestion(surveyId, questionData) {
  if (questionData.csrfToken && !validateCsrfToken(questionData.csrfToken)) {
    console.error('[Security] Blocked unauthorized question save: Invalid CSRF token.');
    return null;
  }

  // Reject saves containing unsafe XSS payloads
  if (containsXss(questionData.text) || (Array.isArray(questionData.options) && questionData.options.some((opt) => containsXss(opt)))) {
    console.error('[Security] Blocked question save: Question text or choices contain disallowed script/HTML content.');
    return null;
  }

  const surveys = getSurveys();
  const survey = surveys.find((s) => String(s.id) === String(surveyId));
  if (!survey) return null;

  if (!survey.questions) {
    survey.questions = [];
  }

  const currentDate = formatFullDate();
  survey.updatedAt = currentDate;

  // Sanitize question inputs
  const cleanQuestion = {
    ...questionData,
    text: sanitizeText(questionData.text),
    options: Array.isArray(questionData.options) ? questionData.options.map(opt => sanitizeText(opt)) : []
  };

  let savedId = questionData.id;
  if (questionData.id) {
    // Edit existing question
    const index = survey.questions.findIndex((q) => String(q.id) === String(questionData.id));
    if (index !== -1) {
      survey.questions[index] = { ...survey.questions[index], ...cleanQuestion };
    }
  } else {
    // Add new question
    savedId = Date.now().toString();
    survey.questions.push({
      ...cleanQuestion,
      id: savedId,
    });
  }

  saveSurveys(surveys);
  return savedId;
}

// Deletes a question from a survey based on the provided survey ID and question ID.
export function deleteQuestion(surveyId, questionId, csrfToken = null) {
  if (csrfToken !== null && !validateCsrfToken(csrfToken)) {
    console.error('[Security] Blocked unauthorized question deletion: Invalid CSRF token.');
    return;
  }

  const surveys = getSurveys();
  const survey = surveys.find((s) => String(s.id) === String(surveyId));
  if (!survey || !survey.questions) return;

  survey.updatedAt = formatFullDate();
  survey.questions = survey.questions.filter((q) => String(q.id) !== String(questionId));
  saveSurveys(surveys);
}