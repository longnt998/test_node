const { Message } = require('../models')

class MessageService {
  constructor() {
    this.model = Message
  }

  async findAll() {
    let m = await this.model.findAll()

    return m
  }

  async create(req) {
    return new Promise(async (resolve, reject) => {
      if (req.files.content == undefined && req.body.content) {
        return this.createMessageWithMedia(req.body).then(data => {
            return resolve(this.createFormattedMessage(data.id));
          })
          .catch(error => {
            return reject(error);
          })
      } else if (req.body.gif) {
        const indexGif = req.body.gif.indexOf('gif/');
        req.body.type = constants.MESSAGE.TYPE_ENUMS.MEDIA;

        if (!indexGif) {
          return reject('Invalid gif url.');
        }

        const urlGif = req.body.gif.substring(indexGif);

        return await this.gif.count({
            where: {
              thumbnail: urlGif
            }
          })
          .then(async gif => {
            if (gif) {
              req.body.media = [{
                url: urlGif,
                mime_type: 'image',
              }]

              this.createMessageWithMedia(req.body)
                .then(message => {
                  return resolve(this.createFormattedMessage(message.id, req.body.gif));
                })
                .catch(error => {
                  return reject(error);
                })
            }
          })
          .catch(error => {
            return reject(error);
          });
      } else {
        const params = {
          Bucket: AWS_BUCKET_NAME,
          Key: 'chat/' + req.body.room_id + '/' + req.files.content[0].originalname,
          Body: req.files.content[0].buffer,
        }

        return s3.upload(params, async (err, s3) => {
          if (err) {
            return reject(err)
          }

          req.body.type = constants.MESSAGE.TYPE_ENUMS.MEDIA;
          req.body.media = [{
            url: params.Key,
            mime_type: req.files.content[0].mimetype.split('/')[0],
          }]

          this.createMessageWithMedia(req.body)
            .then(message => {
              return resolve(this.createFormattedMessage(message.id, s3.Location));
            })
            .catch(error => {
              return reject(error);
            })
        })
      }
    });
  }
}

module.exports = new MessageService();
