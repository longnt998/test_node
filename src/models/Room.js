const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Room extends Model {}

Room.init(
  {
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
    fee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'rooms',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Room;
