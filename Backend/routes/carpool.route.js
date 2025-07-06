const express = require('express');
const router = express.Router();
const { getAllCarpools,postcarpool,deletecarpool } = require('../controller/carpool.controller.js');
const checkauth = require('../middlewares/auth.middleware.js');

router.get('/',checkauth ,getAllCarpools);
router.post('/',checkauth, postcarpool);


module.exports = router;