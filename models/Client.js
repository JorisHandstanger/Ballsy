'use strict';

class Client {
  constructor(id, socketid) {
    this.id = id;
    this.socketid = socketid;
    this.hp = 100;
  }
}

module.exports = Client;
