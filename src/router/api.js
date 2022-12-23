const multer = require('multer');
const formData = multer();
const { Router } = require('express')
const MessageController = require('../controllers/MessageController')
const { authenticateRoom } = require('../middleware/authenticate');

class apiRoute {
  constructor() {
    this.controller = MessageController
    this.router = Router()
    this.registerRoutes()
  }

  registerRoutes() {
    this.router.post(
      '/message/send',
      formData.single('content'),
      authenticateRoom,
      this.controller.sendMessage
    );

    this.router.post(
      '/message/read',
      formData.none(),
      authenticateRoom,
      this.controller.readMessage
    );
  }
}

module.exports = new apiRoute();
