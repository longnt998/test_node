require('dotenv').config();

const axios = require('axios');
const { LARAVEL_URL } = process.env;
const { Room } = require('../models/index');

class Authenticate {
  async authenticateUser(req, res, next) {
    const { authorization } = req.headers;
    const url = `${LARAVEL_URL}/api/user/profile`;

    if (!authorization) {
      return res.status(401).json({
        error: `Invalid value 'undefined' for header 'Authorization'.`,
      });
    }

    const options = {
      headers: {
        Authorization: authorization,
      },
    };
    console.log(123);
    return

    await axios
      .get(url, options)
      .then((response) => {
        console.log("response", response)
        return
        req.user = response.data.data;

        return next();
      })
      .catch((error) => {
        logger.error(error);

        return res.status(401).json({
          error: 'Permission denied.',
        });
      });
  }

  async authenticateRoom(req, res, next) {
    await Room.checkAuthorization(req).then((room) => {
      if (!room) {
        return res.status(403).json({
          error: 'You are not authorized to send message to this room.',
        });
      } else {
        req.room = room;

        return next();
      }
    });
  }
}

module.exports = new Authenticate();
