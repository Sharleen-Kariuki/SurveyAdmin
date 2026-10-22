// Reusable Toolbar Tabs Component for DataTable pages (Search, Filter, Sort, Columns)
import { escapeHtml } from './utils.js';

export const SURVEY_TOOLBAR_CONFIG = {
  id: 'survey',
  searchAriaLabel: 'Inline table search',
  searchColumns: [
    { value: 'all', label: 'All Columns' },
    { value: '0', label: 'Title' },
    { value: '1', label: 'Description' },
    { value: '2', label: 'Responses' },
    { value: '3', label: 'Status' },
    { value: '4', label: 'Created_at' },
    { value: '5', label: 'Updated_at' }
  ],
  columns: [
    { col: 0, label: 'Title' },
    { col: 1, label: 'Description' },
    { col: 2, label: 'Responses' },
    { col: 3, label: 'Status' },
    { col: 4, label: 'Created_at' },
    { col: 5, label: 'Updated_at' },
    { col: 6, label: 'Actions' }
  ]
};

export const QUESTION_TOOLBAR_CONFIG = {
  id: 'questions',
  searchAriaLabel: 'Inline question search',
  searchColumns: [
    { value: 'all', label: 'All Columns' },
    { value: '0', label: '# (Order)' },
    { value: '1', label: 'Question Text' },
    { value: '2', label: 'Type' },
    { value: '3', label: 'Required' }
  ],
  columns: [
    { col: 0, label: '#' },
    { col: 1, label: 'Question Text' },
    { col: 2, label: 'Type' },
    { col: 3, label: 'Required' },
    { col: 4, label: 'Actions' }
  ]
};

/**
 * Generates the HTML string for the toolbar tabs (inline search on the left,
 * and filter, sort, columns dropdown tabs on the right).
 *
 * @param {Object} config
 * @returns {string}
 */
export function createToolbarTabsHtml(config = {}) {
  const searchAriaLabel = config.searchAriaLabel || 'Inline table search';
  const searchColumns = config.searchColumns || [];
  const columns = config.columns || [];

  const searchOptionsHtml = searchColumns
    .map((col) => `<option value="${escapeHtml(String(col.value))}">${escapeHtml(col.label)}</option>`)
    .join('\n                  ');

  const columnsVisibilityHtml = columns
    .map(
      (col) => `
                <label class="col-checkbox-item">
                  <input type="checkbox" data-col="${escapeHtml(String(col.col))}" ${col.checked !== false ? 'checked' : ''} />
                  <span>${escapeHtml(col.label)}</span>
                </label>`
    )
    .join('');

  return `
          <!-- Inline Non-Global Search (Column, Relationship, Value, and Search Button) -->
          <div class="toolbar-inline-search-wrap">
            <div class="toolbar-inline-search" id="inlineSearchBox" role="search" aria-label="${escapeHtml(searchAriaLabel)}">
              <div class="inline-search-field">
                <select id="inlineSearchColumnSelect" class="toolbar-inline-select" aria-label="Search Column">
                  ${searchOptionsHtml}
                </select>
              </div>
              <div class="inline-search-field">
                <select id="inlineSearchRelationSelect" class="toolbar-inline-select" aria-label="Search Relationship">
                  <option value="contains" selected>Contains</option>
                  <option value="equals">Equals (=)</option>
                  <option value="not_equals">Not equals (&ne;)</option>
                  <option value="starts_with">Starts with</option>
                  <option value="ends_with">Ends with</option>
                  <option value="gt">&gt; (after)</option>
                  <option value="lt">&lt; (before)</option>
                  <option value="gte">&ge; (on/after)</option>
                  <option value="lte">&le; (on/before)</option>
                </select>
              </div>
              <div class="inline-search-input-wrapper">
                <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" id="inlineSearchValueInput" class="toolbar-inline-input" placeholder="Search value..." aria-label="Search value" autocomplete="off" />
                <button type="button" class="btn-clear-inline-search" id="btnClearInlineSearch" aria-label="Clear search" title="Clear search" hidden>&times;</button>
              </div>
              <button type="button" class="btn-inline-search" id="btnInlineSearch" title="Execute Search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span>Search</span>
              </button>
            </div>
            <div class="error-container inline-search-error-container" id="inlineSearchErrorContainer"></div>
          </div>

          <!-- Grouped Filter, Sort, and Columns Tabs -->
          <div class="toolbar-tab-actions">
            <!-- Filter Dropdown Tab (Multiple Filters Supported) -->
            <div class="toolbar-dropdown-wrapper">
              <button type="button" class="toolbar-tab-btn" id="tabBtnFilter" aria-expanded="false" aria-controls="dropdownFilter">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                </svg>
                <span>Filter</span>
                <span class="tab-badge" id="filterBadge" hidden>0</span>
                <span class="tab-indicator" id="filterIndicator" hidden></span>
                <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div class="toolbar-dropdown-panel dropdown-panel-wide" id="dropdownFilter" role="region" aria-label="Filter controls">
                <div class="dropdown-header">
                  <div class="dropdown-header-title">
                    <h3>Filter by Conditions</h3>
                    <span class="dropdown-subtitle">Match all active criteria</span>
                  </div>
                  <button type="button" class="btn-close-dropdown" aria-label="Close filter dropdown">&times;</button>
                </div>
                <div class="dropdown-body">
                  <div id="filterRulesList" class="rules-list-container">
                    <!-- Dynamic multiple filter rows injected here -->
                  </div>
                  <button type="button" id="btnAddFilterRule" class="btn-add-rule">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Add Filter Condition</span>
                  </button>
                </div>
                <div class="dropdown-footer">
                  <button type="button" class="btn-secondary btn-sm" id="btnResetFilter">Reset All</button>
                  <button type="button" class="btn-primary btn-sm" id="btnApplyFilter">Apply Filters</button>
                </div>
              </div>
            </div>

            <!-- Sort Dropdown Tab (Multiple Sort Levels Supported) -->
            <div class="toolbar-dropdown-wrapper">
              <button type="button" class="toolbar-tab-btn" id="tabBtnSort" aria-expanded="false" aria-controls="dropdownSort">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M7 15l5 5 5-5M7 9l5-5 5 5"></path>
                </svg>
                <span>Sort</span>
                <span class="tab-badge" id="sortBadge" hidden>0</span>
                <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div class="toolbar-dropdown-panel dropdown-panel-wide" id="dropdownSort" role="region" aria-label="Sort controls">
                <div class="dropdown-header">
                  <div class="dropdown-header-title">
                    <h3>Multi-Level Sorting</h3>
                    <span class="dropdown-subtitle">Set primary and secondary sort orders</span>
                  </div>
                  <button type="button" class="btn-close-dropdown" aria-label="Close sort dropdown">&times;</button>
                </div>
                <div class="dropdown-body">
                  <div id="sortRulesList" class="rules-list-container">
                    <!-- Dynamic multiple sort rows injected here -->
                  </div>
                  <button type="button" id="btnAddSortRule" class="btn-add-rule">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Add Sort Level</span>
                  </button>
                </div>
                <div class="dropdown-footer">
                  <button type="button" class="btn-secondary btn-sm" id="btnResetSort">Default Sort</button>
                  <button type="button" class="btn-primary btn-sm" id="btnApplySort">Apply Sort</button>
                </div>
              </div>
            </div>

            <!-- Columns Visibility Tab -->
            <div class="toolbar-dropdown-wrapper">
              <button type="button" class="toolbar-tab-btn" id="tabBtnColumns" aria-expanded="false" aria-controls="dropdownColumns">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="3" x2="9" y2="21"></line>
                  <line x1="15" y1="3" x2="15" y2="21"></line>
                </svg>
                <span>Columns</span>
                <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              <div class="toolbar-dropdown-panel" id="dropdownColumns" role="region" aria-label="Column visibility controls">
                <div class="dropdown-header">
                  <div class="dropdown-header-title">
                    <h3>Available Columns</h3>
                    <span class="dropdown-subtitle">Search and toggle visibility</span>
                  </div>
                  <button type="button" class="btn-close-dropdown" aria-label="Close columns dropdown">&times;</button>
                </div>
                <div class="columns-search-wrapper">
                  <svg class="columns-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    id="columnSearchInput"
                    class="columns-search-input"
                    placeholder="Search columns..."
                    aria-label="Search columns to enable or disable"
                    autocomplete="off"
                  />
                  <button
                    type="button"
                    class="btn-clear-column-search"
                    id="btnClearColumnSearch"
                    aria-label="Clear column search"
                    title="Clear search"
                    hidden
                  >&times;</button>
                </div>
                <p class="dropdown-hint">Untick a column to hide it from the table.</p>
                <div class="dropdown-body columns-checkbox-list" id="columnsCheckboxList">${columnsVisibilityHtml}
                </div>
                <div class="columns-empty-message" id="columnsEmptyMessage" hidden>
                  No matching columns found
                </div>
                <div class="dropdown-footer">
                  <button type="button" class="btn-secondary btn-sm" id="btnShowAllColumns">Show All</button>
                </div>
              </div>
            </div>
          </div>
  `.trim();
}

/**
 * Renders the toolbar tabs into a container element or selector.
 *
 * @param {string|HTMLElement} target
 * @param {Object} config
 */
export function renderToolbarTabs(target, config = {}) {
  const container = typeof target === 'string' ? document.querySelector(target) : target;
  if (!container) return;

  let resolved = config;
  if (config.preset === 'survey' || config.preset === 'surveys') {
    resolved = { ...SURVEY_TOOLBAR_CONFIG, ...config };
  } else if (config.preset === 'question' || config.preset === 'questions') {
    resolved = { ...QUESTION_TOOLBAR_CONFIG, ...config };
  }

  // Prevent re-rendering if already rendered unless explicitly forced
  if (container.dataset.rendered && !config.force) {
    return;
  }

  container.innerHTML = createToolbarTabsHtml(resolved);
  container.dataset.rendered = resolved.id || resolved.preset || 'true';
}
