const path = require('path');
const { s3 } = require('../config');
const { AWS_BUCKET_NAME } = process.env;

const uploadMedia = async (file, folder) => {
  const ext = path.extname(file.originalname);
  const filePath = `${folder}/` + new Date().getTime() + ext;
  const body = file.buffer;

  const data = {
    Bucket: AWS_BUCKET_NAME,
    Key: filePath,
    Body: body,
  };

  const upload = await s3.upload(data).promise();

  return {
    url: data.Key,
    mime_type: file?.mimetype?.split('/')[0],
    location: upload.Location,
  };
};

module.exports = {
  uploadMedia,
};
