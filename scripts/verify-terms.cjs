const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'terms.html'), 'utf8');

console.log('--- Cretes Terms of Use Structural Verification ---');

// 1. Verify all 24 sections
let missingSections = [];
for (let i = 1; i <= 24; i++) {
  const pad = String(i).padStart(2, '0');
  const secId = `id="sec-${pad}"`;
  if (!html.includes(secId)) {
    missingSections.push(secId);
  }
}

if (missingSections.length > 0) {
  console.error('❌ Missing section IDs:', missingSections);
  process.exit(1);
} else {
  console.log('✅ All 24 section IDs (sec-01 to sec-24) verified.');
}

// 2. Verify all TOC links match
let missingLinks = [];
for (let i = 1; i <= 24; i++) {
  const pad = String(i).padStart(2, '0');
  const href = `href="#sec-${pad}"`;
  if (!html.includes(href)) {
    missingLinks.push(href);
  }
}

if (missingLinks.length > 0) {
  console.error('❌ Missing TOC hrefs:', missingLinks);
  process.exit(1);
} else {
  console.log('✅ All 24 Table of Contents anchor links verified.');
}

// 3. Verify landmarks and interactive controls
const checks = [
  { name: 'Main Content Landmark', query: 'id="main-content"' },
  { name: 'Reading Progress Bar', query: 'id="reading-progress"' },
  { name: 'Mobile TOC Toggle', query: 'id="mobile-toc-toggle"' },
  { name: 'Mobile TOC Panel', query: 'id="mobile-toc-panel"' },
  { name: 'Copy Link Action Button', query: 'data-action="copy-link"' },
  { name: 'Print Action Button', query: 'data-action="print-doc"' },
  { name: 'Back to Top Button', query: 'id="back-to-top"' },
  { name: 'Legal Signoff Box', query: 'class="legal-signoff"' },
  { name: 'Brand Statement: Build Different.', query: 'Build Different.' },
  { name: 'Signature Phrase: Craft On!', query: 'Craft On!' },
  { name: 'Schema.org JSON-LD DigitalDocument', query: '"@type": "DigitalDocument"' },
  { name: 'Schema.org JSON-LD WebPage', query: '"@type": "WebPage"' },
  { name: 'Skip to content link', query: 'class="skip-link"' },
  { name: 'Canonical URL https://cretes.org/terms', query: '<link rel="canonical" href="https://cretes.org/terms">' }
];

let failedChecks = [];
checks.forEach(c => {
  if (!html.includes(c.query)) {
    failedChecks.push(c.name);
  } else {
    console.log(`✅ ${c.name} verified.`);
  }
});

if (failedChecks.length > 0) {
  console.error('❌ Failed checks:', failedChecks);
  process.exit(1);
}

// 4. Verify CSS Tokens in terms.css
const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'terms.css'), 'utf8');
const expectedTokens = [
  '--legal-bg: #0E0C12',
  '--legal-surface-primary: #17141E',
  '--legal-surface-secondary: #1F1A28',
  '--legal-text-primary: #F8F6FB',
  '--legal-border: #2E273A',
  '--legal-brand-purple: #B5A2FF',
  '--legal-bg: #F7F5F0',
  '--legal-surface-primary: #FFFFFF',
  '--legal-surface-secondary: #EFEBE5',
  '--legal-text-primary: #131118',
  '--legal-border: #E2DDD5',
  '--legal-brand-purple: #5F3DE8',
  '@media print'
];

let missingTokens = [];
expectedTokens.forEach(t => {
  if (!css.includes(t)) {
    missingTokens.push(t);
  }
});

if (missingTokens.length > 0) {
  console.error('❌ Missing tokens in terms.css:', missingTokens);
  process.exit(1);
} else {
  console.log('✅ All Light/Dark design tokens and Print CSS verified in css/terms.css.');
}

console.log('\n🎉 ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!\n');
