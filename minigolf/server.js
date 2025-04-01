const http = require('http');
const fs = require('fs');
const path = require('path');
const port = 8080;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

// Paths to search for files
const searchPaths = [
    path.join(__dirname, 'build/js/packages/minigolf'),
    path.join(__dirname, 'build/js/packages'),
    path.join(__dirname, '..'),
    __dirname
];

const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    // Default to index.html for root requests
    let url = req.url;
    if (url === '/' || url === '') {
        url = '/index.html';
    }
    
    // Remove query strings
    url = url.split('?')[0];
    
    // Try to find the file in our search paths
    let filePath = null;
    for (const basePath of searchPaths) {
        const testPath = path.join(basePath, url);
        if (fs.existsSync(testPath) && fs.statSync(testPath).isFile()) {
            filePath = testPath;
            break;
        }
    }
    
    if (!filePath) {
        console.log(`File not found: ${url}`);
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
    }
    
    // Determine MIME type based on file extension
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Read and serve the file
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Internal Server Error');
            return;
        }
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

server.listen(port, () => {
    console.log(`MiniGolf game is running at http://localhost:${port}/`);
    console.log('Press Ctrl+C to stop the server');
}); 