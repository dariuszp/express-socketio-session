'use strict';

let express             = require('express'),
    expressSession      = require('express-session'),
    httpServer          = require('http').Server,
    socketIo            = require('socket.io'),
    fs                  = require('fs');

let app         = express(),
    server      = httpServer(app),
    sio         = socketIo(server),
    session = expressSession({
        saveUninitialized: false,
        resave: true,
        secret: 'put cat on your keyboard'
    });

sio.use((socket, next) => {
    session(socket.request, socket.request.res, next);
});

app.use(session);

app.get('/', (req, res) => {
    req.session.counter++;

    res.sendFile(__dirname + '/index.html')
});

sio.sockets.on('connection', (socket) => {
    socket.emit('data', {
        counter: socket.request.session.counter
    });
});

server.listen(3000, (err) => {
    if (err) {
        throw err;
    }
    console.log('Server is up & running')
});