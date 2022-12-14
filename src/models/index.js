const { connectToDatabase:sequelize } = require('../config')
const Message = require('./Message')

const start = async function () {
  await sequelize.sync({force: false}).then(() => {}).catch(e => {
    console.log(e);
  });
}

start();

module.exports = {
  Message,
}
