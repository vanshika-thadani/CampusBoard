
const  express = require('express');
const router =  express.Router();
const {getallcars,postcarrental,deletecarrental}= require("../controller/carrental.controller");
const getCloudinaryUploader = require("../middlewares/cloudinary.multer");
const uploadCarPhoto = getCloudinaryUploader("car_rental");
const checkauth = require("../middlewares/auth.middleware")




router.get('/',checkauth,getallcars);
router.post("/", checkauth, uploadCarPhoto.single("Choosefile"), postcarrental); 

module.exports = router;
