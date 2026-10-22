// Manages saveTableState, loadTableState with 2hour expiration validation and clearTableState 

import { STATE_TTL_MS, STORAGE_PREFIX } from './constants.js';

export function saveTableState(storageKey, state) {
  try {
    const payload = {
      timestamp: Date.now(),
      searchRule: state.searchRule || null,
      filterRules: state.filterRules || [],
      sortRules: state.sortRules || [],
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

export function loadTableState(storageKey) {
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

    // Normalize backward compatibility
    if (!data.searchRule && data.search) {
      data.searchRule = typeof data.search === 'object'
        ? data.search
        : { col: 'all', relation: 'contains', value: String(data.search) };
    }
    if (!data.filterRules) {
      data.filterRules = data.filter ? [data.filter] : [];
    }
    if (!data.sortRules) {
      data.sortRules = data.sort ? (Array.isArray(data.sort) ? data.sort : [data.sort]) : [];
    }

    return data;
  } catch (err) {
    return null;
  }
}

export function clearTableState(storageKey) {
  try {
    localStorage.removeItem(STORAGE_PREFIX + storageKey);
  } catch (err) {
    // ignore
  }
}
