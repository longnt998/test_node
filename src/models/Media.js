const { DataTypes, Model } = require('sequelize');
const { connectToDatabase: sequelize } = require('../config');
const constants = require('../constants/model.constant');

class Media extends Model {}

Media.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    model_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    using_type: {
      type: DataTypes.ENUM({
        values: Object.values(constants.MEDIA.USING_TYPE),
      }),
      allowNull: false,
      defaultValue: constants.MEDIA.USING_TYPE.MESSAGE,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnail_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mime_type: {
      type: DataTypes.ENUM({
        values: Object.values(constants.MEDIA.MINE_TYPE),
      }),
      allowNull: false,
      defaultValue: constants.MEDIA.MINE_TYPE.IMAGE,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'media',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Media;
