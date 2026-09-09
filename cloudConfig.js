const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({//configaration like connect from cloudinary 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({ //like folder for new files store
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlist_DEV',
    allowerdFormats: ["png", "jpg", "jpeg"],
  },
});

module.exports = {
    cloudinary,
    storage,
}