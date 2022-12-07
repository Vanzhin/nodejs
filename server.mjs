import http from 'http';
import path from 'path';
import fs from 'fs';
import url from 'url';

let filePath = process.cwd();

http.createServer((request, response) => {
    if (request.url === '/favicon.ico') {
        response.writeHead(200, { 'Content-Type': 'image/x-icon' });
        response.end();
        // console.log('favicon requested');
        return;
    } else {
        const fileName = url.parse(request.url, true).query.fileName;

        if (fileName && fs.existsSync(path.join(filePath, fileName))) {
            filePath = path.join(filePath, fileName);

        } else {
            filePath = process.cwd()
        }
        response.writeHead(200, { 'Content-Type': 'text/html' });

        if (fs.lstatSync(filePath).isFile()) {

            const readStream = fs.createReadStream(filePath, 'utf8');
            readStream.on('data', (chunk) => {
                response.write(`<button><a href=\/?fileName=../>Back</a></button><br>`);
                response.write(`<h2>${filePath}</h2><br>`);
                response.end(chunk)
            });

            readStream.on('end', () => console.log('File reading finished.'));
            readStream.on('error', () => console.log(err));
        } else {
            const list = fs.readdirSync(filePath);
            list.unshift('../');
            let text = `${filePath}<br>`;
            list.forEach((item) => {
                if (item === '../') {
                    text += `<button><a href=\/?fileName=${item}>UP</a></button><br>`

                } else {
                    text += `<a href=\/?fileName=${item}>${item}</a><br>`

                }
            })
            response.end(text)
        }
    }
}).listen(3001)