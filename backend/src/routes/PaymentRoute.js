'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const PaymentController = require('../controllers/PaymentController');

router.post('/webhook', bodyParser.raw({ type: 'application/json' }), PaymentController.webhook);

module.exports = router;
