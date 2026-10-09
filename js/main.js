/**
 * Cretes - Minimalist Header Interactions & Theme Toggle
 */

const SUN_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
<g clip-path="url(#clip0_4418_7943)">
<path d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19Z" fill="white" style="fill: var(--fillg);"/>
<path d="M12 22.96C11.45 22.96 11 22.55 11 22V21.92C11 21.37 11.45 20.92 12 20.92C12.55 20.92 13 21.37 13 21.92C13 22.47 12.55 22.96 12 22.96ZM19.14 20.14C18.88 20.14 18.63 20.04 18.43 19.85L18.3 19.72C17.91 19.33 17.91 18.7 18.3 18.31C18.69 17.92 19.32 17.92 19.71 18.31L19.84 18.44C20.23 18.83 20.23 19.46 19.84 19.85C19.65 20.04 19.4 20.14 19.14 20.14ZM4.86 20.14C4.6 20.14 4.35 20.04 4.15 19.85C3.76 19.46 3.76 18.83 4.15 18.44L4.28 18.31C4.67 17.92 5.3 17.92 5.69 18.31C6.08 18.7 6.08 19.33 5.69 19.72L5.56 19.85C5.37 20.04 5.11 20.14 4.86 20.14ZM22 13H21.92C21.37 13 20.92 12.55 20.92 12C20.92 11.45 21.37 11 21.92 11C22.47 11 22.96 11.45 22.96 12C22.96 12.55 22.55 13 22 13ZM2.08 13H2C1.45 13 1 12.55 1 12C1 11.45 1.45 11 2 11C2.55 11 3.04 11.45 3.04 12C3.04 12.55 2.63 13 2.08 13ZM19.01 5.99C18.75 5.99 18.5 5.89 18.3 5.7C17.91 5.31 17.91 4.68 18.3 4.29L18.43 4.16C18.82 3.77 19.45 3.77 19.84 4.16C20.23 4.55 20.23 5.18 19.84 5.57L19.71 5.7C19.52 5.89 19.27 5.99 19.01 5.99ZM4.99 5.99C4.73 5.99 4.48 5.89 4.28 5.7L4.15 5.56C3.76 5.17 3.76 4.54 4.15 4.15C4.54 3.76 5.17 3.76 5.56 4.15L5.69 4.28C6.08 4.67 6.08 5.3 5.69 5.69C5.5 5.89 5.24 5.99 4.99 5.99ZM12 3.04C11.45 3.04 11 2.63 11 2.08V2C11 1.45 11.45 1 12 1C12.55 1 13 1.45 13 2C13 2.55 12.55 3.04 12 3.04Z" fill="white" style="fill: var(--fillg);"/>
</g>
<defs>
<clipPath id="clip0_4418_7943">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>`;

const MOON_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#ffffff">
<g clip-path="url(#clip0_4418_7940)">
<path d="M21.53 15.9304C21.37 15.6604 20.92 15.2404 19.8 15.4404C19.18 15.5504 18.55 15.6004 17.92 15.5704C15.59 15.4704 13.48 14.4004 12.01 12.7504C10.71 11.3004 9.90995 9.41036 9.89995 7.37036C9.89995 6.23036 10.12 5.13036 10.57 4.09036C11.01 3.08036 10.7 2.55036 10.48 2.33036C10.25 2.10036 9.70995 1.78036 8.64995 2.22036C4.55995 3.94036 2.02995 8.04036 2.32995 12.4304C2.62995 16.5604 5.52995 20.0904 9.36995 21.4204C10.29 21.7404 11.26 21.9304 12.26 21.9704C12.42 21.9804 12.58 21.9904 12.74 21.9904C16.09 21.9904 19.23 20.4104 21.21 17.7204C21.88 16.7904 21.7 16.2004 21.53 15.9304Z" fill="white" style="fill: var(--fillg);"/>
</g>
<defs>
<clipPath id="clip0_4418_7940">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>`;

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileDrawer();
});

function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('cretes-theme') || 'dark';

  applyTheme(storedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('cretes-theme', theme);

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    // If in dark mode, show Sun icon to switch to light mode
    // If in light mode, show Moon icon to switch to dark mode
    toggleBtn.innerHTML = theme === 'dark' ? SUN_ICON : MOON_ICON;
    toggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

function initMobileDrawer() {
  const openBtn = document.getElementById('mobile-open');
  const closeBtn = document.getElementById('mobile-close');
  const drawer = document.getElementById('mobile-drawer');

  if (!drawer) return;

  if (openBtn) {
    openBtn.addEventListener('click', () => drawer.classList.add('open'));
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', () => drawer.classList.remove('open'));
  }
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) drawer.classList.remove('open');
  });
}
