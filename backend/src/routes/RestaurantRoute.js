'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const middlewares = require('../middlewares');
const RestaurantController = require('../controllers/RestaurantController');
const FoodController = require('../controllers/FoodController');
const ReservationController = require('../controllers/ReservationController');
const ReviewController = require('../controllers/ReviewController');
const PaymentController = require('../controllers/PaymentController');

// Restaurant Routes
router.post('/', bodyParser.json({ limit: '10mb' }), middlewares.trimBody, RestaurantController.create);
router.get('/:restaurant_id', bodyParser.json(), middlewares.checkIdValidity, RestaurantController.get);
router.put('/:restaurant_id', bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, middlewares.trimBody, RestaurantController.update);
router.delete('/:restaurant_id', bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, RestaurantController.remove);

router.get('/', bodyParser.json(), RestaurantController.getAll);

router.post('/login', bodyParser.json(), RestaurantController.login);

// Restaurant Food Routes
const foodRoutePath = '/:restaurant_id/food';

router.post(`${foodRoutePath}`, bodyParser.json({ limit: '10mb' }), middlewares.checkAuthentication, middlewares.checkIdValidity, middlewares.trimBody, FoodController.create);
router.get(`${foodRoutePath}/:food_id`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, FoodController.get);
router.put(`${foodRoutePath}/:food_id`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, middlewares.trimBody, FoodController.update);
router.delete(`${foodRoutePath}/:food_id`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, FoodController.remove);

router.get(`${foodRoutePath}`, bodyParser.json(), middlewares.checkIdValidity, FoodController.getByRestaurantId);

// Restaurant Reservation Routes
const reservationRoutePath = '/:restaurant_id/reservation';

router.put(`${reservationRoutePath}/:reservation_id`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, middlewares.trimBody, ReservationController.update);
router.get(`${reservationRoutePath}/:reservation_id`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, ReservationController.get);
router.delete(`${reservationRoutePath}/:reservation_id`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, ReservationController.remove);

router.get(`${reservationRoutePath}`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, ReservationController.getByRestaurantId);

router.post(`${reservationRoutePath}/:reservation_id/capture`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, PaymentController.capture);
router.post(`${reservationRoutePath}/:reservation_id/cancel`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, PaymentController.cancel_restaurant);
router.post(`${reservationRoutePath}/:reservation_id/refund`, bodyParser.json(), middlewares.checkAuthentication, middlewares.checkIdValidity, PaymentController.refund_restaurant);

// Restaurant Review Routes
const reviewRoutePath = '/:restaurant_id/review';

router.get(`${reviewRoutePath}`, bodyParser.json(), middlewares.checkIdValidity, ReviewController.getByRestaurantId);

// Restaurant Photo Route
const photoRoutePath = '/:restaurant_id/photo';

router.post(`${photoRoutePath}`, bodyParser.json({ limit: '10mb' }), middlewares.trimBody, RestaurantController.createPhoto);
router.get(`${photoRoutePath}`, middlewares.checkIdValidity, RestaurantController.getPhoto);

// Restaurant Food Photo Route
const foodPhotoRoutePath = '/:restaurant_id/food/:food_id/photo';

router.post(`${foodPhotoRoutePath}`, bodyParser.json({ limit: '10mb' }), middlewares.checkAuthentication, middlewares.checkIdValidity, middlewares.trimBody, FoodController.createPhoto);
router.get(`${foodPhotoRoutePath}`, middlewares.checkIdValidity, FoodController.getPhoto);

module.exports = router;
