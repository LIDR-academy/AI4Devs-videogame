const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Convert URL to file path, removing leading slash
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './public/index.html';
    }

    // Remove query strings, hash values
    filePath = filePath.split('?')[0];
    filePath = filePath.split('#')[0];

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    // Add more mime types
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.ico': 'image/x-icon'
    };

    contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code === 'ENOENT') {
                console.log(`File not found: ${filePath}`);
                res.writeHead(404);
                res.end(`File not found: ${filePath}`);
            } else {
                console.log(`Server error: ${error.code}`);
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});