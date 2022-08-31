'use strict';

const RestaurantService = require('../services/RestaurantService');
const ReviewService = require('../services/ReviewService');
const ReservationService = require('../services/ReservationService');
const ReservationStatus = require('../models/ReservationStatusEnum');

const create = async (req, res) => {
	try {
		if (!req.body.hasOwnProperty('grade')) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body must contain a grade property'
			});
		}

		if (!req.body.hasOwnProperty('reservation_id')) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body must contain a reservation_id property'
			});
		}

		if (!req.body.hasOwnProperty('restaurant_id')) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body must contain a reservation_id property'
			});
		}

		const reservation = await ReservationService.get(req.body.reservation_id);

		if (reservation && reservation.customer_id !== req.customer_id) {
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'Failed to authenticate token.'
			});
		}

		// COMPLETED ENUM
		if (reservation.reservation_status !== ReservationStatus.COMPLETED) {
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'Reservation is not Completed.'
			});
		}

		const restaurant = await RestaurantService.get(req.body.restaurant_id);

		if (!restaurant) {
			return res.status(404).send({
				error: 'Not Found',
				message: 'Restaurant is not found!'
			});
		}

		if (await ReviewService.exists({ reservation_id: req.body.reservation_id })) {
			return res.status(409).send({
				error: 'Already Reviewed',
				message: 'Customer already reviewed the given reservation'
			});
		}

		req.body.customer_id = req.customer_id;

		const review = await ReviewService.create(req.body);
		const ratingUpdate = {
			restaurant_id: review.restaurant_id,
			rating: (restaurant.rating * restaurant.number_of_reviews + review.grade) / (restaurant.number_of_reviews + 1),
			// rating: review.grade / (restaurant.number_of_reviews + 1) + restaurant.rating,
			number_of_reviews: restaurant.number_of_reviews + 1
		};
		await RestaurantService.update(ratingUpdate);
		return res.status(201).json(review);
	} catch (err) {
		return res.status(500).json({
			error: 'Internal Server Error',
			message: err.message
		});
	}
};

const getByCustomerId = async (req, res) => {
	try {
		const reviews = await ReviewService.find({ customer_id: req.customer_id });

		if (!reviews) {
			return res.status(404).json({
				error: 'Not Found',
				message: `Reviews not found`
			});
		}

		return res.status(200).json(reviews);
	} catch (err) {
		return res.status(500).json({
			error: 'Internal Server Error',
			message: err.message
		});
	}
};

const getByRestaurantId = async (req, res) => {
	try {
		const reviews = await ReviewService.find({ restaurant_id: req.params.restaurant_id });

		if (!reviews) {
			return res.status(404).json({
				error: 'Not Found',
				message: `Reviews not found`
			});
		}

		return res.status(200).json(reviews);
	} catch (err) {
		return res.status(500).json({
			error: 'Internal Server Error',
			message: err.message
		});
	}
};

module.exports = {
	create,
	getByCustomerId,
	getByRestaurantId
};
