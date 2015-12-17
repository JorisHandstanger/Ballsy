'use strict';

module.exports.register = (server, options, next) => {
  let io = require('socket.io')(server.listener);
  let Client = require('../models/Client');
  let clients = [];

  io.on('connection', socket => {
    socket.on('disconnect', () => {
      clients = clients.filter(c => c.socketid !== socket.id);
      socket.broadcast.emit('leave', socket.id);
    });

    socket.on('hit', data => io.to(data.to).emit('hit', data.from));

    let maxId = 0;
    if (clients.length > 0) {
      clients.forEach(client => {
        if (client.id > maxId) maxId = client.id;
      });
    }

    let client = new Client(maxId +1, socket.id);
    clients.push(client);

    socket.emit('init', clients);
    socket.broadcast.emit('join', client);
  });

  next();
};

module.exports.register.attributes = {
  name: 'socketPlugin',
  version: '0.1.0'
};
