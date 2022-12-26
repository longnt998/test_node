const { connectToDatabase: sequelize } = require('../config');
const constants = require('../constants/model.constant');
const Message = require('./Message');
const Room = require('./Room');
const Media = require('./Media');
const User = require('./User');
const UserProfile = require('./UserProfile');
const RoomUser = require('./RoomUser');

Room.hasMany(RoomUser, {
  foreignKey: {
    name: 'room_id',
  },
});

Room.hasMany(Message, {
  foreignKey: {
    name: 'room_id',
  },
});

RoomUser.belongsTo(Room, {
  foreignKey: {
    name: 'room_id',
  },
});

RoomUser.belongsTo(User, {
  foreignKey: {
    name: 'user_id',
  },
});

User.hasOne(RoomUser, {
  foreignKey: {
    name: 'user_id',
  },
});

Message.hasOne(Media, {
  foreignKey: {
    name: 'model_id',
  },
  constraints: false,
  scope: {
    model_type: constants.MEDIA.USING_TYPE.MESSAGE,
  },
  as: 'media',
});

Media.belongsTo(Message, {
  foreignKey: {
    name: 'model_id',
  },
  as: 'media',
});

Message.belongsTo(Room, {
  foreignKey: {
    name: 'room_id',
  },
});

UserProfile.belongsTo(User, {
  foreignKey: {
    name: 'user_id',
  },
});

Message.belongsTo(User, {
  foreignKey: {
    name: 'from_user_id',
  },
});

User.hasMany(Message, {
  foreignKey: {
    name: 'from_user_id',
  },
});

User.hasOne(UserProfile, {
  foreignKey: {
    name: 'user_id',
  },
});

const start = async function () {
  await sequelize
    .sync({ force: false })
    .then(() => {})
    .catch((e) => {
      console.log(e);
    });
};

start();

module.exports = {
  Message,
  Media,
  Room,
  User,
  UserProfile,
  RoomUser,
};
