
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../utils/cloudinary");

/**
 * Generates a multer upload middleware with dynamic folder
 * @param {string} folderName - Cloudinary folder name
 */
const getCloudinaryUploader = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName,
      allowed_formats: ["jpg", "jpeg", "png"],
    },
  });

  return multer({ storage });
};

module.exports = getCloudinaryUploader;
