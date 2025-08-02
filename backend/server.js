const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

let vehicles = [
  { id: 1, brand: 'Honda', model: 'Civic', year: 2019, price: 20000 },
  { id: 2, brand: 'Yamaha', model: 'YZF-R3', year: 2021, price: 5000 }
];

function sendJson(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function serveStatic(req, res) {
  const filePath = path.join(__dirname, '..', 'frontend', req.url === '/' ? 'index.html' : req.url);
  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    const type = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'text/javascript'
    }[ext] || 'text/plain';
    res.writeHead(200, { 'Content-Type': type });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  if (pathname.startsWith('/api/vehicles')) {
    if (req.method === 'GET') {
      if (pathname === '/api/vehicles') {
        sendJson(res, vehicles);
      } else {
        const id = parseInt(pathname.split('/').pop(), 10);
        const vehicle = vehicles.find(v => v.id === id);
        if (vehicle) sendJson(res, vehicle); else sendJson(res, { error: 'Not found' }, 404);
      }
    } else if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          data.id = vehicles.length ? vehicles[vehicles.length - 1].id + 1 : 1;
          vehicles.push(data);
          sendJson(res, data, 201);
        } catch {
          sendJson(res, { error: 'Invalid data' }, 400);
        }
      });
    } else {
      sendJson(res, { error: 'Method not allowed' }, 405);
    }
  } else {
    serveStatic(req, res);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
