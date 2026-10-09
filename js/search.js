/**
 * Cretes - Fast Client-Side Documentation Search & Command Palette
 * Accessible, zero-dependency, keyboard-navigable (ArrowUp, ArrowDown, Enter, Esc).
 */

(function () {
  'use strict';

  let dialog, input, resultsList, statusAnnouncer, backdrop;
  let activeIndex = -1;
  let currentResults = [];

  document.addEventListener('DOMContentLoaded', () => {
    initSearch();
  });

  function initSearch() {
    dialog = document.getElementById('search-dialog');
    input = document.getElementById('search-input');
    resultsList = document.getElementById('search-results');
    statusAnnouncer = document.getElementById('search-status');
    backdrop = document.getElementById('search-backdrop');

    if (!dialog || !input || !resultsList) return;

    // Trigger buttons
    const triggerButtons = document.querySelectorAll('[data-search-trigger]');
    triggerButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearch();
      });
    });

    // Keyboard shortcuts: Cmd+K / Ctrl+K, or slash ('/') outside input elements
    window.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (dialog.classList.contains('is-open')) {
          closeSearch();
        } else {
          openSearch();
        }
      } else if (e.key === '/' && !isInputFocused() && !dialog.classList.contains('is-open')) {
        e.preventDefault();
        openSearch();
      } else if (e.key === 'Escape' && dialog.classList.contains('is-open')) {
        e.preventDefault();
        closeSearch();
      }
    });

    // Backdrop click to close
    if (backdrop) {
      backdrop.addEventListener('click', closeSearch);
    }

    // Close button
    const closeBtn = document.getElementById('search-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeSearch);
    }

    // Input events
    input.addEventListener('input', handleQuery);
    input.addEventListener('keydown', handleKeyNavigation);

    // Initial render of top suggestions
    renderResults(window.CRETES_SEARCH_INDEX ? window.CRETES_SEARCH_INDEX.slice(0, 6) : []);
  }

  function isInputFocused() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
  }

  function openSearch() {
    dialog.classList.add('is-open');
    dialog.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    input.value = '';
    activeIndex = -1;
    renderResults(window.CRETES_SEARCH_INDEX ? window.CRETES_SEARCH_INDEX.slice(0, 6) : []);
    setTimeout(() => input.focus(), 50);

    if (window.CretesAnalytics && window.CretesAnalytics.track) {
      window.CretesAnalytics.track('search_open');
    }
  }

  function closeSearch() {
    dialog.classList.remove('is-open');
    dialog.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    activeIndex = -1;
  }

  function handleQuery() {
    const query = input.value.trim().toLowerCase();
    activeIndex = -1;

    if (!window.CRETES_SEARCH_INDEX) return;

    if (!query) {
      renderResults(window.CRETES_SEARCH_INDEX.slice(0, 6));
      announce('Showing recommended documentation topics');
      return;
    }

    const tokens = query.split(/\s+/).filter(Boolean);
    const scored = window.CRETES_SEARCH_INDEX.map(item => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const descLower = item.desc.toLowerCase();
      const sectionLower = item.section.toLowerCase();

      for (const t of tokens) {
        if (titleLower.includes(t)) score += 10;
        if (item.keywords && item.keywords.some(k => k.includes(t))) score += 6;
        if (descLower.includes(t)) score += 3;
        if (sectionLower.includes(t)) score += 2;
      }
      return { item, score };
    }).filter(res => res.score > 0);

    scored.sort((a, b) => b.score - a.score);
    currentResults = scored.map(res => res.item);

    renderResults(currentResults, query);

    const count = currentResults.length;
    announce(`${count} result${count === 1 ? '' : 's'} found for ${query}`);

    if (window.CretesAnalytics && window.CretesAnalytics.track) {
      window.CretesAnalytics.track('search_query', { query, resultsCount: count });
    }
  }

  function handleKeyNavigation(e) {
    const items = resultsList.querySelectorAll('.search-result-item');
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = (activeIndex + 1) % items.length;
      updateActiveItem(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = (activeIndex - 1 + items.length) % items.length;
      updateActiveItem(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < items.length) {
        items[activeIndex].click();
      } else if (items.length > 0) {
        items[0].click();
      }
    }
  }

  function updateActiveItem(items) {
    items.forEach((item, idx) => {
      const isActive = idx === activeIndex;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      if (isActive) {
        item.scrollIntoView({ block: 'nearest' });
        input.setAttribute('aria-activedescendant', item.id);
      }
    });
  }

  function renderResults(results, query = '') {
    currentResults = results;
    resultsList.innerHTML = '';

    if (!results.length) {
      resultsList.innerHTML = `
        <div class="search-empty">
          <p>No documentation found matching "<strong>${escapeHtml(query)}</strong>"</p>
          <span class="search-empty-hint">Try searching for keywords like <code>ownership</code>, <code>async</code>, <code>RFC 0004</code>, or <code>FFI</code>.</span>
        </div>
      `;
      return;
    }

    results.forEach((item, idx) => {
      const link = document.createElement('a');
      link.id = `search-item-${idx}`;
      link.className = 'search-result-item';
      link.href = item.url;
      link.setAttribute('role', 'option');
      link.setAttribute('aria-selected', 'false');

      link.innerHTML = `
        <div class="search-item-header">
          <span class="search-item-badge badge-${item.section.toLowerCase().replace(/[^a-z0-9]/g, '-')}">${escapeHtml(item.section)}</span>
          <span class="search-item-title">${highlightText(item.title, query)}</span>
        </div>
        <p class="search-item-desc">${highlightText(item.desc, query)}</p>
      `;

      link.addEventListener('click', () => {
        closeSearch();
        if (window.CretesAnalytics && window.CretesAnalytics.track) {
          window.CretesAnalytics.track('search_select', { title: item.title, url: item.url });
        }
      });

      resultsList.appendChild(link);
    });
  }

  function highlightText(text, query) {
    if (!query) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const tokens = query.split(/\s+/).filter(Boolean).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (!tokens.length) return escaped;
    const regex = new RegExp(`(${tokens.join('|')})`, 'gi');
    return escaped.replace(regex, '<mark>$1</mark>');
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function announce(msg) {
    if (statusAnnouncer) {
      statusAnnouncer.textContent = msg;
    }
  }

  window.CretesSearch = {
    open: openSearch,
    close: closeSearch
  };
})();
