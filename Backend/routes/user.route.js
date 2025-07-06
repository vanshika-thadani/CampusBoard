
const express = require("express");
const router = express.Router();
const {
  getuser,
  getselecteduser,
  updateuser,
  deleteUser,
  getUserResources
} = require("../controller/user.controller");
const getCloudinaryUploader = require("../middlewares/cloudinary.multer");
const uploadProfilePhoto = getCloudinaryUploader("profile_photos");

const checkauth = require("../middlewares/auth.middleware");

router.get("/", checkauth, getuser);
router.put("/", checkauth, uploadProfilePhoto.single("profilephoto"), updateuser);
router.delete("/", checkauth, deleteUser); 
router.get("/resources", checkauth, getUserResources); 
router.get("/:id", checkauth, getselecteduser);


module.exports = router;
