const { DataTypes, Model, Op } = require('sequelize');
const { connectToDatabase: sequelize } = require('../config');

class Message extends Model {
  static async countMessageByRoom(roomId, lastMsgId, userId) {
    let count = await this.count({
      where: {
        [Op.and]: {
          room_id: roomId,
          id: {
            [Op.gt]: lastMsgId
          },
          from_user_id: {
            [Op.ne]: userId
          }
        }
      }
    })

    return count
  }

  static async lastMessageByRoom(roomId, userId) {
    let msg = await this.findOne({
      attributes: ['id'],
      where: {
        [Op.and]: {
          room_id: roomId,
          // from_user_id: {
          //   [Op.ne]: userId
          // }
        }
      },
      order: [['id', 'desc']],
    })

    return msg
  }
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Room id cannot be null.' },
        notEmpty: { msg: 'Room id cannot be empty.' },
      },
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    from_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: 'Sender id cannot be null.' },
        notEmpty: { msg: 'Sender id cannot be empty.' },
      },
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'messages',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Message;
