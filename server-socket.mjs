import path from 'path';
import fs from 'fs';
import { createServer } from "http";
import { Server } from "socket.io";
import { faker } from '@faker-js/faker';

const httpServer = createServer((request, response) => {

    const readStream = fs.createReadStream(path.join(process.cwd(), 'index.html'), 'utf8');
    // readStream.on('data', (chunk) => {
    //     response.end(chunk)
    // });
    readStream.pipe(response);

    readStream.on('end', () => console.log('File reading finished.'));
    readStream.on('error', () => console.log(err));


});
const io = new Server(httpServer, {
    // ...
});

const UserMap = {};
io.on('connection', (socket) => {
    UserMap[socket.id] = {
        id: socket.id,
        name: faker.name.firstName()
    }
    socket.emit('NEW_CON', { users: UserMap, id: socket.id });

    socket.broadcast.emit('CON_CHANGE', { user: UserMap[socket.id], action: 'connect', count: Object.keys(UserMap).length });

    socket.on('CLIENT_MSG', (data) => {
        socket.emit('SERVER_MSG', { msg: data.msg, userName: data.userName });
        socket.broadcast.emit('SERVER_MSG', { msg: data.msg, userName: data.userName });
    });
    socket.on('disconnect', () => {
        console.log(`${UserMap[socket.id].name} disconnected`);
        socket.broadcast.emit('CON_CHANGE', { user: UserMap[socket.id], action: 'disconnect', count: Object.keys(UserMap).length - 1 });
        delete UserMap[socket.id];

    });
});


httpServer.listen(3001);