// Utility helpers and constants for the survey application

/**
 * Escapes HTML characters to prevent Cross-Site Scripting (XSS).
 * Encodes &, <, >, ", ', and backticks.
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
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#96;');
}

/**
 * Sanitizes user-supplied text by stripping raw HTML tags, dangerous javascript:
 * pseudo-protocols, and inline event handler attributes (e.g. onload=, onerror=).
 * Iteratively removes HTML tags to prevent nested tag evasion (e.g. <<SCRIPT>script>).
 * @param {string|null|undefined} str
 * @returns {string} Clean, safe text string
 */
export function sanitizeText(str) {
  if (str === null || str === undefined) return '';
  let clean = String(str);

  // Iteratively strip HTML tags until none remain
  let prev;
  do {
    prev = clean;
    clean = clean.replace(/<[^>]*>/g, '');
  } while (clean !== prev);

  return clean
    .replace(/javascript\s*:/gi, '') // Strip javascript: pseudo-protocol
    .replace(/data\s*:\s*(?:text\/html|application\/javascript)/gi, '') // Strip data: HTML/JS execution
    .replace(/vbscript\s*:/gi, '') // Strip vbscript:
    .replace(/on\w+\s*=/gi, '') // Strip inline event handlers e.g. onload=, onclick=
    .trim();
}

export const XSS_ERROR_MESSAGE = 'Invalid input: HTML tags and unsafe script code are not allowed.';

/**
 * Detects if a string contains HTML tags, script snippets, event handlers,
 * or potential XSS vectors (e.g., `<img src=x onerror=alert(1)>` or `img src=x onerror=alert(1)`).
 * @param {string|null|undefined} str
 * @returns {boolean} True if unsafe content is detected
 */
export function containsXss(str) {
  if (str === null || str === undefined) return false;
  const s = String(str);
  if (!s.trim()) return false;

  // 1. HTML tags or closing tags, or open tags without closing '>' e.g. <img..., <script..., <tag>, </tag>
  const htmlTagPattern = /<\s*[\/!]?[a-zA-Z][^>]*>?/i;

  // 2. Inline DOM event handlers (e.g. onerror=, onload=, onclick=, onfocus=, onmouseover=)
  const eventHandlerPattern = /\bon[a-zA-Z]+\s*=/i;

  // 3. Tag-like attribute patterns without brackets e.g. `img src=`, `script src=`, `iframe src=`
  const tagAttributePattern = /\b(?:img|script|iframe|svg|body|embed|object|video|audio)\s+src\s*=/i;

  // 4. Dangerous URI schemes e.g. javascript:, vbscript:, data:text/html
  const dangerousUriPattern = /(?:javascript|vbscript|data:\s*(?:text\/html|application\/javascript))\s*:/i;

  return htmlTagPattern.test(s) ||
         eventHandlerPattern.test(s) ||
         tagAttributePattern.test(s) ||
         dangerousUriPattern.test(s);
}

/**
 * Validates and sanitizes a URL to prevent javascript: or data: execution.
 * @param {string|null|undefined} url
 * @param {string} [fallback='#']
 * @returns {string} Safe URL
 */
export function sanitizeUrl(url, fallback = '#') {
  if (!url) return fallback;
  const trimmed = String(url).trim();
  if (/^(?:javascript|vbscript|data:\s*(?:text\/html|application\/javascript))/i.test(trimmed)) {
    console.warn('[Security] Blocked unsafe URL protocol:', trimmed);
    return fallback;
  }
  return trimmed;
}

/**
 * Strict DD/MM/YYYY regex pattern: 2 digits day (01-31), 2 digits month (01-12), 4 digits year (1900-2100).
 */
export const DATE_PATTERN = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

/**
 * Validates that a string strictly conforms to the DD/MM/YYYY date pattern
 * and represents a valid calendar day (e.g. rejects Feb 30 or April 31).
 * @param {string|null|undefined} str
 * @returns {boolean} True if strictly valid DD/MM/YYYY date
 */
export function isValidDateFormat(str) {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if (!DATE_PATTERN.test(trimmed)) return false;
  const parts = trimmed.split('/');
  const d = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const y = parseInt(parts[2], 10);
  if (isNaN(d) || isNaN(m) || isNaN(y) || y < 1900 || y > 2100) return false;
  const daysInMonth = new Date(y, m, 0).getDate();
  return d <= daysInMonth;
}

// ─── CSRF (Cross-Site Request Forgery) Protection ───────────────────────────
const CSRF_STORAGE_KEY = 'survey_admin_csrf_token';

/**
 * Returns the active CSRF token, or generates a cryptographically secure token
 * and stores it in sessionStorage.
 * @returns {string} 64-character hexadecimal CSRF token
 */
export function getCsrfToken() {
  try {
    let token = sessionStorage.getItem(CSRF_STORAGE_KEY);
    if (!token || token.length < 32) {
      const bytes = new Uint8Array(32);
      if (window.crypto && window.crypto.getRandomValues) {
        window.crypto.getRandomValues(bytes);
      } else {
        for (let i = 0; i < 32; i++) bytes[i] = Math.floor(Math.random() * 256);
      }
      token = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
      sessionStorage.setItem(CSRF_STORAGE_KEY, token);
    }
    return token;
  } catch (err) {
    console.warn('[Security] sessionStorage unavailable for CSRF token:', err);
    return 'csrf_token_fallback';
  }
}

/**
 * Validates a provided CSRF token against the active session token.
 * @param {string|null|undefined} token 
 * @returns {boolean} True if token matches
 */
export function validateCsrfToken(token) {
  if (!token || typeof token !== 'string') return false;
  const currentToken = getCsrfToken();
  return token === currentToken;
}

/**
 * Initializes CSRF protection on the current page:
 * - Injects hidden CSRF inputs into all forms
 * - Injects a <meta name="csrf-token"> tag into <head>
 * @returns {string} Active CSRF token
 */
export function initCsrfProtection() {
  const token = getCsrfToken();

  // Inject into all existing forms in DOM
  document.querySelectorAll('form').forEach((form) => {
    let csrfInput = form.querySelector('input[name="csrf_token"]');
    if (!csrfInput) {
      csrfInput = document.createElement('input');
      csrfInput.type = 'hidden';
      csrfInput.name = 'csrf_token';
      form.prepend(csrfInput);
    }
    csrfInput.value = token;
  });

  // Keep <meta name="csrf-token"> synced in document head
  let metaTag = document.querySelector('meta[name="csrf-token"]');
  if (!metaTag) {
    metaTag = document.createElement('meta');
    metaTag.name = 'csrf-token';
    document.head.appendChild(metaTag);
  }
  metaTag.content = token;

  return token;
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
    <span class="survey-meta-pill">${qCount} Question${qCount === 1 ? '' : 's'}</span>
    <span class="survey-meta-pill">${rCount} Response${rCount === 1 ? '' : 's'}</span>
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

/**
 * Standardizes rendering or clearing of field validation errors across all dialog input fields.
 * Matches the style and behavior of the preview modal validation errors.
 * @param {object} params
 * @param {HTMLElement} [params.formGroup] - The parent .form-group element
 * @param {HTMLElement} [params.control] - The input / select / textarea / custom wrap element
 * @param {HTMLElement} [params.errorContainer] - The .error-container element
 * @param {string} [params.errorMessage] - Error message text, or empty string to clear
 * @returns {boolean} True if valid (no error), false if error was shown
 */
export function setFieldValidation({ formGroup, control, errorContainer, errorMessage }) {
  const controls = Array.isArray(control)
    ? control
    : (control instanceof NodeList ? Array.from(control) : (control ? [control] : []));

  if (errorMessage) {
    if (formGroup) formGroup.classList.add('has-error');
    controls.forEach((c) => c?.classList?.add('is-invalid'));
    if (errorContainer) {
      errorContainer.innerHTML = `
        <div class="preview-validation-error dialog-validation-error" role="alert">
          <img src="./assets/exclamation.png" alt="Validation error" class="alert-icon-img" />
          <span>${escapeHtml(errorMessage)}</span>
        </div>
      `;
    }
    return false;
  } else {
    if (formGroup) formGroup.classList.remove('has-error');
    controls.forEach((c) => c?.classList?.remove('is-invalid'));
    if (errorContainer) {
      errorContainer.innerHTML = '';
    }
    return true;
  }
}

/**
 * Clears validation error on a field.
 */
export function clearFieldValidation({ formGroup, control, errorContainer }) {
  return setFieldValidation({ formGroup, control, errorContainer, errorMessage: '' });
}

/**
 * Clears all validation errors inside a container or dialog form.
 * @param {HTMLElement} container 
 */
export function clearAllValidationErrors(container) {
  if (!container) return;
  container.querySelectorAll('.has-error').forEach((el) => el.classList.remove('has-error'));
  container.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
  container.querySelectorAll('.error-container').forEach((el) => { el.innerHTML = ''; });
}

