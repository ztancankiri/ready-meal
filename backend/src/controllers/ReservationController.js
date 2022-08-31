'use strict';
const RestaurantModel = require('../models/RestaurantModel');
/*
const ReservationStatus = {
	CREATED: 0,
	PENDING: 1,
	APPROVED: 2,
	CANCELLED: 3,
	REJECTED: 4,
	COMPLETED: 5
};
*/
const ReservationService = require('../services/ReservationService');
const RestaurantService = require('../services/RestaurantService');
const FoodService = require('../services/FoodService');

const create = async (req, res) => {
	try {
		if (!req.body.hasOwnProperty('restaurant_id')) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body must contain a restaurant_id property'
			});
		}

		if (!req.body.hasOwnProperty('number_of_people')) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body must contain a number_of_people property'
			});
		}
		if (!req.body.hasOwnProperty('foods') || !req.body.foods.length === 0) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body must contain a foods property'
			});
		}
		if (!req.body.hasOwnProperty('time')) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body must contain a time property'
			});
		}
		const restaurant = await RestaurantService.get(req.body.restaurant_id);
		if (!restaurant) {
			return res.status(404).json({
				error: 'Not Found',
				message: 'Restaurant not found!'
			});
		}
		for (let i = 0; i < req.body.foods.length; i++) {
			const food = req.body.foods[i];
			if (!(await FoodService.get(food._id))) {
				return res.status(404).json({
					error: 'Not Found',
					message: 'Food not found!'
				});
			}
		}
		if (!req.body.foods) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body must contain a foods property'
			});
		}

		req.body.customer_id = req.customer_id;
		req.body.discount_ratio = restaurant.discount_ratio;
		const reservation = await ReservationService.create(req.body);

		return res.status(200).json(reservation);
	} catch (error) {
		console.error(error.message);

		return res.status(500).json({
			error: 'Internal server error',
			message: error.message
		});
	}
};

const get = async (req, res) => {
	try {
		const reservation = await ReservationService.get(req.params.reservation_id);

		if (!reservation) {
			return res.status(404).json({
				error: 'Not Found',
				message: `Reservation not found`
			});
		}

		return res.status(200).json(reservation);
	} catch (err) {
		return res.status(500).json({
			error: 'Internal Server Error',
			message: err.message
		});
	}
};

const update = async (req, res) => {
	// check if the body of the request contains all necessary properties TODO:CHECK PARAMS,check customer if if its exits?
	try {
		const keys = Object.keys(req.body);
		if (keys.length === 0) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body is empty'
			});
		}

		for (let index = 0; index < keys.length; index++) {
			const element = keys[index];
			if (element === 'table_number') {
				if (!req.is_restaurant) {
					return res.status(401).send({
						error: 'Unauthorized',
						message: 'You are not a restaurant'
					});
				} else {
					const restaurant = await RestaurantService.get(req.restaurant_id);
					if (req.body.table_number < restaurant.number_of_tables && req.body.table_number > restaurant.number_of_tables) {
						return res.status(400).json({
							error: 'Bad Request',
							message: "Table number is not in the range of restaurant's number of table."
						});
					}
				}
			} else if (element !== 'reservation_status') {
				return res.status(400).json({
					error: 'Bad Request',
					message: 'Only reservation status can be updated!'
				});
			}
		}

		if (req.is_restaurant) {
			req.body.restaurant_id = req.restaurant_id;
		} else {
			req.body.customer_id = req.customer_id;
		}

		req.body.reservation_id = req.params.reservation_id;

		const reservation = await ReservationService.update(req.body);

		if (!reservation) {
			return res.status(401).send({
				error: 'Unauthorized',
				message: 'Failed to authenticate token.'
			});
		}
		return res.status(200).json(reservation);
	} catch (error) {
		console.error(error.message);

		return res.status(500).json({
			error: 'Internal server error',
			message: error.message
		});
	}
};

const remove = async (req, res) => {
	return res.status(404).json({ message: 'Reservation removal is not possible at the moment.' });
};

const getByRestaurantId = async (req, res) => {
	try {
		if (!(await ReservationService.exists({ restaurant_id: req.params.restaurant_id }))) {
			return res.status(404).send({
				error: 'Not exist',
				message: 'Model with given id does not exist'
			});
		}

		let reservations = await ReservationService.find({ restaurant_id: req.params.restaurant_id });

		if (!reservations) {
			return res.status(404).json({
				error: 'Not Found',
				message: `Reservations not found`
			});
		}

		return res.status(200).json(reservations);
	} catch (err) {
		return res.status(500).json({
			error: 'Internal Server Error',
			message: err.message
		});
	}
};

const getByCustomerId = async (req, res) => {
	try {
		if (!(await ReservationService.exists({ customer_id: req.params.customer_id }))) {
			return res.status(404).send({
				error: 'Not exist',
				message: 'Model with given id does not exist'
			});
		}
		let reservations = await ReservationService.find({ customer_id: req.params.customer_id });

		if (!reservations) {
			return res.status(404).json({
				error: 'Not Found',
				message: `Reservations not found`
			});
		}

		return res.status(200).json(reservations);
	} catch (err) {
		return res.status(500).json({
			error: 'Internal Server Error',
			message: err.message
		});
	}
};

module.exports = {
	create,
	get,
	update,
	remove,
	getByRestaurantId,
	getByCustomerId
};
