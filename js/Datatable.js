/**
 * Datatable.js
 * Configures and initializes DataTables for both Surveys and Questions pages with:
 * - Live type-ahead global search with word-for-word regex text highlighting
 * - Custom conditional Filter dropdown (Column + Relationship + Value)
 * - Column Ordering / Sort dropdown
 * - Column visibility toggle dropdown
 * - Sequential active configurations badge bar with individual removal and "Clear All"
 * - 2-hour state persistence in localStorage (persists for a while across reloads and navigation)
 */

const STATE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours TTL ("persist for a while")
const STORAGE_PREFIX = 'survey_admin_dt_state_';

export const SURVEY_COLUMN_NAMES = {
  0: 'Title',
  1: 'Description',
  2: 'Responses',
  3: 'Status',
  4: 'Created_at',
  5: 'Updated_at',
  6: 'Actions'
};

export const QUESTION_COLUMN_NAMES = {
  0: '#',
  1: 'Question Text',
  2: 'Type',
  3: 'Required',
  4: 'Actions'
};

const RELATION_LABELS = {
  contains: 'contains',
  equals: 'equals',
  not_equals: 'does not equal',
  starts_with: 'starts with',
  ends_with: 'ends with',
  gt: '>',
  lt: '<',
  gte: '>=',
  lte: '<='
};

// ─── Persistence Storage Helpers ──────────────────────────────────────────────
function saveTableState(storageKey, state) {
  try {
    const payload = {
      timestamp: Date.now(),
      search: state.search || '',
      filter: state.filter || null,
      sort: state.sort || null,
      pageLength: state.pageLength || 5,
      hiddenColumns: Array.from(state.hiddenColumns || []),
      activeConfigs: (state.activeConfigs || []).map((c) => ({
        id: c.id,
        type: c.type,
        label: c.label,
        htmlDisplay: c.htmlDisplay
      }))
    };
    localStorage.setItem(STORAGE_PREFIX + storageKey, JSON.stringify(payload));
  } catch (err) {
    console.warn('Could not save table state to localStorage:', err);
  }
}

function loadTableState(storageKey) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + storageKey);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || !data.timestamp) return null;

    // Check TTL (2 hours)
    if (Date.now() - data.timestamp > STATE_TTL_MS) {
      localStorage.removeItem(STORAGE_PREFIX + storageKey);
      return null;
    }
    return data;
  } catch (err) {
    return null;
  }
}

function clearTableState(storageKey) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + storageKey);
  } catch (err) {
    // ignore
  }
}

// ─── Data Extraction & Condition Testing ──────────────────────────────────────
function stripHtml(html) {
  if (html === null || html === undefined) return '';
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getCellText(searchData, rowData, colIdx) {
  let val = '';
  if (Array.isArray(searchData) && searchData[colIdx] !== undefined && searchData[colIdx] !== null) {
    val = searchData[colIdx];
  } else if (Array.isArray(rowData) && rowData[colIdx] !== undefined && rowData[colIdx] !== null) {
    val = rowData[colIdx];
  } else if (rowData && typeof rowData === 'object' && rowData[colIdx] !== undefined) {
    val = rowData[colIdx];
  }
  return stripHtml(val);
}

function testCondition(cellText, relation, query) {
  const rawCell = String(cellText ?? '').trim();
  const rawQuery = String(query ?? '').trim();
  const lowerCell = rawCell.toLowerCase();
  const lowerQuery = rawQuery.toLowerCase();

  // Numeric comparison check
  const cleanCellNum = rawCell.replace(/[$,]/g, '');
  const cleanQueryNum = rawQuery.replace(/[$,]/g, '');
  const numCell = parseFloat(cleanCellNum);
  const numQuery = parseFloat(cleanQueryNum);
  const isBothNumeric = !isNaN(numCell) && !isNaN(numQuery) && cleanCellNum !== '' && cleanQueryNum !== '';

  switch (relation) {
    case 'contains':
      return lowerCell.includes(lowerQuery);

    case 'equals':
      if (isBothNumeric) return numCell === numQuery;
      return lowerCell === lowerQuery;

    case 'not_equals':
      if (isBothNumeric) return numCell !== numQuery;
      return lowerCell !== lowerQuery;

    case 'starts_with':
      return lowerCell.startsWith(lowerQuery);

    case 'ends_with':
      return lowerCell.endsWith(lowerQuery);

    case 'gt':
      if (isBothNumeric) return numCell > numQuery;
      return lowerCell > lowerQuery;

    case 'lt':
      if (isBothNumeric) return numCell < numQuery;
      return lowerCell < lowerQuery;

    case 'gte':
      if (isBothNumeric) return numCell >= numQuery;
      return lowerCell >= lowerQuery;

    case 'lte':
      if (isBothNumeric) return numCell <= numQuery;
      return lowerCell <= lowerQuery;

    default:
      return lowerCell.includes(lowerQuery);
  }
}

function matchesRule(searchData, rowData, rule, allColumns = [0, 1, 2, 3, 4, 5]) {
  if (!rule || rule.value === undefined || rule.value === null) {
    return true;
  }

  const query = String(rule.value).trim();
  if (query === '') return true;

  const { col, relation } = rule;

  if (col === 'all') {
    return allColumns.some((colIdx) => {
      const cellText = getCellText(searchData, rowData, colIdx);
      return testCondition(cellText, relation, query);
    });
  }

  const colIdx = Number(col);
  const cellText = getCellText(searchData, rowData, colIdx);
  return testCondition(cellText, relation, query);
}

// ─── Word-for-Word Text Node Highlighting ─────────────────────────────────────
export function removeHighlights(container) {
  if (!container) return;
  const marks = container.querySelectorAll('mark.dt-highlight');
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(mark.textContent), mark);
      parent.normalize();
    }
  });
}

export function applyHighlights(container, query) {
  if (!container) return;
  removeHighlights(container);

  if (!query || !query.trim()) return;

  const tokens = query
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (tokens.length === 0) return;

  const regex = new RegExp(`(${tokens.join('|')})`, 'gi');

  function walk(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.nodeValue;
      if (text && regex.test(text)) {
        regex.lastIndex = 0;
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
          const matchIndex = match.index;
          if (matchIndex > lastIndex) {
            fragment.appendChild(document.createTextNode(text.substring(lastIndex, matchIndex)));
          }

          const mark = document.createElement('mark');
          mark.className = 'dt-highlight';
          mark.textContent = match[0];
          fragment.appendChild(mark);

          lastIndex = regex.lastIndex;
        }

        if (lastIndex < text.length) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
        }

        if (node.parentNode) {
          node.parentNode.replaceChild(fragment, node);
        }
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'BUTTON' || node.classList.contains('row-actions')) {
        return;
      }
      Array.from(node.childNodes).forEach(walk);
    }
  }

  const tbody = container.querySelector('tbody') || container;
  walk(tbody);
}

export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/<[^>]*>/g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ─── Table Controller Registry ────────────────────────────────────────────────
let activeControllers = {};

function ensureGlobalFilterHooked() {
  const dt = window.DataTable || (typeof DataTable !== 'undefined' ? DataTable : null);
  if (!dt || !dt.ext || !dt.ext.search) return;

  if (!dt.__adminGlobalFilterHooked) {
    dt.ext.search.push(function (settings, searchData, dataIndex, rowData) {
      const tableElem = settings.table || settings.nTable;
      const currentTableId = settings.tableId || (tableElem ? tableElem.id : '') || settings.sTableId;

      const controller = activeControllers[currentTableId];
      if (controller && controller.currentFilterRule) {
        if (!matchesRule(searchData, rowData, controller.currentFilterRule, controller.allFilterCols)) {
          return false;
        }
      }

      return true;
    });

    dt.__adminGlobalFilterHooked = true;
  }
}

ensureGlobalFilterHooked();

/**
 * Creates a reusable Table Controller managing DataTable instance,
 * toolbar interactions, sequential configs queue, and 2-hour persistence.
 */
function createTableController(opts) {
  const {
    tableId,
    selector,
    storageKey,
    columnNames,
    allFilterCols,
    defaultSort,
    nonSortableCols,
    language
  } = opts;

  let dtInstance = null;
  let isToolbarWired = false;
  let currentFilterRule = null;
  let currentSortRule = null;
  let currentHiddenColumns = new Set();
  let activeConfigs = [];

  const controller = {
    tableId,
    selector,
    storageKey,
    allFilterCols,
    get currentFilterRule() {
      return currentFilterRule;
    },
    getInstance() {
      return dtInstance;
    },
    destroy() {
      if (dtInstance) {
        removeHighlights(document.querySelector(selector));
        dtInstance.destroy();
        dtInstance = null;
      }
    },
    init() {
      const dt = window.DataTable || (typeof DataTable !== 'undefined' ? DataTable : null);
      if (!dt) {
        console.error('DataTable library is not loaded. Ensure datatables.min.js is included.');
        return null;
      }

      ensureGlobalFilterHooked();

      if (dtInstance) {
        removeHighlights(document.querySelector(selector));
        dtInstance.destroy();
        dtInstance = null;
      }

      // Check for saved state (2 hours TTL)
      const savedState = loadTableState(storageKey);

      let initialSearch = '';
      let initialOrder = defaultSort;
      let initialPageLength = 5;

      if (savedState) {
        initialSearch = savedState.search || '';
        initialOrder = savedState.sort ? [[savedState.sort.col, savedState.sort.dir]] : defaultSort;
        initialPageLength = savedState.pageLength || 5;
        currentFilterRule = savedState.filter || null;
        currentSortRule = savedState.sort || null;
        currentHiddenColumns = new Set(savedState.hiddenColumns || []);

        // Restore active configs queue and re-attach removal callbacks
        activeConfigs = (savedState.activeConfigs || []).map((cfg) => {
          return {
            ...cfg,
            onRemove: getRemovalHandler(cfg.id)
          };
        });
      } else {
        // Read current page length preference if select already exists
        const pageLengthSelect = document.getElementById('tablePageLengthSelect');
        if (pageLengthSelect) {
          initialPageLength = Number(pageLengthSelect.value);
        }
        const searchInput = document.getElementById('globalSearchInput');
        if (searchInput && searchInput.value.trim()) {
          initialSearch = searchInput.value.trim();
        }
      }

      // Sync DOM elements to match restored state
      syncDomInputs(savedState);

      // Initialize DataTable instance with stateSave (2 hours duration)
      dtInstance = new dt(selector, {
        pageLength: initialPageLength,
        search: { search: initialSearch },
        lengthMenu: [
          [5, 10, 25, 50, -1],
          [5, 10, 25, 50, 'All']
        ],
        order: initialOrder,
        columnDefs: [
          { orderable: false, targets: nonSortableCols }
        ],
        stateSave: true,
        stateDuration: 7200, // 2 hours in seconds
        layout: {
          topStart: null,
          topEnd: null,
          bottomStart: 'info',
          bottomEnd: 'paging'
        },
        language,
        autoWidth: false,
        responsive: true
      });

      // Apply hidden columns
      currentHiddenColumns.forEach((colIdx) => {
        dtInstance.column(colIdx).visible(false);
      });

      // Re-apply word-for-word text highlighting on every table draw
      dtInstance.on('draw', () => {
        const tableEl = document.querySelector(selector);
        const searchVal = document.getElementById('globalSearchInput')?.value || '';
        applyHighlights(tableEl, searchVal);
      });

      // Initial highlight if query present
      if (initialSearch) {
        applyHighlights(document.querySelector(selector), initialSearch);
      }

      // Wire toolbar listeners (once)
      if (!isToolbarWired) {
        setupToolbar();
        isToolbarWired = true;
      }

      // Render sequential active configuration pills
      renderActiveConfigsBar();

      return dtInstance;
    }
  };

  activeControllers[tableId] = controller;

  // ─── DOM Sync Helper ────────────────────────────────────────────────────────
  function syncDomInputs(saved) {
    if (!saved) return;

    // Search input
    const globalSearchInput = document.getElementById('globalSearchInput');
    const btnClearGlobalSearch = document.getElementById('btnClearGlobalSearch');
    if (globalSearchInput) {
      globalSearchInput.value = saved.search || '';
      if (btnClearGlobalSearch) {
        btnClearGlobalSearch.hidden = !saved.search;
      }
    }

    // Filter controls
    const filterColSelect = document.getElementById('filterColumnSelect');
    const filterRelSelect = document.getElementById('filterRelationSelect');
    const filterValInput = document.getElementById('filterValueInput');
    const filterIndicator = document.getElementById('filterIndicator');
    if (saved.filter) {
      if (filterColSelect) filterColSelect.value = saved.filter.col;
      if (filterRelSelect) filterRelSelect.value = saved.filter.relation;
      if (filterValInput) filterValInput.value = saved.filter.value;
      if (filterIndicator) filterIndicator.hidden = false;
    } else {
      if (filterIndicator) filterIndicator.hidden = true;
    }

    // Sort controls
    const sortColSelect = document.getElementById('sortColumnSelect');
    const sortDirSelect = document.getElementById('sortDirectionSelect');
    if (saved.sort) {
      if (sortColSelect) sortColSelect.value = String(saved.sort.col);
      if (sortDirSelect) sortDirSelect.value = saved.sort.dir;
    }

    // Page Length selector
    const lengthSelect = document.getElementById('tablePageLengthSelect');
    if (lengthSelect && saved.pageLength) {
      lengthSelect.value = String(saved.pageLength);
    }

    // Column checkboxes
    const columnsList = document.getElementById('columnsCheckboxList');
    if (columnsList && saved.hiddenColumns) {
      const checkboxes = columnsList.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach((cb) => {
        const colIdx = Number(cb.dataset.col);
        cb.checked = !saved.hiddenColumns.includes(colIdx);
      });
    }
  }

  function persist() {
    const searchVal = document.getElementById('globalSearchInput')?.value || '';
    const pageLenVal = document.getElementById('tablePageLengthSelect')?.value || 5;

    saveTableState(storageKey, {
      search: searchVal.trim(),
      filter: currentFilterRule,
      sort: currentSortRule,
      pageLength: Number(pageLenVal),
      hiddenColumns: currentHiddenColumns,
      activeConfigs
    });
  }

  function getRemovalHandler(id) {
    if (id === 'search') return resetSearch;
    if (id === 'filter') return resetFilter;
    if (id === 'sort') return resetSort;
    if (id.startsWith('col-')) {
      const colIdx = Number(id.replace('col-', ''));
      return () => restoreColumn(colIdx);
    }
    return () => removeConfig(id);
  }

  function addOrUpdateConfig(id, config) {
    const index = activeConfigs.findIndex((c) => c.id === id);
    if (index !== -1) {
      activeConfigs[index] = { ...activeConfigs[index], ...config };
    } else {
      activeConfigs.push(config);
    }
    renderActiveConfigsBar();
    persist();
  }

  function removeConfig(id) {
    const index = activeConfigs.findIndex((c) => c.id === id);
    if (index !== -1) {
      activeConfigs.splice(index, 1);
      renderActiveConfigsBar();
      persist();
    }
  }

  function renderActiveConfigsBar() {
    const bar = document.getElementById('activeFiltersBar');
    if (!bar) return;

    bar.innerHTML = '';

    if (activeConfigs.length === 0) {
      bar.hidden = true;
      return;
    }

    bar.hidden = false;

    // Render sequentially in the order applied
    activeConfigs.forEach((cfg) => {
      const pill = document.createElement('div');
      pill.className = `active-config-pill pill-${cfg.type}`;
      pill.dataset.configId = cfg.id;

      pill.innerHTML = `
        <span class="pill-label">${escapeHtml(cfg.label)}:</span>
        <span class="pill-text">${cfg.htmlDisplay}</span>
        <button type="button" class="btn-clear-pill" title="Remove ${escapeHtml(cfg.label)} configuration" aria-label="Remove ${escapeHtml(cfg.label)}">&times;</button>
      `;

      const clearBtn = pill.querySelector('.btn-clear-pill');
      if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (typeof cfg.onRemove === 'function') {
            cfg.onRemove();
          } else {
            removeConfig(cfg.id);
          }
        });
      }

      bar.appendChild(pill);
    });

    // Provide "Clear All" action when there are 2 or more active configurations
    if (activeConfigs.length > 1) {
      const btnClearAll = document.createElement('button');
      btnClearAll.type = 'button';
      btnClearAll.className = 'btn-clear-all-configs';
      btnClearAll.id = 'btnClearAllConfigs';
      btnClearAll.textContent = 'Clear All';
      btnClearAll.title = 'Clear all applied configurations';
      btnClearAll.addEventListener('click', (e) => {
        e.stopPropagation();
        clearAllConfigs();
      });
      bar.appendChild(btnClearAll);
    }
  }

  function clearAllConfigs() {
    resetSearch();
    resetFilter();
    resetSort();
    showAllColumns();

    activeConfigs = [];
    renderActiveConfigsBar();
    clearTableState(storageKey);
  }

  function handleSearchInput(query) {
    const trimmed = query.trim();
    const btnClearGlobalSearch = document.getElementById('btnClearGlobalSearch');
    if (btnClearGlobalSearch) {
      btnClearGlobalSearch.hidden = trimmed.length === 0;
    }

    if (dtInstance) {
      dtInstance.search(trimmed).draw();
    }

    if (trimmed.length > 0) {
      addOrUpdateConfig('search', {
        id: 'search',
        type: 'search',
        label: 'Search',
        htmlDisplay: `"${escapeHtml(trimmed)}"`,
        onRemove: resetSearch
      });
    } else {
      removeConfig('search');
    }
  }

  function resetSearch() {
    const globalSearchInput = document.getElementById('globalSearchInput');
    const btnClearGlobalSearch = document.getElementById('btnClearGlobalSearch');
    if (globalSearchInput) globalSearchInput.value = '';
    if (btnClearGlobalSearch) btnClearGlobalSearch.hidden = true;

    removeConfig('search');

    if (dtInstance) {
      dtInstance.search('').draw();
    }
    removeHighlights(document.querySelector(selector));
  }

  function applyFilter() {
    const filterColSelect = document.getElementById('filterColumnSelect');
    const filterRelSelect = document.getElementById('filterRelationSelect');
    const filterValInput = document.getElementById('filterValueInput');
    const filterIndicator = document.getElementById('filterIndicator');

    const val = filterValInput ? filterValInput.value.trim() : '';

    if (val) {
      const colVal = filterColSelect ? filterColSelect.value : 'all';
      const relVal = filterRelSelect ? filterRelSelect.value : 'contains';

      currentFilterRule = {
        col: colVal,
        relation: relVal,
        value: val
      };

      if (filterIndicator) filterIndicator.hidden = false;

      const colLabel = colVal === 'all' ? 'All Columns' : (columnNames[colVal] || `Column ${colVal}`);
      const relLabel = RELATION_LABELS[relVal] || relVal;

      addOrUpdateConfig('filter', {
        id: 'filter',
        type: 'filter',
        label: 'Filter',
        htmlDisplay: `${escapeHtml(colLabel)} ${escapeHtml(relLabel)} "<strong>${escapeHtml(val)}</strong>"`,
        onRemove: resetFilter
      });
    } else {
      resetFilter();
    }

    closeAllDropdowns();

    if (dtInstance) {
      dtInstance.draw();
    }
  }

  function resetFilter() {
    const filterColSelect = document.getElementById('filterColumnSelect');
    const filterRelSelect = document.getElementById('filterRelationSelect');
    const filterValInput = document.getElementById('filterValueInput');
    const filterIndicator = document.getElementById('filterIndicator');

    if (filterValInput) filterValInput.value = '';
    if (filterColSelect) filterColSelect.value = 'all';
    if (filterRelSelect) filterRelSelect.value = 'contains';
    currentFilterRule = null;
    if (filterIndicator) filterIndicator.hidden = true;

    removeConfig('filter');
    closeAllDropdowns();

    if (dtInstance) {
      dtInstance.draw();
    }
  }

  function applySort() {
    const sortColSelect = document.getElementById('sortColumnSelect');
    const sortDirSelect = document.getElementById('sortDirectionSelect');
    if (!dtInstance) return;

    const colIdx = Number(sortColSelect ? sortColSelect.value : defaultSort[0][0]);
    const dir = sortDirSelect ? sortDirSelect.value : defaultSort[0][1];

    currentSortRule = { col: colIdx, dir };
    dtInstance.order([[colIdx, dir]]).draw();

    const colName = columnNames[colIdx] || `Column ${colIdx}`;
    const dirLabel = dir === 'asc' ? 'Ascending' : 'Descending';

    addOrUpdateConfig('sort', {
      id: 'sort',
      type: 'sort',
      label: 'Sort',
      htmlDisplay: `${escapeHtml(colName)} (${escapeHtml(dirLabel)})`,
      onRemove: resetSort
    });

    closeAllDropdowns();
  }

  function resetSort() {
    const sortColSelect = document.getElementById('sortColumnSelect');
    const sortDirSelect = document.getElementById('sortDirectionSelect');
    if (sortColSelect) sortColSelect.value = String(defaultSort[0][0]);
    if (sortDirSelect) sortDirSelect.value = defaultSort[0][1];
    currentSortRule = null;

    if (dtInstance) {
      dtInstance.order(defaultSort).draw();
    }

    removeConfig('sort');
    closeAllDropdowns();
  }

  function restoreColumn(colIdx) {
    currentHiddenColumns.delete(colIdx);
    const columnsList = document.getElementById('columnsCheckboxList');
    const cb = columnsList?.querySelector(`input[data-col="${colIdx}"]`);
    if (cb) cb.checked = true;

    if (dtInstance) {
      dtInstance.column(colIdx).visible(true);
    }

    removeConfig(`col-${colIdx}`);
  }

  function showAllColumns() {
    currentHiddenColumns.clear();
    const columnsList = document.getElementById('columnsCheckboxList');
    const checkboxes = columnsList ? columnsList.querySelectorAll('input[type="checkbox"]') : [];
    checkboxes.forEach((cb) => {
      cb.checked = true;
    });

    if (dtInstance) {
      Object.keys(columnNames).forEach((colIdx) => {
        dtInstance.column(Number(colIdx)).visible(true);
      });
    }

    activeConfigs = activeConfigs.filter((cfg) => cfg.type !== 'column');
    renderActiveConfigsBar();
    closeAllDropdowns();
    persist();
  }

  function closeAllDropdowns() {
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
      }
      if (panel) {
        panel.classList.remove('open');
      }
    });
  }

  function setupToolbar() {
    // ─── Search Input Listeners ──────────────────────────────────────────────
    const globalSearchInput = document.getElementById('globalSearchInput');
    const btnClearGlobalSearch = document.getElementById('btnClearGlobalSearch');

    if (globalSearchInput) {
      globalSearchInput.addEventListener('input', () => {
        handleSearchInput(globalSearchInput.value);
      });

      globalSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          resetSearch();
        }
      });
    }

    if (btnClearGlobalSearch) {
      btnClearGlobalSearch.addEventListener('click', () => {
        resetSearch();
        if (globalSearchInput) globalSearchInput.focus();
      });
    }

    // ─── Dropdown Tabbing Listeners ──────────────────────────────────────────
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
          panel.classList.add('open');

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

    // ─── Filter Tab Controls ─────────────────────────────────────────────────
    const btnApplyFilter = document.getElementById('btnApplyFilter');
    const btnResetFilter = document.getElementById('btnResetFilter');
    const filterValInput = document.getElementById('filterValueInput');

    if (btnApplyFilter) btnApplyFilter.addEventListener('click', applyFilter);
    if (btnResetFilter) btnResetFilter.addEventListener('click', resetFilter);
    if (filterValInput) {
      filterValInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyFilter();
        }
      });
    }

    // ─── Sort Tab Controls ───────────────────────────────────────────────────
    const btnApplySort = document.getElementById('btnApplySort');
    const btnResetSort = document.getElementById('btnResetSort');

    if (btnApplySort) btnApplySort.addEventListener('click', applySort);
    if (btnResetSort) btnResetSort.addEventListener('click', resetSort);

    // ─── Columns Tab Controls ────────────────────────────────────────────────
    const columnsList = document.getElementById('columnsCheckboxList');
    const btnShowAllCols = document.getElementById('btnShowAllColumns');

    if (columnsList) {
      columnsList.addEventListener('change', (e) => {
        if (e.target && e.target.type === 'checkbox') {
          const colIdx = Number(e.target.dataset.col);
          const isVisible = e.target.checked;

          if (isVisible) {
            currentHiddenColumns.delete(colIdx);
            if (dtInstance) dtInstance.column(colIdx).visible(true);
            removeConfig(`col-${colIdx}`);
          } else {
            currentHiddenColumns.add(colIdx);
            if (dtInstance) dtInstance.column(colIdx).visible(false);

            const colName = columnNames[colIdx] || `Column ${colIdx}`;
            addOrUpdateConfig(`col-${colIdx}`, {
              id: `col-${colIdx}`,
              type: 'column',
              label: 'Hidden',
              htmlDisplay: escapeHtml(colName),
              onRemove: () => restoreColumn(colIdx)
            });
          }
          persist();
        }
      });
    }

    if (btnShowAllCols) {
      btnShowAllCols.addEventListener('click', showAllColumns);
    }

    // ─── Page Length Selector ────────────────────────────────────────────────
    const lengthSelect = document.getElementById('tablePageLengthSelect');
    if (lengthSelect) {
      lengthSelect.addEventListener('change', (e) => {
        if (dtInstance) {
          dtInstance.page.len(Number(e.target.value)).draw();
        }
        persist();
      });
    }
  }

  return controller;
}

// ─── Survey Table Controller (index.html) ────────────────────────────────────
let surveyController = null;

export function initSurveyDataTable(selector = '#surveyTable') {
  if (!surveyController) {
    surveyController = createTableController({
      tableId: 'surveyTable',
      selector,
      storageKey: 'surveys',
      columnNames: SURVEY_COLUMN_NAMES,
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
  const safeSurveyId = surveyId || 'default';

  if (!questionsController || currentQuestionsSurveyId !== safeSurveyId) {
    currentQuestionsSurveyId = safeSurveyId;
    questionsController = createTableController({
      tableId: 'questionsTable',
      selector,
      storageKey: `questions_${safeSurveyId}`,
      columnNames: QUESTION_COLUMN_NAMES,
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