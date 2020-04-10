const express = require('express');
const router = new express.Router();
const messageHandler = require('../handler/messageHandler');

router.get('/', messageHandler.listOfMessages);
router.get('/:messageId', messageHandler.retrieveMessageById);
router.delete('/:messageId', messageHandler.deleteMessageById);

module.exports = router;
