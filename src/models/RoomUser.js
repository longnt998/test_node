const { DataTypes, Model, Op } = require('sequelize');
const { connectToDatabase: sequelize } = require('../config');
const constants = require('../constants/model.constant');

class RoomUser extends Model {
  static async checkAuthenticate(roomId, userId) {
    let count = await this.count({
      where: {
        [Op.and]: [
          {room_id: roomId},
          {user_id: userId}
        ]
      },
    });

    return !!count;
  }

  static async getUnreadMessage(roomId, userId) {
    let unreadMessage = await this.findOne({
      where: {
        [Op.and]: {
          room_id: roomId,
          user_id: userId
        }
      }
    })

    return unreadMessage
  }

  static async updateReadMsgId(roomId, userId, messageId) {
    let updated = await this.update(
      { last_message_id: messageId },
      { where: {
        [Op.and]: {
          room_id: roomId,
          user_id: userId
        }
      }}
    )

    return !!updated
  }
}

RoomUser.init(
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
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    last_message_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'room_user',
    tableName: 'room_user',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = RoomUser;
