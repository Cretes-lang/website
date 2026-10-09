/**
 * Cretes Programming Language - Main Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeaderScroll();
  initCodeWorkbench();
  initCopyButtons();
  initSearchModal();
  initMobileDrawer();
});

/* ==========================================================================
   Theme Switcher (Dark / Light)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('cretes-theme') || 'dark';

  setTheme(storedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('cretes-theme', theme);
  const icon = document.getElementById('theme-icon');
  if (icon) {
    if (theme === 'light') {
      icon.innerHTML = `<path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" fill="currentColor"/>`;
    } else {
      icon.innerHTML = `<circle cx="12" cy="12" r="5" fill="currentColor"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    }
  }
}

/* ==========================================================================
   Header Scroll State
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   Interactive Hero Code Workbench
   ========================================================================== */
let activeSampleKey = 'hello';

function initCodeWorkbench() {
  const codeArea = document.getElementById('workbench-code-area');
  const tabs = document.querySelectorAll('.code-tab-btn');
  const runLexBtn = document.getElementById('btn-workbench-lex');
  const runAstBtn = document.getElementById('btn-workbench-ast');
  const copyBtn = document.getElementById('btn-workbench-copy');
  const outputDrawer = document.getElementById('workbench-output');
  const outputContent = document.getElementById('workbench-output-content');
  const closeOutputBtn = document.getElementById('btn-close-output');

  if (!codeArea || !window.CRETES_SAMPLES) return;

  function loadSample(key) {
    activeSampleKey = key;
    const sample = window.CRETES_SAMPLES[key];
    if (!sample) return;

    codeArea.innerHTML = window.highlightCretes(sample.code);

    tabs.forEach(t => {
      if (t.dataset.sample === key) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    if (outputDrawer) outputDrawer.classList.remove('open');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      loadSample(tab.dataset.sample);
    });
  });

  if (runLexBtn) {
    runLexBtn.addEventListener('click', () => {
      const sample = window.CRETES_SAMPLES[activeSampleKey];
      if (!sample || !window.CretesFrontend) return;
      const tokens = window.CretesFrontend.lex(sample.code);
      const formatted = window.CretesFrontend.formatLex(tokens);
      outputContent.textContent = formatted;
      outputDrawer.classList.add('open');
    });
  }

  if (runAstBtn) {
    runAstBtn.addEventListener('click', () => {
      const sample = window.CRETES_SAMPLES[activeSampleKey];
      if (!sample || !window.CretesFrontend) return;
      const ast = window.CretesFrontend.parseAst(sample.code);
      outputContent.textContent = ast;
      outputDrawer.classList.add('open');
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const sample = window.CRETES_SAMPLES[activeSampleKey];
      if (!sample) return;
      copyToClipboard(sample.code, "Cretes code copied to clipboard!");
    });
  }

  if (closeOutputBtn) {
    closeOutputBtn.addEventListener('click', () => {
      outputDrawer.classList.remove('open');
    });
  }

  // Initial load
  loadSample('hello');
}

/* ==========================================================================
   Copy to Clipboard Utilities
   ========================================================================== */
function initCopyButtons() {
  const installCopyBtn = document.getElementById('btn-copy-install');
  if (installCopyBtn) {
    installCopyBtn.addEventListener('click', () => {
      const cmd = document.getElementById('install-cmd-text').innerText;
      copyToClipboard(cmd, "Install command copied!");
    });
  }
}

function copyToClipboard(text, successMsg = "Copied to clipboard!") {
  navigator.clipboard.writeText(text).then(() => {
    showToast(successMsg);
  }).catch(() => {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(successMsg);
  });
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

/* ==========================================================================
   Search Modal (Ctrl+K)
   ========================================================================== */
const SEARCH_DATA = [
  { title: "Getting Started & Toolchain", cat: "Documentation", url: "docs.html#getting-started" },
  { title: "Phase 4 Syntax Specification", cat: "Specification", url: "docs.html#syntax" },
  { title: "Memory Borrowing & Provenance", cat: "Features", url: "docs.html#borrowing" },
  { title: "Result[T, E] & Error Handling", cat: "Language", url: "docs.html#errors" },
  { title: "Interactive Cretes Playground", cat: "Tool", url: "playground.html" },
  { title: "Zero-copy Network Packet Parsing", cat: "Examples", url: "docs.html#networking" },
  { title: "Standard Library (std::io, std::bytes, std::fs)", cat: "StdLib", url: "docs.html#stdlib" },
  { title: "RFC Governance & Contribution", cat: "Community", url: "community.html" },
  { title: "Lexer & Parser AST Demonstrations", cat: "Compiler", url: "docs.html#compiler" },
  { title: "Maintainer & Apache 2.0 License", cat: "About", url: "community.html#governance" }
];

function initSearchModal() {
  const modal = document.getElementById('search-modal');
  const openBtns = document.querySelectorAll('[data-open-search]');
  const closeBtn = document.getElementById('btn-close-search');
  const input = document.getElementById('search-input');
  const resultsList = document.getElementById('search-results');

  if (!modal || !input || !resultsList) return;

  function openModal() {
    modal.classList.add('open');
    input.value = '';
    renderResults(SEARCH_DATA);
    setTimeout(() => input.focus(), 50);
  }

  function closeModal() {
    modal.classList.remove('open');
  }

  function renderResults(items) {
    if (items.length === 0) {
      resultsList.innerHTML = `<li style="padding: 24px; text-align: center; color: var(--text-muted);">No matching Cretes documentation or topics found</li>`;
      return;
    }

    resultsList.innerHTML = items.map((item, idx) => `
      <li class="search-result-item ${idx === 0 ? 'selected' : ''}" onclick="window.location.href='${item.url}'">
        <div class="search-result-left">
          <svg class="search-result-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          <div>
            <div class="search-result-title">${item.title}</div>
            <div class="search-result-cat">${item.cat}</div>
          </div>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </li>
    `).join('');
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      renderResults(SEARCH_DATA);
      return;
    }
    const filtered = SEARCH_DATA.filter(item => 
      item.title.toLowerCase().includes(q) || item.cat.toLowerCase().includes(q)
    );
    renderResults(filtered);
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (modal.classList.contains('open')) {
        closeModal();
      } else {
        openModal();
      }
    } else if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   Mobile Drawer Navigation
   ========================================================================== */
function initMobileDrawer() {
  const drawer = document.getElementById('mobile-drawer');
  const openBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('btn-close-drawer');

  if (!drawer || !openBtn) return;

  openBtn.addEventListener('click', () => {
    drawer.classList.add('open');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      drawer.classList.remove('open');
    });
  }

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) {
      drawer.classList.remove('open');
    }
  });
}
