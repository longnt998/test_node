const redis = require('ioredis');
const redisClient = new redis(process.env.FORWARD_REDIS_PORT);

async function connectRedis(io) {
  io.on('connection', (socket) => {
    if (!process.env.ALLOW_ORIGIN) {
      socket.disconnect();
    }
  });

  await redisClient.psubscribe('*', (err, count) => {}); //listen all events
  redisClient.on('pmessage', (pattern, channel, message) => {
    message = JSON.parse(message);

    io.emit(
      channel + ':' + message.event,
      message.data,
      (send_to_self = false)
    );
  });
}

module.exports = connectRedis;
