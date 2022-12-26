const MessageService = require('../services/MessageService')
const socketManager = require('../listeners/socketManager');

class MessageController {
  async sendMessage(req, res) {
    let data = await MessageService.createNewMessage(req, req.user.id)
    let roomInfo = await MessageService.getInfoRoom(req.room_id, req.user.id)
    socketManager.emitSendMessage(data, roomInfo)

    return res.json(roomInfo)
  }

  async readMessage(req, res) {
    let lastMsgId = await MessageService.readMessage(req.room_id, req.user.id)
    let data = {
      last_message_id: lastMsgId,
      room_id: req.room_id,
      user: req.user
    }

    socketManager.emitReadMessage(data, req.user.id)

    return res.json(true)
  }

  async countUnread(req, res) {
    let count = await MessageService.getCountUnReadMessage(req.room_id, req.user.id)
    return res.json(count);
  }
}

module.exports = new MessageController
