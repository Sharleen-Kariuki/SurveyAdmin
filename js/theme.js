/**
 * Simple 3-Color Theme Customizer
 * Options: Burgundy (Default), Royal Navy, Emerald Green.
 */

export const THEMES = [
  {
    id: 'burgundy',
    name: 'Burgundy',
    brandColor: '#660033',
    variables: {
      '--burgundy': 'hsl(330, 100%, 20%)',
      '--burgundy-gradient': 'linear-gradient(135deg, hsl(330, 95%, 22%) 0%, hsl(330, 100%, 17%) 100%)',
      '--burgundy-border': 'hsl(330, 60%, 28%)',
      '--primary': 'hsl(330, 85%, 50%)',
      '--primary-hover': 'hsl(330, 90%, 42%)',
      '--primary-light': 'hsla(330, 100%, 65%, 0.12)',
      '--primary-border': 'hsl(330, 90%, 56%)',
      '--border-focus': 'hsl(330, 85%, 50%)',
      '--table-row-hover': 'hsl(330, 63%, 93%)',
      '--focus-ring': 'hsla(330, 85%, 50%, 0.18)',
      '--hero-subtext': 'hsl(330, 25%, 88%)',
      '--hero-link': 'hsl(330, 100%, 88%)',
      '--hero-input-bg': 'hsl(330, 85%, 20%)',
      '--hover-burgundy': 'hsl(330, 100%, 20%)'
    }
  },
  {
    id: 'navy',
    name: 'Navy',
    brandColor: '#0f2b5c',
    variables: {
      '--burgundy': 'hsl(222, 70%, 21%)',
      '--burgundy-gradient': 'linear-gradient(135deg, hsl(222, 72%, 24%) 0%, hsl(222, 75%, 17%) 100%)',
      '--burgundy-border': 'hsl(222, 50%, 30%)',
      '--primary': 'hsl(217, 91%, 55%)',
      '--primary-hover': 'hsl(217, 91%, 45%)',
      '--primary-light': 'hsla(217, 91%, 55%, 0.12)',
      '--primary-border': 'hsl(217, 91%, 60%)',
      '--border-focus': 'hsl(217, 91%, 55%)',
      '--table-row-hover': 'hsl(217, 65%, 94%)',
      '--focus-ring': 'hsla(217, 91%, 55%, 0.2)',
      '--hero-subtext': 'hsl(217, 30%, 88%)',
      '--hero-link': 'hsl(217, 95%, 88%)',
      '--hero-input-bg': 'hsl(222, 60%, 18%)',
      '--hover-burgundy': 'hsl(222, 70%, 21%)'
    }
  },
  {
    id: 'emerald',
    name: 'Emerald',
    brandColor: '#064e3b',
    variables: {
      '--burgundy': 'hsl(164, 85%, 16%)',
      '--burgundy-gradient': 'linear-gradient(135deg, hsl(164, 80%, 19%) 0%, hsl(164, 90%, 13%) 100%)',
      '--burgundy-border': 'hsl(164, 50%, 25%)',
      '--primary': 'hsl(160, 84%, 39%)',
      '--primary-hover': 'hsl(160, 84%, 31%)',
      '--primary-light': 'hsla(160, 84%, 39%, 0.12)',
      '--primary-border': 'hsl(160, 84%, 44%)',
      '--border-focus': 'hsl(160, 84%, 39%)',
      '--table-row-hover': 'hsl(160, 50%, 94%)',
      '--focus-ring': 'hsla(160, 84%, 39%, 0.2)',
      '--hero-subtext': 'hsl(164, 30%, 88%)',
      '--hero-link': 'hsl(164, 90%, 88%)',
      '--hero-input-bg': 'hsl(164, 75%, 14%)',
      '--hover-burgundy': 'hsl(164, 85%, 16%)'
    }
  }
];

const STORAGE_KEY = 'surveyAdminThemeId';

/**
 * Apply theme variables to root and persist to localStorage.
 */
export function applyTheme(theme) {
  if (!theme || !theme.variables) return;
  const root = document.documentElement;
  for (const [prop, val] of Object.entries(theme.variables)) {
    root.style.setProperty(prop, val);
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme.id);
  } catch (e) {}
}

/**
 * Get active theme from localStorage or default to Burgundy.
 */
export function getSavedTheme() {
  try {
    const savedId = localStorage.getItem(STORAGE_KEY);
    const found = THEMES.find(t => t.id === savedId);
    if (found) return found;
  } catch (e) {}
  return THEMES[0];
}

/**
 * Initialize the 3-color switcher in the top bar.
 */
export function initThemeSwitcher() {
  const currentTheme = getSavedTheme();
  applyTheme(currentTheme);

  const container = document.getElementById('systemTopBar');
  if (!container) return;

  const swatchesContainer = document.getElementById('themeSwatches');
  const badge = document.getElementById('systemCurrentThemeName');

  function updateActiveUI(activeTheme) {
    if (badge) {
      badge.textContent = activeTheme.name;
    }

    if (swatchesContainer) {
      const buttons = swatchesContainer.querySelectorAll('.theme-swatch-btn');
      buttons.forEach(btn => {
        const id = btn.getAttribute('data-theme-id');
        const isActive = activeTheme.id === id;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
      });
    }
  }

  // Populate the 3 color swatch buttons
  if (swatchesContainer) {
    swatchesContainer.innerHTML = '';
    THEMES.forEach(theme => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'theme-swatch-btn';
      btn.setAttribute('data-theme-id', theme.id);
      btn.setAttribute('role', 'radio');
      btn.setAttribute('title', `${theme.name} Theme`);
      btn.setAttribute('aria-label', `${theme.name} Theme`);
      btn.style.backgroundColor = theme.brandColor;

      btn.addEventListener('click', () => {
        applyTheme(theme);
        updateActiveUI(theme);
      });

      swatchesContainer.appendChild(btn);
    });
  }

  updateActiveUI(currentTheme);
}

// Immediately apply saved theme variables to root document
try {
  applyTheme(getSavedTheme());
} catch(e) {}

// Auto-run switcher initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeSwitcher);
} else {
  initThemeSwitcher();
}
