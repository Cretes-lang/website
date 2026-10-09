/**
 * Cretes - Zero-Dependency Core Web Vitals RUM Observer
 * Measures: CLS (Cumulative Layout Shift), LCP (Largest Contentful Paint),
 * INP (Interaction to Next Paint), FCP (First Contentful Paint), TTFB (Time to First Byte).
 */

(function () {
  'use strict';

  const vitals = {
    cls: 0,
    lcp: 0,
    inp: 0,
    fcp: 0,
    ttfb: 0,
    timestamp: Date.now()
  };

  function reportMetric(name, value, rating) {
    vitals[name.toLowerCase()] = Math.round(value * 100) / 100;
    
    // Dispatch custom event for analytics listener
    window.dispatchEvent(new CustomEvent('cretes:vital', {
      detail: { name, value, rating }
    }));
  }

  function getRating(name, val) {
    switch (name) {
      case 'CLS': return val <= 0.1 ? 'good' : (val <= 0.25 ? 'needs-improvement' : 'poor');
      case 'LCP': return val <= 2500 ? 'good' : (val <= 4000 ? 'needs-improvement' : 'poor');
      case 'INP': return val <= 200 ? 'good' : (val <= 500 ? 'needs-improvement' : 'poor');
      case 'FCP': return val <= 1800 ? 'good' : (val <= 3000 ? 'needs-improvement' : 'poor');
      case 'TTFB': return val <= 800 ? 'good' : (val <= 1800 ? 'needs-improvement' : 'poor');
      default: return 'good';
    }
  }

  // 1. TTFB (Time to First Byte)
  function measureTTFB() {
    try {
      const navEntry = performance.getEntriesByType('navigation')[0];
      if (navEntry) {
        const val = navEntry.responseStart;
        reportMetric('TTFB', val, getRating('TTFB', val));
      }
    } catch (_) {}
  }

  // 2. FCP (First Contentful Paint)
  function observeFCP() {
    try {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            reportMetric('FCP', entry.startTime, getRating('FCP', entry.startTime));
            observer.disconnect();
          }
        }
      });
      observer.observe({ type: 'paint', buffered: true });
    } catch (_) {}
  }

  // 3. LCP (Largest Contentful Paint)
  function observeLCP() {
    try {
      let latestLcp = 0;
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          latestLcp = lastEntry.startTime;
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });

      // Finalize LCP on first user interaction or hide
      const finalize = () => {
        if (latestLcp > 0) {
          reportMetric('LCP', latestLcp, getRating('LCP', latestLcp));
        }
        observer.disconnect();
      };
      ['keydown', 'click', 'visibilitychange'].forEach(evt => {
        window.addEventListener(evt, finalize, { once: true, passive: true });
      });
    } catch (_) {}
  }

  // 4. CLS (Cumulative Layout Shift)
  function observeCLS() {
    try {
      let clsValue = 0;
      let sessionEntries = [];

      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            sessionEntries.push(entry);
          }
        }
        reportMetric('CLS', clsValue, getRating('CLS', clsValue));
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (_) {}
  }

  // 5. INP (Interaction to Next Paint)
  function observeINP() {
    try {
      let maxDuration = 0;
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.duration > maxDuration) {
            maxDuration = entry.duration;
            reportMetric('INP', maxDuration, getRating('INP', maxDuration));
          }
        }
      });
      observer.observe({ type: 'event', buffered: true, durationThreshold: 16 });
    } catch (_) {}
  }

  // Run observers after page load using requestIdleCallback to protect Main Thread
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    const init = () => {
      measureTTFB();
      observeFCP();
      observeLCP();
      observeCLS();
      observeINP();
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(init);
    } else {
      window.addEventListener('load', () => setTimeout(init, 50), { once: true });
    }
  }

  window.CretesVitals = {
    getMetrics: () => Object.assign({}, vitals)
  };
})();
