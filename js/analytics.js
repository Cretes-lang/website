/**
 * Cretes - Privacy-Preserving Website Analytics
 * Compliant with GDPR, ePrivacy, and CCPA. Zero cookies. Zero PII.
 * Honors Do Not Track (DNT) and Global Privacy Control (GPC).
 */

(function () {
  'use strict';

  // Check user privacy signals
  const isDNT = navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  if (isDNT) {
    // Respect user privacy by suppressing non-essential telemetry
    window.CretesAnalytics = {
      track: () => {},
      isOptedOut: true
    };
    return;
  }

  const ENDPOINT = '/api/analytics';

  function getDeviceType() {
    const w = window.innerWidth;
    if (w < 768) return 'mobile';
    if (w < 1024) return 'tablet';
    return 'desktop';
  }

  function sendEvent(type, data = {}) {
    const payload = JSON.stringify({
      type,
      path: window.location.pathname || '/',
      device: getDeviceType(),
      theme: document.documentElement.getAttribute('data-theme') || 'dark',
      timestamp: Date.now(),
      data
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: 'application/json' }));
    } else {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(() => {});
    }
  }

  // Track initial pageview once DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    sendEvent('pageview', {
      referrer: document.referrer ? (new URL(document.referrer, window.location.href)).hostname : 'direct'
    });
  });

  // Track Web Vitals if emitted
  window.addEventListener('cretes:vital', (e) => {
    if (e.detail) {
      sendEvent('web_vital', {
        metric: e.detail.name,
        value: e.detail.value,
        rating: e.detail.rating
      });
    }
  });

  // Global tracking API for user interactions
  window.CretesAnalytics = {
    track: (type, data) => sendEvent(type, data),
    isOptedOut: false
  };
})();
