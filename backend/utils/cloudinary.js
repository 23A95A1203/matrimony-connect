const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_secret',
});

module.exports = cloudinary;
