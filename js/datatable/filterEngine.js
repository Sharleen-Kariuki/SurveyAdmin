// Houses DataTable.ext.search hook registration, condition comparison logic (contains, equals, gt, lt), and table controller registration.
const activeControllers = {};

export function registerController(tableId, controller) {
  activeControllers[tableId] = controller;
}

export function unregisterController(tableId) {
  delete activeControllers[tableId];
}

export function getController(tableId) {
  return activeControllers[tableId];
}

export function stripHtml(html) {
  if (html === null || html === undefined) return '';
  return String(html)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getCellText(searchData, rowData, colIdx) {
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

export function parseDateDMY(str) {
  if (!str) return null;
  const clean = String(str).replace(/<[^>]*>/g, '').trim();
  const match = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const d = parseInt(match[1], 10);
    const m = parseInt(match[2], 10) - 1;
    const y = parseInt(match[3], 10);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y) && d >= 1 && d <= 31 && m >= 0 && m <= 11 && y >= 1900 && y <= 2100) {
      const dt = new Date(y, m, d);
      if (!isNaN(dt.getTime())) return dt.getTime();
    }
  }
  return null;
}

export function testCondition(cellText, relation, query, expectedType = 'all') {
  const rawCell = String(cellText ?? '').trim();
  const rawQuery = String(query ?? '').trim();
  const lowerCell = rawCell.toLowerCase();
  const lowerQuery = rawQuery.toLowerCase();

  // If expected type is date, enforce chronological comparisons for operators
  if (expectedType === 'date') {
    const cellTime = parseDateDMY(rawCell);
    const queryTime = parseDateDMY(rawQuery);

    // If query is not a valid date, it fails date comparison
    if (queryTime === null) {
      return false;
    }

    if (cellTime !== null && ['equals', 'not_equals', 'gt', 'lt', 'gte', 'lte'].includes(relation)) {
      switch (relation) {
        case 'equals':
          return cellTime === queryTime;
        case 'not_equals':
          return cellTime !== queryTime;
        case 'gt':
          return cellTime > queryTime;
        case 'lt':
          return cellTime < queryTime;
        case 'gte':
          return cellTime >= queryTime;
        case 'lte':
          return cellTime <= queryTime;
      }
    }

    if (cellTime !== null && ['contains', 'starts_with', 'ends_with'].includes(relation)) {
      switch (relation) {
        case 'contains':
          return lowerCell.includes(lowerQuery);
        case 'starts_with':
          return lowerCell.startsWith(lowerQuery);
        case 'ends_with':
          return lowerCell.endsWith(lowerQuery);
      }
    }

    return false;
  }

  // If expected type is text, enforce strict text comparisons
  if (expectedType === 'text') {
    switch (relation) {
      case 'contains':
        return lowerCell.includes(lowerQuery);
      case 'equals':
        return lowerCell === lowerQuery;
      case 'not_equals':
        return lowerCell !== lowerQuery;
      case 'starts_with':
        return lowerCell.startsWith(lowerQuery);
      case 'ends_with':
        return lowerCell.endsWith(lowerQuery);
      default:
        return lowerCell.includes(lowerQuery);
    }
  }

  // If expected type is number, enforce strict numeric comparisons
  if (expectedType === 'number') {
    const cleanCellNum = rawCell.replace(/[$,]/g, '');
    const cleanQueryNum = rawQuery.replace(/[$,]/g, '');
    const numCell = parseFloat(cleanCellNum);
    const numQuery = parseFloat(cleanQueryNum);
    const isBothNumeric = !isNaN(numCell) && !isNaN(numQuery) && cleanCellNum !== '' && cleanQueryNum !== '';

    if (!isBothNumeric) return false;

    switch (relation) {
      case 'equals':
        return numCell === numQuery;
      case 'not_equals':
        return numCell !== numQuery;
      case 'gt':
        return numCell > numQuery;
      case 'lt':
        return numCell < numQuery;
      case 'gte':
        return numCell >= numQuery;
      case 'lte':
        return numCell <= numQuery;
      default:
        return numCell === numQuery;
    }
  }

  // Fallback comparison for 'all' columns
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

export function matchesRule(searchData, rowData, rule, allColumns = [0, 1, 2, 3, 4, 5], columnTypes = {}) {
  if (!rule || rule.value === undefined || rule.value === null) {
    return true;
  }

  const query = String(rule.value).trim();
  if (query === '') return true;

  const { col, relation } = rule;

  if (col === 'all') {
    return allColumns.some((colIdx) => {
      const cellText = getCellText(searchData, rowData, colIdx);
      const colType = columnTypes[colIdx] || 'all';
      return testCondition(cellText, relation, query, colType);
    });
  }

  const colIdx = Number(col);
  const cellText = getCellText(searchData, rowData, colIdx);
  const colType = columnTypes[col] || columnTypes[colIdx] || 'all';
  return testCondition(cellText, relation, query, colType);
}

/**
 * Registers the global DataTable.ext.search filter function (idempotent).
 */
export function ensureGlobalFilterHooked() {
  const dt = window.DataTable || (typeof DataTable !== 'undefined' ? DataTable : null);
  if (!dt || !dt.ext || !dt.ext.search) return;

  if (!dt.__adminGlobalFilterHooked) {
    dt.ext.search.push(function (settings, searchData, dataIndex, rowData) {
      const tableElem = settings.table || settings.nTable;
      const currentTableId = settings.tableId || (tableElem ? tableElem.id : '') || settings.sTableId;

      const controller = activeControllers[currentTableId];
      if (!controller) return true;

      // 1. Evaluate Inline Non-Global Search Rule (if applied)
      if (controller.currentSearchRule && controller.currentSearchRule.value !== undefined && controller.currentSearchRule.value !== null) {
        const searchVal = String(controller.currentSearchRule.value).trim();
        if (searchVal !== '') {
          if (!matchesRule(
            searchData,
            rowData,
            controller.currentSearchRule,
            controller.allFilterCols,
            controller.columnTypes || {}
          )) {
            return false;
          }
        }
      }

      // 2. Evaluate Multiple Filter Rules (all non-empty rules must match - AND logic)
      const filterRules = controller.currentFilterRules || (controller.currentFilterRule ? [controller.currentFilterRule] : []);
      if (Array.isArray(filterRules) && filterRules.length > 0) {
        for (const rule of filterRules) {
          if (rule && rule.value !== undefined && rule.value !== null && String(rule.value).trim() !== '') {
            if (!matchesRule(
              searchData,
              rowData,
              rule,
              controller.allFilterCols,
              controller.columnTypes || {}
            )) {
              return false;
            }
          }
        }
      }

      return true;
    });

    dt.__adminGlobalFilterHooked = true;
  }
}
