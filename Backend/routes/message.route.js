const express = require('express');
const router = express.Router();

const { getPublicMessages, 
        sendPublicMessages, 
        getPrivateMessages, 
        sendPrivateMessages,
        getUserConversations } = require("../controller/message.controller.js");
const checkAuth = require('../middlewares/auth.middleware.js');
// const { upload } = require("../middlewares/multerConfig.js");

router.get('/public', checkAuth, getPublicMessages);
router.post('/public', checkAuth, sendPublicMessages);

router.get('/dm/:userId', checkAuth, getPrivateMessages);
router.post('/dm/:receiverId', checkAuth, sendPrivateMessages);

router.get("/conversations", checkAuth, getUserConversations);

module.exports = router;