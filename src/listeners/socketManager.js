class socketManager {
  constructor() {
    this.events = {};
    this.io = global.io;
  }

  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(callback);
  }

  emit(eventName, ...args) {
    if (eventName) {
      global.io.emit(eventName, ...args);
    }

    return;
  }

  emitSendMessage(data, roomInfo) {
    this.emit(`room.${data.room_id}:message.created`, data);
    this.emit(`room.${data.room_id}:new-message`, roomInfo);
  }

  emitReadMessage(data, userId) {
    this.emit(`room.${userId}:message.read`, data);
  }
}

module.exports = new socketManager();
