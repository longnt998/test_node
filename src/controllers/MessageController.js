const MessageService = require('../services/MessageService')

class MessageController {
  async getAllMessage(req, res) {
    let m = await MessageService.findAll()

    return res.json(m)
  }

  async sendMessage(req, res) {
    console.log(req);
    // // req.body.from_user_id = req.user.id;
    // req.body.from_user_id = 1;
    return
    await MessageService.create(req)
      .then(async data => {
        const roomInfo = await MessageService.getInfoRoom(req.room.id, req.user.id);
        console.log(roomInfo);

        socketManager.emit(`room.${data.room_id}:message.created`, data);
        socketManager.emit (`room.${data.room_id}:new-message`, roomInfo.data);

        return res.status(200).json({ data: data });
      })
      .catch(error => {
        console.log(error);
        // logger.error(error);

        return res.status(403).json({ error: error });
      });
  }

}

module.exports = new MessageController
