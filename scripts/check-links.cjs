/**
 * Cretes - Internal Link & Anchor Integrity Checker
 * Validates local filesystem targets, server aliases, and document anchors.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

const FILES_TO_SCAN = [
  'index.html',
  'SPECIFICATION.md',
  'RFCs.md',
  'GOVERNANCE.md',
  'SECURITY.md',
  'CONTRIBUTING.md',
  'CODE_OF_CONDUCT.md',
  'SECURITY-SCANNING.md',
  'Terms.md',
  'llms.txt',
  'releases.json',
  'robots.txt',
  'sitemap-docs.xml'
];

let totalLinksChecked = 0;
let brokenLinks = [];

// Known valid server aliases
const SERVER_ALIASES = new Set([
  '/',
  '/index.html',
  '/docs',
  '/docs/stable',
  '/docs/latest',
  '/spec',
  '/spec.txt',
  '/SPECIFICATION.md',
  '/specification',
  '/rfcs',
  '/rfcs.txt',
  '/rfcs.json',
  '/RFCs.md',
  '/governance',
  '/governance.txt',
  '/GOVERNANCE.md',
  '/contributing',
  '/CONTRIBUTING.md',
  '/security',
  '/security-policy',
  '/SECURITY.md',
  '/.well-known/security.txt',
  '/security.txt',
  '/code-of-conduct',
  '/CODE_OF_CONDUCT.md',
  '/license',
  '/LICENSE',
  '/LICENSE.txt',
  '/checksums',
  '/CHECKSUMS.txt',
  '/provenance',
  '/provenance.json',
  '/security-scanning',
  '/SECURITY-SCANNING.md',
  '/releases',
  '/releases.json',
  '/ai',
  '/ai.txt',
  '/ai-policy.txt',
  '/llms.txt',
  '/llms-full.txt',
  '/feed.xml',
  '/manifest.webmanifest',
  '/humans.txt',
  '/sitemap.xml',
  '/sitemap_index.xml',
  '/community.txt',
  '/contribute.txt',
  '/terms',
  '/Terms',
  '/Terms.md',
  '/terms.md',
  '/terms.txt'
]);

function extractLinks(filePath, content) {
  const links = [];
  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.html') {
    // href and src
    const hrefRegex = /(?:href|src)=["']([^"']+)["']/g;
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
      links.push(match[1]);
    }
  } else if (ext === '.md' || ext === '.txt') {
    // Markdown links [text](url)
    const mdRegex = /\[(?:[^\]]*)\]\(([^)]+)\)/g;
    let match;
    while ((match = mdRegex.exec(content)) !== null) {
      links.push(match[1]);
    }
  } else if (ext === '.xml') {
    // <loc>url</loc>
    const locRegex = /<loc>([^<]+)<\/loc>/g;
    let match;
    while ((match = locRegex.exec(content)) !== null) {
      links.push(match[1]);
    }
  } else if (ext === '.json') {
    // URLs inside JSON strings
    const urlRegex = /"https?:\/\/[^"]+"/g;
    let match;
    while ((match = urlRegex.exec(content)) !== null) {
      links.push(match[0].replace(/"/g, ''));
    }
  }

  return links;
}

function checkLink(sourceFile, rawLink) {
  // Ignore mailto, tel, javascript
  if (/^(mailto|tel|javascript):/i.test(rawLink)) return;
  // Ignore hash only links (#, #top)
  if (rawLink === '#' || rawLink.startsWith('#')) return;

  totalLinksChecked++;

  let target = rawLink.split('#')[0]; // strip hash anchor
  if (!target) return;

  // If local absolute route (/SPECIFICATION.md, /docs/stable)
  if (target.startsWith('/')) {
    if (SERVER_ALIASES.has(target)) return;
    const directFile = path.join(ROOT_DIR, target.slice(1));
    if (fs.existsSync(directFile)) return;

    brokenLinks.push({ file: sourceFile, link: rawLink, reason: 'Route not found in local server routes or filesystem' });
    return;
  }

  // If internal domain link (https://cretes.org/...)
  if (target.startsWith('https://cretes.org/')) {
    const internalPath = target.replace('https://cretes.org', '');
    if (SERVER_ALIASES.has(internalPath)) return;
    const directFile = path.join(ROOT_DIR, internalPath.slice(1));
    if (fs.existsSync(directFile)) return;

    brokenLinks.push({ file: sourceFile, link: rawLink, reason: 'cretes.org target path not found' });
    return;
  }

  // If relative path
  if (!target.startsWith('http://') && !target.startsWith('https://')) {
    const dir = path.dirname(path.join(ROOT_DIR, sourceFile));
    const fullPath = path.resolve(dir, target);
    if (!fs.existsSync(fullPath)) {
      brokenLinks.push({ file: sourceFile, link: rawLink, reason: `File not found at ${fullPath}` });
    }
  }
}

console.log('🔍 Starting Cretes Link Integrity Check...');

for (const relFile of FILES_TO_SCAN) {
  const fullPath = path.join(ROOT_DIR, relFile);
  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️ Warning: Scan target not found: ${relFile}`);
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const links = extractLinks(relFile, content);

  for (const link of links) {
    checkLink(relFile, link);
  }
}

console.log(`\n✅ Checked ${totalLinksChecked} links across ${FILES_TO_SCAN.length} key documents.`);

if (brokenLinks.length > 0) {
  console.error(`\n❌ Found ${brokenLinks.length} broken links:`);
  for (const b of brokenLinks) {
    console.error(` - [${b.file}] -> ${b.link} (${b.reason})`);
  }
  process.exit(1);
} else {
  console.log('🎉 All internal links and server route targets are 100% valid!\n');
}
