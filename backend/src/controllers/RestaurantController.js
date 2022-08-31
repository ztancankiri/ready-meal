'use strict';

const path = require('path');

const RestaurantService = require('../services/RestaurantService');
const UploadService = require('../services/UploadService');

const create = async (req, res) => {
	try {
		if (req.body && Object.keys(req.body).length === 0) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body is empty'
			});
		}
		if (await RestaurantService.exists({ email: req.body.email })) {
			return res.status(409).send({
				error: 'Email Already Registered',
				message: 'This Email already registered to the system.'
			});
		}

		const requiredFields = ['email', 'password', 'phone_number', 'address_street', 'address_number', 'address_code', 'address_city', 'photo', 'restaurant_name', 'number_of_tables'];
		for (let i = 0; i < requiredFields.length; i++) {
			if (!req.body.hasOwnProperty(requiredFields[i])) {
				return res.status(400).json({
					error: 'Bad Request',
					message: `The request body must contain ${requiredFields[i]}!`
				});
			}
		}

		const restaurant = await RestaurantService.create(req.body);
		return res.status(200).json(restaurant);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			error: 'Internal server error',
			message: error.message
		});
	}
};

const update = async (req, res) => {
	try {
		// check if the body of the request contains all necessary properties TODO:CHECK PARAMS
		if (req.body && Object.keys(req.body).length === 0) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body is empty'
			});
		}

		req.body.restaurant_id = req.restaurant_id;
		const restaurant = await RestaurantService.update(req.body);
		if (restaurant) {
			return res.status(200).json(restaurant);
		} else {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'Restaurant is Empty'
			});
		}
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
		const restaurant = await RestaurantService.get(req.params.restaurant_id);

		if (!restaurant) {
			console.error(`Restaurant not found`);
			return res.status(404).json({
				error: 'Not Found',
				message: `Restaurant not found`
			});
		}
		return res.status(200).json(restaurant);
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({
			error: 'Internal Server Error',
			message: error.message
		});
	}
};

const remove = async (req, res) => {
	return res.status(404).json({ message: 'Restaurant removal is not possible at the moment.' });
};

const getAll = async (req, res) => {
	try {
		const restaurants = await RestaurantService.find();

		if (!restaurants || restaurants.length === 0) {
			console.error(`No restaurants!`);
			return res.status(404).json({
				error: 'Not Found',
				message: `No restaurants!`
			});
		}
		for (let i = 0; i < restaurants.length; i++) {
			restaurants[i].password = undefined;
		}
		return res.status(200).json(restaurants);
	} catch (error) {
		console.error(error.message);
		return res.status(500).json({
			error: 'Internal Server Error',
			message: error.message
		});
	}
};

const login = async (req, res) => {
	try {
		if (!req.body.hasOwnProperty('email')) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body must contain a email property'
			});
		}

		if (!req.body.hasOwnProperty('password')) {
			return res.status(400).json({
				error: 'Bad Request',
				message: 'The request body must contain a password property'
			});
		}

		const token = await RestaurantService.login(req.body.email, req.body.password);
		if (token) {
			return res.status(200).json({ token });
		} else {
			return res.status(404).json({
				error: 'Restaurant Not Found',
				message: 'Restaurant Not Found'
			});
		}
	} catch (err) {
		return res.status(500).json({
			error: 'Internal Server Error',
			message: err.message
		});
	}
};

const createPhoto = async (req, res) => {
	try {
		req.body.path = process.env.PUBLIC_RESTAURANT_DIRECTORY;
		req.body.filename = req.params.restaurant_id;
		const path = await UploadService.upload(req.body);
		return res.status(200).json({ path });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const getPhoto = async (req, res) => {
	res.sendFile(
		`${req.params.restaurant_id}.jpg`,
		{
			root: path.resolve(`${__dirname}/../../${process.env.PUBLIC_RESTAURANT_DIRECTORY}`),
			dotfiles: 'deny'
		},
		error => {
			if (error) {
				return res.status(404).send({
					error: 'Not exist',
					message: 'Photo does not exist!'
				});
			}
		}
	);
};

module.exports = {
	create,
	update,
	get,
	remove,
	getAll,
	login,
	createPhoto,
	getPhoto
};
