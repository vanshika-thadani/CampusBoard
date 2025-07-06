const express = require('express')
const router = express.Router();
const {getallprojects,postproject,deleteProject}= require('../controller/projects.controller');
const checkauth = require("../middlewares/auth.middleware")

router.get('/',checkauth ,getallprojects)
router.post('/',checkauth,postproject);


module.exports = router;