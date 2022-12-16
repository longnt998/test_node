const { Message } = require('../models')

class MessageService {
  constructor() {
    this.messages = Message
  }

  async findAll() {
    let m = await this.messages.findAll()

    return m
  }

  async create(req) {
    if (!req.file) {
      //send msg normal
      
    } else {
      //send msg file
    }
    return (async (resolve, reject) => {
      if (req.files.content == undefined && req.body.content) {
        return this.createMessageWithMedia(req.body).then(data => {
            return resolve(this.createFormattedMessage(data.id));
          })
          .catch(error => {
            return reject(error);
          })
      } else {
        const params = {
          Bucket: AWS_BUCKET_NAME,
          Key: 'chat/' + req.body.room_id + '/' + req.files.content[0].originalname,
          Body: req.files.content[0].buffer,
        }

        return s3.upload(params, async (err, s3) => {
          if (err) {
            return reject(err)
          }

          req.body.type = constants.MESSAGE.TYPE_ENUMS.MEDIA;
          req.body.media = [{
            url: params.Key,
            mime_type: req.files.content[0].mimetype.split('/')[0],
          }]

          this.createMessageWithMedia(req.body)
            .then(message => {
              return resolve(this.createFormattedMessage(message.id, s3.Location));
            })
            .catch(error => {
              return reject(error);
            })
        })
      }
    });
  }

  

  // async readMessage(req) {
  //   return new Promise(async (resolve, reject) => {
  //     await this.messages.update(
  //       {
  //         read_at: new Date()
  //       }, {
  //         where: {
  //           [Op.and]: {
  //             room_id: req.body.room_id,
  //             read_at: null,
  //             [Op.not]: [
  //               { from_user_id: req.user.id },
  //             ],
  //           },
  //         },
  //         order: [[ 'id', 'DESC' ]]
  //       })
  //     .then(async () => {
  //       return await this.messages.findOne({
  //         where: {
  //           [Op.and]: {
  //             room_id: req.body.room_id,
  //             [Op.not]: [
  //               { from_user_id: req.user.id },
  //             ],
  //           }
  //         },
  //         order: [['id', 'DESC']]
  //       })
  //       .then(message => {
  //         return resolve(this.createFormattedMessage(message.id));
  //       })
  //       .catch(error => {
  //         return reject(error);
  //       })
  //     })
  //     .catch(error => {
  //       return reject(error);
  //     })
  //   })
  // };

  // async createFormattedMessage(messageId, mediaUrl = null) {
  //   return new Promise(async (resolve, reject) => {
  //     await this.messages.findByPk(messageId, {
  //       include: [
  //         {
  //           model: this.users,
  //           attributes: ['id', 'name'],
  //           include: [
  //             {
  //               model: this.userProfiles,
  //               attributes: ['avatar'],
  //             }
  //           ]
  //         }
  //       ]
  //     })
  //     .then(async message => {
  //       let avatar = await this.covertMedia(message.user.user_profile.avatar, message.user.user_profile.type_avatar);

  //       if (message.reactions) {
  //         let react = [];
  //         message.reactions.forEach(reaction => {
  //           react.push(
  //             {
  //               user_id: reaction.user_id,
  //               user_username: reaction.user.username,
  //               type: reaction.type,
  //             }
  //           )
  //         });

  //         message.reactions = react;
  //       }

  //       return resolve({
  //         id: message.id,
  //         room_id: message.room_id,
  //         sender: {
  //           id: message.user.id,
  //           name: message.user.user_profile.fullname,
  //           avatar: avatar,
  //         },
  //         type: message.type,
  //         content: message.content,
  //         media_url: mediaUrl,
  //         mime_type: message.mime_type,
  //         reactions: message.reactions,
  //         read_at: message.read_at,
  //         created_at: message.created_at,
  //         updated_at: message.updated_at,
  //       });
  //     })
  //     .catch(error => {
  //       return reject(error);
  //     })
  //   });
  // };

  async getInfoRoom(roomId, userId) {
    return new Promise(async (resolve, reject) => {
      await this.rooms.findOne({
        include: [
          {
            model: this.users,
            attributes: ['id', 'name'],
            as: 'toUserRooms',
            include: [
              {
                model: this.userProfiles,
                attributes: ['avatar'],
              },
              {
                model: this.messages,
                limit: 1,
                where: {
                  [Op.and]: {
                    read_at: null,
                  }
                },
                order: [['id', 'DESC']],
                include: [
                  {
                    model: this.users,
                    attributes: ['id', 'name'],
                    include: [
                      {
                        model: this.userProfiles,
                        attributes: ['avatar'],
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            model: this.users,
            attributes: ['id', 'name'],
            as: 'fromUserRooms',
            include: [
              {
                model: this.userProfiles,
                attributes: ['avatar'],
              },
              {
                model: this.messages,
                limit: 1,
                order: [['id', 'DESC']],
                include: [
                  {
                    model: this.users,
                    attributes: ['id', 'name'],
                    include: [
                      {
                        model: this.userProfiles,
                        attributes: ['avatar'],
                      }
                    ]
                  }
                ]
              }
            ] 
          },
          {
            model: this.messages,
            where: {
              [Op.and]: {
                read_at: null,
                from_user_id: userId
              },
            },
            required: false
          },
        ],
        where: {
          id: roomId
        },
      })
      .then(async room => {
        let sender, receiver;

        if (room.fromUserRooms.id != userId) {
          sender = room.fromUserRooms,
          receiver = room.toUserRooms;
        } else {
          sender = room.toUserRooms,
          receiver = room.fromUserRooms;
        }

        return resolve({
          data: {
            id: room.id,
            last_message: {
              'id': receiver.messages[0].id,
              'room_id': room.id,
              'from_user': {
                id: receiver.messages[0].from_user_id,
                name: receiver.messages[0].user.name,
                avatar: receiver.messages[0].user.user_profile.avatar,
              },
              'content': receiver.messages[0].content,
              'media_url': receiver.messages[0].media_url,
              'type': receiver.messages[0].type,
              'read_at': receiver.messages[0].read_at,
              'created_at': receiver.messages[0].created_at,
              'updated_at': receiver.messages[0].updated_at,
            },
            sender: {
              id: sender.id,
              name: sender.name,
              avatar: sender.user_profile.avatar,
            },
            receiver: {
              id: receiver.id,
              name: receiver.user.name,
              avatar: receiver.user_profile.avatar,
            },
            total_unread_message: room.messages.length,
            created_at: room.created_at,
            updated_at: room.updated_at,
          },
        });
      })
      .catch(error => {
        return reject(error);
      })
    });
  };

  // async createMessageWithMedia(params) {
  //   return await this.messages
  //     .create(params, {
  //       include: [{
  //         model: Media,
  //         as: 'media',
  //       }]
  //     })
  //     .then(data => {
  //       return data
  //     })
  //     .catch(error => {
  //       return error
  //     });
  // }
}

module.exports = new MessageService();
