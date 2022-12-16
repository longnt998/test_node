'use strict';

const { DataTypes, Model, Op } = require("sequelize"),
  sequelize = require('../config/database');

class Room extends Model {
  static async checkAuthorization(req) {
    console.log(req);
    return await this.findOne({
      where: {
        [Op.or]: [
          { from_user_id: req.user.id },
          { to_user_id: req.user.id },
        ],
        [Op.and]: [
          { id: req.body.room_id },
        ],
      },
    });
  };
};

Room.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  from_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  timestamps: true,
  modelName: 'rooms',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Room;
