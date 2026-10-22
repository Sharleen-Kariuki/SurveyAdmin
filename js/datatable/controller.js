// Orchestrates the DataTable instance creation, configuration, redraw listeners, and toolbar sync.

import { RELATION_LABELS } from './constants.js';
import { saveTableState, loadTableState, clearTableState } from './storage.js';
import { applyHighlights, removeHighlights } from './highlight.js';
import { registerController, unregisterController, ensureGlobalFilterHooked } from './filterEngine.js';
import {
  syncDomInputs,
  renderActiveConfigsBar,
  bindToolbarEvents,
  closeAllDropdowns,
  updateColumnCheckboxDisabledState
} from './toolbar.js';
import { escapeHtml } from '../utils.js';

export function createTableController(opts) {
  const {
    tableId,
    selector,
    storageKey,
    columnNames,
    columnTypes = {},
    allFilterCols,
    defaultSort,
    nonSortableCols,
    language
  } = opts;

  let dtInstance = null;
  let isToolbarWired = false;
  let currentSearchRule = null;
  let currentFilterRules = [];
  let currentSortRules = [];
  let currentHiddenColumns = new Set();
  let activeConfigs = [];

  const controller = {
    tableId,
    selector,
    storageKey,
    columnNames,
    columnTypes,
    allFilterCols,
    get currentSearchRule() {
      return currentSearchRule;
    },
    get currentFilterRules() {
      return currentFilterRules;
    },
    get currentFilterRule() {
      return currentFilterRules[0] || null;
    },
    getInstance() {
      return dtInstance;
    },
    destroy() {
      if (dtInstance) {
        removeHighlights(document.querySelector(selector));
        const lengthControl = document.getElementById('tablePageLengthControl');
        const tableEl = document.querySelector(selector);
        if (lengthControl && tableEl) {
          tableEl.after(lengthControl);
        }
        dtInstance.destroy();
        dtInstance = null;
      }
      unregisterController(tableId);
    },
    init() {
      const dt = window.DataTable || (typeof DataTable !== 'undefined' ? DataTable : null);
      if (!dt) {
        console.error('DataTable library is not loaded. Ensure datatables.min.js is included.');
        return null;
      }

      ensureGlobalFilterHooked();
      registerController(tableId, controller);

      if (dtInstance) {
        removeHighlights(document.querySelector(selector));
        const lengthControl = document.getElementById('tablePageLengthControl');
        const tableEl = document.querySelector(selector);
        if (lengthControl && tableEl) {
          tableEl.after(lengthControl);
        }
        dtInstance.destroy();
        dtInstance = null;
      }

      // Check for saved state (2 hours TTL)
      const savedState = loadTableState(storageKey);

      let initialOrder = defaultSort;
      let initialPageLength = 5;

      if (savedState) {
        currentSearchRule = savedState.searchRule || null;
        currentFilterRules = Array.isArray(savedState.filterRules) ? savedState.filterRules : [];
        currentSortRules = Array.isArray(savedState.sortRules) && savedState.sortRules.length > 0
          ? savedState.sortRules
          : defaultSort.map((s, idx) => ({ id: 's_' + idx, col: Number(s[0]), dir: s[1] }));

        initialOrder = currentSortRules.map((s) => [Number(s.col), s.dir]);
        initialPageLength = savedState.pageLength || 5;

        const totalCols = Object.keys(columnNames).length;
        const hiddenCols = new Set(savedState.hiddenColumns || []);
        if (hiddenCols.size >= totalCols) {
          hiddenCols.delete(0);
        }
        currentHiddenColumns = hiddenCols;

        // Restore active configs queue and re-attach removal callbacks
        activeConfigs = (savedState.activeConfigs || []).map((cfg) => ({
          ...cfg,
          onRemove: getRemovalHandler(cfg.id)
        }));

        if (currentFilterRules.length > 0) {
          const filterDisplayParts = currentFilterRules.map((rule) => {
            const colLabel = rule.col === 'all'
              ? 'All Columns'
              : (columnNames[rule.col] || `Column ${rule.col}`);
            const relLabel = RELATION_LABELS[rule.relation] || rule.relation;
            return `${escapeHtml(colLabel)} ${escapeHtml(relLabel)} "<strong>${escapeHtml(rule.value)}</strong>"`;
          });

          activeConfigs = activeConfigs.filter((cfg) => cfg.id !== 'filter' && !cfg.id.startsWith('filter_'));
          activeConfigs.push({
            id: 'filter',
            type: 'filter',
            label: 'Filter',
            htmlDisplay: filterDisplayParts.join(' &rarr; '),
            onRemove: resetFilters
          });
        }
      } else {
        const pageLengthSelect = document.getElementById('tablePageLengthSelect');
        if (pageLengthSelect) {
          initialPageLength = Number(pageLengthSelect.value);
        }
        currentSortRules = defaultSort.map((s, idx) => ({ id: 's_' + idx, col: Number(s[0]), dir: s[1] }));
      }

      // Sync DOM inputs to match restored state
      syncDomInputs(savedState, columnTypes, columnNames, nonSortableCols, defaultSort);
      updateColumnCheckboxDisabledState();

      // Register DD/MM/YYYY date sorting for DataTables
      if (dt.ext && dt.ext.type && dt.ext.type.order) {
        const parseDmy = function (d) {
          if (!d) return 0;
          const clean = String(d).replace(/<[^>]*>/g, '').trim();
          const parts = clean.split('/');
          if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            return new Date(year, month, day).getTime() || 0;
          }
          return new Date(clean).getTime() || 0;
        };
        dt.ext.type.order['date-pre'] = parseDmy;
        dt.ext.type.order['date-dmy-pre'] = parseDmy;
      }

      const dateCols = Object.entries(columnTypes)
        .filter(([colIdx, type]) => type === 'date' && colIdx !== 'all')
        .map(([colIdx]) => Number(colIdx));

      const customColumnDefs = [
        { orderable: false, targets: nonSortableCols }
      ];
      if (dateCols.length > 0) {
        customColumnDefs.push({ type: 'date', targets: dateCols });
      }

      // Initialize DataTable instance with stateSave (2 hours duration)
      dtInstance = new dt(selector, {
        pageLength: initialPageLength,
        search: { search: '' }, // Handled via non-global ext.search hook
        lengthMenu: [
          [5, 10, 25, 50, -1],
          [5, 10, 25, 50, 'All']
        ],
        order: initialOrder,
        columnDefs: customColumnDefs,
        stateSave: true,
        stateDuration: 7200, // 2 hours in seconds
        layout: {
          topStart: null,
          topEnd: null,
          bottomStart: [
            'info',
            function () {
              return document.getElementById('tablePageLengthControl');
            }
          ],
          bottomEnd: 'paging'
        },
        language,
        autoWidth: false,
        responsive: true
      });

      function placeLengthControlAtBottom() {
        const tableContainer = dtInstance?.table()?.container();
        const layoutStart = tableContainer ? tableContainer.querySelector('.dt-layout-start') : document.querySelector('.dt-layout-start');
        const lengthControl = document.getElementById('tablePageLengthControl');
        if (layoutStart && lengthControl && !layoutStart.contains(lengthControl)) {
          layoutStart.appendChild(lengthControl);
        }
      }

      placeLengthControlAtBottom();

      // Apply hidden columns
      currentHiddenColumns.forEach((colIdx) => {
        dtInstance.column(colIdx).visible(false);
      });

      // Re-apply targeted text highlighting on every table draw
      dtInstance.on('draw', () => {
        placeLengthControlAtBottom();
        const tableEl = document.querySelector(selector);
        if (currentSearchRule && currentSearchRule.value) {
          applyHighlights(tableEl, currentSearchRule.value, currentSearchRule.col);
        } else {
          removeHighlights(tableEl);
        }
      });

      // Initial highlight if search query present
      if (currentSearchRule && currentSearchRule.value) {
        applyHighlights(document.querySelector(selector), currentSearchRule.value, currentSearchRule.col);
      }

      // Wire toolbar listeners (once)
      if (!isToolbarWired) {
        bindToolbarEvents({
          onInlineSearch: handleInlineSearch,
          onResetInlineSearch: resetInlineSearch,
          onApplyFilters: handleApplyFilters,
          onResetFilters: resetFilters,
          onApplySorts: handleApplySorts,
          onResetSorts: resetSorts,
          onToggleColumn: toggleColumn,
          onShowAllColumns: showAllColumns,
          onChangePageLength: (len) => {
            if (dtInstance) dtInstance.page.len(len).draw();
            persist();
          },
          columnNames,
          columnTypes,
          nonSortableCols,
          defaultSort
        });
        isToolbarWired = true;
      }

      // Render sequential active configuration pills
      renderPills();

      return dtInstance;
    }
  };

  function persist() {
    const pageLenVal = document.getElementById('tablePageLengthSelect')?.value || 5;

    saveTableState(storageKey, {
      searchRule: currentSearchRule,
      filterRules: currentFilterRules,
      sortRules: currentSortRules,
      pageLength: Number(pageLenVal),
      hiddenColumns: currentHiddenColumns,
      activeConfigs
    });
  }

  function getRemovalHandler(id) {
    if (id === 'search') return resetInlineSearch;
    if (id === 'filter' || id.startsWith('filter_')) return resetFilters;
    if (id === 'sort') return resetSorts;
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
    renderPills();
    persist();
  }

  function removeConfig(id) {
    const index = activeConfigs.findIndex((c) => c.id === id);
    if (index !== -1) {
      activeConfigs.splice(index, 1);
      renderPills();
      persist();
    }
  }

  function renderPills() {
    renderActiveConfigsBar(activeConfigs, clearAllConfigs);
  }

  function clearAllConfigs() {
    resetInlineSearch();
    resetFilters();
    resetSorts();
    showAllColumns();

    activeConfigs = [];
    renderPills();
    clearTableState(storageKey);
  }

  // ─── Inline Search Logic ───────────────────────────────────────────────────

  function handleInlineSearch(rule) {
    const val = String(rule.value || '').trim();
    if (val) {
      currentSearchRule = {
        col: rule.col || 'all',
        relation: rule.relation || 'contains',
        value: val
      };

      const colLabel = currentSearchRule.col === 'all'
        ? 'All Columns'
        : (columnNames[currentSearchRule.col] || `Column ${currentSearchRule.col}`);
      const relLabel = RELATION_LABELS[currentSearchRule.relation] || currentSearchRule.relation;

      addOrUpdateConfig('search', {
        id: 'search',
        type: 'search',
        label: 'Search',
        htmlDisplay: `${escapeHtml(colLabel)} ${escapeHtml(relLabel)} "<strong>${escapeHtml(val)}</strong>"`,
        onRemove: resetInlineSearch
      });
    } else {
      resetInlineSearch();
      return;
    }

    if (dtInstance) {
      dtInstance.draw();
    }
    persist();
  }

  function resetInlineSearch() {
    const searchValInput = document.getElementById('inlineSearchValueInput');
    const btnClearSearch = document.getElementById('btnClearInlineSearch');
    if (searchValInput) searchValInput.value = '';
    if (btnClearSearch) btnClearSearch.hidden = true;

    currentSearchRule = null;
    removeConfig('search');

    if (dtInstance) {
      dtInstance.draw();
    }
    removeHighlights(document.querySelector(selector));
    persist();
  }

  // ─── Multi-Filter Logic ────────────────────────────────────────────────────

  function handleApplyFilters(rules) {
    currentFilterRules = rules.filter((r) => r.value && String(r.value).trim() !== '');

    // Purge old filter pills
    activeConfigs = activeConfigs.filter((cfg) => cfg.id !== 'filter' && !cfg.id.startsWith('filter_'));

    const filterBadge = document.getElementById('filterBadge');
    const filterIndicator = document.getElementById('filterIndicator');

    if (currentFilterRules.length > 0) {
      if (filterBadge) {
        filterBadge.textContent = currentFilterRules.length;
        filterBadge.hidden = false;
      }
      if (filterIndicator) filterIndicator.hidden = false;

      const filterDisplayParts = currentFilterRules.map((rule) => {
        const colLabel = rule.col === 'all'
          ? 'All Columns'
          : (columnNames[rule.col] || `Column ${rule.col}`);
        const relLabel = RELATION_LABELS[rule.relation] || rule.relation;
        return `${escapeHtml(colLabel)} ${escapeHtml(relLabel)} "<strong>${escapeHtml(rule.value)}</strong>"`;
      });

      addOrUpdateConfig('filter', {
        id: 'filter',
        type: 'filter',
        label: 'Filter',
        htmlDisplay: filterDisplayParts.join(' &rarr; '),
        onRemove: resetFilters
      });
    } else {
      if (filterBadge) filterBadge.hidden = true;
      if (filterIndicator) filterIndicator.hidden = true;
      removeConfig('filter');
    }

    closeAllDropdowns();

    if (dtInstance) {
      dtInstance.draw();
    }
    persist();
  }

  function removeSingleFilterRule(ruleId) {
    currentFilterRules = currentFilterRules.filter((r) => r.id !== ruleId);

    const filterBadge = document.getElementById('filterBadge');
    const filterIndicator = document.getElementById('filterIndicator');
    if (currentFilterRules.length > 0) {
      if (filterBadge) {
        filterBadge.textContent = currentFilterRules.length;
        filterBadge.hidden = false;
      }
      if (filterIndicator) filterIndicator.hidden = false;

      const filterDisplayParts = currentFilterRules.map((rule) => {
        const colLabel = rule.col === 'all'
          ? 'All Columns'
          : (columnNames[rule.col] || `Column ${rule.col}`);
        const relLabel = RELATION_LABELS[rule.relation] || rule.relation;
        return `${escapeHtml(colLabel)} ${escapeHtml(relLabel)} "<strong>${escapeHtml(rule.value)}</strong>"`;
      });

      addOrUpdateConfig('filter', {
        id: 'filter',
        type: 'filter',
        label: 'Filter',
        htmlDisplay: filterDisplayParts.join(' &rarr; '),
        onRemove: resetFilters
      });
    } else {
      if (filterBadge) filterBadge.hidden = true;
      if (filterIndicator) filterIndicator.hidden = true;
      removeConfig('filter');
    }

    // Update panel DOM to remove that row
    const container = document.getElementById('filterRulesList');
    const rowEl = container?.querySelector(`[data-rule-id="${ruleId}"]`);
    if (rowEl) {
      rowEl.remove();
    }

    if (dtInstance) {
      dtInstance.draw();
    }
    persist();
  }

  function resetFilters() {
    currentFilterRules = [];
    activeConfigs = activeConfigs.filter((cfg) => cfg.id !== 'filter' && !cfg.id.startsWith('filter_'));

    const filterBadge = document.getElementById('filterBadge');
    const filterIndicator = document.getElementById('filterIndicator');
    if (filterBadge) filterBadge.hidden = true;
    if (filterIndicator) filterIndicator.hidden = true;

    clearAllValidationErrors(document.getElementById('filterRulesList'));
    renderFilterRulesDom([], columnNames, columnTypes);

    closeAllDropdowns();
    renderPills();

    if (dtInstance) {
      dtInstance.draw();
    }
    persist();
  }

  // ─── Multi-Sort Logic ──────────────────────────────────────────────────────

  function handleApplySorts(rules) {
    if (!dtInstance) return;

    currentSortRules = rules.length > 0
      ? rules
      : defaultSort.map((s, idx) => ({ id: 's_' + idx, col: Number(s[0]), dir: s[1] }));

    const orderDefs = currentSortRules.map((r) => [Number(r.col), r.dir]);
    dtInstance.order(orderDefs).draw();

    const sortBadge = document.getElementById('sortBadge');
    if (currentSortRules.length > 1) {
      if (sortBadge) {
        sortBadge.textContent = currentSortRules.length;
        sortBadge.hidden = false;
      }
    } else {
      if (sortBadge) sortBadge.hidden = true;
    }

    const sortDisplayParts = currentSortRules.map((s) => {
      const name = columnNames[s.col] || `Column ${s.col}`;
      const dirText = s.dir === 'asc' ? 'Asc' : 'Desc';
      return `${escapeHtml(name)} (${dirText})`;
    });

    addOrUpdateConfig('sort', {
      id: 'sort',
      type: 'sort',
      label: 'Sort',
      htmlDisplay: sortDisplayParts.join(' &rarr; '),
      onRemove: resetSorts
    });

    closeAllDropdowns();
    persist();
  }

  function resetSorts() {
    currentSortRules = defaultSort.map((s, idx) => ({ id: 's_' + idx, col: Number(s[0]), dir: s[1] }));

    if (dtInstance) {
      dtInstance.order(defaultSort).draw();
    }

    const sortBadge = document.getElementById('sortBadge');
    if (sortBadge) sortBadge.hidden = true;

    removeConfig('sort');
    closeAllDropdowns();
    persist();
  }

  // ─── Column Visibility ─────────────────────────────────────────────────────

  function toggleColumn(colIdx, isVisible) {
    if (isVisible) {
      currentHiddenColumns.delete(colIdx);
      if (dtInstance) dtInstance.column(colIdx).visible(true);
      removeConfig(`col-${colIdx}`);
    } else {
      const totalCols = Object.keys(columnNames).length;
      if (currentHiddenColumns.size >= totalCols - 1) {
        return;
      }
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
    updateColumnCheckboxDisabledState();
    persist();
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
    updateColumnCheckboxDisabledState();
    persist();
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
    updateColumnCheckboxDisabledState();
    renderPills();
    closeAllDropdowns();
    persist();
  }

  return controller;
}
