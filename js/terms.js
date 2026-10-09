/**
 * Cretes Programming Language — Terms of Use Page Controller
 * High-performance IntersectionObserver TOC tracking, Reading Progress,
 * Accessible Clipboard Copy, Print Actions, and Mobile TOC Disclosure.
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', initLegalPage);

  function initLegalPage() {
    initReadingProgress();
    initTocActiveTracking();
    initMobileToc();
    initUtilityActions();
    initBackToTop();
    initSystemThemeListener();
  }

  /* --------------------------------------------------------------------------
     1. Reading Progress Bar (Section 11 Specification)
     -------------------------------------------------------------------------- */
  function initReadingProgress() {
    const progressBar = document.getElementById('reading-progress');
    const article = document.getElementById('main-content');
    if (!progressBar || !article) return;

    let ticking = false;

    function updateProgress() {
      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const currentScroll = window.scrollY;

      // Start calculating when the top of article enters, end when the bottom is viewed
      const start = articleTop - (windowHeight * 0.2);
      const end = articleTop + articleHeight - (windowHeight * 0.8);
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

      // Clamp between 0% and 100%
      percentage = Math.min(100, Math.max(0, percentage));
      progressBar.style.width = percentage.toFixed(1) + '%';
      progressBar.setAttribute('aria-valuenow', Math.round(percentage).toString());
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
    const aside = document.querySelector('.legal-toc-aside');

    if (!sections.length) return;

    let activeId = null;

    // Use IntersectionObserver with a top offset to account for sticky header
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

      // Find the topmost visible section
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

      // Fallback: If no section is in optimal threshold, pick the one above fold
      if (!bestSectionId) {
        let candidateId = null;
        sections.forEach((sec) => {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= 120) {
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

      // Update Desktop TOC
      desktopTocLinks.forEach((link) => {
        const href = link.getAttribute('href');
        const match = href === '#' + id;
        if (match) {
          link.classList.add('is-active');
          link.setAttribute('aria-current', 'location');
          // Auto-scroll sidebar if necessary
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
    }

    // Set initial active state based on hash or first section
    const currentHash = window.location.hash.replace('#', '');
    if (currentHash && document.getElementById(currentHash)) {
      setActiveSection(currentHash);
    } else {
      setActiveSection(sections[0].id);
    }
  }

  /* --------------------------------------------------------------------------
     3. Mobile TOC Accordion / Disclosure (Section 13.3)
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

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !panel.contains(e.target)) {
        toggleBtn.setAttribute('aria-expanded', 'false');
        panel.classList.remove('is-open');
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. Document Utility Actions: Copy Link & Print (Section 10)
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
     5. Back to Top Button
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
     6. System Theme Preference Listener (Section 14 Specification)
     -------------------------------------------------------------------------- */
  function initSystemThemeListener() {
    if (!window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (e) => {
      const stored = localStorage.getItem('cretes-theme');
      // If user hasn't explicitly locked light/dark, adapt with system
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
