const multer = require('multer');
const formData = multer();
const { Router } = require('express')
const Authenticate = require('../middleware/authenticate');
const MessageController = require('../controllers/MessageController')

class apiRoute {
  constructor() {
    this.controller = MessageController
    this.router = Router()
    this.registerRoutes()
  }

  registerRoutes() {
    this.router.get('/hello', this.controller.getAllMessage),
    this.router.post(
      '/message/send',
      formData.fields([
        { name: 'content', maxCount: 1 },
        { name: 'gif', maxCount: 1 },
        { name: 'room_id', maxCount: 1 },
      ]),
      Authenticate.authenticateRoom,
      this.controller.sendMessage
    );
  }
}

module.exports = new apiRoute();
