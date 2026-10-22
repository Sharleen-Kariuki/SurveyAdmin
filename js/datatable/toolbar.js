// Manages inline non-global search, multi-condition filter builder, multi-column sort builder,
// columns visibility, and the active configuration pills bar.
import { RELATION_LABELS } from './constants.js';
import { escapeHtml, setFieldValidation, clearFieldValidation, clearAllValidationErrors, DATE_PATTERN, isValidDateFormat } from '../utils.js';

let cachedColumnNames = {};
let cachedColumnTypes = {};
let cachedNonSortableCols = [];
let cachedDefaultSort = [[0, 'asc']];

export function closeAllDropdowns() {
  const tabs = [
    { btnId: 'tabBtnFilter', panelId: 'dropdownFilter' },
    { btnId: 'tabBtnSort', panelId: 'dropdownSort' },
    { btnId: 'tabBtnColumns', panelId: 'dropdownColumns' }
  ];

  tabs.forEach(({ btnId, panelId }) => {
    const btn = document.getElementById(btnId);
    const panel = document.getElementById(panelId);
    if (btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-expanded', 'false');
      btn.closest('.toolbar-dropdown-wrapper')?.classList.remove('has-open-dropdown');
    }
    if (panel) {
      panel.classList.remove('open');
      panel.style.left = '';
      panel.style.right = '';
    }
  });

  // Reset column search input on dropdown close
  const colSearch = document.getElementById('columnSearchInput');
  if (colSearch && colSearch.value) {
    colSearch.value = '';
    const btnClear = document.getElementById('btnClearColumnSearch');
    if (btnClear) btnClear.hidden = true;
    const columnsList = document.getElementById('columnsCheckboxList');
    if (columnsList) {
      columnsList.querySelectorAll('.col-checkbox-item').forEach((item) => {
        item.style.display = '';
      });
    }
    const emptyMsg = document.getElementById('columnsEmptyMessage');
    if (emptyMsg) emptyMsg.hidden = true;
  }
}

export function getPlaceholderForColumn(colType) {
  if (colType === 'date') {
    return 'e.g. 13/10/2025 (DD/MM/YYYY)';
  }
  if (colType === 'number') {
    return 'e.g. 10 (number)...';
  }
  if (colType === 'text') {
    return 'Type text (e.g. Survey)...';
  }
  return 'Search value...';
}

/**
 * Validates that an input value matches the expected column datatype.
 * If text: rejects numbers or non-letter input.
 * If number: rejects non-numeric input.
 * If date: requires valid date numbers and slashes.
 */
export function validateFilterInput(value, colType) {
  const trimmed = String(value || '').trim();
  if (!trimmed) {
    return { valid: true };
  }

  if (colType === 'date') {
    // 1. Explicitly disallow standalone numbers (e.g. 2024, 12345, 12)
    if (/^\d+$/.test(trimmed)) {
      return {
        valid: false,
        message: 'Invalid date. Standalone numbers are not allowed. Please use DD/MM/YYYY pattern (e.g. 15/06/2024).'
      };
    }

    // 2. Reject any input that does not strictly match the DD/MM/YYYY pattern
    const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) {
      return {
        valid: false,
        message: 'Invalid date format. Date must follow the DD/MM/YYYY pattern (e.g. 15/06/2024).'
      };
    }

    const d = parseInt(match[1], 10);
    const m = parseInt(match[2], 10);
    const y = parseInt(match[3], 10);
    if (isNaN(d) || isNaN(m) || isNaN(y) || m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > 2100) {
      return {
        valid: false,
        message: 'Invalid date. Use DD/MM/YYYY with day 01-31, month 01-12, and 4-digit year.'
      };
    }

    // 3. Reject invalid calendar days for the specific month/year
    const daysInMonth = new Date(y, m, 0).getDate();
    if (d > daysInMonth) {
      return {
        valid: false,
        message: `Invalid date. Month ${m} only has ${daysInMonth} days.`
      };
    }

    return { valid: true };
  }

  if (colType === 'text') {
    if (/^\d+$/.test(trimmed)) {
      return {
        valid: false,
        message: 'This column only accepts text values (cannot be numbers).'
      };
    }
    if (!/[a-zA-Z]/.test(trimmed)) {
      return {
        valid: false,
        message: 'This column only accepts text (must contain letters).'
      };
    }
    return { valid: true };
  }

  if (colType === 'number') {
    const cleanNum = trimmed.replace(/[$,]/g, '');
    if (isNaN(Number(cleanNum)) || cleanNum === '') {
      return {
        valid: false,
        message: 'This column only accepts numeric values.'
      };
    }
    return { valid: true };
  }

  return { valid: true };
}

// ─── Inline Search Helpers ───────────────────────────────────────────────────

export function updateInlineSearchRelations(colKey, columnTypes = {}) {
  const colType = columnTypes[colKey] || 'all';
  const relSelect = document.getElementById('inlineSearchRelationSelect');
  const valInput = document.getElementById('inlineSearchValueInput');

  if (valInput) {
    valInput.placeholder = getPlaceholderForColumn(colType);
    if (colType === 'date') {
      valInput.setAttribute('pattern', '\\d{2}/\\d{2}/\\d{4}');
      valInput.setAttribute('inputmode', 'numeric');
      valInput.setAttribute('maxlength', '10');
      valInput.setAttribute('title', 'Format: DD/MM/YYYY (e.g. 15/06/2024)');
    } else {
      valInput.removeAttribute('pattern');
      valInput.removeAttribute('inputmode');
      valInput.removeAttribute('maxlength');
      valInput.removeAttribute('title');
    }
  }

  if (relSelect) {
    const currentRel = relSelect.value;
    const isNumericRel = ['gt', 'lt', 'gte', 'lte'].includes(currentRel);

    Array.from(relSelect.options).forEach((opt) => {
      const isNum = ['gt', 'lt', 'gte', 'lte'].includes(opt.value);
      if (colType === 'text') {
        opt.disabled = isNum;
        opt.hidden = isNum;
      } else if (colType === 'number') {
        const isTextOnly = ['contains', 'starts_with', 'ends_with'].includes(opt.value);
        opt.disabled = isTextOnly;
        opt.hidden = isTextOnly;
      } else {
        opt.disabled = false;
        opt.hidden = false;
      }
    });

    if (colType === 'text' && isNumericRel) {
      relSelect.value = 'contains';
    } else if (colType === 'number' && ['contains', 'starts_with', 'ends_with'].includes(currentRel)) {
      relSelect.value = 'equals';
    }
  }
}

// ─── Multi-Filter Builder Helpers ─────────────────────────────────────────────

function createFilterRowElement(rule, index, columnNames, columnTypes) {
  const row = document.createElement('div');
  row.className = 'filter-rule-row';
  row.dataset.ruleId = rule.id;

  const colType = columnTypes[rule.col] || 'all';

  // Build column select options
  const colOptions = [
    '<option value="all">All Columns</option>',
    ...Object.entries(columnNames)
      .filter(([k, name]) => name !== 'Actions')
      .map(([k, name]) => `<option value="${k}" ${String(rule.col) === String(k) ? 'selected' : ''}>${escapeHtml(name)}</option>`)
  ].join('');

  // Build relation select options
  const relations = [
    { val: 'contains', label: 'Contains' },
    { val: 'equals', label: 'Equals' },
    { val: 'not_equals', label: 'Does not equal' },
    { val: 'starts_with', label: 'Starts with' },
    { val: 'ends_with', label: 'Ends with' },
    { val: 'gt', label: 'Greater than / After (>)' },
    { val: 'lt', label: 'Less than / Before (<)' },
    { val: 'gte', label: 'Greater or equal / After (>=)' },
    { val: 'lte', label: 'Less or equal / Before (<=)' }
  ];

  const relOptions = relations.map((r) => {
    const isNum = ['gt', 'lt', 'gte', 'lte'].includes(r.val);
    const isTextOnly = ['contains', 'starts_with', 'ends_with'].includes(r.val);
    let disabled = false;
    if (colType === 'text' && isNum) disabled = true;
    if (colType === 'number' && isTextOnly) disabled = true;

    return `<option value="${r.val}" ${disabled ? 'disabled hidden' : ''} ${rule.relation === r.val ? 'selected' : ''}>${escapeHtml(r.label)}</option>`;
  }).join('');

  row.innerHTML = `
    <div class="rule-header">
      <span class="rule-conjunction">${index === 0 ? 'Where' : 'And'}</span>
      <button type="button" class="btn-remove-rule" title="Remove filter condition" aria-label="Remove filter condition">&times;</button>
    </div>
    <div class="rule-fields-grid">
      <div class="rule-field">
        <label class="rule-field-label">Column</label>
        <select class="toolbar-select rule-col-select">
          ${colOptions}
        </select>
      </div>
      <div class="rule-field">
        <label class="rule-field-label">Relationship</label>
        <select class="toolbar-select rule-rel-select">
          ${relOptions}
        </select>
      </div>
      <div class="rule-field">
        <label class="rule-field-label">Value</label>
        <input type="text" class="toolbar-input rule-val-input" placeholder="${getPlaceholderForColumn(colType)}" value="${escapeHtml(rule.value || '')}" />
        <div class="error-container"></div>
      </div>
    </div>
  `;

  // Col select listener to adjust relation, placeholder, and validation
  const colSelect = row.querySelector('.rule-col-select');
  const relSelect = row.querySelector('.rule-rel-select');
  const valInput = row.querySelector('.rule-val-input');
  const valField = valInput?.closest('.rule-field');
  const errorContainer = valField?.querySelector('.error-container');

  colSelect.addEventListener('change', () => {
    const newCol = colSelect.value;
    const newType = columnTypes[newCol] || 'all';

    valInput.placeholder = getPlaceholderForColumn(newType);
    if (newType === 'date') {
      valInput.setAttribute('pattern', '\\d{2}/\\d{2}/\\d{4}');
      valInput.setAttribute('inputmode', 'numeric');
      valInput.setAttribute('maxlength', '10');
      valInput.setAttribute('title', 'Format: DD/MM/YYYY (e.g. 15/06/2024)');
    } else {
      valInput.removeAttribute('pattern');
      valInput.removeAttribute('inputmode');
      valInput.removeAttribute('maxlength');
      valInput.removeAttribute('title');
    }
    Array.from(relSelect.options).forEach((opt) => {
      const isNum = ['gt', 'lt', 'gte', 'lte'].includes(opt.value);
      const isTextOnly = ['contains', 'starts_with', 'ends_with'].includes(opt.value);
      if (newType === 'text') {
        opt.disabled = isNum;
        opt.hidden = isNum;
      } else if (newType === 'number') {
        opt.disabled = isTextOnly;
        opt.hidden = isTextOnly;
      } else {
        opt.disabled = false;
        opt.hidden = false;
      }
    });

    if (newType === 'text' && ['gt', 'lt', 'gte', 'lte'].includes(relSelect.value)) {
      relSelect.value = 'contains';
    } else if (newType === 'number' && ['contains', 'starts_with', 'ends_with'].includes(relSelect.value)) {
      relSelect.value = 'equals';
    }

    if (valInput.value.trim()) {
      const check = validateFilterInput(valInput.value, newType);
      if (!check.valid) {
        setFieldValidation({
          formGroup: valField,
          control: valInput,
          errorContainer,
          errorMessage: check.message
        });
      } else {
        clearFieldValidation({
          formGroup: valField,
          control: valInput,
          errorContainer
        });
      }
    } else {
      clearFieldValidation({
        formGroup: valField,
        control: valInput,
        errorContainer
      });
    }
  });

  valInput.addEventListener('input', () => {
    const currentType = columnTypes[colSelect.value] || 'all';
    const val = valInput.value.trim();
    if (!val) {
      clearFieldValidation({ formGroup: valField, control: valInput, errorContainer });
      return;
    }

    if (currentType === 'date') {
      if (!/^[\d/]+$/.test(val)) {
        setFieldValidation({
          formGroup: valField,
          control: valInput,
          errorContainer,
          errorMessage: 'Date only accepts numbers and slashes in DD/MM/YYYY format.'
        });
        return;
      }
      if (/^\d{4,}$/.test(val)) {
        setFieldValidation({
          formGroup: valField,
          control: valInput,
          errorContainer,
          errorMessage: 'Standalone numbers are not allowed. Use DD/MM/YYYY pattern (e.g. 15/06/2024).'
        });
        return;
      }
      if (val.length >= 10) {
        const check = validateFilterInput(val, 'date');
        if (!check.valid) {
          setFieldValidation({ formGroup: valField, control: valInput, errorContainer, errorMessage: check.message });
          return;
        }
      }
      clearFieldValidation({ formGroup: valField, control: valInput, errorContainer });
      return;
    }

    const check = validateFilterInput(val, currentType);
    if (!check.valid) {
      setFieldValidation({
        formGroup: valField,
        control: valInput,
        errorContainer,
        errorMessage: check.message
      });
    } else {
      clearFieldValidation({
        formGroup: valField,
        control: valInput,
        errorContainer
      });
    }
  });

  valInput.addEventListener('blur', () => {
    const currentType = columnTypes[colSelect.value] || 'all';
    const val = valInput.value.trim();
    if (val && currentType === 'date') {
      const check = validateFilterInput(val, 'date');
      if (!check.valid) {
        setFieldValidation({
          formGroup: valField,
          control: valInput,
          errorContainer,
          errorMessage: check.message
        });
      }
    }
  });

  return row;
}

export function renderFilterRulesDom(rules, columnNames, columnTypes) {
  const container = document.getElementById('filterRulesList');
  if (!container) return;

  container.innerHTML = '';
  const effectiveRules = rules && rules.length > 0
    ? rules
    : [{ id: 'f_default_' + Date.now(), col: 'all', relation: 'contains', value: '' }];

  effectiveRules.forEach((rule, idx) => {
    const rowEl = createFilterRowElement(rule, idx, columnNames, columnTypes);
    const removeBtn = rowEl.querySelector('.btn-remove-rule');
    removeBtn.addEventListener('click', () => {
      rowEl.remove();
      updateFilterConjunctions();
      if (container.children.length === 0) {
        renderFilterRulesDom([], columnNames, columnTypes);
      }
    });
    container.appendChild(rowEl);
  });

  updateFilterConjunctions();
}

function updateFilterConjunctions() {
  const container = document.getElementById('filterRulesList');
  if (!container) return;
  const rows = container.querySelectorAll('.filter-rule-row');
  rows.forEach((row, idx) => {
    const badge = row.querySelector('.rule-conjunction');
    if (badge) {
      badge.textContent = idx === 0 ? 'Where' : 'And';
    }
  });
}

export function getFilterRulesFromDom(columnTypes) {
  const container = document.getElementById('filterRulesList');
  if (!container) return { valid: true, rules: [] };

  const rows = container.querySelectorAll('.filter-rule-row');
  const rules = [];
  let allValid = true;

  rows.forEach((row) => {
    const ruleId = row.dataset.ruleId;
    const colSelect = row.querySelector('.rule-col-select');
    const relSelect = row.querySelector('.rule-rel-select');
    const valInput = row.querySelector('.rule-val-input');
    const valField = valInput?.closest('.rule-field') || row;
    const errorContainer = valField?.querySelector('.error-container') || row.querySelector('.error-container');

    const col = colSelect ? colSelect.value : 'all';
    const relation = relSelect ? relSelect.value : 'contains';
    const val = valInput ? valInput.value.trim() : '';
    const colType = columnTypes[col] || 'all';

    if (!val) {
      setFieldValidation({
        formGroup: valField,
        control: valInput,
        errorContainer,
        errorMessage: 'Filter value is required.'
      });
      allValid = false;
    } else {
      const check = validateFilterInput(val, colType);
      if (!check.valid) {
        setFieldValidation({
          formGroup: valField,
          control: valInput,
          errorContainer,
          errorMessage: check.message
        });
        allValid = false;
      } else {
        clearFieldValidation({
          formGroup: valField,
          control: valInput,
          errorContainer
        });
        rules.push({ id: ruleId, col, relation, value: val });
      }
    }
  });

  return { valid: allValid, rules };
}

// ─── Multi-Sort Builder Helpers ───────────────────────────────────────────────

function createSortRowElement(rule, index, columnNames, nonSortableCols) {
  const row = document.createElement('div');
  row.className = 'sort-rule-row';
  row.dataset.sortId = rule.id;

  const sortableEntries = Object.entries(columnNames)
    .filter(([k]) => !nonSortableCols.includes(Number(k)));

  const colOptions = sortableEntries.map(([k, name]) =>
    `<option value="${k}" ${String(rule.col) === String(k) ? 'selected' : ''}>${escapeHtml(name)}</option>`
  ).join('');

  row.innerHTML = `
    <div class="rule-header">
      <span class="rule-conjunction">${index === 0 ? 'Sort by (Primary)' : 'Then by'}</span>
      <button type="button" class="btn-remove-rule" title="Remove sort level" aria-label="Remove sort level">&times;</button>
    </div>
    <div class="sort-fields-grid">
      <div class="rule-field">
        <label class="rule-field-label">Column</label>
        <select class="toolbar-select rule-sort-col-select">
          ${colOptions}
        </select>
      </div>
      <div class="rule-field">
        <label class="rule-field-label">Ordering</label>
        <select class="toolbar-select rule-sort-dir-select">
          <option value="asc" ${rule.dir === 'asc' ? 'selected' : ''}>Ascending (A-Z / Low to High / Oldest)</option>
          <option value="desc" ${rule.dir === 'desc' ? 'selected' : ''}>Descending (Z-A / High to Low / Newest)</option>
        </select>
      </div>
    </div>
  `;

  return row;
}

export function renderSortRulesDom(rules, columnNames, nonSortableCols, defaultSort) {
  const container = document.getElementById('sortRulesList');
  if (!container) return;

  container.innerHTML = '';
  const fallbackCol = defaultSort && defaultSort[0] ? defaultSort[0][0] : 0;
  const fallbackDir = defaultSort && defaultSort[0] ? defaultSort[0][1] : 'asc';

  const effectiveRules = rules && rules.length > 0
    ? rules
    : [{ id: 's_default_' + Date.now(), col: fallbackCol, dir: fallbackDir }];

  effectiveRules.forEach((rule, idx) => {
    const rowEl = createSortRowElement(rule, idx, columnNames, nonSortableCols);
    const removeBtn = rowEl.querySelector('.btn-remove-rule');
    removeBtn.addEventListener('click', () => {
      rowEl.remove();
      updateSortConjunctions();
      if (container.children.length === 0) {
        renderSortRulesDom([], columnNames, nonSortableCols, defaultSort);
      }
    });
    container.appendChild(rowEl);
  });

  updateSortConjunctions();
}

function updateSortConjunctions() {
  const container = document.getElementById('sortRulesList');
  if (!container) return;
  const rows = container.querySelectorAll('.sort-rule-row');
  rows.forEach((row, idx) => {
    const badge = row.querySelector('.rule-conjunction');
    if (badge) {
      badge.textContent = idx === 0 ? 'Sort by (Primary)' : 'Then by';
    }
  });
}

export function getSortRulesFromDom() {
  const container = document.getElementById('sortRulesList');
  if (!container) return [];

  const rows = container.querySelectorAll('.sort-rule-row');
  const rules = [];

  rows.forEach((row) => {
    const sortId = row.dataset.sortId;
    const colSelect = row.querySelector('.rule-sort-col-select');
    const dirSelect = row.querySelector('.rule-sort-dir-select');
    if (colSelect && dirSelect) {
      rules.push({
        id: sortId,
        col: Number(colSelect.value),
        dir: dirSelect.value
      });
    }
  });

  return rules;
}

// ─── Synchronize DOM from Saved State ────────────────────────────────────────

export function syncDomInputs(saved, columnTypes = {}, columnNames = {}, nonSortableCols = [], defaultSort = [[0, 'asc']]) {
  cachedColumnNames = columnNames;
  cachedColumnTypes = columnTypes;
  cachedNonSortableCols = nonSortableCols;
  cachedDefaultSort = defaultSort;

  // 1. Inline Search
  const searchColSelect = document.getElementById('inlineSearchColumnSelect');
  const searchRelSelect = document.getElementById('inlineSearchRelationSelect');
  const searchValInput = document.getElementById('inlineSearchValueInput');
  const btnClearSearch = document.getElementById('btnClearInlineSearch');

  if (saved && saved.searchRule) {
    if (searchColSelect) searchColSelect.value = saved.searchRule.col || 'all';
    if (searchRelSelect) searchRelSelect.value = saved.searchRule.relation || 'contains';
    if (searchValInput) searchValInput.value = saved.searchRule.value || '';
    if (btnClearSearch) btnClearSearch.hidden = !saved.searchRule.value;
  } else {
    if (btnClearSearch) btnClearSearch.hidden = !(searchValInput && searchValInput.value.trim());
  }

  if (searchColSelect) {
    updateInlineSearchRelations(searchColSelect.value, columnTypes);
  }

  // 2. Multi-Filter Rules
  const filterBadge = document.getElementById('filterBadge');
  const filterIndicator = document.getElementById('filterIndicator');
  const activeFilters = (saved && saved.filterRules) ? saved.filterRules.filter((r) => r.value) : [];

  renderFilterRulesDom(saved?.filterRules || [], columnNames, columnTypes);

  if (activeFilters.length > 0) {
    if (filterBadge) {
      filterBadge.textContent = activeFilters.length;
      filterBadge.hidden = false;
    }
    if (filterIndicator) filterIndicator.hidden = false;
  } else {
    if (filterBadge) filterBadge.hidden = true;
    if (filterIndicator) filterIndicator.hidden = true;
  }

  // 3. Multi-Sort Rules
  const sortBadge = document.getElementById('sortBadge');
  const activeSorts = (saved && saved.sortRules && saved.sortRules.length > 0)
    ? saved.sortRules
    : defaultSort.map((s, idx) => ({ id: 's_' + idx, col: s[0], dir: s[1] }));

  renderSortRulesDom(saved?.sortRules || [], columnNames, nonSortableCols, defaultSort);

  if (saved && saved.sortRules && saved.sortRules.length > 1) {
    if (sortBadge) {
      sortBadge.textContent = saved.sortRules.length;
      sortBadge.hidden = false;
    }
  } else {
    if (sortBadge) sortBadge.hidden = true;
  }

  if (!saved) return;

  // 4. Page Length
  const lengthSelect = document.getElementById('tablePageLengthSelect');
  if (lengthSelect && saved.pageLength) {
    lengthSelect.value = String(saved.pageLength);
  }

  // 5. Hidden Columns
  const columnsList = document.getElementById('columnsCheckboxList');
  if (columnsList && saved.hiddenColumns) {
    const checkboxes = columnsList.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((cb) => {
      const colIdx = Number(cb.dataset.col);
      cb.checked = !saved.hiddenColumns.includes(colIdx);
    });
  }
  updateColumnCheckboxDisabledState();
}

export function updateColumnCheckboxDisabledState() {
  const columnsList = document.getElementById('columnsCheckboxList');
  if (!columnsList) return;

  const checkboxes = Array.from(columnsList.querySelectorAll('input[type="checkbox"]'));
  const checkedBoxes = checkboxes.filter((cb) => cb.checked);

  if (checkedBoxes.length <= 1) {
    checkedBoxes.forEach((cb) => {
      cb.disabled = true;
      cb.closest('label')?.setAttribute('title', 'At least one column must remain visible');
    });
  } else {
    checkboxes.forEach((cb) => {
      cb.disabled = false;
      cb.closest('label')?.removeAttribute('title');
    });
  }
}

// ─── Active Configurations Pills Bar ──────────────────────────────────────────

export function renderActiveConfigsBar(activeConfigs, onClearAll) {
  const bar = document.getElementById('activeFiltersBar');
  if (!bar) return;

  bar.innerHTML = '';

  if (!activeConfigs || activeConfigs.length === 0) {
    bar.hidden = true;
    return;
  }

  bar.hidden = false;

  activeConfigs.forEach((cfg) => {
    const pill = document.createElement('div');
    pill.className = `active-config-pill pill-${cfg.type}`;
    pill.dataset.configId = cfg.id;

    pill.innerHTML = `
      <span class="pill-label">${escapeHtml(cfg.label)}:</span>
      <span class="pill-text">${cfg.htmlDisplay}</span>
      <button type="button" class="btn-clear-pill" title="Remove ${escapeHtml(cfg.label)}" aria-label="Remove ${escapeHtml(cfg.label)}">&times;</button>
    `;

    const clearBtn = pill.querySelector('.btn-clear-pill');
    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof cfg.onRemove === 'function') {
          cfg.onRemove();
        }
      });
    }

    bar.appendChild(pill);
  });

  if (activeConfigs.length > 1) {
    const btnClearAll = document.createElement('button');
    btnClearAll.type = 'button';
    btnClearAll.className = 'btn-clear-all-configs';
    btnClearAll.id = 'btnClearAllConfigs';
    btnClearAll.textContent = 'Clear All';
    btnClearAll.title = 'Clear all applied configurations';
    btnClearAll.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof onClearAll === 'function') {
        onClearAll();
      }
    });
    bar.appendChild(btnClearAll);
  }
}

// ─── Bind Toolbar Events ──────────────────────────────────────────────────────

export function bindToolbarEvents(actions) {
  const {
    onInlineSearch,
    onResetInlineSearch,
    onApplyFilters,
    onResetFilters,
    onApplySorts,
    onResetSorts,
    onToggleColumn,
    onShowAllColumns,
    onChangePageLength,
    columnNames = {},
    columnTypes = {},
    nonSortableCols = [],
    defaultSort = [[0, 'asc']]
  } = actions;

  cachedColumnNames = columnNames;
  cachedColumnTypes = columnTypes;
  cachedNonSortableCols = nonSortableCols;
  cachedDefaultSort = defaultSort;

  // 1. Inline Search controls
  const searchColSelect = document.getElementById('inlineSearchColumnSelect');
  const searchRelSelect = document.getElementById('inlineSearchRelationSelect');
  const searchValInput = document.getElementById('inlineSearchValueInput');
  const btnInlineSearch = document.getElementById('btnInlineSearch');
  const btnClearSearch = document.getElementById('btnClearInlineSearch');

  if (searchColSelect) {
    searchColSelect.addEventListener('change', () => {
      updateInlineSearchRelations(searchColSelect.value, columnTypes);
      const searchBox = document.getElementById('inlineSearchBox');
      const errorContainer = document.getElementById('inlineSearchErrorContainer');
      if (searchValInput && searchValInput.value.trim()) {
        const colType = columnTypes[searchColSelect.value] || 'all';
        const check = validateFilterInput(searchValInput.value.trim(), colType);
        if (check.valid) {
          clearFieldValidation({ formGroup: searchBox, control: searchValInput, errorContainer });
        } else {
          setFieldValidation({ formGroup: searchBox, control: searchValInput, errorContainer, errorMessage: check.message });
        }
      } else {
        clearFieldValidation({ formGroup: searchBox, control: searchValInput, errorContainer });
      }
    });
  }

  function handleSearchSubmit() {
    const col = searchColSelect ? searchColSelect.value : 'all';
    const relation = searchRelSelect ? searchRelSelect.value : 'contains';
    const value = searchValInput ? searchValInput.value.trim() : '';
    const colType = columnTypes[col] || 'all';

    const searchBox = document.getElementById('inlineSearchBox');
    const errorContainer = document.getElementById('inlineSearchErrorContainer');

    if (!value) {
      setFieldValidation({
        formGroup: searchBox,
        control: searchValInput,
        errorContainer,
        errorMessage: 'Search value is required.'
      });
      searchValInput?.focus();
      return;
    }

    const check = validateFilterInput(value, colType);
    if (!check.valid) {
      setFieldValidation({
        formGroup: searchBox,
        control: searchValInput,
        errorContainer,
        errorMessage: check.message
      });
      searchValInput?.focus();
      return;
    }

    clearFieldValidation({
      formGroup: searchBox,
      control: searchValInput,
      errorContainer
    });

    if (btnClearSearch) {
      btnClearSearch.hidden = !value;
    }

    onInlineSearch({ col, relation, value });
  }

  if (btnInlineSearch) {
    btnInlineSearch.addEventListener('click', handleSearchSubmit);
  }

  if (searchValInput) {
    searchValInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSearchSubmit();
      } else if (e.key === 'Escape') {
        const searchBox = document.getElementById('inlineSearchBox');
        const errorContainer = document.getElementById('inlineSearchErrorContainer');
        clearFieldValidation({ formGroup: searchBox, control: searchValInput, errorContainer });
        onResetInlineSearch();
      }
    });

    searchValInput.addEventListener('input', () => {
      const searchBox = document.getElementById('inlineSearchBox');
      const errorContainer = document.getElementById('inlineSearchErrorContainer');

      if (btnClearSearch) {
        btnClearSearch.hidden = !searchValInput.value.trim();
      }

      const col = searchColSelect ? searchColSelect.value : 'all';
      const colType = columnTypes[col] || 'all';
      const val = searchValInput.value.trim();

      if (!val) {
        clearFieldValidation({ formGroup: searchBox, control: searchValInput, errorContainer });
        return;
      }

      if (colType === 'date') {
        if (!/^[\d/]+$/.test(val)) {
          setFieldValidation({
            formGroup: searchBox,
            control: searchValInput,
            errorContainer,
            errorMessage: 'Date only accepts numbers and slashes in DD/MM/YYYY format.'
          });
          return;
        }
        if (/^\d{4,}$/.test(val)) {
          setFieldValidation({
            formGroup: searchBox,
            control: searchValInput,
            errorContainer,
            errorMessage: 'Standalone numbers are not allowed. Use DD/MM/YYYY pattern (e.g. 15/06/2024).'
          });
          return;
        }
        if (val.length >= 10) {
          const check = validateFilterInput(val, 'date');
          if (!check.valid) {
            setFieldValidation({ formGroup: searchBox, control: searchValInput, errorContainer, errorMessage: check.message });
            return;
          }
        }
        clearFieldValidation({ formGroup: searchBox, control: searchValInput, errorContainer });
        return;
      }

      const check = validateFilterInput(val, colType);
      if (check.valid) {
        clearFieldValidation({ formGroup: searchBox, control: searchValInput, errorContainer });
      }
    });

    searchValInput.addEventListener('blur', () => {
      const col = searchColSelect ? searchColSelect.value : 'all';
      const colType = columnTypes[col] || 'all';
      const searchBox = document.getElementById('inlineSearchBox');
      const errorContainer = document.getElementById('inlineSearchErrorContainer');
      const val = searchValInput.value.trim();
      if (val && colType === 'date') {
        const check = validateFilterInput(val, 'date');
        if (!check.valid) {
          setFieldValidation({ formGroup: searchBox, control: searchValInput, errorContainer, errorMessage: check.message });
        }
      }
    });
  }

  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      const searchBox = document.getElementById('inlineSearchBox');
      const errorContainer = document.getElementById('inlineSearchErrorContainer');
      if (searchValInput) searchValInput.value = '';
      clearFieldValidation({ formGroup: searchBox, control: searchValInput, errorContainer });
      btnClearSearch.hidden = true;
      onResetInlineSearch();
      if (searchValInput) searchValInput.focus();
    });
  }

  // 2. Dropdown Tab Toggling
  const tabs = [
    { btnId: 'tabBtnFilter', panelId: 'dropdownFilter' },
    { btnId: 'tabBtnSort', panelId: 'dropdownSort' },
    { btnId: 'tabBtnColumns', panelId: 'dropdownColumns' }
  ];

  tabs.forEach(({ btnId, panelId }) => {
    const btn = document.getElementById(btnId);
    const panel = document.getElementById(panelId);
    if (!btn || !panel) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCurrentlyOpen = panel.classList.contains('open');
      closeAllDropdowns();
      if (!isCurrentlyOpen) {
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        btn.closest('.toolbar-dropdown-wrapper')?.classList.add('has-open-dropdown');
        panel.classList.add('open');

        // Dynamic edge detection: if panel exceeds viewport width, align right
        const rect = panel.getBoundingClientRect();
        if (rect.right > window.innerWidth - 12) {
          panel.style.left = 'auto';
          panel.style.right = '0';
        }

        const firstInput = panel.querySelector('input, select');
        if (firstInput) firstInput.focus();
      }
    });

    const closeBtn = panel.querySelector('.btn-close-dropdown');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllDropdowns();
      });
    }

    panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });

  document.addEventListener('click', () => {
    closeAllDropdowns();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllDropdowns();
    }
  });

  // 3. Filter Builder Controls
  const btnAddFilter = document.getElementById('btnAddFilterRule');
  const btnApplyFilter = document.getElementById('btnApplyFilter');
  const btnResetFilter = document.getElementById('btnResetFilter');

  if (btnAddFilter) {
    btnAddFilter.addEventListener('click', () => {
      const container = document.getElementById('filterRulesList');
      if (!container) return;
      const newRule = {
        id: 'f_' + Math.random().toString(36).substr(2, 9),
        col: 'all',
        relation: 'contains',
        value: ''
      };
      const rowEl = createFilterRowElement(newRule, container.children.length, columnNames, columnTypes);
      const removeBtn = rowEl.querySelector('.btn-remove-rule');
      removeBtn.addEventListener('click', () => {
        rowEl.remove();
        updateFilterConjunctions();
        if (container.children.length === 0) {
          renderFilterRulesDom([], columnNames, columnTypes);
        }
      });
      container.appendChild(rowEl);
      updateFilterConjunctions();
      const valInput = rowEl.querySelector('.rule-val-input');
      if (valInput) valInput.focus();
    });
  }

  if (btnApplyFilter) {
    btnApplyFilter.addEventListener('click', () => {
      const { valid, rules } = getFilterRulesFromDom(columnTypes);
      if (!valid) return;
      onApplyFilters(rules);
    });
  }

  if (btnResetFilter) {
    btnResetFilter.addEventListener('click', () => {
      clearAllValidationErrors(document.getElementById('filterRulesList'));
      renderFilterRulesDom([], columnNames, columnTypes);
      onResetFilters();
    });
  }

  // 4. Sort Builder Controls
  const btnAddSort = document.getElementById('btnAddSortRule');
  const btnApplySort = document.getElementById('btnApplySort');
  const btnResetSort = document.getElementById('btnResetSort');

  if (btnAddSort) {
    btnAddSort.addEventListener('click', () => {
      const container = document.getElementById('sortRulesList');
      if (!container) return;
      const fallbackCol = defaultSort && defaultSort[0] ? defaultSort[0][0] : 0;
      const newRule = {
        id: 's_' + Math.random().toString(36).substr(2, 9),
        col: fallbackCol,
        dir: 'asc'
      };
      const rowEl = createSortRowElement(newRule, container.children.length, columnNames, nonSortableCols);
      const removeBtn = rowEl.querySelector('.btn-remove-rule');
      removeBtn.addEventListener('click', () => {
        rowEl.remove();
        updateSortConjunctions();
        if (container.children.length === 0) {
          renderSortRulesDom([], columnNames, nonSortableCols, defaultSort);
        }
      });
      container.appendChild(rowEl);
      updateSortConjunctions();
    });
  }

  if (btnApplySort) {
    btnApplySort.addEventListener('click', () => {
      const rules = getSortRulesFromDom();
      onApplySorts(rules);
    });
  }

  if (btnResetSort) {
    btnResetSort.addEventListener('click', () => {
      renderSortRulesDom([], columnNames, nonSortableCols, defaultSort);
      onResetSorts();
    });
  }

  // 5. Columns Tab Controls (Search & Visibility)
  const columnsList = document.getElementById('columnsCheckboxList');
  const btnShowAllCols = document.getElementById('btnShowAllColumns');
  const columnSearchInput = document.getElementById('columnSearchInput');
  const btnClearColumnSearch = document.getElementById('btnClearColumnSearch');
  const columnsEmptyMessage = document.getElementById('columnsEmptyMessage');

  function filterColumnsList(query) {
    const q = String(query || '').trim().toLowerCase();
    if (btnClearColumnSearch) {
      btnClearColumnSearch.hidden = !q;
    }

    if (!columnsList) return;
    const items = columnsList.querySelectorAll('.col-checkbox-item');
    let visibleCount = 0;

    items.forEach((item) => {
      const labelText = item.querySelector('span')?.textContent || '';
      const matches = !q || labelText.toLowerCase().includes(q);
      item.style.display = matches ? '' : 'none';
      if (matches) visibleCount++;
    });

    if (columnsEmptyMessage) {
      columnsEmptyMessage.hidden = visibleCount > 0;
    }
  }

  if (columnSearchInput) {
    columnSearchInput.addEventListener('input', () => {
      filterColumnsList(columnSearchInput.value);
    });

    columnSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (columnSearchInput.value) {
          e.stopPropagation();
          columnSearchInput.value = '';
          filterColumnsList('');
        }
      }
    });
  }

  if (btnClearColumnSearch) {
    btnClearColumnSearch.addEventListener('click', (e) => {
      e.stopPropagation();
      if (columnSearchInput) {
        columnSearchInput.value = '';
        columnSearchInput.focus();
      }
      filterColumnsList('');
    });
  }

  if (columnsList) {
    columnsList.addEventListener('change', (e) => {
      if (e.target && e.target.type === 'checkbox') {
        const colIdx = Number(e.target.dataset.col);
        const isVisible = e.target.checked;

        if (!isVisible) {
          const checkboxes = Array.from(columnsList.querySelectorAll('input[type="checkbox"]'));
          const checkedCount = checkboxes.filter((cb) => cb.checked).length;
          if (checkedCount === 0) {
            e.target.checked = true;
            updateColumnCheckboxDisabledState();
            return;
          }
        }

        onToggleColumn(colIdx, isVisible);
        updateColumnCheckboxDisabledState();
      }
    });
  }

  if (btnShowAllCols) {
    btnShowAllCols.addEventListener('click', () => {
      if (columnSearchInput) {
        columnSearchInput.value = '';
        filterColumnsList('');
      }
      onShowAllColumns();
      updateColumnCheckboxDisabledState();
    });
  }

  // 6. Page Length Selector
  const lengthSelect = document.getElementById('tablePageLengthSelect');
  if (lengthSelect) {
    lengthSelect.addEventListener('change', (e) => {
      onChangePageLength(Number(e.target.value));
    });
  }
}
