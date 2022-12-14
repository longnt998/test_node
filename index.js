require('dotenv').config();

const path = require('path');
const cors = require('cors');
const express = require('express');
const socketio = require('socket.io');
const router = require('./src/router');
const flash = require('connect-flash');
const { createServer } = require('http');
const { corsOptions, connectRedis } = require('./src/config');

let globalIo;

class Server {
  constructor() {
    this.app = express();
    this.config();
  }

  async config() {
    const port = process.env.PORT || 3000;

    this.app.set('port', port);
    this.app.use(cors(corsOptions));

    // config body parse using express
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use(flash());
    this.app.use(express.static(path.join(__dirname, 'public')));

    // add route
    router(this.app);
  }

  start() {
    const server = createServer(this.app);
    globalIo = socketio(server, {
      cors: corsOptions,
    });

    global.io = globalIo
    connectRedis(globalIo);

    server.listen(this.app.get('port'), () => {
      const { port } = server.address();

      console.log(`Server listening in port ${port}`);
    });
  }
}

const server = new Server();
server.start();
