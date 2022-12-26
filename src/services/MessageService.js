const { uploadMedia } = require('../utils/aws');
const constants = require('../constants/model.constant');
const {
  Message,
  Media,
  User,
  UserProfile,
  Room,
  RoomUser,
} = require('../models');

class MessageService {
  constructor() {
    this.media = Media;
    this.message = Message;
    this.user = User;
    this.userProfile = UserProfile;
  }

  async createNewMessage(req, userId) {
    let media
    let data = {
      ...req.body,
      from_user_id: userId,
    };
    if (req.file) {
      media = await uploadMedia(req.file, 'message');
      data.type = constants.MESSAGE.TYPE_ENUMS.MEDIA;
      data.media = {
        ...media,
        using_type: 1,
      };
    }

    let message = await this.message.create(data, {
      include: [
        {
          model: this.media,
          as: 'media',
        },
      ],
    });

    return await this.createFormattedMessage(message.id, media?.location);
  }

  async getInfoRoom(roomId, userId) {
    let room = await this.getRoom(roomId);

    return {
      id: room.id,
      last_message: {
        id: room.messages[0].id,
        content: room.messages[0].content,
        from_user: room.messages[0].user,
        created_at: room.messages[0].created_at,
        updated_at: room.messages[0].updated_at,
      },
    };
  }

  async getCountUnReadMessage(roomId, userId) {
    let unreadMsg = await RoomUser.getUnreadMessage(roomId, userId);

    return Message.countMessageByRoom(
      roomId,
      unreadMsg.last_message_id,
      userId
    );
  }

  async createFormattedMessage(messageId, mediaUrl = null) {
    let message = await this.getMessage(messageId);
    let avatar = this.covertMedia(message.user.user_profile.avatar);

    return {
      id: message.id,
      room_id: message.room_id,
      sender: {
        id: message.user.id,
        name: message.user.name,
        avatar: avatar,
      },
      type: message.type,
      content: message.content,
      media_url: mediaUrl,
      mime_type: message.mime_type,
      read_at: message.read_at,
      created_at: message.created_at,
      updated_at: message.updated_at,
    };
  }

  async getMessage(messageId) {
    let message = await this.message.findByPk(messageId, {
      include: [
        {
          model: this.user,
          attributes: ['id', 'name'],
          include: [
            {
              model: this.userProfile,
              attributes: ['avatar'],
            },
          ],
        },
      ],
    });

    return message;
  }

  async getRoom(roomId) {
    let room = await Room.findByPk(roomId, {
      attributes: ['id'],
      include: [
        {
          model: Message,
          order: [['id', 'desc']],
          limit: 1,
          include: [
            {
              model: User,
              attributes: ['name', 'id'],
            },
          ],
        },
      ],
    });

    return room;
  }

  async readMessage(roomId, userId) {
    let lastMessage = await Message.lastMessageByRoom(roomId, userId)
    RoomUser.updateReadMsgId(roomId, userId, lastMessage.id)

    return lastMessage.id
  }

  covertMedia(media) {
    if (media) {
      return process.env.S3_BUCKET_URL + '/' + media;
    }

    return media;
  }
}

module.exports = new MessageService();
