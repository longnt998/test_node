const Sequelize = require('sequelize');
const {
  DB_CONNECTION,
  DB_HOST,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
  DB_PORT,
} = process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_CONNECTION,
  logging: false,
});

module.exports = sequelize;
