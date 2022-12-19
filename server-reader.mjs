import path from 'path';
import fs from 'fs';
import { createServer } from "http";
import { Server } from "socket.io";
import url from 'url';
import { Transform } from 'stream';
import { Worker } from 'worker_threads';


let filePath = '';
function runService(workerData) {
      const worker = new Worker('./worker.mjs', { workerData });
      worker.on('message', (workerData)=>{
        console.log(workerData)
      });
    //   worker.on('error', reject);
    //   worker.on('exit', (code) => {
    //     if (code !== 0)
    //       reject(new Error(`Worker stopped with exit code ${code}`));
    //   })
  }
  

const httpServer = createServer((request, response) => {

    if (request.url === '/favicon.ico') {
        response.writeHead(200, { 'Content-Type': 'image/x-icon' });
        response.end();
        // console.log('favicon requested');
        return;
    }
    if (request.url === '/') {
        const readStream = fs.createReadStream(path.join(process.cwd(), 'reader.html'), 'utf8');
        readStream.pipe(response);
        readStream.on('end', () => console.log('File reading finished.'));
        readStream.on('error', () => console.log(err));
    }

    if (request.url.includes('/api')) {
        const fileName = url.parse(request.url, true).query.fileName;
        const searchString = url.parse(request.url, true).query.searchString;

        if (fileName && fs.existsSync(path.join(filePath, fileName))) {
            filePath = path.join(filePath, fileName);

        } else {
            filePath = process.cwd()
        }


        if (fs.lstatSync(filePath).isFile()) {

            
            response.writeHead(200, { 'Content-Type': 'text/javascript' });

            const readStream = fs.createReadStream(filePath, 'utf8');
            if (searchString) {
                
                const transformStream = new Transform({
                    transform(chunk, encoding, callback) {
                        runService(chunk.toString())

                        console.log('chunk');

                        const pattern = new RegExp(searchString, 'gi');
                        const transformedChunk = chunk.toString().replace(pattern, `<b>${searchString}</b>`);
                        // this.push(transformedChunk)
                        callback(null, transformedChunk);
                    }
                });

                readStream.pipe(transformStream).pipe(response);
            } else {
                readStream.pipe(response);
            }


            readStream.on('end', () => console.log('File reading finished.'));
            readStream.on('error', () => console.log(err));

        } else {
            response.writeHead(200, { 'Content-Type': 'application/json' });

            const list = fs.readdirSync(filePath);
            return response.end(JSON.stringify({ path: filePath, list: list }))
        }
    }


});
const io = new Server(httpServer, {
    // ...
});
const UserMap = {};
io.on('connection', (socket) => {
    UserMap[socket.id] = {
        id: socket.id,
    }
    socket.emit('NEW_CON', { users: UserMap, id: socket.id });

    socket.broadcast.emit('CON_CHANGE', { user: UserMap[socket.id], action: 'connect', count: Object.keys(UserMap).length });

    socket.on('disconnect', () => {
        socket.broadcast.emit('CON_CHANGE', { user: UserMap[socket.id], action: 'disconnect', count: Object.keys(UserMap).length - 1 });
        delete UserMap[socket.id];

    });
});
httpServer.listen(3001);