const express = require('express');
const router = new express.Router();

router.use('/webhook', require('./webhook'));

module.exports = router;
