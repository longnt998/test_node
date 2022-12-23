require('dotenv').config();

const axios = require('axios');
const { LARAVEL_URL } = process.env;
const { RoomUser } = require('../models/index');

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

    await axios
      .get(url, options)
      .then((response) => {
        req.user = response.data.data;

        return next();
      })
      .catch((error) => {
        return res.status(401).json({
          error: 'Permission denied.',
        });
      });
  }

  async authenticateRoom(req, res, next) {
    const auth = await RoomUser.checkAuthenticate(req.body?.room_id, req.user.id)

    if (auth) {
      req.room_id = req.body.room_id

      return next()
    }

    return res.status(401).json({
      error: 'Permission denied.',
    });
  }
}

module.exports = new Authenticate();
