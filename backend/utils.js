import fs from 'fs';
import path from 'path';

export async function serveStaticFile(res, filePath) {
    if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not found' }));
        return;
    }

    try {
        const data = await fs.promises.readFile(filePath);
        const contentType = getContentType(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'internal server error' }));
    }
}

export function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => (body += chunk.toString()));
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', (err) => reject(err));
    });
}

export function getContentType(filePath) {
    const ext = path.extname(filePath);
    const type = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.ttf': 'font/ttf',
        '.woff': 'font/woff',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };
    return type[ext] || 'text/html';
}
