const cors = require('cors');
const apiRoute = require('./api');

module.exports = (app) => {
  app.use('/api/', cors(), apiRoute.router);
};
