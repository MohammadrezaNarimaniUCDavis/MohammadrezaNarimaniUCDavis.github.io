const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const port = process.env.PORT || 3000;

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8'
};

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Internal Server Error');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

function resolvePath(requestUrl) {
  const urlPath = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  const safePath = path.normalize(urlPath).replace(/^([.]{2}[\\/])+/, '');
  const absolutePath = path.join(rootDir, safePath);

  if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory()) {
    return path.join(absolutePath, 'index.html');
  }

  if (path.extname(absolutePath)) {
    return absolutePath;
  }

  const htmlPath = `${absolutePath}.html`;
  if (fs.existsSync(htmlPath)) {
    return htmlPath;
  }

  const indexPath = path.join(absolutePath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return indexPath;
  }

  return path.join(rootDir, 'index.html');
}

const server = http.createServer((req, res) => {
  const filePath = resolvePath(req.url || '/');

  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found');
      return;
    }

    sendFile(res, filePath);
  });
});

server.listen(port, () => {
  console.log(`Website running at http://localhost:${port}`);
});