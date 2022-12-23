const { DataTypes, Model } = require('sequelize');
const { connectToDatabase: sequelize } = require('../config');
const constants = require('../constants/model.constant');

class UserProfile extends Model {};

UserProfile.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  timestamps: true,
  modelName: 'user_profiles',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = UserProfile;
