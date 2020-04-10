const express = require('express');
const router = new express.Router();
const {verifyRequest, handleMessage} = require('../handler/webhookHandler');

router.get('/', verifyRequest);
router.post('/', handleMessage);

module.exports = router;
