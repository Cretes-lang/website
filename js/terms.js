/**
 * Cretes Programming Language — Terms of Use Page Controller
 * Enterprise Technical Documentation UX:
 * - 3px Gradient Reading Progress Bar with dual-track sync
 * - Live Desktop Reading HUD Widget (Percentage, Time Est, Current Section)
 * - Mobile TOC Progress Pill
 * - High-performance IntersectionObserver Section Tracking
 * - Interactive Real-time Section Filter for 24 Sections
 * - Accessible Clipboard Copy & Native Print Actions
 * - Accessible Mobile TOC Drawer
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initLegalPage);

  function initLegalPage() {
    initReadingProgress();
    initTocActiveTracking();
    initTocFilter();
    initMobileToc();
    initUtilityActions();
    initBackToTop();
    initSystemThemeListener();
  }

  /* --------------------------------------------------------------------------
     1. Corporate Reading Progress Bar & Live HUD Sync
     -------------------------------------------------------------------------- */
  function initReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    const article = document.getElementById('main-content');
    const railPct = document.getElementById('rail-progress-pct');
    const railFill = document.getElementById('rail-progress-fill');
    const railTime = document.getElementById('rail-time-est');
    const mobilePill = document.getElementById('mobile-progress-pill');

    if (!progressBar || !article) return;

    let ticking = false;
    const totalReadingMinutes = 8; // Baseline estimated reading time

    function updateProgress() {
      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const currentScroll = window.scrollY;

      const start = articleTop - (windowHeight * 0.15);
      const end = articleTop + articleHeight - (windowHeight * 0.75);
      const distance = end - start;

      let percentage = 0;
      if (distance > 0) {
        if (currentScroll <= start) {
          percentage = 0;
        } else if (currentScroll >= end) {
          percentage = 100;
        } else {
          percentage = ((currentScroll - start) / distance) * 100;
        }
      }

      percentage = Math.min(100, Math.max(0, percentage));
      const formattedPct = percentage.toFixed(0) + '%';

      // 1. Top Bar
      progressBar.style.width = percentage.toFixed(1) + '%';
      progressBar.setAttribute('aria-valuenow', Math.round(percentage).toString());

      // 2. Desktop Rail HUD
      if (railPct) railPct.textContent = formattedPct;
      if (railFill) railFill.style.width = percentage.toFixed(1) + '%';
      if (railTime) {
        const remainingMinutes = Math.max(1, Math.ceil(((100 - percentage) / 100) * totalReadingMinutes));
        railTime.textContent = percentage >= 98 ? 'Complete' : `~${remainingMinutes} min read`;
      }

      // 3. Mobile Progress Pill
      if (mobilePill) {
        mobilePill.textContent = formattedPct;
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    window.addEventListener('resize', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    updateProgress();
  }

  /* --------------------------------------------------------------------------
     2. IntersectionObserver Active TOC Tracking (Section 8 Specification)
     -------------------------------------------------------------------------- */
  function initTocActiveTracking() {
    const sections = document.querySelectorAll('.legal-section');
    const desktopTocLinks = document.querySelectorAll('.legal-toc-link');
    const mobileTocLinks = document.querySelectorAll('.mobile-toc-link');
    const mobileCurrentLabel = document.getElementById('mobile-toc-current-label');
    const tocStatusActiveName = document.getElementById('toc-status-active-name');
    const railSecTitle = document.getElementById('rail-sec-title');
    const aside = document.querySelector('.legal-toc-aside');

    if (!sections.length) return;

    let activeId = null;

    const observerOptions = {
      root: null,
      rootMargin: '-88px 0px -65% 0px',
      threshold: [0, 0.2, 0.5]
    };

    const sectionEntries = new Map();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        sectionEntries.set(entry.target.id, entry);
      });

      let bestSectionId = null;
      let minTop = Infinity;

      sections.forEach((sec) => {
        const id = sec.id;
        const entry = sectionEntries.get(id);
        if (entry && entry.isIntersecting) {
          const top = entry.boundingClientRect.top;
          if (top >= 0 && top < minTop) {
            minTop = top;
            bestSectionId = id;
          }
        }
      });

      if (!bestSectionId) {
        let candidateId = null;
        sections.forEach((sec) => {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= 140) {
            candidateId = sec.id;
          }
        });
        bestSectionId = candidateId || sections[0].id;
      }

      if (bestSectionId && bestSectionId !== activeId) {
        setActiveSection(bestSectionId);
      }
    }, observerOptions);

    sections.forEach((sec) => observer.observe(sec));

    function setActiveSection(id) {
      activeId = id;
      let activeTitleText = '';
      let activeNumText = '';

      // Update Desktop TOC
      desktopTocLinks.forEach((link) => {
        const href = link.getAttribute('href');
        const match = href === '#' + id;
        if (match) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'location');
          const numSpan = link.querySelector('.legal-toc-num');
          const textSpan = link.querySelector('.legal-toc-text');
          activeNumText = numSpan ? numSpan.textContent.trim() : '';
          activeTitleText = textSpan ? textSpan.textContent.trim() : '';

          // Auto-scroll sidebar if item overflows view
          if (aside) {
            const linkRect = link.getBoundingClientRect();
            const asideRect = aside.getBoundingClientRect();
            if (linkRect.bottom > asideRect.bottom || linkRect.top < asideRect.top) {
              link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
          }
        } else {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
        }
      });

      // Update Mobile TOC
      mobileTocLinks.forEach((link) => {
        const href = link.getAttribute('href');
        const match = href === '#' + id;
        if (match) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'location');
          const numSpan = link.querySelector('.mobile-toc-num');
          const title = link.textContent.replace(numSpan ? numSpan.textContent : '', '').trim();
          if (mobileCurrentLabel) {
            mobileCurrentLabel.textContent = '• ' + (numSpan ? numSpan.textContent + ' ' : '') + title;
          }
        } else {
          link.classList.remove('is-active');
          link.removeAttribute('aria-current');
        }
      });

      // Update TOC Status Chip
      if (tocStatusActiveName && activeTitleText) {
        tocStatusActiveName.textContent = `${activeNumText ? activeNumText + '. ' : ''}${activeTitleText}`;
      }

      // Update Desktop Rail Current Section
      if (railSecTitle && activeTitleText) {
        railSecTitle.textContent = `${activeNumText ? activeNumText + ' ' : ''}${activeTitleText}`;
      }
    }

    const currentHash = window.location.hash.replace('#', '');
    if (currentHash && document.getElementById(currentHash)) {
      setActiveSection(currentHash);
    } else {
      setActiveSection(sections[0].id);
    }
  }

  /* --------------------------------------------------------------------------
     3. Real-Time Section Filter for 24 Sections
     -------------------------------------------------------------------------- */
  function initTocFilter() {
    const desktopInput = document.getElementById('toc-filter-input');
    const mobileInput = document.getElementById('mobile-toc-filter-input');
    const clearBtn = document.getElementById('toc-filter-clear');
    const countBadge = document.getElementById('toc-count-badge');
    const desktopItems = document.querySelectorAll('.legal-toc-item');
    const mobileItems = document.querySelectorAll('#mobile-toc-list li');

    if (!desktopInput && !mobileInput) return;

    function applyFilter(query) {
      const q = query.toLowerCase().trim();
      let visibleCount = 0;

      // Filter Desktop TOC
      desktopItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          item.classList.remove('is-hidden');
          visibleCount++;
        } else {
          item.classList.add('is-hidden');
        }
      });

      // Filter Mobile TOC
      mobileItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (!q || text.includes(q)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });

      // Update Count Badge
      if (countBadge) {
        countBadge.textContent = q ? `${visibleCount} Found` : '24 Sections';
      }

      // Show/Hide Clear Button
      if (clearBtn) {
        clearBtn.style.display = q ? 'block' : 'none';
      }
    }

    if (desktopInput) {
      desktopInput.addEventListener('input', (e) => applyFilter(e.target.value));
      desktopInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          desktopInput.value = '';
          applyFilter('');
        }
      });
    }

    if (mobileInput) {
      mobileInput.addEventListener('input', (e) => applyFilter(e.target.value));
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (desktopInput) desktopInput.value = '';
        if (mobileInput) mobileInput.value = '';
        applyFilter('');
        if (desktopInput) desktopInput.focus();
      });
    }
  }

  /* --------------------------------------------------------------------------
     4. Mobile TOC Accordion / Disclosure (Section 13.3)
     -------------------------------------------------------------------------- */
  function initMobileToc() {
    const toggleBtn = document.getElementById('mobile-toc-toggle');
    const panel = document.getElementById('mobile-toc-panel');
    const links = document.querySelectorAll('.mobile-toc-link');

    if (!toggleBtn || !panel) return;

    toggleBtn.addEventListener('click', () => {
      const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      const next = !isExpanded;
      toggleBtn.setAttribute('aria-expanded', next.toString());
      panel.classList.toggle('is-open', next);
    });

    links.forEach((link) => {
      link.addEventListener('click', () => {
        toggleBtn.setAttribute('aria-expanded', 'false');
        panel.classList.remove('is-open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !panel.contains(e.target)) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        panel.classList.remove('is-open');
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. Document Utility Actions: Copy Link & Print (Section 10)
     -------------------------------------------------------------------------- */
  function initUtilityActions() {
    const copyBtns = document.querySelectorAll('[data-action="copy-link"]');
    const printBtns = document.querySelectorAll('[data-action="print-doc"]');

    copyBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const url = window.location.origin + '/terms';

        copyToClipboard(url, () => {
          showTooltipFeedback(btn, 'Copied Link!');
          a11yAnnounce('Terms of Use URL copied to clipboard.');
        }, () => {
          showTooltipFeedback(btn, 'Failed to copy');
          a11yAnnounce('Could not copy link to clipboard.');
        });
      });
    });

    printBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.print();
      });
    });
  }

  function copyToClipboard(text, onSuccess, onError) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(onSuccess).catch(onError);
    } else {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful) onSuccess();
        else onError();
      } catch (err) {
        onError();
      }
    }
  }

  function showTooltipFeedback(btn, message) {
    let tooltip = btn.querySelector('.copy-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('span');
      tooltip.className = 'copy-tooltip';
      btn.appendChild(tooltip);
    }
    tooltip.textContent = message;
    tooltip.classList.add('show');

    setTimeout(() => {
      tooltip.classList.remove('show');
    }, 2200);
  }

  /* --------------------------------------------------------------------------
     6. Back to Top Button
     -------------------------------------------------------------------------- */
  function initBackToTop() {
    const backBtn = document.getElementById('back-to-top');
    if (!backBtn) return;

    let ticking = false;

    function checkScroll() {
      if (window.scrollY > 400) {
        backBtn.classList.add('is-visible');
      } else {
        backBtn.classList.remove('is-visible');
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(checkScroll);
        ticking = true;
      }
    }, { passive: true });

    backBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      a11yAnnounce('Scrolled back to top of document');
    });
  }

  /* --------------------------------------------------------------------------
     7. System Theme Preference Listener (Section 14 Specification)
     -------------------------------------------------------------------------- */
  function initSystemThemeListener() {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (e) => {
      const stored = localStorage.getItem('cretes-theme');
      if (!stored || stored === 'system') {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
      }
    });
  }

  function a11yAnnounce(msg) {
    const el = document.getElementById('a11y-announcer');
    if (el) {
      el.textContent = '';
      setTimeout(() => { el.textContent = msg; }, 50);
    }
  }

})();
