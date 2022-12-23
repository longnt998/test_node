const cors = require('cors');
const apiRoute = require('./api');
const Authenticate = require('../middleware/authenticate');

module.exports = (app) => {
  app.use(
    '/api/',
    cors(),
    Authenticate.authenticateUser,
    apiRoute.router
  );
};
