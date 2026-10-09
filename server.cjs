const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3333;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
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

  const filePath = path.join(__dirname, reqPath);
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }
    const canonicalPath = reqPath === '/index.html' ? '/' : reqPath;
    const linkHeaders = [
      `<https://cretes.org${canonicalPath}>; rel="canonical"`,
      `<https://cretes.org/llms.txt>; rel="help"; type="text/plain"`,
      `<https://cretes.org/llms-full.txt>; rel="help"; type="text/plain"`,
      `<https://cretes.org/ai.txt>; rel="policy"; type="text/plain"`,
      `<https://cretes.org/releases.json>; rel="alternate"; type="application/json"`
    ].join(', ');

    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Link': linkHeaders
    });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Cretes server running at http://localhost:${PORT}`);
});
