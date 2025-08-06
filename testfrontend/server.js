const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    req.url = '/imgresizerr.html';
  }
  
  const filePath = path.join(__dirname, req.url);
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('File not found');
      return;
    }
    
    const ext = path.extname(filePath);
    let contentType = 'text/html';
    
    if (ext === '.js') contentType = 'text/javascript';
    if (ext === '.css') contentType = 'text/css';
    
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`🌐 Frontend server running at http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${__dirname}`);
});
