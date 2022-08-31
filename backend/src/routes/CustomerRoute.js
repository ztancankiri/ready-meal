'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const middlewares = require('../middlewares');
const CustomerController = require('../controllers/CustomerController');
const ReservationController = require('../controllers/ReservationController');
const ReviewController = require('../controllers/ReviewController');
const PaymentController = require('../controllers/PaymentController');

// Customer Routes
router.post('/', bodyParser.json(), middlewares.trimBody, CustomerController.create);
router.get('/:customer_id', bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, CustomerController.get);
router.put('/:customer_id', bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, middlewares.trimBody, CustomerController.update);
router.delete('/:customer_id', bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, CustomerController.remove);

router.post('/login', bodyParser.json(), CustomerController.login);

// Customer Reservation Routes
const reservationRoutePath = '/:customer_id/reservation';

router.post(`${reservationRoutePath}`, bodyParser.json(), middlewares.checkAuthentication, middlewares.trimBody, ReservationController.create);
router.put(`${reservationRoutePath}/:reservation_id`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, middlewares.trimBody, ReservationController.update);
router.get(`${reservationRoutePath}/:reservation_id`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, ReservationController.get);
router.delete(`${reservationRoutePath}/:reservation_id`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, ReservationController.remove);

router.get(`${reservationRoutePath}`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, ReservationController.getByCustomerId);

router.post(`${reservationRoutePath}/:reservation_id/pay`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, PaymentController.pay);
router.post(`${reservationRoutePath}/:reservation_id/cancel`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, PaymentController.cancel_customer);
router.post(`${reservationRoutePath}/:reservation_id/refund`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, PaymentController.refund_customer);

// Restaurant Review Routes
const reviewRoutePath = '/:customer_id/review';

router.post(`${reviewRoutePath}`, bodyParser.json(), middlewares.checkAuthentication, middlewares.trimBody, ReviewController.create);

router.get(`${reviewRoutePath}`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, ReviewController.getByCustomerId);

module.exports = router;
