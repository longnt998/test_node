const { DataTypes, Model } = require('sequelize');
const { connectToDatabase: sequelize } = require('../config');
const constants = require('../constants/model.constant');

class User extends Model {};

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM({ values: Object.values(constants.USER.ROLE) }),
    allowNull: false,
    defaultValue: constants.USER.ROLE.USER,
  },
  email_verified_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  remember_token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM({ values: Object.values(constants.USER.STATUS) }),
    allowNull: false,
    defaultValue: constants.USER.STATUS.VERIFY,
  },
}, {
  sequelize,
  timestamps: true,
  modelName: 'users',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;
