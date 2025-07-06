const express = require('express');
const router = express.Router(); 

const { getalllostnfound, postlostnfound, DeleteLostnfound } = require("../controller/lostnfound.controller");
const getCloudinaryUploader = require("../middlewares/cloudinary.multer");
const upload = getCloudinaryUploader("lost_and_found");
const checkauth = require("../middlewares/auth.middleware")

router.get('/', checkauth , getalllostnfound);
router.post("/",checkauth , upload.single("choosefile"), postlostnfound);


module.exports = router;