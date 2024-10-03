class CloudinaryService {
  static async uploadImage(file) {
    const cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uri = `data:${file.mimetype};base64,${file.buffer.toString(
      "base64"
    )}`;

    return await cloudinary.uploader.upload(uri);
  }
}

module.exports = CloudinaryService;
