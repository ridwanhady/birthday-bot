const express = require('express');
const router = new express.Router();

router.use('/webhook', require('./webhook'));
router.use('/messages', require('./messages'));

module.exports = router;
