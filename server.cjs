const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3333;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  // Stable Documentation URLs
  if (reqPath === '/docs' || reqPath === '/docs/' || reqPath === '/docs/stable' || reqPath === '/docs/stable/' || reqPath === '/docs/latest' || reqPath === '/docs/latest/') {
    res.writeHead(302, {
      'Location': 'https://github.com/Cretes-lang/spec',
      'Link': '<https://cretes.org/docs/stable>; rel="canonical"'
    });
    res.end('Redirecting to Cretes Stable Specification...');
    return;
  }

  // Raw file alias routing
  if (reqPath === '/robots') reqPath = '/robots.txt';
  if (reqPath === '/llms') reqPath = '/llms.txt';
  if (reqPath === '/llms-full') reqPath = '/llms-full.txt';
  if (reqPath === '/ai') reqPath = '/ai.txt';
  if (reqPath === '/ai-policy') reqPath = '/ai-policy.txt';
  if (reqPath === '/releases' || reqPath === '/releases/' || reqPath === '/releases/latest.json') reqPath = '/releases.json';
  if (reqPath === '/feed') reqPath = '/feed.xml';
  if (reqPath === '/manifest') reqPath = '/manifest.webmanifest';
  if (reqPath === '/humans') reqPath = '/humans.txt';
  if (reqPath === '/sitemap_index' || reqPath === '/sitemap-index') reqPath = '/sitemap_index.xml';
  if (reqPath === '/sitemap') reqPath = '/sitemap.xml';
  if (reqPath === '/security') reqPath = '/.well-known/security.txt';
  if (reqPath === '/spec' || reqPath === '/spec.txt') reqPath = '/spec.txt';
  if (reqPath === '/specification' || reqPath === '/SPECIFICATION' || reqPath === '/SPECIFICATION.md') reqPath = '/SPECIFICATION.md';
  if (reqPath === '/rfcs' || reqPath === '/RFCs' || reqPath === '/RFCs.md') reqPath = '/RFCs.md';
  if (reqPath === '/rfcs.txt') reqPath = '/rfcs.txt';
  if (reqPath === '/rfcs.json') reqPath = '/rfcs.json';
  if (reqPath === '/governance' || reqPath === '/GOVERNANCE' || reqPath === '/GOVERNANCE.md') reqPath = '/GOVERNANCE.md';
  if (reqPath === '/governance.txt') reqPath = '/governance.txt';
  if (reqPath === '/contributing' || reqPath === '/CONTRIBUTING' || reqPath === '/CONTRIBUTING.md') reqPath = '/CONTRIBUTING.md';
  if (reqPath === '/security-policy' || reqPath === '/SECURITY' || reqPath === '/SECURITY.md') reqPath = '/SECURITY.md';
  if (reqPath === '/code-of-conduct' || reqPath === '/CODE_OF_CONDUCT' || reqPath === '/CODE_OF_CONDUCT.md') reqPath = '/CODE_OF_CONDUCT.md';
  if (reqPath === '/license' || reqPath === '/LICENSE' || reqPath === '/LICENSE.txt') reqPath = '/LICENSE';
  if (reqPath === '/checksums' || reqPath === '/CHECKSUMS' || reqPath === '/CHECKSUMS.txt' || reqPath === '/SHASUMS256.txt') reqPath = '/CHECKSUMS.txt';
  if (reqPath === '/provenance' || reqPath === '/provenance.json') reqPath = '/provenance.json';
  if (reqPath === '/security-scanning' || reqPath === '/SECURITY-SCANNING.md') reqPath = '/SECURITY-SCANNING.md';

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const canonicalPath = reqPath === '/index.html' ? '/' : reqPath;
    let contentType = MIME[ext];
    if (!contentType && path.basename(filePath).toUpperCase() === 'LICENSE') {
      contentType = 'text/plain; charset=utf-8';
    }
    contentType = contentType || 'text/plain; charset=utf-8';

    const linkHeaders = [
      `<https://cretes.org${canonicalPath}>; rel="canonical"`,
      `<https://cretes.org/llms.txt>; rel="help"; type="text/plain"`,
      `<https://cretes.org/llms-full.txt>; rel="help"; type="text/plain"`,
      `<https://cretes.org/ai.txt>; rel="policy"; type="text/plain"`,
      `<https://cretes.org/releases.json>; rel="alternate"; type="application/json"`
    ].join(', ');

    res.writeHead(200, {
      'Content-Type': contentType,
      'Link': linkHeaders
    });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Cretes server running at http://localhost:${PORT}`);
});
